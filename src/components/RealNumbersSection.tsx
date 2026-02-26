import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Lock, Activity, Users, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Card data matching the stories from HomePage
const cardData = [
    {
        id: 1,
        emoji: '💸',
        category: 'FINANCIAL SHOCK',
        categoryColor: 'bg-red-100 text-red-600',
        borderColor: 'border-l-red-500',
        quote: '"We spent our entire savings trying to have a baby. Now we can\'t afford the flat we wanted."',
        stat: '₹8-15L',
        statColor: 'text-teal-600',
        statDescription: 'Average cost when couples discover fertility issues after marriage. Multiple IVF cycles. No insurance coverage. Years of trying.',
        consequenceTitle: 'WHAT THIS ACTUALLY MEANS',
        consequence: 'One IVF cycle = ₹1.5-3 Lakh. Success rate? 30-40%. Most couples need 2-4 cycles. Add medications (₹50K), tests (₹30K), travel, leave from work. And that\'s before the emotional cost.',
        insight: 'A pre-marriage health check costs ₹2,000-5,000. It could save you ₹10+ Lakh and years of heartbreak.',
        source: 'IVF Cost Analysis 2025',
        sourceUrl: 'https://www.fertilitydost.com/articles/article-details/ivf-treatment-cost-in-india-updated-prices-for-2025/',
        visual: 'cost-comparison'
    },
    {
        id: 2,
        emoji: '👩',
        category: "WHAT SHE'S NOT TELLING ANYONE",
        categoryColor: 'bg-orange-100 text-orange-600',
        borderColor: 'border-l-orange-500',
        quote: '"My periods are irregular. I\'ve never told anyone. What if I can\'t have children? Will they call off the wedding?"',
        stat: '1 in 5',
        statColor: 'text-coral-500',
        statDescription: 'Indian women have PCOS—the #1 cause of fertility struggles. Most don\'t know until they start trying.',
        consequenceTitle: 'THE SILENT BURDEN SHE CARRIES',
        consequence: 'In Indian families, the woman is blamed first—even when the issue is with him. 56% of women facing infertility develop depression. 88% experience severe stress. Many suffer in silence for years.',
        insight: 'PCOS is manageable when caught early. Knowing before marriage means planning together, not panicking alone.',
        source: 'JAMA Network Open 2024',
        sourceUrl: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825233',
        visual: 'emotional-stats'
    },
    {
        id: 3,
        emoji: '🤫',
        category: "WHAT HE'LL NEVER ADMIT",
        categoryColor: 'bg-yellow-100 text-yellow-700',
        borderColor: 'border-l-yellow-500',
        quote: '"What if the problem is me? I can\'t tell anyone. It would destroy my family\'s reputation."',
        stat: '72%',
        statColor: 'text-coral-500',
        statDescription: 'of men visiting fertility clinics have abnormal sperm parameters. But male infertility is rarely discussed.',
        consequenceTitle: 'THE SHAME HE CARRIES SILENTLY',
        consequence: '30% decline in Indian male sperm quality over 13 years. Lifestyle, stress, pollution—all factors. But in most families, the woman gets tested first. He finds out years later.',
        insight: 'A simple semen analysis takes 15 minutes. Knowing early means he can take action—not live in fear.',
        source: 'PMC Reproductive Biology Study',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6199708/',
        visual: 'decline-chart'
    },
    {
        id: 4,
        emoji: '🧬',
        category: 'THE GUILT THAT LASTS GENERATIONS',
        categoryColor: 'bg-purple-100 text-purple-600',
        borderColor: 'border-l-purple-500',
        quote: '"Both of us were healthy. Nobody told us we were carriers. Now our child needs blood transfusions every month—for life."',
        stat: '₹3-5L',
        statColor: 'text-teal-600',
        statDescription: 'per year. Lifetime cost of managing Thalassemia Major. Monthly transfusions. Constant hospital visits.',
        consequenceTitle: 'THE MATH NOBODY DOES',
        consequence: '4 crore Indians carry the thalassemia gene. Carriers are completely healthy. But if both partners are carriers, there\'s a 25% chance every pregnancy results in a severely affected child.',
        insight: 'A ₹500 blood test can identify if you\'re a carrier. Know before marriage, not after birth.',
        source: 'National Health Mission',
        sourceUrl: 'https://sickle.nhm.gov.in/uploads/guidelines/NHM_Guidelines_on_Hemoglobinopathies_in_India.pdf',
        visual: 'carrier-grid'
    },
    {
        id: 5,
        emoji: '⏱️',
        category: "THE MOMENT YOU CAN'T TAKE BACK",
        categoryColor: 'bg-pink-100 text-pink-600',
        borderColor: 'border-l-pink-500',
        quote: '"We tried for 4 years before anyone told us there was an issue. By then, I was 34. My doctor said we\'d \'left it too late.\'"',
        stat: '2-5 Yrs',
        statColor: 'text-coral-500',
        statDescription: 'Average time couples "try naturally" before seeking help. That\'s 2-5 years of the most fertile window—gone.',
        consequenceTitle: 'WHAT "WAITING" REALLY COSTS',
        consequence: 'Female fertility drops sharply after 32. Male fertility declines too. Every year of delay = lower success rates, more expensive treatments, harder decisions.',
        insight: 'Knowing your baseline before marriage means you control the timeline—not the other way around.',
        source: 'ICMR Fertility Research',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11558918/',
        visual: 'timeline'
    },
    {
        id: 6,
        emoji: '📋',
        category: 'THE CHECKLIST',
        categoryColor: 'bg-slate-100 text-slate-700',
        borderColor: 'border-l-slate-500',
        quote: '"We planned every detail of the wedding. The one thing we forgot?"',
        stat: '₹10-50L',
        statColor: 'text-teal-600',
        statDescription: 'Potential lifetime healthcare costs that could be prevented with early detection.',
        consequenceTitle: 'THE ULTIMATE IRONY',
        consequence: 'Wedding venue ✓ Catering ✓ Photography ✓ Honeymoon ✓ Guest list ✓ Health check ❓',
        insight: '15 minutes. That\'s all it takes to add the most important item to your checklist.',
        source: 'Your Future Together',
        sourceUrl: '',
        visual: 'checklist'
    }
];

