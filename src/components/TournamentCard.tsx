import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Users, Zap, Info, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Tournament } from "../types";
import StatusBadge from "./StatusBadge";

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

function parseISO(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}
function formatDateAbbrev(d: Date) {
  const day = d.getDate();
  const mon = MONTHS_ABBR[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${mon} ${year}`;
}
function sameYMD(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function formatRangeAbbrev(start?: string, end?: string) {
  const s = parseISO(start);
  const e = parseISO(end) || s;
  if (!s) return "";
  if (e && sameYMD(s, e)) return formatDateAbbrev(s);
  if (
    e &&
    s.getFullYear() === e.getFullYear() &&
    s.getMonth() === e.getMonth()
  ) {
    const right = `${MONTHS_ABBR[e.getMonth()]} ${e.getFullYear()}`;
    return `${s.getDate()} a ${e.getDate()} ${right}`;
  }
  return `${formatDateAbbrev(s)} – ${formatDateAbbrev(e!)}`;
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
    sport,
  } = tournament;

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

  const clubTournaments = JSON.parse(
    localStorage.getItem("clubTournaments") || "[]"
  );
  const tournamentData = clubTournaments.find((t: any) => t.id === id);
  const hasParticipantLimit =
    tournamentData?.hasParticipantLimit && tournamentData?.maxParticipants;

  const canRegister = status === "open";
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // intervalo preferencial; cai para "date" legado
  const dateText =
    startDate || endDate
      ? formatRangeAbbrev(startDate, endDate)
      : formatRangeAbbrev(date, undefined);

  const sportLabel = tournament.sport || "Padel";
  const sportCls = getSportBadgeClasses(sportLabel);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group hover:-translate-y-1 cursor-pointer">
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

        {/* Título */}
        <h2 className="text-xl font-bold text-dark-800 mb-3 group-hover:text-primary-900 transition-colors">
          <Link to={`/tournament/${id}`} className="hover:underline">
            {name}
          </Link>
        </h2>

        {/* Conteúdo */}
        <div className="mb-3">
          <p className="text-dark-600 font-semibold">{club}</p>
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
            {hasParticipantLimit
              ? ` / ${tournamentData.maxParticipants}`
              : ""}{" "}
            inscritos
          </span>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <Link
              to={`/tournament/${id}?tab=inscritos`}
              onClick={handleButtonClick}
              className="flex-1 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Users size={16} className="mr-2" />
              Inscritos
            </Link>
            <Link
              to={`/tournament/${id}`}
              onClick={handleButtonClick}
              className="flex-1 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Info size={16} className="mr-2" />
              Informações
            </Link>
          </div>

          <button
            onClick={handleButtonClick}
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

        {hasParticipantLimit && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-dark-500 mb-1">
              <span>Ocupação</span>
              <span>
                {Math.round(
                  (participantsCount / tournamentData.maxParticipants) * 100
                )}
                % ocupado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (participantsCount / tournamentData.maxParticipants) * 100,
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
