import { Tournament } from "../types";

export const states = [
  { value: "", label: "Todos os Estados" },
  { value: "Acre", label: "Acre" },
  { value: "Alagoas", label: "Alagoas" },
  { value: "Amapá", label: "Amapá" },
  { value: "Amazonas", label: "Amazonas" },
  { value: "Bahia", label: "Bahia" },
  { value: "Ceará", label: "Ceará" },
  { value: "Distrito Federal", label: "Distrito Federal" },
  { value: "Espírito Santo", label: "Espírito Santo" },
  { value: "Goiás", label: "Goiás" },
  { value: "Maranhão", label: "Maranhão" },
  { value: "Mato Grosso", label: "Mato Grosso" },
  { value: "Mato Grosso do Sul", label: "Mato Grosso do Sul" },
  { value: "Minas Gerais", label: "Minas Gerais" },
  { value: "Pará", label: "Pará" },
  { value: "Paraíba", label: "Paraíba" },
  { value: "Paraná", label: "Paraná" },
  { value: "Pernambuco", label: "Pernambuco" },
  { value: "Piauí", label: "Piauí" },
  { value: "Rio de Janeiro", label: "Rio de Janeiro" },
  { value: "Rio Grande do Norte", label: "Rio Grande do Norte" },
  { value: "Rio Grande do Sul", label: "Rio Grande do Sul" },
  { value: "Rondônia", label: "Rondônia" },
  { value: "Roraima", label: "Roraima" },
  { value: "Santa Catarina", label: "Santa Catarina" },
  { value: "São Paulo", label: "São Paulo" },
  { value: "Sergipe", label: "Sergipe" },
  { value: "Tocantins", label: "Tocantins" },
];

export const getCitiesByState = (stateCode: string) => {
  if (!stateCode) return [{ value: "", label: "Todas as Cidades" }];
  const citiesByState: Record<string, { value: string; label: string }[]> = {
    "São Paulo": [
      { value: "", label: "Todas as Cidades" },
      { value: "São Paulo", label: "São Paulo" },
      { value: "Campinas", label: "Campinas" },
      { value: "Santos", label: "Santos" },
    ],
    "Rio de Janeiro": [
      { value: "", label: "Todas as Cidades" },
      { value: "Rio de Janeiro", label: "Rio de Janeiro" },
      { value: "Niterói", label: "Niterói" },
      { value: "Petrópolis", label: "Petrópolis" },
    ],
    "Minas Gerais": [
      { value: "", label: "Todas as Cidades" },
      { value: "Belo Horizonte", label: "Belo Horizonte" },
      { value: "Uberlândia", label: "Uberlândia" },
      { value: "Juiz de Fora", label: "Juiz de Fora" },
    ],
  };
  return citiesByState[stateCode] || [{ value: "", label: "Todas as Cidades" }];
};

// Normalizador (opcional) caso você use este helper em outro lugar
export const getClubTournaments = (): Tournament[] => {
  const raw = JSON.parse(localStorage.getItem("clubTournaments") || "[]");
  return raw.map((t: any): Tournament => {
    const start =
      t.startDate || t.start || t.beginDate || t.dateStart || t.date || "";
    const end = t.endDate || t.finishDate || t.finishesAt || t.dateEnd || "";

    const status = t.status === "scheduled" ? "open" : t.status;

    return {
      id: t.id,
      name: t.name,
      club: t.mainClub || "Clube",
      location: {
        city: t.location?.city || t.city || "São Paulo",
        state: t.location?.state || t.state || "SP",
      },
      startDate: start,
      endDate: end || undefined,
      date: start || undefined,
      sport: t.sport || "Padel",
      status,
      participantsCount: t.participantsCount || 0,
    };
  });
};

export const tournaments: Tournament[] = [];
