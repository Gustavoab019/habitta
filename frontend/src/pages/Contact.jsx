import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aqui depois integraremos com API
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <div className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.15em] text-stone-900 mb-8">
            CONTACTO
          </h1>
          <p className="text-xl font-light text-stone-600 tracking-wide max-w-3xl mx-auto">
            Estamos aqui para o ajudar a escolher o cortinado perfeito para a sua casa
          </p>
        </div>
      </div>

      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-12">
                Fale Connosco
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-stone-600 mt-1" strokeWidth={1} />
                  <div>
                    <h3 className="font-light text-lg text-stone-900 mb-2">Telefone</h3>
                    <p className="text-stone-600 font-light">+351 21 123 4567</p>
                    <p className="text-stone-500 text-sm">Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-stone-600 mt-1" strokeWidth={1} />
                  <div>
                    <h3 className="font-light text-lg text-stone-900 mb-2">Email</h3>
                    <p className="text-stone-600 font-light">info@habitta.pt</p>
                    <p className="text-stone-500 text-sm">Resposta em 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-stone-600 mt-1" strokeWidth={1} />
                  <div>
                    <h3 className="font-light text-lg text-stone-900 mb-2">Showroom</h3>
                    <p className="text-stone-600 font-light">Rua dos Designers, 123</p>
                    <p className="text-stone-600 font-light">1200-123 Lisboa</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-stone-600 mt-1" strokeWidth={1} />
                  <div>
                    <h3 className="font-light text-lg text-stone-900 mb-2">Horários</h3>
                    <p className="text-stone-600 font-light">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-stone-600 font-light">Sábado: 10h às 14h</p>
                    <p className="text-stone-600 font-light">Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-extralight tracking-wide text-stone-900 mb-12">
                Envie-nos uma Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-stone-700 font-light mb-2">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-light mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-light mb-2">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-light mb-2">Mensagem</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-stone-300 focus:border-stone-900 focus:outline-none font-light resize-none"
                    placeholder="Conte-nos sobre o seu projeto..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 text-white py-4 font-light tracking-[0.25em] hover:bg-stone-800 transition-all duration-300"
                >
                  ENVIAR MENSAGEM
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;