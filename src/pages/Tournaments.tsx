import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import Filters from "../components/Filters";
import TournamentList from "../components/TournamentList";
import { LocationFilter } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { BubbleLogo } from "../components/Hero";
import Footer from "../components/Footer"; // ajuste o caminho conforme a pasta

const Tournaments: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LocationFilter>({
    state: "",
    city: "",
    status: "",
    search: "",
  });

  const handleFilterChange = (newFilters: LocationFilter) => {
    setFilters(newFilters);
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
                  VAMOS JOGAR?
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                Todos os Torneios
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Encontre e inscreva-se nos melhores torneios de padel
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Filters onFilterChange={handleFilterChange} />
          <TournamentList filters={filters} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tournaments;
