import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  DollarSign,
  Edit,
  UserPlus,
  Play,
  Pause,
  Search,
  Filter,
  Star,
  Share2,
  Heart,
  Phone,
  Mail,
  Globe,
  Instagram,
} from "lucide-react";
import Navbar from "../components/Navbar";
import DashboardHeader from "../components/DashboardHeader";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import StatusBadge from "../components/StatusBadge";

interface Tournament {
  id: string;
  name: string;
  description: string;
  sport: string;
  startDate: string;
  endDate: string;
  registrationFee: number;
  status: "open" | "closed" | "in-progress" | "completed" | "scheduled";
  mainClub: string;
  location: { city: string; state: string };
  categories: string[];
  participantsCount: number;
  maxParticipants?: number;
  hasParticipantLimit?: boolean;
  club_id?: string;
  bannerImage?: string;
  profileImage?: string;
}

interface Participant {
  id: string;
  name: string;
  partner?: string;
  category: string;
  registrationDate: string;
  paymentStatus: "paid" | "pending" | "cancelled";
}

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "informacoes");
  const [activeSubTab, setActiveSubTab] = useState(searchParams.get("sub") || "gerais");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

  // Verificar se o usuário é o dono do torneio
  const isOwner = tournament && profile && 
    (profile.user_type === "club" && 
     (tournament.club_id === profile.id || tournament.mainClub === (profile.fantasy_name || profile.club_name)));

  useEffect(() => {
    if (id) {
      loadTournament();
      loadParticipants();
    }
  }, [id]);

  const loadTournament = () => {
    const clubTournaments = JSON.parse(localStorage.getItem("clubTournaments") || "[]");
    const foundTournament = clubTournaments.find((t: any) => String(t.id) === String(id));
    
    if (foundTournament) {
      setTournament({
        ...foundTournament,
        location: foundTournament.location || { city: "São Paulo", state: "SP" },
        sport: foundTournament.sport || "Padel",
      });
    }
    setLoading(false);
  };

  const loadParticipants = () => {
    // Mock data para participantes
    const mockParticipants: Participant[] = [
      {
        id: "1",
        name: "João Silva",
        partner: "Pedro Santos",
        category: "Open Masculina",
        registrationDate: "2024-03-15",
        paymentStatus: "paid",
      },
      {
        id: "2",
        name: "Maria Costa",
        partner: "Ana Oliveira",
        category: "Open Feminina",
        registrationDate: "2024-03-16",
        paymentStatus: "paid",
      },
      {
        id: "3",
        name: "Carlos Lima",
        partner: "Rafael Dias",
        category: "2ª Masculina",
        registrationDate: "2024-03-17",
        paymentStatus: "pending",
      },
    ];
    setParticipants(mockParticipants);
  };

  const toggleRegistrationStatus = () => {
    if (!tournament || !isOwner) return;

    const newStatus = tournament.status === "open" ? "closed" : "open";
    const updatedTournament = { ...tournament, status: newStatus };
    
    // Atualizar no localStorage
    const clubTournaments = JSON.parse(localStorage.getItem("clubTournaments") || "[]");
    const updatedTournaments = clubTournaments.map((t: any) => 
      String(t.id) === String(id) ? { ...t, status: newStatus } : t
    );
    localStorage.setItem("clubTournaments", JSON.stringify(updatedTournaments));
    
    setTournament(updatedTournament);
  };

  const handleEditTournament = () => {
    navigate(`/edit-tournament/${id}`);
  };

  const handleAddParticipant = () => {
    setShowAddParticipantModal(true);
  };

  const filteredParticipants = participants.filter((participant) => {
    const matchesCategory = selectedCategory === "all" || participant.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (participant.partner && participant.partner.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00Z").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-light">
        {user ? <DashboardHeader /> : <Navbar />}
        <div className="pt-16 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark-800 mb-4">Torneio não encontrado</h1>
            <button
              onClick={() => navigate("/tournaments")}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Voltar aos Torneios
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {user ? <DashboardHeader /> : <Navbar />}

      <div className="pt-16">
        {/* Banner Principal */}
        <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 py-16">
          {tournament.bannerImage && (
            <div className="absolute inset-0">
              <img
                src={tournament.bannerImage}
                alt="Banner do torneio"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
          )}
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                    {tournament.sport}
                  </span>
                  
                  {/* Status clicável para o dono */}
                  {isOwner ? (
                    <button
                      onClick={toggleRegistrationStatus}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold transition-all hover:scale-105 ${
                        tournament.status === "open"
                          ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200"
                      }`}
                    >
                      {tournament.status === "open" ? (
                        <>
                          <Play size={14} className="mr-1" />
                          Inscrições Abertas
                        </>
                      ) : (
                        <>
                          <Pause size={14} className="mr-1" />
                          Inscrições Pausadas
                        </>
                      )}
                    </button>
                  ) : (
                    <StatusBadge status={tournament.status} />
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                  {tournament.name}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-200">
                  <div className="flex items-center">
                    <Calendar size={20} className="mr-2 text-accent-500" />
                    <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={20} className="mr-2 text-accent-500" />
                    <span>{tournament.location.city}, {tournament.location.state}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={20} className="mr-2 text-accent-500" />
                    <span>R$ {tournament.registrationFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Botão Editar para o dono */}
              {isOwner && (
                <div className="mt-6 md:mt-0">
                  <button
                    onClick={handleEditTournament}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center font-semibold border border-white/30"
                  >
                    <Edit size={20} className="mr-2" />
                    Editar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: "informacoes", label: "Informações" },
                { id: "inscritos", label: "Inscritos" },
                { id: "chaveamento", label: "Chaveamento" },
                { id: "resultados", label: "Resultados" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-dark-500 hover:text-dark-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "inscritos" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <h2 className="text-2xl font-bold text-dark-900">
                  Participantes Inscritos ({filteredParticipants.length})
                </h2>
                
                {/* Filtros e Botão Adicionar Dupla */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
                  <div className="flex gap-2 items-center">
                    {/* Filtro por Categoria */}
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">Todas as Categorias</option>
                      {tournament.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    {/* Botão Adicionar Dupla (apenas para o dono) */}
                    {isOwner && (
                      <button
                        onClick={handleAddParticipant}
                        className="bg-gradient-to-r from-primary-900 to-primary-700 text-white px-4 py-2 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 flex items-center font-semibold shadow-lg whitespace-nowrap"
                      >
                        <UserPlus size={16} className="mr-2" />
                        Adicionar Dupla
                      </button>
                    )}
                  </div>

                  {/* Busca por Nome */}
                  <div className={`relative ${isOwner ? 'flex-1 md:w-48' : 'flex-1 md:w-64'}`}>
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Lista de Participantes */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {filteredParticipants.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-dark-900 mb-2">
                      {searchTerm || selectedCategory !== "all" 
                        ? "Nenhum participante encontrado" 
                        : "Nenhum participante inscrito"}
                    </h3>
                    <p className="text-dark-500">
                      {searchTerm || selectedCategory !== "all"
                        ? "Tente ajustar os filtros de busca."
                        : "As inscrições ainda não começaram ou ninguém se inscreveu ainda."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dupla
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data Inscrição
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status Pagamento
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredParticipants.map((participant) => (
                          <tr key={participant.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {participant.name}
                                </div>
                                {participant.partner && (
                                  <div className="text-sm text-gray-500">
                                    {participant.partner}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                {participant.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(participant.registrationDate).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  participant.paymentStatus === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : participant.paymentStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {participant.paymentStatus === "paid"
                                  ? "Pago"
                                  : participant.paymentStatus === "pending"
                                  ? "Pendente"
                                  : "Cancelado"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "informacoes" && (
            <div className="space-y-8">
              {/* Sub-navegação */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: "gerais", label: "Informações Gerais" },
                    { id: "clube", label: "Sobre o Clube" },
                    { id: "regulamento", label: "Regulamento" },
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setActiveSubTab(subTab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeSubTab === subTab.id
                          ? "border-primary-600 text-primary-600"
                          : "border-transparent text-dark-500 hover:text-dark-700"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {activeSubTab === "gerais" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Descrição</h3>
                      <p className="text-dark-600 leading-relaxed">
                        {tournament.description || "Nenhuma descrição disponível para este torneio."}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Categorias</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {tournament.categories.map((category) => (
                          <div
                            key={category}
                            className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-center"
                          >
                            <span className="text-primary-700 font-semibold text-sm">
                              {category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Detalhes</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Calendar size={18} className="mr-3 text-primary-600" />
                          <div>
                            <p className="text-sm text-dark-500">Período</p>
                            <p className="font-semibold text-dark-900">
                              {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={18} className="mr-3 text-primary-600" />
                          <div>
                            <p className="text-sm text-dark-500">Local</p>
                            <p className="font-semibold text-dark-900">
                              {tournament.location.city}, {tournament.location.state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <DollarSign size={18} className="mr-3 text-primary-600" />
                          <div>
                            <p className="text-sm text-dark-500">Taxa de Inscrição</p>
                            <p className="font-semibold text-dark-900">
                              R$ {tournament.registrationFee.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users size={18} className="mr-3 text-primary-600" />
                          <div>
                            <p className="text-sm text-dark-500">Participantes</p>
                            <p className="font-semibold text-dark-900">
                              {tournament.participantsCount}
                              {tournament.hasParticipantLimit && tournament.maxParticipants && 
                                ` / ${tournament.maxParticipants}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-dark-900 mb-4">Ações</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-3 px-4 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 font-semibold">
                          Inscrever-se
                        </button>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-white border-2 border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-all duration-300 flex items-center justify-center">
                            <Heart size={16} className="mr-2" />
                            Favoritar
                          </button>
                          <button className="flex-1 bg-white border-2 border-primary-600 text-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-all duration-300 flex items-center justify-center">
                            <Share2 size={16} className="mr-2" />
                            Compartilhar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === "clube" && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark-900 mb-6">Sobre o Clube</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-dark-800 mb-4">{tournament.mainClub}</h4>
                      <p className="text-dark-600 mb-4">
                        Clube especializado em torneios de padel com excelente estrutura e quadras de alta qualidade.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-dark-600">
                          <Phone size={16} className="mr-2" />
                          <span>(11) 9999-9999</span>
                        </div>
                        <div className="flex items-center text-dark-600">
                          <Mail size={16} className="mr-2" />
                          <span>contato@clube.com</span>
                        </div>
                        <div className="flex items-center text-dark-600">
                          <Globe size={16} className="mr-2" />
                          <span>www.clube.com</span>
                        </div>
                        <div className="flex items-center text-dark-600">
                          <Instagram size={16} className="mr-2" />
                          <span>@clube</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark-800 mb-4">Estrutura</h4>
                      <ul className="space-y-2 text-dark-600">
                        <li>• 8 quadras de padel</li>
                        <li>• Vestiários completos</li>
                        <li>• Estacionamento gratuito</li>
                        <li>• Bar e restaurante</li>
                        <li>• Loja de equipamentos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === "regulamento" && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark-900 mb-6">Regulamento</h3>
                  <div className="prose max-w-none text-dark-600">
                    <h4 className="font-semibold text-dark-800 mb-3">1. Inscrições</h4>
                    <p className="mb-4">
                      As inscrições devem ser feitas através da plataforma até a data limite estabelecida.
                      O pagamento da taxa de inscrição deve ser realizado no ato da inscrição.
                    </p>

                    <h4 className="font-semibold text-dark-800 mb-3">2. Formato da Competição</h4>
                    <p className="mb-4">
                      O torneio será disputado no formato de grupos seguido de fase eliminatória.
                      Todas as partidas serão disputadas em melhor de 3 sets.
                    </p>

                    <h4 className="font-semibold text-dark-800 mb-3">3. Equipamentos</h4>
                    <p className="mb-4">
                      Os participantes devem trazer seus próprios equipamentos (raquetes, bolas serão fornecidas).
                      O uso de equipamentos de proteção é recomendado.
                    </p>

                    <h4 className="font-semibold text-dark-800 mb-3">4. Premiação</h4>
                    <p>
                      Serão premiados os 1º, 2º e 3º colocados de cada categoria com troféus e prêmios em dinheiro.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "chaveamento" && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
              <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Chaveamento em Desenvolvimento</h3>
              <p className="text-dark-500">
                O chaveamento será disponibilizado quando as inscrições forem encerradas.
              </p>
            </div>
          )}

          {activeTab === "resultados" && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
              <Trophy size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-dark-900 mb-2">Resultados Não Disponíveis</h3>
              <p className="text-dark-500">
                Os resultados serão exibidos conforme as partidas forem sendo disputadas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Adicionar Dupla */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Adicionar Nova Dupla</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jogador 1
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nome do primeiro jogador"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jogador 2
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nome do segundo jogador"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Selecione uma categoria</option>
                  {tournament.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddParticipantModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TournamentDetail;