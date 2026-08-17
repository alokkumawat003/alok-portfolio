import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/motionKit";

const education = [["2022 — 2026", "B.Tech, Computer Science and Engineering", "Poornima College of Engineering"], ["2022", "Class 12 · 72.40%", "NBF Public School"], ["2020", "Class 10 · 74.00%", "Aims Academy"]];

export default function Education() {
  return (
    <section id="education" className="section container education-section" data-testid="education-section">
      <motion.div className="section-heading compact" variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <p className="section-index">05 / education</p>
        <h2>Always a<br /><span>student.</span></h2>
      </motion.div>
      <motion.div className="education-list" variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce}>
        {education.map(([year, title, school]) => (
          <motion.div className="education-row" variants={fadeUp} key={year}>
            <span className="education-year">{year}</span>
            <BookOpen size={19} />
            <div><h3>{title}</h3><p>{school}</p></div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
