import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Truck, 
  Calculator,
  Heart,
  Share2,
  Check,
  Info,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Home
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import MeasurementGuide from '../components/products/MeasurementGuide';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addItem } = useCart();
  
  const product = getProductById(id);
  
  // Estados do produto
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Estados das medidas
  const [measurements, setMeasurements] = useState({
    width: '',
    height: '',
    panels: 1,
    installationType: 'professional',
    includeSheer: false,
    mounting: 'ceiling'
  });
  
  // Estados de cálculo
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [area, setArea] = useState(0);
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);

  // Cálculo automático do preço
  useEffect(() => {
    if (product && measurements.width && measurements.height) {
      const widthM = parseFloat(measurements.width) / 100; // cm para metros
      const heightM = parseFloat(measurements.height) / 100;
      const calculatedArea = widthM * heightM * measurements.panels;
      
      let basePrice = product.price * calculatedArea;
      
      // Acréscimos
      if (measurements.includeSheer) basePrice += calculatedArea * 89; // preço do sheer
      if (measurements.installationType === 'express') basePrice += 150;
      if (measurements.mounting === 'wall') basePrice += 50;
      
      setArea(calculatedArea);
      setCalculatedPrice(basePrice);
    } else {
      setCalculatedPrice(0);
      setArea(0);
    }
  }, [measurements, product]);

  // Funções auxiliares
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleMeasurementChange = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddToCart = () => {
    if (!measurements.width || !measurements.height) {
      alert('Por favor, insira as medidas antes de adicionar ao carrinho');
      return;
    }

    const cartItem = {
      ...product,
      measurements,
      calculatedPrice,
      area,
      customId: `${product.id}-${Date.now()}`, // ID único para o carrinho
      price: calculatedPrice // Preço calculado substitui o preço base
    };

    addItem(cartItem);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Se produto não encontrado
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-stone-900 mb-4">Produto não encontrado</h2>
          <Link to="/produtos" className="text-stone-600 hover:text-stone-900">
            ← Voltar aos produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Breadcrumb */}
      <div className="bg-stone-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-stone-600 font-light">
            <Link to="/" className="hover:text-stone-900">Início</Link>
            <span className="mx-2">•</span>
            <Link to="/produtos" className="hover:text-stone-900">Produtos</Link>
            <span className="mx-2">•</span>
            <span className="text-stone-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-stone-600 hover:text-stone-900 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1} />
          <span className="font-light">Voltar</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Product Images */}
          <div className="space-y-6">
            
            {/* Main Image */}
            <div className="relative bg-stone-100 aspect-square overflow-hidden">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" strokeWidth={1} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" strokeWidth={1} />
                  </button>
                </>
              )}

              {/* Badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-stone-900 text-white text-xs tracking-wider px-3 py-2 font-light">
                  {product.hotelPartner}
                </span>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-stone-100 overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-stone-900' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-stone-500 font-light tracking-wide">
                  {product.hotelPartner}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isFavorite ? 'bg-red-50 text-red-500' : 'text-stone-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className="w-5 h-5" strokeWidth={1} fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 text-stone-400 hover:text-stone-600 transition-colors duration-300">
                    <Share2 className="w-5 h-5" strokeWidth={1} />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extralight tracking-wide text-stone-900 mb-6">
                {product.name}
              </h1>
              
              <p className="text-lg text-stone-600 font-light leading-relaxed mb-8">
                {product.fullDescription || product.description}
              </p>

              {/* Base Price */}
              <div className="border border-stone-200 p-6 bg-stone-50">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-light text-stone-600">Preço base:</span>
                  <span className="text-2xl font-light text-stone-900">
                    {formatPrice(product.price)}/m²
                  </span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && (
              <div>
                <h3 className="text-lg font-light text-stone-900 mb-4">Cor disponível:</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`px-4 py-2 border transition-all duration-300 ${
                        selectedColor === index 
                          ? 'border-stone-900 bg-stone-900 text-white' 
                          : 'border-stone-300 hover:border-stone-600'
                      }`}
                    >
                      <span className="text-sm font-light">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Measurement Calculator */}
            <div className="border border-stone-200 p-8 bg-stone-50">
              <div className="flex items-center mb-6">
                <Calculator className="w-5 h-5 text-stone-600 mr-3" strokeWidth={1} />
                <h3 className="text-xl font-light text-stone-900">Calculadora de Medidas</h3>
                <button 
                  onClick={() => setShowMeasurementGuide(true)}
                  className="ml-auto text-stone-500 hover:text-stone-700 transition-colors duration-300"
                >
                  <Info className="w-4 h-4" strokeWidth={1} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-stone-700 font-light mb-2">
                    Largura (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="ex: 300"
                    value={measurements.width}
                    onChange={(e) => handleMeasurementChange('width', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-light mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    placeholder="ex: 250"
                    value={measurements.height}
                    onChange={(e) => handleMeasurementChange('height', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
                  />
                </div>
              </div>

              {/* Number of Panels */}
              <div className="mb-6">
                <label className="block text-stone-700 font-light mb-3">
                  Número de Painéis
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleMeasurementChange('panels', Math.max(1, measurements.panels - 1))}
                    className="p-2 border border-stone-300 hover:border-stone-900 transition-colors duration-300"
                  >
                    <Minus className="w-4 h-4" strokeWidth={1} />
                  </button>
                  <span className="text-lg font-light px-4">{measurements.panels}</span>
                  <button
                    onClick={() => handleMeasurementChange('panels', measurements.panels + 1)}
                    className="p-2 border border-stone-300 hover:border-stone-900 transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1} />
                  </button>
                </div>
              </div>

              {/* Installation Type */}
              <div className="mb-6">
                <label className="block text-stone-700 font-light mb-3">
                  Tipo de Instalação
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="installation"
                      value="professional"
                      checked={measurements.installationType === 'professional'}
                      onChange={(e) => handleMeasurementChange('installationType', e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-light">Profissional (incluído no preço)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="installation"
                      value="express"
                      checked={measurements.installationType === 'express'}
                      onChange={(e) => handleMeasurementChange('installationType', e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-light">Expresso (+€150 - em 48h)</span>
                  </label>
                </div>
              </div>

              {/* Include Sheer */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={measurements.includeSheer}
                    onChange={(e) => handleMeasurementChange('includeSheer', e.target.checked)}
                    className="mr-3"
                  />
                  <span className="font-light">Adicionar cortina sheer (+€89/m²)</span>
                </label>
              </div>

              {/* Price Calculation */}
              {measurements.width && measurements.height && (
                <div className="border-t border-stone-300 pt-6 mt-6">
                  <div className="bg-white p-4 rounded border border-stone-200">
                    <h4 className="text-lg font-light text-stone-900 mb-4">Resumo do Orçamento</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Área total:</span>
                        <span className="font-light">{area.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Preço base:</span>
                        <span className="font-light">{formatPrice(product.price * area)}</span>
                      </div>
                      {measurements.includeSheer && (
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-600">Cortina sheer:</span>
                          <span className="font-light">{formatPrice(area * 89)}</span>
                        </div>
                      )}
                      {measurements.installationType === 'express' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-600">Instalação expressa:</span>
                          <span className="font-light">{formatPrice(150)}</span>
                        </div>
                      )}
                      <div className="border-t border-stone-200 pt-3">
                        <div className="flex justify-between text-xl font-light">
                          <span className="text-stone-900">Total:</span>
                          <span className="text-2xl text-stone-900 font-medium">
                            {formatPrice(calculatedPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="space-y-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={!measurements.width || !measurements.height}
                className={`w-full py-4 px-6 font-light tracking-[0.15em] text-sm transition-all duration-300 ${
                  measurements.width && measurements.height
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {measurements.width && measurements.height 
                  ? `ADICIONAR AO CARRINHO`
                  : 'INSIRA AS MEDIDAS PARA CONTINUAR'
                }
              </button>
              
              {calculatedPrice > 0 && (
                <div className="text-center p-3 bg-stone-50 rounded">
                  <span className="text-lg font-light text-stone-900">
                    Total: {formatPrice(calculatedPrice)}
                  </span>
                </div>
              )}
              
              <button className="w-full border border-stone-900 text-stone-900 py-4 px-6 font-light tracking-[0.15em] text-sm hover:bg-stone-900 hover:text-white transition-all duration-300">
                SOLICITAR ORÇAMENTO GRATUITO
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-stone-200">
              <div className="text-center">
                <Shield className="w-8 h-8 text-stone-600 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm font-light text-stone-600">Garantia Profissional</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-stone-600 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm font-light text-stone-600">Instalação Incluída</p>
              </div>
              <div className="text-center">
                <Home className="w-8 h-8 text-stone-600 mx-auto mb-3" strokeWidth={1} />
                <p className="text-sm font-light text-stone-600">Medição Gratuita</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-24 border-t border-stone-200 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div>
              <h3 className="text-xl font-light text-stone-900 mb-6">Especificações</h3>
              <div className="space-y-4 text-stone-600 font-light">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span>{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span>Largura máxima:</span>
                  <span>500cm</span>
                </div>
                <div className="flex justify-between">
                  <span>Altura máxima:</span>
                  <span>350cm</span>
                </div>
                <div className="flex justify-between">
                  <span>Manutenção:</span>
                  <span>Lavagem a seco</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-light text-stone-900 mb-6">Características</h3>
              <ul className="space-y-3 text-stone-600 font-light">
                {product.features?.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3" strokeWidth={1} />
                    {feature}
                  </li>
                )) || (
                  <li className="text-stone-500">Características não disponíveis</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-light text-stone-900 mb-6">Entrega e Instalação</h3>
              <div className="space-y-4 text-stone-600 font-light">
                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-stone-500 mr-3 mt-0.5" strokeWidth={1} />
                  <div>
                    <p className="font-medium">Entrega gratuita</p>
                    <p className="text-sm">Lisboa e Porto: 3-5 dias úteis</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Home className="w-5 h-5 text-stone-500 mr-3 mt-0.5" strokeWidth={1} />
                  <div>
                    <p className="font-medium">Instalação profissional</p>
                    <p className="text-sm">Incluída no preço</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Ruler className="w-5 h-5 text-stone-500 mr-3 mt-0.5" strokeWidth={1} />
                  <div>
                    <p className="font-medium">Medição gratuita</p>
                    <p className="text-sm">Agendamento flexível</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Guide Modal */}
      <MeasurementGuide 
        isOpen={showMeasurementGuide} 
        onClose={() => setShowMeasurementGuide(false)} 
      />
    </div>
  );
};

export default ProductDetail;