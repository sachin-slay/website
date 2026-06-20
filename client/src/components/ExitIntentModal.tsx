import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';

export const ExitIntentModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggered && !sessionStorage.getItem('slay_exit_intent_seen')) {
                setIsVisible(true);
                setHasTriggered(true);
                sessionStorage.setItem('slay_exit_intent_seen', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasTriggered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 pt-[10vh]">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#111112]/80 backdrop-blur-md"
                        onClick={() => setIsVisible(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white border border-black/10 shadow-2xl p-8"
                    >
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-2 text-[#5A5A60] hover:text-black transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center space-y-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 border border-slayy-green/30 bg-slayy-green/5 font-mono text-[9px] uppercase tracking-widest text-slayy-green font-bold">
                                WAIT BEFORE YOU GO
                            </span>
                            
                            <h2 className="text-3xl font-sans font-black uppercase tracking-tighter leading-none text-[#111112]">
                                Get Your Free Compatibility <br /> Risk Checklist
                            </h2>

                            <p className="font-mono text-[11px] uppercase tracking-wider text-[#5A5A60] leading-relaxed">
                                Not ready to book a full screening? Download our clinical 10-point checklist to know exactly what questions to ask your partner today.
                            </p>

                            <div className="space-y-4 pt-4">
                                <input 
                                    type="email" 
                                    placeholder="ENTER YOUR EMAIL" 
                                    className="w-full px-5 py-4 border border-black/15 bg-[#FBFBFD] text-xs font-mono font-semibold uppercase tracking-wider placeholder:text-[#5A5A60]/50 outline-none focus:border-slayy-green transition-colors"
                                />
                                <MagneticButton className="w-full">
                                    <button 
                                        className="w-full py-4 bg-slayy-green text-white font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#111112] transition-colors"
                                        onClick={() => setIsVisible(false)}
                                    >
                                        SEND MY CHECKLIST
                                    </button>
                                </MagneticButton>
                            </div>
                            
                            <p className="text-[8px] font-mono uppercase tracking-widest text-[#5A5A60] pt-2">
                                NO SPAM. JUST CLINICAL FACTS.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
