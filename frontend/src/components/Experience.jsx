import { motion } from "framer-motion";
import { EDUCATION, EXPERIENCE } from "@/data/portfolio";
import { ChapterHeading, reveal, stagger, viewportOnce } from "@/motionKit";

export default function Experience() {
  return (
    <section id="experience" className="chapter experience-runtime" data-scene="experience" data-testid="experience-section">
      <div className="chapter-frame container">
        <ChapterHeading number="03" eyebrow="Journey spine / verified" description="Professional practice and formal education, arranged as one continuous engineering path.">
          Systems are built<br />through sequence.
        </ChapterHeading>

        <motion.div className="journey-spine" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} data-testid="experience-timeline">
          <div className="journey-axis" aria-hidden="true"><i /><span>PROFESSIONAL LOG</span><span>EDUCATION LOG</span></div>
          <div className="journey-professional">
            {EXPERIENCE.map((item, index) => (
              <motion.article className="journey-entry" variants={reveal} key={item.company} data-testid={`experience-item-${index + 1}`}>
                <div className="journey-entry-code"><span>EXP.0{index + 1}</span><i /></div>
                <p className="journey-date">{item.date}</p>
                <header><h3>{item.role}</h3><p>{item.company}</p></header>
                <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </motion.article>
            ))}
          </div>

          <motion.div className="education-band" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce} data-testid="education-section">
            <motion.header variants={reveal}><span>EDU.LOG</span><strong>03 VERIFIED RECORDS</strong></motion.header>
            {EDUCATION.map((item, index) => (
              <motion.article variants={reveal} key={item.title} data-testid={`education-item-${index + 1}`}>
                <span>0{index + 1}</span><p>{item.year}</p><h3>{item.title}</h3><strong>{item.school}</strong>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
