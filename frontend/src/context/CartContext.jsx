import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ordersAPI } from '../services/api';

// Criar o contexto
const CartContext = createContext();

// Estados iniciais
const initialState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  loading: false,
  error: null
};

// Reducer para gerir ações do carrinho
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'ADD_ITEM': {
      // Verificar se item já existe (mesmo produto + mesmas configurações)
      const existingItemIndex = state.items.findIndex(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.measurements) === JSON.stringify(action.payload.measurements) &&
        JSON.stringify(item.configuration) === JSON.stringify(action.payload.configuration)
      );
      
      if (existingItemIndex >= 0) {
        // Se o item já existe, aumenta a quantidade
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return { ...state, items: updatedItems };
      } else {
        // Se é um item novo, adiciona ao carrinho
        const newItem = { 
          ...action.payload, 
          quantity: 1,
          customId: `${action.payload.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.customId !== action.payload);
      return { ...state, items: updatedItems };
    }

    case 'UPDATE_QUANTITY': {
      const { customId, quantity } = action.payload;
      if (quantity === 0) {
        // Se quantidade é 0, remove o item
        const updatedItems = state.items.filter(item => item.customId !== customId);
        return { ...state, items: updatedItems };
      } else {
        // Atualiza a quantidade
        const updatedItems = state.items.map(item =>
          item.customId === customId ? { ...item, quantity } : item
        );
        return { ...state, items: updatedItems };
      }
    }

    case 'CLEAR_CART': {
      return { ...state, items: [], error: null };
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
      const total = state.items.reduce((total, item) => {
        const itemPrice = item.calculatedPrice || item.price;
        return total + (itemPrice * item.quantity);
      }, 0);
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

  // Salvar no localStorage (mas não com dados sensíveis)
  useEffect(() => {
    if (state.items.length > 0) {
      const cartData = state.items.map(item => ({
        id: item.id,
        customId: item.customId,
        name: item.name,
        price: item.price,
        calculatedPrice: item.calculatedPrice,
        measurements: item.measurements,
        configuration: item.configuration,
        quantity: item.quantity,
        images: item.images,
        material: item.material
      }));
      localStorage.setItem('habitta-cart', JSON.stringify(cartData));
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
        localStorage.removeItem('habitta-cart');
      }
    }
  }, []);

  // === AÇÕES DO CARRINHO ===

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    dispatch({ type: 'OPEN_CART' });
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const removeItem = (customId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: customId });
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateQuantity = (customId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { customId, quantity } });
    dispatch({ type: 'CLEAR_ERROR' });
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

  // === CHECKOUT FUNCTIONS ===

  // Converter items do carrinho para formato da API
  const formatCartItemsForAPI = () => {
    return state.items.map(item => ({
      product: item._id || item.id, // ID do produto
      measurements: {
        width: item.measurements?.width || 0,
        height: item.measurements?.height || 0,
        panels: item.measurements?.panels || 1,
        area: item.measurements?.area || 0
      },
      configuration: {
        color: item.configuration?.color || item.selectedColor || 'Padrão',
        installationType:
          item.configuration?.installationType ||
          item.measurements?.installationType ||
          'professional',
        mounting:
          item.configuration?.mounting ||
          item.measurements?.mounting ||
          'ceiling',
        includeSheer:
          item.configuration?.includeSheer ??
          item.measurements?.includeSheer ??
          false
      },
      quantity: item.quantity || 1
    }));
  };

  // Criar pedido
  const createOrder = async (orderData) => {
    if (state.items.length === 0) {
      throw new Error('Carrinho vazio');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Preparar dados do pedido
      const apiOrderData = {
        ...orderData,
        items: formatCartItemsForAPI(),
        totals: {
          subtotal: state.total,
          shippingCost: orderData.totals?.shippingCost || 0,
          installationCost: orderData.totals?.installationCost || 0,
          discount: orderData.totals?.discount || 0,
          tax: orderData.totals?.tax || 0,
          total: state.total + (orderData.totals?.shippingCost || 0) + (orderData.totals?.installationCost || 0) - (orderData.totals?.discount || 0) + (orderData.totals?.tax || 0)
        }
      };

      // Criar pedido via API
      const response = await ordersAPI.createOrder(apiOrderData);
      
      // Limpar carrinho após sucesso
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'CLOSE_CART' });

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar pedido';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Calcular totais detalhados
  const getDetailedTotals = () => {
    const subtotal = state.total;
    const installationCost = state.items.some(item => 
      item.configuration?.installationType === 'express'
    ) ? 150 : 0;
    const shippingCost = 0; // Grátis para todos
    const discount = 0; // Implementar códigos promocionais depois
    const tax = 0; // IVA incluído no preço
    const total = subtotal + installationCost + shippingCost - discount + tax;

    return {
      subtotal,
      installationCost,
      shippingCost,
      discount,
      tax,
      total
    };
  };

  // Limpar erros
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Valor do contexto
  const value = {
    // Estado
    items: state.items,
    isOpen: state.isOpen,
    total: state.total,
    itemCount: state.itemCount,
    loading: state.loading,
    error: state.error,
    
    // Ações básicas
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    clearError,

    // Checkout functions
    createOrder,
    getDetailedTotals,
    formatCartItemsForAPI
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;