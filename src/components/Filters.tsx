import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { tournaments as allTournaments } from "../data/tournaments";
import { LocationFilter, TournamentStatus } from "../types";

interface FiltersProps {
  onFilterChange: (filters: LocationFilter) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | "">(
    ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<
    { value: string; label: string; count: number }[]
  >([]);
  const [states, setStates] = useState<
    { value: string; label: string; count: number }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = useMemo(
    () =>
      !!(selectedState || selectedCity || selectedStatus || searchTerm.trim()),
    [selectedState, selectedCity, selectedStatus, searchTerm]
  );

  const filteredCount = useMemo(() => {
    return allTournaments.filter((t) => {
      const byState = !selectedState || t.location.state === selectedState;
      const byCity = !selectedCity || t.location.city === selectedCity;
      const byStatus = !selectedStatus || t.status === selectedStatus;
      const bySearch =
        !searchTerm ||
        [t.name, t.club, t.location?.city, t.location?.state]
          .filter(Boolean)
          .some((v) =>
            String(v).toLowerCase().includes(searchTerm.toLowerCase())
          );
      return byState && byCity && byStatus && bySearch;
    }).length;
  }, [selectedState, selectedCity, selectedStatus, searchTerm]);

  useEffect(() => {
    const statesWithCounts = allTournaments.reduce((acc, tournament) => {
      const state = tournament.location.state;
      if (!acc[state]) {
        acc[state] = { count: 1, label: state };
      } else {
        acc[state].count++;
      }
      return acc;
    }, {} as Record<string, { count: number; label: string }>);

    setStates([
      { value: "", label: "Todos os Estados", count: allTournaments.length },
      ...Object.entries(statesWithCounts).map(([value, data]) => ({
        value,
        label: `${data.label} - ${data.count}`,
        count: data.count,
      })),
    ]);
  }, []);

  useEffect(() => {
    const filteredTournaments = selectedState
      ? allTournaments.filter((t) => t.location.state === selectedState)
      : allTournaments;

    const citiesWithCounts = filteredTournaments.reduce((acc, tournament) => {
      const city = tournament.location.city;
      if (!acc[city]) {
        acc[city] = { count: 1, label: city };
      } else {
        acc[city].count++;
      }
      return acc;
    }, {} as Record<string, { count: number; label: string }>);

    setCities([
      {
        value: "",
        label: "Todas as Cidades",
        count: filteredTournaments.length,
      },
      ...Object.entries(citiesWithCounts).map(([value, data]) => ({
        value,
        label: `${data.label} - ${data.count}`,
        count: data.count,
      })),
    ]);
    setSelectedCity("");
  }, [selectedState]);

  useEffect(() => {
    onFilterChange({
      state: selectedState,
      city: selectedCity,
      status: selectedStatus,
      search: searchTerm,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCity, selectedStatus, searchTerm]);

  const handleClear = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedStatus("");
    setSearchTerm("");
    onFilterChange({ state: "", city: "", status: "", search: "" });
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100
                  p-4 md:p-6 mb-6 ${isOpen ? "pb-4" : "pb-3"}`}
    >
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h2 className="text-lg md:text-xl font-bold text-dark-800 flex items-center">
            <Filter size={20} className="mr-2 text-primary-600" />
            Filtrar Torneios
          </h2>

          {hasActiveFilters && (
            <span
              className="ml-3 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs md:text-sm font-semibold
                         bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200"
            >
              {filteredCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="hidden md:inline text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
            >
              Limpar seleção
            </button>
          )}

          <button
            type="button"
            className="md:hidden text-primary-600 font-semibold"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="filters-content"
          >
            {isOpen ? "Fechar" : "Abrir"}
          </button>
        </div>
      </div>

      {/* Conteúdo com collapse em max-height (funciona melhor no mobile) */}
      <div
        id="filters-content"
        className={`
          transition-[max-height] duration-300 ease-in-out
          ${isOpen ? "max-h-[1200px]" : "max-h-0 overflow-hidden"}
          md:max-h-none md:overflow-visible
        `}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Estado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-dark-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Cidade
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-dark-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-100"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as TournamentStatus | "")
                }
              >
                <option value="">Todos os Status</option>
                <option value="open">Inscrições Abertas</option>
                <option value="in-progress">Em Andamento</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Pesquisar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-dark-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome do torneio ou clube..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="mt-3 md:hidden text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
              >
                Limpar seleção
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
