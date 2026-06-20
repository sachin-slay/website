import React, { useEffect } from 'react';
import gsap from 'gsap';

const HeroBento = () => {
    useEffect(() => {
        const words = ["clinical clarity", "genetic confidence", "future health certainty"];
        let currentIndex = 0;
        const interval = setInterval(() => {
            const el = document.getElementById('rotating-text');
            if (el) {
                gsap.to(el, {
                    y: -20, opacity: 0, duration: 0.3, onComplete: () => {
                        currentIndex = (currentIndex + 1) % words.length;
                        el.innerText = words[currentIndex];
                        gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 });
                    }
                });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[90vh]">
            <div className="lg:w-1/2 z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#18CB96]/30 bg-[#18CB96]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A6C4D] font-bold rounded-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#18CB96] animate-pulse"></span>
                    India's First Premarital Screening
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black uppercase tracking-tighter leading-[0.9] text-[#111112]">
                    Know Before <br />
                    <span className="text-[#DE457D] curly-underline">You Say "I Do."</span>
                </h1>
                
                <p className="font-mono text-xs md:text-sm text-[#5A5A60] uppercase tracking-wider leading-relaxed max-w-lg">
                    Slay Health delivers <span id="rotating-text" className="text-[#DE457D] font-bold inline-block">clinical clarity</span> for couples. We analyze genetics, fertility, and chronic risks so you can build your future on certainty, not assumptions.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href="#advisor-form" className="btn-premium px-8 py-4 text-xs tracking-widest text-center">
                        Check Compatibility
                    </a>
                    <a href="#how-it-works" className="px-8 py-4 text-xs tracking-widest border border-black/10 hover:border-black/30 transition-colors text-center font-mono uppercase font-semibold">
                        How It Works
                    </a>
                </div>
            </div>

            <div className="lg:w-1/2 w-full grid grid-cols-12 grid-rows-6 gap-2 md:gap-3 h-[50vh] lg:h-[70vh]">
                {/* Main LCP Image */}
                <div className="col-span-8 row-span-4 rounded-xl overflow-hidden relative border border-black/5 shadow-sm">
                    <img 
                        src="/images/hs-3.webp" 
                        alt="Clinical consultation" 
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        width={1200}
                        height={825}
                    />
                </div>
                
                {/* Secondary Images */}
                <div className="col-span-4 row-span-3 rounded-xl overflow-hidden relative border border-black/5 shadow-sm">
                    <img 
                        src="/images/hs-1.webp" 
                        alt="Lab testing" 
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        width={1200}
                        height={1098}
                    />
                </div>

                <div className="col-span-4 row-span-3 rounded-xl overflow-hidden relative border border-black/5 shadow-sm">
                    <img 
                        src="/images/hs-6.webp" 
                        alt="Doctor reviewing results" 
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        loading="lazy"
                        width={1200}
                        height={1098}
                    />
                </div>

                <div className="col-span-5 row-span-2 rounded-xl overflow-hidden relative border border-black/5 shadow-sm">
                    <img 
                        src="/images/hs-4.webp" 
                        alt="Couple" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        loading="lazy"
                        width={1200}
                        height={1098}
                    />
                </div>

                <div className="col-span-3 row-span-2 rounded-xl overflow-hidden relative border border-black/5 shadow-sm">
                    <img 
                        src="/images/hs-2.webp" 
                        alt="Blood sample" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        loading="lazy"
                        width={1200}
                        height={1095}
                    />
                </div>

                {/* Additional accent blocks to fill the grid */}
                <div className="col-span-12 lg:hidden" />
            </div>
        </section>
    );
};

export default HeroBento;
