import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { NAV_ITEMS, PROFILE } from "@/data/portfolio";
import usePerformanceProfile from "@/hooks/usePerformanceProfile";
import { EASE } from "@/motionKit";

const ROUTE_CODES = ["00", "01", "02", "03", "04", "05"];
const QUALITY_OPTIONS = ["high", "medium", "saver"];
const ROUTES = [{ id: "top", label: "Home" }, ...NAV_ITEMS];
const QUALITY_STORAGE_KEY = "ak-graphics-mode-v1";

const normalizeQuality = (tier) => {
  if (tier === "high") return "high";
  if (tier === "medium") return "medium";
  return "saver";
};

export default function Navbar() {
  const profile = usePerformanceProfile();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [quality, setQuality] = useState(() => {
    try {
      const stored = window.localStorage.getItem(QUALITY_STORAGE_KEY);
      return QUALITY_OPTIONS.includes(stored) ? stored : normalizeQuality(profile.tier);
    } catch {
      return normalizeQuality(profile.tier);
    }
  });

  useEffect(() => {
    document.documentElement.dataset.graphics = quality;
    try {
      window.localStorage.setItem(QUALITY_STORAGE_KEY, quality);
    } catch {
      // Storage can be unavailable in hardened browsing modes; the live setting still applies.
    }
  }, [quality]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-28% 0px -58%", threshold: [0, 0.12, 0.35] });

    const observed = new Set();
    const observeRoutes = () => {
      ROUTES.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && !observed.has(section)) {
          observed.add(section);
          observer.observe(section);
        }
      });
    };

    observeRoutes();
    const contentObserver = new MutationObserver(observeRoutes);
    const main = document.querySelector("main");
    if (main) contentObserver.observe(main, { childList: true, subtree: true });
    return () => {
      contentObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const currentIndex = Math.max(0, ROUTES.findIndex((route) => route.id === active));
  const currentRoute = ROUTES[currentIndex];

  return (
    <header className={`runtime-nav ${active === "top" ? "is-hero-route" : "is-content-route"}`} data-testid="site-navbar">
      <button className="runtime-brand" onClick={() => goTo("top")} aria-label="Back to home" data-testid="brand-home-button">
        <span className="runtime-brand-mark">AK</span>
        <span className="runtime-brand-copy"><b>Alok Kumawat</b><small>DEV NODE // PORTFOLIO.2026</small></span>
      </button>

      <div className="runtime-status" aria-label="Portfolio status">
        <span><i /> AVAILABLE</span>
        <b>JAVA / CLOUD / DEVOPS</b>
      </div>

      <div className="runtime-contact-rail">
        <span>JAIPUR / INDIA</span>
        <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            className="route-scrim"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>

      <div className={`route-console ${open ? "is-open" : ""}`}>
        <AnimatePresence>
          {open ? (
            <motion.div
              className="route-directory"
              id="route-directory"
              initial={{ opacity: 0, y: 20, clipPath: "inset(100% 0 0 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
              exit={{ opacity: 0, y: 12, clipPath: "inset(100% 0 0 0)" }}
              transition={{ duration: 0.48, ease: EASE }}
            >
              <div className="directory-head">
                <div><strong>ROUTE DIRECTORY</strong><span>AK//RUNTIME</span></div>
                <b>DIR</b>
              </div>

              <div className="directory-socials">
                <a href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={13} /></a>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={13} /></a>
                <a href={PROFILE.resume} target="_blank" rel="noreferrer">RÉSUMÉ <ArrowDownToLine size={13} /></a>
              </div>

              <nav className="directory-routes" aria-label="Main navigation">
                {ROUTES.map(({ id, label }, index) => (
                  <button
                    className={active === id ? "is-active" : ""}
                    type="button"
                    onClick={() => goTo(id)}
                    data-testid={id === "top" ? "nav-home-button" : `nav-${id}-button`}
                    key={id}
                  >
                    <span>[{ROUTE_CODES[index]}]</span><b>{label}</b><i aria-hidden="true" />
                  </button>
                ))}
              </nav>

              <div className="quality-control" aria-label="Motion quality">
                <span>GRAPHICS MODE</span>
                <div>
                  {QUALITY_OPTIONS.map((option) => (
                    <button
                      type="button"
                      className={quality === option ? "is-active" : ""}
                      aria-pressed={quality === option}
                      onClick={() => setQuality(option)}
                      key={option}
                    >{option}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          className="route-trigger"
          aria-expanded={open}
          aria-controls="route-directory"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          data-testid="mobile-menu-button"
        >
          <span>[{ROUTE_CODES[currentIndex]}]</span>
          <b>{currentRoute.label}</b>
          <i className="route-trigger-grid" aria-hidden="true"><em /><em /><em /><em /></i>
        </button>
      </div>
    </header>
  );
}
