import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Informações básicas
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxLength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxLength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  fullDescription: {
    type: String,
    maxLength: [2000, 'Descrição completa não pode ter mais de 2000 caracteres']
  },

  // Categoria e classificação
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['quartos', 'salas', 'blackout', 'voil', 'linho', 'termico', 'sheer']
  },
  subcategory: String,
  hotelPartner: {
    type: String,
    required: [true, 'Parceiro hoteleiro é obrigatório']
  },

  // Preços
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Preço original não pode ser negativo']
  },
  priceUnit: {
    type: String,
    enum: ['metro', 'unidade', 'm2'],
    default: 'metro'
  },

  // Material e especificações
  material: {
    type: String,
    required: [true, 'Material é obrigatório']
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: {
    composition: String,
    weight: String,
    width: String,
    maintenance: String,
    fireResistant: {
      type: Boolean,
      default: false
    },
    antimicrobial: {
      type: Boolean,
      default: false
    },
    uvProtection: {
      type: Boolean,
      default: false
    }
  },

  // Dimensões e limites
  dimensions: {
    minWidth: {
      type: Number,
      default: 50 // cm
    },
    maxWidth: {
      type: Number,
      default: 500 // cm
    },
    minHeight: {
      type: Number,
      default: 100 // cm
    },
    maxHeight: {
      type: Number,
      default: 350 // cm
    }
  },

  // Cores disponíveis
  colors: [{
    name: {
      type: String,
      required: true
    },
    code: String, // Código hexadecimal
    image: String // URL da imagem da cor
  }],

  // Imagens
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],

  // Status e disponibilidade
  isActive: {
    type: Boolean,
    default: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },

  // Estatísticas
  stats: {
    views: {
      type: Number,
      default: 0
    },
    sales: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },

  // Preços adicionais
  additionalPrices: {
    sheer: {
      type: Number,
      default: 89 // €/m²
    },
    expressInstallation: {
      type: Number,
      default: 150 // € fixo
    },
    wallMounting: {
      type: Number,
      default: 50 // € fixo
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para URL da imagem principal
productSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg ? mainImg.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual para preço com desconto
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Middleware para gerar slug automaticamente
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/[\s_-]+/g, '-') // Substitui espaços e underscores por hífens
      .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
  }
  next();
});

// Índices para performance e pesquisa
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, inStock: 1 });
productSchema.index({ isPopular: -1 });
productSchema.index({ 'stats.rating.average': -1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Índice de texto para pesquisa
productSchema.index({
  name: 'text',
  description: 'text',
  material: 'text',
  hotelPartner: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product;