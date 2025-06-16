const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    console.error('❌ Error:', err);
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = 'Recurso não encontrado';
      error = { message, statusCode: 404 };
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Recurso duplicado';
      error = { message, statusCode: 400 };
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = { message, statusCode: 400 };
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      const message = 'Token inválido';
      error = { message, statusCode: 401 };
    }
  
    if (err.name === 'TokenExpiredError') {
      const message = 'Token expirado';
      error = { message, statusCode: 401 };
    }
  
    // Rate limit error
    if (err.statusCode === 429) {
      const message = 'Demasiadas tentativas. Tente novamente mais tarde.';
      error = { message, statusCode: 429 };
    }
  
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  export default errorHandler;