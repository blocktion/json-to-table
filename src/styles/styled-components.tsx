import React from "react";
import { useTheme } from "./theme-provider";

interface StyledComponentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const TableContainer: React.FC<StyledComponentProps> = ({
  className = "",
  children,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full ${className}`}
      style={
        {
          "--table-bg": theme.colors.background,
          "--table-border": theme.colors.border,
          "--table-shadow": theme.shadows.sm,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export const TableWrapper: React.FC<StyledComponentProps> = ({
  className = "",
  children,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`overflow-auto border rounded-lg ${className}`}
      style={{
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        boxShadow: theme.shadows.sm,
        borderRadius: theme.borderRadius.lg,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Table: React.FC<StyledComponentProps> = ({
  className = "",
  children,
  style,
}) => {
  return (
    <table className={`w-full border-collapse ${className}`} style={style}>
      {children}
    </table>
  );
};

export const TableHeader: React.FC<StyledComponentProps> = ({
  className = "",
  children,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <thead
      className={className}
      style={{
        backgroundColor: theme.colors.surface,
        ...style,
      }}
    >
      {children}
    </thead>
  );
};

export const TableHeaderCell: React.FC<
  StyledComponentProps & {
    sortable?: boolean;
    onClick?: () => void;
    title?: string;
  }
> = ({ className = "", children, sortable = false, onClick, title, style }) => {
  const { theme } = useTheme();

  const baseStyles = {
    borderBottom: `1px solid ${theme.colors.border}`,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    textAlign: "left" as const,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  };

  const interactiveStyles = sortable
    ? {
        cursor: "pointer",
        transition: "background-color 0.15s ease",
      }
    : {};

  return (
    <th
      className={className}
      style={{
        ...baseStyles,
        ...interactiveStyles,
        ...style,
      }}
      onClick={onClick}
      title={title}
      onMouseEnter={(e) => {
        if (sortable) {
          e.currentTarget.style.backgroundColor =
            theme.colors.interactive.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (sortable) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {children}
    </th>
  );
};

export const TableBody: React.FC<StyledComponentProps> = ({
  className = "",
  children,
  style,
}) => {
  return (
    <tbody className={className} style={style}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<
  StyledComponentProps & {
    onClick?: () => void;
    hoverable?: boolean;
  }
> = ({ className = "", children, onClick, hoverable = false, style }) => {
  const { theme } = useTheme();

  const baseStyles = {
    transition: "background-color 0.15s ease",
  };

  const hoverableStyles = hoverable
    ? {
        cursor: "pointer",
      }
    : {};

  return (
    <tr
      className={className}
      style={{
        ...baseStyles,
        ...hoverableStyles,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable || onClick) {
          e.currentTarget.style.backgroundColor =
            theme.colors.interactive.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable || onClick) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {children}
    </tr>
  );
};

export const TableCell: React.FC<
  StyledComponentProps & {
    onClick?: () => void;
  }
> = ({ className = "", children, onClick, style }) => {
  const { theme } = useTheme();

  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm align-top ${className}`}
      style={{
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.sm,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </td>
  );
};

export const LoadingSpinner: React.FC<StyledComponentProps> = ({
  className = "",
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div className={`p-8 text-center ${className}`} style={style}>
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
        style={{
          borderBottomColor: theme.colors.primary,
        }}
      />
      <p
        className="mt-2"
        style={{
          color: theme.colors.text.muted,
        }}
      >
        Loading data...
      </p>
    </div>
  );
};

export const ErrorMessage: React.FC<
  StyledComponentProps & {
    title?: string;
    message?: string;
  }
> = ({ className = "", title = "Error Loading Data", message, style }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`p-8 text-center border rounded-lg ${className}`}
      style={{
        color: theme.colors.status.error,
        borderColor: theme.colors.status.error,
        backgroundColor: `${theme.colors.status.error}10`,
        borderRadius: theme.borderRadius.lg,
        ...style,
      }}
    >
      <p
        className="text-lg font-medium"
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.medium,
        }}
      >
        {title}
      </p>
      {message && (
        <p
          className="mt-2 text-sm"
          style={{
            fontSize: theme.typography.fontSize.sm,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export const EmptyState: React.FC<
  StyledComponentProps & {
    title?: string;
    message?: string;
  }
> = ({
  className = "",
  title = "No Data Available",
  message = "No data available",
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`p-8 text-center border rounded-lg ${className}`}
      style={{
        color: theme.colors.text.muted,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        ...style,
      }}
    >
      <p
        className="text-lg font-medium mb-2"
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text.primary,
        }}
      >
        {title}
      </p>
      <p
        className="text-sm"
        style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.muted,
        }}
      >
        {message}
      </p>
    </div>
  );
};
