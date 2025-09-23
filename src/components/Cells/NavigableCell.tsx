import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { useTheme } from "../../styles/theme-provider";

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
  const { theme } = useTheme();

  return (
    <button
      onClick={onNavigate}
      className="flex items-center font-medium transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1"
      style={{
        color: theme.colors.text.primary,
        backgroundColor: "transparent",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        fontSize: theme.typography.fontSize.sm,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = theme.colors.secondary;
        e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = theme.colors.text.primary;
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.colors.primary}20`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
      title={`Click to view ${type} in sub-table`}
    >
      <span style={{ marginRight: theme.spacing.sm }}>{displayText}</span>
      <FiExternalLink
        style={{
          width: "12px",
          height: "12px",
        }}
      />
    </button>
  );
};
