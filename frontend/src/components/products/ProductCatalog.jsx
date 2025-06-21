import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Link, useNavigate } from 'react-router-dom';

const ProductCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { 
    products, 
    categories, 
    getProductsByCategory, 
    loading, 
    error 
  } = useProducts();
  const navigate = useNavigate();

  // Carregar produtos quando categoria muda
  useEffect(() => {
    getProductsByCategory(selectedCategory);
  }, [selectedCategory, getProductsByCategory]);

  // Helper function to get product image URL safely
  const getProductImageUrl = (product) => {
    // First try to get from images array
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // Handle both object format {url: string} and direct string format
      if (typeof firstImage === 'object' && firstImage.url) {
        return firstImage.url;
      } else if (typeof firstImage === 'string') {
        return firstImage;
      }
    }
    
    // Fallback to other image properties
    if (product.image) {
      return product.image;
    }
    
    if (product.mainImage) {
      return product.mainImage;
    }
    
    // Final fallback to default image
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90';
  };

  const ProductCard = ({ product }) => (
    <div className="group cursor-pointer">
      
      {/* Product Image */}
      <div className="relative overflow-hidden bg-stone-50 mb-8" style={{ aspectRatio: '4/5' }}>
        <img 
          src={getProductImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {product.isPopular && (
            <span className="bg-stone-900 text-white text-xs tracking-[0.2em] px-3 py-2 font-light">
              POPULAR
            </span>
          )}
          {product.hotelPartner && (
            <span className="bg-white/90 text-stone-900 text-xs tracking-wide px-3 py-2 font-light">
              {product.hotelPartner}
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500">
          <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="flex gap-3">
              <Link
                to={`/produto/${product.slug || product._id || product.id}`}
                className="flex-1 bg-white/95 backdrop-blur-sm text-black py-3 px-6 text-sm font-light tracking-wide hover:bg-white transition-all duration-300 text-center"
              >
                VER DETALHES
              </Link>
              <button className="bg-white/95 backdrop-blur-sm p-3 hover:bg-white transition-all duration-300">
                <Heart className="w-4 h-4" strokeWidth={1} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/produto/${product.slug || product._id || product.id}`);
                }}
                className="bg-white/95 backdrop-blur-sm p-3 hover:bg-white transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" strokeWidth={1} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        <div>
          {product.hotelPartner && (
            <p className="text-stone-500 text-sm font-light tracking-wide mb-2">
              {product.hotelPartner}
            </p>
          )}
          <h3 className="text-xl font-light text-stone-900 tracking-wide mb-3">
            {product.name}
          </h3>
          <p className="text-stone-600 font-light leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500 font-light">Material:</span>
            <span className="text-stone-700 font-light">{product.material || 'Premium'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500 font-light">Medidas:</span>
            <span className="text-stone-700 font-light">
              {product.dimensions && typeof product.dimensions === 'object' 
                ? `${product.dimensions.maxWidth || 300}cm máx.`
                : product.dimensions || 'Sob medida'
              }
            </span>
          </div>
        </div>
        
        <div className="pt-6 border-t border-stone-200">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-light text-stone-900 tracking-wide">
              €{product.price}
            </span>
            <span className="text-xs text-stone-500 font-light tracking-widest">
              /{product.priceUnit || 'METRO'}
            </span>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="flex items-center mt-2">
              <span className="text-sm text-stone-400 line-through mr-2">
                €{product.originalPrice}
              </span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-medium">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading && !products.length) {
    return (
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
            <p className="text-stone-600 font-light">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Erro ao carregar produtos
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.15em] text-stone-900 mb-8">
            CORTINADO HOTELEIRO
          </h2>
          <p className="text-xl font-light text-stone-600 tracking-wide max-w-3xl mx-auto leading-relaxed">
            A mesma qualidade premium que encontra nos melhores hotéis do mundo, 
            agora disponível para a sua casa
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-16">
          <nav className="flex flex-wrap gap-8 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-sm font-light tracking-wide transition-all duration-500 pb-3 border-b ${
                  selectedCategory === category.id 
                    ? 'text-stone-900 border-stone-900' 
                    : 'text-stone-500 border-transparent hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Loading overlay for category changes */}
        {loading && products.length > 0 && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
              <p className="text-stone-600 font-light">Carregando categoria...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-16">
            {products.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="bg-stone-100 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-stone-400 mb-4">
                <ShoppingBag className="w-16 h-16 mx-auto" strokeWidth={1} />
              </div>
              <h3 className="text-lg font-light text-stone-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-stone-600 font-light mb-4">
                Não encontrámos produtos nesta categoria.
              </p>
              <button
                onClick={() => setSelectedCategory('todos')}
                className="text-stone-600 hover:text-stone-900 font-light underline"
              >
                Ver todos os produtos
              </button>
            </div>
          </div>
        ) : null}

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-lg font-light text-stone-600 mb-8 tracking-wide">
            Todos os produtos incluem medição, entrega e instalação
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-stone-900 text-white px-12 py-5 font-light tracking-[0.25em] hover:bg-stone-800 transition-all duration-300">
              SOLICITAR ORÇAMENTO
            </button>
            <button className="border border-stone-900 text-stone-900 px-12 py-5 font-light tracking-[0.25em] hover:bg-stone-900 hover:text-white transition-all duration-300">
              CONTACTAR ESPECIALISTA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
