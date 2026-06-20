import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Shield, Lock, Heart, ArrowRight } from 'lucide-react';
import CustomCursor from './ui/CustomCursor';
import { ExitIntentModal } from './ExitIntentModal';

gsap.registerPlugin(ScrollTrigger);

const LayoutContent = () => {
    const lenis = useLenis();
    const location = useLocation();
    const progressRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // ── Progress bar + nav style via Lenis scroll ────────────────────
    useEffect(() => {
        if (!lenis) return;
        const onScroll = () => {
            if (!progressRef.current) return;
            const scroll = lenis.scroll;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = height > 0 ? (scroll / height) * 100 : 0;
            progressRef.current.style.width = pct + '%';
            progressRef.current.setAttribute('aria-valuenow', Math.round(pct).toString());
            setScrolled(scroll > 5);
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
        ? 'fixed top-0 left-0 right-0 z-50 nav-glass transition-all duration-500 py-2 md:py-3'
        : 'fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500 py-4 md:py-6';

    return (
        <>
            <CustomCursor />
            <div ref={progressRef} className="scroll-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-label="Page scroll progress indicator" />
            <a href="#main-content" className="skip-to-content">Skip to main content</a>

            <header className={navClass}>
                <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between transition-all duration-300">
                    <a href="/" className="flex items-center gap-3 group" aria-label="Slay Health Home">
                        <div className="relative">
                            <img
                                src="/images/logo.webp"
                                alt="Slay Health Logo"
                                className="h-8 md:h-10 w-auto object-contain relative z-10"
                                width={400}
                                height={120}
                            />
                        </div>
                        <span className="hidden lg:flex items-center text-[9px] font-mono font-medium tracking-widest uppercase ml-3 pl-4 leading-none text-[#5A5A60] hover:text-[#111112] transition-colors duration-300 group/navtag" style={{ borderLeft: '1px solid rgba(17,17,18,0.08)', height: '20px' }}>
                            KNOW BEFORE YOU SAY <span className="text-[#18CB96] group-hover/navtag:text-[#DE457D] transition-colors duration-300 ml-1.5 font-bold">"I DO"</span>
                        </span>
                    </a>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#how-it-works" className="text-[10px] font-mono text-[#5A5A60] hover:text-[#18CB96] transition-colors duration-300 uppercase tracking-widest relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#18CB96] hover:after:w-full after:transition-all after:duration-300">
                            How It Works
                        </a>
                        <a href="#pricing" className="text-[10px] font-mono text-[#5A5A60] hover:text-[#18CB96] transition-colors duration-300 uppercase tracking-widest relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-[#18CB96] hover:after:w-full after:transition-all after:duration-300">
                            Pricing
                        </a>
                        <a
                            href="#advisor-form"
                            className="btn-premium px-5 py-2.5 text-[10px] uppercase tracking-widest"
                        >
                            Get Started
                        </a>
                    </div>
                    <button
                        className="md:hidden border border-black/10 p-2 flex items-center justify-center transition-colors bg-[#FBFBFD]"
                        style={{ color: '#111112' }}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </nav>

                {/* Mobile Menu */}
                <div className={`md:hidden absolute top-full left-0 w-full bg-[#FBFBFD] border-b border-black/10 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 py-6 flex flex-col gap-4">
                        <a
                            href="#how-it-works"
                            className="block text-[10px] font-mono py-3 uppercase tracking-widest text-[#5A5A60] hover:text-[#111112] transition-colors"
                            style={{ borderBottom: '1px solid rgba(17,17,18,0.06)' }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            How It Works
                        </a>
                        <a
                            href="#pricing"
                            className="block text-[10px] font-mono py-3 uppercase tracking-widest text-[#5A5A60] hover:text-[#111112] transition-colors"
                            style={{ borderBottom: '1px solid rgba(17,17,18,0.06)' }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </a>
                        <a
                            href="#advisor-form"
                            className="btn-premium flex items-center justify-center gap-2 text-[10px] px-5 py-3.5 text-center uppercase tracking-widest mt-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Get Started <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </header>

            <div className="min-h-screen font-sans flex flex-col bg-[#FBFBFD] bento-grid-bg text-[#111112]">
                <main id="main-content" className="flex-1">
                    <Outlet />
                </main>

                <ExitIntentModal />

                <footer className="relative overflow-hidden py-16 md:py-24 bg-[#F3F1EC]">
                    <div className="absolute top-0 left-0 w-full h-px bg-black/10" />

                    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                        <div className="border border-black/10 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-[#FBFBFD]">
                            <div>
                                <h3 className="text-xl md:text-2xl font-sans font-black tracking-tighter text-[#111112] uppercase">
                                    Ready for complete biological clarity?
                                </h3>
                                <p className="text-xs font-mono text-[#5A5A60] mt-2 max-w-md uppercase tracking-wider">
                                    Secure your future with our doctor-reviewed premarital health screening.
                                </p>
                            </div>
                            <a href="#advisor-form" className="btn-premium px-8 py-4 text-xs tracking-widest whitespace-nowrap">
                                Book Screening
                            </a>
                        </div>

                        <div className="grid md:grid-cols-4 gap-10 md:gap-8 mb-16">
                            <div className="col-span-2 md:col-span-1 space-y-5">
                                <a href="/" className="flex items-center gap-3 group">
                                    <img src="/images/logo.webp" alt="Slay Health Logo" className="h-8 md:h-10 w-auto object-contain" width={400} height={120} />
                                </a>
                                <p className="text-[11px] leading-relaxed text-[#5A5A60] font-mono uppercase tracking-wider max-w-xs">
                                    India's first dedicated premarital health compatibility screening platform. Know before you say "I Do."
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-5 text-[#111112]">Services</h4>
                                <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest">
                                    <li><a href="#pricing" className="text-[#5A5A60] hover:text-[#111112] transition-colors">Individual Screening</a></li>
                                    <li><a href="#pricing" className="text-[#5A5A60] hover:text-[#111112] transition-colors">Couple Compatibility</a></li>
                                    <li><a href="#pricing" className="text-[#5A5A60] hover:text-[#111112] transition-colors">Expert Consultation</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-5 text-[#111112]">Support</h4>
                                <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest">
                                    <li><a href="#advisor-form" className="text-[#5A5A60] hover:text-[#111112] transition-colors">Contact Us</a></li>
                                    <li><span className="text-[#5A5A60]">info@slay.health</span></li>
                                    <li><span className="text-[#5A5A60]">+91 98765 43210</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest mb-5 text-[#111112]">Trust</h4>
                                <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest">
                                    <li className="flex items-center gap-2.5 text-[#5A5A60]">
                                        <div className="w-5 h-5 flex items-center justify-center border border-black/10 bg-white"><Shield className="w-3 h-3 text-[#111112]" /></div> HIPAA Compliant
                                    </li>
                                    <li className="flex items-center gap-2.5 text-[#5A5A60]">
                                        <div className="w-5 h-5 flex items-center justify-center border border-black/10 bg-white"><Lock className="w-3 h-3 text-[#111112]" /></div> 100% Private
                                    </li>
                                    <li className="flex items-center gap-2.5 text-[#5A5A60]">
                                        <div className="w-5 h-5 flex items-center justify-center border border-black/10 bg-white"><Heart className="w-3 h-3 text-[#DE457D]" /></div> Doctor Reviewed
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-black/10">
                            <p className="text-[9px] font-mono text-[#5A5A60] uppercase tracking-widest">
                                &copy; {new Date().getFullYear()} Slay Health. All rights reserved.
                            </p>
                            <p className="text-[9px] font-mono text-[#5A5A60] uppercase tracking-widest">
                                Crafted with ❤️ in India.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

const Layout = () => (
    <ReactLenis root options={{
        lerp: 0.05,
        wheelMultiplier: 1,
        smoothWheel: true,
    }}>
        <LayoutContent />
    </ReactLenis>
);

export default Layout;
