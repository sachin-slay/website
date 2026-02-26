import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Lock, Heart, Brain, Coins, Users, Activity, Dna, Baby, SparklesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/TestimonialCard';
import { PricingCard } from '@/components/PricingCard';
import { PersonaSection } from '@/components/PersonaCard';
import { TrustSignals, QuickTrustBadges } from '@/components/TrustSignals';
import { StoryTabs } from '@/components/StoryCard';
import {
    InfertilityVisual, InfertilityBoxes, InfertilityCost,
    STDVisual, STDBoxes, STDCost,
    ChronicVisual, ChronicBoxes, ChronicCost,
    GeneticVisual, GeneticBoxes, GeneticCost,
} from '@/components/StoryVisuals';
import { testimonials } from '@/data/testimonials';
import { pricingPlans } from '@/data/pricingPlans';
import { personas } from '@/data/personas';

const HomePage = () => {
    // Animated text state
    const healthTopics = ['Family Planning', 'Family Health', 'Chronic Disease', 'Lifestyle', 'Mental Health'];
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTopicIndex((prevIndex) => (prevIndex + 1) % healthTopics.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const stories = [
        {
            id: 1,
            emoji: '💊',
            category: 'INFERTILITY',
            categoryColor: 'bg-red-100 text-red-600',
            tabDescription: '₹8-15L average cost after marriage',
            quote: '"We spent our entire savings on IVF. Three failed cycles. Nobody warned us that a simple check before marriage could have changed everything."',
            attribution: '— Couple, married 3 years, Bangalore',
            stat: '1 in 4',
            statDescription: 'face fertility challenges in India. Most discover it only after 2-5 years of trying.',
            visual: <InfertilityVisual />,
            boxes: <InfertilityBoxes />,
            costComparison: <InfertilityCost />,
            insight: 'PCOS is manageable when caught early. A basic semen analysis takes 15 minutes. Knowing before marriage means planning together — not panicking alone.',
            source: 'JAMA Network Open 2024 · PMC Reproductive Biology Study · ICMR',
        },
        {
            id: 2,
            emoji: '🛡️',
            category: 'STDs & STIs',
            categoryColor: 'bg-orange-100 text-orange-600',
            tabDescription: "Most carriers don't know they're infected",
            quote: '"He seemed perfectly healthy. Six months after our wedding, I tested positive for Hepatitis B. He was a carrier and never knew."',
            attribution: '— Woman, 28, Delhi',
            stat: '80%',
            statDescription: 'of STI carriers show zero symptoms. You cannot tell by looking. You cannot tell by asking.',
            visual: <STDVisual />,
            boxes: <STDBoxes />,
            costComparison: <STDCost />,
            insight: "A simple blood test can detect Hepatitis B, HIV, and syphilis. HPV screening is available. These are not moral judgments — they're medical facts that protect both partners.",
            source: 'WHO 2023 · NACO India · CDC STI Surveillance',
        },
        {
            id: 3,
            emoji: '💊',
            category: 'CHRONIC DISEASE',
            categoryColor: 'bg-blue-100 text-blue-600',
            tabDescription: 'Hidden conditions that surface after marriage',
            quote: '"Nobody in his family mentioned his father\'s diabetes and heart condition. Three years in, he was diagnosed with both. Now our entire life revolves around managing it."',
            attribution: '— Woman, 32, Mumbai',
            stat: '1 in 3',
            statDescription: "will develop a chronic disease before age 40. Family history doubles your risk — but most families don't disclose.",
            visual: <ChronicVisual />,
            boxes: <ChronicBoxes />,
            costComparison: <ChronicCost />,
            insight: "Chronic diseases are manageable — but only when you know about them. A pre-marriage health check gives you a baseline, not a verdict. It's the difference between planning and panic.",
            source: 'ICMR 2023 · Lancet India · WHO NCD Report',
        },
        {
            id: 4,
            emoji: '🧬',
            category: 'GENETIC DISORDERS',
            categoryColor: 'bg-green-100 text-green-700',
            tabDescription: 'Both healthy parents. Affected child.',
            quote: '"Both of us were perfectly healthy. Nobody told us we were carriers. Now our child needs blood transfusions every month — for life."',
            attribution: '— Couple, married 5 years, Gujarat',
            stat: '4 Crore',
            statDescription: "Indians silently carry the Thalassemia gene. Carriers are completely healthy — but if both partners carry it, every pregnancy has a 25% risk.",
            visual: <GeneticVisual />,
            boxes: <GeneticBoxes />,
            costComparison: <GeneticCost />,
            insight: "A ₹500 blood test can identify if you're a carrier. Know before marriage, not after birth. This isn't about blame — it's about giving your future children the best chance.",
            source: 'National Health Mission · Indian Thalassemia Society',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
                {/* MOBILE BACKGROUND - Bento grid behind text */}
                <div className="absolute inset-0 lg:hidden">
                    <div className="grid grid-cols-3 grid-rows-4 gap-1 w-full h-full">
                        {/* Large - spans 2 cols, 2 rows */}
                        <div className="col-span-2 row-span-2 overflow-hidden">
                            <img src="/images/hs-1.png" alt="" className="w-full h-full object-cover" loading="eager" />
                        </div>
                        {/* Tall right - spans 1 col, 2 rows */}
                        <div className="col-span-1 row-span-2 overflow-hidden">
                            <img src="/images/hs-2.png" alt="" className="w-full h-full object-cover" loading="eager" />
                        </div>
                        {/* Bottom left */}
                        <div className="col-span-1 row-span-1 overflow-hidden">
                            <img src="/images/hs-4.png" alt="" className="w-full h-full object-cover" loading="eager" />
                        </div>
                        {/* Bottom wide - spans 2 cols */}
                        <div className="col-span-2 row-span-1 overflow-hidden">
                            <img src="/images/hero-image4.png" alt="" className="w-full h-full object-cover" loading="eager" />
                        </div>
                        {/* Extra row for full coverage */}
                        <div className="col-span-2 row-span-1 overflow-hidden">
                            <img src="/images/hs-3.png" alt="" className="w-full h-full object-cover" loading="eager" />
                        </div>
                        <div className="col-span-1 row-span-1 overflow-hidden">
                            <img src="/images/hs-5.png" alt="" className="w-full h-full object-cover" loading="eager" />
                        </div>
                    </div>
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Desktop subtle overlay */}
                <div className="absolute inset-0 opacity-20 hidden lg:block" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8) 0%, transparent 70%)' }}></div>
                <div className="container mx-auto px-4 relative z-10 py-8 lg:py-0">
                    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-center">
                        {/* LEFT SIDE - BENTO GRID (desktop only) */}
                        <div className="relative animate-on-scroll hidden lg:block lg:order-1 w-full">
                            {/* Bento Grid - 4x4 on desktop */}
                            <div className="grid lg:grid-cols-4 lg:grid-rows-4 gap-2 w-full">
                                {/* Image 1 */}
                                <div className="lg:col-span-2 lg:row-span-2 rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hs-1.png"
                                        alt="Couple health consultation"
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                                {/* Image 2 */}
                                <div className="lg:col-span-2 lg:row-span-1 rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hs-2.png"
                                        alt="Health screening services"
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                                {/* Image 3 */}
                                <div className="rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hs-4.png"
                                        alt="Medical professional consultation"
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                                {/* Image 4 */}
                                <div className="lg:row-span-2 rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hero-image4.png"
                                        alt="Health checkup services"
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                                {/* Image 5 */}
                                <div className="lg:col-span-2 lg:row-span-1 rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hs-3.png"
                                        alt="Wellness consultation"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                                {/* Image 6 */}
                                <div className="lg:col-span-1 lg:row-span-1 rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hs-5.png"
                                        alt="Preventive healthcare"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                                {/* Image 7 */}
                                <div className="lg:col-span-2 lg:row-span-1 rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hs-6.png"
                                        alt="Healthcare professionals"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                                {/* Image 8 */}
                                <div className="lg:col-span-2 lg:row-span-1 rounded-xl overflow-hidden shadow transition-transform duration-500 ease-in-out transform hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: "forwards" }}>
                                    <img
                                        src="/images/hs-7.png"
                                        alt="Health assessments"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                        style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - HERO CONTENT (on mobile: overlays images) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:order-2 text-left"
                        >
                            <motion.h3 className="flex items-center justify-start gap-3 mb-5 lg:mb-6 text-white/70 lg:text-slate-500">
                                <SparklesIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                                <span className='font-script text-xl md:text-2xl lg:text-3xl'> Your Future Is <span className="underline">Everything!</span></span>
                                <SparklesIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                            </motion.h3>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-script tracking-tight text-white lg:text-slate-900 mb-6 lg:mb-8 leading-tight"
                            >
                                For those who believe
                                <br />
                                <span className="organic-highlight-pink">
                                    <motion.span
                                        key={currentTopicIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5 }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        {healthTopics[currentTopicIndex]}
                                    </motion.span>
                                </span>
                                <br />
                                that matter for your{' '}
                                <span className="curly-scribble-underline">life together</span>
                            </motion.h1>
                            <p className="mb-10 lg:mb-12 animate-fade-in font-script text-lg md:text-xl lg:text-2xl text-white/80 lg:text-slate-600 max-w-lg lg:mx-0" style={{ animationDelay: '0.6s' }}>
                                say <span className="curly-scribble-underline">"YES"</span> with{' '}
                                <span className="organic-highlight-yellow">clarity & confidence,</span> not with fingers crossed
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="flex flex-col items-start gap-6"
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/login" className="bg-[#D4544C] text-white px-8 py-4 rounded-lg font-semibold text-base lg:text-lg shadow-lg hover:bg-[#c24941] transition-all hover:scale-105 flex items-center justify-center gap-2">
                                        Get Started
                                    </Link>
                                    <Link to="/sample-report" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-lg font-semibold text-base lg:text-lg shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                                        See Sample Report
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* Trust Signals */}
                                <QuickTrustBadges />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STORIES SECTION - Normal Scroll with Expandable Cards */}
            <section className="py-20 bg-gradient-to-b from-[#EBF5F3] via-white to-[#FBFFED]">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h3 className="flex items-center justify-center gap-3 mb-6">
                            <SparklesIcon className="w-5 h-5" />
                            <span className='font-script text-xl lg:text-2xl'> Before you say <span className="underline">"I Do!"</span></span>
                            <SparklesIcon className="w-5 h-5" />
                        </h3>
                        <h1 className="font-script text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-6">
                            <span className="organic-highlight-purple">The Real Numbers</span>: Know Before Your Wedding
                        </h1>
                        <p className="mx-auto max-w-2xl font-script text-lg md:text-xl lg:text-2xl">
                            These are not statistics, these are stories that happen every day to couples who thought{' '}
                            <span className="organic-highlight-pink">"it won't happen to us"</span>
                        </p>
                    </div>

                    {/* Story Tabs */}
                    <StoryTabs stories={stories} />
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-12 lg:py-16 bg-slate-950">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        {/* Left - Message */}
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="font-script text-2xl md:text-3xl lg:text-4xl leading-tight mb-3 text-white">
                                You can't change the statistics.
                            </h2>
                            <p className="font-script text-xl md:text-2xl text-slate-400 mb-4">
                                But you can choose not to become one.
                            </p>
                            <p className="text-slate-500 text-sm lg:text-base leading-relaxed max-w-lg lg:mx-0 mx-auto">
                                A 15-minute conversation. A simple health check. That's all it takes to start your marriage with clarity, not uncertainty.
                            </p>
                        </div>
                        {/* Right - CTA Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 text-center min-w-[260px]">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Starting at</p>
                            <p className="text-4xl lg:text-5xl font-bold text-white mb-4">₹799</p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 bg-[#17CB96] text-white px-6 py-3 rounded-full font-bold text-sm lg:text-base hover:bg-[#15b586] transition-all hover:scale-105 shadow-lg w-full justify-center"
                            >
                                Talk to an Advisor <ArrowRight className="w-4 h-4" />
                            </Link>
                            <div className="flex flex-col gap-1.5 mt-4 text-xs text-slate-500">
                                <span className="flex items-center justify-center gap-2"><Lock className="w-3.5 h-3.5" /> 100% Private</span>
                                <span className="flex items-center justify-center gap-2"><Activity className="w-3.5 h-3.5" /> Doctor Reviewed</span>
                                <span className="flex items-center justify-center gap-2"><Users className="w-3.5 h-3.5" /> For Both Partners</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PERSONAS SECTION */}
            <section className="py-16 lg:py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="font-script text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-4">
                            Start where your situation begins.
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-base">
                            Every marriage story is different. The health checks you need shouldn't be guessed.
                        </p>
                    </div>

                    <PersonaSection personas={personas} />
                </div>
            </section>

            {/* EMOTIONAL TRIGGER SECTION (Testimonials) */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Real People, Real Clarity
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.slice(0, 3).map((t) => (
                            <TestimonialCard key={t.id} {...t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ONE SENTENCE POSITIONING */}
            <section className="py-20 bg-primary text-primary-foreground text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
                        The world's first AI-powered premarital health compatibility engine for every couple.
                    </h2>
                    <div className="text-lg md:text-xl opacity-90 space-y-2">
                        <p>What marriage counselors wish existed.</p>
                        <p>What doctors recommend doing.</p>
                        <p>What smart couples actually use.</p>
                    </div>
                </div>
            </section>

            {/* ANALYSIS AREAS */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            6 Critical Areas Most Couples Never Discuss
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Dna className="w-6 h-6 text-purple-500" />,
                                title: "Genetic Compatibility",
                                score: "25%",
                                desc: "Thalassemia, Sickle Cell, Blood Group",
                                detail: "1 in 8 Indians carry thalassemia trait. If both carry, 25% risk for child."
                            },
                            {
                                icon: <Baby className="w-6 h-6 text-pink-500" />,
                                title: "Fertility Potential",
                                score: "25%",
                                desc: "AMH, FSH, Sperm Parameters",
                                detail: "40% of couples face fertility challenges. Know your timeline expectations."
                            },
                            {
                                icon: <Heart className="w-6 h-6 text-red-500" />,
                                title: "Chronic Health Match",
                                score: "20%",
                                desc: "Diabetes, BP, Liver/Kidney",
                                detail: "Pre-diabetes often undetected. Identify manageable conditions now."
                            },
                            {
                                icon: <Activity className="w-6 h-6 text-blue-500" />,
                                title: "Infection Status",
                                score: "10%",
                                desc: "HIV, Hepatitis B/C, STDs",
                                detail: "STDs don't always show symptoms. Ensure complete transparency."
                            },
                            {
                                icon: <Brain className="w-6 h-6 text-orange-500" />,
                                title: "Mental & Metabolic",
                                score: "10%",
                                desc: "Vitamins, Stress Markers",
                                detail: "Deficiencies affect mood & energy. Simple fixes for better health."
                            },
                            {
                                icon: <Users className="w-6 h-6 text-green-500" />,
                                title: "Lifestyle & Habits",
                                score: "10%",
                                desc: "Habits, Family History",
                                detail: "Lifestyle alignment predicts relationship health long-term."
                            }
                        ].map((card, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-primary/10 transition-colors">
                                        {card.icon}
                                    </div>
                                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                                        {card.score} of score
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                                <p className="text-sm text-slate-500 mb-3">{card.desc}</p>
                                <p className="text-sm text-slate-600 border-t pt-3">{card.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Choose What You Need to Know
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                        {pricingPlans.map((plan) => (
                            <PricingCard key={plan.id} plan={plan} />
                        ))}
                    </div>

                    {/* Trust Signals - After Pricing */}
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-center text-2xl font-bold text-slate-900 mb-8">
                            Why Couples Trust Slay Health
                        </h3>
                        <TrustSignals variant="detailed" />
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        Every Day of Delay Is One More Day of Uncertainty
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                        <div className="bg-slate-800 p-6 rounded-xl">
                            <Clock className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                            <div className="text-2xl font-bold mb-2">2 Years</div>
                            <p className="text-slate-400 text-sm">Average time wasted trying to conceive before discovering issues</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl">
                            <Coins className="w-8 h-8 text-green-400 mx-auto mb-4" />
                            <div className="text-2xl font-bold mb-2">₹2.5 Lakhs</div>
                            <p className="text-slate-400 text-sm">Cost of IVF vs ₹15k for early supplements</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl">
                            <Heart className="w-8 h-8 text-red-400 mx-auto mb-4" />
                            <div className="text-2xl font-bold mb-2">Regret</div>
                            <p className="text-slate-400 text-sm">The emotional cost of not knowing earlier</p>
                        </div>
                    </div>

                    <Link to="/login" className="inline-block bg-[#FF8C69] text-white px-10 py-5 rounded-lg font-bold text-xl shadow-lg hover:bg-[#FF7A59] transition-all hover:scale-105 mb-6">
                        Get Your Clarity Now—Takes 5 Minutes
                    </Link>
                    <p className="mt-4 mb-6 text-slate-400 text-sm">
                        Free health assessment to start • No credit card required • Begin privately
                    </p>

                    {/* Trust Signals - Final CTA */}
                    <TrustSignals variant="compact" className="mt-6" />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
