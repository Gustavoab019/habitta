import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-white">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-extralight tracking-[0.15em] mb-6">
              HABITTA
            </h3>
            <p className="text-stone-300 font-light leading-relaxed mb-6">
              Cortinado de qualidade hoteleira para a sua casa. 
              A mesma excelência dos melhores hotéis 5 estrelas, 
              agora ao seu alcance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" strokeWidth={1} />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" strokeWidth={1} />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors duration-300">
                <Linkedin className="w-5 h-5" strokeWidth={1} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-light tracking-wide mb-6">
              CORTINADO
            </h4>
            <ul className="space-y-4 text-stone-300 font-light">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Blackout Hoteleiro
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Voil Premium
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Linho Natural
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Térmico Profissional
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Sheer Antimicrobiano
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-light tracking-wide mb-6">
              SERVIÇOS
            </h4>
            <ul className="space-y-4 text-stone-300 font-light">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Consulta Gratuita
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Medição ao Domicílio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Instalação Profissional
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Projectos Sob Medida
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Garantia Alargada
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-light tracking-wide mb-6">
              CONTACTO
            </h4>
            <div className="space-y-4 text-stone-300 font-light">
              
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" strokeWidth={1} />
                <div>
                  <p>+351 21 123 4567</p>
                  <p className="text-sm text-stone-400">Segunda a Sexta</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" strokeWidth={1} />
                <div>
                  <p>info@habitta.pt</p>
                  <p className="text-sm text-stone-400">Resposta em 24h</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" strokeWidth={1} />
                <div>
                  <p>Rua dos Designers, 123</p>
                  <p>1200-123 Lisboa</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" strokeWidth={1} />
                <div>
                  <p>Seg - Sex: 9h às 18h</p>
                  <p>Sáb: 10h às 14h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h4 className="text-xl font-light tracking-wide mb-4">
              RECEBA AS NOSSAS NOVIDADES
            </h4>
            <p className="text-stone-400 font-light mb-8 max-w-2xl mx-auto">
              Fique a par das últimas tendências em cortinado hoteleiro e ofertas exclusivas
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="O seu email"
                className="flex-1 px-6 py-3 bg-stone-800 border border-stone-700 text-white placeholder-stone-400 focus:outline-none focus:border-stone-500 font-light"
              />
              <button className="bg-white text-stone-900 px-8 py-3 font-light tracking-wide hover:bg-stone-100 transition-colors duration-300">
                SUBSCREVER
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            <div className="text-stone-400 font-light text-sm">
              © {currentYear} Habitta. Todos os direitos reservados.
            </div>
            
            <div className="flex space-x-8 text-stone-400 font-light text-sm">
              <a href="#" className="hover:text-white transition-colors duration-300">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Termos de Serviço
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                Livro de Reclamações
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;