import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Trophy,
  Dumbbell,
  Calendar,
  Search,
  Building2,
} from "lucide-react";

/**
 * IMPORTANTE: este array é temporário para mock.
 * Depois trocaremos por dados vindos do backend/Firebase.
 */
const MOCK_CLUBS = [
  {
    id: "clube-aurora",
    name: "Clube Aurora Padel",
    city: "São Paulo, SP",
    services: ["Quadras", "Aulas", "Torneios"],
    imageUrl:
      "https://images.unsplash.com/photo-1518604666860-9ed391f7bb2f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "vikings-padel",
    name: "Vikings Padel Center",
    city: "Rio de Janeiro, RJ",
    services: ["Quadras", "Torneios"],
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "north-hills",
    name: "North Hills Padel",
    city: "Curitiba, PR",
    services: ["Quadras", "Aulas"],
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
  },
];

type Club = (typeof MOCK_CLUBS)[number];

const ServiceIcon: React.FC<{ name: string; className?: string }> = ({
  name,
  className,
}) => {
  const common = "h-4 w-4";
  if (name.toLowerCase().includes("torneio"))
    return <Trophy className={common + " " + (className ?? "")} />;
  if (name.toLowerCase().includes("aula"))
    return <Dumbbell className={common + " " + (className ?? "")} />;
  return <Calendar className={common + " " + (className ?? "")} />; // fallback
};

/**
 * Card do Clube
 * Mantém a mesma “linguagem” visual dos cards de torneios:
 * - borda sutil
 * - sombra suave
 * - radius consistente
 * - hover com leve aumento/elevação
 * - CTA “Ver detalhes”
 */
const ClubCard: React.FC<{ club: Club }> = ({ club }) => {
  return (
    <Link
      to={`/clubes/${club.id}`}
      className={[
        "group overflow-hidden rounded-xl",
        "border border-white/10 bg-white/5",
        "shadow-lg shadow-black/20 hover:shadow-xl",
        "transition transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
      ].join(" ")}
      aria-label={`Ver detalhes de ${club.name}`}
    >
      {/* imagem topo */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={club.imageUrl}
          alt={`Foto do ${club.name}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* conteúdo */}
      <div className="p-4 md:p-5">
        <div className="mb-2 flex items-center gap-2 text-white/80">
          <Building2 className="h-4 w-4" />
          <span className="text-xs md:text-sm">{club.city}</span>
        </div>

        <h3 className="text-base md:text-lg font-semibold text-white">
          {club.name}
        </h3>

        {/* serviços (chips) */}
        <div className="mt-3 flex flex-wrap gap-2">
          {club.services.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/90"
            >
              <ServiceIcon name={s} />
              {s}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4">
          <span
            className={[
              "inline-flex items-center justify-center",
              "rounded-lg px-3 py-2 text-sm font-medium",
              // botão padrão dos cards (igual vibe dos torneios/CTAs da app)
              "bg-white/90 text-gray-900 hover:bg-white",
              "transition",
            ].join(" ")}
          >
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
};

const Clubes: React.FC = () => {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  // filtros simples por nome e cidade (podemos evoluir depois)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const c = city.trim().toLowerCase();
    return MOCK_CLUBS.filter((club) => {
      const matchQuery = !q || club.name.toLowerCase().includes(q);
      const matchCity = !c || club.city.toLowerCase().includes(c);
      return matchQuery && matchCity;
    });
  }, [query, city]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Hero simplificado (segue espaçamentos da Home) */}
      <section className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Encontre clubes de padel
        </h1>
        <p className="mt-2 text-white/80 text-sm md:text-base">
          Descubra quadras, aulas e torneios organizados por clubes parceiros.
        </p>
      </section>

      {/* Barra de busca / filtros (mantendo paddings e alturas usadas na app) */}
      <section
        className={[
          "mb-8 rounded-xl border border-white/10 bg-white/5 p-4 md:p-5",
          "shadow-md shadow-black/10",
        ].join(" ")}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            <Search className="h-4 w-4 text-white/70" />
            <input
              type="text"
              placeholder="Buscar por nome do clube"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
              aria-label="Buscar por nome do clube"
            />
          </label>

          <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            <MapPin className="h-4 w-4 text-white/70" />
            <input
              type="text"
              placeholder="Cidade ou estado"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
              aria-label="Filtrar por cidade"
            />
          </label>

          {/* CTA para donos de clubes */}
          <div className="flex items-stretch">
            <Link
              to="/cadastro-clube"
              className={[
                "flex w-full items-center justify-center rounded-lg",
                "bg-white/90 text-gray-900 hover:bg-white",
                "text-sm font-semibold transition px-4",
              ].join(" ")}
            >
              Cadastrar meu clube
            </Link>
          </div>
        </div>
      </section>

      {/* Grid de cards */}
      <section>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/80">
            Nenhum clube encontrado com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Clubes;
