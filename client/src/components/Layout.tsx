import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Shield, Lock, Heart, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LayoutContent = () => {
    const lenis = useLenis();
    const location = useLocation();
    const progressRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // ── ScrollTrigger + Lenis scrollerProxy ──────────────────────────
    useEffect(() => {
        if (!lenis) return;

        ScrollTrigger.scrollerProxy(window, {
            scrollTop: (value?: number) => {
                if (value !== undefined) {
                    lenis.scrollTo(value, { immediate: true });
                }
                return lenis.scroll;
            },
            scrollLeft: () => 0,
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
        });

        ScrollTrigger.refresh();
    }, [lenis]);

    // ── Sync Lenis scroll → ScrollTrigger ────────────────────────────
    useEffect(() => {
        if (!lenis) return;
        const syncScroll = () => ScrollTrigger.update();
        lenis.on('scroll', syncScroll);
        ScrollTrigger.refresh();
        return () => { lenis.off('scroll', syncScroll); };
    }, [lenis]);

    // ── Progress bar + nav style via Lenis scroll ────────────────────
    useEffect(() => {
        if (!lenis) return;
        const onScroll = () => {
            if (!progressRef.current) return;
            const scroll = lenis.scroll;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = height > 0 ? (scroll / height) * 100 : 0;
            progressRef.current.style.width = pct + '%';
            setScrolled(scroll > 60);
        };
        lenis.on('scroll', onScroll);
        onScroll();
        return () => { lenis.off('scroll', onScroll); };
    }, [lenis]);

    // ── Anchor link interception ──────────────────────────────────────
    useEffect(() => {
        if (!lenis) return;
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]');
            if (!anchor) return;
            e.preventDefault();
            const href = (anchor as HTMLAnchorElement).getAttribute('href');
            if (!href || href === '#') return;
            const el = document.querySelector(href) as HTMLElement | null;
            if (el) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [lenis]);

    // ── Reset scroll on route change ──────────────────────────────────
    useEffect(() => {
        if (lenis) lenis.scrollTo(0, { immediate: true });
    }, [location.pathname, lenis]);

    const navClass = scrolled
        ? 'fixed top-0 left-0 right-0 z-50 glass-premium-strong shadow-sm transition-all duration-300 py-1 md:py-2'
        : 'fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 py-3 md:py-4';

    return (
        <>
            <div ref={progressRef} className="scroll-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} />
            <a href="#main-content" className="skip-to-content">Skip to main content</a>

            <header className={navClass}>
                <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between transition-all duration-300">
                    <a href="/" className="flex items-center gap-3 group" aria-label="Slay Health Home">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#DE457D] opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity" />
                            <img
                                src="/images/logo.png"
                                alt="Slay Health"
                                className="w-9 h-9 md:w-11 md:h-11 object-contain relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform"
                                width={44}
                                height={44}
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight" style={{ color: '#1a1a2e' }}>
                            Slay<span style={{ color: '#DE457D' }}>Health</span>
                        </span>
                        <span className="hidden lg:flex items-center text-[10px] font-sans font-bold tracking-widest uppercase ml-3 pl-4 leading-none" style={{ color: '#9ca3af', borderLeft: '2px solid rgba(0,0,0,0.06)', height: '24px' }}>
                            Know before you say "I Do"
                        </span>
                    </a>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#how-it-works" className="text-[11px] hover:text-[#DE457D] transition-colors font-black uppercase tracking-widest" style={{ color: '#4a5568' }}>
                            How It Works
                        </a>
                        <a href="#pricing" className="text-[11px] hover:text-[#DE457D] transition-colors font-black uppercase tracking-widest" style={{ color: '#4a5568' }}>
                            Pricing
                        </a>
                        <a
                            href="#advisor-form"
                            className="btn-premium text-[11px] text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #DE457D, #C73A6A)', boxShadow: '0 8px 24px rgba(222,69,125,0.25)' }}
                        >
                            Get Started <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                    <button
                        className="md:hidden glass-story p-2 rounded-xl flex items-center justify-center transition-colors"
                        style={{ color: '#1a1a2e' }}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div className={`md:hidden absolute top-full left-0 w-full glass-premium-strong overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 border-b border-black/5' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 py-6 flex flex-col gap-4">
                        <a
                            href="#how-it-works"
                            className="block text-xs py-3 font-black uppercase tracking-widest hover:text-[#DE457D] transition-colors"
                            style={{ color: '#1a1a2e', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            How It Works
                        </a>
                        <a
                            href="#pricing"
                            className="block text-xs py-3 font-black uppercase tracking-widest hover:text-[#DE457D] transition-colors"
                            style={{ color: '#1a1a2e', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </a>
                        <a
                            href="#advisor-form"
                            className="btn-premium flex items-center justify-center gap-2 text-xs text-white px-5 py-4 rounded-xl font-bold text-center uppercase tracking-widest mt-2"
                            style={{ background: 'linear-gradient(135deg, #DE457D, #C73A6A)', boxShadow: '0 8px 24px rgba(222,69,125,0.25)' }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Get Started <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </header>

            <div className="min-h-screen font-sans flex flex-col" style={{ background: '#FDF6F0', color: '#1a1a2e' }}>
                <main id="main-content" className="flex-1">
                    <Outlet />
                </main>

                <footer className="relative overflow-hidden py-16 md:py-24" style={{ background: '#FAF0E6' }}>
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#DE457D]/20 to-transparent" />
                    <div className="blob-pink" style={{ width: '500px', height: '500px', top: '-250px', left: '-250px', opacity: 0.3 }} />
                    <div className="blob-gold" style={{ width: '400px', height: '400px', bottom: '-200px', right: '-200px', opacity: 0.2 }} />

                    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                        <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.6)' }}>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black font-sans tracking-tight" style={{ color: '#1a1a2e' }}>Ready for complete <span className="gradient-text-gp">clarity?</span></h3>
                                <p className="text-sm mt-2 max-w-md leading-relaxed" style={{ color: '#4a5568' }}>Secure your future with our doctor-reviewed premarital health screening.</p>
                            </div>
                            <a href="#advisor-form" className="btn-premium flex items-center gap-2 text-xs text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #17CB96, #14B886)', boxShadow: '0 8px 24px rgba(23,203,150,0.25)' }}>
                                Book Screening <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="grid md:grid-cols-4 gap-10 md:gap-8 mb-16">
                            <div className="col-span-2 md:col-span-1 space-y-5">
                                <a href="/" className="flex items-center gap-3 group">
                                    <img src="/images/logo.png" alt="Slay Health" className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
                                    <span className="font-bold text-xl tracking-tight" style={{ color: '#1a1a2e' }}>Slay<span style={{ color: '#DE457D' }}>Health</span></span>
                                </a>
                                <p className="text-xs leading-relaxed max-w-xs" style={{ color: '#4a5568' }}>
                                    India's first dedicated premarital health compatibility screening platform. Know before you say "I Do."
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: '#9ca3af' }}>Services</h4>
                                <ul className="space-y-4">
                                    <li><a href="#pricing" className="text-xs font-bold hover:text-[#DE457D] transition-colors" style={{ color: '#4a5568' }}>Individual Screening</a></li>
                                    <li><a href="#pricing" className="text-xs font-bold hover:text-[#DE457D] transition-colors" style={{ color: '#4a5568' }}>Couple Compatibility</a></li>
                                    <li><a href="#pricing" className="text-xs font-bold hover:text-[#DE457D] transition-colors" style={{ color: '#4a5568' }}>Expert Consultation</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: '#9ca3af' }}>Support</h4>
                                <ul className="space-y-4">
                                    <li><a href="#advisor-form" className="text-xs font-bold hover:text-[#DE457D] transition-colors" style={{ color: '#4a5568' }}>Contact Us</a></li>
                                    <li><span className="text-xs font-bold" style={{ color: '#4a5568' }}>info@slay.health</span></li>
                                    <li><span className="text-xs font-bold" style={{ color: '#4a5568' }}>+91 98765 43210</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-5" style={{ color: '#9ca3af' }}>Trust</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-2.5 text-xs font-bold" style={{ color: '#4a5568' }}>
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white/60"><Shield className="w-3.5 h-3.5" style={{ color: '#17CB96' }} /></div> HIPAA Compliant
                                    </li>
                                    <li className="flex items-center gap-2.5 text-xs font-bold" style={{ color: '#4a5568' }}>
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white/60"><Lock className="w-3.5 h-3.5" style={{ color: '#FFB800' }} /></div> 100% Private
                                    </li>
                                    <li className="flex items-center gap-2.5 text-xs font-bold" style={{ color: '#4a5568' }}>
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white/60"><Heart className="w-3.5 h-3.5" style={{ color: '#DE457D' }} /></div> Doctor Reviewed
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-black/5">
                            <p className="text-[11px] font-bold" style={{ color: '#9ca3af' }}>
                                &copy; {new Date().getFullYear()} Slay Health. All rights reserved.
                            </p>
                            <p className="text-[11px] font-bold" style={{ color: '#9ca3af' }}>
                                Built with clarity for couples building a future together.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

const Layout = () => (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true, syncTouch: false }}>
        <LayoutContent />
    </ReactLenis>
);

export default Layout;
