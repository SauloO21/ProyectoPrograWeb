

/**
 * Formatea un objeto Date a la clave 'YYYY-MM-DD' usada en userHistory.
 */
export const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Genera un array de objetos Date para el rango de 7 días 
 */
export const getWeekRange = (currentDate: Date = new Date()): Date[] => {
    const dates: Date[] = [];
    const today = new Date(currentDate);

    // Aseguramos que la hora esté en 00:00:00 
    today.setHours(0, 0, 0, 0);

    // 3 días antes de hoy
    for (let i = 3; i >= 1; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d);
    }

    // Hoy
    dates.push(today);

    // 3 días después de hoy
    for (let i = 1; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }
    return dates;
};