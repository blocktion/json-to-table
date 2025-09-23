export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    interactive: {
      hover: string;
      active: string;
      disabled: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "#1a1a1a", // obsidian
    secondary: "#4a4a4a", // charcoal
    background: "#ffffff", // white-heaven
    surface: "#f8f9fa", // lace-cap
    border: "#e5e7eb", // cumberland-fog
    text: {
      primary: "#1a1a1a", // obsidian
      secondary: "#4a4a4a", // charcoal
      muted: "#6b7280", // jet-grey
    },
    interactive: {
      hover: "#f3f4f6", // lace-cap
      active: "#e5e7eb", // cumberland-fog
      disabled: "#9ca3af",
    },
    status: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },
  spacing: {
    xs: "0.25rem", // 1
    sm: "0.5rem", // 2
    md: "1rem", // 4
    lg: "1.5rem", // 6
    xl: "2rem", // 8
  },
  typography: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  borderRadius: {
    sm: "0.25rem", // 1
    md: "0.375rem", // 1.5
    lg: "0.5rem", // 2
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
};

export const darkTheme: ThemeConfig = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#ffffff",
    secondary: "#d1d5db",
    background: "#111827",
    surface: "#1f2937",
    border: "#374151",
    text: {
      primary: "#ffffff",
      secondary: "#d1d5db",
      muted: "#9ca3af",
    },
    interactive: {
      hover: "#374151",
      active: "#4b5563",
      disabled: "#6b7280",
    },
  },
};

export const minimalTheme: ThemeConfig = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    border: "#e5e7eb",
    surface: "#ffffff",
    interactive: {
      hover: "#f9fafb",
      active: "#f3f4f6",
      disabled: "#d1d5db",
    },
  },
  shadows: {
    sm: "none",
    md: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    lg: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
};

export type Theme = "default" | "dark" | "minimal";

export const themes: Record<Theme, ThemeConfig> = {
  default: defaultTheme,
  dark: darkTheme,
  minimal: minimalTheme,
};
