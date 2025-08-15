export type TournamentStatus = "open" | "closed" | "in-progress" | "completed";

export interface Tournament {
  id: string;
  name: string;
  club: string;
  location: {
    city: string;
    state: string;
  };

  // Intervalo de datas (preferencial)
  startDate: string; // ex.: "2025-08-14"
  endDate?: string; // ex.: "2025-08-16" (opcional)

  // Compatibilidade com código legado
  date?: string;

  // Novo: esporte do torneio
  sport?: string;

  status: TournamentStatus;
  participantsCount: number;
}

export interface LocationFilter {
  state: string;
  city: string;
  status: TournamentStatus | "";
  search: string;
}
