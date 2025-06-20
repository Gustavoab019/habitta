import axios from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('habitta_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se token expirou, remover e redirecionar para login
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      localStorage.removeItem('habitta_token');
      localStorage.removeItem('habitta_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// === AUTH SERVICES ===

export const authAPI = {
  // Registar utilizador
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    // Guardar token e dados do utilizador
    if (response.data.token) {
      localStorage.setItem('habitta_token', response.data.token);
      localStorage.setItem('habitta_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // Guardar token e dados do utilizador
    if (response.data.token) {
      localStorage.setItem('habitta_token', response.data.token);
      localStorage.setItem('habitta_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Remover dados locais independentemente da resposta
      localStorage.removeItem('habitta_token');
      localStorage.removeItem('habitta_user');
    }
  },

  // Obter perfil atual
  getProfile: async () => {
    const response = await api.get('/auth/me');
    
    // Atualizar dados do utilizador no localStorage
    localStorage.setItem('habitta_user', JSON.stringify(response.data.data.user));
    
    return response.data;
  },

  // Atualizar perfil
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    
    // Atualizar dados do utilizador no localStorage
    localStorage.setItem('habitta_user', JSON.stringify(response.data.data.user));
    
    return response.data;
  },

  // Alterar password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }
};

// === PRODUCTS SERVICES ===

export const productsAPI = {
  // Obter todos os produtos
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Obter produto por ID ou slug
  getProduct: async (identifier) => {
    const response = await api.get(`/products/${identifier}`);
    return response.data;
  },

  // Obter produtos por categoria
  getProductsByCategory: async (category, params = {}) => {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },

  // Obter produtos populares
  getPopularProducts: async (limit = 6) => {
    const response = await api.get('/products/popular', { params: { limit } });
    return response.data;
  },

  // Pesquisar produtos
  searchProducts: async (query, params = {}) => {
    const response = await api.get(`/products/search/${encodeURIComponent(query)}`, { params });
    return response.data;
  },

  // Criar produto (Admin)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Atualizar produto (Admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Eliminar produto (Admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// === ORDERS SERVICES ===

export const ordersAPI = {
  // Criar pedido
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Obter pedidos do utilizador
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },

  // Obter pedido específico
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancelar pedido
  cancelOrder: async (orderId, reason) => {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Admin: Obter todos os pedidos
  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Admin: Atualizar status do pedido
  updateOrderStatus: async (orderId, status, notes) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, {
      status,
      notes
    });
    return response.data;
  }
};

// === UTILITY FUNCTIONS ===

export const apiUtils = {
  // Verificar se utilizador está logado
  isAuthenticated: () => {
    return !!localStorage.getItem('habitta_token');
  },

  // Obter dados do utilizador do localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('habitta_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Obter token
  getToken: () => {
    return localStorage.getItem('habitta_token');
  },

  // Limpar dados de autenticação
  clearAuth: () => {
    localStorage.removeItem('habitta_token');
    localStorage.removeItem('habitta_user');
  }
};

// Exportar instância do axios para uso direto se necessário
export default api;