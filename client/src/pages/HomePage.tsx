import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Heart, Brain, Shield, Check, Star,
    Mail, Phone, User, Activity, Dna, Baby, Sparkles,
    ChevronRight, AlertTriangle, AlertCircle, Users, Award, ChevronDown, Info, Lock
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';

import { getLandingSchema } from '@/lib/landingSchema';
import { faqs } from '@/lib/faqData';
import { sampleReport } from '@/lib/sampleReport';
import { communityRisks, CommunityKey } from '@/lib/communityRisks';

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ──────────────────────────────────────────────────────────────────
const STATS = [
    { value: '1 in 8', label: 'Indians carry Thalassemia trait', color: '#D4544C', desc: 'Mostly asymptomatic' },
    { value: '40%', label: 'Couples face fertility challenges', color: '#DE457D', desc: 'Treatable if caught early' },
    { value: '80%', label: 'STD carriers show zero symptoms', color: '#FFB800', desc: 'Overlooked in arranged marriage' },
];

const PILLARS = [
    { icon: Dna,      label: 'Genetic Compatibility',  desc: 'Thalassemia, Sickle Cell, Blood Group — 25% weight', color: '#17CB96', glow: 'green' },
    { icon: Baby,     label: 'Fertility Potential',     desc: 'AMH, FSH, Semen Parameters — 25% weight',            color: '#DE457D', glow: 'pink' },
    { icon: Heart,    label: 'Chronic Health Match',    desc: 'Diabetes, BP, Liver & Kidney — 20% weight',           color: '#D4544C', glow: 'red' },
    { icon: Activity, label: 'Infection Status',        desc: 'HIV, Hepatitis B/C, STDs — 10% weight',               color: '#FFB800', glow: 'gold' },
    { icon: Brain,    label: 'Mental & Metabolic',      desc: 'Thyroid, Vitamins, Stress — 10% weight',              color: '#8B5CF6', glow: 'purple' },
    { icon: Users,    label: 'Lifestyle & Habits',      desc: 'Diet, Sleep, Activity, History — 10% weight',         color: '#06B6D4', glow: 'cyan' },
];

const TESTIMONIALS = [
    {
        names: 'Priya & Amit', location: 'Mumbai', type: 'Arranged Marriage',
        quote: 'Traditional arranged marriage. 5 meetings before engagement. We discovered after our son was born that he needs blood transfusions every 3 weeks for life. A ₹1,500 test before marriage could have helped us make an informed choice.',
        highlight: 'We both carried Thalassemia Trait', impact: '₹40,000/month lifelong treatment', color: '#FFB800',
    },
    {
        names: 'Sneha & Rohan', location: 'Bangalore', type: 'Love Marriage',
        quote: 'We thought love was enough. Then we got screened and found my AMH was 0.8 and his sperm count was 12M — both treatable. If we had waited until "trying," we would have wasted 2 years and lakhs on IVF.',
        highlight: 'We dated 3 years but never discussed this', impact: 'Saved 2 years + ₹3–5 lakhs in IVF costs', color: '#DE457D',
    },
    {
        names: 'Kavita S.', location: 'Delhi', type: 'Remarriage',
        quote: 'Divorced at 32. My ex-husband had undiagnosed diabetes that became severe. This time I insisted both of us get screened. We discovered early. I will never go into marriage blind again.',
        highlight: 'My first marriage had hidden health issues', impact: 'Prevented repeated trauma, built trust', color: '#8B5CF6',
    },
    {
        names: 'Mrs. Sharma', location: 'Mother of Bride', type: 'Parent',
        quote: "The boy's family said 'everyone is healthy.' But what does that mean? This screening gave us actual data. Found both had Vitamin D deficiency — easily fixed before the wedding.",
        highlight: 'I wish this existed for my generation', impact: 'Data-driven decision for our family', color: '#17CB96',
    },
];

const PRICING_PLANS = [
    {
        title: 'Individual Health Clarity', price: '₹799', per: '/person', save: null, popular: false,
        desc: 'Understand your individual health markers and baselines.',
        features: ['50+ health markers analysed', 'Fertility readiness score', 'Chronic disease screening', 'Genetic risk assessment', 'Lifestyle recommendations', 'Next steps guide'],
        outcome: 'Sleep better knowing YOUR health status', cta: 'Check My Health', value: 'individual',
    },
    {
        title: 'Complete Compatibility', price: '₹1,499', per: '/couple', save: 'Save ₹600', popular: true,
        desc: 'Complete comparative compatibility assessment for both partners.',
        features: ['Everything in Individual (×2 people)', 'Genetic compatibility analysis', 'Partner matching score', 'Fertility alignment assessment', 'Combined risk report', "Couple's discussion guide"],
        outcome: 'Make your decision with complete clarity', cta: 'Get Compatibility Score', value: 'couple',
    },
    {
        title: 'Expert-Reviewed Confidence', price: '₹2,499', per: '/couple', save: null, popular: false,
        desc: 'Dual screening plus personal consultation with a medical expert.',
        features: ['Everything in Couple plan', 'Doctor reviews your report personally', '30-min video consultation', 'Personalized action plan', 'Retest recommendations', 'Priority 24-hour support'],
        outcome: 'Expert validation + clear action plan', cta: 'Get Doctor Guidance', value: 'expert',
    },
];

const TRUST_METRICS = [
    { icon: Shield, value: '100%', label: 'Private & Encrypted',  color: '#17CB96', from: 0, to: 100, suffix: '%' },
    { icon: Award,  value: 'NABL', label: 'Certified Labs',       color: '#DE457D', from: null, to: null, suffix: '' },
    { icon: Users,  value: '450+', label: 'Couples Verified',     color: '#FFB800', from: 0,   to: 450,  suffix: '+' },
    { icon: Star,   value: '4.8★', label: 'Average Rating',       color: '#8B5CF6', from: 0,   to: 4.8,  suffix: '★' },
];

