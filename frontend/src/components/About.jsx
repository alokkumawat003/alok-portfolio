import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROFILE, SIGNALS } from "@/data/portfolio";
import { ChapterHeading, reveal, stagger, viewportOnce } from "@/motionKit";

const PROFILE_ROWS = [
  ["NODE", "ALOK_KUMAWAT"],
  ["ROLE", "CLOUD_DEVOPS"],
  ["BASE", "JAIPUR_INDIA"],
  ["FOUNDATION", "JAVA_FULL_STACK"],
];

export default function About() {
  return (
    <section id="about" className="chapter about-runtime" data-scene="about" data-testid="about-section">
      <div className="chapter-frame container">
        <ChapterHeading
          number="01"
          eyebrow="Profile node / verified"
          description="A Cloud and DevOps-focused engineer building practical systems with a strong backend foundation."
        >Code is the entry.<br />Systems are the destination.</ChapterHeading>

        <div className="about-runtime-grid">
          <motion.div className="about-narrative" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p className="about-narrative-lead" variants={reveal}>
              I’m <strong>Alok Kumawat</strong>, a Cloud &amp; DevOps Engineer with a Java full-stack foundation, focused on the infrastructure and delivery systems behind reliable software.
            </motion.p>
            <motion.p variants={reveal}>
              My computer science foundation at Poornima College of Engineering and internships at 8Bit Systems, Anantics India, and Zeetron Networks shaped a practical way of working: understand the data, structure the application, validate the edge cases, and ship something useful.
            </motion.p>
            <motion.p variants={reveal}>
              I work with Java, Spring Boot, Hibernate, MySQL, REST APIs, AWS, and delivery tooling as one connected engineering system—not isolated technologies.
            </motion.p>
            <motion.a variants={reveal} className="runtime-text-link" href="#contact" data-testid="about-contact-link">
              OPEN A DIRECT CHANNEL <ArrowUpRight size={15} />
            </motion.a>
          </motion.div>

          <motion.aside className="profile-register" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} aria-label="Profile register">
            <motion.header variants={reveal}><span>PROFILE.NODE</span><b>AK//01</b></motion.header>
            {PROFILE_ROWS.map(([key, value], index) => (
              <motion.div variants={reveal} key={key}>
                <span>0x0{index}</span><b>{key}</b><p>{value}</p>
              </motion.div>
            ))}
            <motion.footer variants={reveal}><i /><span>{PROFILE.email}</span></motion.footer>
          </motion.aside>
        </div>

        <motion.div className="evidence-register" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <motion.span className="evidence-label" variants={reveal}>EVIDENCE / ACTIVE SIGNALS</motion.span>
          {SIGNALS.map(({ value, label }, index) => (
            <motion.div variants={reveal} key={label}>
              <span>[0{index + 1}]</span><strong>{value}</strong><p>{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
