import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto
const ProductContext = createContext();

// Hook personalizado para usar o contexto
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
};

// Dados dos produtos (em produção viria de uma API)
const productsData = [
  {
    id: 'blackout-executive',
    name: 'Blackout Executive',
    category: 'quartos',
    price: 389,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    ],
    description: 'Cortinado blackout premium usado em suítes presidenciais de hotéis 5 estrelas',
    fullDescription: 'O Blackout Executive é o cortinado de escolha para as suítes presidenciais dos mais prestigiados hotéis internacionais. Desenvolvido com tecnologia avançada de bloqueio de luz, este cortinado garante um ambiente completamente escuro, ideal para um descanso perfeito. O tecido possui tratamento anti-chama conforme normas hoteleiras europeias e acabamento que facilita a manutenção.',
    material: 'Poliéster Hoteleiro Anti-Chama',
    hotelPartner: 'Usado em hotéis 5★',
    features: [
      'Bloqueio de luz 100%',
      'Tratamento anti-chama',
      'Fácil manutenção',
      'Durabilidade profissional',
      'Isolamento térmico'
    ],
    dimensions: 'Sob medida',
    isPopular: true,
    inStock: true,
    colors: ['Antracite', 'Bege', 'Branco'],
    slug: 'blackout-executive'
  },
  {
    id: 'voil-elegance',
    name: 'Voil Elegance',
    category: 'salas',
    price: 249,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1631679706909-fdd04c0b5167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    ],
    description: 'Voil translúcido para salas de estar com proteção UV profissional',
    fullDescription: 'O Voil Elegance combina a delicadeza de um tecido translúcido com a funcionalidade necessária para ambientes comerciais de alto padrão. Utilizado nos lobbies dos melhores hotéis, este voil filtra suavemente a luz natural enquanto protege móveis e decoração dos raios UV prejudiciais.',
    material: 'Voil Técnico Anti-UV',
    hotelPartner: 'Lobbies Premium',
    features: [
      'Proteção UV 95%',
      'Translúcido elegante',
      'Anti-desbotamento',
      'Fácil lavagem',
      'Caimento perfeito'
    ],
    dimensions: 'Sob medida',
    isPopular: false,
    inStock: true,
    colors: ['Branco', 'Creme', 'Bege'],
    slug: 'voil-elegance'
  },
  {
    id: 'linen-luxury',
    name: 'Linen Luxury',
    category: 'quartos',
    price: 459,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    ],
    description: 'Linho natural com tratamento anti-manchas desenvolvido para hotelaria',
    fullDescription: 'O Linen Luxury representa o que há de melhor em cortinado de linho para ambientes de prestígio. Desenvolvido especificamente para resorts de luxo, este linho natural recebe tratamento especial que o torna resistente a manchas e facilita a manutenção, mantendo toda a elegância e textura natural do linho.',
    material: 'Linho Natural Tratado',
    hotelPartner: 'Resorts de Luxo',
    features: [
      'Linho 100% natural',
      'Tratamento anti-manchas',
      'Textura luxuosa',
      'Respirável',
      'Sustentável'
    ],
    dimensions: 'Sob medida',
    isPopular: true,
    inStock: true,
    colors: ['Natural', 'Bege', 'Cinza'],
    slug: 'linen-luxury'
  },
  {
    id: 'thermal-comfort',
    name: 'Thermal Comfort',
    category: 'quartos',
    price: 529,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    ],
    description: 'Cortinado térmico com isolamento acústico para ambientes profissionais',
    fullDescription: 'O Thermal Comfort é a solução premium para quem procura máximo conforto térmico e acústico. Desenvolvido para hotéis business em centros urbanos, este cortinado multicamada oferece isolamento térmico superior e redução significativa de ruído, garantindo o ambiente perfeito para descanso.',
    material: 'Tecido Técnico Multicamada',
    hotelPartner: 'Hotéis Business',
    features: [
      'Isolamento térmico superior',
      'Redução de ruído',
      'Eficiência energética',
      'Multicamada técnica',
      'Durabilidade extrema'
    ],
    dimensions: 'Sob medida',
    isPopular: false,
    inStock: true,
    colors: ['Cinza', 'Azul', 'Verde'],
    slug: 'thermal-comfort'
  },
  {
    id: 'sheer-professional',
    name: 'Sheer Professional',
    category: 'salas',
    price: 189,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1631679706909-fdd04c0b5167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    ],
    description: 'Cortinado sheer com proteção antimicrobiana para ambientes de alto fluxo',
    fullDescription: 'O Sheer Professional foi desenvolvido para espaços comerciais de alto fluxo, incorporando tecnologia antimicrobiana avançada. Utilizado por grandes cadeias hoteleiras internacionais, oferece a delicadeza de um sheer tradicional com a segurança e higiene necessárias para ambientes profissionais.',
    material: 'Poliéster Antimicrobiano',
    hotelPartner: 'Cadeias Internacionais',
    features: [
      'Proteção antimicrobiana',
      'Transparência elegante',
      'Fácil higienização',
      'Resistente ao uso intenso',
      'Certificação hoteleira'
    ],
    dimensions: 'Sob medida',
    isPopular: false,
    inStock: true,
    colors: ['Branco', 'Creme'],
    slug: 'sheer-professional'
  },
  {
    id: 'classic-drape',
    name: 'Classic Drape',
    category: 'salas',
    price: 349,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90',
    ],
    description: 'Cortinado clássico com caimento perfeito para ambientes tradicionais',
    fullDescription: 'O Classic Drape é a escolha preferida para hotéis históricos e estabelecimentos de charme clássico. Com uma mistura equilibrada de algodão e poliéster, oferece o caimento perfeito e a durabilidade necessária para ambientes de prestígio que valorizam a elegância tradicional.',
    material: 'Algodão-Poliéster Premium',
    hotelPartner: 'Hotéis Históricos',
    features: [
      'Caimento perfeito',
      'Elegância clássica',
      'Durabilidade comprovada',
      'Manutenção simples',
      'Versatilidade decorativa'
    ],
    dimensions: 'Sob medida',
    isPopular: true,
    inStock: true,
    colors: ['Dourado', 'Bordô', 'Verde'],
    slug: 'classic-drape'
  }
];

// Provider do contexto
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(productsData);
  const [loading, setLoading] = useState(false);
  const [categories] = useState([
    { id: 'todos', name: 'Toda a Colecção' },
    { id: 'quartos', name: 'Quartos' },
    { id: 'salas', name: 'Salas de Estar' },
    { id: 'blackout', name: 'Blackout Premium' },
    { id: 'voil', name: 'Voil Hoteleiro' }
  ]);

  // Função para buscar produto por ID
  const getProductById = (id) => {
    return products.find(product => product.id === id || product.slug === id);
  };

  // Função para buscar produtos por categoria
  const getProductsByCategory = (category) => {
    if (category === 'todos') return products;
    return products.filter(product => product.category === category);
  };

  // Função para buscar produtos
  const searchProducts = (query) => {
    if (!query) return products;
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.material.toLowerCase().includes(searchTerm)
    );
  };

  // Função para obter produtos populares
  const getPopularProducts = () => {
    return products.filter(product => product.isPopular);
  };

  // Função para obter produtos em stock
  const getInStockProducts = () => {
    return products.filter(product => product.inStock);
  };

  // Valor do contexto
  const value = {
    // Estado
    products,
    loading,
    categories,
    
    // Funções
    getProductById,
    getProductsByCategory,
    searchProducts,
    getPopularProducts,
    getInStockProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;