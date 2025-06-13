import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-extralight tracking-[0.15em] text-stone-900 mb-8">
          404
        </h1>
        <h2 className="text-2xl font-light text-stone-600 mb-8 tracking-wide">
          Página não encontrada
        </h2>
        <p className="text-stone-500 font-light mb-12 max-w-md mx-auto leading-relaxed">
          A página que procura não existe ou foi movida. 
          Volte à página inicial para continuar a navegar.
        </p>
        <Link 
          to="/"
          className="inline-block bg-stone-900 text-white px-12 py-4 font-light tracking-[0.25em] hover:bg-stone-800 transition-all duration-300"
        >
          VOLTAR AO INÍCIO
        </Link>
      </div>
    </div>
  );
};

export default NotFound;