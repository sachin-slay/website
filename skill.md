---
name: animated-storytelling-landing
description: >
  Use this skill when building a landing page that tells a cinematic, scroll-driven
  story with motion — not just a static marketing page. Triggers include requests for
  "scroll animations", "storytelling landing page", "animated hero", "chapter-based
  scroll", "immersive brand page", "GSAP ScrollTrigger setup", "Lenis smooth scroll",
  "cinematic landing", or any brand page where emotional narrative and motion are the
  core design brief. Also use when building React/Next.js pages that need a
  professional animation layer (GSAP + Lenis + Framer Motion combo).
version: 1.0.0
stack: Next.js 15 / React 19 / TypeScript / Tailwind CSS / GSAP / Lenis / Framer Motion
---

# Animated Storytelling Landing Page Skill

This skill gives an AI agent everything it needs to plan, storyboard, and code a
cinematic, scroll-driven storytelling landing page from scratch. The output should
feel like a **movie + product demo + emotional journey** — not a list of feature
sections.

---

## 1. NARRATIVE ARCHITECTURE FIRST (Design Before Code)

**Rule #1**: Every section must answer *"What should the user FEEL right now?"*
not *"What should the user KNOW right now?"* Feelings convert. Information informs.

### The Dead Pattern (Never build this)
```
Hero → Features → Testimonials → Pricing → CTA
```

### The Living Pattern (Always build this)
```
Curiosity → Emotion → Discovery → Proof → Desire → Action
```

### The 6-Chapter Story Arc (Map your brand to these)

| Chapter | Name | Emotional Goal | Visual Metaphor |
|---------|------|----------------|-----------------|
| 1 | **The Hook** | Shock / Intrigue | Chaos → freeze → one line of truth |
| 2 | **The Pain** | Recognition / Empathy | Visualize the old painful way |
| 3 | **The Breaking Point** | Frustration peaks | Counter, timer, progress bar at max |
| 4 | **The Discovery** | Relief / Hope | Product appears as a savior |
| 5 | **The Transformation** | Desire | Before/After — animated delta |
| 6 | **The Future** | Aspiration + Action | The world post-solution. Final CTA |

**Before writing a single line of code**, write a scene-by-scene storyboard:

```
Scene 1 — Visual Hook (0–5 seconds, above-the-fold)
  Background: [describe]
  Animation: [describe first motion]
  Copy that appears: "[Exact words]"
  Emotion target: Intrigue / Shock

Scene 2 — Interactive Pain (scroll section 1)
  Mechanic: Scroll-scrubbed progress bar / timeline / counter
  What user sees at scroll 0%: [describe]
  What user sees at scroll 100%: [describe]
  Copy: "[Words that validate the pain]"

... (continue for all chapters)
```

---

## 2. TECH STACK — LAYER BY LAYER

### Layer 1 — Smooth Scroll (Foundation)
**Library**: `lenis` (v1.x — NOT the deprecated `@studio-freight/lenis`)

```bash
npm install lenis
```

**Next.js 15 Setup** — wrap layout in `ReactLenis`:

```tsx
// app/layout.tsx or components/SmoothScroll.tsx
'use client';
import { ReactLenis } from 'lenis/react';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,           // Smoothness (lower = smoother, 0.1 is sweet spot)
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,    // Better mobile performance
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

**Lenis + GSAP ScrollTrigger Sync** (critical — without this, pins/scrubs break):

```tsx
'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

