import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "@/App.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import ScrollProgress from "@/components/ScrollProgress";
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

function Home() {
  return (
    <>
      <IntroLoader />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Suspense fallback={<div className="chapter-loading" aria-hidden="true" />}>
          <Experience />
          <Projects />
          <Education />
          <Achievements />
          <Contact />
          <Footer />
        </Suspense>
      </main>
      <BackToTop />
    </>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.remove("light");
    document.title = "alok kumawat portfolio";
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <div className="portfolio-shell">
          <div className="system-field" aria-hidden="true">
            <span className="system-field-grid" />
            <span className="system-field-trace" />
            <span className="system-field-noise" />
          </div>
          <CustomCursor />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </MotionConfig>
  );
}
