import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Identificação do pedido
  orderNumber: {
    type: String,
    unique: true
    // Removido required: true porque será gerado automaticamente
  },
  
  // Cliente (pode ser registado ou guest)
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Permite pedidos de convidados
  },
  
  // Dados do cliente (para pedidos de convidados ou backup)
  customerInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    nif: String,
    company: String
  },

  // Items do pedido
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    // Snapshot dos dados do produto no momento da compra
    productSnapshot: {
      name: String,
      price: Number,
      material: String,
      hotelPartner: String,
      images: [String]
    },
    // Medidas específicas
    measurements: {
      width: {
        type: Number,
        required: true,
        min: [50, 'Largura mínima: 50cm']
      },
      height: {
        type: Number,
        required: true,
        min: [100, 'Altura mínima: 100cm']
      },
      panels: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      area: {
        type: Number,
        required: true
      }
    },
    // Configurações
    configuration: {
      color: String,
      installationType: {
        type: String,
        enum: ['professional', 'express', 'self'],
        default: 'professional'
      },
      mounting: {
        type: String,
        enum: ['ceiling', 'wall'],
        default: 'ceiling'
      },
      includeSheer: {
        type: Boolean,
        default: false
      }
    },
    // Preços
    unitPrice: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],

  // Endereço de entrega/instalação
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true,
      match: [/^[0-9]{4}-[0-9]{3}$/, 'Código postal deve ter formato 0000-000']
    },
    district: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Portugal'
    },
    notes: String
  },

  // Agendamentos
  scheduling: {
    measurementDate: {
      requested: Date,
      confirmed: Date,
      completed: Date
    },
    installationDate: {
      requested: Date,
      confirmed: Date,
      completed: Date
    },
    availableTimeSlots: [String], // ['09:00-12:00', '14:00-17:00']
    notes: String
  },

  // Status do pedido
  status: {
    type: String,
    enum: [
      'pending_payment',
      'payment_confirmed', 
      'measurement_scheduled',
      'measurement_completed',
      'in_production',
      'ready_for_delivery',
      'delivery_scheduled',
      'installation_scheduled',
      'installation_completed',
      'completed',
      'cancelled',
      'refunded'
    ],
    default: 'pending_payment'
  },

  // Histórico de estados
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Informações de pagamento
  payment: {
    method: {
      type: String,
      enum: ['card', 'mbway', 'transfer', 'multibanco'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    stripePaymentIntentId: String,
    transactionId: String,
    paidAt: Date,
    installments: {
      type: Number,
      default: 1,
      min: 1,
      max: 12
    }
  },

  // Totais
  totals: {
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    installationCost: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },

  // Códigos promocionais
  coupon: {
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },

  // Notas e observações
  notes: {
    customer: String,
    internal: String
  },

  // Arquivos e documentos
  documents: [{
    type: {
      type: String,
      enum: ['invoice', 'receipt', 'measurement_report', 'installation_photos']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Avaliação do cliente
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    photos: [String],
    createdAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para número de items
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual para área total
orderSchema.virtual('totalArea').get(function() {
  return this.items.reduce((total, item) => total + item.measurements.area, 0);
});

// Função para gerar número de pedido único
const generateOrderNumber = async () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Encontrar o último pedido do mês para incrementar
  const lastOrder = await mongoose.model('Order').findOne({
    orderNumber: { $regex: `^HBT${year}${month}` }
  }).sort({ orderNumber: -1 });
  
  let sequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
    sequence = lastSequence + 1;
  }
  
  return `HBT${year}${month}${sequence.toString().padStart(4, '0')}`;
};

// Middleware para gerar número do pedido ANTES de salvar
orderSchema.pre('save', async function(next) {
  // Só gerar se for um documento novo e não tiver orderNumber
  if (this.isNew && !this.orderNumber) {
    try {
      this.orderNumber = await generateOrderNumber();
    } catch (error) {
      console.error('Erro ao gerar orderNumber:', error);
      // Fallback simples em caso de erro
      const timestamp = Date.now().toString().slice(-6);
      this.orderNumber = `HBT${timestamp}`;
    }
  }
  next();
});

// Middleware para atualizar histórico de status
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      date: new Date()
    });
  }
  next();
});

// Índices
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;