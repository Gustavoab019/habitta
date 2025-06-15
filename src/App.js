import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context Providers
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<Products />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;