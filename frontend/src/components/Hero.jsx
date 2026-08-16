import { ArrowDownRight, ArrowUpRight, Cloud, Download, MapPin, Terminal } from "lucide-react";

export default function Hero() {
  return (
    <section id="top" className="hero container" data-testid="hero-section">
      <div className="hero-copy reveal">
        <div className="eyebrow"><span className="status-dot" /> Available for full-time opportunities</div>
        <p className="hero-kicker">Java / Cloud / DevOps</p>
        <h1 data-testid="hero-heading">Building reliable systems<br /><em>for the next layer.</em></h1>
        <p className="hero-intro" data-testid="hero-intro">I’m Alok Kumawat — a Java Full Stack Developer transitioning into Cloud &amp; DevOps, with a bias for clean architecture and useful products.</p>
        <div className="hero-ctas">
          <a className="button button-primary" href="/Alok-Kumawat-Resume.pdf" download data-testid="download-resume-button"><Download size={16} /> Download resume</a>
          <a className="button button-ghost" href="#contact" data-testid="hero-contact-button">Let’s connect <ArrowUpRight size={16} /></a>
        </div>
        <div className="hero-meta"><span><MapPin size={14} /> Jaipur, Rajasthan</span><span><Terminal size={14} /> B.Tech CSE · 2026</span></div>
      </div>
      <div className="hero-visual reveal reveal-delay" aria-label="Cloud infrastructure illustration" data-testid="hero-visual">
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="terminal-card">
          <div className="terminal-top"><span className="traffic red" /><span className="traffic yellow" /><span className="traffic green" /><span className="terminal-title">alok@cloud: ~/journey</span></div>
          <div className="terminal-body"><p><span className="code-muted">01</span> <span className="code-purple">const</span> <span className="code-blue">focus</span> = [</p><p className="indent"><span className="code-green">&quot;build&quot;</span>, <span className="code-green">&quot;automate&quot;</span>,</p><p className="indent"><span className="code-green">&quot;ship with confidence&quot;</span></p><p>];</p><p className="terminal-prompt"><span>➜</span> <span className="code-blue">alok</span> <span className="cursor" /></p></div>
        </div>
        <div className="cloud-chip"><Cloud size={17} /><span>AWS / DevOps</span><b>↗</b></div>
        <div className="hero-scroll"><ArrowDownRight size={15} /> scroll to explore</div>
      </div>
    </section>
  );
}