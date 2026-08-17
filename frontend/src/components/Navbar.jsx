import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { EASE } from "@/motionKit";

const links = ["about", "skills", "experience", "projects", "contact"];

export default function Navbar({ lightMode, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -60%" });
    const observed = new Set();
    const tryObserve = () => links.forEach((id) => {
      const el = document.getElementById(id);
      if (el && !observed.has(id)) { observed.add(id); observer.observe(el); }
    });
    tryObserve();
    const timer = setInterval(() => { tryObserve(); if (observed.size === links.length) clearInterval(timer); }, 700);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header data-testid="site-navbar">
      <div className="nav-float-wrap">
        <motion.nav
          className={`nav-pill-bar ${scrolled ? "shrunk" : ""}`}
          aria-label="Main navigation"
          initial={{ y: -26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.35, duration: 0.7, ease: EASE }}
        >
          <button className="brand" onClick={() => goTo("top")} data-testid="brand-home-button">Alok<span>.</span></button>
          <div className="nav-links" data-testid="navigation-links">
            {links.map((link) => (
              <button key={link} className={active === link ? "active" : ""} onClick={() => goTo(link)} data-testid={`nav-${link}-button`}>
                {active === link && <motion.span layoutId="nav-active-pill" className="nav-active-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span>{link}</span>
              </button>
            ))}
          </div>
          <div className="nav-actions">
            <button className="icon-button" onClick={onToggleTheme} aria-label="Toggle light mode" data-testid="theme-toggle-button">
              {lightMode ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="menu-button icon-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu" data-testid="mobile-menu-button">
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </motion.nav>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="menu-overlay" data-testid="mobile-drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            {links.map((link, index) => (
              <motion.button
                key={link}
                className={`overlay-link ${active === link ? "active" : ""}`}
                onClick={() => goTo(link)}
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.06 + index * 0.07, duration: 0.55, ease: EASE }}
                data-testid={`mobile-nav-${link}-button`}
              >
                <i>0{index + 1}</i>{link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
