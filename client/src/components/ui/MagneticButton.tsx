import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    range?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    range = 40,
    ...props
}) => {
    const magneticRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isReducedMotion) return;

        const el = magneticRef.current;
        if (!el) return;

        const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = el.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            
            // Calculate distance from center
            const distX = clientX - centerX;
            const distY = clientY - centerY;
            
            // Only magnetize if within range radius
            const distance = Math.sqrt(distX * distX + distY * distY);
            if (distance < range * 2) {
                // dampen the movement
                xTo(distX * 0.4);
                yTo(distY * 0.4);
            } else {
                xTo(0);
                yTo(0);
            }
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        // Attach listeners to a larger parent wrapper or the document to catch cursor near the button
        // But for simplicity we attach to the element itself, and we just need it to snap back on leave
        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
            el.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [range]);

    return (
        <div
            ref={magneticRef}
            className={`inline-block transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
            {...props}
        >
            <div className="w-full h-full flex items-center justify-center pointer-events-none">
                {children}
            </div>
        </div>
    );
};

export default MagneticButton;