export function LenisGSAPBridge() {
  const lenis = useLenis(({ scroll }) => {
    // Sync scroll position to GSAP's ScrollTrigger
  });

  useEffect(() => {
    if (!lenis) return;

    // Method A: Event-based sync (recommended for most cases)
    lenis.on('scroll', () => ScrollTrigger.update());

    // Method B: Ticker sync (use when autoRaf: false)
    // gsap.ticker.add((time) => lenis.raf(time * 1000));
    // gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', () => ScrollTrigger.update());
    };
  }, [lenis]);

  return null;
}
```

**Accessibility**: Always respect `prefers-reduced-motion`:

```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) return; // Skip animation setup entirely
```

---

### Layer 2 — Scroll-Driven Animations (GSAP ScrollTrigger)
**Library**: `gsap` (ScrollTrigger plugin — now FREE as of 2025)

```bash
npm install gsap
```

**Core Hook for all scroll animations in React**:

```tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // All GSAP code lives here — auto-cleanup on unmount
    gsap.from('.my-element', {
      opacity: 0,
      y: 60,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.my-element',
        start: 'top 80%',
        end: 'top 40%',
        scrub: false,         // false = fires once; true = scrubs with scroll
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: containerRef });

  return <div ref={containerRef}>...</div>;
}
```

**Critical ScrollTrigger Patterns**:

#### A. Pin + Scrub (for chapter-by-chapter scroll stories)
```ts
// Pin a section and drive animation with scroll progress
gsap.timeline({
  scrollTrigger: {
    trigger: '.story-section',
    start: 'top top',
    end: '+=3000',          // 3000px of scroll = 1 "scene"
    pin: true,              // Pin the element during scroll
    scrub: 1,               // Smooth scrub (1 = 1 second lag)
    anticipatePin: 1,
  }
})
.to('.scene-element', { x: -200, opacity: 0 })
.from('.next-element', { x: 200, opacity: 0 });
```

#### B. Horizontal Scroll Section
```ts
const panels = gsap.utils.toArray<HTMLElement>('.panel');

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-container',
    pin: true,
    scrub: 1,
    end: () => '+=' + document.querySelector('.horizontal-container')!.scrollWidth,
    snap: 1 / (panels.length - 1),
  },
});
```

#### C. Parallax Layers
```ts
// Foreground moves faster than background = depth
gsap.to('.parallax-bg', {
  y: '30%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});

gsap.to('.parallax-fg', {
  y: '-15%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});
```

#### D. Counter Animation (for metrics/stats sections)
```ts
// Animate a number from 0 to target on scroll
const counter = { val: 0 };
gsap.to(counter, {
  val: 10000,
  duration: 2,
  ease: 'power2.out',
  onUpdate: () => {
    document.querySelector('.counter')!.textContent =
      Math.round(counter.val).toLocaleString();
  },
  scrollTrigger: {
    trigger: '.counter',
    start: 'top 80%',
    toggleActions: 'play none none reset',
  },
});
```

#### E. Clip-Path Reveal (cinematic scene transitions)
```ts
gsap.from('.reveal-element', {
  clipPath: 'inset(0 100% 0 0)',    // Reveal left to right
  // clipPath: 'inset(100% 0 0 0)', // Reveal top to bottom
  duration: 1.2,
  ease: 'power4.inOut',
  scrollTrigger: {
    trigger: '.reveal-element',
    start: 'top 70%',
    toggleActions: 'play none none reverse',
  },
});
```

#### F. Scale-from-Center Hero (dramatic entrance)
```ts
gsap.timeline()
  .from('.hero-image', {
    scale: 1.4,
    opacity: 0,
    duration: 1.6,
    ease: 'expo.out',
  })
  .from('.hero-text', {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 1,
    ease: 'power3.out',
  }, '-=0.8'); // overlap by 0.8s
```

---

### Layer 3 — Text Animation (SplitText / split-type)

**SplitText is now FREE in GSAP** (as of 2025). For open-source alternative use `split-type`.

```bash
npm install gsap          # SplitText included
# OR open-source alternative:
npm install split-type
```

#### Word-by-word scroll reveal (most used pattern)
```ts
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

const split = new SplitText('.headline', { type: 'words,chars' });

gsap.from(split.words, {
  opacity: 0,
  y: 60,
  rotateX: -90,
  stagger: 0.04,
  duration: 0.8,
  ease: 'back.out(1.5)',
  transformOrigin: '50% 50% -20px',
  scrollTrigger: {
    trigger: '.headline',
    start: 'top 85%',
    toggleActions: 'play none none reverse',
  },
  onComplete: () => split.revert(), // clean up spans
});
```

#### Scroll-scrubbed opacity text reveal (Medium/Linear style)
```ts
const split = new SplitText('.body-copy', { type: 'words' });

gsap.from(split.words, {
  opacity: 0.15,
  stagger: 0.03,
  scrollTrigger: {
    trigger: '.body-copy',
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: 1.2,          // each word lights up as you scroll past it
  },
});
```

#### Scramble text effect (for techy/AI brands)
```ts
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
gsap.registerPlugin(ScrambleTextPlugin);

gsap.to('.scramble-text', {
  duration: 2,
  scrambleText: {
    text: 'Your brand. Automated.',
    chars: 'upperCase',
    revealDelay: 0.5,
    speed: 0.4,
  },
});
```

---

### Layer 4 — React Component Animations (Framer Motion)

Use Framer Motion for **component-level** animations (not scroll-scrub — use GSAP for that).
Best for: modals, hover cards, page transitions, layout shifts.

```bash
npm install framer-motion
```

#### Staggered card grid reveal
```tsx
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map((item) => (
    <motion.div key={item.id} variants={card}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Magnetic hover button
```tsx
import { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.4);
    y.set((e.clientY - cy) * 0.4);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="magnetic-btn"
    >
      {children}
    </motion.button>
  );
}
```

#### Page transition (Next.js App Router)
```tsx
// components/PageTransition.tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

### Layer 5 — CSS Native Scroll-Driven Animations (Zero JS, max perf)

Use for: scroll progress bars, simple parallax, element fade-in. All off the main thread.

```css
/* Scroll progress indicator */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--accent);
  transform-origin: left;
  animation: progress linear;
  animation-timeline: scroll(root);
}

@keyframes progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

/* Element fade-in on scroll into view */
.fade-in-on-scroll {
  animation: fadeUp linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Always add reduced-motion fallback */
@media (prefers-reduced-motion: reduce) {
  .fade-in-on-scroll { animation: none; opacity: 1; }
}
```

---

## 3. ANIMATION CHOREOGRAPHY MAP

This is how to plan which tool to use for which effect:

| Animation Type | Use | Why |
|---|---|---|
| Smooth scroll feel | Lenis | Native scroll feels jerky |
| Scroll-pinned scene | GSAP ScrollTrigger + `pin: true` | Best scrub control |
| Parallax layers | GSAP ScrollTrigger `scrub: true` | Precise depth control |
| Text word-by-word reveal | GSAP SplitText + ScrollTrigger | Character-level control |
| Counter numbers | GSAP tween + `onUpdate` | Precise value interpolation |
| Clip-path reveal | GSAP `clipPath` tween | Cinematic wipe effect |
| Component stagger | Framer Motion `variants` | React-idiomatic |
| Hover magnetic | Framer Motion `useSpring` | Spring physics |
| Scroll progress bar | CSS `animation-timeline: scroll()` | Zero JS, off main thread |
| Simple fade-in-view | CSS `animation-timeline: view()` | Performant, no library |
| Page transitions | Framer `AnimatePresence` | Route-aware |
| 3D WebGL scenes | React Three Fiber + @react-three/drei | GPU-accelerated |
| Particle fields | Three.js `BufferGeometry` points | Canvas-level control |

---

## 4. PROJECT STRUCTURE (Next.js App Router)

```
app/
  layout.tsx                    ← SmoothScroll + LenisGSAPBridge here
  page.tsx                      ← Composes all scene components
  globals.css                   ← CSS variables + scroll-driven animations

components/
  landing/
    Scene1Hook.tsx              ← Above fold: visual chaos → freeze → tagline
    Scene2Pain.tsx              ← Scroll-scrubbed pain visualization
    Scene3Discovery.tsx         ← Product reveal with clip-path
    Scene4Proof.tsx             ← Animated metrics + testimonials
    Scene5Transformation.tsx    ← Before/after animated split
    Scene6CTA.tsx               ← Aspirational CTA
  animation/
    SmoothScroll.tsx            ← ReactLenis wrapper
    LenisGSAPBridge.tsx         ← Sync Lenis with GSAP
    MagneticButton.tsx          ← Framer Motion magnetic
    SplitReveal.tsx             ← Reusable GSAP SplitText component
    CounterUp.tsx               ← Scroll-triggered number counter
    ParallaxLayer.tsx           ← Reusable parallax wrapper
  ui/
    Marquee.tsx                 ← Infinite scroll marquee
    BentoGrid.tsx               ← Apple-style feature grid
    GlassMorphCard.tsx          ← Glassmorphism card
```

---

## 5. CSS DESIGN TOKEN SYSTEM

Define all values as CSS variables for consistency:

```css
:root {
  /* Core palette — commit to one dominant + one sharp accent */
  --bg:        #05050a;         /* void black / near-black */
  --surface:   #0f0f1a;
  --border:    rgba(255,255,255,0.08);
  --accent:    #ffb800;         /* amber gold / replace per brand */
  --accent-soft: rgba(255,184,0,0.12);
  --text-hi:   #ffffff;
  --text-mid:  rgba(255,255,255,0.65);
  --text-lo:   rgba(255,255,255,0.35);

  /* Typography */
  --font-display: 'Clash Display', sans-serif;
  --font-body:    'Satoshi', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Spacing rhythm */
  --section-pad: clamp(80px, 12vw, 160px);
  --content-max: 1200px;

  /* Animation easing */
  --ease-out-expo:  cubic-bezier(0.19, 1, 0.22, 1);
  --ease-in-out:    cubic-bezier(0.87, 0, 0.13, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 6. SLAY HEALTH — SPECIFIC DESIGN BRIEF

**Brand Profile**: Health & wellness brand, likely targeting modern, health-conscious Indians
(Gen Z / millennial). The name "Slay" signals bold, confident, aspirational energy —
NOT clinical/pharmaceutical. Think: Nike x health. Loud, motivating, empowering.

### Palette Direction
```
Primary BG:    Deep charcoal or rich black — #0a0a0f or #111118
Accent:        Electric health green — #00e87a  OR  coral energy — #ff4e50
Text:          Crisp white + muted grey
Surface:       Slight card elevation with glassmorphism
```

### Typography
- Display: **Clash Display** (sharp, geometric, confident) or **Neue Machina**
- Body: **Satoshi** or **Plus Jakarta Sans**
- Data: **JetBrains Mono** for metrics / numbers

### Storyboard Template for Slay Health
```
Scene 1 — Visual Hook
  Screen is dark.
  Fragmented words float: "tired", "stressed", "unhealthy", "stuck"
  They collide and shatter.
  One bold word assembles:  "SLAY."
  Tagline fades in below: "Your healthiest self starts here."

Scene 2 — The Pain
  Scroll-pinned section.
  Animated: A person's daily chaos — work, sleep deprivation, junk food.
  Progress bar fills painfully: "Day 47. Still stuck."

Scene 3 — The Breaking Point
  Counter spins: 87% of people abandon health goals by week 3.
  Pause. One sentence: "What if it didn't have to be this hard?"

Scene 4 — Discovery
  Product UI appears — smooth clip-path reveal from center.
  App/dashboard materializes. AI coach appears. Personalized plan generates.

Scene 5 — Transformation
  Split-screen animation. Left = before (grey, heavy). Right = after (vivid, energized).
  Metrics fly upward: energy +40%, sleep quality +60%, goals hit 9/10 weeks.

Scene 6 — CTA
  Full-bleed video/animation: person in motion, thriving.
  "The healthiest version of you is one scroll away."
  Button: "Start Your Journey"
```

---

## 7. PERFORMANCE RULES

| Rule | Detail |
|---|---|
| **will-change sparingly** | Only on actively animating elements, remove after animation |
| **GPU transforms only** | Animate `transform` + `opacity` only. Never `top/left/width/height` |
| **Kill ScrollTriggers on unmount** | Always return cleanup from `useGSAP` — auto-handled by hook |
| **Batch DOM reads** | GSAP does this internally; don't mix custom scroll listeners |
| **Mobile: disable heavy effects** | Use `matchMedia` to skip 3D/particle effects on mobile |
| **Reduced motion** | Every animation must have a `prefers-reduced-motion` escape |
| **Lazy load sections** | Use Next.js dynamic imports for heavy scene components |
| **Font loading** | Use `next/font` with `display: swap` — never FOIT |

```tsx
// Mobile performance guard
import { gsap } from 'gsap';

const mm = gsap.matchMedia();
mm.add('(min-width: 768px)', () => {
  // Complex 3D / particle animations — desktop only
  setupParticleField();
});
mm.add('(max-width: 767px)', () => {
  // Simplified, CSS-only animations for mobile
  setupMobileAnimations();
});
```

---

## 8. REUSABLE ANIMATION COMPONENTS (Copy-Paste Ready)

### Infinite Marquee (logos, metrics, testimonials)
```tsx
// components/ui/Marquee.tsx
'use client';
import { motion } from 'framer-motion';

interface MarqueeProps {
  items: React.ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

export function Marquee({ items, speed = 30, direction = 'left', pauseOnHover = true }: MarqueeProps) {
  const duplicated = [...items, ...items];

  return (
    <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: direction === 'left' ? '-50%' : '0%' }}
        initial={{ x: direction === 'left' ? '0%' : '-50%' }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
        style={{ willChange: 'transform' }}
      >
        {duplicated.map((item, i) => (
          <div key={i} className="flex-shrink-0">{item}</div>
        ))}
      </motion.div>
    </div>
  );
}
```

### SplitReveal Component (reusable word-by-word reveal)
```tsx
// components/animation/SplitReveal.tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface SplitRevealProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  type?: 'chars' | 'words' | 'lines';
  stagger?: number;
  delay?: number;
  className?: string;
}

export function SplitReveal({
  children,
  as: Tag = 'h2',
  type = 'words',
  stagger = 0.05,
  delay = 0,
  className,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const split = new SplitText(ref.current, { type });
    const targets = type === 'chars' ? split.chars : type === 'lines' ? split.lines : split.words;

    gsap.from(targets, {
      opacity: 0,
      y: 50,
      rotateX: -80,
      stagger,
      delay,
      duration: 0.7,
      ease: 'back.out(1.4)',
      transformOrigin: '0% 50% -20px',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      onComplete: () => split.revert(),
    });
  }, { scope: ref });

  return <Tag ref={ref as any} className={className}>{children}</Tag>;
}
```

### CounterUp Component
```tsx
// components/animation/CounterUp.tsx
'use client';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CounterUpProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CounterUp({ from = 0, to, suffix = '', prefix = '', duration = 2, className }: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const obj = { value: from };
    gsap.to(obj, {
      value: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(obj.value).toLocaleString()}${suffix}`;
        }
      },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        toggleActions: 'play none none reset',
      },
    });
  }, { scope: ref });

  return <span ref={ref} className={className}>{prefix}{from.toLocaleString()}{suffix}</span>;
}
```

### ParallaxLayer Component
```tsx
// components/animation/ParallaxLayer.tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;      // positive = moves down slower (bg), negative = moves up faster (fg)
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.3, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(ref.current, {
      y: () => ref.current!.offsetHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: ref });

  return <div ref={ref} className={className}>{children}</div>;
}
```

---

## 9. INSTALL CHECKLIST

```bash
# Core animation stack
npm install gsap @gsap/react
npm install lenis

