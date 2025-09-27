import React from "react";
import { NavigationState } from "../../hooks/useNavigation";
import { useTheme } from "../../styles/theme-provider";

interface NavigationControlsProps {
  navigationState: NavigationState;
  onNavigateBack: (targetLevel: number) => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  navigationState,
  onNavigateBack,
}) => {
  const { theme } = useTheme();

  if (navigationState.stack.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      {/* Breadcrumb Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.sm,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.muted,
          marginBottom: theme.spacing.sm,
        }}
      >
        {navigationState.breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span style={{ color: theme.colors.text.muted }}>/</span>
            )}
            <button
              onClick={() => onNavigateBack(index)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: theme.colors.text.muted,
                cursor: "pointer",
                fontSize: theme.typography.fontSize.sm,
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.text.muted;
              }}
            >
              {item}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
