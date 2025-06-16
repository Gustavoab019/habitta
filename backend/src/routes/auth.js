import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas
router.use(protect); // Todas as rotas abaixo precisam de autenticação

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;