import React, { useState } from 'react';
import { format, setMonth, setYear, getMonth, getYear } from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Check, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    fromYear?: number;
    toYear?: number;
    placeholder?: string;
}

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function DatePicker({
    value,
    onChange,
    fromYear = 1960,
    toYear = new Date().getFullYear() - 18,
    placeholder = "Pick a date"
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(value || new Date(toYear, 0, 1));
    const [view, setView] = useState<'calendar' | 'months' | 'years'>('calendar');

    const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i).reverse();

    const getDaysInMonth = (date: Date) => {
        const year = getYear(date);
        const month = getMonth(date);
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (number | null)[] = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const handleSelectDay = (day: number) => {
        const newDate = new Date(getYear(viewDate), getMonth(viewDate), day);
        onChange(newDate);
        setIsOpen(false);
    };

    const handleSelectMonth = (monthIndex: number) => {
        setViewDate(setMonth(viewDate, monthIndex));
        setView('calendar');
    };

    const handleSelectYear = (year: number) => {
        setViewDate(setYear(viewDate, year));
        setView('months');
    };

    const isDateDisabled = (day: number) => {
        const date = new Date(getYear(viewDate), getMonth(viewDate), day);
        const minDate = new Date(fromYear, 0, 1);
        const maxDate = new Date(toYear, 11, 31);
        return date < minDate || date > maxDate;
    };

    const isSelectedDay = (day: number) => {
        if (!value) return false;
        return (
            day === value.getDate() &&
            getMonth(viewDate) === value.getMonth() &&
            getYear(viewDate) === value.getFullYear()
        );
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "w-full p-3 text-left border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white flex justify-between items-center",
                        !value && "text-slate-500"
                    )}
                >
                    {value ? format(value, "PPP") : <span>{placeholder}</span>}
                    <CalendarIcon className="w-5 h-5 text-slate-400" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
                <div className="p-3 bg-white rounded-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                            disabled={view !== 'calendar'}
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>

                        <button
                            onClick={() => setView(view === 'calendar' ? 'years' : 'calendar')}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold hover:bg-slate-100 rounded-md transition-colors"
                        >
                            {MONTHS[getMonth(viewDate)]} {getYear(viewDate)}
                            <ChevronDown className={cn("w-4 h-4 transition-transform", view !== 'calendar' && "rotate-180")} />
                        </button>

                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                            disabled={view !== 'calendar'}
                        >
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {view === 'calendar' && (
                            <motion.div
                                key="calendar"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-1 mb-1">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                        <div key={day} className="text-center text-xs font-medium text-slate-400 py-1">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1">
                                    {getDaysInMonth(viewDate).map((day, index) => (
                                        <div key={index} className="aspect-square">
                                            {day !== null ? (
                                                <button
                                                    onClick={() => !isDateDisabled(day) && handleSelectDay(day)}
                                                    disabled={isDateDisabled(day)}
                                                    className={cn(
                                                        "w-full h-full flex items-center justify-center text-sm rounded-md transition-colors",
                                                        isSelectedDay(day)
                                                            ? "bg-primary text-white font-medium"
                                                            : "hover:bg-slate-100 text-slate-700",
                                                        isDateDisabled(day) && "text-slate-300 cursor-not-allowed hover:bg-transparent"
                                                    )}
                                                >
                                                    {day}
                                                </button>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {view === 'months' && (
                            <motion.div
                                key="months"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-3 gap-2"
                            >
                                {MONTHS.map((month, index) => (
                                    <button
                                        key={month}
                                        onClick={() => handleSelectMonth(index)}
                                        className={cn(
                                            "py-2 px-1 text-sm rounded-md transition-colors",
                                            getMonth(viewDate) === index
                                                ? "bg-primary text-white font-medium"
                                                : "hover:bg-slate-100 text-slate-700"
                                        )}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {view === 'years' && (
                            <motion.div
                                key="years"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto"
                            >
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => handleSelectYear(year)}
                                        className={cn(
                                            "py-2 px-1 text-sm rounded-md transition-colors",
                                            getYear(viewDate) === year
                                                ? "bg-primary text-white font-medium"
                                                : "hover:bg-slate-100 text-slate-700"
                                        )}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PopoverContent>
        </Popover>
    );
}
