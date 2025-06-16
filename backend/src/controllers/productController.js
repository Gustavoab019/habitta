import Product from '../models/Product.js';

// @desc    Obter todos os produtos
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Filtros e paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Construir query
    let query = { isActive: true };

    // Filtro por categoria
    if (req.query.category && req.query.category !== 'todos') {
      query.category = req.query.category;
    }

    // Filtro por pesquisa
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filtro por preço
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Filtro por popularidade
    if (req.query.popular === 'true') {
      query.isPopular = true;
    }

    // Filtro por disponibilidade
    if (req.query.inStock === 'true') {
      query.inStock = true;
    }

    // Ordenação
    let sort = {};
    switch (req.query.sort) {
      case 'price_asc':
        sort.price = 1;
        break;
      case 'price_desc':
        sort.price = -1;
        break;
      case 'rating':
        sort['stats.rating.average'] = -1;
        break;
      case 'popular':
        sort.isPopular = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    // Executar query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Contar total para paginação
    const total = await Product.countDocuments(query);

    // Incrementar views para produtos retornados
    const productIds = products.map(p => p._id);
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $inc: { 'stats.views': 1 } }
    );

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        total
      },
      data: {
        products
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter produtos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Obter produto por ID ou slug
// @route   GET /api/products/:identifier
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Procurar por ID ou slug
    const query = identifier.match(/^[0-9a-fA-F]{24}$/) 
      ? { _id: identifier }
      : { slug: identifier };

    const product = await Product.findOne({
      ...query,
      isActive: true
    }).select('-__v');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produto não encontrado'
      });
    }

    // Incrementar visualizações
    await Product.findByIdAndUpdate(product._id, {
      $inc: { 'stats.views': 1 }
    });

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter produto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Obter produtos por categoria
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isActive: true };
    
    if (category !== 'todos') {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ isPopular: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        total
      },
      data: {
        products
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter produtos por categoria:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Obter produtos populares
// @route   GET /api/products/popular
// @access  Public
export const getPopularProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const products = await Product.find({
      isActive: true,
      isPopular: true
    })
      .sort({ 'stats.rating.average': -1, 'stats.sales': -1 })
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('❌ Erro ao obter produtos populares:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Pesquisar produtos
// @route   GET /api/products/search/:query
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query || query.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Query de pesquisa deve ter pelo menos 2 caracteres'
      });
    }

    const searchQuery = {
      isActive: true,
      $or: [
        { $text: { $search: query } },
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { material: { $regex: query, $options: 'i' } },
        { hotelPartner: { $regex: query, $options: 'i' } }
      ]
    };

    const products = await Product.find(searchQuery)
      .sort({ score: { $meta: 'textScore' }, isPopular: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Product.countDocuments(searchQuery);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        total
      },
      query,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('❌ Erro na pesquisa de produtos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Criar novo produto
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    console.log(`🛍️  Novo produto criado: ${product.name}`);

    res.status(201).json({
      status: 'success',
      message: 'Produto criado com sucesso',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message).join(', ');
      return res.status(400).json({
        status: 'error',
        message
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Produto com este slug já existe'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};

// @desc    Atualizar produto
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produto não encontrado'
      });
    }

    console.log(`📝 Produto atualizado: ${product.name}`);

    res.status(200).json({
      status: 'success',
      message: 'Produto atualizado com sucesso',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    
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

// @desc    Eliminar produto
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Produto não encontrado'
      });
    }

    // Soft delete - apenas desativar
    product.isActive = false;
    await product.save();

    console.log(`🗑️  Produto desativado: ${product.name}`);

    res.status(200).json({
      status: 'success',
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao eliminar produto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor'
    });
  }
};