import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Heart, Star,
    Mail, Phone, User, Activity, Dna,
    ChevronRight, AlertCircle, Users, Award, ChevronDown, Info, Lock, Shield, Check
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';

import { getLandingSchema } from '@/lib/landingSchema';
import { faqs } from '@/lib/faqData';
import { communityRisks } from '@/lib/communityRisks';
import HeroBento from '@/components/HeroBento';
import HeroStory from '@/components/HeroStory';
import InteractiveBentoSections from '@/components/InteractiveBentoSections';
import MagneticButton from '@/components/ui/MagneticButton';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ──────────────────────────────────────────────────────────────────
const TRUST_METRICS = [
    { icon: Shield, value: '100%', label: 'Private & Encrypted',  color: '#111112', from: 0, to: 100, suffix: '%' },
    { icon: Award,  value: 'NABL', label: 'Certified Labs',       color: '#D4544C', from: null, to: null, suffix: '' },
    { icon: Users,  value: '450+', label: 'Couples Verified',     color: '#111112', from: 0,   to: 450,  suffix: '+' },
    { icon: Star,   value: '4.8★', label: 'Average Rating',       color: '#5A5A60', from: 0,   to: 4.8,  suffix: '★' },
];

import { personas } from '@/lib/personas';
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

const validateForm = (data: Record<string, string>) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Invalid email address';
    if (!data.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(data.phone.replace(/[^0-9]/g, ''))) errors.phone = 'Please enter a valid 10-digit number';
    return errors;
};

