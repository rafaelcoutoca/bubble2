import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Trophy,
  Dumbbell,
  Calendar,
  Building2,
  Phone,
  Globe,
  Users,
  Star,
} from "lucide-react";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import { useAuth } from "../contexts/AuthContext";
import { BubbleLogo } from "../components/Hero";
import Footer from "../components/Footer";
import ClubFilters, { ClubFiltersValue } from "../components/ClubFilters";

/* ===================== Types ===================== */

interface CourtsBySport {
  sport: string;
  courts: number;
}

interface Club {
  id: string;
  name: string;
  city: string;
  state: string;
  services: string[]; // ex.: ["Aulas","Torneios","Bar/Restaurante"]
  imageUrl: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  reviewsCount: number;
  /** quadras por esporte (substitui o antigo 'courts') */
  courtsBySport: CourtsBySport[];
  /** esporte “principal” só para cor do badge */
  sport?: string;
}

/* ===================== Utils ===================== */

function getSportBadgeClasses(sport?: string) {
  const s = (sport || "").toLowerCase();
  if (s.includes("beach"))
    return "bg-amber-100 text-amber-700 border-amber-200";
  if (s.includes("tênis") || s.includes("tenis"))
    return "bg-blue-100 text-blue-700 border-blue-200";
  if (s.includes("pickle")) return "bg-lime-100 text-lime-700 border-lime-200";
  // default / padel
  return "bg-purple-100 text-purple-700 border-purple-200";
}

const ServiceIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className = "h-4 w-4",
}) => {
  const s = name.toLowerCase();
  if (s.includes("torneio")) return <Trophy className={className} />;
  if (s.includes("aula")) return <Dumbbell className={className} />;
  if (s.includes("bar") || s.includes("restaurante"))
    return <Users className={className} />;
  if (s.includes("estacionamento")) return <Building2 className={className} />;
  return <Calendar className={className} />;
};

/* ===================== MOCK (exemplo) ===================== */

const MOCK_CLUBS: Club[] = [
  {
    id: "clube-aurora",
    name: "Clube Aurora",
    city: "São Paulo",
    state: "SP",
    services: ["Aulas", "Torneios", "Aluguel de Material"],
    imageUrl:
      "https://images.pexels.com/photos/6203795/pexels-photo-6203795.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Clube completo com 8 quadras cobertas e descobertas, oferecendo aulas para todos os níveis. Estrutura com vestiários, loja e bar para confraternização após os jogos.",
    phone: "(11) 9999-1234",
    email: "contato@clubeaurora.com",
    website: "www.clubeaurora.com",
    rating: 4.8,
    reviewsCount: 124,
    courtsBySport: [{ sport: "Padel", courts: 8 }],
    sport: "Padel",
  },
  {
    id: "vikings-center",
    name: "Vikings Center",
    city: "Rio de Janeiro",
    state: "RJ",
    services: ["Torneios", "Bar/Restaurante"],
    imageUrl:
      "https://images.pexels.com/photos/1546519/pexels-photo-1546519.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Centro moderno com foco em competições e eventos corporativos. Agenda ativa de torneios e clínicas para diferentes níveis.",
    phone: "(21) 9999-5678",
    rating: 4.6,
    reviewsCount: 89,
    courtsBySport: [
      { sport: "Padel", courts: 6 },
      { sport: "Beach Tennis", courts: 3 },
    ],
    sport: "Padel",
  },
  {
    id: "elite-sports",
    name: "Elite Sports Club",
    city: "Belo Horizonte",
    state: "MG",
    services: ["Aulas", "Torneios", "Vestiários", "Bar/Restaurante"],
    imageUrl:
      "https://images.pexels.com/photos/1574629/pexels-photo-1574629.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Instalações de primeira linha e equipe técnica especializada. Programas de treino contínuo e torneios oficiais ao longo do ano.",
    phone: "(31) 9999-3456",
    rating: 4.9,
    reviewsCount: 156,
    courtsBySport: [
      { sport: "Padel", courts: 10 },
      { sport: "Pickleball", courts: 4 },
    ],
    sport: "Padel",
  },
];

/* ===================== Card ===================== */

