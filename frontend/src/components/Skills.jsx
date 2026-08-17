import { motion } from "framer-motion";
import { Boxes, Braces, Check, CloudCog, Cpu, Database, Wrench } from "lucide-react";
import { fadeUp, SectionHeading, staggerParent, viewportOnce } from "@/motionKit";

const groups = [
  ["Languages", "HTML · CSS · JavaScript · Python · SQL · Java", Braces],
  ["Frameworks", "Spring Boot", Boxes],
  ["Cloud & DevOps", "AWS · DevOps fundamentals", CloudCog, true],
  ["Core concepts", "OOP · Data Structures · Algorithms", Cpu],
  ["Tools", "Git · VS Code · IntelliJ · Eclipse · Postman", Wrench],
  ["Data & APIs", "MySQL · REST APIs · JPA / Hibernate", Database],
];

export default function Skills() {
  return (
    <section id="skills" className="section section-tint" data-testid="skills-section">
      <div className="container">
        <SectionHeading index="02 / capabilities" compact>The stack behind<br /><span>the work.</span></SectionHeading>
        <motion.div className="skills-grid" variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {groups.map(([title, value, Icon, progress]) => (
            <motion.div className={`skill-card glow-card ${progress ? "learning" : ""}`} variants={fadeUp} key={title} data-testid={`skill-${title.toLowerCase().replaceAll(" ", "-")}`}>
              <div className="skill-icon"><Icon size={19} /></div>
              <div className="skill-title-row">
                <span>{title}</span>
                {progress ? <span className="progress-badge"><CloudCog size={13} /> In progress</span> : <Check size={15} />}
              </div>
              <p>{value}</p>
              {progress && <div className="progress-line"><i /></div>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
