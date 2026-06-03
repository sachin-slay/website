import React from 'react';
import { motion } from 'framer-motion';

interface ScoreGaugeProps {
    score: number;
    maxScore?: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    color?: string;
}

export const ScoreGauge = ({
    score,
    maxScore = 100,
    size = 120,
    strokeWidth = 10,
    label = "Score",
    color = "#10B981" // Default green
}: ScoreGaugeProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = score / maxScore;
    const dashoffset = circumference - progress * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900">
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
};
