# Landing Page Evaluation Matrix & Ground Rules

## Purpose
This document serves as the absolute source of truth for evaluating landing pages for SEO compliance, Core Web Vitals, and structural integrity. The evaluating agent must strictly adhere to these objective metrics and binary checks to eliminate subjective bias and prevent hallucination.

---

## 1. Core Web Vitals & Performance (Lighthouse 100 Target)

Animations must not degrade performance. Evaluate the page implementation against the following strict technical boundaries.

### Performance Thresholds
* **Largest Contentful Paint (LCP):** ≤ 2.5 seconds (Target: Hero section text/image rendered).
* **Interaction to Next Paint (INP):** ≤ 200 milliseconds (Ensures animations feel responsive).
* **Cumulative Layout Shift (CLS):** 0.0 (Strictly zero layout shifts caused by dynamic content or late-loading animations).

### Animation & Rendering Rules
* **Composite-Only Properties:** Animations must only utilize `transform` (scale, translate, rotate) and `opacity`. Any animation triggering `layout` or `paint` (e.g., animating `width`, `height`, `top`, `left`, `margin`) constitutes an automatic **FAIL**.
* **Hardware Acceleration:** Animated elements must leverage hardware acceleration using properties like `will-change: transform` or `transform: translateZ(0)`.
* **Font Loading:** Custom fonts must use `font-display: swap` to eliminate render-blocking behavior.
* **Media Optimization:** All image assets must be modern formats (WebP/AVIF), explicitly specify `width` and `height` attributes to reserve space, and employ native lazy loading (`loading="lazy"`) unless they are above-the-fold priority elements.

---

## 2. Technical & Semantic SEO Metrics

An AI agent must audit the DOM structure to ensure maximum search engine crawlability and indexability.

### Document Hierarchy
* **Single H1 Rule:** Exactly one `<h1>` tag must exist per page, containing the primary focus keyword.
* **Semantic Progression:** Heading tags must follow a strict nested order (`<h1>` → `<h2>` → `<h3>`). Skipping levels (e.g., `<h1>` directly to `<h4>`) is a structural violation.
* **Semantic Text HTML5:** Key sections must use structural elements (`<main>`, `<header>`, `<footer>`, `<section>`, `<article>`) instead of nested generic `<div>` wrappers.

### Meta & Header Schema
* **Title Tag:** 50–60 characters; must include the primary keyword at the beginning.
* **Meta Description:** 120–150 characters; must contain a clear call-to-action (CTA) and focus keyword.
* **Open Graph (OG) Tags:** `og:title`, `og:description`, `og:image`, and `og:type` must be explicitly declared in the `<head>`.
* **Structured Data:** Valid JSON-LD schema (e.g., `Organization`, `WebApplication`, or `Product`) must be present and error-free according to Schema.org standards.

---

## 3. Accessibility (a11y) & Mobile Responsiveness

High SEO rankings require an optimal, accessible experience across all device form factors.

* **Interactive Target Size:** All buttons, links, and animated interactive elements must have a minimum hit target size of **48x48 pixels** to satisfy mobile-friendly compliance.
* **ARIA for Animations:** If an animation hides or reveals text/content dynamically, the state must be accurately reflected via ARIA attributes (e.g., `aria-expanded="true/false"`, `aria-hidden="true/false"`).
* **Color Contrast:** Text elements must meet a minimum WCAG AA contrast ratio of **4.5:1** against their background.

---

## 4. AI Agent Evaluation & Scoring Rubric

The evaluating agent must parse the landing page code/URL and calculate a score based on this fixed weighting matrix. Do not approximate or guess values.

| Category | Weight | Target Metric | Failure Condition |
| :--- | :--- | :--- | :--- |
| **Performance & LCP** | 30% | LCP ≤ 2.5s | Page takes > 3.0s to render primary element. |
| **Visual Stability** | 20% | CLS = 0.0 | Any element shifts layout post-render (CLS > 0.1). |
| **Semantic SEO** | 25% | 100% Valid Hierarchy | Missing H1, multiple H1s, or broken heading order. |
| **Meta & Schema** | 15% | Present & Valid | Missing explicit title, description, or valid JSON-LD. |
| **Accessibility** | 10% | 100% Compliance | Touch targets < 48px or low contrast ratios. |

### Strict Output Format for the Agent
When running an evaluation, the agent must output its findings using the following structured layout:

```markdown
### [PASS/FAIL] Landing Page Audit Report

#### 1. Quantitative Scores
* Performance Score: [X/30]
* Visual Stability Score: [X/20]
* Semantic SEO Score: [X/25]
* Meta/Schema Score: [X/15]
* Accessibility Score: [X/10]
* **Total Aggregated Score:** [Sum]/100

#### 2. Specific Code Violations
* *Performance:* [List any unoptimized animations or layout-triggering properties found]
* *SEO:* [List any missing tags or structural errors]
* *Stability:* [Identify specific elements causing layout shifts]

#### 3. Prescriptive Fixes
* [Provide direct, actionable code or structural changes to achieve a 100/100 score]