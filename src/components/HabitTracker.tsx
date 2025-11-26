import React, { useMemo } from 'react';
import { PRESET_HABITS } from '../types/habit'; 
import type { UserProfile } from '../types/user'; 
import type { DailyHabitLog } from '../types/habit';// 

interface HabitTrackerProps {
    userProfile: UserProfile; 
    dailyHabitsLog: DailyHabitLog[]; 
    toggleHabit: (habitId: string) => void; 
    openSetupModal: () => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ 
    userProfile, 
    dailyHabitsLog, 
    toggleHabit, 
    openSetupModal 
}) => {
    
    // Obtener solo los hábitos seleccionados con su estado de finalización
    const trackedHabits = useMemo(() => {
        // IDs que el usuario seleccionó en la configuración del perfil
        const selectedIds = userProfile.selectedHabitIds || []; 
        
        // Combinar la definición del hábito (nombre, target) con el estado de log de hoy
        return PRESET_HABITS
            .filter(def => selectedIds.includes(def.id)) // Filtramos por selección del usuario
            .map(def => {
                // Buscamos si existe una entrada para este hábito en el log de hoy
                const logEntry = dailyHabitsLog.find(log => log.habitId === def.id);
                
                return {
                    habitId: def.id,
                    name: def.name,
                    target: def.target,
                    // Si el log existe y está completado, marcamos como true
                    isCompleted: logEntry?.isCompleted || false, 
                };
            });
    }, [userProfile.selectedHabitIds, dailyHabitsLog]); 

    // 2. Manejador de Toggle
    const handleToggle = (id: string) => {
        toggleHabit(id);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Mis Hábitos Diarios</h4>
                
                {/* Botón para abrir la configuración */}
                <button
                    onClick={openSetupModal} 
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition"
                >
                    ⚙️ Gestionar
                </button>
            </div>
            
            {trackedHabits.length === 0 ? (
                // Mensaje si no hay hábitos seleccionados
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Aún no has seleccionado hábitos. Haz clic en "Gestionar" para empezar.
                    </p>
                </div>
            ) : (
                // Lista de hábitos seleccionados
                trackedHabits.map(habit => (
                    <div 
                        key={habit.habitId}
                        className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition ${
                            habit.isCompleted 
                                ? 'bg-green-100 dark:bg-green-800/50 border-l-4 border-green-600'
                                : 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-600'
                        }`}
                        onClick={() => handleToggle(habit.habitId)} 
                    >
                        <div>
                            <p className={`font-medium ${habit.isCompleted ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-white'}`}>
                                {habit.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{habit.target}</p>
                        </div>
                        {habit.isCompleted ? (
                            <span className="text-green-600 dark:text-green-400 font-bold">✔️</span>
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500">◻️</span>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};