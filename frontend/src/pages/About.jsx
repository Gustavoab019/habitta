import React from 'react';
import { Award, Users, Building, Truck } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Building, number: '500+', label: 'Hotéis Parceiros' },
    { icon: Users, number: '2000+', label: 'Clientes Satisfeitos' },
    { icon: Award, number: '15+', label: 'Anos de Experiência' },
    { icon: Truck, number: '100%', label: 'Instalação Inclusa' }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.15em] text-stone-900 mb-8">
              SOBRE A HABITTA
            </h1>
            <p className="text-xl font-light text-stone-600 tracking-wide max-w-3xl mx-auto leading-relaxed">
              Especializados em trazer a qualidade hoteleira de luxo para a sua casa
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-8">
                A Nossa História
              </h2>
              <div className="space-y-6 text-stone-600 font-light leading-relaxed">
                <p>
                  A Habitta nasceu da parceria exclusiva com uma das principais fábricas 
                  europeias de cortinado para a indústria hoteleira. Durante anos, 
                  fornecemos apenas hotéis 5 estrelas e resorts de luxo.
                </p>
                <p>
                  Decidimos trazer esta qualidade excepcional diretamente para casa 
                  dos nossos clientes em Portugal, mantendo os mesmos padrões rigorosos 
                  de qualidade e acabamento.
                </p>
                <p>
                  Cada peça que oferecemos passou pelos testes mais exigentes da 
                  indústria hoteleira: durabilidade, facilidade de manutenção, 
                  resistência ao fogo e elegância atemporal.
                </p>
              </div>
            </div>

            <div className="bg-stone-100 p-8">
              <img 
                src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Fábrica de cortinado"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-stone-700" strokeWidth={1} />
                  </div>
                  <div className="text-3xl font-extralight text-stone-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-stone-600 font-light tracking-wide">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-16">
            Os Nossos Valores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-light text-stone-900 mb-4 tracking-wide">
                Qualidade Comprovada
              </h3>
              <p className="text-stone-600 font-light leading-relaxed">
                Produtos testados e aprovados pela exigente indústria hoteleira internacional
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-light text-stone-900 mb-4 tracking-wide">
                Serviço Completo
              </h3>
              <p className="text-stone-600 font-light leading-relaxed">
                Da consulta inicial à instalação final, cuidamos de todos os detalhes
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-light text-stone-900 mb-4 tracking-wide">
                Transparência Total
              </h3>
              <p className="text-stone-600 font-light leading-relaxed">
                Preços claros, prazos cumpridos e comunicação honesta em cada projeto
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;