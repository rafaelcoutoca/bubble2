import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import { BubbleLogo } from "./Hero";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "signup">("login");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Se estiver logado, outra navbar é usada
  if (user) return null;

  const handleLogoClick = () => navigate("/");

  // ESC fecha o menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Trava o scroll quando o menu está aberto
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* HEADER */}
      <nav className="bg-white shadow-lg fixed top-0 inset-x-0 w-full z-[200] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-[70px]">
            {/* Esquerda: Burger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="md:hidden text-dark-600 hover:text-primary-900 focus:outline-none transition-colors pointer-events-auto"
                aria-label="Abrir menu"
                aria-expanded={isOpen}
                aria-controls="mobile-drawer"
              >
                <Menu size={30} />
              </button>

              <button
                onClick={handleLogoClick}
                className={`flex items-center font-black text-xl text-primary-900 hover:text-accent-500 transition-colors ${
                  isOpen ? "hidden md:flex" : ""
                }`}
                aria-label="Ir para a Home"
              >
                <div className="relative mr-3">
                  <BubbleLogo size={34} className="text-accent-500" />
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
              <Link
                to="/clubes"
                className={`${
                  isActive("/clubes")
                    ? "text-primary-900 font-semibold"
                    : "text-dark-600"
                } hover:text-primary-900 font-medium transition-colors`}
              >
                Clubes
              </Link>

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

              {/* Botão Entrar (desktop) com mais padding */}
              <button
                onClick={() => {
                  setLoginMode("login");
                  setIsLoginModalOpen(true);
                }}
                className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-7 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Entrar
              </button>
            </div>

            {/* Direita (mobile): Entrar menor quando menu fechado */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => {
                  setLoginMode("login");
                  setIsLoginModalOpen(true);
                }}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold shadow-sm transition
                            bg-gradient-to-r from-primary-900 to-primary-700 text-white
                            ${isOpen ? "invisible" : "visible"}`}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* OVERLAY (só aparece quando aberto) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[210]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* DRAWER MOBILE */}
      <aside
        id="mobile-drawer"
        className={`fixed top-0 left-0 h-full z-[220] w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* Topo do painel */}
        <div className="flex items-center justify-between h-[70px] px-4 border-b border-gray-100">
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
          <Link
            to="/clubes"
            onClick={() => setIsOpen(false)}
            className={`block text-lg ${
              isActive("/clubes")
                ? "text-primary-900 font-semibold"
                : "text-dark-700"
            } hover:text-primary-900 transition-colors`}
          >
            Clubes
          </Link>

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

        {/* Divisor */}
        <div className="border-t border-primary-200 my-2" />

        {/* Botões (Cadastro antes de Entrar) */}
        <div className="px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => {
              setIsOpen(false);
              setLoginMode("signup");
              setIsLoginModalOpen(true);
            }}
            className="w-full inline-flex items-center justify-center py-3 rounded-lg border-2 border-primary-700 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            Cadastro
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setLoginMode("login");
              setIsLoginModalOpen(true);
            }}
            className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-3 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-semibold shadow-md"
          >
            Entrar
          </button>
        </div>
      </aside>

      {/* Modal de login/cadastro */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        defaultMode={loginMode}
      />
    </>
  );
};

export default Navbar;
