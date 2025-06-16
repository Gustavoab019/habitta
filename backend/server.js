import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/database.js';

// Carregar variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 5000;

// Conectar à base de dados
connectDB();

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
🚀 Servidor Habitta Backend iniciado!
📍 Ambiente: ${process.env.NODE_ENV || 'development'}
🌐 URL: http://localhost:${PORT}
📊 MongoDB: ${process.env.MONGODB_URI ? 'Conectado' : 'Configuração pendente'}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    console.log('✅ Processo encerrado');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido. Encerrando servidor...');
  server.close(() => {
    console.log('✅ Processo encerrado');
  });
});