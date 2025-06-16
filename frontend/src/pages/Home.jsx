import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import ProductCatalog from '../components/products/ProductCatalog';

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <ProductCatalog />
    </div>
  );
};

export default Home;