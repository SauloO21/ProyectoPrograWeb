

import React, { useState } from 'react';
import type { UserProfile } from '../types/user';
import { PRESET_HABITS } from '../types/habit';

interface HabitSetupModalProps {
    profile: UserProfile; // Perfil actual
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProfile: UserProfile) => void;
}

export const HabitSetupModal: React.FC<HabitSetupModalProps> = ({ profile, isOpen, onClose, onSave }) => {
    // Estado local para manejar la selección mientras la modal está abierta
    const [selectedIds, setSelectedIds] = useState<string[]>(profile.selectedHabitIds || []);

    if (!isOpen) return null;

    const handleToggleHabit = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(habitId => habitId !== id) // Deseleccionar
                : [...prev, id] // Seleccionar
        );
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedProfile: UserProfile = {
            ...profile,
            selectedHabitIds: selectedIds, // Guardar la nueva selección
        };
        
        onSave(updatedProfile); // Llamar a la función del Dashboard para guardar
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    Elige tus Hábitos ({selectedIds.length} seleccionados)
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Selecciona los objetivos que deseas monitorear en tu Dashboard.
                </p>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PRESET_HABITS.map(habit => {
                            const isSelected = selectedIds.includes(habit.id);
                            return (
                                <div 
                                    key={habit.id} 
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                                        isSelected 
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => handleToggleHabit(habit.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {habit.name}
                                        </p>
                                        <span className={`text-lg ml-4 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            {isSelected ? '✓' : '☐'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Meta: {habit.target}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="pt-4 flex justify-end space-x-3 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={selectedIds.length === 0}
                            className={`py-2 px-4 rounded-md text-white font-bold transition ${
                                selectedIds.length === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            Guardar {selectedIds.length} Hábitos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};