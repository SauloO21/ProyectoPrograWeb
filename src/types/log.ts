

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

/**
 * Representa una entrada de alimento registrada por el usuario.
 */
export interface LogEntry {
    foodId: string;
    foodName: string;
    quantity: number; // Cantidad consumida (g o ml)
    mealType: MealType; // Tipo de comida (Desayuno, Comida, Cena, Snack)
    totalCalories: number; // Calorías totales calculadas
    
}

export interface UserHistory {
    [date: string]: LogEntry[]; // Mapea fechas a listas de entradas de log
}