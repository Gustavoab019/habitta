import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI não encontrada nas variáveis de ambiente');
    }

    console.log('🔄 Conectando ao MongoDB Atlas...');
    
    // Conectar sem as opções deprecadas
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    console.log(`📊 Base de dados: ${conn.connection.name}`);
    
    // Event listeners para conexão
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose conectado ao MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose desconectado do MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 Conexão MongoDB encerrada devido ao encerramento da aplicação');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    
    // Em desenvolvimento, continue mesmo sem DB para permitir desenvolvimento local
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Continuando em modo desenvolvimento...');
      console.log('💡 Verifique suas credenciais MongoDB no arquivo .env');
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;