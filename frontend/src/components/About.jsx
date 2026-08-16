import { ArrowUpRight, Code2, GraduationCap, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section container" data-testid="about-section">
      <div className="section-heading"><p className="section-index">01 / about</p><h2>From features<br /><span>to infrastructure.</span></h2></div>
      <div className="about-grid">
        <div className="about-lead"><p className="large-copy">I started with the interface, learned the backend, and now I’m moving closer to the systems that make everything possible.</p><p>Currently in my final year of B.Tech CSE at Poornima College of Engineering, I’m working as a Java Developer Intern at 8Bit Systems while actively upskilling through an AWS &amp; DevOps certification course.</p><a className="text-link" href="#contact" data-testid="about-contact-link">Start a conversation <ArrowUpRight size={15} /></a></div>
        <div className="about-facts">
          <div className="fact-card"><Code2 size={21} /><div><strong>3★</strong><span>CodeChef rating</span></div></div>
          <div className="fact-card"><ShieldCheck size={21} /><div><strong>176+</strong><span>LeetCode problems</span></div></div>
          <div className="fact-card"><GraduationCap size={21} /><div><strong>2026</strong><span>Graduation year</span></div></div>
        </div>
      </div>
    </section>
  );
}