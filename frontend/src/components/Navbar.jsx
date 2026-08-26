import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { NAV_ITEMS, PROFILE } from "@/data/portfolio";
import usePerformanceProfile from "@/hooks/usePerformanceProfile";
import { EASE } from "@/motionKit";

const ROUTE_CODES = ["00", "01", "02", "03", "04", "05"];
const QUALITY_OPTIONS = ["high", "medium", "low"];
const ROUTES = [{ id: "top", label: "Home" }, ...NAV_ITEMS, { id: "footer", label: "End" }];
const QUALITY_STORAGE_KEY = "ak-graphics-mode-v2";

const normalizeQuality = (tier) => {
  if (tier === "high") return "high";
  if (tier === "medium") return "medium";
  return "low";
};

export default function Navbar() {
  const profile = usePerformanceProfile();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
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
    window.dispatchEvent(new CustomEvent("ak-quality-change", { detail: quality }));
    try {
      window.localStorage.setItem(QUALITY_STORAGE_KEY, quality);
    } catch {
      // Storage can be unavailable in hardened browsing modes; the live setting still applies.
    }
  }, [quality]);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    let routeOffsets = [];
    const measureRoutes = () => {
      routeOffsets = ROUTES.map(({ id }) => {
        const section = document.getElementById(id);
        return section ? { id, top: section.offsetTop } : null;
      }).filter(Boolean);
    };
    const updateHidden = (nextHidden) => {
      if (hiddenRef.current === nextHidden) return;
      hiddenRef.current = nextHidden;
      setHidden(nextHidden);
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextY = window.scrollY;
        if (open || nextY <= window.innerHeight * 0.65 || nextY < lastY - 3) {
          updateHidden(false);
        } else if (nextY > lastY + 3) {
          updateHidden(true);
        }
        const focusLine = nextY + window.innerHeight * 0.38;
        let nextActive = "top";
        routeOffsets.forEach(({ id, top }) => {
          if (top <= focusLine) nextActive = id;
        });
        if (nextY + window.innerHeight >= document.documentElement.scrollHeight - 4) nextActive = "footer";
        setActive((current) => current === nextActive ? current : nextActive);
        lastY = nextY;
      });
    };
    measureRoutes();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureRoutes, { passive: true });
    document.fonts?.ready.then(measureRoutes);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureRoutes);
    };
  }, [open]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const currentIndex = Math.max(0, ROUTES.findIndex((route) => route.id === active));
  const currentRoute = ROUTES[currentIndex];

  return (
    <header className={`runtime-nav ${hidden ? "is-hidden" : ""} ${active === "top" ? "is-hero-route" : "is-content-route"}`} data-testid="site-navbar">
      <button className="runtime-brand" onClick={() => goTo("top")} aria-label="Back to home" data-testid="brand-home-button">
        <span className="runtime-brand-mark">AK</span>
        <span className="runtime-brand-copy"><b>Alok Kumawat</b><small>INFRASTRUCTURE ENGINEER</small></span>
      </button>

      <nav className="desktop-routes" aria-label="Main navigation">
        {ROUTES.slice(0, -1).map(({ id, label }, index) => (
          <button type="button" className={active === id ? "is-active" : ""} onClick={() => goTo(id)} key={id} data-testid={id === "top" ? "nav-home-button" : `nav-${id}-button`}>
            <span>{String(index).padStart(2, "0")}</span>{label}
          </button>
        ))}
      </nav>

      <a className="nav-resume" href={PROFILE.resume} target="_blank" rel="noreferrer">RÉSUMÉ <ArrowUpRight size={13} /></a>

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
                <div><strong>ROUTE DIRECTORY</strong><span>AK//INFRA.WORLD</span></div>
                <b>DIR</b>
              </div>

              <div className="directory-socials">
                <a href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={13} /></a>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={13} /></a>
                <a href={PROFILE.resume} target="_blank" rel="noreferrer">RÉSUMÉ <ArrowDownToLine size={13} /></a>
              </div>

              <nav className="directory-routes" aria-label="Main navigation">
                {ROUTES.slice(0, -1).map(({ id, label }, index) => (
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
          <span>[{String(currentIndex).padStart(2, "0")}]</span>
          <b>{currentRoute.label}</b>
          <i className="route-trigger-grid" aria-hidden="true"><em /><em /><em /><em /></i>
        </button>
      </div>

      <aside className="chapter-rail" aria-label="Page chapters">
        {ROUTES.map(({ id, label }, index) => (
          <button type="button" className={active === id ? "is-active" : ""} aria-label={`Go to ${label}`} onClick={() => goTo(id)} key={id}>
            <i /><span>{String(index).padStart(2, "0")}</span>
          </button>
        ))}
      </aside>
    </header>
  );
}
