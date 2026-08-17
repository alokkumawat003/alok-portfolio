import Tilt from "react-parallax-tilt";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Layers3 } from "lucide-react";
import { fadeUp, staggerParent, useHoverCapable, viewportOnce } from "@/motionKit";

const projects = [
  ["01", "Vulnerability Management System", "Spring Boot CVE tracker with role-based access, UUID generation, and JSON handling in MySQL", "Spring Boot · MySQL", "cyan"],
  ["02", "Student Management System", "A focused management system built with Core Java and Advanced Java concepts.", "Core Java · OOP", "orange"],
  ["03", "Woodfinity E-Commerce Website", "A responsive storefront experience built with HTML, CSS, and JavaScript.", "HTML · CSS · JavaScript", "pink"],
  ["04", "Budget Calculator", "A practical shop billing calculator system for quick, accurate everyday totals.", "JavaScript · HTML · CSS", "lime"],
];

export default function Projects() {
  const hoverCapable = useHoverCapable();
  const reduce = useReducedMotion();
  const tiltOn = hoverCapable && !reduce;

  return (
    <section id="projects" className="section section-tint" data-testid="projects-section">
      <div className="container">
        <motion.div className="projects-head" variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <div className="section-heading compact">
            <p className="section-index">04 / selected work</p>
            <h2>Small builds,<br /><span>real intent.</span></h2>
          </div>
          <p className="section-note">A selection of systems and interfaces I’ve built while growing from full-stack development toward the cloud.</p>
        </motion.div>
        <motion.div className="projects-grid" variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {projects.map(([number, title, description, tags, color]) => (
            <motion.div className="tilt-wrap" variants={fadeUp} key={title}>
              <Tilt tiltEnable={tiltOn} tiltMaxAngleX={6} tiltMaxAngleY={6} scale={tiltOn ? 1.02 : 1} transitionSpeed={1400} glareEnable={false} style={{ height: "100%" }}>
                <article className={`project-card ${color}`} data-testid={`project-${number}`}>
                  <div className="project-top"><span>{number}</span><Layers3 size={20} /></div>
                  <div><h3>{title}</h3><p>{description}</p></div>
                  <div className="project-bottom">
                    <span>{tags}</span>
                    <div className="project-links">
                      <a href="#contact" aria-label={`Ask about ${title}`} data-testid={`project-contact-${number}`}><ArrowUpRight size={17} /></a>
                      <a href="#contact" aria-label="Project link placeholder" data-testid={`project-github-${number}`}><Github size={16} /></a>
                    </div>
                  </div>
                  <div className="project-overlay" aria-hidden="true">
                    <div className="overlay-tags">{tags.split("·").map((tag) => <span key={tag}>{tag.trim()}</span>)}</div>
                    <span className="overlay-hint">view details ↗</span>
                  </div>
                </article>
              </Tilt>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
