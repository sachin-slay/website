import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextRevealProps {
    text: string;
    className?: string;
    tag?: keyof JSX.IntrinsicElements;
}

export const SplitTextReveal: React.FC<SplitTextRevealProps> = ({ text, className = '', tag: Tag = 'div' }) => {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isReducedMotion || !containerRef.current) return;

        const words = containerRef.current.querySelectorAll('.word-wrapper');
        
        gsap.fromTo(words, 
            { y: '100%', opacity: 0 },
            { 
                y: '0%', 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.05, 
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, { scope: containerRef });

    return (
        <Tag ref={containerRef as any} className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="flex flex-wrap gap-[0.25em]">
                {text.split(' ').map((word, i) => (
                    <span key={i} className="overflow-hidden inline-block align-bottom">
                        <span className="word-wrapper inline-block">{word}</span>
                    </span>
                ))}
            </span>
        </Tag>
    );
};
