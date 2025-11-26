export type FoodCategory = 
    'Cereales' | 'Verduras' | 'Frutas' | 'Alimentos de Origen Animal' | 
    'Leches' | 'Leguminosas' | 'Grasas' | 'Azucares' | 'Alimentos libres de energía' | 'Bebidas';
    

export interface FoodItem {
    id: string;
    name: string;
    category: FoodCategory; 
    
    // Valores por 100g o por la porción base
    calories: number;       // kcal
    protein: number;        // gramos
    carbs: number;          // gramos
    fat: number;            // gramos
}