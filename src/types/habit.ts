
export interface HabitDefinition {
    id: string;
    name: string;
    target: string; 
    unit: 'checked' | 'quantity'; // Define si es binario (checked) o si se mide (quantity)
}

// Estado que se guarda para un día
export interface DailyHabitLog {
    habitId: string;
    isCompleted: boolean;
    currentValue?: number; 
}

// --- LISTA MAESTRA DE HÁBITOS SALUDABLES ---
export const PRESET_HABITS: HabitDefinition[] = [
   
    { id: 'h001', name: 'Beber Agua', target: '2 Litros', unit: 'checked' },
    { id: 'h002', name: 'Comer Frutas y Verduras', target: '5 porciones', unit: 'checked' },
    { id: 'h003', name: 'Desayuno Proteico', target: 'Completo', unit: 'checked' },
    { id: 'h004', name: 'Evitar Bebidas Azucaradas', target: 'Todo el día', unit: 'checked' },
    { id: 'h005', name: 'Comer Lento y Consciente', target: '20 minutos', unit: 'checked' },
    

    { id: 'h006', name: 'Caminar Diario', target: '30 minutos', unit: 'checked' },
    { id: 'h007', name: 'Ejercicio de Fuerza', target: 'Sesión', unit: 'checked' },
    { id: 'h008', name: 'Estiramiento o Movilidad', target: '10 minutos', unit: 'checked' },
    { id: 'h009', name: 'Tomar el Sol', target: '15 minutos', unit: 'checked' },
    
    
    { id: 'h010', name: 'Meditación/Mindfulness', target: '10 minutos', unit: 'checked' },
    { id: 'h011', name: 'Apagar Pantallas', target: '1h antes de dormir', unit: 'checked' },
    { id: 'h012', name: 'Lectura (No Trabajo)', target: '15 minutos', unit: 'checked' },
    { id: 'h013', name: 'Diario/Gratitud', target: 'Escribir', unit: 'checked' },
    { id: 'h014', name: 'Dormir Suficiente', target: '7-9 horas', unit: 'checked' },
    
   
    { id: 'h015', name: 'Planificar el Día', target: '5 minutos', unit: 'checked' },
    { id: 'h016', name: 'Limpieza de Escritorio', target: 'Rápida', unit: 'checked' },
    
    
];