// Visual component for each card type
const CardVisual: React.FC<{ type: string; isActive: boolean }> = ({ type, isActive }) => {
    if (!isActive) return null;

    switch (type) {
        case 'cost-comparison':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="space-y-4"
                >
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <p className="text-xs uppercase tracking-wider text-green-600 mb-2 flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> CHECK NOW
                        </p>
                        <p className="text-4xl font-bold text-green-600">₹2,999</p>
                        <p className="text-slate-500 text-sm mt-2">Complete health check</p>
                    </div>
                    <p className="text-center text-slate-400 font-medium">vs</p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-xs uppercase tracking-wider text-red-500 mb-2">✗ FIX LATER</p>
                        <p className="text-4xl font-bold text-red-500">₹8-15L</p>
                        <p className="text-slate-500 text-sm mt-2">IVF + treatments</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                        <p className="text-sm">That's <strong className="text-red-500">50x more</strong> than catching it early</p>
                    </div>
                </motion.div>
            );

        case 'emotional-stats':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="space-y-4"
                >
                    <p className="text-center font-script text-lg mb-4">What infertility does to women</p>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Depression</span><span className="font-semibold">56%</span></div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '56%' }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="h-full bg-blue-500 rounded-full"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Severe Stress</span><span className="font-semibold">88%</span></div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '88%' }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="h-full bg-red-500 rounded-full"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span>Anxiety</span><span className="font-semibold">76%</span></div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '76%' }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="h-full bg-yellow-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center mt-4">
                        <p className="text-sm">⚠️ Anxiety levels match <strong>cancer patients</strong></p>
                    </div>
                </motion.div>
            );

        case 'decline-chart':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="space-y-4"
                >
                    <p className="text-center font-script text-lg mb-4">Male Sperm Quality Decline</p>
                    <div className="flex justify-center items-end gap-8 h-40">
                        <div className="text-center">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 120 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="w-16 bg-blue-500 rounded-t-lg"
                            />
                            <p className="mt-2 text-sm font-medium">2005</p>
                        </div>
                        <div className="text-center">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 84 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="w-16 bg-red-500 rounded-t-lg"
                            />
                            <p className="mt-2 text-sm font-medium">2018</p>
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-500">↓ 30%</p>
                        <p className="text-sm text-slate-600">Decline in just 13 years</p>
                    </div>
                </motion.div>
            );

        case 'carrier-grid':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="space-y-4"
                >
                    <p className="text-center font-script text-lg mb-4">In a room of 25 Indians...</p>
                    <div className="grid grid-cols-5 gap-2">
                        {[...Array(25)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.02 }}
                                className={`w-10 h-10 rounded-full ${i === 12 ? 'bg-red-200 animate-pulse' : 'bg-slate-100'} flex items-center justify-center`}
                            >
                                <Users className={`w-5 h-5 ${i === 12 ? 'text-red-500' : 'text-slate-400'}`} />
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-100 rounded-full"></span> Healthy</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-200 rounded-full"></span> Silent carrier</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-500">25% Risk</p>
                        <p className="text-sm text-slate-600">If both are carriers → affected child</p>
                    </div>
                </motion.div>
            );

        case 'timeline':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="space-y-4"
                >
                    <p className="text-center font-script text-lg mb-4">The clock nobody talks about</p>
                    <div className="space-y-3">
                        {[
                            { age: '25-30 years', color: 'bg-green-500', desc: 'Peak fertility window. Best time to know your baseline.' },
                            { age: '32-35 years', color: 'bg-yellow-500', desc: 'Fertility starts declining. Options narrow.' },
                            { age: '35-38 years', color: 'bg-orange-500', desc: 'IVF success drops 30%. Costs increase.' },
                            { age: '40+ years', color: 'bg-red-500', desc: 'Limited options. High-risk pregnancies.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <span className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`}></span>
                                <div>
                                    <strong className="text-sm">{item.age}</strong>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            );

        case 'checklist':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="space-y-4 bg-slate-900 text-white p-6 rounded-xl"
                >
                    <p className="text-center font-script text-lg mb-4">Your Wedding Checklist</p>
                    <div className="space-y-2">
                        {['Wedding venue', 'Catering', 'Photography', 'Honeymoon', 'Guest list'].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <Check className="w-4 h-4 text-green-400" />
                                <span className="text-slate-300">{item}</span>
                            </motion.div>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center gap-2 animate-pulse"
                        >
                            <span className="text-red-400 text-lg">❓</span>
                            <span className="text-red-400 font-bold">Health check</span>
                        </motion.div>
                    </div>
                </motion.div>
            );

        default:
            return null;
    }
};

const RealNumbersSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const [currentCard, setCurrentCard] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // GSAP ScrollTrigger for desktop
    useEffect(() => {
        if (isMobile || !wrapperRef.current || !sectionRef.current) return;

        const numCards = cardData.length;

        const ctx = gsap.context(() => {
            // Pin the section
            ScrollTrigger.create({
                trigger: wrapperRef.current,
                start: 'top top',
                end: `+=${window.innerHeight * numCards}`,
                pin: sectionRef.current,
                pinSpacing: true,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const cardIndex = Math.min(Math.floor(progress * numCards), numCards - 1);
                    setCurrentCard(cardIndex);
                    setIsSticky(self.isActive);
                },
                onLeave: () => setIsSticky(false),
                onEnterBack: () => setIsSticky(true),
            });
        });

        return () => ctx.revert();
    }, [isMobile]);

    // Mobile scroll tracking
    useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            if (!cardsContainerRef.current) return;
            const cards = cardsContainerRef.current.querySelectorAll('.mobile-card');
            const viewportCenter = window.innerHeight / 2;

            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                if (rect.top < viewportCenter && rect.bottom > viewportCenter) {
                    setCurrentCard(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    return (
        <>
            {/* Scroll height container for desktop */}
            <div ref={wrapperRef} style={{ height: isMobile ? 'auto' : `${100 * cardData.length}vh` }}>
                <section
                    ref={sectionRef}
                    className={`w-full ${isMobile ? 'py-8' : 'h-screen'}`}
                    style={{ background: 'linear-gradient(135deg, #EBF5F3 0%, #FFFFFF 50%, #FBFFED 100%)' }}
                >
                    {/* Sticky Header */}
                    <div className={`${isMobile ? '' : 'sticky top-0'} z-20 pt-6 pb-4 px-4`}
                        style={{ background: 'linear-gradient(to bottom, rgba(235, 245, 243, 1) 0%, rgba(235, 245, 243, 0.95) 80%, rgba(235, 245, 243, 0) 100%)' }}
                    >
                        <div className="text-center max-w-4xl mx-auto">
                            {/* Pre-heading */}
                            <h3 className="flex items-center justify-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span className='font-script text-lg text-slate-700'>
                                    Before you say <span className="underline decoration-wavy decoration-amber-400 underline-offset-4">"I Do!"</span>
                                </span>
                                <Sparkles className="w-4 h-4 text-amber-500" />
                            </h3>

                            {/* Main Heading */}
                            <h1 className="font-script text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
                                <span className="organic-highlight-lavender">The Real Numbers</span>
                                <span className="text-slate-800"> : Know Before Your Wedding</span>
                            </h1>

                            {/* Subheading */}
                            <p className="text-base md:text-lg text-slate-600 font-script max-w-2xl mx-auto">
                                These are not statistics, these are stories that happen every day to couples who thought{' '}
                                <span className="pill-badge-pink">"it won't happen to us"</span>
                            </p>
                        </div>
                    </div>

                    {/* Cards Container */}
                    <div ref={cardsContainerRef} className="container mx-auto px-4 py-4">
                        {/* Desktop: Stacking Cards */}
                        {!isMobile && (
                            <div className="relative max-w-6xl mx-auto" style={{ minHeight: '60vh' }}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentCard}
                                        initial={{ opacity: 0, y: 50, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -30, scale: 0.98 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                        className="grid lg:grid-cols-2 gap-8 items-start"
                                    >
                                        {/* Card Content - Left Side */}
                                        <div
                                            className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 border-l-4 ${cardData[currentCard].borderColor}`}
                                            style={{
                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -6px rgba(0, 0, 0, 0.1)'
                                            }}
                                        >
                                            {/* Category Badge */}
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${cardData[currentCard].categoryColor} mb-4`}
                                            >
                                                <span>{cardData[currentCard].emoji}</span>
                                                {cardData[currentCard].category}
                                            </motion.span>

                                            {/* Quote */}
                                            <motion.blockquote
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="font-script text-2xl md:text-3xl text-slate-800 leading-relaxed mb-6 italic"
                                            >
                                                {cardData[currentCard].quote}
                                            </motion.blockquote>

                                            {/* Big Stat */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="flex items-baseline gap-4 mb-6"
                                            >
                                                <span className={`text-5xl md:text-6xl font-bold ${cardData[currentCard].statColor}`}>
                                                    {cardData[currentCard].stat}
                                                </span>
                                                <p className="text-slate-600 text-sm md:text-base max-w-xs">
                                                    {cardData[currentCard].statDescription}
                                                </p>
                                            </motion.div>

                                            {/* Consequence Box */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-lg mb-4"
                                            >
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                                    {cardData[currentCard].consequenceTitle}
                                                </h4>
                                                <p className="text-slate-700 text-sm leading-relaxed">
                                                    {cardData[currentCard].consequence}
                                                </p>
                                            </motion.div>

                                            {/* Insight Box */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3"
                                            >
                                                <span className="text-xl">💡</span>
                                                <p className="text-slate-700 text-sm">{cardData[currentCard].insight}</p>
                                            </motion.div>

                                            {/* Source */}
                                            {cardData[currentCard].sourceUrl && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="text-xs text-slate-400 mt-4"
                                                >
                                                    <a
                                                        href={cardData[currentCard].sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-slate-600 hover:underline transition-colors"
                                                    >
                                                        Source: {cardData[currentCard].source} →
                                                    </a>
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Visual - Right Side */}
                                        <div className="hidden lg:flex items-center justify-center">
                                            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                                                <CardVisual type={cardData[currentCard].visual} isActive={true} />
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Pagination Dots */}
                                <div className="flex justify-center gap-2 mt-8">
                                    {cardData.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                // Scroll to the appropriate position
                                                if (wrapperRef.current) {
                                                    const scrollTarget = wrapperRef.current.offsetTop + (index * window.innerHeight);
                                                    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                                                }
                                            }}
                                            className={`h-2.5 rounded-full transition-all duration-300 ${currentCard === index
                                                ? 'bg-slate-800 w-8'
                                                : 'bg-slate-300 w-2.5 hover:bg-slate-400'
                                                }`}
                                            aria-label={`Go to card ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mobile: Vertical Scroll */}
                        {isMobile && (
                            <div className="space-y-8">
                                {cardData.map((card, index) => (
                                    <motion.div
                                        key={card.id}
                                        className={`mobile-card bg-white rounded-2xl shadow-lg p-5 border-l-4 ${card.borderColor}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {/* Category Badge */}
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${card.categoryColor} mb-3`}>
                                            <span>{card.emoji}</span>
                                            {card.category}
                                        </span>

                                        {/* Quote */}
                                        <blockquote className="font-script text-xl text-slate-800 leading-relaxed mb-4 italic">
                                            {card.quote}
                                        </blockquote>

                                        {/* Big Stat */}
                                        <div className="flex items-baseline gap-3 mb-4">
                                            <span className={`text-4xl font-bold ${card.statColor}`}>{card.stat}</span>
                                            <p className="text-slate-600 text-sm">{card.statDescription}</p>
                                        </div>

                                        {/* Visual */}
                                        <div className="mb-4">
                                            <CardVisual type={card.visual} isActive={currentCard === index} />
                                        </div>

                                        {/* Consequence Box */}
                                        <div className="bg-slate-50 border-l-4 border-slate-400 p-3 rounded-r-lg mb-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                {card.consequenceTitle}
                                            </h4>
                                            <p className="text-slate-700 text-sm leading-relaxed">{card.consequence}</p>
                                        </div>

                                        {/* Insight Box */}
                                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
                                            <span className="text-lg">💡</span>
                                            <p className="text-slate-700 text-sm">{card.insight}</p>
                                        </div>

                                        {/* Source */}
                                        {card.sourceUrl && (
                                            <a
                                                href={card.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-slate-400 mt-3 block hover:text-slate-600 hover:underline transition-colors"
                                            >
                                                Source: {card.source} →
                                            </a>
                                        )}
                                    </motion.div>
                                ))}

                                {/* Mobile Pagination Indicator */}
                                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                                    <div className="flex gap-1.5">
                                        {cardData.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${currentCard === index
                                                    ? 'bg-slate-800 w-4'
                                                    : 'bg-slate-300 w-1.5'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* CTA Section - Appears after cards */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="font-script text-3xl md:text-4xl lg:text-5xl mb-4 leading-relaxed">
                        You can't change the statistics.<br />
                        <span className="text-slate-300">But you can choose not to become one.</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">
                        A 15-minute conversation. A simple health check. <strong className="text-amber-400">Starting at ₹799.</strong><br />
                        That's all it takes to start your marriage with clarity, not uncertainty.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-lg"
                    >
                        Talk to an Advisor <ArrowRight className="w-5 h-5" />
                    </Link>
                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
                        <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> 100% Private</span>
                        <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Doctor Reviewed</span>
                        <span className="flex items-center gap-2"><Users className="w-4 h-4" /> For Both Partners</span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RealNumbersSection;