# React animation
npm install framer-motion

# Fonts (Next.js built-in)
# Use next/font/google for Satoshi, Plus Jakarta Sans, etc.
# For Clash Display / Neue Machina — download and use next/font/local

# Optional: 3D scenes
npm install three @react-three/fiber @react-three/drei

# Optional: SVG animation
# Use GSAP's MorphSVG (now free) or svgator for pre-exported SVGs
```

---

## 10. COMMON PITFALLS & FIXES

| Problem | Cause | Fix |
|---|---|---|
| ScrollTrigger animations trigger too early | Lenis not synced | Add `lenis.on('scroll', ScrollTrigger.update)` |
| Animations fire on server (Next.js) | GSAP not client-guarded | Always `'use client'` + wrap in `useGSAP` or `useEffect` |
| Pin section height wrong | Content not measured at mount | Add `invalidateOnRefresh: true` to ScrollTrigger |
| Jittery parallax on mobile | `syncTouch` enabled | Set `syncTouch: false` in Lenis options |
| Text jumps after SplitText | spans remain in DOM | Always call `split.revert()` in `onComplete` |
| Memory leaks | GSAP ScrollTriggers not killed | Use `useGSAP` hook — it auto-kills on unmount |
| Two RAF loops | Both Lenis and GSAP ticking | If using GSAP ticker, set `autoRaf: false` in Lenis |
| Hydration error | Lenis on server | Ensure `'use client'` and wrap in `useEffect` |

---

## 11. ANIMATION PROMPT TEMPLATE (For Spline / Rive / Lottie assets)

When commissioning or prompting for 3D/motion assets to embed:

```
SPLINE SCENE PROMPT:
"Create a [dark/light] background 3D scene showing [describe object/concept].
The scene should have [ambient particle field / floating geometric shapes / glowing orbs].
Color palette: [primary color] with [accent color] emission.
The scene should be interactive: [mouse parallax / cursor follow / click interaction].
Export as Spline embed URL or .splinecode file.
Camera: [overhead / isometric / first-person / orbit].
Animation loop: [idle float / rotation / breathing scale]."

