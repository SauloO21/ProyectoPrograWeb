
import React, { useState } from 'react';
import type { FoodItem } from '../types/food';
import type { LogEntry, MealType } from '../types/log';

interface FoodEntryModalProps {
    food: FoodItem;
    isOpen: boolean;
    onClose: () => void;
    onSave: (entry: LogEntry) => void;
}

export const FoodEntryModal: React.FC<FoodEntryModalProps> = ({ food, isOpen, onClose, onSave }) => {
    // Estado local para la cantidad y el tipo de comida
    const [quantity, setQuantity] = useState(100); 
    const [mealType, setMealType] = useState<MealType>('Lunch'); 

    if (!isOpen || !food) return null;

    // Cálculo dinámico de calorías y macros
    const ratio = quantity / 100;
    const totalCalories = Math.round(food.calories * ratio);
    const totalProtein = (food.protein * ratio).toFixed(1);
    const totalCarbs = (food.carbs * ratio).toFixed(1);
    const totalFat = (food.fat * ratio).toFixed(1);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Crear el objeto de registro de log
        const newEntry: LogEntry = {
            foodId: food.id,
            foodName: food.name,
            quantity: quantity,
            mealType: mealType,
            totalCalories: totalCalories,
        };
        
        onSave(newEntry); // Llama a la función de guardado
        onClose();       // Cierra la modal
        setQuantity(100); // Resetear cantidad
        setMealType('Lunch'); // Resetear tipo de comida
    };
    
    return (
        // Fondo semi-transparente para la Modal
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            
            {/* Contenedor Principal de la Moda*/}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6">
                
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Registrar: {food.name}
                </h2>
                
                <form onSubmit={handleSave} className="space-y-4">
                    
                    {/* Cantidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"> {/* Contraste de Etiqueta */}
                            Cantidad (g o ml)
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            required
                            min="1"
                            // Contraste de Input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    
                    {/* Tipo de Comida */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"> {/* Contraste de Etiqueta */}
                            Tiempo de Comida
                        </label>
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value as MealType)}
                            // Contraste de Select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="Breakfast">Desayuno</option>
                            <option value="Lunch">Comida</option>
                            <option value="Dinner">Cena</option>
                            <option value="Snack">Snack</option>
                        </select>
                    </div>

                    {/* Resumen Nutricional Calculado */}
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md text-sm">
                        <p className="font-semibold text-indigo-700 dark:text-indigo-300">
                            Total Calculado: {totalCalories} kcal
                        </p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                            P: {totalProtein}g | C: {totalCarbs}g | G: {totalFat}g
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => { onClose(); setQuantity(100); setMealType('Lunch'); }}
                            // Contraste de Botón Secundario
                            className="py-2 px-4 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            // Contraste de Botón Primario
                            className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
                        >
                            Guardar Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};