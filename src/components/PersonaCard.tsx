import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, RefreshCw, Baby, Shield, ArrowRight, ArrowDown, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const icons: Record<string, React.ElementType> = {
    Users,
    Heart,
    RefreshCw,
    Baby,
    Shield,
};

const colorMap: Record<string, {
    border: string;
    bg: string;
    text: string;
    headerBg: string;
    dot: string;
    btnBg: string;
    btnHover: string;
    checkBorder: string;
    lightBg: string;
}> = {
    red: {
        border: 'border-red-400',
        bg: 'bg-red-50',
        text: 'text-red-600',
        headerBg: 'bg-red-500',
        dot: 'bg-red-400',
        btnBg: 'bg-red-500',
        btnHover: 'hover:bg-red-600',
        checkBorder: 'border-l-red-400',
        lightBg: 'bg-red-50',
    },
    purple: {
        border: 'border-purple-400',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        headerBg: 'bg-purple-500',
        dot: 'bg-purple-400',
        btnBg: 'bg-purple-500',
        btnHover: 'hover:bg-purple-600',
        checkBorder: 'border-l-purple-400',
        lightBg: 'bg-purple-50',
    },
    teal: {
        border: 'border-teal-400',
        bg: 'bg-teal-50',
        text: 'text-teal-600',
        headerBg: 'bg-teal-500',
        dot: 'bg-teal-400',
        btnBg: 'bg-teal-500',
        btnHover: 'hover:bg-teal-600',
        checkBorder: 'border-l-teal-400',
        lightBg: 'bg-teal-50',
    },
    orange: {
        border: 'border-orange-400',
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        headerBg: 'bg-orange-500',
        dot: 'bg-orange-400',
        btnBg: 'bg-orange-500',
        btnHover: 'hover:bg-orange-600',
        checkBorder: 'border-l-orange-400',
        lightBg: 'bg-orange-50',
    },
    blue: {
        border: 'border-blue-400',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        headerBg: 'bg-blue-500',
        dot: 'bg-blue-400',
        btnBg: 'bg-blue-500',
        btnHover: 'hover:bg-blue-600',
        checkBorder: 'border-l-blue-400',
        lightBg: 'bg-blue-50',
    },
};

export interface Persona {
    id: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
    needs: string[];
    warningStat: string;
    checks: string[];
    price: string;
}

interface PersonaSectionProps {
    personas: Persona[];
}

export const PersonaSection = ({ personas }: PersonaSectionProps) => {
    const [selectedId, setSelectedId] = useState<string>(personas[0]?.id || '');
    const selected = personas.find((p) => p.id === selectedId)!;
    const colors = colorMap[selected.color] || colorMap.blue;
    const SelectedIcon = icons[selected.icon] || Users;

    // Split: first 3 on top row, rest on bottom row
    const topRow = personas.slice(0, 3);
    const bottomRow = personas.slice(3);

    return (
        <div className="space-y-8">
            {/* Persona cards */}
            <div className="space-y-4">
                {/* Top row - 3 columns */}
                <div className="grid md:grid-cols-3 gap-4">
                    {topRow.map((persona) => {
                        const isActive = persona.id === selectedId;
                        const c = colorMap[persona.color] || colorMap.blue;
                        const Icon = icons[persona.icon] || Users;
                        return (
                            <button
                                key={persona.id}
                                onClick={() => setSelectedId(persona.id)}
                                className={`text-left rounded-xl p-5 border-2 transition-all duration-200 relative ${
                                    isActive
                                        ? `${c.border} ${c.bg} shadow-md`
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                }`}
                            >
                                {isActive && (
                                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full ${c.btnBg} flex items-center justify-center`}>
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${isActive ? c.lightBg : 'bg-slate-100'} flex items-center justify-center ${isActive ? c.text : 'text-slate-500'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-sm ${isActive ? c.text : 'text-slate-900'}`}>
                                            {persona.title}
                                        </h3>
                                        {isActive && (
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>Selected</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{persona.desc}</p>
                                <ul className="space-y-1.5">
                                    {persona.needs.map((need, i) => (
                                        <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isActive ? c.dot : 'bg-slate-300'}`} />
                                            {need}
                                        </li>
                                    ))}
                                </ul>
                                {isActive ? (
                                    <p className={`text-xs font-semibold mt-4 flex items-center gap-1 ${c.text}`}>
                                        View detailed assessment <ArrowDown className="w-3 h-3" />
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                                        Explore checks <ArrowRight className="w-3 h-3" />
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom row - centered */}
                <div className="flex justify-center gap-4">
                    {bottomRow.map((persona) => {
                        const isActive = persona.id === selectedId;
                        const c = colorMap[persona.color] || colorMap.blue;
                        const Icon = icons[persona.icon] || Users;
                        return (
                            <button
                                key={persona.id}
                                onClick={() => setSelectedId(persona.id)}
                                className={`text-left rounded-xl px-5 py-4 border-2 transition-all duration-200 relative flex items-center gap-3 min-w-[240px] ${
                                    isActive
                                        ? `${c.border} ${c.bg} shadow-md`
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                }`}
                            >
                                {isActive && (
                                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full ${c.btnBg} flex items-center justify-center`}>
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <div className={`w-10 h-10 rounded-lg ${isActive ? c.lightBg : 'bg-slate-100'} flex items-center justify-center flex-shrink-0 ${isActive ? c.text : 'text-slate-500'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm ${isActive ? c.text : 'text-slate-900'}`}>
                                        {persona.title}
                                    </h3>
                                    <p className="text-xs text-slate-500">{persona.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Assessment Overview Panel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                    {/* Header */}
                    <div className={`${colors.headerBg} px-6 py-4 flex items-center justify-between`}>
                        <div className="flex items-center gap-3 text-white">
                            <SelectedIcon className="w-5 h-5" />
                            <span className="font-bold text-sm">
                                {selected.title} — Assessment Overview
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            Results in 48 hours
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Warning stat */}
                        <div className={`${colors.lightBg} rounded-lg px-5 py-3 flex items-start gap-3`}>
                            <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
                            <p className="text-sm text-slate-700">{selected.warningStat}</p>
                        </div>

                        {/* 3 Check cards */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {selected.checks.map((check, i) => (
                                <div
                                    key={i}
                                    className={`rounded-lg border border-slate-200 border-l-4 ${colors.checkBorder} p-4`}
                                >
                                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${colors.text}`}>
                                        Check {String(i + 1).padStart(2, '0')}
                                    </p>
                                    <p className="text-sm text-slate-700">{check}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA bar */}
                        <div className="bg-slate-50 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-slate-900 text-sm">
                                    Begin your {selected.title.toLowerCase()} health assessment
                                </p>
                                <p className="text-xs text-slate-500">
                                    15-minute intake · Doctor-reviewed · Starting at <strong>₹{selected.price}</strong>
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className={`${colors.btnBg} ${colors.btnHover} text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap`}
                            >
                                Start Assessment <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
