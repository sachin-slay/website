# Landing Page Context: Slay Health

This document contains a comprehensive synthesis of the design tokens, assets, copy, target demographics, and storytelling flow used for building and refining the **Slay Health** landing page.

---

## 1. Logo & High-Res Assets
* **Logo**: `logo.png` (Dimensions: 16:9 ratio style layout). Displays the stylized Slay Health logo.
* **Vector Illustrations**: `hs-1.svg` (High-resolution doctor consultation graphic).
* **Placeholder Assets**: `placeholder.svg` (Generic clean component placeholder).

*All assets are located in the [assets](file:///Users/mitulbhatia/Desktop/landing_page_slayyhealth/website/assets/) directory.*

---

## 2. Brand Colors & Typography

### Core Color Palette
* **Primary Brand Green**: `#17CB96` (Used for trust accents, NABL/doctor badges, and high-priority secondary CTAs).
* **Secondary Brand Pink**: `#DE457D` (Used for female-focused sections, styling highlights, and gradients).
* **Main CTA Red**: `#D4544C` (RGB `212, 84, 76` - used for prominent action buttons, "Get Started" buttons, and critical UI highlights).
* **Coral Action Text**: `#f97171` (Used for warning elements and error status texts).
* **Light Pink Background**: `#FCEEF0` (Used as the page-wide layout background color).
* **Brand Gradient**: Linear gradient from Primary Green `#17CB96` to Secondary Pink `#DE457D`.

### Typography
* **Sans-Serif Font (UI/Body)**: `'Inter'`, `'SF Pro Display'`, system-ui, sans-serif. Used for layout menus, details, pricing grids, and long-form descriptive copy.
* **Handwriting Script Font (Headings/Callouts)**: `'Caveat'`, cursive. Used for friendly, human-feeling, emotive title overlays, handwritten scribble underlines, and focus annotations.

### CSS Highlighting Utilities
* **Organic Highlights**:
  * Yellow/Mint: `rgba(59, 208, 156, 0.3)`
  * Purple: `rgba(139, 92, 246, 0.25)`
  * Pink: `rgba(222, 69, 125, 0.25)`
  * Blue: `rgba(14, 165, 233, 0.25)`
  * Green: `rgba(16, 185, 129, 0.25)`
* **Underline Accents**:
  * Blue Wavy Scribble: `.curly-underline` (`#0EA5E9`, wavy, 6px offset)
  * Orange Wavy Scribble: `.curly-scribble-underline` (`#FFA500`, wavy, 6px offset)

---

## 3. Key Services & Offerings
Slay Health offers **Premarital Health Compatibility Screening**. The service evaluates 6 critical biological and medical compatibility fields:
1. **Genetic Compatibility** (25% weight): Thalassemia, Sickle Cell anemia, blood group compatibility. (1 in 8 Indians carry the Thalassemia trait; 25% risk of transmission if both are carriers).
2. **Fertility Potential** (25% weight): AMH, FSH, Semen parameters. (40% of compatibility concerns relate to fertility timing).
3. **Chronic Health Match** (20% weight): Diabetes, Blood Pressure, Liver/Kidney baseline profiles.
4. **Infection Status** (10% weight): HIV, Hepatitis B/C, STDs. (80% of carriers are asymptomatic).
5. **Mental & Metabolic Health** (10% weight): Vitamin levels, stress markers, thyroid.
6. **Lifestyle & Habits** (10% weight): Diet, sleep patterns, physical activity, family history analysis.

### Pricing Structure
* **Individual Health Clarity (₹799)**: Single-person assessment covering 50+ markers, fertility readiness, genetic traits, and personalized next steps.
* **Complete Compatibility (₹1,499)**: Dual-partner screening (save ₹600) including genetic matches, fertility alignment, combined reports, and a couple's discussion guide.
* **Expert-Reviewed Confidence (₹2,499)**: Everything in the Couple plan, plus a personal doctor review of results and a 30-minute private video consultation with custom action planning.

---

## 4. Target Audience
* **Progressive Couples**: Millennial and Gen Z couples who are getting married soon and believe in starting their marriage with open medical transparency, scientific baseline planning, and confidence.
* **Families & Parents**: Families facilitating introductions who want secure, private health verification.
* **High-Risk Individuals**: Individuals with known family histories of chronic illnesses (diabetes, cardiac conditions) or hereditary conditions (thalassemia).

---

## 5. Main Goal of the Landing Page
* **Lead Generation & Support Consultation**: Directing users to "Talk to an Advisor" or fill out the `/contact` form.
* **Primary Conversion**: Having couples select a pricing tier and start the registration process.
* **Educational Engagement**: Informing users about premarital health facts (using real numbers) to remove cultural taboos around health screenings.

---

## 6. Selected Visuals & Graphics
* **Bento Grid Layout**: Used in the Hero section to show professional and authentic imagery (consultations, lab environments, testing processes, and supportive couple photos).
* **Story Visuals**: Dynamic charts and cost-comparison UI elements mapping the expense of preventative care vs. the cost of late-stage interventions (e.g. IVF costs ₹8-15L vs. ₹15k preventative supplements).

---

## 7. Recommended Look, Feel & Motion
* **Text Carousel**: Animated text transition cycling through critical focus areas: "Family Planning", "Family Health", "Chronic Disease", "Lifestyle", and "Mental Health".
* **Framer Motion Micro-Animations**: Smooth fade-in effects on load, subtle hover states scaling buttons (`scale-102`), and glowing drop-shadows.
* **Exit Intent Trigger**: A custom exit-intent modal triggers if the cursor leaves the window bounds, offering a quick risk assessment lead capture.

---

## 8. Storytelling Flow
The page structure maps a logical emotional journey:
1. **Empathy & Tension (Hero)**: Prompting the user to say "YES" to marriage with real medical clarity, not just fingers crossed.
2. **The Problem (Real Numbers & Testimonials)**: Exposing standard statistics in India (Infertility, STIs, Chronic illness, Genetics) backed by raw anonymous couple quotes.
3. **The Solution (6 Critical Areas)**: Explaining the scope of the premarital screening.
4. **Onboarding Triggers (Personas)**: Inviting users to begin based on their unique setup (Family introduction, self-planned marriage, or dating).
5. **The Value / Pricing (Pricing plans)**: Showcasing affordable pricing tiers (starting at ₹799) with trust guarantees (Doctor-reviewed, NABL certified, 100% private).
6. **Social Proof (Testimonials)**: Reassuring the user with testimonials from couples who gained peace of mind.
7. **Final CTA**: Highlighting the emotional cost of delay (uncertainty, regret, IVF costs) and directing them to "Get Clarity Now".

---

## 9. 3D Character Illustration Prompts
Use these precise prompts to generate matching visual assets for the storytelling elements:

*   **Aarav (Husband Character)**:
    > A modern 3D claymation-style character portrait of a 29-year-old Indian man, Aarav, smiling, clean studio lighting, warm pastel background, corporate-memphis meets modern Pixar style, transparent background look, friendly and approachable.
*   **Riya (Wife Character)**:
    > A modern 3D claymation-style character portrait of a 28-year-old Indian woman, Riya, smiling, clean studio lighting, warm pastel background, corporate-memphis meets modern Pixar style, transparent background look, friendly and approachable.
*   **Compatibility Icon / Shield**:
    > A glossy 3D render of a medical safety shield with a glowing green DNA helix embossed in the center, transparent background, soft reflective shadows, high fidelity, 8k resolution.

