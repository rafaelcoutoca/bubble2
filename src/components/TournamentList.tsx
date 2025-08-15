import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TournamentCard from "./TournamentCard";
import { Tournament, LocationFilter } from "../types";
import { useAuth } from "../contexts/AuthContext";

interface TournamentListProps {
  filters: LocationFilter;
  limit?: number;
}

const TournamentList: React.FC<TournamentListProps> = ({ filters, limit }) => {
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    setIsLoading(true);

    const clubTournaments = JSON.parse(
      localStorage.getItem("clubTournaments") || "[]"
    );

    const convertedClubTournaments: Tournament[] = clubTournaments.map(
      (t: any) => ({
        id: t.id,
        name: t.name,
        club: t.mainClub || "Clube",
        location: {
          city: t.location?.city || t.city || "São Paulo",
          state: t.location?.state || t.state || "SP",
        },
        // Agora passamos PERÍODO completo
        startDate: t.startDate,
        endDate: t.endDate,
        // compat legado
        date: t.startDate,
        // status normalizado
        status: t.status === "scheduled" ? "open" : t.status,
        participantsCount: t.participantsCount || 0,
        // novo: esporte
        sport: t.sport || "Padel",
      })
    );

    let result = [...convertedClubTournaments];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (tr) =>
          tr.name.toLowerCase().includes(s) || tr.club.toLowerCase().includes(s)
      );
    }
    if (filters.state)
      result = result.filter((tr) => tr.location.state === filters.state);
    if (filters.city)
      result = result.filter((tr) => tr.location.city === filters.city);
    if (filters.status)
      result = result.filter((tr) => tr.status === filters.status);

    // Ordena por startDate; completed no fim
    result.sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      return (
        new Date(a.startDate || a.date || 0).getTime() -
        new Date(b.startDate || b.date || 0).getTime()
      );
    });

    if (limit) result = result.slice(0, limit);

    setFilteredTournaments(result);
    setIsLoading(false);
  }, [filters, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (filteredTournaments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        <h3 className="text-xl font-semibold text-dark-700 mb-2">
          Nenhum torneio encontrado
        </h3>
        <p className="text-dark-500 mb-4">
          {JSON.parse(localStorage.getItem("clubTournaments") || "[]")
            .length === 0
            ? "Ainda não há torneios criados pelos clubes."
            : "Tente ajustar seus filtros ou busque em outra região."}
        </p>
        {user && profile?.user_type === "club" && (
          <Link
            to="/create-tournament"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Criar Primeiro Torneio
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTournaments.map((tournament) => (
        <Link
          key={tournament.id}
          to={`/tournament/${tournament.id}`}
          className="block"
        >
          <TournamentCard tournament={tournament} />
        </Link>
      ))}
    </div>
  );
};

export default TournamentList;