const ClubCard: React.FC<{ club: Club }> = ({ club }) => {
  const [expanded, setExpanded] = useState(false);
  const sportLabel = club.sport || club.courtsBySport[0]?.sport || "Padel";
  const sportCls = getSportBadgeClasses(sportLabel);
  const SHOULD_CLAMP = club.description.length > 120;

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 h-full flex flex-col relative">
      {/* Badge esporte */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sportCls}`}
        >
          {sportLabel}
        </span>
      </div>

      {/* Imagem */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={club.imageUrl}
          alt={`Foto do ${club.name}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
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

          <div className="flex items-center text-dark-600">
            <MapPin size={16} className="mr-2 text-primary-600" />
            <span className="text-sm">
              {club.city}, {club.state}
            </span>
          </div>
        </div>

        {/* Quadras por esporte */}
        <div className="mb-3">
          {club.courtsBySport.map((c) => (
            <div key={c.sport} className="text-sm text-dark-700">
              <span className="font-medium">{c.courts} Quadras</span> –{" "}
              {c.sport}
            </div>
          ))}
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <p
            className={`${
              !expanded && SHOULD_CLAMP ? "line-clamp-2" : ""
            } text-sm text-dark-600`}
          >
            {club.description}
          </p>
          {SHOULD_CLAMP && (
            <button
              className="mt-1 text-sm font-semibold text-primary-700 hover:underline"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Ver menos" : "Ver mais"}
            </button>
          )}
        </div>

        {/* Serviços (chips só para exibição) */}
        {club.services.filter((s) => s.toLowerCase() !== "quadras").length >
          0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {club.services
                .filter((s) => s.toLowerCase() !== "quadras")
                .slice(0, 3)
                .map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs text-primary-700 font-medium"
                  >
                    <ServiceIcon name={service} />
                    {service}
                  </span>
                ))}
              {club.services.filter((s) => s.toLowerCase() !== "quadras")
                .length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  +{club.services.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}

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

        {/* CTAs no rodapé */}
        <div className="mt-auto flex gap-2">
          <Link
            to={`/clubes/${club.id}`}
            className="flex-1 bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 text-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Ver Detalhes
          </Link>
          <button
            className="px-4 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 text-sm font-semibold"
            aria-label="Ligar"
          >
            <Phone size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===================== Página ===================== */

const Clubes: React.FC = () => {
  const { user } = useAuth();

  // filtros vindos do ClubFilters
  const [filters, setFilters] = useState<ClubFiltersValue>({
    state: "",
    city: "",
    services: [],
    search: "",
  });

  // aplica filtros à lista
  const filteredClubs = useMemo(() => {
    return MOCK_CLUBS.filter((club) => {
      const matchSearch =
        !filters.search ||
        club.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        club.city.toLowerCase().includes(filters.search.toLowerCase());

      const matchState = !filters.state || club.state === filters.state;
      const matchCity = !filters.city || club.city === filters.city;

      const matchServices =
        filters.services.length === 0 ||
        filters.services.every((service) =>
          club.services
            .map((s) => s.toLowerCase())
            .includes(service.toLowerCase())
        );

      return matchSearch && matchState && matchCity && matchServices;
    });
  }, [filters]);

  const nearbyClubs = filteredClubs.slice(0, 3);

  const hasActiveFilters =
    !!filters.search ||
    !!filters.city ||
    !!filters.state ||
    filters.services.length > 0;

  return (
    <div className="min-h-screen bg-light">
      {user ? <DashboardHeader /> : <Navbar />}

      <div className="pt-16">
        {/* Hero */}
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
                Clubes
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Descubra clubes por esporte, com lista de quadras e serviços.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filtros (novo componente) */}
          <ClubFilters
            clubs={MOCK_CLUBS}
            onFilterChange={(f) => setFilters(f)}
          />

          {/* Clubes Próximos (exemplo) */}
          {nearbyClubs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-dark-800 mb-6 flex items-center">
                <Star className="mr-2 text-accent-500" size={24} />
                Clubes Próximos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
              </div>
            </div>
          )}

          {/* Todos os Clubes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark-800 mb-6">
              {hasActiveFilters
                ? `${filteredClubs.length} clubes encontrados`
                : "Todos os Clubes"}
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
              É dono de um clube?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Cadastre seu clube e conecte-se com atletas em busca de quadras e
              torneios.
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
