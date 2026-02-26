import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, FileText, Shield, Activity, MessageSquare, ArrowRight, ChevronRight, Lock } from 'lucide-react';
import { ExpandableAccordion } from '@/components/ExpandableAccordion';
import { ModalDialog } from '@/components/ModalDialog';
import { ScoreGauge } from '@/components/ScoreGauge';
import { cn } from '@/lib/utils';

const HowItWorksPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [showLLM, setShowLLM] = useState(false);

    const steps = [
        {
            id: 1,
            title: "Sign Up",
            desc: "Enter phone → OTP → Profile created (30 sec)",
            icon: Lock,
            edgeCases: [
                { q: "OTP doesn't arrive?", a: "Click 'Resend' or 'Try WhatsApp OTP'. Chat support is instant." },
                { q: "I want to use email?", a: "Email login available after phone verification (regulation requirement)." }
            ]
        },
        {
            id: 2,
            title: "Upload Reports",
            desc: "Drag-drop PDFs or photos. AI extracts data.",
            icon: FileText,
            edgeCases: [
                { q: "File too large?", a: "Compress using our built-in tool or upload page-by-page." },
                { q: "Report in Hindi/Regional?", a: "Our OCR supports 8 Indian languages with 94% accuracy." },
                { q: "No reports?", a: "Take our 8-question health quiz to get a test checklist." }
            ]
        },
        {
            id: 3,
            title: "AI Analysis",
            desc: "AI extracts 50+ markers → Validates → Categorizes risks.",
            icon: Activity,
            edgeCases: [
                { q: "AI makes a mistake?", a: "You verify every value. Our team reviews 100% of high-risk reports." },
                { q: "Low confidence?", a: "We ask you to confirm values if AI is unsure (<80% confidence)." }
            ]
        },
        {
            id: 4,
            title: "Invite Partner",
            desc: "Send secure link. You control what they see.",
            icon: Shield,
            edgeCases: [
                { q: "Partner refuses?", a: "You still get your individual report. Share sample report to encourage them." },
                { q: "Privacy concerns?", a: "You decide exactly which sections (Fertility, STD, etc.) to share." }
            ]
        },
        {
            id: 5,
            title: "Scoring",
            desc: "Joint analysis of genetic & health compatibility.",
            icon: Activity,
            edgeCases: [
                { q: "Score mismatch?", a: "Compatibility is a joint analysis. Individual health ≠ Couple compatibility." },
                { q: "Score seems low?", a: "Use 'Explain My Score' to see exactly which markers affected it." }
            ]
        },
        {
            id: 6,
            title: "Receive Report",
            desc: "Clear scores + plain language + action steps.",
            icon: FileText,
            edgeCases: [
                { q: "High-risk finding?", a: "Automatic doctor review. Confidential call within 2 hours." },
                { q: "Conflicting results?", a: "Doctor's assessment takes precedence. We explain discrepancies." }
            ]
        },
        {
            id: 7,
            title: "Take Action",
            desc: "Consultation, retesting, or lifestyle changes.",
            icon: Check,
            edgeCases: [
                { q: "Need second opinion?", a: "Download raw report PDF to share with any doctor." },
                { q: "Scared to share?", a: "Book 1-on-1 counseling first to prepare for the conversation." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* HERO */}
            <section className="bg-white pt-20 pb-16 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Your Complete Journey: From Upload to Clarity
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Here's exactly what happens, including what to do when things don't go perfectly.
                    </p>
                </div>
            </section>

            {/* FLOW SECTION */}
            <section className="py-16 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative pl-12 md:pl-0 mb-12 last:mb-0 group">
                            {/* Connecting Line */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-[22px] top-12 bottom-[-48px] w-0.5 bg-slate-200 md:left-1/2 md:-ml-px group-hover:bg-primary/30 transition-colors" />
                            )}

                            <div className={`flex flex-col md:flex-row items-center md:justify-between ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                                {/* Content Side */}
                                <div className={`w-full md:w-[45%] ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-600 mb-4">{step.desc}</p>

                                    {/* Edge Cases Accordion */}
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm text-left">
                                        <ExpandableAccordion title="⚠️ What if things go wrong?" className="border-0">
                                            <ul className="space-y-3 text-sm">
                                                {step.edgeCases.map((ec, i) => (
                                                    <li key={i}>
                                                        <span className="font-semibold text-slate-800 block mb-1">• {ec.q}</span>
                                                        <span className="text-slate-600">→ {ec.a}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </ExpandableAccordion>
                                    </div>
                                </div>

                                {/* Icon Marker */}
                                <div className="absolute left-0 top-0 md:relative md:top-auto md:left-auto w-12 h-12 rounded-full bg-white border-4 border-primary flex items-center justify-center z-10 shadow-md group-hover:scale-110 transition-transform">
                                    <step.icon className="w-5 h-5 text-primary" />
                                </div>

                                {/* Empty Side for Balance */}
                                <div className="hidden md:block md:w-[45%]" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SCORING TRANSPARENCY */}
            <section className="py-20 bg-white border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Exactly How We Calculate Your Score
                        </h2>
                        <p className="text-slate-600">Transparency builds trust. Click any category to see the math.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        {/* Visual Gauge */}
                        <div className="flex flex-col items-center justify-center bg-slate-50 p-10 rounded-3xl">
                            <ScoreGauge score={87} size={250} strokeWidth={20} label="Compatibility" />
                            <div className="mt-8 text-center">
                                <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full font-bold text-sm mb-2">
                                    🟢 Good Match (80-89)
                                </div>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                    Strong compatibility. Minor issues (Vitamin D, TSH) are easily addressable.
                                </p>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-4">
                            <ExpandableAccordion title="1. GENETIC COMPATIBILITY (23/25)" defaultOpen>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-green-600">
                                        <span>✓ Blood group compatible</span>
                                        <span>+5</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>✓ No Rh incompatibility</span>
                                        <span>+5</span>
                                    </div>
                                    <div className="flex justify-between text-red-500 font-medium">
                                        <span>⚠️ Thalassemia screening incomplete</span>
                                        <span>-2</span>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100">
                                        <p className="font-semibold mb-1">Why -2 points?</p>
                                        <p className="text-slate-500">If both carry trait, 25% risk to child. Simple test (₹500) fixes this.</p>
                                    </div>
                                </div>
                            </ExpandableAccordion>

                            <ExpandableAccordion title="2. FERTILITY ALIGNMENT (19/25)">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-green-600">
                                        <span>✓ AMH 3.2 (Good reserve)</span>
                                        <span>+10</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>✓ Sperm count Normal</span>
                                        <span>+5</span>
                                    </div>
                                    <div className="flex justify-between text-yellow-600 font-medium">
                                        <span>⚠️ Vitamin D deficiency (Both)</span>
                                        <span>-5</span>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100">
                                        <button
                                            onClick={() => setShowLLM(true)}
                                            className="text-primary font-medium hover:underline flex items-center gap-1"
                                        >
                                            <MessageSquare className="w-4 h-4" /> Explain this in simple words
                                        </button>
                                    </div>
                                </div>
                            </ExpandableAccordion>

                            <ExpandableAccordion title="3. CHRONIC HEALTH (21/25)">
                                <p className="text-sm text-slate-500">Analysis of diabetes, hypertension, and organ function markers.</p>
                            </ExpandableAccordion>
                        </div>
                    </div>
                </div>
            </section>

            {/* LLM MODAL */}
            <ModalDialog
                isOpen={showLLM}
                onClose={() => setShowLLM(false)}
                title="Medical Assistant AI"
            >
                <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded-lg rounded-tl-none">
                        <p className="text-sm text-slate-700">
                            Hello! I'll explain your fertility alignment score in plain language.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-900 text-sm mb-2">THE GOOD NEWS:</h4>
                        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                            <li>Her ovaries have a healthy egg supply (AMH 3.2 is great)</li>
                            <li>His sperm count is normal (45M is well above minimum)</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <h4 className="font-bold text-yellow-900 text-sm mb-2">THE FIXABLE ISSUES:</h4>
                        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                            <li>Both have low Vitamin D (very common in India)</li>
                            <li>Low Vitamin D can make conception slightly harder</li>
                        </ul>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-lg">
                        <p className="text-sm font-bold mb-2">BOTTOM LINE:</p>
                        <p className="text-sm text-slate-700">
                            You can definitely have kids naturally. Just take Vitamin D supplements for 2 months to boost your score to 24/25.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50">
                            Ask Follow-up
                        </button>
                        <button className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50">
                            Translate to Hindi
                        </button>
                    </div>
                </div>
            </ModalDialog>
        </div>
    );
};

export default HowItWorksPage;
