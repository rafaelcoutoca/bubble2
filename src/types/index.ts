export type TournamentStatus = "open" | "closed" | "in-progress" | "completed";
export type Sport = "Padel" | "Beach Tennis" | "Tênis" | "Pickleball";

export interface Tournament {
  id: string;
  name: string;
  club: string;
  location: {
    city: string;
    state: string;
  };

  // Período
  startDate: string;
  endDate?: string;
  date?: string;

  status: TournamentStatus;
  participantsCount: number;

  // Novo: esporte
  sport?: Sport | string;
}

export interface LocationFilter {
  state: string;
  city: string;
  status: TournamentStatus | "";
  search: string;
  sport?: Sport | ""; // Novo
}
