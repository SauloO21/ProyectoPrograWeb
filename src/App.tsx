import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { ThemeProvider } from './contexts/ThemeContext'; 

// --- Componente de Simulación de Autenticación SIMPLE ---
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    // Si no hay perfil, se redirige al registro
    const isAuthenticated = localStorage.getItem('userProfile') !== null;
    
    if (!isAuthenticated) {
        return <Navigate to="/registro" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <ThemeProvider> 
            <BrowserRouter>
                <Routes>
                    {/* RUTAS PÚBLICAS */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/registro" element={<RegisterPage />} />
                    
                    {/* RUTAS PRINCIPALES (Protegidas) */}
                    <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                    <Route path="/historial" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
                    
                    {/* RUTA CATCH-ALL */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;