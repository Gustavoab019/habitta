import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Criar novo pedido
// @route   POST /api/orders
// @access  Public (permite pedidos de convidados)
export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      customerInfo,
      items,
      deliveryAddress,
      scheduling,
      payment,
      totals,
      notes
    } = req.body;

    // Validar items e calcular preços
    const processedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      // Verificar se produto existe
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          status: 'error',
          message: `Produto ${item.product} não encontrado`
        });
      }

      // Calcular área e preço
      const area = (item.measurements.width / 100) * (item.measurements.height / 100) * item.measurements.panels;
      let itemPrice = product.price * area;

      // Aplicar configurações extras
      if (item.configuration.includeSheer) {
        itemPrice += area * (product.additionalPrices?.sheer || 89);
      }
      if (item.configuration.installationType === 'express') {
        itemPrice += product.additionalPrices?.expressInstallation || 150;
      }
      if (item.configuration.mounting === 'wall') {
        itemPrice += product.additionalPrices?.wallMounting || 50;
      }

      const processedItem = {
        product: product._id,
        productSnapshot: {
          name: product.name,
          price: product.price,
          material: product.material,
          hotelPartner: product.hotelPartner,
          images: product.images.map(img => img.url)
        },
        measurements: {
          ...item.measurements,
          area
        },
        configuration: item.configuration,
        unitPrice: product.price,
        quantity: item.quantity || 1,
        totalPrice: itemPrice * (item.quantity || 1)
      };

      processedItems.push(processedItem);
      calculatedSubtotal += processedItem.totalPrice;
    }

    // Validar totais
    const calculatedTotals = {
      subtotal: calculatedSubtotal,
      shippingCost: totals.shippingCost || 0,
      installationCost: totals.installationCost || 0,
      discount: totals.discount || 0,
      tax: totals.tax || 0,
      total: calculatedSubtotal + (totals.shippingCost || 0) + (totals.installationCost || 0) - (totals.discount || 0) + (totals.tax || 0)
    };

    // Criar pedido
    const orderData = {
      customer: customer || undefined,
      customerInfo,
      items: processedItems,
      deliveryAddress,
      scheduling,
      payment: {
        ...payment,
        status: 'pending'
      },
      totals: calculatedTotals,
      notes,
      status: 'pending_payment'
    };

    const order = await Order.create(orderData);

    // Popular produto para resposta
    await order.populate('items.product', 'name slug images');

    console.log(`📦 Novo pedido criado: ${order.orderNumber}`);

    res.status(201).json({
      status: 'success',
      message: 'Pedido criado com sucesso',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.totals.total,
          items: order.items,
          customerInfo: order.customerInfo,
          createdAt: order.createdAt
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    
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

// @desc    Obter pedidos do utilizador logado
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'name slug images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ customer: req.user.id });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        total
      },
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter pedidos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Obter pedido específico
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Procurar por ID ou orderNumber
    const query = id.match(/^[0-9a-fA-F]{24}$/) 
      ? { _id: id }
      : { orderNumber: id };

    const order = await Order.findOne(query)
      .populate('items.product', 'name slug images material hotelPartner')
      .populate('customer', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Pedido não encontrado'
      });
    }

    // Verificar se utilizador pode aceder a este pedido
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' && 
        order.customer?.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter pedido:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Atualizar status do pedido
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = [
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
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status inválido'
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Pedido não encontrado'
      });
    }

    // Atualizar status
    order.status = status;
    
    // Adicionar ao histórico
    order.statusHistory.push({
      status,
      date: new Date(),
      notes,
      updatedBy: req.user.id
    });

    await order.save();

    console.log(`📊 Status do pedido ${order.orderNumber} atualizado para: ${status}`);

    res.status(200).json({
      status: 'success',
      message: 'Status atualizado com sucesso',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          statusHistory: order.statusHistory
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Obter todos os pedidos (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Filtros
    let query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      query.createdAt = {};
      if (req.query.dateFrom) query.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) query.createdAt.$lte = new Date(req.query.dateTo);
    }

    // Ordenação
    let sort = { createdAt: -1 };
    if (req.query.sort === 'total_desc') sort = { 'totals.total': -1 };
    if (req.query.sort === 'total_asc') sort = { 'totals.total': 1 };

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: orders.length,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        total
      },
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter todos os pedidos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Cancelar pedido
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Pedido não encontrado'
      });
    }

    // Verificar se utilizador pode cancelar este pedido
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' && 
        order.customer?.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado'
      });
    }

    // Verificar se pedido pode ser cancelado
    const cancellableStatuses = ['pending_payment', 'payment_confirmed', 'measurement_scheduled'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Pedido não pode ser cancelado neste estado'
      });
    }

    // Cancelar pedido
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      date: new Date(),
      notes: reason || 'Cancelado pelo cliente',
      updatedBy: req.user.id
    });

    await order.save();

    console.log(`❌ Pedido ${order.orderNumber} cancelado`);

    res.status(200).json({
      status: 'success',
      message: 'Pedido cancelado com sucesso',
      data: {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao cancelar pedido:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};