import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer" data-testid="site-footer">
      <div className="container footer-inner">
        <p>© 2026 Alok Kumawat</p>
        <p>Designed &amp; built with intention <span className="footer-mark">✦</span></p>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} data-testid="footer-top-link">Back to top <ArrowUpRight size={14} /></a>
      </div>
    </footer>
  );
}
