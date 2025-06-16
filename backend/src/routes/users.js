import express from 'express';

const router = express.Router();

// Temporary routes for testing
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Users routes funcionando!',
    availableRoutes: [
      'GET /api/users/profile',
      'PUT /api/users/profile',
      'GET /api/users/orders'
    ]
  });
});

export default router;