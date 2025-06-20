import express from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

export default router;
