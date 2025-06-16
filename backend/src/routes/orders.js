import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Criar pedido (público - permite pedidos de convidados)
router.post('/', optionalAuth, createOrder);

// Rotas protegidas (requer autenticação)
router.use(protect);

// Rotas para clientes
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Rotas administrativas
router.use(authorize('admin', 'manager'));
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

export default router;