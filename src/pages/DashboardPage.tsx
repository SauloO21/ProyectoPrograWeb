import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types/user';
import type { FoodItem, FoodCategory } from '../types/food';
import type { LogEntry } from '../types/log'; 
import type { DailyHabitLog } from '../types/habit'; 
import type { CalorieState } from '../utils/caloricLogic';
import { getCalorieStatus } from '../utils/caloricLogic';
import { useFoodSearch } from '../hooks/useFoodSearch'; 
import { useTheme } from '../contexts/ThemeContext'; 
import foodData from '../data/foodData.json';

// Importaciones de Componentes
import { FoodEntryModal } from '../components/FoodEntryModal';
import { MacroChart } from '../components/MacroChart'; 
import { ThemeToggle } from '../components/ThemeToggle';
import { ProgressBar } from '../components/ProgressBar';
import { HabitTracker } from '../components/HabitTracker'; 
import { HabitSetupModal } from '../components/HabitSetupModal'; 

// Componente Card (con contraste)
interface CardProps { children: React.ReactNode; className?: string; }
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-colors ${className}`}>
        {children}
    </div>
);

// Componente NavBar (con contraste y ThemeToggle)
const NavBar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <nav className="bg-white dark:bg-gray-800 shadow p-4 fixed w-full top-0 z-10 flex justify-between items-center">
            <h1 
                className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                onClick={() => navigate('/dashboard')}
            >
                Calorie Tracker
            </h1>
            <div className="flex items-center">
                <button
                    onClick={() => navigate('/historial')}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium mr-4"
                >
                    Análsis del Día
                </button>
                <ThemeToggle />
                <button
                    onClick={() => {
                        localStorage.removeItem('userProfile');
                        navigate('/login');
                    }} 
                    className="text-red-500 hover:text-red-400 font-medium ml-4"
                >
                    Salir
                </button>
            </div>
        </nav>
    );
};

// Componente de Sugerencias
const FoodSuggestions: React.FC<{ deficit: number }> = ({ deficit }) => {
    const typedFoodData = foodData as FoodItem[]; 
    const suggestion1 = typedFoodData.find(f => f.name.toLowerCase().includes('arroz'));
    const suggestion2 = typedFoodData.find(f => f.name.toLowerCase().includes('plátano') || f.name.toLowerCase().includes('banana'));

    if (!suggestion1 || !suggestion2 || deficit < 100) return null;
    
    return (
        <Card className="border-l-4 border-yellow-500 mt-4">
            <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                💡 ¡Aún te falta energía!
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
                Te faltan **{deficit} kcal**. Puedes optar por:
            </p>
            <p className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md text-sm font-medium">
                1 taza de {suggestion1.name.replace(' (taza)', '')} y 1 {suggestion2.name.toLowerCase()}.
            </p>
        </Card>
    );
};


// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---
export const DashboardPage: React.FC = () => {
    useTheme(); 
    const navigate = useNavigate();
    const foodList = foodData as FoodItem[];

    // ESTADOS LOCALES
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [totalConsumed, setTotalConsumed] = useState(0); 
    const [dailyLog, setDailyLog] = useState<LogEntry[]>([]);
    
    // Estados para Hábitos y Modales
    const [dailyHabitsLog, setDailyHabitsLog] = useState<DailyHabitLog[]>([]); 
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<FoodCategory | ''>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const [isHabitModalOpen, setIsHabitModalOpen] = useState(false); // Modal de Setup

    //  LÓGICA DE CARGA DE DATOS (Aislamiento de Datos)
    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            const profile: UserProfile = JSON.parse(storedProfile);
            setUserProfile(profile);

            // Carga Log Diario Aislado
            const logKey = `dailyLog_${profile.id}`; 
            const storedLog = localStorage.getItem(logKey); 
            if (storedLog) {
                const log: LogEntry[] = JSON.parse(storedLog);
                setDailyLog(log);
                const initialTotal = log.reduce((sum, entry) => sum + entry.totalCalories, 0);
                setTotalConsumed(initialTotal);
            }
            
            // Carga Log de Hábitos Aislado
            const todayKey = new Date().toISOString().split('T')[0];
            const habitKey = `habits_${profile.id}_${todayKey}`;
            const storedHabits = localStorage.getItem(habitKey);
            if (storedHabits) {
                setDailyHabitsLog(JSON.parse(storedHabits));
            }

        } else {
            navigate('/registro');
        }
    }, [navigate]);
    
    //  DEFINICIONES DERIVADAS Y CÁLCULOS
    const filteredFoods = useFoodSearch(query, selectedCategory, foodList);
    
    const uniqueCategories = useMemo(() => {
        return ['', ...Array.from(new Set(foodList.map(food => food.category)))] as Array<FoodCategory | ''>;
    }, [foodList]);

    const macroTotals = useMemo(() => {
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        dailyLog.forEach(entry => {
            const food = foodList.find(f => f.id === entry.foodId);
            if (food) {
                const ratio = entry.quantity / 100;
                totalProtein += food.protein * ratio;
                totalCarbs += food.carbs * ratio;
                totalFat += food.fat * ratio;
            }
        });
        return {
            protein: Math.round(totalProtein),
            carbs: Math.round(totalCarbs),
            fat: Math.round(totalFat),
            totalMacros: Math.round(totalProtein + totalCarbs + totalFat),
        };
    }, [dailyLog, foodList]);

    const calorieStatus = useMemo(() => {
        if (!userProfile) return { status: 'loading', message: 'Cargando perfil...', percentage: 0 } as CalorieState;
        const goal = userProfile.dailyGoal; 
        return getCalorieStatus(goal, totalConsumed); 
    }, [userProfile, totalConsumed]);


    //  MANEJADORES DE ACCIÓN
    
    const handleFoodSelection = (food: FoodItem) => {
        setSelectedFood(food);
        setIsModalOpen(true);
        setQuery('');
    };

    const handleLogSave = (newEntry: LogEntry) => {
        if (!userProfile) return;
        
        const newLog = [...dailyLog, newEntry];
        setDailyLog(newLog);
        setTotalConsumed(prevTotal => prevTotal + newEntry.totalCalories);

        const logKey = `dailyLog_${userProfile.id}`; 
        localStorage.setItem(logKey, JSON.stringify(newLog));
    };
    
    //  Guardado de Configuración de Hábitos (Guarda el Perfil)
    const handleSaveHabitSelection = (updatedProfile: UserProfile) => {
        setUserProfile(updatedProfile); 
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        setIsHabitModalOpen(false); 
        
        // Carga/Inicialización de Hábitos para el día actual
        const todayKey = new Date().toISOString().split('T')[0];
        const habitKey = `habits_${updatedProfile.id}_${todayKey}`;
        const storedHabits = localStorage.getItem(habitKey);
        
        if (storedHabits) {
            setDailyHabitsLog(JSON.parse(storedHabits));
        } else {
             // Si no hay log, inicializar con los nuevos hábitos seleccionados
             const initialHabitsLog = updatedProfile.selectedHabitIds.map(id => ({ habitId: id, isCompleted: false }));
             setDailyHabitsLog(initialHabitsLog);
             localStorage.setItem(habitKey, JSON.stringify(initialHabitsLog));
        }
    };
    
    //  Toggle del Hábito (Actualiza el estado local y localStorage)
    const toggleHabit = (habitId: string) => {
        if (!userProfile) return;
        
        const updatedHabitsLog = dailyHabitsLog.map(h => 
            h.habitId === habitId ? { ...h, isCompleted: !h.isCompleted } : h
        );
        
        // Si el hábito se marca por primera vez (y no existía en el log), inicializarlo como completado
        if (!dailyHabitsLog.some(h => h.habitId === habitId)) {
             const newHabitEntry = { habitId: habitId, isCompleted: true };
             updatedHabitsLog.push(newHabitEntry);
        }
        
        setDailyHabitsLog(updatedHabitsLog);
        
        const todayKey = new Date().toISOString().split('T')[0];
        const habitKey = `habits_${userProfile.id}_${todayKey}`;
        localStorage.setItem(habitKey, JSON.stringify(updatedHabitsLog));
    };


    if (!userProfile) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-white">Cargando perfil...</div>;
    }
    
    const remainingCalories = userProfile.dailyGoal - totalConsumed;
    const deficit = remainingCalories > 0 ? remainingCalories : 0;


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
            <NavBar />
            
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUMNA 1 & 2: MÉTRICAS */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. MÉTRICA PRINCIPAL: Calorías Restantes y Frase Emotiva */}
                        <Card className={`text-center border-b-4 ${
                            calorieStatus.status === 'onTrack' ? 'border-green-500' :
                            calorieStatus.status === 'low' ? 'border-yellow-500' :
                            'border-red-500'
                        }`}>
                            <h2 className="text-xl font-medium text-gray-500 dark:text-gray-300">
                                Calorías Restantes (Meta: {userProfile.dailyGoal} kcal)
                            </h2>
                            <p className={`text-7xl font-extrabold my-4 ${
                                calorieStatus.status === 'onTrack' ? 'text-green-600 dark:text-green-400' :
                                calorieStatus.status === 'low' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                            }`}>
                                {Math.abs(remainingCalories)} <span className="text-3xl font-normal">kcal</span>
                            </p>
                            <p className={`text-lg font-semibold ${calorieStatus.status === 'high' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                {remainingCalories > 0 ? 'Faltan' : remainingCalories < 0 ? 'Exceso de' : 'Meta alcanzada!'}
                            </p>
                            
                            {/* BARRA DE PROGRESO */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <ProgressBar 
                                    percentage={calorieStatus.percentage} 
                                    status={calorieStatus.status} 
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Progreso: {calorieStatus.percentage}% del objetivo completado.
                                </p>
                            </div>
                        </Card>

                        {/* Frase Emotiva */}
                        <Card className="p-4 border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30">
                            <p className="italic text-gray-700 dark:text-gray-300">
                                "{calorieStatus.message}"
                            </p>
                        </Card>

                        {/* Sugerencias de Alimentos */}
                        {calorieStatus.status === 'low' && deficit > 100 && (
                            <FoodSuggestions deficit={deficit} />
                        )}

                        {/* 2. VISUALIZACIÓN DE MACROS */}
                        <Card>
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                                Distribución de Macronutrientes (Gramos)
                            </h3>
                            <div className="flex justify-around items-center h-64">
                                <MacroChart
                                    protein={macroTotals.protein}
                                    carbs={macroTotals.carbs}
                                    fat={macroTotals.fat}
                                    totalMacros={macroTotals.totalMacros}
                                />
                                <div className="text-right space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">Totales Consumidos:</p>
                                    <p className="text-gray-800 dark:text-white">Proteínas: <span className="font-bold text-green-500">{macroTotals.protein}g</span></p>
                                    <p className="text-gray-800 dark:text-white">Carbohidratos: <span className="font-bold text-yellow-500">{macroTotals.carbs}g</span></p>
                                    <p className="text-gray-800 dark:text-white">Grasas: <span className="font-bold text-blue-500">{macroTotals.fat}g</span></p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* COLUMNA: PANEL DE REGISTRO Y HÁBITOS */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* PANEL DE HÁBITOS */}
                        <Card>
                            <HabitTracker 
                                userProfile={userProfile}
                                dailyHabitsLog={dailyHabitsLog}
                                toggleHabit={toggleHabit} 
                                openSetupModal={() => setIsHabitModalOpen(true)}
                            />
                        </Card>

                        {/* PANEL DE REGISTRO */}
                        <Card>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Registro Diario</h3>
                            
                            {/* Barra de Búsqueda con Autocompletado */}
                            <div className="relative mb-4">
                                <input 
                                    type="text" 
                                    placeholder="Buscar alimento (ej. man)" 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white" 
                                />
                                
                                {/* Resultados del Autocompletado */}
                                {query && filteredFoods.length > 0 && (
                                    <ul className="absolute z-20 w-full bg-white dark:bg-gray-700 border rounded-b-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                        {filteredFoods.map(food => (
                                            <li 
                                                key={food.id} 
                                                className="p-3 hover:bg-indigo-100 dark:hover:bg-indigo-600 cursor-pointer text-sm flex justify-between text-gray-900 dark:text-white" 
                                                onClick={() => handleFoodSelection(food)} 
                                            >
                                                <span>{food.name}</span>
                                                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{food.calories} kcal/100g</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Filtro por Categoría */}
                            <select 
                                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white mb-6" 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as FoodCategory | '')}
                            >
                                {uniqueCategories.map(cat => (
                                    <option key={cat || 'all'} value={cat}>
                                        {cat || '-- Filtrar por Categoría --'}
                                    </option>
                                ))}
                            </select>

                            {/* Lista de Log Diario */}
                            <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Comidas Registradas Hoy ({dailyLog.length})</h3>
                            {dailyLog.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    Aún no has registrado ningún alimento.
                                </p>
                            ) : (
                                <ul className="space-y-2 max-h-72 overflow-y-auto">
                                    {dailyLog.map((entry, index) => (
                                        <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm text-sm flex justify-between items-center">
                                            <div>
                                                <span className="font-medium text-indigo-600 dark:text-indigo-400 mr-1 text-xs uppercase">
                                                    [{entry.mealType}]
                                                </span>
                                                <p className="text-gray-900 dark:text-white font-semibold">{entry.foodName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{entry.quantity}g</p>
                                            </div>
                                            <span className="font-bold text-lg text-gray-800 dark:text-white">
                                                {entry.totalCalories} kcal
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>
                    
                </div>
            </main>

            {/* RENDERIZAR DE REGISTRO DE ALIMENTOS */}
            {selectedFood && (
                <FoodEntryModal
                    food={selectedFood}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleLogSave}
                />
            )}
            
            {/* RENDERIZAR  DE CONFIGURACIÓN DE HÁBITOS */}
            {userProfile && (
                <HabitSetupModal
                    profile={userProfile}
                    isOpen={isHabitModalOpen}
                    onClose={() => setIsHabitModalOpen(false)}
                    onSave={handleSaveHabitSelection}
                />
            )}
        </div>
    );
};