export const HomePage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const testimonialsRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({ name: '', partnerName: '', email: '', phone: '', plan: 'couple', community: 'Gujarati', notes: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ── Business section reveals & count triggers ──
    useGSAP(() => {
        const triggers = gsap.utils.toArray<HTMLElement>('.biz-reveal').map((el) => {
            return gsap.fromTo(el, 
                { y: 35, opacity: 0 }, 
                {
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    ease: 'power3.out',
                    scrollTrigger: { 
                        trigger: el, 
                        start: 'top 88%', 
                        toggleActions: 'play none none none' 
                    }
                }
            );
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
                scrollTrigger: { trigger: el, start: 'top 88%' },
                onUpdate: () => { el.textContent = (isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toString()) + m.suffix; },
            });
        });

        // Clip-path wipe transition for How It Works section
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!isReducedMotion) {
            gsap.fromTo('#how-it-works', 
                { clipPath: 'inset(10% 10% 10% 10% round 12px)', opacity: 0.8 },
                { 
                    clipPath: 'inset(0% 0% 0% 0% round 0px)',
                    opacity: 1,
                    duration: 1.2, 
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: '#how-it-works',
                        start: 'top 85%',
                        end: 'top 20%',
                        scrub: 0.5,
                    }
                }
            );
        }

        return () => {
            // Safe cleanup for all business triggers
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, { scope: containerRef });

    // SEO structured data
    useEffect(() => {
        document.title = 'Slay Health | Premarital Health Compatibility Screening for Indian Couples';
        const setMeta = (n: string, c: string) => {
            let m = document.querySelector(`meta[name="${n}"]`);
            if (!m) { m = document.createElement('meta'); m.setAttribute('name', n); document.head.appendChild(m); }
            m.setAttribute('content', c);
        };
        setMeta('description', 'Slay Health helps Indian couples understand their health compatibility before marriage — covering genetics, fertility, chronic conditions, and more. Starting at ₹799.');
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
        <main ref={containerRef} className="relative overflow-x-hidden min-h-screen bg-[#FBFBFD] text-[#111112]">

            {/* The New Bento Hero Grid */}
            <HeroBento />

            {/* Pinned Scrollytelling Pinned Sequence */}
            <section aria-label="Premarital Health Compatibility Story">
                <HeroStory />
            </section>

            {/* Extracted Interactive Bento Sections (Community Risks, Pillars, Report Preview) */}
            <InteractiveBentoSections />

            {/* ── HOW IT WORKS: Steps with Images ── */}
            <div className="section-divider" />
            <section id="how-it-works" className="biz-reveal py-20 md:py-28 relative overflow-hidden" aria-label="How Slay Health Works">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 dot-grid opacity-30" />
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#F3F1EC]/50 to-transparent" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F3F1EC]/50 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 border border-[#18CB96]/40 bg-[#18CB96]/5 font-mono text-[9px] uppercase tracking-widest text-[#18CB96] font-semibold">
                            HOW IT WORKS
                        </span>
                        <SplitTextReveal 
                            tag="h3" 
                            text="FOUR STEPS TO CLARITY" 
                            className="font-sans text-3xl md:text-clamp-title font-black uppercase tracking-tighter leading-none text-[#111112]" 
                        />
                        <p className="text-xs font-mono uppercase tracking-wider text-[#5A5A60] max-w-lg mx-auto">
                            From registration to your doctor-reviewed compatibility report — in 72 hours.
                        </p>
                    </div>

                    {/* Bento Grid with step images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {[
                            { num: '01', title: 'Schedule Online', desc: 'Select your plan, fill your details, and confirm booking in under 2 minutes.', img: '/images/hs-7.webp', color: '#18CB96', step: 'REGISTER' },
                            { num: '02', title: 'Home Sample Collection', desc: 'NABL-accredited phlebotomists visit your home at your preferred time slot.', img: '/images/hs-2.webp', color: '#DE457D', step: 'COLLECT' },
                            { num: '03', title: 'Clinical Processing', desc: 'Our engine cross-references 50+ biomarkers across all 6 clinical fields.', img: '/images/hs-5.webp', color: '#FFB800', step: 'ANALYSE' },
                            { num: '04', title: 'Doctor-Reviewed Report', desc: 'Your certified physician reviews every finding. Receive your complete compatibility profile.', img: '/images/hs-1.webp', color: '#111112', step: 'REPORT' },
                        ].map((s, i) => (
                            <div key={i} className="group relative border border-black/10 overflow-hidden bg-white flex flex-col min-h-[380px] transition-all duration-500 hover:border-black/25 hover:shadow-[0_12px_40px_rgba(17,17,18,0.08)]">
                                <div className="relative h-52 overflow-hidden">
                                    <img 
                                        src={s.img} 
                                        alt={s.title}
                                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-widest text-white"
                                            style={{ backgroundColor: s.color }}>
                                            {s.num} / {s.step}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1 justify-between">
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest mb-3"
                                            style={{ color: s.color }}>
                                            {s.title}
                                        </h4>
                                        <p className="text-[11px] font-mono uppercase tracking-wider text-[#5A5A60] leading-relaxed">{s.desc}</p>
                                    </div>
                                    <div className="mt-6 w-full h-px" style={{ backgroundColor: s.color, opacity: 0.3 }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Full-bleed image accent band */}
                    <div className="mt-12 relative h-48 md:h-64 overflow-hidden border border-black/10">
                        <img src="/images/hero-image9.webp" alt="Couple making health decisions together"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            style={{ filter: 'grayscale(20%) contrast(95%) brightness(0.95)' }}
                            loading="lazy"
                            width={1200}
                            height={1200}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111112]/80 via-[#111112]/40 to-transparent" />
                        <div className="absolute inset-0 flex items-center px-8 md:px-16">
                            <div className="max-w-lg">
                                <p className="text-2xl md:text-4xl font-sans font-black uppercase text-white tracking-tighter leading-tight">
                                    YOUR HEALTH IS YOUR FUTURE.
                                </p>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/60 mt-3">
                                    Get clarity before the commitment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: Pricing Matrix ── */}
            <div className="section-divider" />
            <section id="pricing" className="biz-reveal py-20 md:py-28 relative overflow-hidden" aria-label="Transparent Pricing Matrix">
                {/* Background with subtle image and pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <img src="/images/hs-5.webp" alt="" aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        style={{ filter: 'grayscale(90%) contrast(80%) brightness(1.3)' }}
                        loading="lazy"
                        width={1200}
                        height={1091}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFD] via-[#FBFBFD]/95 to-[#FBFBFD]" />
                    <div className="absolute inset-0 dot-grid-fine" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 bg-[#F3F1EC] font-mono text-[9px] uppercase tracking-widest text-[#111112] font-semibold">
                            PLANS & PRICING
                        </span>
                        <SplitTextReveal 
                            tag="h3" 
                            text="SIMPLE, TRANSPARENT PRICING" 
                            className="font-sans text-3xl md:text-clamp-title font-black uppercase tracking-tighter leading-none text-[#111112]" 
                        />
                    </div>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                    {PRICING_PLANS.map((plan, i) => (
                        <article key={i} className={`biz-reveal group relative flex flex-col justify-between border bg-white text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(17,17,18,0.08)] hover:border-black/20 ${
                            plan.popular ? 'border-[#111112] bg-[#F3F1EC]/40 hover:border-[#111112]' : 'border-black/10'
                        }`}>
                            {plan.popular && (
                                <div className="border-b border-[#111112] text-white text-[9px] font-mono uppercase tracking-widest text-center py-2.5 bg-[#111112] font-bold">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[8px] font-mono text-[#5A5A60] uppercase tracking-widest">PLAN 0{i+1}</span>
                                        <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-[#111112] mt-1">{plan.title}</h4>
                                        <p className="text-[11px] font-mono uppercase tracking-wider text-[#5A5A60] mt-2 leading-relaxed">{plan.desc}</p>
                                    </div>

                                    <div className="py-4 border-t border-b border-black/10 flex items-baseline gap-1">
                                        <span className="text-3xl font-sans font-black text-[#111112]">{plan.price}</span>
                                        <span className="text-[10px] font-mono uppercase text-[#5A5A60]">{plan.per}</span>
                                        {plan.save && <span className="text-[9px] font-mono uppercase px-2 py-0.5 border border-slayy-green bg-slayy-green/5 text-slayy-green ml-auto font-semibold">{plan.save}</span>}
                                    </div>

                                    <ul className="space-y-3 font-mono text-[10px] uppercase tracking-wider text-[#3E3E42]">
                                        {plan.features.map((f, j) => (
                                            <li key={j} className="flex items-start gap-2.5">
                                                <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slayy-green" /> <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 pt-6 border-t border-black/10 space-y-4">
                                    <MagneticButton className="p-0 w-full">
                                        <button onClick={() => { setFormData(prev => ({ ...prev, plan: plan.value })); document.getElementById('advisor-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                                            className={`w-full py-4 font-mono font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                                                plan.popular ? 'bg-slayy-green text-white border-slayy-green hover:bg-slayy-green/90 shadow-[0_0_15px_rgba(23,203,150,0.35)] hover:shadow-[0_0_20px_rgba(23,203,150,0.5)]' : 'bg-transparent text-black border-black/15 hover:bg-[#FBFBFD] hover:border-black/30'
                                            }`}>
                                            <span>{plan.cta}</span> <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </button>
                                    </MagneticButton>
                                    <p className="text-[8px] text-center font-mono uppercase tracking-widest text-[#5A5A60]">{plan.outcome}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                </div>
            </section>

            {/* ── SECTION 5: Testimonials Case Histories ── */}
            <div className="section-divider" />
            <section id="testimonials" ref={testimonialsRef} className="relative overflow-hidden py-20 md:py-28 flex flex-col justify-center" aria-label="Case Registries">
                {/* Dark textured background with image */}
                <div className="absolute inset-0 pointer-events-none">
                    <img src="/images/stats-2.webp" alt="" aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        style={{ filter: 'grayscale(80%) contrast(80%) brightness(0.3)' }}
                        width={1200}
                        height={1182}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#111112]/90" />
                    {/* subtle grid */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
                <div className="relative w-full px-4 md:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 font-mono text-[9px] uppercase tracking-widest text-white/60 font-semibold">
                            FROM OUR COUPLES
                        </span>
                        <SplitTextReveal 
                            tag="h3" 
                            text="REAL STORIES, REAL IMPACT" 
                            className="font-sans text-3xl md:text-clamp-title font-black uppercase tracking-tighter leading-none text-white" 
                        />
                    </div>
                    <div className="overflow-hidden w-full group py-8">
                        <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused]">
                            {[...personas, ...personas].map((t, i) => (
                                <article key={i} className="w-[85vw] md:w-[600px] flex-shrink-0 border border-white/10 p-8 flex flex-col justify-between min-h-[280px]" style={{ backgroundColor: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">{t.type}</span>
                                        <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current text-[#FFB800]" />)}</div>
                                    </div>
                                    <p className="text-xs font-mono uppercase tracking-wider leading-relaxed text-white/70">"{t.quote}"</p>
                                </div>
                                <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">{t.names}</span>
                                        <span className="text-[9px] font-mono uppercase tracking-widest block text-white/40">{t.location}</span>
                                    </div>
                                    <div className="space-y-1 text-left sm:text-right">
                                        <div className="flex items-center sm:justify-end gap-1.5 text-[9px] font-mono font-semibold uppercase tracking-wider text-[#DE457D]">
                                            <Heart className="w-3.5 h-3.5 fill-current text-[#DE457D]" /> <span>{t.highlight}</span>
                                        </div>
                                        <div className="text-[8px] font-mono uppercase tracking-widest text-white/40">{t.impact}</div>
                                    </div>
                                </div>
                            </article>
                        ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: Advisor Form Specimen Registry ── */}
            <div className="section-divider" />
            <section id="promise" className="biz-reveal py-20 md:py-28 relative overflow-hidden bg-[#FCEEF0]" aria-label="Advisor Specimen Request">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 dot-grid opacity-40" />
                    <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-[#18CB96]/5 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#DE457D]/5 to-transparent" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 space-y-6 text-left">
                        <span className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 bg-[#F3F1EC] font-mono text-[9px] uppercase tracking-widest text-[#111112] font-semibold">
                            GET STARTED
                        </span>
                        <SplitTextReveal 
                            tag="h3" 
                            text="TALK TO AN ADVISOR" 
                            className="font-sans text-3xl md:text-clamp-title font-black uppercase tracking-tighter leading-none text-[#111112]" 
                        />
                        <p className="text-xs font-mono uppercase tracking-wider text-[#5A5A60] leading-relaxed">
                            Fill out this form and our clinical advisor will reach out within 24 hours.
                        </p>
                        <div className="space-y-4 pt-6 border-t border-black/10 font-mono text-[9px] uppercase tracking-widest">
                            {[
                                { title: '100% Encrypted & Private', desc: 'Your data is securely managed and compliant with HIPAA norms.' },
                                { title: 'Doctor-Reviewed Results', desc: 'Every report is verified by board-certified clinical experts.' },
                            ].map((p, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <div className="w-5 h-5 border border-black/10 bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 stroke-[3] text-slayy-green" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#111112]">{p.title}</h4>
                                        <p className="text-[#5A5A60] mt-0.5 leading-relaxed">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div id="advisor-form" className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="border border-black/10 p-8 text-center space-y-6 bg-white">
                                    <div className="w-12 h-12 border border-black/10 bg-[#FBFBFD] flex items-center justify-center mx-auto">
                                        <Check className="w-6 h-6 stroke-[2.5] text-slayy-green" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#111112]">YOU'RE ALL SET!</h4>
                                        <p className="text-[10px] font-mono uppercase tracking-widest mt-2 leading-relaxed max-w-sm mx-auto text-[#5A5A60]">
                                            We'll reach out to {formData.name.toUpperCase()} shortly.
                                        </p>
                                    </div>
                                    <button onClick={() => setSubmitted(false)} className="text-[10px] font-mono uppercase tracking-widest hover:underline text-[#DE457D] font-semibold">SUBMIT ANOTHER REQUEST</button>
                                </motion.div>
                            ) : (
                                <motion.form key="form" onSubmit={handleSubmit} className="border border-black/10 p-8 space-y-5 text-left bg-white">
                                    <span className="text-[8px] font-mono uppercase tracking-widest block pb-3 border-b border-black/10 text-[#5A5A60]">YOUR DETAILS</span>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { id: 'form-name-hp', name: 'name', label: 'Your Name', placeholder: 'AARAV', icon: User, error: formErrors.name },
                                            { id: 'form-partner-hp', name: 'partnerName', label: "Partner's Name", placeholder: 'RIYA', icon: Heart, error: '' },
                                        ].map((f) => (
                                            <div key={f.id}>
                                                <label htmlFor={f.id} className="text-[8px] font-mono uppercase tracking-widest block mb-1.5 text-[#5A5A60]">{f.label}</label>
                                                <div className="relative">
                                                    <input id={f.id} name={f.name} value={(formData as Record<string, string>)[f.name]} onChange={handleInput} placeholder={f.placeholder}
                                                        className={`w-full pl-9 pr-3 py-3 border border-black/10 bg-white rounded-none font-mono text-xs uppercase tracking-wider outline-none focus:border-black transition-colors ${f.error ? 'border-[#D4544C]' : ''}`}
                                                        style={{ color: '#111112' }} />
                                                    <f.icon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A60]" />
                                                </div>
                                                {f.error && <span className="text-[9px] font-mono uppercase text-[#D4544C] mt-1 block">{f.error}</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { id: 'form-email-hp', name: 'email', type: 'email', label: 'Email', placeholder: 'YOU@EMAIL.COM', icon: Mail, error: formErrors.email },
                                            { id: 'form-phone-hp', name: 'phone', type: 'tel', label: 'Phone', placeholder: '9876543210', icon: Phone, error: formErrors.phone },
                                        ].map((f) => (
                                            <div key={f.id}>
                                                <label htmlFor={f.id} className="text-[8px] font-mono uppercase tracking-widest block mb-1.5 text-[#5A5A60]">{f.label}</label>
                                                <div className="relative">
                                                    <input id={f.id} name={f.name} type={f.type} value={(formData as Record<string, string>)[f.name]} onChange={handleInput} placeholder={f.placeholder}
                                                        className={`w-full pl-9 pr-3 py-3 border border-black/10 bg-white rounded-none font-mono text-xs uppercase tracking-wider outline-none focus:border-black transition-colors ${f.error ? 'border-[#D4544C]' : ''}`}
                                                        style={{ color: '#111112' }} />
                                                    <f.icon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A60]" />
                                                </div>
                                                {f.error && <span className="text-[9px] font-mono uppercase text-[#D4544C] mt-1 block">{f.error}</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="form-plan-hp" className="text-[8px] font-mono uppercase tracking-widest block mb-1.5 text-[#5A5A60]">Plan Type</label>
                                            <div className="relative">
                                                <select id="form-plan-hp" name="plan" value={formData.plan} onChange={handleInput}
                                                    className="w-full pl-3 pr-8 py-3 border border-black/10 bg-white rounded-none font-mono text-xs uppercase tracking-wider outline-none focus:border-black cursor-pointer" style={{ color: '#111112' }}>
                                                    <option value="individual">Individual (₹799)</option>
                                                    <option value="couple">Couple (₹1,499)</option>
                                                    <option value="expert">Doctor Consultation (₹2,499)</option>
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A60]" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="form-community-hp" className="text-[8px] font-mono uppercase tracking-widest block mb-1.5 text-[#5A5A60]">Community</label>
                                            <div className="relative">
                                                <select id="form-community-hp" name="community" value={formData.community} onChange={handleInput}
                                                    className="w-full pl-3 pr-8 py-3 border border-black/10 bg-white rounded-none font-mono text-xs uppercase tracking-wider outline-none focus:border-black cursor-pointer" style={{ color: '#111112' }}>
                                                    {Object.keys(communityRisks).map(k => <option key={k} value={k}>{k}</option>)}
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A60]" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="form-notes-hp" className="text-[8px] font-mono uppercase tracking-widest block mb-1.5 text-[#5A5A60]">Anything Else? (Optional)</label>
                                        <textarea id="form-notes-hp" name="notes" value={formData.notes} onChange={handleInput}
                                            placeholder="SHARE ANY HEALTH HISTORY OR QUESTIONS..."
                                            rows={2} className="w-full p-3 border border-black/10 bg-white rounded-none font-mono text-xs uppercase tracking-wider outline-none focus:border-black resize-none" style={{ color: '#111112' }} />
                                    </div>
                                    <MagneticButton className="p-0 w-full">
                                        <button type="submit" disabled={isSubmitting}
                                            className="btn-premium w-full text-white py-4 rounded-none font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 min-h-[50px] disabled:opacity-50">
                                            {isSubmitting ? 'TRANSMITTING...' : <><span>Request Advisory Call</span><ArrowRight className="w-3.5 h-3.5" /></>}
                                        </button>
                                    </MagneticButton>
                                </motion.form>
                            )}
                                        </AnimatePresence>
                    </div>
                </div>
                </div>
            </section>

            {/* ── SECTION 7: Clinical FAQs ── */}
            <div className="section-divider" />
            <section className="biz-reveal py-20 md:py-28 relative overflow-hidden" aria-label="Documentation FAQs">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 net-grid opacity-50" />
                    <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-gradient-to-r from-[#F3F1EC] to-transparent" />
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-gradient-to-l from-[#F3F1EC] to-transparent" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16 space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 border border-black/10 bg-[#F3F1EC] font-mono text-[9px] uppercase tracking-widest text-[#111112] font-semibold">
                        HELP & FAQ
                    </span>
                    <h3 className="font-sans text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none text-[#111112]">
                        FREQUENTLY ASKED QUESTIONS
                    </h3>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <details key={idx} className="group border border-black/10 bg-white overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-xs md:text-sm font-mono uppercase font-bold text-[#111112] hover:text-[#DE457D] transition-colors select-none">
                                <span>{faq.question}</span>
                                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-open:rotate-90 flex-shrink-0 ml-4 text-[#5A5A60]" />
                            </summary>
                            <div className="px-6 pb-6 pt-1 border-t border-black/5">
                                <p className="text-xs md:text-sm leading-relaxed mt-2 text-[#5A5A60] font-mono uppercase tracking-wider">{faq.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
