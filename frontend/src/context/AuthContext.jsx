import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';

// Criar o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se utilizador está autenticado ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = apiUtils.getToken();
        const savedUser = apiUtils.getCurrentUser();

        if (token && savedUser) {
          // Verificar se token ainda é válido
          try {
            const response = await authAPI.getProfile();
            setUser(response.data.user);
          } catch (err) {
            // Token inválido, limpar dados
            apiUtils.clearAuth();
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Função de registo
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(userData);
      setUser(response.data.user);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro no registo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(credentials);
      setUser(response.data.user);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro no login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setLoading(true);

    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para alterar password
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.changePassword(passwordData);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao alterar password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar erros
  const clearError = () => {
    setError(null);
  };

  // Verificações de estado
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  // Valor do contexto
  const value = {
    // Estado
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isManager,

    // Funções
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,

    // Utilitários
    getCurrentUser: () => user,
    getToken: apiUtils.getToken,
    clearAuth: () => {
      apiUtils.clearAuth();
      setUser(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;