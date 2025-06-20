import express from 'express';
import authRoutes from './auth.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';
import userRoutes from './users.js';
import adminOrderRoutes from './adminOrders.js';

const router = express.Router();

// Welcome message
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Bem-vindo à API Habitta! 🏠✨',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      adminOrders: '/api/admin/orders',
      users: '/api/users'
    }
  });
});

// Route definitions
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/admin/orders', adminOrderRoutes);

export default router;
