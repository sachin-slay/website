import React, { useRef, useEffect } from 'react';
import { Heart, AlertCircle, Dna, AlertTriangle, Shield, Sparkles, Check, ChevronDown, ArrowRight, Baby, Activity, Brain, Users, Award, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    { value: '1 in 8', label: 'Indians carry Thalassemia trait', color: '#D4544C', desc: 'Mostly asymptomatic' },
    { value: '40%', label: 'Couples face fertility challenges', color: '#111112', desc: 'Treatable if caught early' },
    { value: '80%', label: 'STD carriers show zero symptoms', color: '#FFB800', desc: 'Overlooked in arranged marriage' },
];

const PILLARS = [
    { icon: Dna,      label: 'Genetic Compatibility',  color: '#111112' },
    { icon: Baby,     label: 'Fertility Potential',     color: '#D4544C' },
    { icon: Heart,    label: 'Chronic Health Match',    color: '#111112' },
    { icon: Activity, label: 'Infection Status',        color: '#FFB800' },
    { icon: Brain,    label: 'Mental & Metabolic',      color: '#111112' },
    { icon: Users,    label: 'Lifestyle & Habits',      color: '#5A5A60' },
];

const TRUST_METRICS = [
    { icon: Shield, value: '100%', label: 'Private & Encrypted' },
    { icon: Award,  value: 'NABL', label: 'Certified Labs' },
    { icon: Users,  value: '450+', label: 'Couples Verified' },
    { icon: Star,   value: '4.8★', label: 'Average Rating' },
];

