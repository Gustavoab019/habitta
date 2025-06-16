import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CreditCard,
  Shield,
  Check,
  Home,
  AlertCircle,
  User,
  Package,
  CheckCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    items, 
    itemCount, 
    getDetailedTotals, 
    createOrder, 
    loading: cartLoading, 
    error: cartError,
    clearError
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  // Estados do formulário
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  
  // Calcular totais detalhados
  const totals = getDetailedTotals();
  
  const [customerData, setCustomerData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nif: user?.nif || '',
    company: user?.company || ''
  });
  
  const [deliveryData, setDeliveryData] = useState({
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    district: user?.address?.district || '',
    deliveryNotes: '',
    installationDate: '',
    installationType: 'professional',
    measurementDate: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    installments: 1,
    acceptTerms: false
  });

  // Preencher dados do utilizador se logado
  useEffect(() => {
    if (user) {
      setCustomerData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        nif: user.nif || prev.nif,
        company: user.company || prev.company
      }));

      if (user.address) {
        setDeliveryData(prev => ({
          ...prev,
          address: user.address.street || prev.address,
          city: user.address.city || prev.city,
          postalCode: user.address.postalCode || prev.postalCode,
          district: user.address.district || prev.district
        }));
      }
    }
  }, [user]);

  // Redirecionar se carrinho vazio
  useEffect(() => {
    if (itemCount === 0 && !orderResult) {
      navigate('/produtos');
    }
  }, [itemCount, navigate, orderResult]);

  // Limpar erros quando step muda
  useEffect(() => {
    setError(null);
    clearError();
  }, [step, clearError]);

  // Formatação de preços
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Funções de navegação entre steps
  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Validação de cada step
  const validateCurrentStep = () => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!customerData.firstName || !customerData.lastName || 
            !customerData.email || !customerData.phone) {
          setError('Por favor, preencha todos os campos obrigatórios');
          return false;
        }
        // Validação de email básica
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerData.email)) {
          setError('Por favor, insira um email válido');
          return false;
        }
        // Validação de telefone português
        const phoneRegex = /^(\+351|00351)?[0-9]{9}$/;
        if (!phoneRegex.test(customerData.phone.replace(/\s/g, ''))) {
          setError('Por favor, insira um telefone português válido');
          return false;
        }
        return true;
        
      case 2:
        if (!deliveryData.address || !deliveryData.city || 
            !deliveryData.postalCode || !deliveryData.district) {
          setError('Por favor, preencha todos os campos de entrega obrigatórios');
          return false;
        }
        // Validação de código postal português
        const postalRegex = /^[0-9]{4}-[0-9]{3}$/;
        if (!postalRegex.test(deliveryData.postalCode)) {
          setError('Código postal deve ter formato 0000-000');
          return false;
        }
        return true;
        
      case 3:
        if (!paymentData.method) {
          setError('Por favor, selecione um método de pagamento');
          return false;
        }
        if (!paymentData.acceptTerms) {
          setError('Por favor, aceite os termos e condições para continuar');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  // Processar pedido
  const processOrder = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Preparar dados do pedido
      const orderData = {
        customer: isAuthenticated ? user.id : undefined,
        customerInfo: customerData,
        deliveryAddress: {
          street: deliveryData.address,
          city: deliveryData.city,
          postalCode: deliveryData.postalCode,
          district: deliveryData.district,
          country: 'Portugal',
          notes: deliveryData.deliveryNotes
        },
        scheduling: {
          measurementDate: {
            requested: deliveryData.measurementDate ? new Date(deliveryData.measurementDate) : undefined
          },
          installationDate: {
            requested: deliveryData.installationDate ? new Date(deliveryData.installationDate) : undefined
          },
          notes: `Tipo de instalação: ${deliveryData.installationType === 'professional' ? 'Profissional' : 'Expressa'}`
        },
        payment: {
          method: paymentData.method,
          installments: paymentData.installments
        },
        totals: {
          shippingCost: totals.shippingCost,
          installationCost: totals.installationCost,
          discount: totals.discount,
          tax: totals.tax
        },
        notes: {
          customer: deliveryData.deliveryNotes,
          internal: `Criado via frontend. ${isAuthenticated ? 'Utilizador logado' : 'Utilizador convidado'}`
        }
      };
      
      console.log('📤 Enviando pedido:', orderData);
      
      const response = await createOrder(orderData);
      
      console.log('✅ Pedido criado:', response);
      
      setOrderResult(response.data.order);
      setStep(4);
      
    } catch (err) {
      console.error('❌ Erro ao processar pedido:', err);
      setError(err.message || 'Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Componente de Step Indicator
  const StepIndicator = () => {
    const steps = [
      { number: 1, title: 'Dados', icon: User },
      { number: 2, title: 'Entrega', icon: Home },
      { number: 3, title: 'Pagamento', icon: CreditCard },
      { number: 4, title: 'Confirmação', icon: CheckCircle }
    ];

    return (
      <div className="mb-16">
        <div className="flex items-center justify-center">
          {steps.map((stepItem, index) => {
            const IconComponent = stepItem.icon;
            const isActive = step >= stepItem.number;
            const isCurrent = step === stepItem.number;
            
            return (
              <div key={stepItem.number} className="flex items-center">
                <div className={`relative flex flex-col items-center ${
                  isCurrent ? 'text-stone-900' : isActive ? 'text-stone-700' : 'text-stone-400'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isActive 
                      ? 'bg-stone-900 border-stone-900 text-white' 
                      : 'bg-white border-stone-300 text-stone-400'
                  }`}>
                    {step > stepItem.number ? (
                      <Check className="w-6 h-6" strokeWidth={2} />
                    ) : (
                      <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                    )}
                  </div>
                  <span className={`text-xs font-light mt-2 tracking-wide ${
                    isCurrent ? 'text-stone-900' : 'text-stone-500'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-4 transition-all duration-300 ${
                    step > stepItem.number ? 'bg-stone-900' : 'bg-stone-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Error Alert Component
  const ErrorAlert = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" strokeWidth={1.5} />
        <span className="text-red-800 font-medium">{message}</span>
      </div>
    </div>
  );

  // Step 1: Dados do Cliente
  const CustomerDataStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-4">
          Dados do Cliente
        </h2>
        <p className="text-stone-600 font-light max-w-2xl mx-auto">
          {isAuthenticated ? 'Confirme os seus dados para continuar' : 'Preencha os seus dados para processarmos o pedido'}
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="max-w-2xl mx-auto space-y-6">
        {isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <User className="w-5 h-5 text-blue-600 mr-2" strokeWidth={1.5} />
              <span className="text-blue-800 font-medium">Utilizador autenticado: {user.email}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-stone-700 font-light mb-2">Nome *</label>
            <input
              type="text"
              value={customerData.firstName}
              onChange={(e) => setCustomerData(prev => ({...prev, firstName: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="João"
              required
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Apelido *</label>
            <input
              type="text"
              value={customerData.lastName}
              onChange={(e) => setCustomerData(prev => ({...prev, lastName: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="Silva"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-2">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1.5} />
            <input
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="joao@exemplo.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-2">Telefone *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1.5} />
            <input
              type="tel"
              value={customerData.phone}
              onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="+351 91 234 5678"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-stone-700 font-light mb-2">NIF (opcional)</label>
            <input
              type="text"
              value={customerData.nif}
              onChange={(e) => setCustomerData(prev => ({...prev, nif: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="123456789"
              maxLength="9"
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Empresa (opcional)</label>
            <input
              type="text"
              value={customerData.company}
              onChange={(e) => setCustomerData(prev => ({...prev, company: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="Empresa Lda"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Entrega e Instalação
  const DeliveryStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-4">
          Entrega e Instalação
        </h2>
        <p className="text-stone-600 font-light max-w-2xl mx-auto">
          Onde pretende receber e instalar o seu cortinado hoteleiro?
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-stone-700 font-light mb-2">Morada completa *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-stone-400 w-5 h-5" strokeWidth={1.5} />
            <textarea
              value={deliveryData.address}
              onChange={(e) => setDeliveryData(prev => ({...prev, address: e.target.value}))}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light resize-none transition-colors"
              rows={3}
              placeholder="Rua, número, andar, porta..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-stone-700 font-light mb-2">Cidade *</label>
            <input
              type="text"
              value={deliveryData.city}
              onChange={(e) => setDeliveryData(prev => ({...prev, city: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="Lisboa"
              required
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Código Postal *</label>
            <input
              type="text"
              value={deliveryData.postalCode}
              onChange={(e) => setDeliveryData(prev => ({...prev, postalCode: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              placeholder="1200-123"
              pattern="[0-9]{4}-[0-9]{3}"
              required
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Distrito *</label>
            <select
              value={deliveryData.district}
              onChange={(e) => setDeliveryData(prev => ({...prev, district: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
              required
            >
              <option value="">Selecionar distrito</option>
              <option value="Aveiro">Aveiro</option>
              <option value="Beja">Beja</option>
              <option value="Braga">Braga</option>
              <option value="Bragança">Bragança</option>
              <option value="Castelo Branco">Castelo Branco</option>
              <option value="Coimbra">Coimbra</option>
              <option value="Évora">Évora</option>
              <option value="Faro">Faro</option>
              <option value="Guarda">Guarda</option>
              <option value="Leiria">Leiria</option>
              <option value="Lisboa">Lisboa</option>
              <option value="Portalegre">Portalegre</option>
              <option value="Porto">Porto</option>
              <option value="Santarém">Santarém</option>
              <option value="Setúbal">Setúbal</option>
              <option value="Viana do Castelo">Viana do Castelo</option>
              <option value="Vila Real">Vila Real</option>
              <option value="Viseu">Viseu</option>
              <option value="Açores">Açores</option>
              <option value="Madeira">Madeira</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-stone-700 font-light mb-2">Data preferida para medição</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1.5} />
              <input
                type="date"
                value={deliveryData.measurementDate}
                onChange={(e) => setDeliveryData(prev => ({...prev, measurementDate: e.target.value}))}
                className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Data preferida para instalação</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1.5} />
              <input
                type="date"
                value={deliveryData.installationDate}
                onChange={(e) => setDeliveryData(prev => ({...prev, installationDate: e.target.value}))}
                className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-3">Tipo de Instalação</label>
          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
              deliveryData.installationType === 'professional' 
                ? 'border-stone-900 bg-stone-50' 
                : 'border-stone-300 hover:border-stone-600'
            }`}>
              <input
                type="radio"
                name="installation"
                value="professional"
                checked={deliveryData.installationType === 'professional'}
                onChange={(e) => setDeliveryData(prev => ({...prev, installationType: e.target.value}))}
                className="mr-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-900">Instalação Profissional</span>
                  <span className="text-green-600 font-medium text-sm">Incluído</span>
                </div>
                <p className="text-sm text-stone-600 font-light mt-1">
                  Instalação por técnico especializado certificado
                </p>
              </div>
            </label>
            
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
              deliveryData.installationType === 'express' 
                ? 'border-stone-900 bg-stone-50' 
                : 'border-stone-300 hover:border-stone-600'
            }`}>
              <input
                type="radio"
                name="installation"
                value="express"
                checked={deliveryData.installationType === 'express'}
                onChange={(e) => setDeliveryData(prev => ({...prev, installationType: e.target.value}))}
                className="mr-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-900">Instalação Expressa</span>
                  <span className="text-amber-600 font-medium text-sm">+€150</span>
                </div>
                <p className="text-sm text-stone-600 font-light mt-1">
                  Instalação em 48h após confirmação das medidas
                </p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-2">Observações (opcional)</label>
          <textarea
            value={deliveryData.deliveryNotes}
            onChange={(e) => setDeliveryData(prev => ({...prev, deliveryNotes: e.target.value}))}
            className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light resize-none transition-colors"
            rows={3}
            placeholder="Horários preferenciais, instruções especiais, código de acesso..."
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Pagamento
  const PaymentStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-4">
          Método de Pagamento
        </h2>
        <p className="text-stone-600 font-light max-w-2xl mx-auto">
          Escolha como pretende pagar o seu pedido
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Payment Methods */}
        <div>
          <label className="block text-stone-700 font-light mb-3">Método de Pagamento</label>
          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
              paymentData.method === 'card' 
                ? 'border-stone-900 bg-stone-50' 
                : 'border-stone-300 hover:border-stone-600'
            }`}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentData.method === 'card'}
                onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value}))}
                className="mr-4"
              />
              <CreditCard className="w-5 h-5 text-stone-600 mr-3" strokeWidth={1.5} />
              <div className="flex-1">
                <span className="font-medium text-stone-900">Cartão de Crédito/Débito</span>
                <p className="text-sm text-stone-600 font-light">Visa, Mastercard, American Express</p>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
              paymentData.method === 'mbway' 
                ? 'border-stone-900 bg-stone-50' 
                : 'border-stone-300 hover:border-stone-600'
            }`}>
              <input
                type="radio"
                name="payment"
                value="mbway"
                checked={paymentData.method === 'mbway'}
                onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value}))}
                className="mr-4"
              />
              <div className="w-5 h-5 bg-red-600 rounded mr-3 flex items-center justify-center">
                <span className="text-white text-xs font-bold">MB</span>
              </div>
              <div className="flex-1">
                <span className="font-medium text-stone-900">MB Way</span>
                <p className="text-sm text-stone-600 font-light">Pagamento através da app MB Way</p>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
              paymentData.method === 'transfer' 
                ? 'border-stone-900 bg-stone-50' 
                : 'border-stone-300 hover:border-stone-600'
            }`}>
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={paymentData.method === 'transfer'}
                onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value}))}
                className="mr-4"
              />
              <div className="w-5 h-5 bg-green-600 rounded mr-3"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-900">Transferência Bancária</span>
                  <span className="text-green-600 font-medium text-sm">-3%</span>
                </div>
                <p className="text-sm text-stone-600 font-light">Desconto de 3% no valor total</p>
              </div>
            </label>
          </div>
        </div>

        {/* Installments */}
        {paymentData.method === 'card' && (
          <div>
            <label className="block text-stone-700 font-light mb-3">Prestações (sem juros)</label>
            <select
              value={paymentData.installments}
              onChange={(e) => setPaymentData(prev => ({...prev, installments: parseInt(e.target.value)}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light transition-colors"
            >
              <option value={1}>1x {formatPrice(totals.total)} (pagamento único)</option>
              <option value={2}>2x {formatPrice(totals.total / 2)} (sem juros)</option>
              <option value={3}>3x {formatPrice(totals.total / 3)} (sem juros)</option>
              <option value={6}>6x {formatPrice(totals.total / 6)} (sem juros)</option>
            </select>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox"
             checked={paymentData.acceptTerms}
             onChange={(e) => setPaymentData(prev => ({...prev, acceptTerms: e.target.checked}))}
             className="mt-1 w-4 h-4"
             required
           />
           <div className="text-sm text-stone-600 font-light leading-relaxed">
             <p className="mb-2">
               Aceito os{' '}
               <button 
                 type="button" 
                 className="text-stone-900 hover:underline font-medium"
                 onClick={() => window.open('/termos', '_blank')}
               >
                 Termos e Condições
               </button>
               {' '}e a{' '}
               <button 
                 type="button" 
                 className="text-stone-900 hover:underline font-medium"
                 onClick={() => window.open('/privacidade', '_blank')}
               >
                 Política de Privacidade
               </button>
               .
             </p>
             <p className="text-xs text-stone-500">
               Confirmo que li e aceito as condições de venda, incluindo prazo de entrega de 15-20 dias úteis após confirmação das medidas.
             </p>
           </div>
         </label>
       </div>

       {/* Payment Summary */}
       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
         <div className="flex items-center mb-3">
           <Shield className="w-5 h-5 text-blue-600 mr-2" strokeWidth={1.5} />
           <span className="text-blue-900 font-medium">Resumo do Pagamento</span>
         </div>
         <div className="space-y-2 text-sm">
           <div className="flex justify-between">
             <span className="text-blue-800">Método:</span>
             <span className="text-blue-900 font-medium">
               {paymentData.method === 'card' && 'Cartão de Crédito/Débito'}
               {paymentData.method === 'mbway' && 'MB Way'}
               {paymentData.method === 'transfer' && 'Transferência Bancária'}
             </span>
           </div>
           {paymentData.method === 'card' && paymentData.installments > 1 && (
             <div className="flex justify-between">
               <span className="text-blue-800">Prestações:</span>
               <span className="text-blue-900 font-medium">
                 {paymentData.installments}x {formatPrice(totals.total / paymentData.installments)}
               </span>
             </div>
           )}
           <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
             <span className="text-blue-800 font-medium">Total a pagar:</span>
             <span className="text-blue-900 font-bold">
               {formatPrice(paymentData.method === 'transfer' ? totals.total * 0.97 : totals.total)}
             </span>
           </div>
           {paymentData.method === 'transfer' && (
             <p className="text-xs text-green-700 bg-green-50 rounded p-2 mt-2">
               💰 Poupa {formatPrice(totals.total * 0.03)} com transferência bancária!
             </p>
           )}
         </div>
       </div>
     </div>
   </div>
 );

 // Step 4: Confirmação
 const ConfirmationStep = () => (
   <div className="text-center space-y-8 max-w-2xl mx-auto">
     <div className="bg-green-50 border border-green-200 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
       <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={1.5} />
     </div>
     
     <div>
       <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-4">
         Pedido Confirmado!
       </h2>
       <p className="text-xl text-stone-600 font-light mb-8">
         Obrigado pela sua compra. O seu pedido foi criado com sucesso.
       </p>
       
       {orderResult && (
         <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-8">
           <h3 className="text-lg font-medium text-stone-900 mb-4">Detalhes do Pedido</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
             <div className="space-y-2">
               <div className="flex justify-between">
                 <span className="text-stone-600">Número:</span>
                 <span className="font-medium text-stone-900">{orderResult.orderNumber}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-stone-600">Total:</span>
                 <span className="font-medium text-stone-900">{formatPrice(orderResult.total)}</span>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between">
                 <span className="text-stone-600">Estado:</span>
                 <span className="text-amber-600 font-medium">Pagamento Pendente</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-stone-600">Items:</span>
                 <span className="font-medium text-stone-900">{orderResult.items?.length || itemCount}</span>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>

     <div className="bg-stone-50 border border-stone-200 rounded-lg p-8">
       <h3 className="text-lg font-medium text-stone-900 mb-6">Próximos Passos</h3>
       <div className="space-y-4">
         <div className="flex items-start space-x-4 text-left">
           <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">1</div>
           <div>
             <h4 className="font-medium text-stone-900">Confirmação de Pagamento</h4>
             <p className="text-stone-600 font-light text-sm">
               Receberá instruções de pagamento por email em poucos minutos
             </p>
           </div>
         </div>
         <div className="flex items-start space-x-4 text-left">
           <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">2</div>
           <div>
             <h4 className="font-medium text-stone-900">Agendamento de Medição</h4>
             <p className="text-stone-600 font-light text-sm">
               Contacto em 24h para agendar a medição gratuita ao domicílio
             </p>
           </div>
         </div>
         <div className="flex items-start space-x-4 text-left">
           <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">3</div>
           <div>
             <h4 className="font-medium text-stone-900">Produção e Instalação</h4>
             <p className="text-stone-600 font-light text-sm">
               Produção em 15-20 dias úteis + instalação profissional agendada
             </p>
           </div>
         </div>
       </div>
     </div>

     <div className="flex flex-col sm:flex-row gap-4 justify-center">
       <button
         onClick={() => navigate('/')}
         className="bg-stone-900 text-white px-8 py-3 font-light tracking-wide hover:bg-stone-800 transition-all duration-300"
       >
         VOLTAR AO INÍCIO
       </button>
       {isAuthenticated && (
         <button
           onClick={() => navigate('/perfil/pedidos')}
           className="border border-stone-900 text-stone-900 px-8 py-3 font-light tracking-wide hover:bg-stone-900 hover:text-white transition-all duration-300"
         >
           MEUS PEDIDOS
         </button>
       )}
     </div>

     <div className="text-xs text-stone-500 space-y-1">
       <p>📧 Receberá um email de confirmação em breve</p>
       <p>📞 Para questões urgentes: +351 21 123 4567</p>
     </div>
   </div>
 );

 // Order Summary Sidebar
 const OrderSummary = () => (
   <div className="bg-stone-50 rounded-lg p-6 sticky top-8">
     <h3 className="text-lg font-medium text-stone-900 mb-6 flex items-center">
       <Package className="w-5 h-5 mr-2" strokeWidth={1.5} />
       Resumo do Pedido
     </h3>
     
     {/* Items */}
     <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
       {items.map((item) => (
         <div key={item.customId || item.id} className="flex space-x-3">
           <div className="w-12 h-12 bg-stone-200 rounded overflow-hidden flex-shrink-0">
             <img
               src={item.images?.[0]?.url || item.images?.[0] || item.image}
               alt={item.name}
               className="w-full h-full object-cover"
               onError={(e) => {
                 e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
               }}
             />
           </div>
           <div className="flex-1 min-w-0">
             <h4 className="font-medium text-stone-900 text-sm truncate">
               {item.name}
             </h4>
             {item.measurements && (
               <p className="text-xs text-stone-500">
                 {item.measurements.width}×{item.measurements.height}cm
                 {item.measurements.panels > 1 && ` (${item.measurements.panels} painéis)`}
               </p>
             )}
             <div className="flex justify-between items-center mt-1">
               <span className="text-xs text-stone-500">Qtd: {item.quantity}</span>
               <span className="text-sm font-medium text-stone-900">
                 {formatPrice((item.calculatedPrice || item.price) * item.quantity)}
               </span>
             </div>
           </div>
         </div>
       ))}
     </div>

     {/* Totals */}
     <div className="border-t border-stone-300 pt-4 space-y-3">
       <div className="flex justify-between text-sm">
         <span className="text-stone-600">Subtotal:</span>
         <span className="font-medium">{formatPrice(totals.subtotal)}</span>
       </div>
       
       {totals.installationCost > 0 && (
         <div className="flex justify-between text-sm">
           <span className="text-stone-600">Instalação Expressa:</span>
           <span className="font-medium">{formatPrice(totals.installationCost)}</span>
         </div>
       )}
       
       <div className="flex justify-between text-sm">
         <span className="text-stone-600">Envio:</span>
         <span className="font-medium text-green-600">Gratuito</span>
       </div>
       
       <div className="flex justify-between text-sm">
         <span className="text-stone-600">Instalação:</span>
         <span className="font-medium text-green-600">
           {deliveryData.installationType === 'express' ? 'Expressa' : 'Incluída'}
         </span>
       </div>

       {paymentData.method === 'transfer' && (
         <div className="flex justify-between text-sm">
           <span className="text-stone-600">Desconto (3%):</span>
           <span className="font-medium text-green-600">-{formatPrice(totals.total * 0.03)}</span>
         </div>
       )}
       
       <div className="border-t border-stone-300 pt-3">
         <div className="flex justify-between">
           <span className="font-medium text-stone-900">Total:</span>
           <span className="text-xl font-bold text-stone-900">
             {formatPrice(paymentData.method === 'transfer' ? totals.total * 0.97 : totals.total)}
           </span>
         </div>
       </div>
     </div>

     {/* Security Badge */}
     <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
       <div className="flex items-center text-green-800">
         <Shield className="w-4 h-4 mr-2" strokeWidth={1.5} />
         <span className="text-sm font-medium">Compra 100% Segura</span>
       </div>
       <p className="text-xs text-green-700 mt-1">
         Dados protegidos e transação segura
       </p>
     </div>
   </div>
 );

 // Loading Screen
 if (itemCount === 0 && !orderResult) {
   return (
     <div className="min-h-screen bg-stone-50 flex items-center justify-center">
       <div className="text-center">
         <Package className="w-16 h-16 text-stone-400 mx-auto mb-4" strokeWidth={1} />
         <h2 className="text-2xl font-light text-stone-900 mb-4">Carrinho Vazio</h2>
         <p className="text-stone-600 mb-6">Adicione produtos ao carrinho para continuar</p>
         <button
           onClick={() => navigate('/produtos')}
           className="bg-stone-900 text-white px-8 py-3 font-light tracking-wide hover:bg-stone-800 transition-all duration-300"
         >
           VER PRODUTOS
         </button>
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-white">
     
     {/* Header */}
     <div className="bg-stone-50 py-8 border-b border-stone-200">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between mb-6">
           <button 
             onClick={() => navigate(-1)}
             className="flex items-center text-stone-600 hover:text-stone-900 transition-colors duration-300"
           >
             <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
             <span className="font-light">Voltar</span>
           </button>
           
           {orderResult && (
             <div className="text-right">
               <p className="text-sm text-stone-600">Pedido criado</p>
               <p className="font-medium text-stone-900">{orderResult.orderNumber}</p>
             </div>
           )}
         </div>
         
         <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.15em] text-stone-900 text-center">
           FINALIZAR COMPRA
         </h1>
       </div>
     </div>

     {/* Content */}
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       
       {/* Step Indicator */}
       <StepIndicator />

       {/* Global Error */}
       {cartError && (
         <div className="max-w-4xl mx-auto mb-8">
           <ErrorAlert message={cartError} />
         </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         {/* Main Content */}
         <div className="lg:col-span-2">
           {step === 1 && <CustomerDataStep />}
           {step === 2 && <DeliveryStep />}
           {step === 3 && <PaymentStep />}
           {step === 4 && <ConfirmationStep />}

           {/* Navigation Buttons */}
           {step < 4 && (
             <div className="flex justify-between items-center mt-12 pt-8 border-t border-stone-200">
               <button
                 onClick={prevStep}
                 disabled={step === 1}
                 className={`flex items-center px-6 py-3 font-light tracking-wide transition-all duration-300 ${
                   step === 1 
                     ? 'text-stone-400 cursor-not-allowed' 
                     : 'text-stone-700 hover:text-stone-900 border border-stone-300 hover:border-stone-900'
                 }`}
               >
                 <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                 Voltar
               </button>
               
               <button
                 onClick={step === 3 ? processOrder : nextStep}
                 disabled={!validateCurrentStep() || loading || cartLoading}
                 className={`flex items-center px-8 py-3 font-light tracking-wide transition-all duration-300 ${
                   validateCurrentStep() && !loading && !cartLoading
                     ? 'bg-stone-900 text-white hover:bg-stone-800'
                     : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                 }`}
               >
                 {loading || cartLoading ? (
                   <>
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                     A processar...
                   </>
                 ) : (
                   <>
                     {step === 3 ? 'FINALIZAR PEDIDO' : 'CONTINUAR'}
                     {step < 3 && <ArrowLeft className="w-4 h-4 ml-2 rotate-180" strokeWidth={1.5} />}
                   </>
                 )}
               </button>
             </div>
           )}
         </div>

         {/* Order Summary Sidebar */}
         {step < 4 && (
           <div className="lg:col-span-1">
             <OrderSummary />
           </div>
         )}
       </div>
     </div>
   </div>
 );
};

export default Checkout;