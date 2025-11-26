
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Inicialización: Prioridad: localStorage > Preferencia del Sistema > 'light'
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme') as Theme;
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            // Guardar inmediatamente en localStorage
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    }, []);

   // Manipulación del DOM
    useEffect(() => {
        const root = window.document.documentElement;
        
       
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light'); 
        } else {
            root.classList.remove('dark');
            root.classList.add('light'); 
        }
        
        // escrituras dobles.

    }, [theme]); 
    // FIN DEL EFECTO CRÍTICO

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};