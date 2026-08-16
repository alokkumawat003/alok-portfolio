import { useEffect, useState } from "react";
import "@/App.css";
import "@/graphics.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function App() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
    document.title = "Alok Kumawat · Java / Cloud / DevOps";
  }, [lightMode]);

  return (
    <div className="portfolio-shell">
      <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode((value) => !value)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}