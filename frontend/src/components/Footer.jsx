import { ArrowUp } from "lucide-react";

export default function Footer() {
  const backToTop = (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="atlas-footer" data-testid="site-footer">
      <div className="container atlas-footer-inner">
        <p>© 2026 Alok Kumawat</p>
        <span>Java / Cloud / DevOps · Jaipur, India</span>
        <a href="#top" onClick={backToTop} data-testid="footer-top-link">Return to origin <ArrowUp size={14} /></a>
      </div>
    </footer>
  );
}
