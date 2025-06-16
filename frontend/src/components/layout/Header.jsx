import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X, Phone, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartSidebar from '../cart/CartSidebar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { itemCount, toggleCart } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navigationLinks = [
    { name: 'Cortinado', href: '/produtos' },
    { name: 'Colecções', href: '/produtos' },
    { name: 'Quartos', href: '/produtos?categoria=quartos' },
    { name: 'Salas', href: '/produtos?categoria=salas' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contacto', href: '/contacto' }
  ];

  return (
    <>
      <header className="bg-white shadow-sm relative z-50">
      {/* Top Bar */}
      <div className="bg-stone-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" strokeWidth={1} />
              <span className="font-light">+351 21 123 4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" strokeWidth={1} />
              <span className="font-light">info@habitta.pt</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="font-light">Envio gratuito para encomendas acima de €500</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-8">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-3xl font-extralight tracking-[0.15em] text-stone-900">
              HABITTA
            </h1>
            <p className="text-xs text-stone-500 mt-1 tracking-widest font-light">
              CORTINADO DE HOTEL DE LUXO
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-12">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-stone-700 hover:text-stone-900 font-light tracking-wide transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-stone-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            
            {/* Search */}
            <div className="hidden md:flex relative">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-transparent border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm font-light tracking-wide placeholder-stone-400"
                />
                <Search className="absolute left-0 bottom-3 text-stone-400 w-4 h-4" strokeWidth={1} />
              </form>
            </div>

            {/* User Account */}
            <button className="p-2 text-stone-700 hover:text-stone-900 transition-colors duration-300">
              <User className="w-5 h-5" strokeWidth={1} />
            </button>

            {/* Shopping Cart */}
            <button 
              onClick={toggleCart}
              className="p-2 text-stone-700 hover:text-stone-900 transition-colors duration-300 relative"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-light">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" strokeWidth={1} /> : <Menu className="w-5 h-5" strokeWidth={1} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 absolute w-full">
          <div className="px-4 py-8 space-y-6">
            
            {/* Mobile Search */}
            <div className="relative mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-b border-stone-300 focus:border-stone-900 focus:outline-none text-sm font-light tracking-wide placeholder-stone-400"
                />
                <Search className="absolute left-0 bottom-4 text-stone-400 w-4 h-4" strokeWidth={1} />
              </form>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="space-y-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-stone-700 hover:text-stone-900 font-light tracking-wide py-2 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
    
    {/* Cart Sidebar */}
    <CartSidebar />
    </>
  );
};

export default Header;