import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    

    // Local Storage Stuffs
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return (savedTheme as Theme) || 'dark'; 
    });
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);





    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
        </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}