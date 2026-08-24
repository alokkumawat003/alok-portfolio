import { motion } from "framer-motion";
import { EXPERIENCE } from "@/data/portfolio";
import { ChapterHeading, reveal, stagger, viewportOnce } from "@/motionKit";

export default function Experience() {
  return (
    <section id="experience" className="chapter experience-runtime" data-testid="experience-section">
      <div className="chapter-frame container">
        <ChapterHeading
          number="03"
          eyebrow="Execution log / professional"
          description="A chronological record of the environments where I have built, tested, and improved real application systems."
        >Experience log.<br />Evidence in sequence.</ChapterHeading>

        <motion.div className="experience-log" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} data-testid="experience-timeline">
          <motion.div className="experience-log-head" variants={reveal} aria-hidden="true">
            <span>ENTRY</span><span>TIME WINDOW</span><span>ROLE / ORGANIZATION</span><span>EXECUTION NOTES</span>
          </motion.div>
          {EXPERIENCE.map((item, index) => (
            <motion.article className="experience-entry" variants={reveal} key={item.company} data-testid={`experience-item-${index + 1}`}>
              <div className="experience-entry-code"><span>0x0{index + 1}</span><i /></div>
              <p className="experience-entry-date">{item.date}</p>
              <header><h3>{item.role}</h3><p>{item.company}</p></header>
              <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
