import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import IntroLoader from "@/components/IntroLoader";
import BackToTop from "@/components/BackToTop";
import NotFound from "@/components/NotFound";

const Experience = lazy(() => import("@/components/Experience"));
const Projects = lazy(() => import("@/components/Projects"));
const Education = lazy(() => import("@/components/Education"));
const Achievements = lazy(() => import("@/components/Achievements"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));

function Home({ lightMode, onToggleTheme }) {
  return (
    <>
      <IntroLoader />
      <ScrollProgress />
      <Navbar lightMode={lightMode} onToggleTheme={onToggleTheme} />
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
      <BackToTop />
    </>
  );
}

export default function App() {
  const [lightMode, setLightMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", lightMode);
    window.localStorage.setItem("theme", lightMode ? "light" : "dark");
    document.title = "Alok Kumawat · Java / Cloud / DevOps";
  }, [lightMode]);

  const toggleTheme = () => setLightMode((value) => !value);

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <div className="portfolio-shell">
          <BackgroundFX />
          <CustomCursor />
          <Routes>
            <Route path="/" element={<Home lightMode={lightMode} onToggleTheme={toggleTheme} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </MotionConfig>
  );
}
