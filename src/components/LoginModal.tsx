import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";
import { signIn, signUp } from "../lib/auth";
import { useAuth } from "../contexts/AuthContext";
import { BubbleLogo } from "./Hero";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultMode = "login",
}) => {
  const [isLogin, setIsLogin] = useState(defaultMode !== "signup");
  const [userType, setUserType] = useState<"athlete" | "club" | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Campos do Clube
  const [clubData, setClubData] = useState({
    clubName: "",
    cnpj: "",
    phone: "",
  });
  // Campos do Atleta
  const [athleteData, setAthleteData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const { refreshProfile } = useAuth();

  // Sincroniza modo inicial e fecha ao clicar fora
  useEffect(() => {
    if (!isOpen) return;
    setIsLogin(defaultMode !== "signup");
    resetForm(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // trava o scroll do body enquanto o modal estiver aberto
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, defaultMode, onClose]);

  if (!isOpen) return null;

  const formatCNPJ = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);

  const formatPhone = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d)(\d{4})/, "$1 $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 17);

  const handleClubDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClubData((p) => ({
      ...p,
      [name]:
        name === "cnpj"
          ? formatCNPJ(value)
          : name === "phone"
          ? formatPhone(value)
          : value,
    }));
  };
  const handleAthleteDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAthleteData((p) => ({
      ...p,
      [name]: name === "phone" ? formatPhone(value) : value,
    }));
  };

  const handleUserTypeSelect = (type: "athlete" | "club") => {
    setUserType(type);
    setShowForm(true);
  };

  const forceRoleFromEmail = (emailRaw: string): "athlete" | "club" | null => {
    const e = emailRaw.toLowerCase().trim();
    if (e === "atleta@teste.com") return "athlete";
    if (e === "clube@teste.com") return "club";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { user, profile } = await signIn(email, password);
        const forced = forceRoleFromEmail(email);
        const nextType = forced ?? profile?.user_type;

        await refreshProfile();
        onClose();

        if (nextType === "club") window.location.href = "/club-dashboard";
        else window.location.href = "/dashboard";
      } else {
        if (!userType) throw new Error("Por favor, selecione o tipo de conta.");
        if (password !== confirmPassword)
          throw new Error("As senhas não coincidem");

        if (userType === "club") {
          if (!clubData.clubName.trim())
            throw new Error("Nome do clube é obrigatório.");
          if (!clubData.cnpj.replace(/\D/g, ""))
            throw new Error("CNPJ é obrigatório.");
          if (!clubData.phone.replace(/\D/g, ""))
            throw new Error("Telefone é obrigatório.");
        } else {
          if (!athleteData.firstName.trim())
            throw new Error("Nome é obrigatório.");
          if (!athleteData.lastName.trim())
            throw new Error("Sobrenome é obrigatório.");
          if (!athleteData.phone.replace(/\D/g, ""))
            throw new Error("Telefone é obrigatório.");
        }

        const userData =
          userType === "club"
            ? {
                user_type: "club",
                email: email.toLowerCase(),
                club_name: clubData.clubName.trim(),
                cnpj: clubData.cnpj.replace(/\D/g, ""),
                phone: clubData.phone.replace(/\D/g, ""),
              }
            : {
                user_type: "athlete",
                email: email.toLowerCase(),
                first_name: athleteData.firstName.trim(),
                last_name: athleteData.lastName.trim(),
                phone: athleteData.phone.replace(/\D/g, ""),
              };

        await signUp(email, password, userData);

        await refreshProfile();
        onClose();

        if (userType === "club") window.location.href = "/club-dashboard";
        else window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err?.message ?? "Falha ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (keepMode = false) => {
    if (!keepMode) setIsLogin(true);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setClubData({ clubName: "", cnpj: "", phone: "" });
    setAthleteData({ firstName: "", lastName: "", phone: "" });
    setUserType(null);
    setShowForm(false);
    setError("");
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetForm(true);
  };
  const handleBackToUserType = () => {
    setShowForm(false);
    setUserType(null);
    setError("");
  };

  return (
    <>
      {/* OVERLAY – acima do header/drawer */}
      <div
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* WRAPPER do modal */}
      <div
        className="fixed inset-0 z-[310] flex items-center justify-center p-4 md:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 px-5 md:px-6 py-6 md:py-7 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão fechar com área maior */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>

          {/* LOGO: oculta no mobile para não competir com o header, mostra no >=sm */}
          <div className="hidden sm:flex items-center justify-center mb-4">
            <BubbleLogo size={32} className="text-accent-500 mr-2" />
            <span className="text-2xl font-black bg-gradient-to-r from-primary-900 to-accent-500 bg-clip-text text-transparent">
              Bubble
            </span>
          </div>

          {/* Título */}
          <h2 className="text-center text-xl md:text-2xl font-bold text-dark-800 mb-4 md:mb-6">
            {isLogin ? "Entrar na plataforma" : "Criar sua conta"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Passo 1 do cadastro: escolher tipo (mobile-friendly) */}
          {!isLogin && !showForm && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark-700 mb-3 text-center">
                Escolha o tipo de conta
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect("athlete")}
                  className="w-full flex items-center justify-center p-5 border-2 border-gray-200 rounded-xl transition-all hover:border-primary-300 hover:bg-primary-50 group"
                >
                  <User
                    size={44}
                    className="mr-4 text-primary-600 group-hover:text-primary-700"
                  />
                  <div className="text-left">
                    <span className="block text-lg font-bold text-dark-800 group-hover:text-primary-900">
                      Atleta
                    </span>
                    <span className="block text-sm text-dark-500">
                      Para jogadores individuais
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect("club")}
                  className="w-full flex items-center justify-center p-5 border-2 border-gray-200 rounded-xl transition-all hover:border-primary-300 hover:bg-primary-50 group"
                >
                  <Building2
                    size={44}
                    className="mr-4 text-primary-600 group-hover:text-primary-700"
                  />
                  <div className="text-left">
                    <span className="block text-lg font-bold text-dark-800 group-hover:text-primary-900">
                      Clube
                    </span>
                    <span className="block text-sm text-dark-500">
                      Para clubes organizadores
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {(isLogin || showForm) && (
            <>
              {!isLogin && showForm && (
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleBackToUserType}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      ← Voltar
                    </button>
                    <div className="flex items-center">
                      {userType === "athlete" ? (
                        <>
                          <User size={18} className="text-primary-600 mr-2" />
                          <span className="text-sm font-semibold text-primary-700">
                            Conta de Atleta
                          </span>
                        </>
                      ) : (
                        <>
                          <Building2
                            size={18}
                            className="text-primary-600 mr-2"
                          />
                          <span className="text-sm font-semibold text-primary-700">
                            Conta de Clube
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && showForm && userType === "club" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-dark-700 mb-1">
                        Nome do Clube
                      </label>
                      <input
                        type="text"
                        name="clubName"
                        value={clubData.clubName}
                        onChange={handleClubDataChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nome do seu clube"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark-700 mb-1">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        value={clubData.cnpj}
                        onChange={handleClubDataChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="00.000.000/0000-00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={clubData.phone}
                        onChange={handleClubDataChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="(00) 0 0000-0000"
                        required
                      />
                    </div>
                  </>
                )}

                {!isLogin && showForm && userType === "athlete" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-dark-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={athleteData.firstName}
                        onChange={handleAthleteDataChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark-700 mb-1">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={athleteData.lastName}
                        onChange={handleAthleteDataChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Seu sobrenome"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={athleteData.phone}
                        onChange={handleAthleteDataChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="(00) 0 0000-0000"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-1">
                    {!isLogin && showForm && userType === "club"
                      ? "E-mail do Clube"
                      : "Email"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-dark-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={
                        !isLogin && showForm && userType === "club"
                          ? "contato@clube.com"
                          : "seu@email.com"
                      }
                      required
                      autoComplete="email"
                      spellCheck="false"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-dark-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="••••••••"
                      required
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLogin && showForm && (
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-dark-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-dark-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-900 to-primary-700 text-white py-3 px-4 rounded-lg hover:from-primary-800 hover:to-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading
                    ? "Carregando..."
                    : isLogin
                    ? "Entrar"
                    : `Criar Conta ${
                        userType === "club" ? "do Clube" : "de Atleta"
                      }`}
                </button>
              </form>
            </>
          )}

          {(isLogin || (!isLogin && !showForm)) && (
            <div className="mt-5 md:mt-6 text-center">
              <button
                onClick={handleToggleMode}
                className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
              >
                {isLogin
                  ? "Não tem uma conta? Cadastre-se"
                  : "Já tem uma conta? Entre"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;
