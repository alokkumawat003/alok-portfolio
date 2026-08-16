import { BookOpen } from "lucide-react";

const education = [["2022 — 2026", "B.Tech, Computer Science and Engineering", "Poornima College of Engineering"], ["2022", "Class 12 · 72.40%", "NBF Public School"], ["2020", "Class 10 · 74.00%", "Aims Academy"]];

export default function Education() { return <section id="education" className="section container education-section" data-testid="education-section"><div className="section-heading compact"><p className="section-index">05 / education</p><h2>Always a<br /><span>student.</span></h2></div><div className="education-list">{education.map(([year, title, school]) => <div className="education-row" key={year}><span className="education-year">{year}</span><BookOpen size={19} /><div><h3>{title}</h3><p>{school}</p></div></div>)}</div></section>; }