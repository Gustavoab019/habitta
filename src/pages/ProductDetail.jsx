import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extralight tracking-[0.15em] text-stone-900 mb-8">
            PRODUTO: {id}
          </h1>
          <p className="text-lg font-light text-stone-600 mb-12">
            Página de produto individual em desenvolvimento
          </p>
          <Link 
            to="/produtos"
            className="inline-block bg-stone-900 text-white px-12 py-4 font-light tracking-[0.25em] hover:bg-stone-800 transition-all duration-300"
          >
            VOLTAR AOS PRODUTOS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;