
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const hasProfile = localStorage.getItem('userProfile');

        if (hasProfile) {
            // Si el perfil existe, simula el inicio de sesión y ve al Dashboard
            navigate('/dashboard', { replace: true });
        }
        // Si no hay perfil, el usuario debe registrarse
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="p-8 w-full max-w-md text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Bienvenido
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Por favor, inicia sesión o regístrate para continuar.
                </p>
                
                {/* Botón de acceso directo si el useEffect aún no ha redirigido */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
                >
                    Acceder a Dashboard
                </button>
                
                <p className="text-gray-600 dark:text-gray-400 mt-4">
                    ¿No tienes perfil? 
                    <span 
                        onClick={() => navigate('/registro')} 
                        className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer ml-1"
                    >
                        Regístrate
                    </span>
                </p>
            </div>
        </div>
    );
};