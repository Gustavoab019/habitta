import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Proteger rotas - verificar JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se token existe no header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Verificar se token existe nos cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Acesso negado. Token não fornecido.'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verificar se utilizador ainda existe
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Utilizador não encontrado'
        });
      }

      // Verificar se utilizador está ativo
      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'Conta desativada'
        });
      }

      // Adicionar utilizador ao request
      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        });
      }

      return res.status(401).json({
        status: 'error',
        message: 'Token inválido'
      });
    }
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// Autorizar roles específicas
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Utilizador não autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado. Permissões insuficientes.'
      });
    }

    next();
  };
};

// Middleware opcional - não falha se não houver token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (jwtError) {
        // Ignorar erros de JWT em auth opcional
        console.log('Token inválido em auth opcional:', jwtError.message);
      }
    }

    next();
  } catch (error) {
    console.error('❌ Erro na autenticação opcional:', error);
    next(); // Continuar mesmo com erro
  }
};

// Verificar se é o próprio utilizador ou admin
export const ownerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Utilizador não autenticado'
    });
  }

  const isOwner = req.user._id.toString() === req.params.userId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Acesso negado. Só pode aceder aos seus próprios dados.'
    });
  }

  next();
};