import { lazy, Suspense, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import "@/App.css";
import "@/graphics.css";
import "@/polish.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ScrollProgress from "@/components/ScrollProgress";
import BackgroundFX from "@/components/BackgroundFX";
import CustomCursor from "@/components/CustomCursor";

const Experience = lazy(() => import("@/components/Experience"));
const Projects = lazy(() => import("@/components/Projects"));
const Education = lazy(() => import("@/components/Education"));
const Achievements = lazy(() => import("@/components/Achievements"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

export default function App() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
    document.title = "Alok Kumawat · Java / Cloud / DevOps";
  }, [lightMode]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio-shell">
        <ScrollProgress />
        <BackgroundFX />
        <CustomCursor />
        <Navbar lightMode={lightMode} onToggleTheme={() => setLightMode((value) => !value)} />
        <main>
          <Hero />
          <About />
          <Skills />
          <Suspense fallback={<div style={{ minHeight: "50vh" }} />}>
            <Experience />
            <Projects />
            <Education />
            <Achievements />
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  );
}
