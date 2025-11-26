import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LogEntry } from '../types/log';
import type { UserProfile } from '../types/user';
import type { FoodItem } from '../types/food';
import { ThemeToggle } from '../components/ThemeToggle'; 
import foodData from '../data/foodData.json'; 

// --- Constantes para la visualización del Macro Split ---
const IDEAL_MACROS = {
    protein: 35, // 35% del total de calorías
    carbs: 40,   // 40% del total de calorías
    fat: 25,     // 25% del total de calorías
};
const MACRO_COLORS = {
    protein: 'bg-green-500',
    carbs: 'bg-yellow-500',
    fat: 'bg-blue-500',
};

// Componente Card para la estructura visual
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-colors">
        {children}
    </div>
);

// Componente NavBar para la página de Historial
const HistoryNavBar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <nav className="bg-white dark:bg-gray-800 shadow p-4 fixed w-full top-0 z-10 flex justify-between items-center">
            <h1 
                className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                onClick={() => navigate('/dashboard')}
            >
                ← Dashboard
            </h1>
            <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mr-4">Centro Nutricional</h2>
                <ThemeToggle />
            </div>
        </nav>
    );
};


// --- COMPONENTE PRINCIPAL HISTORYPAGE ---
export const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [dailyLog, setDailyLog] = useState<LogEntry[]>([]);
    
    const foodList = foodData as FoodItem[];
    const todayKey = new Date().toISOString().split('T')[0];

    //  Lógica de Carga de Datos del Día Actual 
    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        if (!storedProfile) {
            navigate('/registro');
            return;
        }

        const currentProfile: UserProfile = JSON.parse(storedProfile);
        setProfile(currentProfile);

        // CLAVE AISLADA: Leer el log diario que el Dashboard actualiza
        const logKey = `dailyLog_${currentProfile.id}`; 
        const storedLog = localStorage.getItem(logKey);

        if (storedLog) {
            setDailyLog(JSON.parse(storedLog));
        } else {
            setDailyLog([]);
        }
        
    }, [navigate]);

    //  Cálculo de Macros y Porcentajes
    const macroAnalysis = useMemo(() => {
        let totalProteinG = 0;
        let totalCarbsG = 0;
        let totalFatG = 0;
        const totalCalories = dailyLog.reduce((sum, entry) => sum + entry.totalCalories, 0);

        // Sumar los gramos
        dailyLog.forEach(entry => {
            const food = foodList.find(f => f.id === entry.foodId);
            if (food) {
                const ratio = entry.quantity / 100;
                totalProteinG += food.protein * ratio;
                totalCarbsG += food.carbs * ratio;
                totalFatG += food.fat * ratio;
            }
        });

        // Convertir gramos a calorías 
        const totalProteinCal = totalProteinG * 4;
        const totalCarbsCal = totalCarbsG * 4;
        const totalFatCal = totalFatG * 9;
        const grandTotalCal = totalProteinCal + totalCarbsCal + totalFatCal; 

        // Calcular Porcentajes
        const p_perc = grandTotalCal > 0 ? Math.round((totalProteinCal / grandTotalCal) * 100) : 0;
        const c_perc = grandTotalCal > 0 ? Math.round((totalCarbsCal / grandTotalCal) * 100) : 0;
        // La grasa se calcula por diferencia para asegurar que la suma sea 100 
        const f_perc = 100 - p_perc - c_perc; 
        
        return { 
            p_perc, 
            c_perc, 
            f_perc, 
            totalCalories, 
            grandTotalCal,
            totalProteinG: Math.round(totalProteinG),
            totalCarbsG: Math.round(totalCarbsG),
            totalFatG: Math.round(totalFatG),
        };
        
    }, [dailyLog, foodList]);


    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-white">Cargando perfil...</div>;
    }
    
    const { p_perc, c_perc, f_perc, totalCalories, totalProteinG, totalCarbsG, totalFatG, grandTotalCal } = macroAnalysis;
    
    // Lista de macros para renderizado
    const macroList = [
        { name: 'Proteínas', percentage: p_perc, ideal: IDEAL_MACROS.protein, color: MACRO_COLORS.protein, grams: totalProteinG },
        { name: 'Carbohidratos', percentage: c_perc, ideal: IDEAL_MACROS.carbs, color: MACRO_COLORS.carbs, grams: totalCarbsG },
        { name: 'Grasas', percentage: f_perc, ideal: IDEAL_MACROS.fat, color: MACRO_COLORS.fat, grams: totalFatG },
    ];


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
            <HistoryNavBar />
            
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* TÍTULO Y FECHA */}
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    Análisis Nutricional del Día
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    **Fecha:** {todayKey} | **Consumo Total:** {totalCalories} kcal
                </p>
                
                {/* --- ANALIZADOR PRINCIPAL --- */}
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                        Distribución de Macronutrientes (vs. Meta Ideal)
                    </h3>
                    
                    {grandTotalCal === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 p-8">
                            ¡Registra alimentos en el Dashboard para ver el análisis!
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {macroList.map((macro, index) => (
                                <div key={index}>
                                    {/* Métrica: Porcentaje Consumido vs Gramos Totales */}
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-medium text-gray-800 dark:text-white">
                                            **{macro.name}:** {macro.percentage}% ({macro.grams}g)
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Meta Ideal: {macro.ideal}%
                                        </p>
                                    </div>
                                    
                                    {/* Barra de Progreso */}
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                                        {/* Barra de Consumo */}
                                        <div 
                                            className={`${macro.color} h-4 rounded-full transition-all duration-500`}
                                            style={{ width: `${macro.percentage}%` }}
                                        ></div>
                                        
                                        {/* Línea de Meta Ideal */}
                                        <div 
                                            className="absolute top-0 h-full border-l-2 border-dashed border-gray-900 dark:border-white"
                                            style={{ left: `${macro.ideal}%` }}
                                        ></div>
                                    </div>
                                    
                                    {/* Indicador de Desviación */}
                                    {Math.abs(macro.percentage - macro.ideal) > 5 && (
                                        <p className={`text-xs mt-1 ${macro.percentage > macro.ideal ? 'text-red-500' : 'text-orange-500'}`}>
                                            {macro.percentage > macro.ideal ? '↑ Exceso sobre Ideal' : '↓ Déficit respecto a Ideal'}
                                        </p>
                                    )}
                                </div>
                            ))}
                            <p className="pt-4 text-sm text-gray-600 dark:text-gray-400">
                                **Nota:** La distribución ideal utilizada para este análisis es 40% Carbos, 35% Proteínas, 25% Grasas (Regla 4-4-9).
                            </p>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
};