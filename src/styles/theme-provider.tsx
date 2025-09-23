import React, { createContext, useContext, ReactNode } from "react";
import { ThemeConfig, Theme, themes } from "./theme";

interface ThemeContextType {
  theme: ThemeConfig;
  themeName: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = "default",
}) => {
  const themeConfig = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme: themeConfig, themeName: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
