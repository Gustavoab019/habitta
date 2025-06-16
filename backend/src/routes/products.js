import express from 'express';
import {
  getProducts,
  getProduct,
  getProductsByCategory,
  getPopularProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', getProducts);
router.get('/popular', getPopularProducts);
router.get('/search/:query', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:identifier', getProduct);

// Rotas administrativas (protegidas)
router.use(protect);
router.use(authorize('admin', 'manager'));

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;