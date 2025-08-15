import React from "react";
import { TournamentStatus } from "../types";

interface StatusBadgeProps {
  status: TournamentStatus;
}

/**
 * Badge de STATUS em texto simples (sem fundo), com cores:
 * - open         → verde
 * - closed       → amarelo (bom contraste no branco)
 * - in-progress  → azul
 * - completed    → cinza (Encerrado)
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getConfig = (s: TournamentStatus) => {
    switch (s) {
      case "open":
        return { text: "Inscrições Abertas", cls: "text-green-600" };
      case "closed":
        return { text: "Inscrições Encerradas", cls: "text-amber-600" };
      case "in-progress":
        return { text: "Em Andamento", cls: "text-blue-600" };
      case "completed":
        return { text: "Encerrado", cls: "text-gray-600" };
      default:
        return { text: "Status Desconhecido", cls: "text-gray-600" };
    }
  };

  const { text, cls } = getConfig(status);

  return <span className={`text-xs font-semibold ${cls}`}>{text}</span>;
};

export default StatusBadge;
