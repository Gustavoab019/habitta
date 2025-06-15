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
  Home
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  
  // Estados do formulário
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nif: '',
    company: ''
  });
  
  const [deliveryData, setDeliveryData] = useState({
    address: '',
    city: '',
    postalCode: '',
    district: '',
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

  // Formatação de preços
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Redirecionar se carrinho vazio
  useEffect(() => {
    if (itemCount === 0) {
      navigate('/produtos');
    }
  }, [itemCount, navigate]);

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
    switch (step) {
      case 1:
        return customerData.firstName && customerData.lastName && 
               customerData.email && customerData.phone;
      case 2:
        return deliveryData.address && deliveryData.city && 
               deliveryData.postalCode && deliveryData.district;
      case 3:
        return paymentData.method && paymentData.acceptTerms;
      default:
        return true;
    }
  };

  // Processar pedido
  const processOrder = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        customer: customerData,
        delivery: deliveryData,
        payment: paymentData,
        items: items,
        total: total,
        orderNumber: `HBT${Date.now()}`,
        timestamp: new Date().toISOString()
      };
      
      console.log('Pedido processado:', orderData);
      clearCart();
      setStep(4);
      
    } catch (error) {
      console.error('Erro no processamento:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Componente de Step Indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-light transition-all duration-300 ${
            step >= stepNumber 
              ? 'bg-stone-900 text-white' 
              : 'bg-stone-200 text-stone-500'
          }`}>
            {step > stepNumber ? <Check className="w-5 h-5" strokeWidth={1} /> : stepNumber}
          </div>
          {stepNumber < 4 && (
            <div className={`w-20 h-0.5 transition-all duration-300 ${
              step > stepNumber ? 'bg-stone-900' : 'bg-stone-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Dados do Cliente
  const CustomerDataStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-stone-900 mb-6">
          Dados do Cliente
        </h2>
        <p className="text-stone-600 font-light max-w-2xl mx-auto">
          Preencha os seus dados para processarmos o pedido
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-stone-700 font-light mb-2">Nome *</label>
            <input
              type="text"
              value={customerData.firstName}
              onChange={(e) => setCustomerData(prev => ({...prev, firstName: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              placeholder="João"
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Apelido *</label>
            <input
              type="text"
              value={customerData.lastName}
              onChange={(e) => setCustomerData(prev => ({...prev, lastName: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              placeholder="Silva"
            />
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-2">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1} />
            <input
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData(prev => ({...prev, email: e.target.value}))}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              placeholder="joao@exemplo.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-2">Telefone *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1} />
            <input
              type="tel"
              value={customerData.phone}
              onChange={(e) => setCustomerData(prev => ({...prev, phone: e.target.value}))}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              placeholder="+351 91 234 5678"
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
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              placeholder="123456789"
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Empresa (opcional)</label>
            <input
              type="text"
              value={customerData.company}
              onChange={(e) => setCustomerData(prev => ({...prev, company: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
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
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-stone-900 mb-6">
          Entrega e Instalação
        </h2>
        <p className="text-stone-600 font-light max-w-2xl mx-auto">
          Onde pretende receber e instalar o seu cortinado?
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <label className="block text-stone-700 font-light mb-2">Morada completa *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-stone-400 w-5 h-5" strokeWidth={1} />
            <textarea
              value={deliveryData.address}
              onChange={(e) => setDeliveryData(prev => ({...prev, address: e.target.value}))}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light resize-none"
              rows={3}
              placeholder="Rua, número, andar, porta..."
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
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              placeholder="Lisboa"
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Código Postal *</label>
            <input
              type="text"
              value={deliveryData.postalCode}
              onChange={(e) => setDeliveryData(prev => ({...prev, postalCode: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              placeholder="1200-123"
            />
          </div>
          <div>
            <label className="block text-stone-700 font-light mb-2">Distrito *</label>
            <select
              value={deliveryData.district}
              onChange={(e) => setDeliveryData(prev => ({...prev, district: e.target.value}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
            >
              <option value="">Selecionar</option>
              <option value="Lisboa">Lisboa</option>
              <option value="Porto">Porto</option>
              <option value="Coimbra">Coimbra</option>
              <option value="Braga">Braga</option>
              <option value="Setúbal">Setúbal</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-2">Data preferida para medição</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" strokeWidth={1} />
            <input
              type="date"
              value={deliveryData.measurementDate}
              onChange={(e) => setDeliveryData(prev => ({...prev, measurementDate: e.target.value}))}
              className="w-full pl-12 pr-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-3">Tipo de Instalação</label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-stone-300 rounded hover:border-stone-900 transition-colors duration-300">
              <input
                type="radio"
                name="installation"
                value="professional"
                checked={deliveryData.installationType === 'professional'}
                onChange={(e) => setDeliveryData(prev => ({...prev, installationType: e.target.value}))}
                className="mr-4"
              />
              <div className="flex-1">
                <span className="font-medium text-stone-900">Instalação Profissional</span>
                <p className="text-sm text-stone-600 font-light">Incluído no preço - Instalação por técnico especializado</p>
              </div>
            </label>
            <label className="flex items-center p-4 border border-stone-300 rounded hover:border-stone-900 transition-colors duration-300">
              <input
                type="radio"
                name="installation"
                value="self"
                checked={deliveryData.installationType === 'self'}
                onChange={(e) => setDeliveryData(prev => ({...prev, installationType: e.target.value}))}
                className="mr-4"
              />
              <div className="flex-1">
                <span className="font-medium text-stone-900">Auto-instalação</span>
                <p className="text-sm text-stone-600 font-light">Desconto de €50 - Com instruções detalhadas</p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-light mb-2">Notas especiais (opcional)</label>
          <textarea
            value={deliveryData.deliveryNotes}
            onChange={(e) => setDeliveryData(prev => ({...prev, deliveryNotes: e.target.value}))}
            className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light resize-none"
            rows={3}
            placeholder="Horários preferenciais, instruções especiais, etc..."
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Pagamento
  const PaymentStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-extralight tracking-wide text-stone-900 mb-6">
          Método de Pagamento
        </h2>
        <p className="text-stone-600 font-light max-w-2xl mx-auto">
          Escolha como pretende pagar o seu pedido
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Payment Methods */}
        <div className="space-y-4">
          <label className="flex items-center p-4 border border-stone-300 rounded hover:border-stone-900 transition-colors duration-300">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentData.method === 'card'}
              onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value}))}
              className="mr-4"
            />
            <CreditCard className="w-5 h-5 text-stone-600 mr-3" strokeWidth={1} />
            <div className="flex-1">
              <span className="font-medium text-stone-900">Cartão de Crédito/Débito</span>
              <p className="text-sm text-stone-600 font-light">Visa, Mastercard, American Express</p>
            </div>
          </label>

          <label className="flex items-center p-4 border border-stone-300 rounded hover:border-stone-900 transition-colors duration-300">
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

          <label className="flex items-center p-4 border border-stone-300 rounded hover:border-stone-900 transition-colors duration-300">
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
              <span className="font-medium text-stone-900">Transferência Bancária</span>
              <p className="text-sm text-stone-600 font-light">Desconto de 3% no valor total</p>
            </div>
          </label>
        </div>

        {/* Installments */}
        {paymentData.method === 'card' && (
          <div>
            <label className="block text-stone-700 font-light mb-3">Prestações (sem juros)</label>
            <select
              value={paymentData.installments}
              onChange={(e) => setPaymentData(prev => ({...prev, installments: parseInt(e.target.value)}))}
              className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
            >
              <option value={1}>1x {formatPrice(total)} (à vista)</option>
              <option value={2}>2x {formatPrice(total / 2)} sem juros</option>
              <option value={3}>3x {formatPrice(total / 3)} sem juros</option>
              <option value={6}>6x {formatPrice(total / 6)} sem juros</option>
            </select>
          </div>
        )}

        {/* Terms */}
        <div className="bg-stone-50 p-6 rounded">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={paymentData.acceptTerms}
              onChange={(e) => setPaymentData(prev => ({...prev, acceptTerms: e.target.checked}))}
              className="mt-1"
            />
            <div className="text-sm text-stone-600 font-light">
              <p>Aceito os <button type="button" className="text-stone-900 hover:underline font-medium">Termos e Condições</button> e a <button type="button" className="text-stone-900 hover:underline font-medium">Política de Privacidade</button>.</p>
              <p className="mt-2">Confirmo que li e aceito as condições de venda, incluindo prazo de entrega de 15-20 dias úteis após confirmação das medidas.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  // Step 4: Confirmação
  const ConfirmationStep = () => (
    <div className="text-center space-y-8">
      <div className="bg-green-50 border border-green-200 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
        <Check className="w-12 h-12 text-green-600" strokeWidth={1} />
      </div>
      
      <div>
        <h2 className="text-3xl font-light tracking-wide text-stone-900 mb-4">
          Pedido Confirmado!
        </h2>
        <p className="text-xl text-stone-600 font-light mb-8">
          Obrigado pela sua compra. Receberá um email de confirmação em breve.
        </p>
      </div>

      <div className="bg-stone-50 p-8 rounded max-w-md mx-auto">
        <h3 className="text-lg font-medium text-stone-900 mb-4">Próximos Passos</h3>
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs">1</div>
            <span className="text-stone-600 font-light">Contacto em 24h para confirmar medição</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs">2</div>
            <span className="text-stone-600 font-light">Produção: 15-20 dias úteis</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs">3</div>
            <span className="text-stone-600 font-light">Instalação profissional agendada</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="bg-stone-900 text-white px-12 py-4 font-light tracking-[0.25em] hover:bg-stone-800 transition-all duration-300"
      >
        VOLTAR AO INÍCIO
      </button>
    </div>
  );

  // Order Summary Sidebar
  const OrderSummary = () => (
    <div className="bg-stone-50 p-8 rounded-lg sticky top-8">
      <h3 className="text-xl font-light text-stone-900 mb-6">Resumo do Pedido</h3>
      
      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.customId || item.id} className="flex space-x-4">
            <div className="w-16 h-16 bg-stone-200 rounded overflow-hidden">
              <img
                src={item.images?.[0] || item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-light text-stone-900 truncate text-sm">
                {item.name}
              </h4>
              <p className="text-xs text-stone-500">
                {item.measurements?.width}×{item.measurements?.height}cm
              </p>
              <p className="text-sm font-light text-stone-900">
                {formatPrice(item.calculatedPrice || item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-stone-300 pt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">Subtotal:</span>
          <span className="font-light">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">Instalação:</span>
          <span className="font-light text-green-600">Incluída</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">Medição:</span>
          <span className="font-light text-green-600">Gratuita</span>
        </div>
        <div className="flex justify-between text-lg font-light border-t border-stone-300 pt-3">
          <span className="text-stone-900">Total:</span>
          <span className="text-stone-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 p-4 bg-white rounded border border-green-200">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-green-600" strokeWidth={1} />
          <span className="text-sm font-medium text-green-900">Compra Segura</span>
        </div>
        <p className="text-xs text-green-800 font-light">
          Pagamento protegido por encriptação SSL e processado pela Stripe
        </p>
      </div>
    </div>
  );

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <div className="bg-stone-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate('/produtos')}
            className="flex items-center text-stone-600 hover:text-stone-900 mb-6 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1} />
            <span className="font-light">Continuar a comprar</span>
          </button>
          
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.15em] text-stone-900 text-center">
            FINALIZAR COMPRA
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Step Indicator */}
        {step < 4 && <StepIndicator />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && <CustomerDataStep />}
            {step === 2 && <DeliveryStep />}
            {step === 3 && <PaymentStep />}
            {step === 4 && <ConfirmationStep />}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-12">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`px-8 py-3 font-light tracking-wide transition-all duration-300 ${
                    step === 1 
                      ? 'text-stone-400 cursor-not-allowed' 
                      : 'text-stone-700 hover:text-stone-900 border border-stone-300 hover:border-stone-900'
                  }`}
                >
                  Voltar
                </button>
                
                <button
                  onClick={step === 3 ? processOrder : nextStep}
                  disabled={!validateCurrentStep() || loading}
                  className={`px-12 py-3 font-light tracking-[0.25em] transition-all duration-300 ${
                    validateCurrentStep() && !loading
                      ? 'bg-stone-900 text-white hover:bg-stone-800'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'A processar...' : (step === 3 ? 'FINALIZAR PEDIDO' : 'CONTINUAR')}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
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