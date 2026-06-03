# Frontend Context: Slay Health (website/client)

This document provides a concise reference to the frontend codebase context, architecture, and technology stack for the **Slay Health** web application.

---

## 🛠️ Technology Stack
* **Core:** React (v18.3.1) with TypeScript, built using Vite (v5.4.1).
* **Styling:** TailwindCSS with custom typography configurations (e.g., handwriting style font `.font-script` for titles/highlights).
* **Animations:** Framer Motion (for smooth micro-animations, slide-ins, and active-tab transitions).
* **UI Components:** Built using standard Radix UI primitives (Accordion, Alert Dialog, Hover Card, Tabs, Select, Toast, etc.).
* **State Management:** Custom React Context ([AppContext.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/context/AppContext.tsx)) combined with TanStack React Query for query fetching, caching, and state synchronization.
* **Icons:** Lucide React icons.

---

## 📁 Key File Structure & Architecture

### 1. Global Setup & Routing
* **[main.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/main.tsx)**: Standard React client-side entry point.
* **[App.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/App.tsx)**: Main application wrapper defining routing paths, wraps pages under a shared [Layout](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/components/Layout.tsx) component, and exposes global context providers (`QueryClientProvider`, `TooltipProvider`, `Toaster`, `AppProvider`).
* **[index.css](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/index.css)**: Holds root colors, HSL color tokens, Tailwind directives, custom fonts (`@import` for modern Google fonts like outfit/cursive scripts), and specific animation definitions.

### 2. State & Context Management
* **[AppContext.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/context/AppContext.tsx)**:
  * **Language Support:** Manages global localization language configuration (`en`, `hi`, `bn`, `te`, `ta`, `gu`, `kn`, `mr`, `pa`, `ur`).
  * **Viewing Modes:** Tracks who is viewing the compatibility report (`candidate` | `parent` | `counselor` | `couple`).
  * **User Profiles:** Stores the self/candidate profiles and comparative prospect details (demographics, meeting source, lifestyle traits).
  * **Matches State:** Manages the active premarital compatibility scoring matches (`Match` interface) and dynamically computes compatibility scores (ranges from `70-99`).

### 3. Main Functional Pages (`src/pages/`)
The client app contains **18 views**:
* **[HomePage.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/pages/HomePage.tsx):** High-impact landing page featuring real medical risks (infertility statistics, STD transmissions, chronic illness family history, and genetic carriers). Displays testimonials, pricing tiers, and trust signals.
* **[LoginPage.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/pages/LoginPage.tsx):** Dynamic login/signup flow with authentication onboarding.
* **[QuestionnairePage.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/pages/QuestionnairePage.tsx):** Step-by-step health and lifestyle questionnaire for the candidate.
* **[AddProspectPage.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/pages/AddProspectPage.tsx):** Custom questionnaire page targeting the matrimonial prospect.
* **[ReportsPage.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/pages/ReportsPage.tsx):** Renders dynamic compatibility reports based on five main sections: pathology, genetics, lifestyle, mental health, and radiology.
* **[ScoringMatrixPage.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/pages/ScoringMatrixPage.tsx):** Explains how compatibility scores are formulated through scientific weights.
* **Other Informational Pages:** Clinical Safety, Trust/Privacy, and Why Premarital Screenings Matter.

### 4. Interactive Components (`src/components/`)
* **[LifestyleForm.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/components/LifestyleForm.tsx):** Comprehensive questionnaire form gathering habits (smoking, drinking, activity level), physical stats (height, weight, waist circumference), and menstrual/cycle info.
* **[CitySearch.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/components/CitySearch.tsx) & [OccupationSearch.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/components/OccupationSearch.tsx):** Specialized autocomplete components mapping user inputs to localized data options.
* **[StoryVisuals.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/components/StoryVisuals.tsx):** Renders interactive, modern visual aids (infographics comparing medical risk statistics and average healthcare costs vs. premarital screenings).
* **[ScoreGauge.tsx](file:///Users/pranavsingh/Desktop/untitled%20folder%202/slay_health/website/client/src/components/ScoreGauge.tsx):** SVG gauge demonstrating the overall match compatibility score.

### 5. Datasets (`src/data/`)
* **`communityRisks.ts`**: Regional disease risk statistics for localization.
* **`personas.ts`**: Onboarding context templates (e.g. self-introduced couples vs. family-arranged introductions).
* **`pricingPlans.ts`**: Details features & pricing ranges starting at ₹799.
* **`sampleReport.ts`**: Hardcoded sample compatibility output metrics.
* **`testimonials.ts`**: Success stories from couples who found clarity using premarital screenings.

---

## 🎨 Branding, Styles & Typography Context

To maintain design continuity and premium visual appeal across the application:

### 1. Typography & Fonts
* **Sans-Serif Font:** `'Inter'`, `'SF Pro Display'`, system-ui, sans-serif (used for UI elements, labels, body copy, and secondary headings).
* **Handwriting Script Font (`.font-script`):** `'Caveat'`, cursive (used for emotive headings, highlights, callouts, and emphasis lines).

### 2. Core Color Palette
* **Primary Brand Green:** `#17CB96` (`--brand-green`, `--primary` variable `160 77% 45%`).
* **Secondary Brand Pink:** `#DE457D` (`--brand-pink`, `--secondary` variable `340 70% 55%`).
* **Coral Text:** `#f97171` (`.text-coral-500`).
* **Light Pink Background:** `#FCEEF0` (`.bg-brand-pink-light`).
* **Main CTA Red:** `#D4544C` (used for focal actions, like the "Get Started" buttons).

### 3. Decorative Styles & Highlights
* **Wavy Underlines:**
  * Blue wavy underline: `.curly-underline` (uses `#0EA5E9` with wavy style, offset `6px`).
  * Orange wavy underline: `.curly-scribble-underline` (uses `#FFA500` with wavy style, offset `6px`).
* **Organic Highlight Blobs:** Use rotated inline backgrounds to create hand-drawn effects:
  * Purple: `.organic-highlight-purple` (`rgba(139, 92, 246, 0.25)`)
  * Pink: `.organic-highlight-pink` (`rgba(222, 69, 125, 0.25)`)
  * Blue: `.organic-highlight-blue` (`rgba(14, 165, 233, 0.25)`)
  * Yellow/Mint: `.organic-highlight-yellow` (`rgba(59, 208, 156, 0.3)`)
  * Green: `.organic-highlight-green` (`rgba(16, 185, 129, 0.25)`)
  * Lavender: `.organic-highlight-lavender` (`rgba(167, 139, 250, 0.3)`)

### 4. Interactive Call-to-Actions & Gradients
* **Core Brand Gradient:** `.gradient-brand` (a linear gradient from `#17CB96` to `#DE457D`).
* **Interactive Buttons (`.btn-gradient`):**
  * Applies the primary gradient.
  * Transitions smoothly on hover: shifts background slightly, scales up (`scale-102`), and applies a glowing drop-shadow (`rgba(23, 203, 150, 0.3)`).

