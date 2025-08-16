import React, { useState } from "react";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { BubbleLogo } from "../components/Hero";
import Footer from "../components/Footer"; // ajuste o caminho conforme a pasta

const Contact: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-light">
      {user ? <DashboardHeader /> : <Navbar />}

      <div className="pt-16">
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <BubbleLogo
                  size={48}
                  className="text-accent-500 mr-4 animate-pulse"
                />
                <span className="text-accent-500 font-bold text-lg tracking-wide">
                  FALE CONOSCO
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                Entre em Contato
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Tem dúvidas, sugestões ou precisa de ajuda? Nossa equipe está
                pronta para te atender!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-dark-800 mb-4">
                  Vamos jogar juntos?
                </h2>
                <p className="text-dark-600 text-lg">
                  Estamos aqui para tornar sua experiência no padel ainda
                  melhor. Entre em contato conosco através dos canais abaixo ou
                  envie uma mensagem.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Phone size={24} className="text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-800 mb-1">Telefone</h3>
                    <p className="text-dark-600">(11) 9999-9999</p>
                    <p className="text-sm text-dark-500">
                      Segunda a Sexta, 8h às 18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="bg-accent-100 p-3 rounded-lg">
                    <Mail size={24} className="text-accent-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-800 mb-1">E-mail</h3>
                    <p className="text-dark-600">contato@bubble.com.br</p>
                    <p className="text-sm text-dark-500">Resposta em até 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <MapPin size={24} className="text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-800 mb-1">Endereço</h3>
                    <p className="text-dark-600">
                      Av. Paulista, 1000 - Bela Vista
                    </p>
                    <p className="text-dark-600">São Paulo - SP, 01310-100</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="bg-accent-100 p-3 rounded-lg">
                    <Clock size={24} className="text-accent-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-800 mb-1">
                      Horário de Atendimento
                    </h3>
                    <p className="text-dark-600">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-dark-600">Sábado: 9h às 14h</p>
                    <p className="text-dark-600">Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <MessageSquare size={28} className="text-primary-600 mr-3" />
                <h2 className="text-2xl font-black text-dark-800">
                  Envie sua Mensagem
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-dark-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark-700 mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="Sobre o que você gostaria de falar?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-dark-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-4 px-6 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <Send size={20} className="mr-2" />
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-dark-800 mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-dark-600 text-lg">
                Encontre respostas para as dúvidas mais comuns
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-dark-800 mb-3">
                  Como me inscrevo em um torneio?
                </h3>
                <p className="text-dark-600">
                  É muito simples! Navegue pelos torneios disponíveis, escolha o
                  que mais te interessa e clique em "Inscrever-se". Você será
                  direcionado para o processo de inscrição.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-dark-800 mb-3">
                  Como posso cadastrar meu clube?
                </h3>
                <p className="text-dark-600">
                  Clique em "Entrar" e selecione "Clube" no tipo de conta.
                  Preencha os dados do seu clube e comece a criar torneios
                  incríveis!
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-dark-800 mb-3">
                  Posso cancelar minha inscrição?
                </h3>
                <p className="text-dark-600">
                  Sim! Você pode cancelar sua inscrição até 48 horas antes do
                  início do torneio. Acesse seu dashboard para gerenciar suas
                  inscrições.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-dark-800 mb-3">
                  Como funciona o sistema de ranking?
                </h3>
                <p className="text-dark-600">
                  Nosso ranking é baseado na sua performance nos torneios.
                  Quanto mais você joga e melhor seu desempenho, maior sua
                  posição no ranking!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
