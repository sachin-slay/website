import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCardProps {
    plan: {
        id: string;
        title: string;
        price: string;
        per: string;
        save?: string;
        description: string;
        features: string[];
        outcome: string;
        cta: string;
        popular: boolean;
    };
}

export const PricingCard = ({ plan }: PricingCardProps) => {
    return (
        <div className={cn(
            "rounded-2xl p-8 transition-all duration-300 flex flex-col h-full",
            plan.popular
                ? "border-2 border-primary shadow-xl relative transform md:-translate-y-4 bg-white"
                : "border border-slate-200 hover:shadow-lg bg-white"
        )}>
            {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST CHOSEN
                </div>
            )}

            <h3 className="text-xl font-bold text-slate-900">{plan.title}</h3>
            <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-500">{plan.per}</span>
                {plan.save && <div className="text-xs text-green-600 font-medium mt-1">{plan.save}</div>}
            </div>

            <p className="text-sm text-slate-600 mb-6 italic">"{plan.description}"</p>

            <button className="w-full py-3 font-semibold rounded-lg transition-colors mb-8 bg-primary text-white hover:bg-primary/90 shadow-md">
                {plan.cta}
            </button>

            <div className="flex-1">
                <ul className="space-y-3 text-sm text-slate-600">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex gap-2 items-start">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-xs font-medium text-slate-500 text-center">
                Outcome: {plan.outcome}
            </div>
        </div>
    );
};
