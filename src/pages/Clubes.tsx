import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Trophy,
  Dumbbell,
  Calendar,
  Search,
  Building2,
  Phone,
  Mail,
  Globe,
  Users,
  Star,
  Filter,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../contexts/AuthContext";
import { BubbleLogo } from "../components/Hero";
import Footer from "../components/Footer";

interface Club {
  id: string;
  name: string;
  city: string;
  state: string;
  services: string[];
  imageUrl: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  reviewsCount: number;
  courts: number;
  featured: boolean;
}

interface ClubFilters {
  search: string;
  city: string;
  state: string;
  services: string[];
}

/**
 * IMPORTANTE: este array é temporário para mock.
 * Depois trocaremos por dados vindos do backend/Firebase.
 */
const MOCK_CLUBS: Club[] = [
  {
    id: "clube-aurora",
    name: "Clube Aurora Padel",
    city: "São Paulo",
    state: "SP",
    services: ["Quadras", "Aulas", "Torneios", "Aluguel de Material"],
    imageUrl:
      "https://images.pexels.com/photos/6203795/pexels-photo-6203795.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Clube completo com 8 quadras cobertas e descobertas, oferecendo aulas para todos os níveis.",
    phone: "(11) 9999-1234",
    email: "contato@clubeaurora.com",
    website: "www.clubeaurora.com",
    rating: 4.8,
    reviewsCount: 124,
    courts: 8,
    featured: true,
  },
  {
    id: "vikings-padel",
    name: "Vikings Padel Center",
    city: "Rio de Janeiro",
    state: "RJ",
    services: ["Quadras", "Torneios", "Bar/Restaurante"],
    imageUrl:
      "https://images.pexels.com/photos/1546519/pexels-photo-1546519.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Centro de padel moderno com foco em competições e eventos corporativos.",
    phone: "(21) 9999-5678",
    email: "info@vikingspadel.com",
    rating: 4.6,
    reviewsCount: 89,
    courts: 6,
    featured: true,
  },
  {
    id: "north-hills",
    name: "North Hills Padel",
    city: "Curitiba",
    state: "PR",
    services: ["Quadras", "Aulas", "Estacionamento"],
    imageUrl:
      "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Ambiente familiar com professores qualificados e estrutura completa.",
    phone: "(41) 9999-9012",
    email: "contato@northhills.com",
    rating: 4.7,
    reviewsCount: 67,
    courts: 4,
    featured: false,
  },
  {
    id: "elite-sports",
    name: "Elite Sports Club",
    city: "Belo Horizonte",
    state: "MG",
    services: ["Quadras", "Aulas", "Torneios", "Vestiários"],
    imageUrl:
      "https://images.pexels.com/photos/1574629/pexels-photo-1574629.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Clube premium com instalações de primeira linha e equipe técnica especializada.",
    phone: "(31) 9999-3456",
    email: "elite@elitesports.com",
    rating: 4.9,
    reviewsCount: 156,
    courts: 10,
    featured: true,
  },
  {
    id: "padel-zone",
    name: "Padel Zone",
    city: "Porto Alegre",
    state: "RS",
    services: ["Quadras", "Bar/Restaurante", "Estacionamento"],
    imageUrl:
      "https://images.pexels.com/photos/6203798/pexels-photo-6203798.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Espaço descontraído para jogar padel com os amigos e relaxar no bar.",
    phone: "(51) 9999-7890",
    email: "contato@padelzone.com",
    rating: 4.4,
    reviewsCount: 92,
    courts: 5,
    featured: false,
  },
  {
    id: "centro-padel",
    name: "Centro de Padel Campinas",
    city: "Campinas",
    state: "SP",
    services: ["Quadras", "Aulas", "Torneios", "Aluguel de Material", "Vestiários"],
    imageUrl:
      "https://images.pexels.com/photos/3660207/pexels-photo-3660207.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Centro especializado em padel com metodologia própria de ensino.",
    phone: "(19) 9999-2468",
    email: "info@centropadel.com",
    rating: 4.5,
    reviewsCount: 78,
    courts: 6,
    featured: false,
  },
];

const AVAILABLE_SERVICES = [
  "Quadras",
  "Aulas",
  "Torneios",
  "Aluguel de Material",
  "Bar/Restaurante",
  "Estacionamento",
  "Vestiários",
];

const STATES = [
  "SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "PE", "CE",
  "PA", "MA", "PB", "ES", "PI", "AL", "RN", "MT", "MS", "DF",
  "SE", "RO", "AC", "AM", "RR", "AP", "TO"
];

const ServiceIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = "h-4 w-4",
}) => {
  if (name.toLowerCase().includes("torneio"))
    return <Trophy className={className} />;
  if (name.toLowerCase().includes("aula"))
    return <Dumbbell className={className} />;
  if (name.toLowerCase().includes("quadra"))
    return <Calendar className={className} />;
  if (name.toLowerCase().includes("bar") || name.toLowerCase().includes("restaurante"))
    return <Users className={className} />;
  return <Building2 className={className} />; // fallback
};

