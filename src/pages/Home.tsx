import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Filters from "../components/Filters";
import TournamentList from "../components/TournamentList";
import { LocationFilter } from "../types";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  const [filters, setFilters] = useState<LocationFilter>({
    state: "",
    city: "",
    status: "",
    search: "",
  });

  // controla o modal de login/cadastro
  const [authOpen, setAuthOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Fallback: App.tsx já redireciona se estiver logado
  if (user) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  const handleFilterChange = (newFilters: LocationFilter) => {
    setFilters(newFilters);
  };

  const scrollToTournaments = () => {
    const el = document.getElementById("tournaments-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <Hero
        onSearchClick={scrollToTournaments}
        onSignupClick={() => setAuthOpen(true)} // <<< abre o modal de cadastro
      />

      <div
        id="tournaments-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-dark-800 mb-4">
            Próximos Duelos
          </h2>
          <p className="text-dark-600 text-lg">
            Encontre e inscreva-se nos melhores torneios de padel perto de você
          </p>
        </div>

        <Filters onFilterChange={handleFilterChange} />
        <TournamentList filters={filters} limit={6} />
      </div>

      <Footer />

      {/* Modal de Login/Cadastro */}
      <LoginModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode="signup" // abre direto na aba de cadastro
      />
    </div>
  );
};

export default Home;
