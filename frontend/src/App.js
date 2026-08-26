import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "@/App.css";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ImmersiveWorld from "@/components/ImmersiveWorld";
import CustomCursor from "@/components/CustomCursor";
import IntroLoader from "@/components/IntroLoader";
import BackToTop from "@/components/BackToTop";
import NotFound from "@/components/NotFound";

function Home() {
  return (
    <>
      <IntroLoader />
      <ImmersiveWorld />
      <Navbar />
      <main className="story-shell">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
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
