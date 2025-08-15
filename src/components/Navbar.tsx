// src/components/Navbar.tsx
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import { BubbleLogo } from "./Hero";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Usuário logado usa DashboardHeader – não renderizamos esta navbar
  if (user) return null;

  const handleLogoClick = () => navigate("/");

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full z-[100] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER (altura um pouco menor) */}
          <div className="flex justify-between h-[72px]">
            {/* Esquerda: Burger + Logo (logo some quando menu aberto no mobile) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden text-dark-600 hover:text-primary-900 focus:outline-none transition-colors"
                aria-label="Abrir menu"
              >
                <Menu size={28} />
              </button>

              <button
                onClick={handleLogoClick}
                className={`flex items-center font-black text-xl text-primary-900 hover:text-accent-500 transition-colors ${
                  isOpen ? "hidden md:flex" : ""
                }`}
                aria-label="Ir para a Home"
              >
                <div className="relative mr-3">
                  <BubbleLogo size={36} className="text-accent-500" />
                </div>
                <span className="bg-gradient-to-r from-primary-900 to-accent-500 bg-clip-text text-transparent">
                  Bubble
                </span>
              </button>
            </div>

            {/* Navegação Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "text-primary-900 font-semibold"
                    : "text-dark-600"
                } hover:text-primary-900 font-medium transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/tournaments"
                className={`${
                  isActive("/tournaments")
                    ? "text-primary-900 font-semibold"
                    : "text-dark-600"
                } hover:text-primary-900 font-medium transition-colors`}
              >
                Torneios
              </Link>
              <a
                href="#"
                className="text-dark-600 hover:text-primary-900 font-medium transition-colors"
              >
                Clubes
              </a>
              <Link
                to="/contact"
                className={`${
                  isActive("/contact")
                    ? "text-primary-900 font-semibold"
                    : "text-dark-600"
                } hover:text-primary-900 font-medium transition-colors`}
              >
                Contato
              </Link>

              <Link
                to="/login"
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-6 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Entrar
              </Link>
            </div>

            {/* Direita (MOBILE): botão Entrar sempre visível quando menu fechado — menorzinho */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm transition
                            bg-gradient-to-r from-primary-900 to-primary-700 text-white
                            ${isOpen ? "invisible" : "visible"}`}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SLIDE-OVER MENU (mobile) */}
      <aside
        className={`fixed top-0 left-0 h-full z-[100] w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out
                    ${
                      isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* Topo do painel */}
        <div className="flex items-center justify-between h-[72px] px-4 border-b border-gray-100">
          <div className="flex items-center">
            <BubbleLogo size={26} className="text-accent-500 mr-2" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary-900 to-accent-500 bg-clip-text text-transparent">
              Bubble
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-dark-600 hover:text-primary-900 hover:bg-gray-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X size={26} />
          </button>
        </div>

        {/* Links */}
        <div className="px-4 py-4 space-y-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block text-lg ${
              isActive("/") ? "text-primary-900 font-semibold" : "text-dark-700"
            } hover:text-primary-900 transition-colors`}
          >
            Home
          </Link>
          <Link
            to="/tournaments"
            onClick={() => setIsOpen(false)}
            className={`block text-lg ${
              isActive("/tournaments")
                ? "text-primary-900 font-semibold"
                : "text-dark-700"
            } hover:text-primary-900 transition-colors`}
          >
            Torneios
          </Link>
          <a
            href="#"
            className="block text-lg text-dark-700 hover:text-primary-900 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Clubes
          </a>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className={`block text-lg ${
              isActive("/contact")
                ? "text-primary-900 font-semibold"
                : "text-dark-700"
            } hover:text-primary-900 transition-colors`}
          >
            Contato
          </Link>
        </div>

        {/* Divisor roxo */}
        <div className="border-t border-primary-200 my-2" />

        {/* Botões (ordem invertida: Cadastro primeiro) */}
        <div className="px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="w-full inline-flex items-center justify-center py-3 rounded-lg border-2 border-primary-700 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            Cadastro
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-semibold shadow-md"
          >
            Entrar
          </button>
        </div>
      </aside>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
