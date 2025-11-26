
import { useMemo } from 'react';
import type { FoodItem, FoodCategory } from '../types/food'; 


export const useFoodSearch = (
    query: string,
    selectedCategory: FoodCategory | '',
    foodList: FoodItem[] // Recibe la lista completa como argumento
): FoodItem[] => {
    
    // Función central para filtrar y buscar
    const filteredFoods = useMemo(() => {
        let results = foodList;
        
        // 1. Filtrar por Categoría
        if (selectedCategory) {
            results = results.filter(food => food.category === selectedCategory);
        }

        //  Filtrar por Búsqueda (Autocompletado)
        if (query.trim()) {
            const lowerCaseQuery = query.trim().toLowerCase();
            results = results.filter(food => 
                // Busca si el nombre incluye la consulta
                food.name.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Limita los resultados a un máximo para el autocompletado
        return results.slice(0, 10); 
    }, [query, selectedCategory, foodList]); // Dependencias del useMemo

    return filteredFoods;
};

