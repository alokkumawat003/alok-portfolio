import { motion } from "framer-motion";
import { EDUCATION } from "@/data/portfolio";
import { ChapterHeading, reveal, stagger, viewportOnce } from "@/motionKit";

export default function Education() {
  return (
    <section id="education" className="chapter education-runtime" data-testid="education-section">
      <div className="chapter-frame container">
        <ChapterHeading
          number="05"
          eyebrow="Education register"
          description="Formal academic checkpoints supporting the engineering practice documented above."
        >Learning record.<br />Foundation to practice.</ChapterHeading>

        <motion.div className="education-register" variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
          {EDUCATION.map((item, index) => (
            <motion.article variants={reveal} key={`${item.year}-${item.title}`}>
              <span>[0{index + 1}]</span>
              <p>{item.year}</p>
              <h3>{item.title}</h3>
              <b>{item.school}</b>
              <i aria-hidden="true" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
