

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MacroChartProps {
    protein: number;
    carbs: number;
    fat: number;
    totalMacros: number;
}

const COLORS = ['#FFC300', '#32CD32', '#007FFF']; // Carbos, Proteínas, Grasas

export const MacroChart: React.FC<MacroChartProps> = ({ protein, carbs, fat, totalMacros }) => {
    
    // Si no hay consumo, mostramos un gráfico vacío para evitar errores
    if (totalMacros === 0) {
        return (
            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                Añade alimentos para ver tu distribución de macros.
            </div>
        );
    }
    
    const data = [
        { name: 'Carbohidratos', value: carbs, color: COLORS[0] },
        { name: 'Proteínas', value: protein, color: COLORS[1] },
        { name: 'Grasas', value: fat, color: COLORS[2] },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const dataItem = payload[0].payload;
            const percentage = ((dataItem.value / totalMacros) * 100).toFixed(1);

            return (
                <div className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg text-sm">
                    <p className="font-bold text-gray-900 dark:text-white">{dataItem.name}: {dataItem.value}g</p>
                    <p className="text-gray-600 dark:text-gray-400">({percentage}%)</p>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="h-72"> {/* Contenedor con altura definida para ResponsiveContainer */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ paddingTop: '10px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};