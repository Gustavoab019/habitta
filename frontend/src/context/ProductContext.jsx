import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { productsAPI } from '../services/api';

// Criar o contexto
const ProductContext = createContext();

// Hook personalizado para usar o contexto
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductProvider');
  }
  return context;
};

// Categorias fixas (podem vir da API no futuro)
const categoriesData = [
  { id: 'todos', name: 'Toda a Colecção' },
  { id: 'quartos', name: 'Quartos' },
  { id: 'salas', name: 'Salas de Estar' },
  { id: 'blackout', name: 'Blackout Premium' },
  { id: 'voil', name: 'Voil Hoteleiro' }
];

// Provider do contexto
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories] = useState(categoriesData);

  // Cache para evitar requests desnecessários
  const [cache, setCache] = useState({
    allProducts: null,
    popularProducts: null,
    productDetails: new Map(), // Cache para produtos individuais
    lastFetch: null
  });

  // Função para buscar todos os produtos - estabilizada com useCallback
  const fetchProducts = useCallback(async (params = {}, useCache = true) => {
    // Verificar cache (válido por 5 minutos)
    const cacheKey = JSON.stringify(params);
    const cacheValid = cache.lastFetch && (Date.now() - cache.lastFetch < 5 * 60 * 1000);
    
    if (useCache && cacheValid && cache.allProducts && cacheKey === '{}') {
      return cache.allProducts;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getProducts(params);
      const fetchedProducts = response.data.products;
      
      setProducts(fetchedProducts);
      
      // Atualizar cache se for busca geral
      if (cacheKey === '{}') {
        setCache(prev => ({
          ...prev,
          allProducts: fetchedProducts,
          lastFetch: Date.now()
        }));
      }
      
      return fetchedProducts;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar produtos';
      setError(errorMessage);
      console.error('Erro ao buscar produtos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cache.lastFetch, cache.allProducts]);

  // Função para buscar produto por ID/slug - estabilizada com useCallback
  const getProductById = useCallback(async (identifier) => {
    // Verificar cache primeiro
    if (cache.productDetails.has(identifier)) {
      const cachedProduct = cache.productDetails.get(identifier);
      const cacheTime = cachedProduct.timestamp;
      const isValid = Date.now() - cacheTime < 5 * 60 * 1000; // 5 minutos
      
      if (isValid) {
        return cachedProduct.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getProduct(identifier);
      const product = response.data.product;
      
      // Adicionar ao cache
      setCache(prev => ({
        ...prev,
        productDetails: new Map(prev.productDetails).set(identifier, {
          data: product,
          timestamp: Date.now()
        })
      }));
      
      return product;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Produto não encontrado';
      setError(errorMessage);
      console.error('Erro ao buscar produto:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache.productDetails]);

  // Função para buscar produtos por categoria - estabilizada com useCallback
  const getProductsByCategory = useCallback(async (category) => {
    if (category === 'todos') {
      return await fetchProducts();
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getProductsByCategory(category);
      const categoryProducts = response.data.products;
      setProducts(categoryProducts);
      return categoryProducts;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar produtos da categoria';
      setError(errorMessage);
      console.error('Erro ao buscar produtos por categoria:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  // Função para pesquisar produtos - estabilizada com useCallback
  const searchProducts = useCallback(async (query, params = {}) => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.searchProducts(query.trim(), params);
      const searchResults = response.data.products;
      setProducts(searchResults);
      return searchResults;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro na pesquisa';
      setError(errorMessage);
      console.error('Erro ao pesquisar produtos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para obter produtos populares - estabilizada com useCallback
  const getPopularProducts = useCallback(async (limit = 6) => {
    // Verificar cache
    if (cache.popularProducts && cache.lastFetch && (Date.now() - cache.lastFetch < 5 * 60 * 1000)) {
      return cache.popularProducts;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productsAPI.getPopularProducts(limit);
      const popularProducts = response.data.products;
      
      // Atualizar cache
      setCache(prev => ({
        ...prev,
        popularProducts,
        lastFetch: Date.now()
      }));
      
      return popularProducts;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar produtos populares';
      setError(errorMessage);
      console.error('Erro ao buscar produtos populares:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cache.popularProducts, cache.lastFetch]);

  // Função para obter produtos em stock - estabilizada com useCallback
  const getInStockProducts = useCallback(async () => {
    const allProducts = await fetchProducts({ inStock: true });
    return allProducts.filter(product => product.inStock);
  }, [fetchProducts]);

  // Carregar produtos iniciais ao montar o componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Função para limpar cache (útil após updates administrativos)
  const clearCache = useCallback(() => {
    setCache({
      allProducts: null,
      popularProducts: null,
      productDetails: new Map(),
      lastFetch: null
    });
  }, []);

  // Valor do contexto memoizado para evitar re-renders desnecessários
  const value = useMemo(() => ({
    // Estado
    products,
    loading,
    error,
    categories,
    
    // Funções
    fetchProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getPopularProducts,
    getInStockProducts,
    clearCache
  }), [
    products,
    loading,
    error,
    categories,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getPopularProducts,
    getInStockProducts,
    clearCache
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;