
import React from 'react';

interface ProgressBarProps {
    percentage: number;
    status: 'onTrack' | 'low' | 'high' | 'loading';
}

const getBarColor = (status: ProgressBarProps['status']) => {
    switch (status) {
        case 'onTrack':
            return 'bg-green-500'; // Meta lograda o cerca
        case 'high':
            return 'bg-red-600'; // Exceso
        case 'low':
            return 'bg-indigo-600'; // Progreso normal (azul)
        default:
            return 'bg-gray-400';
    }
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, status }) => {
    const barColor = getBarColor(status);
    const cappedPercentage = Math.min(percentage, 100); // No mostrar más del 100% en la barra

    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
                className={`${barColor} h-3 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${cappedPercentage}%` }}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
            ></div>
        </div>
    );
};