RIVE ANIMATION PROMPT:
"Design a Rive animation for [element name].
States: [idle], [hover], [active], [exit].
Idle: [describe loop behavior].
On hover: [describe transition].
Color scheme: [specify].
Size: [WxH]. Export as .riv file."

LOTTIE PROMPT:
"Create a Lottie JSON animation for [element].
Duration: [X] seconds. Loop: [yes/no].
Style: [flat / 3D / outline / filled].
Key frames: at 0% [describe], at 50% [describe], at 100% [describe].
Colors: [list hex values].
Export from After Effects → Bodymovin or from LottieFiles editor."
```

---

## 12. QUICK REFERENCE — GSAP EASING CHEATSHEET

```ts
// Entrances (elements coming in)
ease: 'power3.out'          // Clean, professional
ease: 'expo.out'            // Dramatic, fast start slow end
ease: 'back.out(1.7)'       // Slight overshoot — playful
ease: 'elastic.out(1, 0.5)' // Bouncy — use sparingly

// Exits (elements leaving)
ease: 'power3.in'
ease: 'expo.in'

// Scrubbed / scroll-tied (always use linear)
ease: 'none'                // Required for scrub animations

// Spring-like
ease: 'power4.out'         // Very snappy — feels physical

// Custom cubic bezier
ease: 'cubic-bezier(0.19, 1, 0.22, 1)'  // Expo-out equivalent
```

---

*End of Animated Storytelling Landing Page Skill*
*Version 1.0.0 — June 2026*
*Use alongside: frontend-design SKILL.md for aesthetic direction*