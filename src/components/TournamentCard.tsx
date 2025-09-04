import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Users, Zap, Info, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tournament } from "../types";
import StatusBadge from "./StatusBadge";

type ClubTournamentLS = {
  id: string | number;
  hasParticipantLimit?: boolean;
  maxParticipants?: number | null;
  club_id?: string;
};

interface TournamentCardProps {
  tournament: Tournament;
}

const FAVORITES_KEY = "favoriteTournaments";

const MONTHS_ABBR = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/** Parse seguro:
 *  - "YYYY-MM-DD" => cria como UTC (não anda 1 dia em fusos negativos)
 *  - outras strings => new Date(...)
 */
function parseDateInput(d?: string) {
  if (!d) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, day));
    // ↑ data "pura" em UTC
  }
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}

function formatDateAbbrevUTC(d: Date) {
  const day = d.getUTCDate();
  const mon = MONTHS_ABBR[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${mon} ${year}`;
}

function sameYMDUTC(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function formatRangeAbbrev(start?: string, end?: string) {
  const s = parseDateInput(start);
  const e = parseDateInput(end) || s;
  if (!s) return "";
  if (e && sameYMDUTC(s, e)) return formatDateAbbrevUTC(s);
  if (
    e &&
    s.getUTCFullYear() === e.getUTCFullYear() &&
    s.getUTCMonth() === e.getUTCMonth()
  ) {
    const right = `${MONTHS_ABBR[e.getUTCMonth()]} ${e.getUTCFullYear()}`;
    return `${s.getUTCDate()} a ${e.getUTCDate()} ${right}`;
  }
  return `${formatDateAbbrevUTC(s)} – ${formatDateAbbrevUTC(e!)}`;
}

/** Cores por esporte (badge com fundo) */
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

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const {
    id,
    name,
    club,
    location,
    startDate,
    endDate,
    date,
    status,
    participantsCount,
  } = tournament;

  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]") as (
        | string
        | number
      )[];
      setIsFavorite(saved.includes(id));
    } catch {
      /* ignore */
    }
  }, [id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]") as (
        | string
        | number
      )[];
      let next: (string | number)[];
      if (saved.includes(id)) {
        next = saved.filter((x) => x !== id);
        setIsFavorite(false);
      } else {
        next = [...saved, id];
        setIsFavorite(true);
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  // dados completos do torneio no LS (para obter club_id e limite)
  const clubTournaments = JSON.parse(
    localStorage.getItem("clubTournaments") || "[]"
  ) as ClubTournamentLS[];

  const tournamentData = clubTournaments.find(
    (t) => String(t.id) === String(id)
  );

  // Limite somente quando:
  // - hasParticipantLimit === true
  // - maxParticipants é número finito
  const hasLimit =
    tournamentData?.hasParticipantLimit === true &&
    typeof tournamentData?.maxParticipants === "number" &&
    Number.isFinite(tournamentData.maxParticipants) &&
    tournamentData.maxParticipants > 0;

  const maxParticipants: number | null = hasLimit
    ? Number(tournamentData.maxParticipants)
    : null;

  const clubId: string | undefined = tournamentData?.club_id;

  const canRegister = status === "open";

  const dateText =
    startDate || endDate
      ? formatRangeAbbrev(startDate, endDate)
      : formatRangeAbbrev(date, undefined);

  const sportLabel = tournament.sport || "Padel";
  const sportCls = getSportBadgeClasses(sportLabel);

  const goToTournament = () => navigate(`/tournament/${id}`);
  const goToInscritos = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tournament/${id}?tab=inscritos`);
  };
  const goToInformacoesGerais = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tournament/${id}?tab=informacoes&sub=gerais`);
  };
  const goToClub = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clubId) navigate(`/clubes/${clubId}`);
  };

  return (
    <div
      role="button"
      onClick={goToTournament}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group hover:-translate-y-1 cursor-pointer"
    >
      <div className="p-6 flex-1">
        {/* Linha 1: Esporte (com fundo) + Status (somente texto) | Coração */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${sportCls}`}
            >
              {sportLabel}
            </span>
            <StatusBadge status={status} />
          </div>
          <button
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            className="rounded-full p-2 hover:bg-dark-50 transition-colors"
          >
            <Heart
              size={20}
              className={
                isFavorite ? "fill-accent-600 text-accent-600" : "text-dark-500"
              }
            />
          </button>
        </div>

        {/* Título (sem sublinhado no hover) */}
        <h2 className="text-xl font-bold text-dark-800 mb-3 group-hover:text-primary-900 transition-colors">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToTournament();
            }}
            className="text-left"
          >
            {name}
          </button>
        </h2>

        {/* Conteúdo */}
        <div className="mb-3">
          <button
            onClick={goToClub}
            className="text-dark-600 font-semibold hover:text-primary-700"
            title={clubId ? "Abrir perfil do clube" : undefined}
          >
            {club}
          </button>
        </div>

        <div className="flex items-center text-dark-600 mb-3">
          <MapPin size={18} className="mr-2 text-primary-600" />
          <span>
            {location.city}, {location.state}
          </span>
        </div>

        <div className="flex items-center text-dark-600 mb-3">
          <Calendar size={18} className="mr-2 text-primary-600" />
          <span>{dateText}</span>
        </div>

        <div className="flex items-center text-dark-600">
          <Users size={18} className="mr-2 text-primary-600" />
          <span>
            {participantsCount}
            {hasLimit ? ` / ${maxParticipants}` : ""} inscritos
          </span>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={goToInscritos}
              className="flex-1 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Users size={16} className="mr-2" />
              Inscritos
            </button>
            <button
              onClick={goToInformacoesGerais}
              className="flex-1 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Info size={16} className="mr-2" />
              Informações
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              // fluxo de inscrição direto (quando implementar)
            }}
            className={`${
              canRegister
                ? "bg-gradient-to-r from-primary-900 to-primary-700 hover:from-primary-800 hover:to-primary-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-dark-200 text-dark-500 cursor-not-allowed"
            } px-4 py-3 rounded-lg font-bold transition-all duration-300 w-full flex items-center justify-center`}
            disabled={!canRegister}
          >
            {canRegister && <Zap size={18} className="mr-2" />}
            Inscrever-se
          </button>
        </div>

        {hasLimit && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-dark-500 mb-1">
              <span>Ocupação</span>
              <span>
                {Math.round((participantsCount / (maxParticipants || 1)) * 100)}
                % ocupado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (participantsCount / (maxParticipants || 1)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentCard;
