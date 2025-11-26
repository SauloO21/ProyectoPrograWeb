

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile} from '../types/user';
import { ACTIVITY_FACTORS } from '../types/user';
import { calculateTMB, calculateDailyGoal } from '../hooks/useTmbCalculator';

// Valores iniciales para el formulario
const initialUserState: Omit<UserProfile, 'id' | 'tmb' | 'dailyGoal'> = {
    name: '',
    age: 25,
    weight: 70, // kg
    height: 175, // cm
    gender: 'Male',
    activityLevel: 'Moderate',
    selectedHabitIds: [],
};

export const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState(initialUserState);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Manejador genérico de cambios en el formulario
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Convertir a número si es necesario
            [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value,
        }));
        setError('');
    }, []);

    // Manejador del envío del formulario
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        // 1. **Validación Básica**
        if (formData.age <= 0 || formData.weight <= 0 || formData.height <= 0 || !formData.name) {
            setError('Por favor, completa todos los campos con valores válidos.');
            return;
        }

        // **Cálculo de TMB y Meta Diaria**
        const tmb = calculateTMB({
            weight: formData.weight,
            height: formData.height,
            age: formData.age,
            gender: formData.gender,
            activityLevel: formData.activityLevel,
        });

        const dailyGoal = calculateDailyGoal(tmb, formData.activityLevel);

        //  **Creación del Perfil Final**
        const newUserProfile: UserProfile = {
            ...formData,
            id: `user-${Date.now()}`, // ID simple por ahora (simulando base de datos)
            tmb,
            dailyGoal,
        };

        
        localStorage.setItem('userProfile', JSON.stringify(newUserProfile));

        alert(`Perfil creado! Meta calórica diaria: ${newUserProfile.dailyGoal} kcal.`);
        
        // Redirigir al Dashboard
        navigate('/dashboard');

    }, [formData, navigate]);

    // Opciones de Nivel de Actividad para el Select
    const activityOptions = Object.keys(ACTIVITY_FACTORS);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                    ¡Crea tu Perfil Calórico!
                </h1>

                {error && (
                    <p className="p-3 text-sm font-medium text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-md">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Edad y Peso (Mismos estilos para un diseño limpio) */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Edad (años)
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                min="18"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                                step="0.1"
                                min="30"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                    
                    {/* Altura y Género */}
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Altura (cm)
                            </label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                required
                                min="100"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Género
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white dark:bg-gray-700 dark:text-white"
                            >
                                <option value="Male">Hombre</option>
                                <option value="Female">Mujer</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Nivel de Actividad */}
                    <div>
                        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nivel de Actividad
                        </label>
                        <select
                            id="activityLevel"
                            name="activityLevel"
                            value={formData.activityLevel}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-white dark:bg-gray-700 dark:text-white"
                        >
                            {activityOptions.map(level => (
                                <option key={level} value={level}>
                                    {/* Muestra un texto más descriptivo para el usuario */}
                                    {level === 'Sedentary' && 'Sedentario (poco o ningún ejercicio)'}
                                    {level === 'Light' && 'Ligero (ejercicio 1-3 días/semana)'}
                                    {level === 'Moderate' && 'Moderado (ejercicio 3-5 días/semana)'}
                                    {level === 'High' && 'Alto (ejercicio 6-7 días/semana)'}
                                    {level === 'VeryHigh' && 'Muy Alto (ejercicio intenso 2 veces/día)'}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Este factor ajusta tu Gasto Energético Total.
                        </p>
                    </div>

                    {/* Botón de Registro */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Calcular Meta y Continuar
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿Ya tienes una cuenta? <span onClick={() => navigate('/login')} className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Inicia sesión aquí</span>
                </p>
            </div>
        </div>
    );
};