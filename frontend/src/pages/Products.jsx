import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCatalog from '../components/products/ProductCatalog';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* Page Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.15em] text-stone-900 mb-6">
              CORTINADO HOTELEIRO
            </h1>
            <p className="text-xl font-light text-stone-600 tracking-wide max-w-3xl mx-auto leading-relaxed">
              Descubra toda a nossa colecção de cortinado premium, 
              com a mesma qualidade dos melhores hotéis 5 estrelas
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1} />
              <input
                type="text"
                placeholder="Buscar cortinado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light tracking-wide"
              />
            </div>

            {/* Info */}
            <div className="text-stone-600 font-light">
              <p>Todos os produtos incluem medição e instalação</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <ProductCatalog />

      {/* Contact CTA */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extralight tracking-[0.15em] text-stone-900 mb-6">
            PRECISA DE AJUDA NA ESCOLHA?
          </h2>
          <p className="text-lg font-light text-stone-600 mb-8 tracking-wide">
            Os nossos especialistas estão prontos para o aconselhar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-stone-900 text-white px-12 py-4 font-light tracking-[0.25em] hover:bg-stone-800 transition-all duration-300">
              CONTACTAR ESPECIALISTA
            </button>
            <button className="border border-stone-900 text-stone-900 px-12 py-4 font-light tracking-[0.25em] hover:bg-stone-900 hover:text-white transition-all duration-300">
              AGENDAR VISITA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;