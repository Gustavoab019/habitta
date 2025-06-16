import React from 'react';
import { X, Ruler, AlertCircle, CheckCircle } from 'lucide-react';

const MeasurementGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <div className="flex items-center space-x-3">
              <Ruler className="w-6 h-6 text-stone-700" strokeWidth={1} />
              <h2 className="text-2xl font-light tracking-wide text-stone-900">
                Como Medir o Seu Cortinado
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-stone-600" strokeWidth={1} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            
            {/* Introduction */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" strokeWidth={1} />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Importante</h3>
                  <p className="text-blue-800 font-light leading-relaxed">
                    Para garantir um resultado perfeito, oferecemos <strong>medição gratuita</strong> ao domicílio. 
                    Estas instruções são para uma estimativa inicial, mas recomendamos sempre a confirmação 
                    por um dos nossos técnicos especializados.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-light text-stone-900 mb-4">
                  1. Medir a Largura
                </h3>
                <div className="space-y-4 text-stone-600 font-light">
                  <p>
                    <strong className="text-stone-900">Largura da janela:</strong> Meça a largura interna 
                    da janela de batente a batente.
                  </p>
                  <p>
                    <strong className="text-stone-900">Largura do cortinado:</strong> Adicione 20-30cm 
                    de cada lado para garantir privacidade total.
                  </p>
                  <div className="bg-green-50 border border-green-200 p-4 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={1} />
                      <span className="text-green-800 font-medium text-sm">
                        Fórmula: Largura da janela + 40-60cm
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-stone-100 p-6 rounded">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* Window frame */}
                  <rect x="100" y="50" width="200" height="200" fill="none" stroke="#44403c" strokeWidth="2"/>
                  <rect x="110" y="60" width="180" height="180" fill="#e7e5e4"/>
                  
                  {/* Curtain rod */}
                  <line x1="50" y1="40" x2="350" y2="40" stroke="#292524" strokeWidth="3"/>
                  
                  {/* Measurement arrows */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                     refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
                    </marker>
                  </defs>
                  
                  {/* Window width */}
                  <line x1="100" y1="270" x2="300" y2="270" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
                  <text x="200" y="290" textAnchor="middle" className="text-sm fill-red-600">Largura da janela</text>
                  
                  {/* Curtain width */}
                  <line x1="50" y1="25" x2="350" y2="25" stroke="#059669" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
                  <text x="200" y="20" textAnchor="middle" className="text-sm fill-green-600">Largura do cortinado</text>
                </svg>
              </div>
            </div>

            {/* Step 2: Height */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-light text-stone-900 mb-4">
                  2. Medir a Altura
                </h3>
                <div className="space-y-4 text-stone-600 font-light">
                  <p>
                    <strong className="text-stone-900">Do teto ao chão:</strong> Para um efeito mais 
                    elegante e moderno (recomendado).
                  </p>
                  <p>
                    <strong className="text-stone-900">Do topo da janela ao chão:</strong> Para instalação 
                    mais tradicional.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1} />
                      <span className="text-amber-800 font-medium text-sm">
                        Descontar 1-2cm do chão para evitar arrastar
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-stone-100 p-6 rounded">
                <svg viewBox="0 0 300 400" className="w-full h-auto">
                  {/* Wall and floor */}
                  <rect x="0" y="0" width="300" height="400" fill="#f5f5f4"/>
                  <line x1="0" y1="380" x2="300" y2="380" stroke="#44403c" strokeWidth="2"/>
                  
                  {/* Window frame */}
                  <rect x="100" y="80" width="100" height="150" fill="none" stroke="#44403c" strokeWidth="2"/>
                  <rect x="105" y="85" width="90" height="140" fill="#e7e5e4"/>
                  
                  {/* Curtain rod (ceiling mount) */}
                  <line x1="50" y1="20" x2="250" y2="20" stroke="#292524" strokeWidth="3"/>
                  
                  {/* Curtain rod (window mount) */}
                  <line x1="80" y1="70" x2="220" y2="70" stroke="#78716c" strokeWidth="2"/>
                  
                  {/* Height measurements */}
                  <line x1="30" y1="20" x2="30" y2="378" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
                  <text x="15" y="200" textAnchor="middle" className="text-sm fill-red-600" transform="rotate(-90 15 200)">Altura total</text>
                  
                  <line x1="270" y1="70" x2="270" y2="378" stroke="#059669" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
                  <text x="285" y="224" textAnchor="middle" className="text-sm fill-green-600" transform="rotate(-90 285 224)">Da janela ao chão</text>
                </svg>
              </div>
            </div>

            {/* Step 3: Number of Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-light text-stone-900 mb-4">
                  3. Número de Painéis
                </h3>
                <div className="space-y-4 text-stone-600 font-light">
                  <p>
                    <strong className="text-stone-900">1 painel:</strong> Até 150cm de largura
                  </p>
                  <p>
                    <strong className="text-stone-900">2 painéis:</strong> 150-300cm de largura (recomendado)
                  </p>
                  <p>
                    <strong className="text-stone-900">3+ painéis:</strong> Acima de 300cm de largura
                  </p>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" strokeWidth={1} />
                      <span className="text-blue-800 font-medium text-sm">
                        Painéis múltiplos permitem melhor manuseamento
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-stone-100 p-6 rounded">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 bg-stone-300 rounded"></div>
                    <span className="text-sm text-stone-600">1 Painel</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      <div className="w-8 h-20 bg-stone-300 rounded"></div>
                      <div className="w-8 h-20 bg-stone-300 rounded"></div>
                    </div>
                    <span className="text-sm text-stone-600">2 Painéis (Recomendado)</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      <div className="w-5 h-20 bg-stone-300 rounded"></div>
                      <div className="w-5 h-20 bg-stone-300 rounded"></div>
                      <div className="w-5 h-20 bg-stone-300 rounded"></div>
                    </div>
                    <span className="text-sm text-stone-600">3 Painéis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 p-6 rounded">
              <h3 className="text-lg font-medium text-green-900 mb-4">Dicas Importantes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800 font-light">
                <div className="space-y-2">
                  <p>• Use uma fita métrica rígida</p>
                  <p>• Meça sempre em centímetros</p>
                  <p>• Confirme as medidas duas vezes</p>
                </div>
                <div className="space-y-2">
                  <p>• Considere móveis abaixo da janela</p>
                  <p>• Verifique se há radiadores</p>
                  <p>• Anote se há janelas de correr</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-stone-50 p-8 rounded">
              <h3 className="text-xl font-light text-stone-900 mb-4">
                Tem Dúvidas sobre as Medidas?
              </h3>
              <p className="text-stone-600 font-light mb-6">
                Oferecemos medição gratuita ao domicílio para garantir um resultado perfeito
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-stone-900 text-white px-8 py-3 font-light tracking-wide hover:bg-stone-800 transition-all duration-300">
                  AGENDAR MEDIÇÃO GRATUITA
                </button>
                <button 
                  onClick={onClose}
                  className="border border-stone-900 text-stone-900 px-8 py-3 font-light tracking-wide hover:bg-stone-900 hover:text-white transition-all duration-300"
                >
                  CONTINUAR COM ESTAS MEDIDAS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeasurementGuide;