import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Award, Brackets, TrendingUp } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "@/motionKit";

export default function Achievements() {
  return (
    <section id="achievements" className="stats-band" data-testid="achievements-section">
      <motion.div className="container stats-grid" variants={staggerParent} initial="hidden" whileInView="show" viewport={viewportOnce}>
        <motion.div className="stats-label" variants={fadeUp}>
          <p className="section-index">06 / signals</p>
          <h2>Proof of<br /><span>progress.</span></h2>
        </motion.div>
        <motion.div className="stat stat-star" variants={fadeUp}>
          <Award size={20} />
          <strong data-testid="codechef-stat"><CountUp end={3} duration={1.6} enableScrollSpy scrollSpyOnce /><span>★</span></strong>
          <p>CodeChef rating</p>
        </motion.div>
        <motion.div className="stat" variants={fadeUp}>
          <Brackets size={20} />
          <strong data-testid="leetcode-stat"><CountUp end={176} duration={2.2} enableScrollSpy scrollSpyOnce /><span>+</span></strong>
          <p>LeetCode problems solved</p>
        </motion.div>
        <motion.div className="stat" variants={fadeUp}>
          <TrendingUp size={20} />
          <strong>∞</strong>
          <p>Curiosity to keep learning</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
