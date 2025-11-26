
import React from 'react';
import { formatDateKey } from '../utils/dateUtils';
import { getCalorieStatus } from '../utils/caloricLogic';
import type { UserHistory } from '../types/log';
import { useNavigate } from 'react-router-dom';

// Definición de la interfaz de props del componente
interface WeeklyAdherenceTrackerProps {
    weekRange: Date[];
    dailyGoal: number;
    userHistory: UserHistory;
}

// Interfaz para el cálculo de un solo día (esta es la que se usa internamente)
interface DailyCalculationData {
    date: Date;
    dailyGoal: number;
    userHistory: UserHistory;
}


const getDailyMetrics = ({ date, dailyGoal, userHistory }: DailyCalculationData) => {
    const dateKey = formatDateKey(date);
    const entries = userHistory[dateKey] || [];
    const consumed = entries.reduce((sum, entry) => sum + entry.totalCalories, 0);
    
    // Si la fecha es futura, el progreso es 0.
    const isFuture = date.getTime() > new Date().getTime();
    
    let percentage = 0;
    let status = 'loading'; // Usaremos 'loading' o 'empty' para días no registrados

    if (!isFuture) {
        if (dailyGoal > 0) {
            percentage = Math.round((consumed / dailyGoal) * 100);
        }
        status = getCalorieStatus(dailyGoal, consumed).status;
    }

    const isToday = dateKey === formatDateKey(new Date());

    return {
        dateKey,
        consumed,
        percentage: Math.min(percentage, 120), // Máximo 120% visual
        status,
        isFuture,
        isToday,
    };
};

const getBarColor = (status: string, percentage: number) => {
    if (status === 'onTrack') return 'bg-green-500';
    if (status === 'high') return 'bg-red-500';
    if (status === 'low' && percentage > 70) return 'bg-yellow-500';
    return 'bg-gray-400 dark:bg-gray-600';
};


export const WeeklyAdherenceTracker: React.FC<WeeklyAdherenceTrackerProps> = ({ weekRange, dailyGoal, userHistory }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-7 gap-4 text-center mt-6">
            {weekRange.map((date, index) => {
                const { dateKey, consumed, percentage, status, isFuture, isToday } = getDailyMetrics({ date, dailyGoal, userHistory });
                const barColor = getBarColor(status, percentage);
                
                return (
                    <div 
                        key={index} 
                        className={`p-2 rounded-lg cursor-pointer transition hover:shadow-lg ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-500' : 'bg-white dark:bg-gray-800'}`}
                        // Opcional: Navegar al Dashboard al hacer clic en un día pasado
                        onClick={() => !isFuture && navigate(`/dashboard?date=${dateKey}`)} 
                        title={isFuture ? 'Día Futuro' : `Consumido: ${consumed} kcal`}
                    >
                        
                        {/* Día de la Semana y Fecha */}
                        <p className={`text-xs font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-700 dark:text-white'}`}>
                            {isToday ? 'HOY' : date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                             {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}
                        </p>

                        {/* Barra de Progreso (Visual) */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`${isFuture ? 'bg-transparent' : barColor} h-2 rounded-full`}
                                style={{ width: `${Math.min(percentage, 100)}%` }} // Visualmente, nunca más del 100%
                            ></div>
                        </div>

                        {/* Porcentaje */}
                        <p className={`text-xs mt-1 ${isFuture ? 'text-gray-400' : 'font-medium text-gray-700 dark:text-white'}`}>
                            {isFuture ? '—' : `${percentage}%`}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};