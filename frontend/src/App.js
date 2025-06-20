import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
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
import AdminOrders from './pages/AdminOrders';
import Login from './pages/Login';


// Componente para mostrar loading/erro global
const AppError = ({ error }) => (
  <div className="min-h-screen bg-red-50 flex items-center justify-center">
    <div className="text-center p-8">
      <h2 className="text-2xl font-light text-red-900 mb-4">Erro de Conexão</h2>
      <p className="text-red-700 mb-6">
        {error || 'Não foi possível conectar ao servidor. Verifique se o backend está a funcionar.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Tentar Novamente
      </button>
      <div className="mt-4 text-sm text-red-600">
        <p>Backend deve estar a correr em: <code>http://localhost:5000</code></p>
      </div>
    </div>
  </div>
);

const AppLoading = () => (
  <div className="min-h-screen bg-stone-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
      <p className="text-stone-600 font-light">Carregando...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/pedidos" element={<AdminOrders />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
