# Alok Kumawat Portfolio

## Original problem statement
Build a premium, responsive, dark-first single-page portfolio for Alok Kumawat, a Java Full Stack Developer transitioning into Cloud/DevOps, with smooth navigation, light mode, real career content, projects, education, achievements, and a frontend contact form.

## Architecture decisions
- React single-page frontend (CRA/Craco starter); no backend used for the static portfolio.
- CSS custom properties + polish.css layer for the premium animation system.
- Animation stack: framer-motion (scroll reveals, stagger, layoutId nav pill, useScroll timeline, MotionConfig reducedMotion="user"), react-parallax-tilt (project cards, desktop only), react-countup (stats).
- Below-fold sections (Experience/Projects/Education/Achievements/Contact/Footer) lazy-loaded via React.lazy.
- EmailJS browser integration prepared through @emailjs/browser and env vars (still unconfigured — graceful fallback).

## Implemented
- Core portfolio: Navbar, Hero cockpit, About, Skills, Experience, Projects, Education, Achievements, Contact (EmailJS fallback), Footer with real content, resume PDF CTA, LinkedIn/GitHub links. Emergent watermark removed.
- 2026-06 FULL VISUAL REDESIGN (agent-tested iteration_5, ~98% pass; back-to-top fix self-verified):
  - Design system: near-black #0a0a0f, electric blue→violet gradient (#5b8cff→#a855f7) + cyan (#22d3ee), Space Grotesk oversized clamp headings, grain SVG-noise overlay, animated mesh + drifting gradient blobs, glassmorphism throughout, ease-out-expo cubic-bezier(.16,1,.3,1).
  - Page-load intro animation (IntroLoader.jsx, 1.5s "Alok." scale/fade, skipped on reduced motion).
  - Hero: character-level gradient name reveal (per-char background-clip fix), word-stagger statement, typewriter roles, mouse parallax, floating icon chips with independent y-oscillation, magnetic CTA buttons with cursor-following glow (motionKit Magnetic).
  - Navbar: floating glass pill (fixed, centered, rounded), shrinks on scroll, layoutId active pill, full-screen mobile overlay menu with staggered oversized links + body scroll lock.
  - Sections: SectionHeading component with gradient span + self-drawing accent line; glow gradient-border cards; scroll-drawn timeline; tilt project cards with overlays; count-up stats; glass contact form with focus glow.
  - Guardrails intact: transform/opacity-only, prefers-reduced-motion + MotionConfig, touch disabling for tilt/parallax/magnetic/cursor, lazy below-fold sections, zero overflow 320–1440px. Footer back-to-top uses programmatic scrollTo.
  - Libraries: framer-motion 11.18, react-parallax-tilt 1.7, react-countup 6.5 (all in package.json).

## Security (2026-06 audit — CONDITIONAL PASS → fixes applied, verified iteration_6 at 100%)
- Frontend clean: no XSS sinks, all target=_blank use rel=noreferrer, no secrets in code/build; PostHog key is a public client key.
- SEC-001 fixed: removed unused POST/GET /api/status routes (unauthenticated unbounded DB writes); backend is now a GET /api/ health stub only.
- SEC-002 fixed: CORS allow_credentials=False, methods limited to GET; verified no allow-credentials header emitted (ingress adds its own wildcard headers, safe without credentials).
- Hardening: GENERATE_SOURCEMAP=false in frontend/.env (0 .map files in build).
- Security regression suite: /app/backend/tests/backend_test.py (4 pytest tests).
- Deferred (low): explicit CORS origin pinning, security headers (CSP/HSTS) at ingress, silencing 2 favicon-type 404s.

## Prioritized backlog
- P0: Add EmailJS service, template, and public key variables (user must supply).
- P1: Add real project repository and live-demo URLs (currently placeholder #contact).
- P2: Interactive CVE architecture view / cloud learning timeline / GitHub activity panel (previously suggested enhancements).

## Next tasks
1. Configure EmailJS variables in frontend environment.
2. Replace project link placeholders with real GitHub/live URLs.
