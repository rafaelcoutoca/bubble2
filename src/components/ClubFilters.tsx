import React, { useEffect, useMemo, useRef, useState } from "react";
import { Filter, MapPin, Search, ChevronDown, Check, X } from "lucide-react";

type ClubMinimal = {
  id?: string;
  name: string;
  city: string;
  state: string;
  services?: string[];
};

export type ClubFiltersValue = {
  state: string;
  city: string;
  services: string[];
  search: string;
};

type Props = {
  clubs: ClubMinimal[]; // passe sua lista de clubes (mock ou do backend)
  onFilterChange: (filters: ClubFiltersValue) => void;
};

const ALL_SERVICES = [
  "Aulas",
  "Torneios",
  "Aluguel de Material",
  "Bar/Restaurante",
  "Estacionamento",
  "Vestiários",
];

const ClubFilters: React.FC<Props> = ({ clubs, onFilterChange }) => {
  // estado local
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isOpen, setIsOpen] = useState(false); // collapse mobile
  const [servicesOpen, setServicesOpen] = useState(false); // popover serviços
  const servicesRef = useRef<HTMLDivElement | null>(null);

  // fechar dropdown serviços ao clicar fora
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    if (servicesOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [servicesOpen]);

  // opções de estado (com contagem)
  const stateOptions = useMemo(() => {
    const counts = clubs.reduce<Record<string, number>>((acc, c) => {
      acc[c.state] = (acc[c.state] || 0) + 1;
      return acc;
    }, {});
    return [
      { value: "", label: "Todos os Estados" },
      ...Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([value, count]) => ({ value, label: `${value} - ${count}` })),
    ];
  }, [clubs]);

  // opções de cidade dependentes do estado (com contagem)
  const cityOptions = useMemo(() => {
    const source = selectedState
      ? clubs.filter((c) => c.state === selectedState)
      : clubs;
    const counts = source.reduce<Record<string, number>>((acc, c) => {
      acc[c.city] = (acc[c.city] || 0) + 1;
      return acc;
    }, {});
    const base = [
      { value: "", label: "Todas as Cidades" },
      ...Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([value, count]) => ({ value, label: `${value} - ${count}` })),
    ];
    return base;
  }, [clubs, selectedState]);

  // resetar cidade quando trocar o estado
  useEffect(() => {
    setSelectedCity("");
  }, [selectedState]);

  // algum filtro ativo?
  const hasActive =
    !!selectedState ||
    !!selectedCity ||
    !!selectedServices.length ||
    !!searchTerm.trim();

  // propagar para o pai
  useEffect(() => {
    onFilterChange({
      state: selectedState,
      city: selectedCity,
      services: selectedServices,
      search: searchTerm,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCity, selectedServices, searchTerm]);

  // helpers
  const toggleService = (s: string) =>
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const clearAll = () => {
    setSelectedState("");
    setSelectedCity("");
    setSelectedServices([]);
    setSearchTerm("");
    onFilterChange({ state: "", city: "", services: [], search: "" });
  };

  const servicesLabel =
    selectedServices.length > 0
      ? `Serviços (${selectedServices.length})`
      : "Serviços";

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 mb-8 ${
        isOpen ? "pb-4" : "pb-3"
      }`}
    >
      {/* cabeçalho */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center">
          <h2 className="text-lg md:text-xl font-bold text-dark-800 flex items-center">
            <Filter size={20} className="mr-2 text-primary-600" />
            Filtrar Clubes
          </h2>
          {hasActive && (
            <span className="ml-3 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs md:text-sm font-semibold bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200">
              ativo
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {hasActive && (
            <button
              type="button"
              onClick={clearAll}
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
            aria-controls="club-filters-content"
          >
            {isOpen ? "Fechar" : "Abrir"}
          </button>
        </div>
      </div>

      {/* conteúdo */}
      <div
        id="club-filters-content"
        className={`transition-[max-height] duration-300 ease-in-out ${
          isOpen ? "max-h-[1200px]" : "max-h-0 overflow-hidden"
        } md:max-h-none md:overflow-visible`}
      >
        {/* ordem: Estado → Cidade → Serviços (multi) → Busca */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Estado */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Estado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-dark-400" />
              </div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                {stateOptions.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cidade (habilita depois de escolher estado) */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Cidade
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-dark-300" />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-100"
              >
                {cityOptions.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Serviços (multiselect) */}
          <div className="flex flex-col" ref={servicesRef}>
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Serviços
            </label>
            <button
              type="button"
              onClick={() => setServicesOpen((v) => !v)}
              className={`w-full flex items-center justify-between px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                servicesOpen ? "border-primary-500" : "border-gray-300"
              } ${selectedServices.length ? "text-dark-800" : "text-dark-400"}`}
              aria-haspopup="listbox"
              aria-expanded={servicesOpen}
            >
              <span className="truncate">
                {selectedServices.length
                  ? selectedServices.join(", ")
                  : servicesLabel}
              </span>
              <ChevronDown size={18} />
            </button>

            {servicesOpen && (
              <div
                role="listbox"
                className="absolute z-20 mt-2 w-[min(22rem,90vw)] bg-white border border-gray-200 rounded-lg shadow-xl p-2 max-h-60 overflow-auto"
              >
                {selectedServices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedServices([])}
                    className="w-full text-left text-xs text-gray-600 hover:text-gray-900 px-2 py-1 flex items-center gap-1"
                  >
                    <X size={14} /> Limpar seleção
                  </button>
                )}

                {ALL_SERVICES.map((s) => {
                  const checked = selectedServices.includes(s);
                  return (
                    <label
                      key={s}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(s)}
                        className="h-4 w-4"
                      />
                      <span className="flex-1 text-sm">{s}</span>
                      {checked && (
                        <Check size={16} className="text-primary-600" />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Busca por nome */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-dark-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-dark-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome do clube ou cidade..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className="mt-3 md:hidden text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
          >
            Limpar seleção
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubFilters;
