import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  // Informações básicas
  name: {
    type: String,
    required: [true, 'Nome da categoria é obrigatório'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxLength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },

  // Hierarquia
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },

  // Visual
  image: {
    url: String,
    alt: String
  },
  icon: String, // Nome do ícone (ex: 'bed', 'sofa')
  color: String, // Cor hex para a categoria

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVisible: {
    type: Boolean,
    default: true
  },

  // Ordenação
  sortOrder: {
    type: Number,
    default: 0
  },

  // Estatísticas
  stats: {
    productCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para subcategorias
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual para produtos desta categoria
categorySchema.virtual('products', {
  ref: 'Product',
  localField: 'slug',
  foreignField: 'category'
});

// Middleware para gerar slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Índices
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, isVisible: 1 });
categorySchema.index({ sortOrder: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;