import React from "react";
import { FiExternalLink } from "react-icons/fi";

interface NavigableCellProps {
  value: unknown;
  displayText: string;
  onNavigate: () => void;
  type: "array" | "object";
}

export const NavigableCell: React.FC<NavigableCellProps> = ({
  value,
  displayText,
  onNavigate,
  type,
}) => {
  return (
    <button
      onClick={onNavigate}
      className="flex items-center text-obsidian hover:text-charcoal hover:bg-lace-cap px-3 py-1 rounded-lg border border-cumberland-fog focus:outline-none focus:ring-2 focus:ring-obsidian/20 focus:ring-offset-1 transition-all duration-150 ease-out font-medium"
      title={`Click to view ${type} in sub-table`}
    >
      <span className="mr-2 text-body-sm">{displayText}</span>
      <FiExternalLink className="w-3 h-3" />
    </button>
  );
};