const validateForm = (data: Record<string, string>) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Invalid email address';
    if (!data.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(data.phone.replace(/[^0-9]/g, ''))) errors.phone = 'Please enter a valid 10-digit number';
    return errors;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────
function MagneticWrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setPos({ x: (e.clientX - cx) * 0.25, y: (e.clientY - cy) * 0.25 });
    }, []);
    return (
        <motion.div ref={ref} className={className} onMouseMove={handleMouseMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}
            animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.1 }}
        >{children}</motion.div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export const HomePage = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedCommunity, setSelectedCommunity] = useState<CommunityKey>('Gujarati');
    const [reportTab, setReportTab] = useState<'genetic' | 'fertility' | 'chronic' | 'infection'>('genetic');
    const [formData, setFormData] = useState({ name: '', partnerName: '', email: '', phone: '', plan: 'couple', community: 'Gujarati', notes: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ── GSAP Story Timeline ──
    useGSAP(() => {
        const storyTL = gsap.timeline({
            scrollTrigger: { trigger: '#story-pin', start: 'top top', end: '+=5000', pin: true, scrub: 1, anticipatePin: 1 }
        });

        // Ch1: The Perfect Match
        storyTL
            .fromTo('.ch1-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0)
            .fromTo('.ch1-headline', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, 0.1)
            .fromTo('.ch1-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35)
            .fromTo('.ch1-aarav', { opacity: 0, x: -100, rotateY: -15 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.6 }, 0.2)
            .fromTo('.ch1-riya', { opacity: 0, x: 100, rotateY: 15 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.6 }, 0.25)
            .fromTo('.ch1-checklist', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 0.6)
            .to('.chapter-1-content', { opacity: 0, y: -60, duration: 0.8 }, 1.3)

        // Ch2: The Blindspot
            .fromTo('.chapter-2-content', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.8)
            .fromTo('.ch2-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 }, 1.9)
            .fromTo('.ch2-headline', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 2.0)
            .fromTo('.ch2-characters', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, 2.1)
            .fromTo('.ch2-dna-icon', { opacity: 0, scale: 0, rotate: -180 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.5 }, 2.3)
            .fromTo('.ch2-stats', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, 2.4)
            .to('.chapter-2-content', { opacity: 0, y: -60, duration: 0.8 }, 3.1)

        // Ch3: The Hidden Risk
            .fromTo('.chapter-3-content', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 3.6)
            .fromTo('.ch3-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 }, 3.7)
            .fromTo('.ch3-headline', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 3.8)
            .fromTo('.ch3-aarav-tag', { opacity: 0, x: -40, scale: 0.6 }, { opacity: 1, x: 0, scale: 1, duration: 0.5 }, 4.0)
            .fromTo('.ch3-riya-tag', { opacity: 0, x: 40, scale: 0.6 }, { opacity: 1, x: 0, scale: 1, duration: 0.5 }, 4.1)
            .fromTo('.ch3-punnett', { opacity: 0, y: 50, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, 4.2)
            .fromTo('.ch3-warning', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 4.5)
            .to('.chapter-3-content', { opacity: 0, y: -60, duration: 0.8 }, 5.2)

        // Ch4: The Clarity
            .fromTo('.chapter-4-content', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 5.7)
            .fromTo('.ch4-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 }, 5.8)
            .fromTo('.ch4-headline', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 5.9)
            .fromTo('.ch4-pillars', { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06 }, 6.0)
            .fromTo('.ch4-cta-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 6.4)
            .to('.chapter-4-content', { opacity: 0, y: -60, duration: 0.8 }, 7.1)

        // Ch5: The Future
            .fromTo('.chapter-5-content', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 7.6)
            .fromTo('.ch5-badge', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 }, 7.7)
            .fromTo('.ch5-headline', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 7.8)
            .fromTo('.ch5-characters', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }, 7.9)
            .fromTo('.ch5-trust-cards', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, 8.1)
            .fromTo('.ch5-cta', { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, 8.4);

        // Business section reveals
        gsap.utils.toArray<HTMLElement>('.biz-reveal').forEach((el) => {
            gsap.fromTo(el, { opacity: 0, y: 60 }, {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        // Trust counters
        TRUST_METRICS.forEach((m, i) => {
            if (m.to === null) return;
            const el = document.querySelector(`.trust-counter-${i}`);
            if (!el) return;
            const obj = { val: m.from ?? 0 };
            const isFloat = !Number.isInteger(m.to);
            gsap.to(obj, {
                val: m.to, duration: 2.5, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' },
                onUpdate: () => { el.textContent = (isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toString()) + m.suffix; },
            });
        });
    }, { scope: containerRef });

    // SEO
    useEffect(() => {
        document.title = 'Slay Health | Premarital Health Compatibility Screening';
        const setMeta = (n: string, c: string) => {
            let m = document.querySelector(`meta[name="${n}"]`);
            if (!m) { m = document.createElement('meta'); m.setAttribute('name', n); document.head.appendChild(m); }
            m.setAttribute('content', c);
        };
        setMeta('description', 'Slay Health gives Indian couples a full clinical compatibility report before marriage — genetics, fertility, infections and more.');
        const id = 'slay-ld';
        let s = document.getElementById(id) as HTMLScriptElement | null;
        if (!s) { s = document.createElement('script'); s.id = id; s.type = 'application/ld+json'; document.head.appendChild(s); }
        s.textContent = JSON.stringify(getLandingSchema());
        return () => { document.getElementById(id)?.remove(); };
    }, []);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    }, [formErrors]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) { toast.error('Please fix the errors below.'); return; }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (!res.ok) throw new Error();
            setSubmitted(true);
            toast.success(`Thank you, ${formData.name}! Our clinical advisor will reach out shortly.`, { duration: 5000 });
        } catch { toast.error('Something went wrong. Please try again or email us directly at info@slay.health.'); }
        finally { setIsSubmitting(false); }
    }, [formData]);

    return (
        <div ref={containerRef} className="relative overflow-x-hidden min-h-screen noise" style={{ background: '#FDF6F0', color: '#1a1a2e' }}>

            {/* ═══════════════════════════════════════════
                PART A — SCROLL-PINNED STORY
            ═══════════════════════════════════════════ */}
            <div id="story-pin" className="relative w-full h-screen overflow-hidden net-grid perspective-1000">
                {/* Decorative gradient blobs */}
                <div className="blob-pink" style={{ width: '500px', height: '500px', top: '-10%', right: '-5%' }} />
                <div className="blob-green" style={{ width: '400px', height: '400px', bottom: '-10%', left: '-5%' }} />
                <div className="blob-gold" style={{ width: '300px', height: '300px', top: '40%', left: '50%', transform: 'translateX(-50%)' }} />

                {/* Radial fade over dot grid */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(253,246,240,0.2) 0%, rgba(253,246,240,0.92) 70%)'
                }} />

                {/* ─── Chapter 1: The Perfect Match ─── */}
                <div className="chapter-1-content absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
                    <span className="ch1-badge glass-story inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#DE457D] text-[10px] font-black uppercase tracking-widest mb-8 opacity-0">
                        <Heart className="w-3.5 h-3.5" fill="currentColor" /> Chapter 1 — The Perfect Match
                    </span>

                    <h1 className="ch1-headline font-sans text-4xl md:text-6xl lg:text-7xl font-black text-center leading-[1.1] tracking-tight max-w-4xl opacity-0" style={{ color: '#1a1a2e' }}>
                        They checked <span className="italic font-script text-5xl md:text-7xl lg:text-8xl" style={{ color: '#DE457D' }}>everything.</span>
                    </h1>

                    <p className="ch1-sub text-base md:text-xl text-center max-w-xl mt-5 leading-relaxed opacity-0" style={{ color: '#4a5568' }}>
                        Kundli. Salary. Family background. Horoscope. Everything a perfect Indian match requires.
                    </p>

                    <div className="flex items-end justify-center gap-8 md:gap-16 mt-10 md:mt-14">
                        <div className="ch1-aarav flex flex-col items-center opacity-0 perspective-1000">
                            <div className="character-frame w-32 h-44 md:w-44 md:h-60 float-anim preserve-3d card-3d">
                                <img src="/images/character_aarav.png" alt="Aarav" className="w-full h-full object-cover object-top" />
                            </div>
                            <span className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#4a5568' }}>Aarav</span>
                        </div>
                        <div className="ch1-riya flex flex-col items-center opacity-0 perspective-1000">
                            <div className="character-frame w-32 h-44 md:w-44 md:h-60 float-slow preserve-3d card-3d">
                                <img src="/images/character_riya.png" alt="Riya" className="w-full h-full object-cover object-top" />
                            </div>
                            <span className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#4a5568' }}>Riya</span>
                        </div>
                    </div>

                    <div className="ch1-checklist flex flex-wrap justify-center gap-2 mt-8 opacity-0">
                        {['Kundli ✓', 'Salary ✓', 'Family ✓', 'Education ✓', 'Lifestyle ✓'].map((item) => (
                            <span key={item} className="glass-story px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#17CB96]">
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>Scroll to continue</span>
                        <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />
                    </div>
                </div>

                {/* ─── Chapter 2: The Blindspot ─── */}
                <div className="chapter-2-content absolute inset-0 flex flex-col items-center justify-center px-4 z-10 opacity-0">
                    <span className="ch2-badge glass-story inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#FFB800] text-[10px] font-black uppercase tracking-widest mb-8">
                        <AlertCircle className="w-3.5 h-3.5" /> Chapter 2 — The Blindspot
                    </span>

                    <h2 className="ch2-headline font-sans text-3xl md:text-5xl lg:text-6xl font-black text-center leading-[1.1] tracking-tight max-w-3xl" style={{ color: '#1a1a2e' }}>
                        But nobody checked <span style={{ color: '#D4544C' }}>the biology.</span>
                    </h2>

                    <div className="ch2-characters flex items-center justify-center gap-6 md:gap-10 mt-10">
                        <div className="w-28 h-36 md:w-40 md:h-52 rounded-2xl overflow-hidden border-2 border-[#D4544C]/20 perspective-1000 preserve-3d card-3d" style={{ boxShadow: '0 16px 48px rgba(212,84,76,0.15)' }}>
                            <img src="/images/character_aarav.png" alt="Aarav" className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="ch2-dna-icon opacity-0">
                            <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center" style={{ boxShadow: '0 8px 30px rgba(212,84,76,0.15)' }}>
                                <Dna className="w-7 h-7" style={{ color: '#D4544C' }} />
                            </div>
                        </div>
                        <div className="w-28 h-36 md:w-40 md:h-52 rounded-2xl overflow-hidden border-2 border-[#D4544C]/20 perspective-1000 preserve-3d card-3d" style={{ boxShadow: '0 16px 48px rgba(212,84,76,0.15)' }}>
                            <img src="/images/character_riya.png" alt="Riya" className="w-full h-full object-cover object-top" />
                        </div>
                    </div>

                    <div className="ch2-stats grid grid-cols-1 md:grid-cols-3 gap-3 mt-10 max-w-2xl w-full">
                        {STATS.map((stat, i) => (
                            <div key={i} className="glass-card rounded-2xl p-5 text-center">
                                <span className="text-2xl md:text-3xl font-black" style={{ color: stat.color }}>{stat.value}</span>
                                <p className="text-[10px] font-bold uppercase tracking-wider mt-2" style={{ color: '#4a5568' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Chapter 3: The Hidden Risk ─── */}
                <div className="chapter-3-content absolute inset-0 flex flex-col items-center justify-center px-4 z-10 opacity-0">
                    <span className="ch3-badge glass-story inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#D4544C] text-[10px] font-black uppercase tracking-widest mb-8">
                        <AlertTriangle className="w-3.5 h-3.5" /> Chapter 3 — The Hidden Risk
                    </span>

                    <h2 className="ch3-headline font-sans text-3xl md:text-5xl lg:text-6xl font-black text-center leading-[1.1] tracking-tight max-w-3xl" style={{ color: '#1a1a2e' }}>
                        Both carry <span style={{ color: '#D4544C' }}>Thalassemia Trait.</span>
                    </h2>

                    <div className="flex items-start justify-center gap-8 md:gap-20 mt-10">
                        {[
                            { img: '/images/character_aarav.png', name: 'Aarav', cls: 'ch3-aarav-tag' },
                            { img: '/images/character_riya.png', name: 'Riya', cls: 'ch3-riya-tag' },
                        ].map((c) => (
                            <div key={c.name} className="flex flex-col items-center">
                                <div className="relative">
                                    <div className="character-frame character-frame-danger w-28 h-36 md:w-40 md:h-52 perspective-1000 preserve-3d card-3d">
                                        <img src={c.img} alt={`${c.name} — Carrier`} className="w-full h-full object-cover object-top" />
                                    </div>
                                    <div className={`${c.cls} absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0`}>
                                        <span className="badge-warning-pulse inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4544C] text-white text-[9px] font-black uppercase tracking-wider shadow-lg">
                                            <AlertTriangle className="w-3 h-3" /> Carrier
                                        </span>
                                    </div>
                                </div>
                                <span className="mt-6 text-xs font-bold uppercase tracking-widest" style={{ color: '#4a5568' }}>{c.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="ch3-punnett glass-card rounded-2xl p-5 md:p-6 mt-10 max-w-sm w-full opacity-0">
                        <span className="text-[9px] font-black uppercase tracking-widest block mb-3" style={{ color: '#D4544C' }}>Genetic Inheritance Risk</span>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-bold">
                            <div></div>
                            <div className="p-2.5 rounded-lg" style={{ background: 'rgba(253,246,240,0.8)', color: '#4a5568' }}>A</div>
                            <div className="p-2.5 rounded-lg" style={{ background: 'rgba(253,246,240,0.8)', color: '#4a5568' }}>a</div>
                            <div className="p-2.5 rounded-lg" style={{ background: 'rgba(253,246,240,0.8)', color: '#4a5568' }}>A</div>
                            <div className="p-2.5 rounded-lg bg-[#17CB96]/10 text-[#17CB96]">AA</div>
                            <div className="p-2.5 rounded-lg bg-[#FFB800]/10 text-[#FFB800]">Aa</div>
                            <div className="p-2.5 rounded-lg" style={{ background: 'rgba(253,246,240,0.8)', color: '#4a5568' }}>a</div>
                            <div className="p-2.5 rounded-lg bg-[#FFB800]/10 text-[#FFB800]">Aa</div>
                            <div className="p-2.5 rounded-lg bg-[#D4544C]/15 text-[#D4544C] font-black text-sm">aa</div>
                        </div>
                        <p className="text-[10px] mt-4 text-center" style={{ color: '#4a5568' }}>
                            <span className="font-black" style={{ color: '#D4544C' }}>25% risk</span> of Thalassemia Major in children
                        </p>
                    </div>

                    <div className="ch3-warning glass-card flex items-start gap-3 mt-5 max-w-md px-5 py-4 rounded-xl opacity-0" style={{ borderColor: 'rgba(212,84,76,0.15)' }}>
                        <AlertTriangle className="w-5 h-5 text-[#D4544C] flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-relaxed" style={{ color: '#4a5568' }}>
                            Both look perfectly healthy. Neither has symptoms. But their children face a <strong style={{ color: '#D4544C' }}>1 in 4 chance</strong> of needing lifelong blood transfusions.
                        </p>
                    </div>
                </div>

                {/* ─── Chapter 4: The Clarity ─── */}
                <div className="chapter-4-content absolute inset-0 flex flex-col items-center justify-center px-4 z-10 opacity-0">
                    <span className="ch4-badge glass-story inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#17CB96] text-[10px] font-black uppercase tracking-widest mb-8">
                        <Shield className="w-3.5 h-3.5" /> Chapter 4 — The Clarity
                    </span>

                    <h2 className="ch4-headline font-sans text-3xl md:text-5xl lg:text-6xl font-black text-center leading-[1.1] tracking-tight max-w-4xl" style={{ color: '#1a1a2e' }}>
                        What if you could <span className="gradient-text-gp">know before</span> you say "I Do"?
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-10 max-w-2xl w-full">
                        {PILLARS.map((p, i) => (
                            <div key={i} className="ch4-pillars glass-card rounded-xl p-4 flex items-center gap-3 opacity-0">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.color + '15' }}>
                                    <p.icon className="w-4.5 h-4.5" style={{ color: p.color }} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#1a1a2e' }}>{p.label}</span>
                            </div>
                        ))}
                    </div>

                    <p className="ch4-cta-text text-sm md:text-base text-center mt-8 max-w-lg leading-relaxed opacity-0" style={{ color: '#4a5568' }}>
                        Slay Health's Compatibility Engine screens <strong>50+ biomarkers</strong> across genetics, fertility, infections, and chronic disease — in one simple test.
                    </p>
                </div>

                {/* ─── Chapter 5: The Future ─── */}
                <div className="chapter-5-content absolute inset-0 flex flex-col items-center justify-center px-4 z-10 opacity-0">
                    <span className="ch5-badge glass-story inline-flex items-center gap-2 px-5 py-2 rounded-full text-[#17CB96] text-[10px] font-black uppercase tracking-widest mb-8">
                        <Sparkles className="w-3.5 h-3.5" /> Chapter 5 — The Future
                    </span>

                    <h2 className="ch5-headline font-sans text-3xl md:text-5xl lg:text-6xl font-black text-center leading-[1.1] tracking-tight max-w-3xl" style={{ color: '#1a1a2e' }}>
                        Start your future with <span style={{ color: '#17CB96' }}>clarity.</span>
                    </h2>

                    <div className="ch5-characters flex items-end justify-center gap-10 md:gap-16 mt-10">
                        {['character_aarav', 'character_riya'].map((c) => (
                            <div key={c} className="flex flex-col items-center">
                                <div className="character-frame character-frame-success w-28 h-36 md:w-40 md:h-52 perspective-1000 preserve-3d card-3d">
                                    <img src={`/images/${c}.png`} alt="Screened" className="w-full h-full object-cover object-top" />
                                </div>
                                <span className="badge-success-pulse mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17CB96] text-white text-[9px] font-black uppercase tracking-wider">
                                    <Check className="w-3 h-3" /> Screened
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-2xl w-full">
                        {TRUST_METRICS.map((m, i) => (
                            <div key={i} className="ch5-trust-cards glass-card rounded-xl p-4 text-center opacity-0">
                                <m.icon className="w-5 h-5 mx-auto mb-2" style={{ color: m.color }} />
                                <span className={`trust-counter-${i} text-xl font-black block`} style={{ color: '#1a1a2e' }}>{m.value}</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#9ca3af' }}>{m.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="ch5-cta flex flex-col sm:flex-row items-center gap-4 mt-10 opacity-0">
                        <MagneticWrap>
                            <a href="#advisor-form" className="btn-premium inline-flex items-center gap-2.5 px-10 py-4.5 rounded-2xl font-bold text-sm uppercase tracking-widest text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #DE457D, #C73A6A)', boxShadow: '0 8px 30px rgba(222,69,125,0.3)' }}>
                                Start Compatibility Test <ArrowRight className="w-4 h-4" />
                            </a>
                        </MagneticWrap>
                        <MagneticWrap>
                            <a href="/reports/GeneticsReport.pdf" target="_blank" rel="noopener noreferrer" className="glass-card inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/80 transition-all" style={{ color: '#4a5568' }}>
                                View Sample Report
                            </a>
                        </MagneticWrap>
                    </div>
                </div>
            </div>


            {/* ═══════════════════════════════════════════
                PART B — BUSINESS SECTIONS
            ═══════════════════════════════════════════ */}
            <div className="relative z-10" style={{ background: '#FDF6F0' }}>

                {/* ── Community Risk Selector ── */}
                <div className="section-divider" />
                <section className="biz-reveal py-24 md:py-32 max-w-6xl mx-auto px-4 md:px-6 relative">
                    <div className="blob-pink" style={{ width: '350px', height: '350px', top: '0', right: '-10%', opacity: 0.5 }} />
                    <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-5 space-y-6">
                            <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#DE457D] text-[9px] font-black uppercase tracking-widest">
                                <Dna className="w-3 h-3" /> Regional Risk Analysis
                            </span>
                            <h3 className="font-sans text-3xl md:text-4xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>
                                Know your community's <span style={{ color: '#DE457D' }}>genetic risks</span>
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                                India's diverse communities carry unique genetic concentrations. Select your background to see region-specific screening insights.
                            </p>
                            <div className="space-y-2">
                                <label htmlFor="com-select" className="text-[10px] font-black uppercase tracking-widest block" style={{ color: '#9ca3af' }}>Select Community</label>
                                <div className="relative">
                                    <select id="com-select" value={selectedCommunity} onChange={(e) => setSelectedCommunity(e.target.value as CommunityKey)}
                                        className="w-full px-5 py-4 rounded-2xl text-xs glass-card cursor-pointer font-bold appearance-none outline-none focus:ring-2 focus:ring-[#DE457D]/15 transition-all"
                                        style={{ color: '#1a1a2e' }}>
                                        {Object.keys(communityRisks).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {Object.entries(communityRisks).map(([key, data]) => {
                                    if (key !== selectedCommunity) return null;
                                    return (
                                        <motion.div key={key} initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -12 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="glass-card rounded-3xl p-7 md:p-8 space-y-5">
                                            <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                                <div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest block" style={{ color: '#17CB96' }}>Community Risk Profile</span>
                                                    <h4 className="text-sm font-black uppercase mt-1 tracking-wider" style={{ color: '#1a1a2e' }}>{key}</h4>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(23,203,150,0.08)' }}>
                                                    <Dna className="w-4 h-4" style={{ color: '#17CB96' }} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: '#9ca3af' }}>Elevated Genetic Risks</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.risks.map((r, idx) => (
                                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold glass-story" style={{ color: '#D4544C' }}>
                                                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {r}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="glass-story p-4 rounded-2xl space-y-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: '#FFB800' }}>
                                                    <Info className="w-3.5 h-3.5" /> Why This Matters
                                                </span>
                                                <p className="text-xs leading-relaxed" style={{ color: '#4a5568' }}>{data.why}</p>
                                            </div>
                                            <div className="space-y-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: '#9ca3af' }}>Recommended Tests</span>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {data.tests.map((t, idx) => (
                                                        <div key={idx} className="glass-story p-3 rounded-xl flex items-center gap-2 text-xs font-bold" style={{ color: '#1a1a2e' }}>
                                                            <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#17CB96' }} /> {t}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[11px] italic pt-2" style={{ color: '#9ca3af', borderTop: '1px solid rgba(0,0,0,0.04)' }}>* {data.note}</p>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* ── Diagnostic Pillars ── */}
                <div className="section-divider" />
                <section className="biz-reveal py-24 md:py-32 max-w-6xl mx-auto px-4 md:px-6 relative">
                    <div className="blob-green" style={{ width: '400px', height: '400px', top: '-5%', left: '-8%', opacity: 0.4 }} />
                    <div className="text-center mb-16 space-y-4 relative z-10">
                        <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#17CB96] text-[9px] font-black uppercase tracking-widest">
                            <Shield className="w-3 h-3" /> What We Screen
                        </span>
                        <h3 className="font-sans text-3xl md:text-5xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>
                            6 pillars of health compatibility
                        </h3>
                        <p className="text-sm max-w-xl mx-auto" style={{ color: '#4a5568' }}>
                            Complete biological analysis across every parameter that matters for family planning.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
                        {PILLARS.map((p, i) => (
                            <div key={i} className={`biz-reveal glass-card pillar-hover rounded-2xl p-7 group`} data-color={p.glow}
                                style={{ borderTop: `3px solid ${p.color}` }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: p.color + '12' }}>
                                    <p.icon className="w-6 h-6" style={{ color: p.color }} />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#1a1a2e' }}>{p.label}</h4>
                                <p className="text-xs leading-relaxed" style={{ color: '#4a5568' }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── How It Works ── */}
                <div className="section-divider" />
                <section id="how-it-works" className="biz-reveal py-24 md:py-32 max-w-6xl mx-auto px-4 md:px-6 section-alt relative">
                    <div className="text-center mb-16 space-y-4">
                        <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#17CB96] text-[9px] font-black uppercase tracking-widest">
                            <Activity className="w-3 h-3" /> How It Works
                        </span>
                        <h3 className="font-sans text-3xl md:text-5xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>
                            Simple 4-step process
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { num: '01', title: 'Schedule Online', desc: 'Select your plan, register details, and confirm booking in 2 minutes.', color: '#17CB96', img: '/images/hs-7.png' },
                            { num: '02', title: 'Collect Samples', desc: 'NABL-accredited experts collect blood samples at home or lab.', color: '#DE457D', img: '/images/hs-2.png' },
                            { num: '03', title: 'Process Profiles', desc: 'Our engine cross-matches analysis across all 6 clinical fields.', color: '#FFB800', img: '/images/hs-5.png' },
                            { num: '04', title: 'Doctor Guidance', desc: 'Evaluate results in a secure report reviewed 1-on-1 by certified doctors.', color: '#8B5CF6', img: '/images/hs-1.png' },
                        ].map((step, i) => (
                            <div key={i} className="biz-reveal glass-card rounded-2xl p-5 flex flex-col group">
                                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center p-3 relative mb-5" style={{ background: 'rgba(253,246,240,0.6)', border: '1px solid rgba(255,255,255,0.5)' }}>
                                    <div className="absolute top-3 right-3 w-8 h-8 rounded-lg glass-story flex items-center justify-center font-mono font-black text-xs" style={{ color: step.color }}>{step.num}</div>
                                    <img src={step.img} alt={step.title} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                </div>
                                <h5 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: '#1a1a2e' }}>
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: step.color }} /> {step.title}
                                </h5>
                                <p className="text-xs leading-relaxed" style={{ color: '#4a5568' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Sample Report ── */}
                <div className="section-divider" />
                <section className="biz-reveal py-24 md:py-32 max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#17CB96] text-[9px] font-black uppercase tracking-widest">
                            <Activity className="w-3 h-3" /> Sample Report Preview
                        </span>
                        <h3 className="font-sans text-3xl md:text-5xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>
                            What your report looks like
                        </h3>
                    </div>
                    <div className="grid lg:grid-cols-12 gap-6 items-start max-w-4xl mx-auto text-left w-full">
                        <div className="lg:col-span-5 space-y-2">
                            <span className="text-[8px] font-black uppercase tracking-widest block mb-3" style={{ color: '#9ca3af' }}>Select Category</span>
                            {sampleReport.categories.map((cat) => {
                                const isSelected = reportTab === cat.id;
                                return (
                                    <button key={cat.id} onClick={() => setReportTab(cat.id as typeof reportTab)}
                                        className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group ${isSelected ? 'glass-card shadow-sm' : 'hover:bg-white/40'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] font-black" style={{ color: isSelected ? '#17CB96' : '#9ca3af' }}>{cat.score}/{cat.maxScore}</div>
                                            <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-[#1a1a2e]' : 'text-[#4a5568]'}`}>{cat.title}</span>
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-[#17CB96]' : 'text-[#9ca3af] group-hover:translate-x-0.5'}`} />
                                    </button>
                                );
                            })}
                        </div>
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {sampleReport.categories.map((cat) => {
                                    if (cat.id !== reportTab) return null;
                                    return (
                                        <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                                            transition={{ duration: 0.25 }} className="glass-card rounded-2xl p-6 space-y-4">
                                            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: '#1a1a2e' }}>{cat.title}</h4>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 block" style={{ color: '#9ca3af' }}>NABL Certified</span>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${
                                                    cat.status === 'Good' || cat.status === 'Excellent' ? 'bg-[#17CB96]/10 text-[#17CB96]' : 'bg-[#FFB800]/10 text-[#FFB800]'}`}>{cat.status}</span>
                                            </div>
                                            <p className="text-xs leading-relaxed italic p-4 rounded-xl glass-story" style={{ color: '#4a5568' }}>"{cat.summary}"</p>
                                            <div className="grid sm:grid-cols-2 gap-2">
                                                {cat.details.map((d, idx) => (
                                                    <div key={idx} className="p-3 rounded-xl flex items-center justify-between text-[11px] glass-story">
                                                        <div>
                                                            <span className="block text-[8px] font-bold uppercase" style={{ color: '#9ca3af' }}>{d.label}</span>
                                                            <span className="block font-bold mt-0.5" style={{ color: '#1a1a2e' }}>{d.value}</span>
                                                        </div>
                                                        {d.status === 'good' ? <Check className="w-4 h-4 text-[#17CB96] stroke-[3]" /> : <AlertCircle className="w-4 h-4 text-[#FFB800]" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* ── Pricing ── */}
                <div className="section-divider" />
                <section id="pricing" className="biz-reveal py-24 md:py-32 max-w-6xl mx-auto px-4 md:px-6 relative">
                    <div className="blob-gold" style={{ width: '400px', height: '400px', top: '10%', right: '-10%', opacity: 0.4 }} />
                    <div className="text-center mb-16 space-y-4 relative z-10">
                        <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#DE457D] text-[9px] font-black uppercase tracking-widest">
                            <Star className="w-3 h-3" fill="currentColor" /> Pricing Plans
                        </span>
                        <h3 className="font-sans text-3xl md:text-5xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>
                            Transparent, affordable screening
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch relative z-10">
                        {PRICING_PLANS.map((plan, i) => (
                            <div key={i} className={`biz-reveal relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${plan.popular ? 'pricing-featured shimmer-border scale-[1.03]' : 'glass-card'}`}>
                                {plan.popular && (
                                    <div className="text-white text-[10px] font-black uppercase tracking-widest text-center py-3" style={{ background: 'linear-gradient(135deg, #17CB96, #14B886)' }}>
                                        <Star className="w-3.5 h-3.5 inline mr-1.5" fill="currentColor" /> Most Popular
                                    </div>
                                )}
                                <div className={`p-7 md:p-8 flex flex-col flex-1 justify-between ${plan.popular ? 'pt-6' : ''}`}>
                                    <div className="space-y-5">
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: '#1a1a2e' }}>{plan.title}</h4>
                                            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#4a5568' }}>{plan.desc}</p>
                                        </div>
                                        <div className="py-3 flex items-baseline gap-1" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                            <span className="text-3xl font-extrabold" style={{ color: '#1a1a2e' }}>{plan.price}</span>
                                            <span className="text-xs font-bold uppercase" style={{ color: '#9ca3af' }}>{plan.per}</span>
                                            {plan.save && <span className="text-[10px] font-black ml-3 px-2 py-0.5 rounded-full bg-[#17CB96]/10" style={{ color: '#17CB96' }}>{plan.save}</span>}
                                        </div>
                                        <ul className="space-y-3">
                                            {plan.features.map((f, j) => (
                                                <li key={j} className="flex items-start gap-2.5 text-xs" style={{ color: '#4a5568' }}>
                                                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#17CB96' }} /> <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-8 space-y-3">
                                        <MagneticWrap>
                                            <button onClick={() => { setFormData(prev => ({ ...prev, plan: plan.value })); document.getElementById('advisor-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                                                className={`btn-premium w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 min-h-[50px] ${plan.popular ? 'text-white' : 'glass-card hover:bg-white/80'}`}
                                                style={plan.popular ? { background: 'linear-gradient(135deg, #17CB96, #14B886)', boxShadow: '0 8px 24px rgba(23,203,150,0.25)' } : { color: '#1a1a2e' }}>
                                                <span>{plan.cta}</span> <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </MagneticWrap>
                                        <p className="text-[9px] text-center font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>{plan.outcome}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Testimonials ── */}
                <div className="section-divider" />
                <section id="testimonials" className="biz-reveal py-24 md:py-32 max-w-6xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#DE457D] text-[9px] font-black uppercase tracking-widest">
                            <Heart className="w-3 h-3" fill="currentColor" /> Real Stories
                        </span>
                        <h3 className="font-sans text-3xl md:text-5xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>Couples who chose clarity</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="biz-reveal glass-card rounded-2xl p-7 md:p-8 relative overflow-hidden flex flex-col justify-between"
                                style={{ borderLeft: `4px solid ${t.color}` }}>
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${t.color}08 0%, transparent 70%)` }} />
                                <div className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full glass-story" style={{ color: t.color }}>{t.type}</div>
                                <div className="space-y-4">
                                    <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: '#FFB800' }} />)}</div>
                                    <p className="text-xs md:text-sm leading-relaxed italic" style={{ color: '#4a5568' }}>"{t.quote}"</p>
                                </div>
                                <div className="mt-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                    <div>
                                        <span className="text-xs font-black" style={{ color: '#1a1a2e' }}>{t.names}</span>
                                        <span className="text-[10px] font-bold uppercase block sm:inline sm:ml-2" style={{ color: '#9ca3af' }}>({t.location})</span>
                                    </div>
                                    <div className="space-y-1 text-left sm:text-right">
                                        <div className="flex items-center sm:justify-end gap-1.5 text-[10px] font-bold" style={{ color: '#4a5568' }}>
                                            <Sparkles className="w-3.5 h-3.5" style={{ color: t.color }} /> <span>{t.highlight}</span>
                                        </div>
                                        <div className="text-[9px] font-bold uppercase" style={{ color: '#9ca3af' }}>{t.impact}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Advisor Form ── */}
                <div className="section-divider" />
                <section id="promise" className="biz-reveal py-24 md:py-32 max-w-4xl mx-auto px-4 md:px-6 relative">
                    <div className="blob-green" style={{ width: '350px', height: '350px', bottom: '0', left: '-15%', opacity: 0.4 }} />
                    <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-5 space-y-6 text-left">
                            <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#17CB96] text-[9px] font-black uppercase tracking-widest">
                                <Shield className="w-3 h-3" /> Get Started
                            </span>
                            <h3 className="font-sans text-3xl md:text-4xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>
                                Build your future on <span className="gradient-text-gp">clarity</span>
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: '#4a5568' }}>
                                Register below to speak with a clinical advisor and organize your at-home screening.
                            </p>
                            <div className="space-y-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                {[
                                    { title: '100% Encrypted Profiles', desc: 'Your data is protected under NABL guidelines.' },
                                    { title: 'Doctor-Reviewed Results', desc: 'Direct 1-on-1 consultation with certified doctors.' },
                                ].map((p, idx) => (
                                    <div key={idx} className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(23,203,150,0.1)' }}>
                                            <Check className="w-3.5 h-3.5 stroke-[3]" style={{ color: '#17CB96' }} />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-black uppercase tracking-wider" style={{ color: '#1a1a2e' }}>{p.title}</h5>
                                            <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: '#9ca3af' }}>{p.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div id="advisor-form" className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                        className="glass-card rounded-3xl p-8 text-center space-y-6">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(23,203,150,0.1)' }}>
                                            <Check className="w-8 h-8 stroke-[3]" style={{ color: '#17CB96' }} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black uppercase tracking-wider" style={{ color: '#1a1a2e' }}>Registration Complete</h4>
                                            <p className="text-xs mt-2 leading-relaxed max-w-sm mx-auto" style={{ color: '#4a5568' }}>
                                                Thank you, {formData.name}. Our clinical advisor will call you shortly.
                                            </p>
                                        </div>
                                        <button onClick={() => setSubmitted(false)} className="text-xs font-black uppercase tracking-wider hover:underline" style={{ color: '#17CB96' }}>Submit another query</button>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={handleSubmit} className="glass-card rounded-3xl p-7 md:p-8 space-y-5 text-left">
                                        <span className="text-[9px] font-black uppercase tracking-widest block pb-3" style={{ color: '#9ca3af', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>Advisor Registration</span>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {[
                                                { id: 'form-name', name: 'name', label: 'Your Name', placeholder: 'Aarav', icon: User, error: formErrors.name },
                                                { id: 'form-partner', name: 'partnerName', label: "Partner's Name", placeholder: 'Riya', icon: Heart, error: '' },
                                            ].map((f) => (
                                                <div key={f.id}>
                                                    <label htmlFor={f.id} className="text-[8px] font-black uppercase tracking-wider block mb-1.5" style={{ color: '#9ca3af' }}>{f.label}</label>
                                                    <div className="relative">
                                                        <input id={f.id} name={f.name} value={(formData as Record<string, string>)[f.name]} onChange={handleInput} placeholder={f.placeholder}
                                                            className={`w-full pl-9 pr-3 py-3 glass-story rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#17CB96]/15 transition-all ${f.error ? 'ring-2 ring-[#D4544C]/20' : ''}`}
                                                            style={{ color: '#1a1a2e' }} />
                                                        <f.icon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                                                    </div>
                                                    {f.error && <span className="text-[9px] mt-1 block font-semibold" style={{ color: '#D4544C' }}>{f.error}</span>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {[
                                                { id: 'form-email', name: 'email', type: 'email', label: 'Email', placeholder: 'name@email.com', icon: Mail, error: formErrors.email },
                                                { id: 'form-phone', name: 'phone', type: 'tel', label: 'Phone', placeholder: '9876543210', icon: Phone, error: formErrors.phone },
                                            ].map((f) => (
                                                <div key={f.id}>
                                                    <label htmlFor={f.id} className="text-[8px] font-black uppercase tracking-wider block mb-1.5" style={{ color: '#9ca3af' }}>{f.label}</label>
                                                    <div className="relative">
                                                        <input id={f.id} name={f.name} type={f.type} value={(formData as Record<string, string>)[f.name]} onChange={handleInput} placeholder={f.placeholder}
                                                            className={`w-full pl-9 pr-3 py-3 glass-story rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#17CB96]/15 transition-all ${f.error ? 'ring-2 ring-[#D4544C]/20' : ''}`}
                                                            style={{ color: '#1a1a2e' }} />
                                                        <f.icon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }} />
                                                    </div>
                                                    {f.error && <span className="text-[9px] mt-1 block font-semibold" style={{ color: '#D4544C' }}>{f.error}</span>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="form-plan" className="text-[8px] font-black uppercase tracking-wider block mb-1.5" style={{ color: '#9ca3af' }}>Plan</label>
                                                <div className="relative">
                                                    <select id="form-plan" name="plan" value={formData.plan} onChange={handleInput}
                                                        className="w-full pl-3 pr-8 py-3 glass-story rounded-xl text-xs outline-none appearance-none cursor-pointer font-semibold" style={{ color: '#1a1a2e' }}>
                                                        <option value="individual">Individual (₹799)</option>
                                                        <option value="couple">Couple (₹1,499)</option>
                                                        <option value="expert">Doctor Consultation (₹2,499)</option>
                                                    </select>
                                                    <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="form-community" className="text-[8px] font-black uppercase tracking-wider block mb-1.5" style={{ color: '#9ca3af' }}>Community</label>
                                                <div className="relative">
                                                    <select id="form-community" name="community" value={formData.community} onChange={handleInput}
                                                        className="w-full pl-3 pr-8 py-3 glass-story rounded-xl text-xs outline-none appearance-none cursor-pointer font-semibold" style={{ color: '#1a1a2e' }}>
                                                        {Object.keys(communityRisks).map(k => <option key={k} value={k}>{k}</option>)}
                                                    </select>
                                                    <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9ca3af' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="form-notes" className="text-[8px] font-black uppercase tracking-wider block mb-1.5" style={{ color: '#9ca3af' }}>Notes (Optional)</label>
                                            <textarea id="form-notes" name="notes" value={formData.notes} onChange={handleInput}
                                                placeholder="Any family history, blood types, or specific requests..."
                                                rows={2} className="w-full p-3 glass-story rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#17CB96]/15 transition-all resize-none" style={{ color: '#1a1a2e' }} />
                                        </div>
                                        <MagneticWrap>
                                            <button type="submit" disabled={isSubmitting}
                                                className="btn-premium w-full text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-50"
                                                style={{ background: 'linear-gradient(135deg, #DE457D, #C73A6A)', boxShadow: '0 8px 24px rgba(222,69,125,0.25)' }}>
                                                {isSubmitting ? 'Registering...' : <><span>Book Doctor Call</span><ArrowRight className="w-3.5 h-3.5" /></>}
                                            </button>
                                        </MagneticWrap>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <div className="section-divider" />
                <section className="biz-reveal py-24 md:py-32 max-w-4xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-16 space-y-4">
                        <span className="glass-story inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#DE457D] text-[9px] font-black uppercase tracking-widest">
                            <Info className="w-3 h-3" /> FAQ
                        </span>
                        <h3 className="font-sans text-3xl md:text-4xl font-black leading-[1.1] tracking-tight" style={{ color: '#1a1a2e' }}>
                            Frequently asked questions
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="group glass-card rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-sm md:text-base font-bold hover:text-[#17CB96] transition-colors select-none" style={{ color: '#1a1a2e' }}>
                                    <span>{faq.question}</span>
                                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-open:rotate-90 flex-shrink-0 ml-4" style={{ color: '#9ca3af' }} />
                                </summary>
                                <div className="px-6 pb-6 pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                                    <p className="text-xs md:text-sm leading-relaxed mt-2" style={{ color: '#4a5568' }}>{faq.answer}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
