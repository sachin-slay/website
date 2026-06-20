import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
    const ringRef = useRef<HTMLDivElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const ring = ringRef.current;
        if (!ring) return;

        // Hide follower initially
        gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0 });

        // Add class to document element
        document.documentElement.classList.add('custom-cursor-active');

        // GSAP smooth positional follow for the follower ring
        const xToRing = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power3.out' });
        const yToRing = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power3.out' });

        let isVisibleFlag = false;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisibleFlag) {
                gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' });
                isVisibleFlag = true;
            }
            xToRing(e.clientX);
            yToRing(e.clientY);
        };

        const handleMouseLeaveWindow = () => {
            gsap.to(ring, { scale: 0, duration: 0.3, ease: 'power2.in' });
            isVisibleFlag = false;
        };

        // Detect hover elements dynamically to toggle expansion state
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            const interactive = target.closest('a, button, select, input, textarea, [role="button"], .interactive-hover');
            setIsHovered(!!interactive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeaveWindow);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeaveWindow);
            window.removeEventListener('mouseover', handleMouseOver);
            document.documentElement.classList.remove('custom-cursor-active');
        };
    }, []);

    // Only render custom follower on fine pointer devices (desktop)
    return (
        <div className="pointer-events-none fixed inset-0 z-[99999] hidden md:block">
            {/* Outer Follower Ring */}
            <div
                ref={ringRef}
                className={`cursor-ring fixed top-0 left-0 ${
                    isHovered ? 'hovered' : ''
                }`}
            />
        </div>
    );
};

export default CustomCursor;
