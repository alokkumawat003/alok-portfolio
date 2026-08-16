# Alok Kumawat Portfolio

## Original problem statement
Build a premium, responsive, dark-first single-page portfolio for Alok Kumawat, a Java Full Stack Developer transitioning into Cloud/DevOps, with smooth navigation, light mode, real career content, projects, education, achievements, and a frontend contact form.

## Architecture decisions
- React single-page frontend using the existing CRA/Craco starter and React component modules.
- CSS custom properties and responsive CSS for the dark cloud-console visual system; no backend needed for the static portfolio.
- EmailJS browser integration prepared through @emailjs/browser and runtime configuration variables.

## Implemented
- Navbar with active-section tracking, mobile menu, smooth scroll, and theme toggle.
- Hero terminal visual, real intro/location/education details, resume CTA, and cloud/DevOps positioning.
- About, categorized skills with In Progress badge, experience timeline, projects, education, achievements, contact form, and footer.
- Responsive layouts tested at desktop and 320px with no horizontal overflow.
- Metadata, OG tags, runtime title, reduced-motion support, and descriptive data-testid attributes.

## Prioritized backlog
- P0: Upload the real Alok-Kumawat-Resume.pdf asset.
- P0: Add EmailJS service, template, and public key variables.
- P1: Replace generic LinkedIn and GitHub URLs with Alok’s real profiles.
- P2: Add real project repository and live-demo URLs.

## Next tasks
1. Upload the resume PDF.
2. Configure EmailJS variables in frontend environment.
3. Replace social and project link placeholders.
