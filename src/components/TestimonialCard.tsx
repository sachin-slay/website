import React from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
    names: string;
    location: string;
    type: string;
    quote: string;
    highlight: string;
    impact: string;
    color: string;
}

export const TestimonialCard = ({ names, location, type, quote, highlight, impact, color }: TestimonialCardProps) => {
    const colorClasses: Record<string, string> = {
        yellow: "bg-yellow-500 text-slate-900 border-yellow-500/20",
        pink: "bg-pink-500 text-white border-pink-500/20",
        blue: "bg-blue-500 text-white border-blue-500/20",
        green: "bg-green-500 text-white border-green-500/20",
        purple: "bg-purple-500 text-white border-purple-500/20",
    };

    const textColors: Record<string, string> = {
        yellow: "text-yellow-400",
        pink: "text-pink-400",
        blue: "text-blue-400",
        green: "text-green-400",
        purple: "text-purple-400",
    };

    return (
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative h-full flex flex-col">
            <div className={cn("absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg", colorClasses[color])}>
                {type}
            </div>
            <h3 className={cn("text-xl font-bold mb-4", textColors[color])}>{highlight}</h3>
            <div className="relative flex-1">
                <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-600 opacity-50 transform -scale-x-100" />
                <p className="text-slate-300 mb-6 italic pl-6">{quote}</p>
            </div>
            <div className="flex items-center gap-4 border-t border-slate-700 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-white text-sm">
                    {names.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                    <div className="font-semibold text-white">{names}</div>
                    <div className="text-xs text-slate-400">{location}</div>
                </div>
            </div>
            <div className={cn("mt-4 text-sm font-medium", textColors[color])}>
                {impact}
            </div>
        </div>
    );
};
