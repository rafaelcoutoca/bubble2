// src/pages/TournamentDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/Buttons";

import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  DollarSign,
  Phone,
  Mail,
  Instagram,
  Edit2,
  Play,
  Crown,
  Medal,
  Info,
  Navigation,
  Building2,
  CheckCircle,
  X,
  Share2,
  Search,
  Plus,
  Check,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ScoreEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: any;
  onSave: (
    matchId: string,
    team1Score: number[],
    team2Score: number[],
    winner: number
  ) => void;
}

const ScoreEditModal: React.FC<ScoreEditModalProps> = ({
  isOpen,
  onClose,
  match,
  onSave,
}) => {
  const [team1Sets, setTeam1Sets] = useState<number[]>([0, 0, 0]);
  const [team2Sets, setTeam2Sets] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    if (match && isOpen) {
      setTeam1Sets(match.team1Score || [0, 0, 0]);
      setTeam2Sets(match.team2Score || [0, 0, 0]);
    }
  }, [match, isOpen]);

  if (!isOpen || !match) return null;

  const handleSave = () => {
    const team1Total = team1Sets.reduce((a, b) => a + b, 0);
    const team2Total = team2Sets.reduce((a, b) => a + b, 0);
    const winner = team1Total > team2Total ? 1 : 2;

    onSave(match.id, team1Sets, team2Sets, winner);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Editar Placar</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="font-medium text-gray-900">{match.team1}</p>
            <p className="text-sm text-gray-600">vs</p>
            <p className="font-medium text-gray-900">{match.team2}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {match.team1}
              </label>
              {[0, 1, 2].map((setIndex) => (
                <input
                  key={setIndex}
                  type="number"
                  min="0"
                  max="7"
                  value={team1Sets[setIndex]}
                  onChange={(e) => {
                    const newSets = [...team1Sets];
                    newSets[setIndex] = parseInt(e.target.value) || 0;
                    setTeam1Sets(newSets);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder={`Set ${setIndex + 1}`}
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {match.team2}
              </label>
              {[0, 1, 2].map((setIndex) => (
                <input
                  key={setIndex}
                  type="number"
                  min="0"
                  max="7"
                  value={team2Sets[setIndex]}
                  onChange={(e) => {
                    const newSets = [...team2Sets];
                    newSets[setIndex] = parseInt(e.target.value) || 0;
                    setTeam2Sets(newSets);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder={`Set ${setIndex + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSave: (category: string, player1: string, player2: string) => void;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory && player1 && player2) {
      onSave(selectedCategory, player1, player2);
      setSelectedCategory("");
      setPlayer1("");
      setPlayer2("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Adicionar Dupla</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jogador 1
            </label>
            <input
              type="text"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nome do primeiro jogador"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jogador 2
            </label>
            <input
              type="text"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Nome do segundo jogador"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [tournament, setTournament] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("informacoes");
  const [activeSubTab, setActiveSubTab] = useState("gerais");
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCourt, setSelectedCourt] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  // Roles
  const isCreator =
    user && profile?.user_type === "club" && tournament?.club_id === user.id;
  const isAthlete = user && profile?.user_type === "athlete";

  // Sync tabs from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab") || undefined;
    const sub = params.get("sub") || params.get("subtab") || undefined;
    const validTabs = [
      "informacoes",
      "inscritos",
      "grupos",
      "jogos",
      "resultados",
      "ao-vivo",
    ];
    const validSubs = ["gerais", "contato", "localizacao", "regras", "faq"];

    if (tab && validTabs.includes(tab) && tab !== activeTab) setActiveTab(tab);
    if (sub && validSubs.includes(sub) && sub !== activeSubTab)
      setActiveSubTab(sub);
  }, [location.search]); // eslint-disable-line

  const setSearchParams = (next: { tab?: string; sub?: string }) => {
    const params = new URLSearchParams(location.search);
    if (next.tab) params.set("tab", next.tab);
    else params.delete("tab");
    if (next.sub) params.set("sub", next.sub);
    else params.delete("sub");
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  };

  useEffect(() => {
    const loadTournament = () => {
      const clubTournaments = JSON.parse(
        localStorage.getItem("clubTournaments") || "[]"
      );
      const foundTournament = clubTournaments.find((t: any) => t.id === id);

      if (foundTournament) {
        if (
          !foundTournament.location ||
          typeof foundTournament.location !== "object"
        ) {
          foundTournament.location = { city: "São Paulo", state: "SP" };
        }
        setTournament(foundTournament);
      }
      setLoading(false);
    };

    loadTournament();
  }, [id]);

  const handleEditScore = (match: any) => {
    setSelectedMatch(match);
    setEditModalOpen(true);
  };

  const handleSaveScore = (
    matchId: string,
    team1Score: number[],
    team2Score: number[],
    winner: number
  ) => {
    console.log("Saving score:", { matchId, team1Score, team2Score, winner });
  };

  const handleAddTeam = (
    category: string,
    player1: string,
    player2: string
  ) => {
    console.log("Adding team:", { category, player1, player2 });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tournament.name,
        text: `Confira este torneio de padel: ${tournament.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const handleClubClick = () => {
    if (tournament?.club_id) navigate(`/clubes/${tournament.club_id}`);
    else navigate("/clubes");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Torneio não encontrado
          </h2>
          <button
            onClick={() => navigate("/tournaments")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Voltar aos Torneios
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "informacoes", name: "Informações", icon: Info },
    { id: "inscritos", name: "Inscritos", icon: Users },
    { id: "grupos", name: "Grupos", icon: Trophy },
    { id: "jogos", name: "Jogos", icon: Calendar },
    { id: "resultados", name: "Resultados", icon: Medal },
    { id: "ao-vivo", name: "Ao Vivo", icon: Play },
  ];

  const subTabs = [
    { id: "gerais", name: "Gerais" },
    { id: "contato", name: "Contato" },
    { id: "localizacao", name: "Localização" },
    { id: "regras", name: "Regras" },
    { id: "faq", name: "FAQ" },
  ];

  // --- Mock data (mantido) ---
  const mockGroups = [
    {
      name: "Grupo A",
      category: "Open Masculina",
      teams: [
        {
          name: "João Silva / Pedro Santos",
          wins: 2,
          gamesFor: 24,
          gamesAgainst: 18,
          position: 1,
        },
        {
          name: "Maria Costa / Ana Lima",
          wins: 1,
          gamesFor: 20,
          gamesAgainst: 22,
          position: 2,
        },
        {
          name: "Carlos Dias / Rafael Alves",
          wins: 0,
          gamesFor: 16,
          gamesAgainst: 20,
          position: 3,
        },
      ],
      matches: [
        {
          id: "1",
          team1: "João Silva / Pedro Santos",
          team2: "Maria Costa / Ana Lima",
          score: "6-4, 6-3",
          status: "completed",
          team1Score: [6, 6],
          team2Score: [4, 3],
          winner: 1,
        },
        {
          id: "2",
          team1: "João Silva / Pedro Santos",
          team2: "Carlos Dias / Rafael Alves",
          score: "vs",
          status: "scheduled",
          team1Score: [],
          team2Score: [],
          winner: null,
        },
        {
          id: "3",
          team1: "Maria Costa / Ana Lima",
          team2: "Carlos Dias / Rafael Alves",
          score: "vs",
          status: "scheduled",
          team1Score: [],
          team2Score: [],
          winner: null,
        },
      ],
    },
    {
      name: "Grupo B",
      category: "Open Masculina",
      teams: [
        {
          name: "Lucas Silva / Pedro Ribeiro",
          wins: 2,
          gamesFor: 26,
          gamesAgainst: 16,
          position: 1,
        },
        {
          name: "Rafael Ferreira / Rafael Santos",
          wins: 1,
          gamesFor: 22,
          gamesAgainst: 24,
          position: 2,
        },
        {
          name: "Bruno Alves / Thiago Costa",
          wins: 0,
          gamesFor: 14,
          gamesAgainst: 22,
          position: 3,
        },
      ],
      matches: [
        {
          id: "4",
          team1: "Lucas Silva / Pedro Ribeiro",
          team2: "Rafael Ferreira / Rafael Santos",
          score: "6-4, 6-3",
          status: "completed",
          team1Score: [6, 6],
          team2Score: [4, 3],
          winner: 1,
        },
        {
          id: "5",
          team1: "Lucas Silva / Pedro Ribeiro",
          team2: "Bruno Alves / Thiago Costa",
          score: "vs",
          status: "scheduled",
          team1Score: [],
          team2Score: [],
          winner: null,
        },
      ],
    },
  ];

  const mockRegistrations = [
    {
      id: "1",
      category: "Open Masculina",
      player1: {
        name: "João Silva",
        city: "São Paulo, SP",
        avatar:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
      },
      player2: {
        name: "Pedro Santos",
        city: "Rio de Janeiro, RJ",
        avatar:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
      },
      paymentStatus: "confirmed",
    },
    {
      id: "2",
      category: "Open Masculina",
      player1: {
        name: "Carlos Lima",
        city: "Belo Horizonte, MG",
        avatar:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      },
      player2: {
        name: "Rafael Dias",
        city: "Salvador, BA",
        avatar:
          "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg",
      },
      paymentStatus: "pending",
    },
    {
      id: "3",
      category: "Open Feminina",
      player1: {
        name: "Maria Costa",
        city: "São Paulo, SP",
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      },
      player2: {
        name: "Ana Lima",
        city: "Campinas, SP",
        avatar:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      },
      paymentStatus: "confirmed",
    },
    {
      id: "4",
      category: "Open Feminina",
      player1: {
        name: "Julia Rocha",
        city: "Curitiba, PR",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      },
      player2: {
        name: "Camila Souza",
        city: "Porto Alegre, RS",
        avatar:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
      },
      paymentStatus: "confirmed",
    },
  ];

  const mockMatches = [
    {
      id: "MATCH001",
      team1: "João Silva / Pedro Santos",
      team2: "Carlos Lima / Rafael Dias",
      score: "6-4, 6-3",
      status: "completed",
      court: "Quadra 1",
      date: "11/07/2025",
      time: "09:00",
      category: "Open Masculina",
      group: "Grupo A",
      winner: 1,
    },
    {
      id: "MATCH002",
      team1: "Maria Costa / Ana Lima",
      team2: "Julia Rocha / Camila Souza",
      score: "vs",
      status: "scheduled",
      court: "Quadra 2",
      date: "11/07/2025",
      time: "10:30",
      category: "Open Feminina",
      group: "Grupo B",
      winner: null,
    },
  ];

  const mockChampions = [
    {
      category: "Open Masculina",
      champion: "João Silva / Pedro Santos",
      runnerUp: "Carlos Lima / Rafael Dias",
      finalScore: "6-4, 6-3",
    },
    {
      category: "Open Feminina",
      champion: "Maria Costa / Ana Lima",
      runnerUp: "Julia Rocha / Camila Souza",
      finalScore: "7-5, 6-4",
    },
  ];

  const mockLiveCourts = [
    {
      id: "1",
      name: "Quadra Central",
      status: "Ao Vivo",
      match: "João Silva / Pedro vs Maria Costa / Ana",
      streamUrl: "https://youtube.com/live/123",
    },
    {
      id: "2",
      name: "Quadra 2",
      status: "Próximo",
      match: "Carlos Lima / Rafael vs Julia Rocha / Camila",
      streamUrl: null,
    },
    {
      id: "3",
      name: "Quadra 3",
      status: "Livre",
      match: null,
      streamUrl: null,
    },
  ];

  // Helpers
  const formatDateRange = (startISO?: string, endISO?: string) => {
    if (!startISO) return "";
    const start = new Date(startISO);
    const end = endISO ? new Date(endISO) : start;

    const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
    const shortMonth = (d: Date) =>
      cap(
        new Intl.DateTimeFormat("pt-BR", { month: "short" })
          .format(d)
          .replace(".", "")
      );

    const sameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    if (sameDay) {
      return `${start.getDate()} ${shortMonth(start)} ${start.getFullYear()}`;
    }

    const sameMonth =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth();

    if (sameMonth) {
      return `${start.getDate()} a ${end.getDate()} ${shortMonth(
        end
      )} ${end.getFullYear()}`;
    }

    const sameYear = start.getFullYear() === end.getFullYear();
    if (sameYear) {
      return `${start.getDate()} ${shortMonth(
        start
      )} a ${end.getDate()} ${shortMonth(end)} ${end.getFullYear()}`;
    }

    return `${start.getDate()} ${shortMonth(
      start
    )} ${start.getFullYear()} a ${end.getDate()} ${shortMonth(
      end
    )} ${end.getFullYear()}`;
  };

  const getFilteredRegistrations = () => {
    return mockRegistrations.filter((reg) => {
      const matchesCategory =
        selectedCategory === "all" || reg.category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        reg.player1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.player2.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const getFilteredGroups = () => {
    return mockGroups.filter((group) => {
      const matchesCategory =
        selectedCategory === "all" || group.category === selectedCategory;
      const matchesSearch =
        searchTerm === "" ||
        group.teams.some((team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  };

  const getFilteredMatches = () => {
    return mockMatches.filter((match) => {
      const matchesCategory =
        selectedCategory === "all" || match.category === selectedCategory;
      const matchesCourt =
        selectedCourt === "all" || match.court === selectedCourt;
      const matchesDate = selectedDate === "all" || match.date === selectedDate;
      const matchesSearch =
        searchTerm === "" ||
        match.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesCourt && matchesDate && matchesSearch;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "informacoes":
        return renderInformacoes();
      case "inscritos":
        return renderInscritos();
      case "grupos":
        return renderGrupos();
      case "jogos":
        return renderJogos();
      case "resultados":
        return renderResultados();
      case "ao-vivo":
        return renderAoVivo();
      default:
        return renderInformacoes();
    }
  };

  // Utils bem simples pra linkar corretamente
  const formatPhoneForWhatsApp = (raw?: string) => {
    if (!raw) return null;
    // remove tudo que não for número
    let digits = raw.replace(/\D/g, "");
    // se já tiver DDI (ex.: 55...), mantém. Se só tiver 10/11 dígitos, presume BR (55).
    if (digits.length <= 11) digits = "55" + digits;
    return `https://wa.me/${digits}`;
  };

  const instagramToUrl = (handleOrUrl?: string) => {
    if (!handleOrUrl) return null;
    // aceita @usuario, usuario ou url completa
    if (handleOrUrl.startsWith("http")) return handleOrUrl;
    const handle = handleOrUrl.replace(/^@/, "");
    return `https://instagram.com/${handle}`;
  };

  // --- Sidebar (Organizador) reutilizável ---
  const renderSidebar = () => {
    // dados do organizador (clube criador) com fallbacks
    const organizerName =
      tournament?.club?.name || tournament?.mainClub || "Clube Organizador";

    const phone =
      tournament?.club?.phone ||
      tournament?.clubContact?.phone ||
      tournament?.phone ||
      null;

    const email =
      tournament?.club?.email ||
      tournament?.clubContact?.email ||
      tournament?.email ||
      null;

    const instagram =
      tournament?.club?.instagram ||
      tournament?.clubContact?.instagram ||
      tournament?.instagram ||
      null;

    const waLink = formatPhoneForWhatsApp(phone); // null se não houver
    const igLink = instagramToUrl(instagram); // null se não houver

    const inscritosCount =
      typeof tournament?.participantsCount === "number"
        ? tournament.participantsCount
        : mockRegistrations.length;

    const openNewTab = (url: string) => window.open(url, "_blank", "noopener");

    return (
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-32">
          {/* Club Info */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="text-purple-600" size={24} />
            </div>
            <button
              onClick={handleClubClick}
              className="font-bold text-purple-600 hover:text-purple-700 underline"
            >
              {organizerName}
            </button>
            <p className="text-gray-600 text-sm">Organizador</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {inscritosCount}
              </div>
              <div className="text-xs text-gray-600">Inscritos</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-bold text-green-600">
                R$ {tournament.registrationFee?.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">Inscrição</div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-4 md:space-y-5 mb-10">
            <Button
              variant="accentOutline"
              full
              leftIcon={<Phone size={16} />}
              onClick={() => waLink && openNewTab(waLink)}
              disabled={!waLink}
            >
              {phone ? "WhatsApp" : "WhatsApp indisponível"}
            </Button>

            <Button
              onClick={handleClubClick}
              variant="blueOutline"
              full
              leftIcon={<Building2 size={16} />}
            >
              Perfil do Clube
            </Button>

            <Button
              variant="purpleOutline"
              full
              leftIcon={<Instagram size={16} />}
              onClick={() => igLink && openNewTab(igLink)}
              disabled={!igLink}
            >
              {instagram ? "Instagram" : "Instagram indisponível"}
            </Button>

            <Button
              variant="blueOutline"
              full
              leftIcon={<Mail size={16} />}
              onClick={() =>
                email && (window.location.href = `mailto:${email}`)
              }
              disabled={!email}
            >
              {email ? "E-mail" : "E-mail indisponível"}
            </Button>
          </div>

          {/* Mini Map */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Localização</h4>
            <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
              <MapPin className="text-gray-500" size={24} />
            </div>
          </div>

          {/* Mini Calendar */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Data do Evento</h4>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Date(tournament.startDate).getDate()}
              </div>
              <div className="text-sm text-purple-600">
                {new Date(tournament.startDate).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInformacoes = () => {
    switch (activeSubTab) {
      case "gerais":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Descrição */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Info className="text-purple-600 mr-3" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">
                    Descrição do Torneio
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {tournament.description ||
                    "Torneio de padel com as melhores duplas da região. Venha participar desta competição emocionante e mostre suas habilidades nas quadras!"}
                </p>
              </div>

              {/* Datas */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Calendar className="text-purple-600 mr-3" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">
                    Datas Importantes
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                    <CheckCircle className="text-green-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Início das Inscrições
                      </p>
                      <p className="text-gray-600">
                        {new Date(tournament.startDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                    <Clock className="text-orange-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Fim das Inscrições
                      </p>
                      <p className="text-gray-600">
                        {new Date(tournament.endDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                    <Trophy className="text-purple-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Data do Torneio
                      </p>
                      <p className="text-gray-600">
                        {new Date(tournament.startDate).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                    <Edit2 className="text-blue-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Prazo de Alteração
                      </p>
                      <p className="text-gray-600">Até 24h antes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taxas */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <DollarSign className="text-green-600 mr-3" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">
                    Taxas de Inscrição
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">
                          Categoria
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">
                          Valor
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.categories?.map(
                        (category: string, index: number) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {category}
                            </td>
                            <td className="px-4 py-3 text-green-600 font-bold">
                              R$ {tournament.registrationFee?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                Disponível
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Local */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <MapPin className="text-red-600 mr-3" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">
                    Local do Evento
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-700 mb-4">
                      <button
                        onClick={handleClubClick}
                        className="font-bold text-purple-600 hover:text-purple-700 underline"
                      >
                        {tournament.mainClub}
                      </button>
                      <br />
                      Rua das Quadras, 123
                      <br />
                      São Paulo - SP, 01234-567
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                      <Navigation className="mr-2" size={16} />
                      Como Chegar
                    </button>
                  </div>
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <p className="text-gray-600">Mapa do Google Maps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            {renderSidebar()}
          </div>
        );

      case "contato":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Informações de Contato
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="text-green-600 mr-4" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">Telefone</p>
                      <p className="text-gray-600">(11) 9999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Mail className="text-blue-600 mr-4" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">E-mail</p>
                      <p className="text-gray-600">contato@clube.com</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Instagram className="text-pink-600 mr-4" size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">Instagram</p>
                      <p className="text-gray-600">@clubepadel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {renderSidebar()}
          </div>
        );

      case "localizacao":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Localização
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Endereço
                    </h4>
                    <p className="text-gray-700">
                      Rua das Quadras, 123
                      <br />
                      Bairro Esportivo
                      <br />
                      São Paulo - SP, 01234-567
                    </p>
                  </div>
                  <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-600">
                      Mapa Interativo do Google Maps
                    </p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                    <Navigation className="mr-2" size={20} />
                    Abrir no Google Maps
                  </button>
                </div>
              </div>
            </div>

            {renderSidebar()}
          </div>
        );

      case "regras":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Regras do Torneio
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Formato
                    </h4>
                    <p className="text-gray-700">
                      Fase de grupos seguida de mata-mata
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Pontuação
                    </h4>
                    <p className="text-gray-700">
                      Melhor de 3 sets, com tie-break no terceiro set
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Equipamentos
                    </h4>
                    <p className="text-gray-700">
                      Raquetes e bolas fornecidas pelo clube
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {renderSidebar()}
          </div>
        );

      case "faq":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Como me inscrevo?
                    </h4>
                    <p className="text-gray-700">
                      Clique no botão "Inscreva-se" e preencha o formulário.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Posso cancelar minha inscrição?
                    </h4>
                    <p className="text-gray-700">
                      Sim, até 48 horas antes do início do torneio.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Preciso levar equipamentos?
                    </h4>
                    <p className="text-gray-700">
                      Não, raquetes e bolas são fornecidas pelo clube.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {renderSidebar()}
          </div>
        );

      default:
        return null;
    }
  };

  const renderInscritos = () => {
    const filteredRegistrations = getFilteredRegistrations();
    const categories = [
      "all",
      ...Array.from(new Set(mockRegistrations.map((r) => r.category))),
    ];

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nome do atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Categorias</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {isCreator && (
              <button
                onClick={() => setAddTeamModalOpen(true)}
                className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 flex items-center whitespace-nowrap"
              >
                <Plus className="mr-2" size={16} />
                Adicionar Dupla
              </button>
            )}
            {(isAthlete || !user) && (
              <button
                onClick={() => {
                  if (!user) {
                    alert("Faça login para se inscrever no torneio");
                  } else {
                    setActiveTab("inscritos");
                    setSearchParams({ tab: "inscritos" });
                    alert("Fluxo de inscrição será implementado em breve.");
                  }
                }}
                className="group bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 hover:from-accent-400 hover:to-accent-300 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center whitespace-nowrap"
              >
                Inscrever-se
                <ArrowUpRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>
        </div>

        {/* Registrations */}
        <div className="space-y-4">
          {Object.entries(
            filteredRegistrations.reduce((acc, reg) => {
              if (!acc[reg.category]) acc[reg.category] = [];
              acc[reg.category].push(reg);
              return acc;
            }, {} as Record<string, typeof mockRegistrations>)
          ).map(([category, registrations]) => (
            <div
              key={category}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {category}
              </h3>
              <div className="space-y-3">
                {registrations.map((registration, index) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <img
                            src={registration.player1.avatar}
                            alt={registration.player1.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {registration.player1.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {registration.player1.city}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <img
                            src={registration.player2.avatar}
                            alt={registration.player2.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {registration.player2.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {registration.player2.city}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        {registration.paymentStatus === "confirmed" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check size={12} className="mr-1" />
                            Confirmado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={12} className="mr-1" />
                            Aguardando Pagamento
                          </span>
                        )}
                      </div>
                    </div>
                    {isCreator && (
                      <div className="flex items-center space-x-2">
                        {registration.paymentStatus === "pending" && (
                          <button
                            onClick={() => {
                              console.log(
                                "Confirmar pagamento da dupla:",
                                registration.id
                              );
                            }}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Confirmar pagamento"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            console.log("Editar dupla:", registration.id);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar dupla"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Tem certeza que deseja remover esta dupla?"
                              )
                            ) {
                              console.log("Remover dupla:", registration.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover dupla"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGrupos = () => {
    const filteredGroups = getFilteredGroups();
    const categories = [
      "all",
      ...Array.from(new Set(mockGroups.map((g) => g.category))),
    ];

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar por nome do atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Categorias</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGroups.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
                <h3 className="text-lg font-bold">{group.name}</h3>
                <p className="text-purple-100 text-sm">{group.category}</p>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-semibold text-gray-700">
                          Dupla
                        </th>
                        <th className="text-center py-2 font-semibold text-gray-700">
                          V
                        </th>
                        <th className="text-center py-2 font-semibold text-gray-700">
                          Saldo
                        </th>
                        <th className="text-center py-2 font-semibold text-gray-700">
                          G.Pro
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.teams.map((team, teamIndex) => (
                        <tr
                          key={teamIndex}
                          className={`${
                            team.position === 1
                              ? "bg-green-50"
                              : team.position === 2
                              ? "bg-green-25"
                              : "bg-red-25"
                          }`}
                        >
                          <td className="py-2">
                            <div className="flex items-center">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                                  team.position === 1
                                    ? "bg-green-500 text-white"
                                    : team.position === 2
                                    ? "bg-green-400 text-white"
                                    : "bg-red-400 text-white"
                                }`}
                              >
                                {team.position}
                              </span>
                              <span className="text-xs font-medium">
                                {team.name}
                              </span>
                            </div>
                          </td>
                          <td className="text-center py-2 font-semibold">
                            {team.wins}
                          </td>
                          <td className="text-center py-2 text-blue-600 font-semibold">
                            {team.gamesFor - team.gamesAgainst > 0 ? "+" : ""}
                            {team.gamesFor - team.gamesAgainst}
                          </td>
                          <td className="text-center py-2 font-semibold">
                            {team.gamesFor}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                    Jogos
                  </h4>
                  <div className="space-y-2">
                    {group.matches.map((match, matchIndex) => (
                      <div
                        key={matchIndex}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-900 mb-1">
                                {match.team1}
                              </div>
                              <div className="text-xs font-medium text-gray-900">
                                {match.team2}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                              <div className="text-center">
                                <div className="text-sm font-bold text-purple-600">
                                  {match.status === "completed"
                                    ? match.score
                                    : "vs"}
                                </div>
                              </div>
                              {isCreator && (
                                <button
                                  onClick={() => handleEditScore(match)}
                                  className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                                  title="Editar placar"
                                >
                                  <Edit2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderJogos = () => {
    const filteredMatches = getFilteredMatches();
    const categories = [
      "all",
      ...Array.from(new Set(mockMatches.map((m) => m.category))),
    ];
    const courts = [
      "all",
      ...Array.from(new Set(mockMatches.map((m) => m.court))),
    ];

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todas as Quadras</option>
              {courts.slice(1).map((court) => (
                <option key={court} value={court}>
                  {court}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Categorias</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate === "all" ? "" : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || "all")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Matches */}
        <div className="space-y-4">
          {filteredMatches.map((match, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {match.id}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {match.status === "completed" ? "Finalizado" : "Agendado"}
                  </span>
                </div>
                {isCreator && (
                  <button
                    onClick={() => handleEditScore(match)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                    title="Editar placar"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div
                    className={`font-semibold ${
                      match.winner === 1 ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {match.team1}
                  </div>
                </div>
                <div className="mx-4 text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {match.score}
                  </div>
                </div>
                <div className="text-center flex-1">
                  <div
                    className={`font-semibold ${
                      match.winner === 2 ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {match.team2}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {match.court} • {match.date} • {match.time} • {match.category} •{" "}
                {match.group}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResultados = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campeões</h2>
        <p className="text-gray-600">Resultados finais do torneio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockChampions.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
              <h3 className="text-lg font-bold">{result.category}</h3>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Crown className="text-yellow-500 mr-2" size={32} />
                  <span className="text-2xl">🏆</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  CAMPEÕES
                </h4>
                <p className="text-lg font-semibold text-purple-600">
                  {result.champion}
                </p>
              </div>

              <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Placar da Final</p>
                <p className="text-xl font-bold text-gray-900">
                  {result.finalScore}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Medal className="text-gray-400 mr-2" size={24} />
                  <span className="text-lg">🥈</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-1">
                  Vice-campeões
                </h4>
                <p className="text-gray-600">{result.runnerUp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAoVivo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Transmissões Ao Vivo
        </h2>
        <p className="text-gray-600">Acompanhe os jogos em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLiveCourts.map((court, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-32 flex items-center justify-center">
                <Play className="text-white" size={48} />
              </div>
              {court.status === "Ao Vivo" && (
                <div className="absolute top-2 right-2">
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                    AO VIVO
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {court.name}
              </h3>

              {court.match ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Jogo atual:</p>
                  <p className="font-medium text-gray-900">{court.match}</p>
                </div>
              ) : (
                <p className="text-gray-500 mb-4">Nenhum jogo agendado</p>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    court.status === "Ao Vivo"
                      ? "bg-red-100 text-red-800"
                      : court.status === "Próximo"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {court.status}
                </span>

                {court.streamUrl && (
                  <button className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center text-sm">
                    <Play className="mr-1" size={14} />
                    Assistir
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ----------- RENDER -----------
  const inscritosCount =
    typeof tournament?.participantsCount === "number"
      ? tournament.participantsCount
      : mockRegistrations.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <DashboardHeader /> : <Navbar />}

      {/* Hero Banner (mobile ganha margem para não ficar atrás do header) */}
      <div className="relative mt-16 md:mt-0 h-52 md:h-80 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-transparent"></div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-white mb-3 md:mb-0">
                <h1 className="text-3xl md:text-6xl font-black mb-2">
                  {tournament.name}
                </h1>

                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-base md:text-lg">
                  <div className="flex items-center">
                    <Building2 className="mr-2" size={20} />
                    <button
                      onClick={handleClubClick}
                      className="hover:text-green-300"
                    >
                      {tournament.mainClub}
                    </button>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="mr-2" size={20} />
                    <span>
                      {tournament.location?.city || "São Paulo"},{" "}
                      {tournament.location?.state || "SP"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="mr-2" size={20} />
                    <span>
                      {formatDateRange(
                        tournament.startDate,
                        tournament.endDate
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-200 mt-1">
                  <Users className="mr-2" size={18} />
                  <span>{inscritosCount} inscritos</span>
                </div>

                {/* CTA + Share no mobile (compacto) */}
                {(isCreator || isAthlete || !user) && (
                  <div className="mt-3 flex items-center gap-2 md:hidden">
                    {isCreator ? (
                      <button className="bg-accent-400 text-dark-900 px-4 py-2 text-sm rounded-lg font-semibold flex items-center shadow">
                        <Edit2 size={16} className="mr-2" />
                        Editar
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!user) {
                            alert("Faça login para se inscrever no torneio");
                          } else {
                            setActiveTab("inscritos");
                            setSearchParams({ tab: "inscritos" });
                          }
                        }}
                        className="bg-accent-400 text-dark-900 hover:bg-accent-300 px-4 py-2 text-sm rounded-lg font-semibold flex items-center shadow"
                      >
                        Inscrever-se
                        <ArrowUpRight size={16} className="ml-1" />
                      </button>
                    )}

                    <button
                      onClick={handleShare}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                      title="Compartilhar torneio"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA desktop alinhado à direita */}
        {(isCreator || isAthlete || !user) && (
          <div className="hidden md:block absolute inset-x-0 bottom-4 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
              {isCreator ? (
                <button className="group bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 hover:from-accent-400 hover:to-accent-300 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center">
                  <Edit2 size={20} className="mr-2" />
                  Editar
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      alert("Faça login para se inscrever no torneio");
                    } else {
                      setActiveTab("inscritos");
                      setSearchParams({ tab: "inscritos" });
                    }
                  }}
                  className="group bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 hover:from-accent-400 hover:to-accent-300 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center"
                >
                  Inscrever-se
                  <ArrowUpRight
                    size={20}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile: chips com wrap | Desktop: mesma UI anterior com scroll */}
            <div className="flex flex-wrap gap-2 md:gap-0 md:flex-nowrap md:overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchParams({
                        tab: tab.id,
                        sub:
                          tab.id === "informacoes" ? activeSubTab : undefined,
                      });
                    }}
                    className={`flex items-center px-3 py-2 text-sm rounded-lg md:rounded-none md:px-4 md:py-4 md:text-sm whitespace-nowrap md:border-b-2 transition-colors ${
                      isActive
                        ? "bg-purple-50 text-purple-700 md:bg-transparent md:border-purple-600 md:text-purple-600"
                        : "text-gray-600 hover:text-gray-900 md:border-transparent md:hover:border-gray-300"
                    }`}
                  >
                    <Icon className="mr-2" size={16} />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Share só no desktop aqui */}
            <button
              onClick={handleShare}
              className="hidden md:flex items-center px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors"
              title="Compartilhar torneio"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Subtabs */}
      {activeTab === "informacoes" && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 md:gap-0 md:flex-nowrap md:overflow-x-auto">
              {subTabs.map((subTab) => {
                const active = activeSubTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => {
                      setActiveSubTab(subTab.id);
                      setSearchParams({ tab: "informacoes", sub: subTab.id });
                    }}
                    className={`px-3 py-2 text-sm rounded-lg md:rounded-none md:px-4 md:py-3 md:border-b-2 whitespace-nowrap transition-colors ${
                      active
                        ? "bg-purple-50 text-purple-700 md:bg-white md:border-purple-600 md:text-purple-600"
                        : "text-gray-600 hover:text-gray-900 md:border-transparent"
                    }`}
                  >
                    {subTab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* Modals */}
      <ScoreEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        match={selectedMatch}
        onSave={handleSaveScore}
      />

      <AddTeamModal
        isOpen={addTeamModalOpen}
        onClose={() => setAddTeamModalOpen(false)}
        categories={tournament.categories || []}
        onSave={handleAddTeam}
      />
    </div>
  );
};

export default TournamentDetail;
