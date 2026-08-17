import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";

const links = ["about", "skills", "experience", "projects", "contact"];

export default function Navbar({ lightMode, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className={`nav-wrap ${scrolled ? "nav-scrolled" : ""}`} data-testid="site-navbar">
      <nav className="nav container" aria-label="Main navigation">
        <button className="brand" onClick={() => goTo("top")} data-testid="brand-home-button">
          AK<span>.</span>
        </button>
        <div className="nav-links" data-testid="navigation-links">
          {links.map((link) => (
            <button key={link} className={active === link ? "active" : ""} onClick={() => goTo(link)} data-testid={`nav-${link}-button`}>
              {link}
              {active === link && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
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
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-drawer" data-testid="mobile-drawer" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            {links.map((link, index) => (
              <motion.button key={link} className={active === link ? "active" : ""} onClick={() => goTo(link)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + index * 0.05 }} data-testid={`mobile-nav-${link}-button`}>
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
