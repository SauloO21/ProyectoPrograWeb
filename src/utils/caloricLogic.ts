export interface CalorieState {
    status: 'onTrack' | 'low' | 'high' | "loading";
    message: string;
    percentage: number; 
}

const ON_TRACK_RANGE = 50; // Margen de error de +/- 50 kcal

const lowMessages = [
    "Aún tienes margen. Un pequeño snack nutritivo te ayudará a alcanzar tu meta. ¡Tú puedes!",
    "¡Sigue adelante! Te faltan pocas calorías para completar tu objetivo diario.",
    "El día aún no termina. Te mereces ese último aporte para terminar fuerte."
];

const highMessages = [
    "Ups, ¡no pasa nada! Lo importante es la constancia. Mañana volvemos al ruedo y lo harás mejor.",
    "Hoy fue un día alto, revisa tus porciones para mañana. ¡A seguir aprendiendo!",
    "Recuerda que la meta es el balance. ¡El progreso no es lineal!"
];

const onTrackMessages = [
    "¡Meta lograda! Estás haciendo un excelente trabajo con tu nutrición.",
    "Consistencia es la clave, ¡y tú la tienes! Mantén ese ritmo.",
    "Día perfecto. Tu cuerpo te lo agradecerá."
];

const getRandomMessage = (messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
};


export const getCalorieStatus = (goal: number, consumed: number): CalorieState => {
    const difference = goal - consumed;
    const percentage = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;
    
    let status: CalorieState['status'];
    let message: string; 

    if (difference <= ON_TRACK_RANGE && difference >= -ON_TRACK_RANGE) {
        status = 'onTrack';
       
        message = getRandomMessage(onTrackMessages); 
    } else if (difference > ON_TRACK_RANGE) {
        status = 'low';
        
        message = getRandomMessage(lowMessages);
    } else { // difference < -ON_TRACK_RANGE (High)
        status = 'high';
        
        message = getRandomMessage(highMessages); 
    }

    return {
        status,
        message,
        percentage
    };
};