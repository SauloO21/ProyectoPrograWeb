import type{ Gender, ActivityLevel } from '../types/user';
import { ACTIVITY_FACTORS } from '../types/user';

interface TmbData {
    weight: number; // kg
    height: number; // cm
    age: number;    // years
    gender: Gender;
    activityLevel: ActivityLevel;
}

export const calculateTMB = (data: TmbData): number => {
    const { weight, height, age, gender } = data;
    let tmb = 0;

    // Fórmula de Mifflin-St Jeor:
    if (gender === 'Male') {
        tmb = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else { // Female
        tmb = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Redondeo para mayor claridad en el UI
    return Math.round(tmb);
};

export const calculateDailyGoal = (tmb: number, activityLevel: ActivityLevel): number => {
    const factor = ACTIVITY_FACTORS[activityLevel];
    // GET = TMB * Factor de Actividad
    return Math.round(tmb * factor);
};