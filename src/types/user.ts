

/**
 * Tipos de datos básicos para el cálculo de la TMB y el perfil.
 */
export type Gender = 'Male' | 'Female';
export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'High' | 'VeryHigh';


export interface UserProfile {
    id: string; // ID único para el aislamiento de datos 
    name: string;
    age: number;         // años
    weight: number;      // kg
    height: number;      // cm
    gender: Gender;
    activityLevel: ActivityLevel;

    // Campos calculados
    tmb: number;         // Tasa Metabólica Basal (Mifflin-St Jeor)
    dailyGoal: number;   // Gasto Energético Total (Objetivo Calórico)
    
    
    selectedHabitIds: string[]; // IDs de los hábitos que el usuario eligió rastrear
}


export interface ActivityFactor {
    [key: string]: number;
}

export const ACTIVITY_FACTORS: ActivityFactor = {
    Sedentary: 1.2,
    Light: 1.375,
    Moderate: 1.55,
    High: 1.725,
    VeryHigh: 1.9,
};