const ClubCard: React.FC<{ club: Club }> = ({ club }) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
      {/* Badge de destaque */}
      {club.featured && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 px-3 py-1 rounded-full text-xs font-bold">
          Destaque
        </div>
      )}

      {/* Imagem */}
      <div className="aspect-[16/9] overflow-hidden relative">
        <img
          src={club.imageUrl}
          alt={`Foto do ${club.name}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Header do card */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-900 transition-colors">
              {club.name}
            </h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-dark-700 ml-1">
                {club.rating}
              </span>
              <span className="text-xs text-dark-500 ml-1">
                ({club.reviewsCount})
              </span>
            </div>
          </div>

          <div className="flex items-center text-dark-600 mb-2">
            <MapPin size={16} className="mr-2 text-primary-600" />
            <span className="text-sm">{club.city}, {club.state}</span>
          </div>

          <div className="flex items-center text-dark-600 mb-3">
            <Building2 size={16} className="mr-2 text-primary-600" />
            <span className="text-sm">{club.courts} quadras disponíveis</span>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-sm text-dark-600 mb-4 line-clamp-2">
          {club.description}
        </p>

        {/* Serviços */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {club.services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs text-primary-700 font-medium"
              >
                <ServiceIcon name={service} />
                {service}
              </span>
            ))}
            {club.services.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                +{club.services.length - 3} mais
              </span>
            )}
          </div>
        </div>

        {/* Contato */}
        <div className="flex items-center gap-4 mb-4 text-xs text-dark-500">
          {club.phone && (
            <div className="flex items-center">
              <Phone size={12} className="mr-1" />
              <span>{club.phone}</span>
            </div>
          )}
          {club.website && (
            <div className="flex items-center">
              <Globe size={12} className="mr-1" />
              <span>Site</span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <Link
            to={`/clubes/${club.id}`}
            className="flex-1 bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 text-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Ver Detalhes
          </Link>
          <button className="px-4 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 text-sm font-semibold">
            <Phone size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Clubes: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ClubFilters>({
    search: "",
    city: "",
    state: "",
    services: [],
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filtros aplicados
  const filteredClubs = useMemo(() => {
    return MOCK_CLUBS.filter((club) => {
      const matchSearch = !filters.search || 
        club.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        club.city.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchCity = !filters.city || 
        club.city.toLowerCase().includes(filters.city.toLowerCase());
      
      const matchState = !filters.state || club.state === filters.state;
      
      const matchServices = filters.services.length === 0 ||
        filters.services.every(service => club.services.includes(service));

      return matchSearch && matchCity && matchState && matchServices;
    });
  }, [filters]);

  const featuredClubs = filteredClubs.filter(club => club.featured);

  const handleServiceToggle = (service: string) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      state: "",
      services: [],
    });
  };

  const hasActiveFilters = filters.search || filters.city || filters.state || filters.services.length > 0;

  return (
    <div className="min-h-screen bg-light">
      {user ? <DashboardHeader /> : <Navbar />}

      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <BubbleLogo
                  size={48}
                  className="text-accent-500 mr-4 animate-pulse"
                />
                <span className="text-accent-500 font-bold text-lg tracking-wide">
                  ENCONTRE SEU CLUBE
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                Clubes de Padel
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Descubra quadras, aulas e torneios organizados por clubes parceiros perto de você
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-dark-800 flex items-center">
                <Filter size={20} className="mr-2 text-primary-600" />
                Filtrar Clubes
                {hasActiveFilters && (
                  <span className="ml-3 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs md:text-sm font-semibold bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200">
                    {filteredClubs.length}
                  </span>
                )}
              </h2>

              <div className="flex items-center gap-4">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="hidden md:inline text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
                  >
                    Limpar filtros
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden text-primary-600 font-semibold"
                >
                  {isFilterOpen ? "Fechar" : "Filtros"}
                </button>
              </div>
            </div>

            <div className={`transition-[max-height] duration-300 ease-in-out ${
              isFilterOpen ? "max-h-[800px]" : "max-h-0 overflow-hidden"
            } md:max-h-none md:overflow-visible`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Busca */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Nome do clube ou cidade..."
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="">Todos os Estados</option>
                    {STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Digite a cidade"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              {/* Serviços */}
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-3">
                  Serviços
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SERVICES.map(service => (
                    <button
                      key={service}
                      onClick={() => handleServiceToggle(service)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.services.includes(service)
                          ? "bg-primary-100 text-primary-700 border-2 border-primary-300"
                          : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                      }`}
                    >
                      <ServiceIcon name={service} />
                      {service}
                      {filters.services.includes(service) && (
                        <X size={14} />
                      )}
                    </button>
                  ))}
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 md:hidden text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
                  >
                    Limpar todos os filtros
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Clubes em Destaque */}
          {featuredClubs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-dark-800 mb-6 flex items-center">
                <Star className="mr-2 text-accent-500" size={24} />
                Clubes em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredClubs.slice(0, 3).map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            </div>
          )}

          {/* Todos os Clubes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark-800 mb-6">
              {hasActiveFilters ? `${filteredClubs.length} clubes encontrados` : "Todos os Clubes"}
            </h2>

            {filteredClubs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
                <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-dark-700 mb-2">
                  Nenhum clube encontrado
                </h3>
                <p className="text-dark-500 mb-4">
                  Tente ajustar seus filtros ou busque em outra região.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            )}
          </div>

          {/* CTA para donos de clubes */}
          <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              É dono de um clube de padel?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Cadastre seu clube e conecte-se com milhares de atletas em busca de quadras e torneios.
            </p>
            <button className="bg-accent-500 hover:bg-accent-400 text-dark-900 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Cadastrar Meu Clube
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Clubes;