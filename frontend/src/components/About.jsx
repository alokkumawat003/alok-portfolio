import { motion } from "framer-motion";
import { ArrowUpRight, Code2, GraduationCap, ShieldCheck } from "lucide-react";
import { fadeUp, SectionHeading, staggerParent, viewportOnce } from "@/motionKit";

const facts = [
  [Code2, "3★", "CodeChef rating"],
  [ShieldCheck, "176+", "LeetCode problems"],
  [GraduationCap, "2026", "Graduation year"],
];

export default function About() {
  return (
    <section id="about" className="section container" data-testid="about-section">
      <SectionHeading index="01 / about">From features<br /><span>to infrastructure.</span></SectionHeading>
      <motion.div className="about-grid" variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <motion.div className="about-lead" variants={fadeUp}>
          <p className="large-copy">I started with the interface, learned the backend, and now I’m moving closer to the systems that make everything possible.</p>
          <p>Currently in my final year of B.Tech CSE at Poornima College of Engineering, I’m working as a Java Developer Intern at 8Bit Systems while actively upskilling through an AWS &amp; DevOps certification course.</p>
          <a className="text-link" href="#contact" data-testid="about-contact-link">Start a conversation <ArrowUpRight size={15} /></a>
        </motion.div>
        <motion.div className="about-facts" variants={staggerParent}>
          {facts.map(([Icon, value, label]) => (
            <motion.div className="fact-card" variants={fadeUp} key={label}>
              <Icon size={21} />
              <div><strong>{value}</strong><span>{label}</span></div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
