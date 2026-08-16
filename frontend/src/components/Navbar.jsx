import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

const links = ["about", "skills", "experience", "projects", "contact"];

export default function Navbar({ lightMode, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -60%" });
    links.forEach((id) => document.getElementById(id) && observer.observe(document.getElementById(id)));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="nav-wrap" data-testid="site-navbar">
      <nav className="nav container" aria-label="Main navigation">
        <button className="brand" onClick={() => goTo("top")} data-testid="brand-home-button">
          AK<span>.</span>
        </button>
        <div className={`nav-links ${open ? "is-open" : ""}`} data-testid="navigation-links">
          {links.map((link) => (
            <button key={link} className={active === link ? "active" : ""} onClick={() => goTo(link)} data-testid={`nav-${link}-button`}>
              {link}
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
    </header>
  );
}