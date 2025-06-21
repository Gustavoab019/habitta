import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { apiUtils } from '../../services/api';

const ApiStatus = ({ showDetails = false, className = '' }) => {
  const [status, setStatus] = useState({
    available: null,
    loading: true,
    data: null,
    error: null,
    lastCheck: null,
    rateLimit: null
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Verificar status da API
  const checkApiStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await apiUtils.checkApiHealth();
      const rateLimit = apiUtils.getRateLimitInfo();
      
      setStatus({
        available: result.available,
        loading: false,
        data: result.data,
        error: result.error,
        lastCheck: new Date(),
        rateLimit
      });
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        available: false,
        loading: false,
        error: error.message,
        lastCheck: new Date()
      }));
    }
  };

  // Verificar status inicial e setup interval
  useEffect(() => {
    checkApiStatus();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development' && !showDetails) {
    return null;
  }

  const getStatusIcon = () => {
    if (status.loading) return <Activity className="w-4 h-4 animate-spin" />;
    if (status.available === null) return <Clock className="w-4 h-4" />;
    if (status.available) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (status.loading) return 'border-blue-300 bg-blue-50';
    if (status.available === null) return 'border-gray-300 bg-gray-50';
    if (status.available) return 'border-green-300 bg-green-50';
    return 'border-red-300 bg-red-50';
  };

  const getStatusText = () => {
    if (status.loading) return 'Verificando...';
    if (status.available === null) return 'Aguardando';
    if (status.available) return 'API Online';
    return 'API Offline';
  };

  return (
    <div className={`${className}`}>
      
      {/* Status Badge */}
      <div 
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${getStatusColor()}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Clique para expandir detalhes"
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {status.lastCheck && (
          <span className="text-xs opacity-60">
            {status.lastCheck.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Detalhes Expandidos */}
      {(isExpanded || showDetails) && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          
          {/* Informações da API */}
          {status.data && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">API Info</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 font-medium text-green-600">{status.data.status}</span>
                </div>
                <div>
                  <span className="text-gray-500">Ambiente:</span>
                  <span className="ml-2 font-medium">{status.data.environment}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Mensagem:</span>
                  <span className="ml-2 font-medium">{status.data.message}</span>
                </div>
              </div>
            </div>
          )}

          {/* Rate Limiting Info */}
          {status.data?.rateLimit && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Rate Limiting</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${status.data.rateLimit.enabled ? 'text-orange-600' : 'text-green-600'}`}>
                    {status.data.rateLimit.enabled ? 'Ativo' : 'Desabilitado'}
                  </span>
                </div>
                {status.data.rateLimit.limits && (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Geral:</span>
                      <span className="font-medium">{status.data.rateLimit.limits.general}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Auth:</span>
                      <span className="font-medium">{status.data.rateLimit.limits.auth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pedidos:</span>
                      <span className="font-medium">{status.data.rateLimit.limits.orders}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rate Limit Atual */}
          {status.rateLimit && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Rate Limit Atual</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Restantes:</span>
                  <span className="ml-2 font-medium">{status.rateLimit.remaining || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Limite:</span>
                  <span className="ml-2 font-medium">{status.rateLimit.limit || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Reset:</span>
                  <span className="ml-2 font-medium">
                    {status.rateLimit.reset ? new Date(status.rateLimit.reset * 1000).toLocaleTimeString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Erro */}
          {status.error && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-red-900 mb-2">Erro</h4>
              <p className="text-xs text-red-700 bg-red-50 p-2 rounded">
                {status.error}
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="flex space-x-2">
            <button
              onClick={checkApiStatus}
              disabled={status.loading}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.loading ? 'Verificando...' : 'Verificar Novamente'}
            </button>
            
            <button
              onClick={() => window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/health`, '_blank')}
              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Abrir Health Check
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-2 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex justify-between items-center">
              <span>API URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</span>
              <span>Atualizado a cada 30s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente simplificado para mostrar na interface
export const ApiStatusIndicator = () => {
  const [status, setStatus] = useState({ available: null, loading: true });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await apiUtils.checkApiHealth();
        setStatus({ available: result.available, loading: false });
      } catch {
        setStatus({ available: false, loading: false });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // 1 minuto
    
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg ${
        status.loading ? 'bg-blue-500' : 
        status.available ? 'bg-green-500' : 'bg-red-500'
      } text-white`}>
        {status.loading ? (
          <Activity className="w-4 h-4 animate-spin" />
        ) : status.available ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-xs font-medium">
          {status.loading ? 'Verificando' : status.available ? 'API Online' : 'API Offline'}
        </span>
      </div>
    </div>
  );
};

export default ApiStatus;