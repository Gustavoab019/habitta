import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Criar o contexto
const CartContext = createContext();

// Estados iniciais
const initialState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0
};

// Reducer para gerir ações do carrinho
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        // Se é um item novo, adiciona ao carrinho
        const newItem = { ...action.payload, quantity: 1 };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: updatedItems };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity === 0) {
        // Se quantidade é 0, remove o item
        const updatedItems = state.items.filter(item => item.id !== id);
        return { ...state, items: updatedItems };
      } else {
        // Atualiza a quantidade
        const updatedItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        return { ...state, items: updatedItems };
      }
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    case 'TOGGLE_CART': {
      return { ...state, isOpen: !state.isOpen };
    }

    case 'OPEN_CART': {
      return { ...state, isOpen: true };
    }

    case 'CLOSE_CART': {
      return { ...state, isOpen: false };
    }

    case 'UPDATE_TOTALS': {
      const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      const total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      return { ...state, itemCount, total };
    }

    default:
      return state;
  }
};

// Hook personalizado para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

// Provider do contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Atualizar totais sempre que os items mudam
  useEffect(() => {
    dispatch({ type: 'UPDATE_TOTALS' });
  }, [state.items]);

  // Salvar no localStorage
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('habitta-cart', JSON.stringify(state.items));
    } else {
      localStorage.removeItem('habitta-cart');
    }
  }, [state.items]);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('habitta-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.forEach(item => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch (error) {
        console.error('Erro ao carregar carrinho do localStorage:', error);
      }
    }
  }, []);

  // Ações do carrinho
  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    dispatch({ type: 'OPEN_CART' });
  };

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  // Valor do contexto
  const value = {
    // Estado
    items: state.items,
    isOpen: state.isOpen,
    total: state.total,
    itemCount: state.itemCount,
    
    // Ações
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;