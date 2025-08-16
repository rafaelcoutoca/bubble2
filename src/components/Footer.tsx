import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { BubbleLogo } from "./Hero"; // mesma logo usada na Navbar

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 w-full border-t border-white/10 bg-gradient-to-b from-purple-900 via-purple-950 to-[#1b0f2d]">
      {/* ====== MOBILE (< md) ====== */}
      <div className="md:hidden">
        <div className="mx-auto max-w-6xl px-4 pt-5 pb-6">
          {/* LOGO idêntica ao header */}
          <div className="flex items-center gap-2">
            <BubbleLogo size={26} className="text-accent-500" />
            <span className="font-bold text-lg bg-gradient-to-r from-white to-accent-500 bg-clip-text text-transparent">
              Bubble
            </span>
          </div>

          {/* sociais */}
          <div className="mt-4 flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-white/80 hover:text-white"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-white/80 hover:text-white"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="text-white/80 hover:text-white"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          {/* navegação simples (sem títulos/contato/email/tel e sem Rankings) */}
          <nav className="mt-5">
            <ul className="flex flex-col gap-3 text-base">
              <li>
                <Link to="/" className="text-white/90 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tournaments"
                  className="text-white/90 hover:text-white"
                >
                  Torneios
                </Link>
              </li>
              <li>
                <Link to="/clubes" className="text-white/90 hover:text-white">
                  Clubes
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/90 hover:text-white">
                  Contato
                </Link>
              </li>
              {/* Log In como TEXTO verde (não botão) */}
              <li>
                <Link
                  to="/login"
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-white/10 py-3 text-center text-xs text-white/70">
          © 2025 Bubble. Todos os direitos reservados.
        </div>
      </div>

      {/* ====== DESKTOP (>= md) ====== */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Coluna 1: logo + texto (logo igual à da Navbar) */}
            <div className="col-span-5">
              <div className="flex items-center gap-2">
                <BubbleLogo size={34} className="text-accent-500" />
                <span className="font-bold text-2xl bg-gradient-to-r from-white to-accent-500 bg-clip-text text-transparent">
                  Bubble
                </span>
              </div>
              <p className="mt-5 max-w-md text-white/80">
                Conectamos atletas e clubes em torneios incríveis. Participe,
                jogue e evolua com a comunidade.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-white/80 hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="text-white/80 hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-white/80 hover:text-white"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Coluna 2: links rápidos */}
            <div className="col-span-4">
              <h4 className="text-lg font-semibold text-emerald-400">
                Links Rápidos
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/" className="text-white hover:text-white/90">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tournaments"
                    className="text-white hover:text-white/90"
                  >
                    Torneios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/aboutus"
                    className="text-white hover:text-white/90"
                  >
                    Sobre Nos
                  </Link>
                </li>
                <li>
                  <Link to="/clubes" className="text-white hover:text-white/90">
                    Clubes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white hover:text-white/90"
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: contato */}
            <div className="col-span-3">
              <h4 className="text-lg font-semibold text-emerald-400">
                Contato
              </h4>
              <div className="mt-4 space-y-3 text-white">
                <p>contato@bubble.com.br</p>
                <p>(11) 9999-9999</p>
                <p>
                  Av. Paulista, 1000 – Bela Vista
                  <br />
                  São Paulo – SP, 01310-100
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-sm text-white/70">
          © 2025 Bubble. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
