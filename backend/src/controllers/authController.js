import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Gerar JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Gerar refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

// Enviar response com token
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      status: 'success',
      token,
      refreshToken,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
};

// @desc    Registar novo utilizador
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, nif, company } = req.body;

    // Verificar se utilizador já existe
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: existingUser.email === email 
          ? 'Email já está registado' 
          : 'Telefone já está registado'
      });
    }

    // Criar utilizador
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      nif,
      company
    });

    console.log(`👤 Novo utilizador registado: ${user.email}`);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('❌ Erro no registo:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        status: 'error',
        message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Login utilizador
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça email e password'
      });
    }

    // Verificar se utilizador existe e incluir password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciais inválidas'
      });
    }

    // Verificar se conta está ativa
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Conta desativada. Contacte o suporte.'
      });
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    console.log(`🔑 Login realizado: ${user.email}`);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Logout utilizador
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logout realizado com sucesso'
  });
};

// @desc    Obter utilizador atual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilizador não encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          nif: user.nif,
          company: user.company,
          address: user.address,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          preferences: user.preferences,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter utilizador:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Atualizar perfil do utilizador
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'nif', 'company', 
      'address', 'preferences'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilizador não encontrado'
      });
    }

    console.log(`📝 Perfil atualizado: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Perfil atualizado com sucesso',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          nif: user.nif,
          company: user.company,
          address: user.address,
          preferences: user.preferences
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        status: 'error',
        message
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Alterar password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor, forneça a password atual e a nova password'
      });
    }

    // Obter utilizador com password
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Password atual incorreta'
      });
    }

    user.password = newPassword;
    await user.save();

    console.log(`🔐 Password alterada: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password alterada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao alterar password:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};