export const HeroStory: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // ── Desktop Cinematic Pinning (>= 1024px) ──────────────────────
            mm.add('(min-width: 1024px)', () => {
                // Set initial states
                gsap.set(['.chapter-2-content', '.chapter-3-content', '.chapter-4-content', '.chapter-5-content'], { y: 40, opacity: 0, pointerEvents: 'none' });
                gsap.set('.chapter-1-content', { y: 0, opacity: 1, pointerEvents: 'auto' });

                // Set initial background states
                gsap.set('.ch-bg', { opacity: 0, scale: 1.05 });
                gsap.set('.ch-bg-1', { opacity: 0.09, scale: 1 });

                // Chapter dot states
                gsap.set('.chapter-dot-1', { backgroundColor: '#18CB96', borderColor: '#18CB96', scale: 1.2, boxShadow: '0 0 8px rgba(24, 203, 150, 0.6)' });
                gsap.set(['.chapter-dot-2', '.chapter-dot-3', '.chapter-dot-4', '.chapter-dot-5'], { backgroundColor: 'transparent', borderColor: 'rgba(17,17,18,0.2)', scale: 1, boxShadow: 'none' });

                // Play smooth entry animation for Chapter 1 on mount (independent of scroll)
                const introTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
                introTL
                    .fromTo('.ch1-line-1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 })
                    .fromTo('.ch1-line-2', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.45')
                    .fromTo('.ch1-line-3', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.55')
                    .fromTo('.ch1-sub', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
                    .fromTo('.ch1-aarav', { x: -40, y: 15, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.75 }, '-=0.55')
                    .fromTo('.ch1-riya', { x: 40, y: 15, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.75 }, '-=0.65')
                    .fromTo('.ch1-checklist', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.55');

                const storyTL = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#story-pin',
                        start: 'top top',
                        end: '+=3800',
                        pin: true,
                        pinSpacing: true,
                        scrub: 1.5,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    }
                });

                // ── Transition: Ch 1 Out / Ch 2 In ──
                storyTL
                    // Hold Chapter 1 briefly
                    .to({}, { duration: 0.5 })
                    
                    // Fade & Lift Chapter 1 Out
                    .to('.chapter-1-content', { opacity: 0, y: -40, pointerEvents: 'none', duration: 1.0, ease: 'power2.inOut' })
                    // Fade & Lift Chapter 2 In
                    .to('.chapter-2-content', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1.0, ease: 'power2.inOut' }, '<')

                    // BG image transition: ch-bg-1 out, ch-bg-2 in
                    .to('.ch-bg-1', { opacity: 0, scale: 1.06, duration: 1.2, ease: 'power2.inOut' }, '<')
                    .to('.ch-bg-2', { opacity: 0.1, scale: 1, duration: 1.2, ease: 'power2.inOut' }, '<')

                    // Trackers update
                    .to('.chapter-dot-1', { backgroundColor: 'transparent', borderColor: 'rgba(17,17,18,0.2)', scale: 1, boxShadow: 'none', duration: 0.4 }, '<')
                    .to('.chapter-dot-2', { backgroundColor: '#18CB96', borderColor: '#18CB96', scale: 1.2, boxShadow: '0 0 8px rgba(24, 203, 150, 0.6)', duration: 0.4 }, '<')

                    // Chapter 2 internal animations
                    .fromTo('.ch2-line-1', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.2')
                    .fromTo('.ch2-line-2', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.1')
                    .fromTo('.ch2-line-3', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.1')
                    .fromTo('.ch2-characters', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '<0.1')
                    .fromTo('.ch2-dna-icon', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '<0.1')
                    .fromTo('.ch2-stats', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '<0.1')
                    .to({}, { duration: 0.8 });

                // ── Transition: Ch 2 Out / Ch 3 In ──
                storyTL
                    .to('.chapter-2-content', { opacity: 0, y: -40, pointerEvents: 'none', duration: 1.0, ease: 'power2.inOut' })
                    .to('.chapter-3-content', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1.0, ease: 'power2.inOut' }, '<')

                    // BG image transition: ch-bg-2 out, ch-bg-3 in
                    .to('.ch-bg-2', { opacity: 0, scale: 1.06, duration: 1.2, ease: 'power2.inOut' }, '<')
                    .to('.ch-bg-3', { opacity: 0.09, scale: 1, duration: 1.2, ease: 'power2.inOut' }, '<')

                    // Trackers update
                    .to('.chapter-dot-2', { backgroundColor: 'transparent', borderColor: 'rgba(17,17,18,0.2)', scale: 1, boxShadow: 'none', duration: 0.4 }, '<')
                    .to('.chapter-dot-3', { backgroundColor: '#18CB96', borderColor: '#18CB96', scale: 1.2, boxShadow: '0 0 8px rgba(24, 203, 150, 0.6)', duration: 0.4 }, '<')

                    // Chapter 3 internal animations
                    .fromTo('.ch3-line-1', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.2')
                    .fromTo('.ch3-line-2', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.1')
                    .fromTo('.ch3-aarav-tag', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '<0.15')
                    .fromTo('.ch3-riya-tag', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '<')
                    .fromTo('.ch3-warning', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '<0.1')
                    .to({}, { duration: 0.8 });

                // ── Transition: Ch 3 Out / Ch 4 In ──
                storyTL
                    .to('.chapter-3-content', { opacity: 0, y: -40, pointerEvents: 'none', duration: 1.0, ease: 'power2.inOut' })
                    .to('.chapter-4-content', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1.0, ease: 'power2.inOut' }, '<')

                    // BG image transition: ch-bg-3 out, ch-bg-4 in
                    .to('.ch-bg-3', { opacity: 0, scale: 1.06, duration: 1.2, ease: 'power2.inOut' }, '<')
                    .to('.ch-bg-4', { opacity: 0.08, scale: 1, duration: 1.2, ease: 'power2.inOut' }, '<')

                    // Trackers update
                    .to('.chapter-dot-3', { backgroundColor: 'transparent', borderColor: 'rgba(17,17,18,0.2)', scale: 1, boxShadow: 'none', duration: 0.4 }, '<')
                    .to('.chapter-dot-4', { backgroundColor: '#18CB96', borderColor: '#18CB96', scale: 1.2, boxShadow: '0 0 8px rgba(24, 203, 150, 0.6)', duration: 0.4 }, '<')

                    // Chapter 4 internal animations
                    .fromTo('.ch4-line-1', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.2')
                    .fromTo('.ch4-line-2', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.1')
                    .fromTo('.ch4-pillars', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, '<0.1')
                    .fromTo('.ch4-cta-text', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '<0.1')
                    .to({}, { duration: 0.8 });

                // ── Transition: Ch 4 Out / Ch 5 In ──
                storyTL
                    .to('.chapter-4-content', { opacity: 0, y: -40, pointerEvents: 'none', duration: 1.0, ease: 'power2.inOut' })
                    .to('.chapter-5-content', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 1.0, ease: 'power2.inOut' }, '<')

                    // BG image transition: ch-bg-4 out, ch-bg-5 in
                    .to('.ch-bg-4', { opacity: 0, scale: 1.06, duration: 1.2, ease: 'power2.inOut' }, '<')
                    .to('.ch-bg-5', { opacity: 0.09, scale: 1, duration: 1.2, ease: 'power2.inOut' }, '<')

                    // Trackers update
                    .to('.chapter-dot-4', { backgroundColor: 'transparent', borderColor: 'rgba(17,17,18,0.2)', scale: 1, boxShadow: 'none', duration: 0.4 }, '<')
                    .to('.chapter-dot-5', { backgroundColor: '#18CB96', borderColor: '#18CB96', scale: 1.2, boxShadow: '0 0 8px rgba(24, 203, 150, 0.6)', duration: 0.4 }, '<')

                    // Chapter 5 internal animations
                    .fromTo('.ch5-line-1', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.2')
                    .fromTo('.ch5-line-2', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power4.out' }, '<0.1')
                    .fromTo('.ch5-characters', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '<0.1')
                    .fromTo('.ch5-trust-cards', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out' }, '<0.1')
                    .fromTo('.ch5-cta', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '<0.1')
                    .to({}, { duration: 1.2 });
            });

            // ── Mobile Responsive Transforms (< 1024px) ──────────────────────
            mm.add('(max-width: 1023px)', () => {
                const mobileFades = gsap.utils.toArray('.mobile-reveal-feed');
                mobileFades.forEach((el: any) => {
                    gsap.fromTo(el, 
                        { y: 30, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: el,
                                start: 'top 85%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );
                });
            });
        }, containerRef);

        return () => {
            ctx.revert(); // cleans up timelines/ScrollTriggers safely
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* ── DESKTOP VIEW ONLY (Cinematic Pinning) ────────────────────────── */}
            <div id="story-pin" className="hidden lg:block relative w-full h-screen overflow-hidden net-grid-strong">
                
                {/* Background Images — subtle watermarks that crossfade between chapters */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <img src="/images/hs-4.webp" alt="" aria-hidden="true" width={1200} height={1098} loading="lazy"
                        className="ch-bg ch-bg-1 absolute inset-0 w-full h-full object-cover object-center"
                        style={{ opacity: 0.09, filter: 'grayscale(50%) contrast(90%) brightness(1.1)', willChange: 'opacity, transform' }} />
                    <img src="/images/hs-2.webp" alt="" aria-hidden="true" width={1200} height={1098} loading="lazy"
                        className="ch-bg ch-bg-2 absolute inset-0 w-full h-full object-cover object-center"
                        style={{ opacity: 0, filter: 'grayscale(50%) contrast(90%) brightness(1.1)', willChange: 'opacity, transform' }} />
                    <img src="/images/hs-3.webp" alt="" aria-hidden="true" width={1200} height={1098} loading="lazy"
                        className="ch-bg ch-bg-3 absolute inset-0 w-full h-full object-cover object-center"
                        style={{ opacity: 0, filter: 'grayscale(50%) contrast(90%) brightness(1.1)', willChange: 'opacity, transform' }} />
                    <img src="/images/hs-1.webp" alt="" aria-hidden="true" width={1200} height={1098} loading="lazy"
                        className="ch-bg ch-bg-4 absolute inset-0 w-full h-full object-cover object-center"
                        style={{ opacity: 0, filter: 'grayscale(50%) contrast(90%) brightness(1.1)', willChange: 'opacity, transform' }} />
                    <img src="/images/hs-6.webp" alt="" aria-hidden="true" width={1200} height={1098} loading="lazy"
                        className="ch-bg ch-bg-5 absolute inset-0 w-full h-full object-cover object-center"
                        style={{ opacity: 0, filter: 'grayscale(50%) contrast(90%) brightness(1.1)', willChange: 'opacity, transform' }} />
                    {/* Cream overlay to keep text legible */}
                    <div className="absolute inset-0 bg-[#FBFBFD]/55" />
                </div>

                {/* Background Grid Lines */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
                    {/* Technical Grid lines */}
                    <div className="absolute left-[20%] top-0 bottom-0 w-px bg-black/[0.06]" />
                    <div className="absolute left-[40%] top-0 bottom-0 w-px bg-black/[0.06]" />
                    <div className="absolute left-[60%] top-0 bottom-0 w-px bg-black/[0.06]" />
                    <div className="absolute left-[80%] top-0 bottom-0 w-px bg-black/[0.06]" />
                    <div className="absolute top-[20%] left-0 right-0 h-px bg-black/[0.06]" />
                    <div className="absolute top-[40%] left-0 right-0 h-px bg-black/[0.06]" />
                    <div className="absolute top-[60%] left-0 right-0 h-px bg-black/[0.06]" />
                    <div className="absolute top-[80%] left-0 right-0 h-px bg-black/[0.06]" />
                    
                    {[
                        { x: '20%', y: '20%' }, { x: '40%', y: '20%' }, { x: '60%', y: '20%' }, { x: '80%', y: '20%' },
                        { x: '20%', y: '40%' }, { x: '40%', y: '40%' }, { x: '60%', y: '40%' }, { x: '80%', y: '40%' },
                        { x: '20%', y: '60%' }, { x: '40%', y: '60%' }, { x: '60%', y: '60%' }, { x: '80%', y: '60%' },
                        { x: '20%', y: '80%' }, { x: '40%', y: '80%' }, { x: '60%', y: '80%' }, { x: '80%', y: '80%' },
                    ].map((pt, idx) => (
                        <div key={idx} className="absolute text-[11px] font-mono text-black/15 -translate-x-1/2 -translate-y-1/2" style={{ left: pt.x, top: pt.y }}>+</div>
                    ))}
                </div>

                {/* Chapter Progress Tracker Indicator */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-35">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className={`w-1.5 h-1.5 border border-black/20 rounded-none transition-all duration-300 chapter-dot-${num}`} />
                    ))}
                </div>

                {/* Chapter 1: The Perfect Match */}
                <div className="chapter-1-content absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-4 z-10">
                    <h1 className="sr-only">Premarital Health Compatibility Screening for Couples in India</h1>
                    <div className="ch1-headline flex flex-col items-center">
                        <div className="overflow-hidden">
                            <div className="ch1-line-1 text-clamp-hero font-sans font-black uppercase text-[#111112]">THEY</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="ch1-line-2 text-clamp-hero font-sans font-black uppercase text-[#111112]">CHECKED</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="ch1-line-3 text-clamp-hero font-sans font-black uppercase text-[#DE457D]">EVERYTHING.</div>
                        </div>
                    </div>

                    <div className="overflow-hidden mt-6">
                        <p className="ch1-sub font-mono text-[10px] uppercase tracking-widest text-[#5A5A60] text-center max-w-xl">
                            KUNDLI • SALARY • FAMILY BACKGROUND • HOROSCOPE
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-12 mt-12">
                        <div className="ch1-aarav flex flex-col items-center border border-black/10 p-2 bg-[#FBFBFD] chromatic-image-wrapper">
                            <div className="character-frame w-32 h-44 border border-black/10">
                                <img src="/images/character_aarav.webp" alt="Aarav" className="w-full h-full object-cover object-top chromatic-image" width={128} height={176} fetchpriority="high" />
                            </div>
                            <span className="mt-3 font-mono text-[9px] uppercase tracking-widest text-[#111112]">AARAV</span>
                        </div>
                        <div className="ch1-riya flex flex-col items-center border border-black/10 p-2 bg-[#FBFBFD] chromatic-image-wrapper">
                            <div className="character-frame w-32 h-44 border border-black/10">
                                <img src="/images/character_riya.webp" alt="Riya" className="w-full h-full object-cover object-top chromatic-image" width={128} height={176} fetchpriority="high" />
                            </div>
                            <span className="mt-3 font-mono text-[9px] uppercase tracking-widest text-[#111112]">RIYA</span>
                        </div>
                    </div>

                    <div className="overflow-hidden mt-8">
                        <div className="ch1-checklist flex flex-wrap justify-center gap-2">
                            {['Kundli ✓', 'Salary ✓', 'Family ✓', 'Education ✓', 'Horoscope ✓'].map((item) => (
                                <span key={item} className="border border-black/10 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-[#111112] bg-white transition-all duration-300 hover:border-[#18CB96] hover:text-[#18CB96] hover:-translate-y-[1px] hover:shadow-[0_2px_8px_rgba(24,203,150,0.1)]">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#5A5A60]">Scroll to continue</span>
                        <ChevronDown className="w-4 h-4 text-[#5A5A60]" />
                    </div>
                </div>

                {/* Chapter 2: The Blindspot */}
                <div className="chapter-2-content absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-4 z-10">
                    <h2 className="sr-only">Chapter 2: The Premarital Biology Blindspot</h2>
                    <div className="ch2-headline flex flex-col items-center">
                        <div className="overflow-hidden">
                            <div className="ch2-line-1 text-clamp-hero font-sans font-black uppercase text-[#111112]">BUT NOBODY</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="ch2-line-2 text-clamp-hero font-sans font-black uppercase text-[#D4544C]">CHECKED</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="ch2-line-3 text-clamp-hero font-sans font-black uppercase text-[#111112]">THE BIOLOGY.</div>
                        </div>
                    </div>

                    <div className="ch2-characters flex items-center justify-center gap-8 mt-12">
                        <div className="border border-black/10 p-2 bg-[#FBFBFD] chromatic-image-wrapper">
                            <div className="w-32 h-44 overflow-hidden border border-black/10">
                                <img src="/images/character_aarav.webp" alt="Aarav" className="w-full h-full object-cover object-top chromatic-image" width={128} height={176} loading="lazy" />
                            </div>
                        </div>
                        
                        <div className="ch2-dna-icon flex items-center justify-center">
                            <div className="w-12 h-12 border border-black/10 bg-[#FBFBFD] flex items-center justify-center">
                                <Dna className="w-6 h-6 text-[#DE457D]" />
                            </div>
                        </div>

                        <div className="border border-black/10 p-2 bg-[#FBFBFD] chromatic-image-wrapper">
                            <div className="w-32 h-44 overflow-hidden border border-black/10">
                                <img src="/images/character_riya.webp" alt="Riya" className="w-full h-full object-cover object-top chromatic-image" width={128} height={176} loading="lazy" />
                            </div>
                        </div>
                    </div>

                    <div className="ch2-stats grid grid-cols-3 gap-4 mt-12 max-w-2xl w-full">
                        {STATS.map((stat, i) => (
                            <div key={i} className="border border-black/10 bg-[#FBFBFD] p-5 text-left rounded-none">
                                <span className="text-2xl md:text-3xl font-black font-sans block" style={{ color: stat.color }}>{stat.value}</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#111112] font-semibold mt-2 block">{stat.label}</span>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-[#5A5A60] mt-1 block">{stat.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chapter 3: The Hidden Risk */}
                <div className="chapter-3-content absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-4 z-10">
                    <h2 className="sr-only">Chapter 3: The Hidden Risk of Thalassemia Carrier Status</h2>
                    <div className="ch3-headline flex flex-col items-center">
                        <div className="overflow-hidden">
                            <div className="ch3-line-1 text-clamp-hero font-sans font-black uppercase text-[#111112]">BOTH CARRY</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="ch3-line-2 text-clamp-hero font-sans font-black uppercase text-[#D4544C]">THALASSEMIA.</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-12 mt-12">
                        <div className="flex flex-col items-center">
                            <div className="relative border border-black/10 p-2 bg-[#FBFBFD]">
                                <div className="w-32 h-44 border border-black/10 overflow-hidden">
                                    <img src="/images/character_aarav.webp" alt="Aarav" className="w-full h-full object-cover object-top filter grayscale contrast-125" width={128} height={176} loading="lazy" />
                                </div>
                                <div className="ch3-aarav-tag absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 border border-[#D4544C] bg-[#FBFBFD] text-[#D4544C] text-[8px] font-mono uppercase tracking-wider font-semibold">
                                        CARRIER
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="relative border border-black/10 p-2 bg-[#FBFBFD]">
                                <div className="w-32 h-44 border border-black/10 overflow-hidden">
                                    <img src="/images/character_riya.webp" alt="Riya" className="w-full h-full object-cover object-top filter grayscale contrast-125" width={128} height={176} loading="lazy" />
                                </div>
                                <div className="ch3-riya-tag absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 border border-[#D4544C] bg-[#FBFBFD] text-[#D4544C] text-[8px] font-mono uppercase tracking-wider font-semibold">
                                        CARRIER
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ch3-warning border border-black/10 bg-[#F3F1EC] flex items-start gap-3 mt-12 max-w-md px-5 py-4">
                        <AlertTriangle className="w-5 h-5 text-[#D4544C] flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] font-mono uppercase tracking-wider leading-relaxed text-[#3E3E42]">
                            ASYMPTOMATIC carriers hide recessive variants. Both Aarav and Riya carry alleles that create a <strong className="text-[#D4544C]">1 in 4 chance</strong> of major genetic disorders in their children.
                        </p>
                    </div>
                </div>

                {/* Chapter 4: The Clarity */}
                <div className="chapter-4-content absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-4 z-10">
                    <h2 className="sr-only">Chapter 4: The Premarital Compatibility Solution</h2>
                    <div className="ch4-headline flex flex-col items-center">
                        <div className="overflow-hidden">
                            <div className="ch4-line-1 text-clamp-hero font-sans font-black uppercase text-[#111112]">KNOW BEFORE</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="ch4-line-2 text-clamp-hero font-sans font-black uppercase text-[#DE457D]">YOU SAY "I DO"</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-12 max-w-2xl w-full">
                        {PILLARS.map((p, i) => (
                            <div key={i} className="ch4-pillars border border-black/10 bg-[#FBFBFD] p-4 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:border-[#18CB96] hover:shadow-[0_4px_16px_rgba(24,203,150,0.06)] group">
                                <div className="w-8 h-8 border border-black/5 bg-[#F3F1EC] flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#18CB96] group-hover:border-[#18CB96]">
                                    <p.icon className="w-4 h-4 text-[#111112] transition-colors duration-300 group-hover:text-white" />
                                </div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#111112] transition-colors duration-300 group-hover:text-[#18CB96]">{p.label}</span>
                            </div>
                        ))}
                    </div>

                    <p className="ch4-cta-text text-xs font-mono uppercase tracking-wider text-center mt-8 max-w-lg leading-relaxed text-[#5A5A60]">
                        Slay Health's clinical testing maps 50+ biomarkers across genetics, fertility, infectious profiles and chronic health baselines in a single coordinate sample.
                    </p>
                </div>

                {/* Chapter 5: The Future */}
                <div className="chapter-5-content absolute inset-0 flex flex-col items-center justify-center overflow-hidden px-4 z-10">
                    <h2 className="sr-only">Chapter 5: Confirmed Compatibility and Safe Future Paths</h2>
                    <div className="ch5-headline flex flex-col items-center">
                        <div className="overflow-hidden">
                            <div className="ch5-line-1 text-clamp-hero font-sans font-black uppercase text-[#111112]">CLEAR</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="ch5-line-2 text-clamp-hero font-sans font-black uppercase text-slayy-green">BIO-PATHS.</div>
                        </div>
                    </div>

                    <div className="ch5-characters flex items-center justify-center gap-12 mt-12">
                        {['character_aarav', 'character_riya'].map((c, idx) => (
                            <div key={c} className="flex flex-col items-center">
                                <div className="border border-black/10 p-2 bg-[#FBFBFD] chromatic-image-wrapper">
                                    <div className="w-32 h-44 border border-black/10 overflow-hidden">
                                        <img src={`/images/${c}.webp`} alt="Screened" className="w-full h-full object-cover object-top chromatic-image" width={128} height={176} loading="lazy" />
                                    </div>
                                </div>
                                <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 border border-slayy-green bg-[#FBFBFD] text-slayy-green text-[8px] font-mono uppercase tracking-wider font-semibold">
                                    <Check className="w-3 h-3 stroke-[2.5]" /> SCREENED [0{idx+1}]
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-4 gap-3 mt-12 max-w-2xl w-full">
                        {TRUST_METRICS.map((m, i) => (
                            <div key={i} className="ch5-trust-cards border border-black/10 bg-[#FBFBFD] p-4 text-left">
                                <m.icon className="w-5 h-5 mb-2 text-[#111112]" />
                                <span className="text-xl font-black block font-sans text-[#111112]">{m.value}</span>
                                <span className="text-[9px] font-mono uppercase tracking-widest text-[#5A5A60]">{m.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="ch5-cta flex gap-4 mt-12">
                        <MagneticButton className="p-0">
                            <a href="#advisor-form" className="btn-premium px-10 py-4.5 block">
                                Register Screening
                            </a>
                        </MagneticButton>
                        <MagneticButton className="p-0">
                            <a href="/reports/GeneticsReport.pdf" target="_blank" rel="noopener noreferrer" className="border border-black/10 bg-[#FBFBFD] px-8 py-4.5 text-[11px] font-mono uppercase tracking-widest text-[#111112] hover:bg-[#F3F1EC] transition-colors block">
                                View Technical Report
                            </a>
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* ── MOBILE VIEW ONLY (Vertical Reading Feed) ────────────────────── */}
            <div className="lg:hidden block px-4 py-20 space-y-20 bg-[#FBFBFD]">
                
                {/* Chapter 1 */}
                <article className="mobile-reveal-feed border border-black/10 p-6 bg-white space-y-6">
                    <h2 className="text-4xl font-sans font-black tracking-tighter leading-none text-[#111112] uppercase">
                        THEY CHECKED <span className="text-[#DE457D]">EVERYTHING.</span>
                    </h2>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#5A5A60] border-t border-black/5 pt-4">
                        KUNDLI • SALARY • FAMILY • HOROSCOPE
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-black/10 p-2 bg-[#FBFBFD] chromatic-image-wrapper">
                            <div className="aspect-[3/4] overflow-hidden border border-black/10">
                                <img src="/images/character_aarav.webp" alt="Aarav" className="w-full h-full object-cover object-top chromatic-image" width={128} height={170} loading="lazy" />
                            </div>
                            <span className="block mt-2 font-mono text-[8px] uppercase text-center text-[#5A5A60]">AARAV</span>
                        </div>
                        <div className="border border-black/10 p-2 bg-[#FBFBFD] chromatic-image-wrapper">
                            <div className="aspect-[3/4] overflow-hidden border border-black/10">
                                <img src="/images/character_riya.webp" alt="Riya" className="w-full h-full object-cover object-top chromatic-image" width={128} height={170} loading="lazy" />
                            </div>
                            <span className="block mt-2 font-mono text-[8px] uppercase text-center text-[#5A5A60]">RIYA</span>
                        </div>
                    </div>
                </article>

                {/* Chapter 2 */}
                <article className="mobile-reveal-feed border border-black/10 p-6 bg-white space-y-6">
                    <h2 className="text-4xl font-sans font-black tracking-tighter leading-none text-[#111112] uppercase">
                        BUT NOBODY CHECKED THE <span className="text-[#D4544C]">BIOLOGY.</span>
                    </h2>
                    <div className="space-y-3">
                        {STATS.map((stat, i) => (
                            <div key={i} className="border border-black/10 bg-[#FBFBFD] p-4 text-left">
                                <span className="text-2xl font-black block" style={{ color: stat.color }}>{stat.value}</span>
                                <span className="text-[9px] font-mono uppercase tracking-widest text-[#111112] font-bold block mt-1">{stat.label}</span>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-[#5A5A60] block mt-0.5">{stat.desc}</span>
                            </div>
                        ))}
                    </div>
                </article>

                {/* Chapter 3 */}
                <article className="mobile-reveal-feed border border-black/10 p-6 bg-white space-y-6">
                    <h2 className="text-4xl font-sans font-black tracking-tighter leading-none text-[#111112] uppercase">
                        BOTH ARE THALASSEMIA <span className="text-[#D4544C]">CARRIERS.</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-black/10 p-2 bg-[#FBFBFD]">
                            <div className="aspect-[3/4] overflow-hidden border border-black/10 relative">
                                <img src="/images/character_aarav.webp" alt="Aarav" className="w-full h-full object-cover object-top filter grayscale contrast-125" width={128} height={170} loading="lazy" />
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#D4544C] text-white font-mono text-[7px] uppercase">CARRIER</span>
                            </div>
                        </div>
                        <div className="border border-black/10 p-2 bg-[#FBFBFD]">
                            <div className="aspect-[3/4] overflow-hidden border border-black/10 relative">
                                <img src="/images/character_riya.webp" alt="Riya" className="w-full h-full object-cover object-top filter grayscale contrast-125" width={128} height={170} loading="lazy" />
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#D4544C] text-white font-mono text-[7px] uppercase">CARRIER</span>
                            </div>
                        </div>
                    </div>
                    <div className="border border-black/10 bg-[#F3F1EC] p-4 text-[9px] font-mono uppercase text-[#3E3E42] leading-relaxed">
                        BOTH LOOK HEALTHY, YET THEIR OFFSPRING HAS A 25% RISK OF INHERITING THALASSEMIA MAJOR.
                    </div>
                </article>

                {/* Chapter 4 */}
                <article className="mobile-reveal-feed border border-black/10 p-6 bg-white space-y-6">
                    <h2 className="text-4xl font-sans font-black tracking-tighter leading-none text-[#111112] uppercase">
                        KNOW BEFORE YOU SAY <span className="text-[#DE457D]">"I DO".</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                        {PILLARS.map((p, i) => (
                            <div key={i} className="border border-black/10 bg-[#FBFBFD] p-3 flex items-center gap-2">
                                <p.icon className="w-4 h-4 text-[#111112]" />
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#111112]">{p.label}</span>
                            </div>
                        ))}
                    </div>
                </article>

                {/* Chapter 5 */}
                <article className="mobile-reveal-feed border border-black/10 p-6 bg-white space-y-6 text-center">
                    <h2 className="text-4xl font-sans font-black tracking-tighter leading-none text-[#111112] uppercase">
                        CLEAR <span className="text-slayy-green">BIO-PATHS.</span>
                    </h2>
                    <div className="flex justify-center gap-6 py-4">
                        <div className="w-24 border border-black/10 p-1.5 bg-[#FBFBFD]">
                            <img src="/images/character_aarav.webp" alt="Aarav" className="w-full aspect-[3/4] object-cover object-top filter grayscale contrast-125" width={80} height={107} loading="lazy" />
                        </div>
                        <div className="w-24 border border-black/10 p-1.5 bg-[#FBFBFD]">
                            <img src="/images/character_riya.webp" alt="Riya" className="w-full aspect-[3/4] object-cover object-top filter grayscale contrast-125" width={80} height={107} loading="lazy" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <a href="#advisor-form" className="btn-premium w-full py-4 text-center block">
                            Register Screening
                        </a>
                        <a href="/reports/GeneticsReport.pdf" target="_blank" rel="noopener noreferrer" className="border border-black/10 bg-[#FBFBFD] w-full py-4 text-[10px] font-mono uppercase tracking-widest text-[#111112] block">
                            View Sample Report
                        </a>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default HeroStory;
