
import React from 'react';
import {
    Activity, Footprints, Briefcase,
    Wine, Cigarette, Moon, Coffee,
    Zap, Trophy, Sofa, Home, Laptop, Building2, Tent,
    Scale, Ruler, HeartPulse, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LifestyleProfile } from '@/context/AppContext';
import OccupationSearch from './OccupationSearch';

interface LifestyleFormProps {
    data: LifestyleProfile;
    onChange: (data: LifestyleProfile) => void;
    gender?: string;
}

const LifestyleForm: React.FC<LifestyleFormProps> = ({ data, onChange, gender }) => {

    const updateField = (field: keyof LifestyleProfile, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const ButtonGrid = ({
        options,
        value,
        onChange,
        cols = 2
    }: {
        options: { label: string; subtext?: string; icon?: React.ElementType, value: string }[],
        value: string,
        onChange: (val: string) => void,
        cols?: 1 | 2 | 4
    }) => {
        const gridCols = {
            1: "grid-cols-1",
            2: "grid-cols-1 sm:grid-cols-2",
            4: "grid-cols-2 sm:grid-cols-4"
        }[cols];

        return (
            <div className={cn("grid gap-3", gridCols)}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "relative p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 group",
                            value === opt.value
                                ? "border-pink-500 bg-pink-50 ring-1 ring-pink-500 shadow-sm"
                                : "border-slate-200 hover:border-pink-200 hover:bg-slate-50 hover:shadow-sm"
                        )}
                    >
                        {opt.icon && (
                            <div className={cn(
                                "p-2.5 rounded-lg transition-colors",
                                value === opt.value
                                    ? "bg-pink-100 text-pink-600"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-pink-400"
                            )}>
                                <opt.icon className="w-5 h-5" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className={cn(
                                "font-semibold text-sm transition-colors",
                                value === opt.value ? "text-pink-700" : "text-slate-900 group-hover:text-slate-900"
                            )}>
                                {opt.label}
                            </div>
                            {opt.subtext && (
                                <div className={cn(
                                    "text-xs mt-1 leading-relaxed",
                                    value === opt.value ? "text-pink-600/80" : "text-slate-500"
                                )}>
                                    {opt.subtext}
                                </div>
                            )}
                        </div>
                        {value === opt.value && (
                            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-pink-500" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-10">
            {/* Activity Level */}
            <div className="space-y-4">
                <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Activity Level
                </label>
                <ButtonGrid
                    cols={2}
                    value={data.activityLevel}
                    onChange={(val) => updateField('activityLevel', val)}
                    options={[
                        { label: 'Sedentary', value: 'Sedentary', subtext: 'Little to no regular exercise', icon: Sofa },
                        { label: 'Moderate', value: 'Moderate', subtext: 'Light exercise 1-3 times/week', icon: Footprints },
                        { label: 'Active', value: 'Active', subtext: 'Exercise 3-5 times/week', icon: Zap },
                        { label: 'Athletic', value: 'Athletic', subtext: 'Daily intense exercise/sports', icon: Trophy }
                    ]}
                />
            </div>

            {/* Daily Steps */}
            <div className="space-y-4">
                <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-primary" />
                    Daily Steps
                </label>
                <ButtonGrid
                    cols={2}
                    value={data.dailySteps}
                    onChange={(val) => updateField('dailySteps', val)}
                    options={[
                        { label: 'Less than 3,000', value: 'Less than 3,000', subtext: 'Mostly sitting' },
                        { label: '3,000 - 5,000', value: '3,000 - 5,000', subtext: 'Light walking' },
                        { label: '5,000 - 10,000', value: '5,000 - 10,000', subtext: 'Active day' },
                        { label: '10,000+', value: '10,000+', subtext: 'Very active' }
                    ]}
                />
            </div>

            {/* Occupation & Work Style */}
            <div className="space-y-4">
                <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Occupation & Work Style
                </label>
                <div className="space-y-4">
                    <OccupationSearch
                        value={data.occupation}
                        onChange={(val) => updateField('occupation', val)}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Sitting 8h+', value: 'Sitting 8h+', icon: Sofa },
                            { label: 'Sitting 4h+', value: 'Sitting 4h+', icon: Laptop },
                            { label: 'Travelling', value: 'Travelling', icon: Tent },
                            { label: 'Other', value: 'Other', icon: Briefcase }
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateField('workStyle', opt.value)}
                                className={cn(
                                    "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 hover:shadow-sm",
                                    data.workStyle === opt.value
                                        ? "border-primary bg-primary/5 ring-1 ring-primary text-primary"
                                        : "border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <opt.icon className="w-5 h-5 opacity-70" />
                                <span className="text-sm font-medium">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Habits Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Drinking */}
                <div className="space-y-4">
                    <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Wine className="w-5 h-5 text-primary" />
                        Drinking Habits
                    </label>
                    <ButtonGrid
                        cols={2}
                        value={data.drinkingHabit}
                        onChange={(val) => updateField('drinkingHabit', val)}
                        options={[
                            { label: 'Never', value: 'Never', subtext: 'I do not drink alcohol' },
                            { label: 'Socially', value: 'Socially', subtext: 'Occasional drinks at parties' },
                            { label: 'Regularly', value: 'Regularly', subtext: '1-2 times a week' },
                            { label: 'Heavily', value: 'Heavily', subtext: 'Almost every day' }
                        ]}
                    />
                </div>

                {/* Smoking */}
                <div className="space-y-4">
                    <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Cigarette className="w-5 h-5 text-primary" />
                        Smoking Habits
                    </label>
                    <ButtonGrid
                        cols={2}
                        value={data.smokingHabit}
                        onChange={(val) => updateField('smokingHabit', val)}
                        options={[
                            { label: 'Never', value: 'Never', subtext: 'I do not smoke' },
                            { label: 'Occasional', value: 'Occasional', subtext: 'Once in a while' },
                            { label: 'Regular', value: 'Regular', subtext: 'Daily smoker' },
                            { label: 'Chain', value: 'Chain', subtext: 'Multiple packs a day' }
                        ]}
                    />
                </div>

                {/* Tobacco */}
                <div className="space-y-4">
                    <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-primary" />
                        Tobacco Habits
                    </label>
                    <ButtonGrid
                        cols={2}
                        value={data.tobaccoHabit}
                        onChange={(val) => updateField('tobaccoHabit', val)}
                        options={[
                            { label: 'Never', value: 'Never', subtext: 'No tobacco use' },
                            { label: 'Occasional', value: 'Occasional', subtext: 'Rarely use tobacco' },
                            { label: 'Regular', value: 'Regular', subtext: 'Daily tobacco use' }
                        ]}
                    />
                </div>

                {/* Sleep */}
                <div className="space-y-4">
                    <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Moon className="w-5 h-5 text-primary" />
                        Sleep Cycle
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Early Bird', value: 'Early Bird', icon: Zap },
                            { label: 'Night Owl', value: 'Night Owl', icon: Moon },
                            { label: 'Irregular', value: 'Irregular', icon: Activity },
                            { label: 'Insomniac', value: 'Insomniac', icon: Coffee }
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateField('sleepPattern', opt.value)}
                                className={cn(
                                    "p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 hover:shadow-sm",
                                    data.sleepPattern === opt.value
                                        ? "border-primary bg-primary/5 ring-1 ring-primary text-primary"
                                        : "border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <opt.icon className="w-6 h-6 opacity-70" />
                                <span className="font-medium">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            {/* Health Metrics */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-pink-500" />
                        Health Metrics
                    </h3>
                    <button
                        type="button"
                        onClick={() => alert("Link copied to clipboard! Share this with the prospect to fill their details.")}
                        className="text-sm font-medium text-pink-600 hover:text-pink-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Ask Prospect to Fill
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Height */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-slate-400" />
                            Height
                        </label>
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 transition-all">
                            <input
                                type="number"
                                value={data.height?.value || ''}
                                onChange={(e) => updateField('height', { ...data.height, value: e.target.value })}
                                placeholder="0"
                                className="w-full p-3 outline-none text-slate-900 placeholder:text-slate-300"
                            />
                            <div className="flex border-l border-slate-200 bg-slate-50">
                                {['cm', 'ft'].map((unit) => (
                                    <button
                                        key={unit}
                                        type="button"
                                        onClick={() => updateField('height', { ...data.height, unit })}
                                        className={cn(
                                            "px-3 text-sm font-medium transition-colors",
                                            data.height?.unit === unit
                                                ? "bg-white text-pink-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {unit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Scale className="w-4 h-4 text-slate-400" />
                            Weight
                        </label>
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 transition-all">
                            <input
                                type="number"
                                value={data.weight?.value || ''}
                                onChange={(e) => updateField('weight', { ...data.weight, value: e.target.value })}
                                placeholder="0"
                                className="w-full p-3 outline-none text-slate-900 placeholder:text-slate-300"
                            />
                            <div className="flex border-l border-slate-200 bg-slate-50">
                                {['kg', 'lbs'].map((unit) => (
                                    <button
                                        key={unit}
                                        type="button"
                                        onClick={() => updateField('weight', { ...data.weight, unit })}
                                        className={cn(
                                            "px-3 text-sm font-medium transition-colors",
                                            data.weight?.unit === unit
                                                ? "bg-white text-pink-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {unit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Waist */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400" />
                            Waist
                        </label>
                        <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 transition-all">
                            <input
                                type="number"
                                value={data.waistCircumference?.value || ''}
                                onChange={(e) => updateField('waistCircumference', { ...data.waistCircumference, value: e.target.value })}
                                placeholder="0"
                                className="w-full p-3 outline-none text-slate-900 placeholder:text-slate-300"
                            />
                            <div className="flex border-l border-slate-200 bg-slate-50">
                                {['in', 'cm'].map((unit) => (
                                    <button
                                        key={unit}
                                        type="button"
                                        onClick={() => updateField('waistCircumference', { ...data.waistCircumference, unit })}
                                        className={cn(
                                            "px-3 text-sm font-medium transition-colors",
                                            data.waistCircumference?.unit === unit
                                                ? "bg-white text-pink-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {unit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menstrual Cycle - Only for Female */}
                {gender === 'Female' && (
                    <div className="space-y-4 pt-4">
                        <label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                            <HeartPulse className="w-5 h-5 text-pink-500" />
                            Menstrual Health
                        </label>
                        <ButtonGrid
                            cols={2}
                            value={data.menstrualCycle}
                            onChange={(val) => updateField('menstrualCycle', val)}
                            options={[
                                { label: 'Regular', value: 'Regular', subtext: 'Predictable cycle every month' },
                                { label: 'Irregular', value: 'Irregular', subtext: 'Cycle varies significantly' },
                                { label: 'PCOS/PCOD', value: 'PCOS/PCOD', subtext: 'Diagnosed with PCOS/PCOD' },
                                { label: 'Menopause', value: 'Menopause', subtext: 'Cycle has stopped' }
                            ]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LifestyleForm;
