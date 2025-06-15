import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const navigate = useNavigate();
  const { 
    isOpen, 
    closeCart, 
    items, 
    total, 
    itemCount, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-stone-700" strokeWidth={1} />
            <h2 className="text-xl font-light tracking-wide text-stone-900">
              Carrinho ({itemCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-stone-600" strokeWidth={1} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full pb-20">
          
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" strokeWidth={1} />
                <h3 className="text-lg font-light text-stone-600 mb-2">
                  Carrinho vazio
                </h3>
                <p className="text-stone-500 font-light mb-6">
                  Adicione produtos para começar a sua compra
                </p>
                <Link
                  to="/produtos"
                  onClick={closeCart}
                  className="bg-stone-900 text-white px-8 py-3 font-light tracking-wide hover:bg-stone-800 transition-all duration-300"
                >
                  VER PRODUTOS
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.map((item) => (
                  <div key={item.customId || item.id} className="flex space-x-4 pb-6 border-b border-stone-100 last:border-0">
                    
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-light text-stone-900 truncate mb-1 text-sm">
                        {item.name}
                      </h4>
                      {item.measurements && (
                        <div className="text-xs text-stone-500 font-light mb-1">
                          <span className="bg-stone-100 px-2 py-1 rounded">
                            {item.measurements.width}×{item.measurements.height}cm
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-stone-500 font-light mb-2">
                        {item.material}
                      </p>
                      <p className="text-base font-medium text-stone-900">
                        {formatPrice(item.calculatedPrice || item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end space-y-3">
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.customId || item.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1} />
                      </button>

                      {/* Quantity */}
                      <div className="flex items-center space-x-2 border border-stone-300">
                        <button
                          onClick={() => updateQuantity(item.customId || item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4 text-stone-600" strokeWidth={1} />
                        </button>
                        <span className="w-8 text-center text-sm font-light">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.customId || item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4 text-stone-600" strokeWidth={1} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className="text-sm font-light text-stone-600">
                        {formatPrice((item.calculatedPrice || item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-stone-200 p-6 space-y-4 bg-white">
                
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full text-stone-500 hover:text-red-500 text-sm font-light tracking-wide transition-colors duration-200"
                >
                  Limpar Carrinho
                </button>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t border-stone-200">
                  <span className="text-lg font-light text-stone-900">Total:</span>
                  <span className="text-2xl font-medium text-stone-900">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    to="/produtos"
                    onClick={closeCart}
                    className="block w-full text-center border border-stone-900 text-stone-900 py-3 text-sm font-light tracking-wide hover:bg-stone-900 hover:text-white transition-all duration-300"
                  >
                    CONTINUAR A COMPRAR
                  </Link>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-stone-900 text-white py-3 text-sm font-light tracking-wide hover:bg-stone-800 transition-all duration-300"
                  >
                    FINALIZAR COMPRA
                  </button>
                </div>

                {/* Info */}
                <p className="text-xs text-stone-500 text-center font-light leading-relaxed">
                  Medição e instalação incluídas no preço
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;