import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, AlertCircle, Info, Check, Shield, Activity, ChevronRight, ChevronDown, Users as UsersIcon } from 'lucide-react';
import { communityRisks, CommunityKey } from '@/lib/communityRisks';
import { sampleReport } from '@/lib/sampleReport';

export const InteractiveBentoSections: React.FC = () => {
    const [selectedCommunity, setSelectedCommunity] = useState<CommunityKey>('Gujarati');
    const [reportTab, setReportTab] = useState<'genetic' | 'fertility' | 'chronic' | 'infection'>('genetic');

    const PILLARS = [
        { icon: Dna,      label: 'Genetic Compatibility',  desc: 'Thalassemia, Sickle Cell, Blood Group — 25% weight' },
        { icon: Shield,   label: 'Fertility Potential',     desc: 'AMH, FSH, Semen Parameters — 25% weight' },
        { icon: AlertCircle, label: 'Chronic Health Match',    desc: 'Diabetes, BP, Liver & Kidney — 20% weight' },
        { icon: Activity, label: 'Infection Status',        desc: 'HIV, Hepatitis B/C, STDs — 10% weight' },
        { icon: Shield,   label: 'Mental & Metabolic',      desc: 'Thyroid, Vitamins, Stress — 10% weight' },
        { icon: UsersIcon, label: 'Lifestyle & Habits',      desc: 'Diet, Sleep, Activity, History — 10% weight' },
    ];

    return (
        <div className="flex flex-col text-[#111112]">
            {/* ── SECTION 1: Community Risks Selector ── */}
            <div className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#FBFBFD] to-[#F3F1EC]/50">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#18CB96]/5 rounded-full blur-[100px] pointer-events-none" />
                <section className="max-w-7xl mx-auto px-4 md:px-8 relative z-10" aria-label="Regional Risk Analysis">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="grid lg:grid-cols-12 gap-6 items-start"
                    >
                        
                        {/* Control Panel Bento Cell */}
                        <div className="lg:col-span-5 border border-black/10 p-8 bg-white/80 backdrop-blur-sm flex flex-col justify-between min-h-[420px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="space-y-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 bg-[#DE457D]/5 text-[#DE457D] font-mono text-[9px] uppercase tracking-widest font-bold">
                                    COMMUNITY HEALTH INSIGHTS
                                </span>
                                <h3 className="font-sans text-3xl md:text-clamp-title font-black uppercase tracking-tighter leading-none text-[#111112]">
                                    REGIONAL RISK MAPS
                                </h3>
                                <p className="text-[11px] font-mono uppercase tracking-wider text-[#5A5A60] leading-relaxed">
                                    Endogamous lineage pools concentrate autosomal recessive variants. Select your population base to query regional health advisories.
                                </p>
                            </div>
                            
                            <div className="space-y-3 mt-8">
                                <label htmlFor="com-select-bento" className="text-[9px] font-mono uppercase tracking-widest block text-[#5A5A60]">Select Population Pool</label>
                                <div className="relative group">
                                    <select 
                                        id="com-select-bento" 
                                        value={selectedCommunity} 
                                        onChange={(e) => setSelectedCommunity(e.target.value as CommunityKey)}
                                        className="w-full px-5 py-4 border border-black/15 bg-white text-xs font-mono font-semibold uppercase tracking-wider rounded-none cursor-pointer appearance-none outline-none focus:border-[#18CB96] transition-colors group-hover:border-black/30 shadow-sm"
                                    >
                                        {Object.keys(communityRisks).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A60] transition-transform group-hover:text-black group-hover:translate-y-[-40%]" />
                                </div>
                            </div>
                        </div>

                        {/* Interactive Data Bento Cell */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {Object.entries(communityRisks).map(([key, data]) => {
                                    if (key !== selectedCommunity) return null;
                                    return (
                                        <motion.div 
                                            key={key} 
                                            initial={{ opacity: 0, x: 20 }} 
                                            animate={{ opacity: 1, x: 0 }} 
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }} 
                                            className="border border-[#18CB96]/20 p-8 bg-white min-h-[420px] flex flex-col justify-between shadow-[0_8px_30px_rgba(24,203,150,0.06)]"
                                        >
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between pb-4 border-b border-black/10">
                                                    <div>
                                                        <span className="text-[9px] font-mono uppercase tracking-widest block text-[#5A5A60]">COMMUNITY</span>
                                                        <h4 className="text-base font-sans font-black uppercase mt-1 tracking-tight text-[#111112]">{key}</h4>
                                                    </div>
                                                    <div className="w-10 h-10 border border-[#DE457D]/20 bg-[#DE457D]/5 flex items-center justify-center">
                                                        <Dna className="w-5 h-5 text-[#DE457D]" />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <span className="text-[10px] font-mono uppercase tracking-widest block text-[#5A5A60]">KEY HEALTH RISKS</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.risks.map((r, idx) => (
                                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#DE457D]/20 bg-[#DE457D]/5 text-[10px] font-mono uppercase tracking-wider text-[#DE457D] font-medium">
                                                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {r}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="border-l-2 border-[#18CB96] bg-[#18CB96]/5 p-4">
                                                    <span className="text-[9px] font-mono uppercase tracking-widest flex items-center gap-1 text-[#18CB96] font-bold">
                                                        <Info className="w-3.5 h-3.5" /> WHY THIS MATTERS
                                                    </span>
                                                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#3E3E42] mt-1 leading-relaxed">{data.why}</p>
                                                </div>

                                                <div className="space-y-3">
                                                    <span className="text-[10px] font-mono uppercase tracking-widest block text-[#5A5A60]">RECOMMENDED TESTS</span>
                                                    <div className="grid sm:grid-cols-2 gap-2">
                                                        {data.tests.map((t, idx) => (
                                                            <div className="p-3 border border-black/10 bg-[#FBFBFD] flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#111112]" key={idx}>
                                                                <Check className="w-4 h-4 flex-shrink-0 text-slayy-green stroke-[2.5]" /> {t}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#5A5A60] mt-6 pt-4 border-t border-black/10">* CLINICAL REFERENCE // {data.note}</p>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* ── SECTION 2: Diagnostic Pillars (DARK MODE) ── */}
            <div className="relative py-20 md:py-28 bg-[#111112] text-white overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[#DE457D]/10 rounded-full blur-[120px] pointer-events-none" />
                <section className="max-w-7xl mx-auto px-4 md:px-8 relative z-10" aria-label="Diagnostic Pillars">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16 space-y-4"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 font-mono text-[9px] uppercase tracking-widest text-white font-semibold">
                            WHAT WE SCREEN
                        </span>
                        <h3 className="font-sans text-3xl md:text-clamp-title font-black uppercase tracking-tighter leading-none text-white">
                            6 HEALTH PILLARS
                        </h3>
                        <p className="text-xs font-mono uppercase tracking-wider text-white/60 max-w-xl mx-auto mt-4">
                            Comprehensive path mapping targeting clinical compatibility vectors across every biological marker.
                        </p>
                    </motion.div>
                    
                    {/* 6-Column Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PILLARS.map((p, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="border border-white/10 p-8 bg-[#1A1A1C]/80 backdrop-blur-sm flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1A1A1C] hover:border-[#18CB96]/50 hover:shadow-[0_10px_30px_rgba(24,203,150,0.1)] group"
                            >
                                <div>
                                    <div className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#18CB96]/10 group-hover:border-[#18CB96]/30">
                                        <p.icon className="w-5 h-5 text-white transition-colors duration-300 group-hover:text-[#18CB96]" />
                                    </div>
                                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest mb-3 text-white transition-colors duration-300 group-hover:text-[#18CB96]">0{i+1} // {p.label}</h4>
                                    <p className="text-[11px] font-mono uppercase tracking-wider leading-relaxed text-white/60">{p.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ── SECTION 3: Sample Report Preview ── */}
            <div className="relative py-20 md:py-28 bg-[#F3F1EC] overflow-hidden">
                {/* Subtle pattern background for contrast */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#111112 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <section className="max-w-7xl mx-auto px-4 md:px-8 relative z-10" aria-label="Sample Report Preview">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16 space-y-4"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 bg-white font-mono text-[9px] uppercase tracking-widest text-[#111112] font-semibold">
                            SAMPLE REPORT
                        </span>
                        <h3 className="font-sans text-3xl md:text-clamp-title font-black uppercase tracking-tighter leading-none text-[#111112]">
                            SEE YOUR RESULTS
                        </h3>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid lg:grid-cols-12 gap-6 items-start max-w-5xl mx-auto"
                    >
                        {/* Left Directory Tabs */}
                        <div className="lg:col-span-5 border border-black/10 p-6 bg-white shadow-xl shadow-black/[0.02] space-y-2">
                            <span className="text-[9px] font-mono uppercase tracking-widest block mb-4 text-[#5A5A60]">REPORT CATEGORIES</span>
                            {sampleReport.categories.map((cat, i) => {
                                const isSelected = reportTab === cat.id;
                                return (
                                    <button 
                                        key={cat.id} 
                                        onClick={() => setReportTab(cat.id as typeof reportTab)}
                                        className={`w-full text-left p-4 transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                                            isSelected ? 'border-black bg-[#111112] text-white shadow-md' : 'border-transparent bg-[#FBFBFD] hover:border-black/10 text-[#111112]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] font-mono font-semibold transition-colors" style={{ color: isSelected ? '#18CB96' : '#5A5A60' }}>[ {cat.score}/{cat.maxScore} ]</div>
                                            <span className={`text-[10px] font-mono uppercase tracking-widest font-medium transition-colors ${isSelected ? 'text-white' : 'text-[#111112]'}`}>{cat.title}</span>
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-[#18CB96]' : 'text-[#5A5A60]'}`} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Interactive details bento */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {sampleReport.categories.map((cat) => {
                                    if (cat.id !== reportTab) return null;
                                    return (
                                        <motion.div 
                                            key={cat.id} 
                                            initial={{ opacity: 0, x: 20, scale: 0.98 }} 
                                            animate={{ opacity: 1, x: 0, scale: 1 }} 
                                            exit={{ opacity: 0, x: -20, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }} 
                                            className="border border-black/10 p-8 bg-white shadow-xl shadow-black/[0.04] space-y-6 min-h-[350px] relative overflow-hidden"
                                        >
                                            {/* Decorative accent top line */}
                                            <div className={`absolute top-0 left-0 w-full h-1 ${cat.status === 'Good' || cat.status === 'Excellent' ? 'bg-[#18CB96]' : 'bg-[#FFB800]'}`} />

                                            <div className="flex items-center justify-between pb-4 border-b border-black/10">
                                                <div>
                                                    <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-[#111112]">{cat.title}</h4>
                                                    <span className="text-[8px] font-mono uppercase tracking-widest mt-1 block text-[#5A5A60]">COMPATIBILITY ASSESSMENT</span>
                                                </div>
                                                <span className={`text-[10px] font-mono uppercase px-3 py-1.5 border font-bold ${
                                                    cat.status === 'Good' || cat.status === 'Excellent' ? 'border-slayy-green text-slayy-green bg-slayy-green/10' : 'border-[#FFB800] text-[#FFB800] bg-[#FFB800]/10'}`}> {cat.status}</span>
                                            </div>

                                            <p className="text-[11px] font-mono uppercase tracking-wider leading-relaxed p-5 border-l-2 border-[#111112] bg-[#FBFBFD] text-[#3E3E42]">"{cat.summary}"</p>

                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {cat.details.map((d, idx) => (
                                                    <div key={idx} className="p-4 border border-black/5 bg-[#F3F1EC] flex items-center justify-between text-[11px] font-mono transition-colors hover:bg-[#111112] hover:text-white group">
                                                        <div>
                                                            <span className="block text-[8px] uppercase text-[#5A5A60] group-hover:text-white/60 transition-colors">{d.label}</span>
                                                            <span className="block font-bold mt-1 text-[#111112] group-hover:text-white transition-colors">{d.value}</span>
                                                        </div>
                                                        {d.status === 'good' ? <Check className="w-4 h-4 text-slayy-green stroke-[3] group-hover:text-[#18CB96]" /> : <AlertCircle className="w-4 h-4 text-[#FFB800]" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default InteractiveBentoSections;
