import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Carregar variáveis de ambiente
dotenv.config();

const seedDatabase = async () => {
  try {
    // Conectar à base de dados
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB para seed');

    // Limpar dados existentes (CUIDADO em produção!)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      console.log('🗑️  Dados existentes removidos');
    }

    // Criar categorias
    const categories = await Category.insertMany([
      {
        name: 'Toda a Colecção',
        slug: 'todos',
        description: 'Todos os nossos produtos de cortinado hoteleiro',
        icon: 'grid',
        isVisible: true,
        sortOrder: 1
      },
      {
        name: 'Quartos',
        slug: 'quartos',
        description: 'Cortinado premium para quartos de dormir',
        icon: 'bed',
        color: '#8B5A3C',
        isVisible: true,
        sortOrder: 2
      },
      {
        name: 'Salas de Estar',
        slug: 'salas',
        description: 'Cortinado elegante para salas de estar',
        icon: 'sofa',
        color: '#6B7280',
        isVisible: true,
        sortOrder: 3
      }
    ]);

    console.log('📂 Categorias criadas:', categories.length);

    // Criar utilizador admin
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'Habitta',
      email: 'admin@habitta.pt',
      phone: '+351912345678',
      password: 'habitta123',
      role: 'admin',
      isEmailVerified: true,
      address: {
        street: 'Rua dos Designers, 123',
        city: 'Lisboa',
        postalCode: '1200-123',
        district: 'Lisboa'
      }
    });

    console.log('👤 Utilizador admin criado:', adminUser.email);

    // Criar produtos (migrar dos dados existentes no frontend)
    const products = await Product.insertMany([
      {
        name: 'Blackout Executive',
        slug: 'blackout-executive',
        category: 'quartos',
        price: 389,
        description: 'Cortinado blackout premium usado em suítes presidenciais de hotéis 5 estrelas',
        fullDescription: 'O Blackout Executive é o cortinado de escolha para as suítes presidenciais dos mais prestigiados hotéis internacionais. Desenvolvido com tecnologia avançada de bloqueio de luz, este cortinado garante um ambiente completamente escuro, ideal para um descanso perfeito.',
        material: 'Poliéster Hoteleiro Anti-Chama',
        hotelPartner: 'Usado em hotéis 5★',
        features: [
          'Bloqueio de luz 100%',
          'Tratamento anti-chama',
          'Fácil manutenção',
          'Durabilidade profissional',
          'Isolamento térmico'
        ],
        colors: [
          { name: 'Antracite', code: '#374151' },
          { name: 'Bege', code: '#D4B896' },
          { name: 'Branco', code: '#F9FAFB' }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
            alt: 'Blackout Executive - Vista principal',
            isMain: true,
            order: 1
          }
        ],
        isPopular: true,
        inStock: true,
        specifications: {
          composition: '100% Poliéster',
          weight: '280g/m²',
          width: 'Até 300cm largura contínua',
          maintenance: 'Lavagem a seco'
        }
      },
      {
        name: 'Voil Elegance',
        slug: 'voil-elegance',
        category: 'salas',
        price: 249,
        description: 'Voil translúcido para salas de estar com proteção UV profissional',
        fullDescription: 'O Voil Elegance combina a delicadeza de um tecido translúcido com a funcionalidade necessária para ambientes comerciais de alto padrão.',
        material: 'Voil Técnico Anti-UV',
        hotelPartner: 'Lobbies Premium',
        features: [
          'Proteção UV 95%',
          'Translúcido elegante',
          'Anti-desbotamento',
          'Fácil lavagem',
          'Caimento perfeito'
        ],
        colors: [
          { name: 'Branco', code: '#FFFFFF' },
          { name: 'Creme', code: '#F5F5DC' },
          { name: 'Bege', code: '#F5F5F0' }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1631679706909-fdd04c0b5167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
            alt: 'Voil Elegance - Vista principal',
            isMain: true,
            order: 1
          }
        ],
        isPopular: false,
        inStock: true,
        specifications: {
          composition: '100% Poliéster Anti-UV',
          weight: '120g/m²',
          width: 'Até 300cm largura contínua',
          maintenance: 'Lavagem doméstica 30°C'
        }
      },
      {
        name: 'Linen Luxury',
        slug: 'linen-luxury',
        category: 'quartos',
        price: 459,
        description: 'Linho natural com tratamento anti-manchas desenvolvido para hotelaria',
        fullDescription: 'O Linen Luxury representa o que há de melhor em cortinado de linho para ambientes de prestígio. Desenvolvido especificamente para resorts de luxo.',
        material: 'Linho Natural Tratado',
        hotelPartner: 'Resorts de Luxo',
        features: [
          'Linho 100% natural',
          'Tratamento anti-manchas',
          'Textura luxuosa',
          'Respirável',
          'Sustentável'
        ],
        colors: [
          { name: 'Natural', code: '#F5F5DC' },
          { name: 'Bege', code: '#D2B48C' },
          { name: 'Cinza', code: '#A8A8A8' }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
            alt: 'Linen Luxury - Vista principal',
            isMain: true,
            order: 1
          }
        ],
        isPopular: true,
        inStock: true,
        specifications: {
          composition: '100% Linho Natural',
          weight: '200g/m²',
          width: 'Até 280cm largura contínua',
          maintenance: 'Lavagem a seco recomendada'
        }
      },
      {
        name: 'Thermal Comfort',
        slug: 'thermal-comfort',
        category: 'quartos',
        price: 529,
        description: 'Cortinado térmico com isolamento acústico para ambientes profissionais',
        fullDescription: 'O Thermal Comfort é a solução premium para quem procura máximo conforto térmico e acústico.',
        material: 'Tecido Técnico Multicamada',
        hotelPartner: 'Hotéis Business',
        features: [
          'Isolamento térmico superior',
          'Redução de ruído',
          'Eficiência energética',
          'Multicamada técnica',
          'Durabilidade extrema'
        ],
        colors: [
          { name: 'Cinza', code: '#6B7280' },
          { name: 'Azul', code: '#3B82F6' },
          { name: 'Verde', code: '#10B981' }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
            alt: 'Thermal Comfort - Vista principal',
            isMain: true,
            order: 1
          }
        ],
        isPopular: false,
        inStock: true,
        specifications: {
          composition: 'Poliéster técnico multicamada',
          weight: '350g/m²',
          width: 'Até 300cm largura contínua',
          maintenance: 'Lavagem a seco'
        }
      },
      {
        name: 'Sheer Professional',
        slug: 'sheer-professional',
        category: 'salas',
        price: 189,
        description: 'Cortinado sheer com proteção antimicrobiana para ambientes de alto fluxo',
        fullDescription: 'O Sheer Professional foi desenvolvido para espaços comerciais de alto fluxo, incorporando tecnologia antimicrobiana avançada.',
        material: 'Poliéster Antimicrobiano',
        hotelPartner: 'Cadeias Internacionais',
        features: [
          'Proteção antimicrobiana',
          'Transparência elegante',
          'Fácil higienização',
          'Resistente ao uso intenso',
          'Certificação hoteleira'
        ],
        colors: [
          { name: 'Branco', code: '#FFFFFF' },
          { name: 'Creme', code: '#F5F5DC' }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1631679706909-fdd04c0b5167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
            alt: 'Sheer Professional - Vista principal',
            isMain: true,
            order: 1
          }
        ],
        isPopular: false,
        inStock: true,
        specifications: {
          composition: 'Poliéster antimicrobiano',
          weight: '95g/m²',
          width: 'Até 300cm largura contínua',
          maintenance: 'Lavagem doméstica 40°C'
        }
      },
      {
        name: 'Classic Drape',
        slug: 'classic-drape',
        category: 'salas',
        price: 349,
        description: 'Cortinado clássico com caimento perfeito para ambientes tradicionais',
        fullDescription: 'O Classic Drape é a escolha preferida para hotéis históricos e estabelecimentos de charme clássico.',
        material: 'Algodão-Poliéster Premium',
        hotelPartner: 'Hotéis Históricos',
        features: [
          'Caimento perfeito',
          'Elegância clássica',
          'Durabilidade comprovada',
          'Manutenção simples',
          'Versatilidade decorativa'
        ],
        colors: [
          { name: 'Dourado', code: '#FFD700' },
          { name: 'Bordô', code: '#800020' },
          { name: 'Verde', code: '#228B22' }
        ],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
            alt: 'Classic Drape - Vista principal',
            isMain: true,
            order: 1
          }
        ],
        isPopular: true,
        inStock: true,
        specifications: {
          composition: '60% Algodão, 40% Poliéster',
          weight: '240g/m²',
          width: 'Até 280cm largura contínua',
          maintenance: 'Lavagem a seco recomendada'
        }
      }
    ]);

    console.log('🛍️  Produtos criados:', products.length);

    // Criar utilizador de teste
    const testUser = await User.create({
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@exemplo.com',
      phone: '+351912345679',
      password: 'teste123',
      role: 'customer',
      isEmailVerified: true,
      address: {
        street: 'Rua de Teste, 456',
        city: 'Porto',
        postalCode: '4000-123',
        district: 'Porto'
      }
    });

    console.log('👤 Utilizador de teste criado:', testUser.email);

    console.log('\n🎉 Seed da base de dados concluído com sucesso!');
    console.log('📊 Resumo:');
    console.log(`   - ${categories.length} categorias`);
    console.log(`   - ${products.length} produtos`);
    console.log(`   - 2 utilizadores (1 admin + 1 teste)`);
    console.log('\n🔐 Credenciais de teste:');
    console.log('   Admin: admin@habitta.pt / habitta123');
    console.log('   Cliente: joao@exemplo.com / teste123');

  } catch (error) {
    console.error('❌ Erro no seed da base de dados:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Conexão MongoDB encerrada');
    process.exit();
  }
};

// Executar seed se chamado diretamente
if (process.argv[2] === 'run') {
  seedDatabase();
}

export default seedDatabase;