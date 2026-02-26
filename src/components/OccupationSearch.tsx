import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock list of common occupations
const OCCUPATIONS = [
    "Software Engineer", "Doctor", "Teacher", "Business Owner", "Civil Servant", "Banker", "Lawyer", "Architect",
    "Chartered Accountant", "Designer", "Consultant", "Marketing Professional", "Sales Professional", "HR Professional",
    "Data Scientist", "Product Manager", "Professor", "Researcher", "Artist", "Writer", "Chef", "Pilot", "Engineer (Non-IT)",
    "Government Employee", "Student", "Homemaker", "Retired", "Other"
];

interface OccupationSearchProps {
    value: string;
    onChange: (occupation: string) => void;
    placeholder?: string;
    className?: string;
}

const OccupationSearch: React.FC<OccupationSearchProps> = ({ value, onChange, placeholder = "Search occupation...", className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOccupations = OCCUPATIONS.filter(occ =>
        occ.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={cn("relative", className)} ref={wrapperRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                        // Allow custom input if not found in list, but update parent on every change
                        onChange(e.target.value);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm('');
                            onChange('');
                            setIsOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && searchTerm && filteredOccupations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto"
                    >
                        {filteredOccupations.map((occ) => (
                            <button
                                key={occ}
                                type="button"
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                    onChange(occ);
                                    setSearchTerm(occ);
                                    setIsOpen(false);
                                }}
                            >
                                <Briefcase className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-700 font-medium">{occ}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OccupationSearch;
