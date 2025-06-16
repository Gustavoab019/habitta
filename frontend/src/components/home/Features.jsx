import React from 'react';
import { Award, Shield, Truck, Star } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Award,
      title: "Qualidade Hoteleira",
      description: "Os mesmos tecidos premium usados nos melhores hotéis 5 estrelas de Portugal e Europa"
    },
    {
      icon: Shield,
      title: "Garantia Profissional",
      description: "Cortinado testado e aprovado pela indústria hoteleira mais exigente do mundo"
    },
    {
      icon: Star,
      title: "Fabrico Especializado",
      description: "Produzido pela nossa fábrica parceira, especialista em soluções para hotéis de luxo"
    },
    {
      icon: Truck,
      title: "Instalação Inclusa",
      description: "Serviço completo com medição, entrega e instalação por profissionais certificados"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-[0.15em] text-stone-900 mb-8">
            PORQUÊ HABITTA?
          </h2>
          <p className="text-xl font-light text-stone-600 tracking-wide max-w-3xl mx-auto leading-relaxed">
            Trazemos para sua casa a mesma experiência de luxo e conforto que encontra 
            nos melhores hotéis do mundo
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                
                {/* Icon */}
                <div className="bg-stone-100 p-8 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:bg-stone-200 transition-colors duration-500">
                  <IconComponent className="w-10 h-10 text-stone-700" strokeWidth={1} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-light text-stone-900 mb-6 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-stone-600 font-light leading-relaxed tracking-wide">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-lg font-light text-stone-600 mb-8 tracking-wide">
            Descubra a diferença da qualidade hoteleira
          </p>
          <button className="bg-stone-900 text-white px-16 py-5 font-light tracking-[0.25em] hover:bg-stone-800 transition-all duration-300">
            VER COLECÇÃO
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;