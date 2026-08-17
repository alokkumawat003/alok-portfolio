import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { EASE, SectionHeading } from "@/motionKit";

const roles = [
  { date: "May 2025 — Present", role: "Java Developer Intern", company: "8Bit Systems · Jaipur", points: ["Built a Spring Boot application for managing CVEs with USER / ADMIN access", "Designed layered architecture using DTOs, ModelMapper, and Repository patterns", "Implemented enum validation, nested JSON converters, and UUID generation", "Used Hibernate, MySQL, and JPA annotations for persistence and validation"] },
  { date: "Jul 2024 — Aug 2024", role: "Java Developer Intern", company: "Anantics India Pvt. Ltd. · Jaipur", points: ["Collaborated on backend systems using Java, Spring Boot, and REST APIs", "Designed, managed, and optimized relational databases with MySQL", "Built and tested modules using object-oriented programming principles"] },
  { date: "Aug 2023", role: "Web Developer Intern", company: "Zeetron Networks Pvt. Ltd. · Jaipur", points: ["Developed UIs using JavaScript frameworks, HTML5, and CSS3", "Pitched feature improvements and managed multiple fast-paced tasks", "Optimized performance through concurrency improvements"] },
];

export default function Experience() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  return (
    <section id="experience" className="section container" data-testid="experience-section">
      <SectionHeading index="03 / experience" compact>Learning by<br /><span>shipping.</span></SectionHeading>
      <div className="timeline-v" ref={ref} data-testid="experience-timeline">
        <div className="tl-track"><motion.div className="tl-progress" style={{ scaleY: reduce ? 1 : scaleY }} /></div>
        {roles.map((item, index) => (
          <motion.article
            className="tl-item"
            key={item.company}
            initial={{ opacity: 0, x: reduce ? 0 : index % 2 ? 56 : -56 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: EASE }}
            data-testid={`experience-item-${index + 1}`}
          >
            <motion.span className="tl-dot" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ type: "spring", stiffness: 320, damping: 15, delay: 0.15 }} />
            <div className="timeline-main">
              <div className="timeline-head">
                <div>
                  <p className="date-label">{item.date}</p>
                  <h3>{item.role}</h3>
                  <p className="company">{item.company}</p>
                </div>
                <span className="timeline-arrow">↗</span>
              </div>
              <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
