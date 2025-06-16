import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Cortinado de Hotel de Luxo",
      subtitle: "A mesma qualidade dos melhores hotéis 5 estrelas",
      description: "Cortinado premium fornecido às principais cadeias hoteleiras, agora disponível para a sua casa",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      buttonText: "Ver Colecção"
    },
    {
      id: 2,
      title: "Qualidade Hoteleira",
      subtitle: "Tecidos exclusivos da nossa fábrica parceira",
      description: "Os mesmos materiais premium usados em hotéis de prestígio internacional",
      image: "https://images.unsplash.com/photo-1631679706909-fdd04c0b5167?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      buttonText: "Saber Mais"
    },
    {
      id: 3,
      title: "Experiência Premium",
      subtitle: "Transforme a sua casa num refúgio de luxo",
      description: "Desfrute do conforto e elegância que só encontrava nos melhores hotéis",
      image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      buttonText: "Contactar"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative">
      {/* Hero Slider */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-6xl font-extralight text-white mb-6 tracking-wide leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl text-stone-200 mb-8 font-light tracking-wide">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg text-stone-300 mb-12 leading-relaxed font-light max-w-lg">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <button className="bg-white text-stone-900 px-12 py-4 font-light text-lg tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      {slide.buttonText}
                    </button>
                    <button className="border border-white text-white hover:bg-white hover:text-stone-900 px-12 py-4 font-light text-lg tracking-wide transition-all duration-300">
                      Solicitar Orçamento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={1} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" strokeWidth={1} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;