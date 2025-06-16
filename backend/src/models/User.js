import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Informações pessoais
  firstName: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxLength: [50, 'Nome não pode ter mais de 50 caracteres']
  },
  lastName: {
    type: String,
    required: [true, 'Apelido é obrigatório'],
    trim: true,
    maxLength: [50, 'Apelido não pode ter mais de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, insira um email válido'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    match: [/^(\+351|00351)?[0-9]{9}$/, 'Por favor, insira um telefone português válido']
  },
  password: {
    type: String,
    required: [true, 'Password é obrigatória'],
    minLength: [6, 'Password deve ter pelo menos 6 caracteres'],
    select: false // Não incluir password nas queries por defeito
  },

  // Informações opcionais
  nif: {
    type: String,
    sparse: true, // Permite nulls únicos
    match: [/^[0-9]{9}$/, 'NIF deve ter 9 dígitos']
  },
  company: {
    type: String,
    trim: true,
    maxLength: [100, 'Nome da empresa não pode ter mais de 100 caracteres']
  },

  // Endereço principal
  address: {
    street: String,
    city: String,
    postalCode: {
      type: String,
      match: [/^[0-9]{4}-[0-9]{3}$/, 'Código postal deve ter formato 0000-000']
    },
    district: String,
    country: {
      type: String,
      default: 'Portugal'
    }
  },

  // Role e permissões
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager'],
    default: 'customer'
  },

  // Status da conta
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,

  // Tokens para reset password e verificação de email
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,

  // Preferências
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    language: {
      type: String,
      enum: ['pt', 'en'],
      default: 'pt'
    }
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para nome completo
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware para hash da password antes de salvar
userSchema.pre('save', async function(next) {
  // Só fazer hash se a password foi modificada
  if (!this.isModified('password')) return next();

  // Hash da password com salt de 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para gerar token de reset de password
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  
  return resetToken;
};

// Índices para performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ nif: 1 }, { sparse: true });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;