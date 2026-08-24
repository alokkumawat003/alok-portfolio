import { useEffect, useRef } from "react";
import usePerformanceProfile from "@/hooks/usePerformanceProfile";

const TAU = Math.PI * 2;
const TIER_SETTINGS = {
  high: { particles: 38, dpr: 1.35, fps: 55, links: 1 },
  medium: { particles: 24, dpr: 1.15, fps: 36, links: 0 },
  low: { particles: 12, dpr: 1, fps: 20, links: 0 },
  static: { particles: 7, dpr: 1, fps: 0, links: 0 },
};

const makeParticle = (index) => ({
  x: Math.sin(index * 12.9898) * 620,
  y: Math.cos(index * 78.233) * 430,
  z: 120 + ((index * 137.53) % 1380),
  size: 0.55 + (index % 5) * 0.24,
  speed: 0.16 + (index % 7) * 0.035,
});

const line = (context, fromX, fromY, toX, toY, color, width = 1) => {
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
};

export default function LivingScene() {
  const canvasRef = useRef(null);
  const profile = usePerformanceProfile();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    let tier = profile.tier;
    let settings = TIER_SETTINGS[tier];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let lastFrame = 0;
    let sampleStart = performance.now();
    let sampleFrames = 0;
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let particles = Array.from({ length: settings.particles }, (_, index) => makeParticle(index));
    let visible = !document.hidden;
    let ambientActive = true;
    let inputFramePending = false;
    const activeZones = new Set();

    const setTier = (nextTier) => {
      tier = nextTier;
      settings = TIER_SETTINGS[tier];
      particles = Array.from({ length: settings.particles }, (_, index) => makeParticle(index));
      document.documentElement.dataset.graphics = tier;
      if (width > 0) resize();
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(profile.dpr, settings.dpr);
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw(performance.now());
    };

    const requestInputFrame = () => {
      if ((ambientActive && !profile.reducedMotion && tier !== "static") || inputFramePending) return;
      inputFramePending = true;
      window.requestAnimationFrame((time) => {
        scrollCurrent = scrollTarget;
        pointerX = pointerTargetX;
        pointerY = pointerTargetY;
        draw(time);
        inputFramePending = false;
      });
    };

    const updateScroll = () => {
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTarget = Math.min(1, Math.max(0, window.scrollY / range));
      const delta = window.scrollY - lastScroll;
      velocity = velocity * 0.72 + delta * 0.28;
      lastScroll = window.scrollY;
      document.documentElement.style.setProperty("--scroll-velocity", String(Math.max(-1, Math.min(1, velocity / 90))));
      requestInputFrame();
    };

    const updatePointer = (event) => {
      pointerTargetX = event.clientX / Math.max(1, width) - 0.5;
      pointerTargetY = event.clientY / Math.max(1, height) - 0.5;
      requestInputFrame();
    };

    const drawGrid = (phase, time) => {
      const centerX = width * 0.58 + pointerX * 42;
      const horizon = height * (0.52 - phase * 0.08) + pointerY * 22;
      const ringCount = tier === "high" ? 10 : tier === "medium" ? 8 : tier === "low" ? 6 : 4;
      context.save();
      context.globalCompositeOperation = "screen";
      for (let index = 0; index < ringCount; index += 1) {
        const progress = ((index / ringCount + phase * 1.45 + (profile.reducedMotion || tier === "static" ? 0 : time * 0.000025)) % 1);
        const radius = 28 + progress * Math.max(width, height) * 0.64;
        context.beginPath();
        context.ellipse(centerX, horizon, radius, radius * (0.18 + progress * 0.38), 0, 0, TAU);
        context.strokeStyle = `rgba(205, 226, 201, ${(1 - progress) * 0.12})`;
        context.lineWidth = progress < 0.2 ? 1.2 : 0.65;
        context.stroke();
      }
      const radialCount = tier === "high" ? 7 : 5;
      for (let index = 0; index < radialCount; index += 1) {
        const angle = (index / radialCount) * TAU + phase * 0.5;
        const reach = Math.max(width, height) * 0.82;
        line(context, centerX, horizon, centerX + Math.cos(angle) * reach, horizon + Math.sin(angle) * reach * 0.42, "rgba(218, 228, 214, 0.045)", 0.7);
      }
      context.restore();
    };

    const drawParticles = (phase, time) => {
      const centerX = width * (0.57 - phase * 0.12) + pointerX * 68;
      const centerY = height * (0.5 + Math.sin(phase * TAU) * 0.04) + pointerY * 48;
      const focal = Math.max(340, Math.min(width, height) * 0.7);
      const drift = profile.reducedMotion || tier === "static" ? 0 : time * 0.018;
      const projected = [];

      particles.forEach((particle, index) => {
        const z = ((particle.z - phase * 1740 - drift * particle.speed + 1700) % 1500) + 80;
        const scale = focal / (focal + z);
        const orbit = phase * TAU * 0.7 + index * 0.013;
        const x = centerX + (particle.x * Math.cos(orbit) - particle.y * 0.12 * Math.sin(orbit)) * scale;
        const y = centerY + (particle.y + Math.sin(index * 2.1 + phase * TAU) * 42) * scale;
        const alpha = Math.max(0.03, (1 - z / 1600) * 0.48);
        projected.push({ x, y, alpha, radius: particle.size * scale * 2.8 });
      });

      context.save();
      context.globalCompositeOperation = "screen";
      projected.forEach((point, index) => {
        context.beginPath();
        context.arc(point.x, point.y, Math.max(0.35, point.radius), 0, TAU);
        context.fillStyle = `rgba(218, 239, 203, ${point.alpha})`;
        context.fill();

        for (let linkIndex = 1; linkIndex <= settings.links; linkIndex += 1) {
          const peer = projected[(index + linkIndex * 11) % projected.length];
          const distance = Math.hypot(point.x - peer.x, point.y - peer.y);
          if (distance < 170) {
            line(context, point.x, point.y, peer.x, peer.y, `rgba(166, 205, 177, ${(1 - distance / 170) * 0.09})`, 0.6);
          }
        }
      });
      context.restore();
    };

    function draw(time) {
      context.clearRect(0, 0, width, height);
      scrollCurrent += (scrollTarget - scrollCurrent) * (profile.reducedMotion ? 1 : 0.065);
      pointerX += (pointerTargetX - pointerX) * 0.055;
      pointerY += (pointerTargetY - pointerY) * 0.055;
      velocity *= 0.92;
      drawGrid(scrollCurrent, time);
      drawParticles(scrollCurrent, time);
    }

    const tick = (time) => {
      if (!visible || !ambientActive || tier === "static") {
        frame = 0;
        return;
      }
      const interval = 1000 / settings.fps;
      if (time - lastFrame >= interval) {
        lastFrame = time;
        draw(time);
        sampleFrames += 1;
        const sampleDuration = time - sampleStart;
        if (sampleDuration > 2200 && !profile.reducedMotion) {
          const measuredFps = (sampleFrames * 1000) / sampleDuration;
          document.documentElement.dataset.graphicsFps = String(Math.round(measuredFps));
          if (measuredFps < 44 && tier === "high") setTier("medium");
          else if (measuredFps < 28 && tier === "medium") setTier("low");
          else if (measuredFps < 14 && tier === "low") setTier("static");
          sampleStart = time;
          sampleFrames = 0;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    const zoneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeZones.add(entry.target);
        else activeZones.delete(entry.target);
      });
      ambientActive = activeZones.size > 0;
      if (!ambientActive) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      if (visible && !profile.reducedMotion && tier !== "static" && !frame) {
        lastFrame = performance.now();
        sampleStart = lastFrame;
        sampleFrames = 0;
        frame = window.requestAnimationFrame(tick);
      } else {
        requestInputFrame();
      }
    }, { rootMargin: "-12% 0px -12%", threshold: 0.04 });

    const onVisibility = () => {
      visible = !document.hidden;
      if (!visible) {
        window.cancelAnimationFrame(frame);
        return;
      }
      if (!profile.reducedMotion && tier !== "static" && ambientActive) {
        lastFrame = performance.now();
        frame = window.requestAnimationFrame(tick);
      } else if (tier === "static") {
        resize();
      }
    };
    setTier(profile.tier);
    updateScroll();
    resize();
    ["top", "skills", "projects"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) zoneObserver.observe(section);
    });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    if (!profile.touch) window.addEventListener("pointermove", updatePointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!profile.reducedMotion) frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener("visibilitychange", onVisibility);
      zoneObserver.disconnect();
    };
  }, [profile.dpr, profile.reducedMotion, profile.tier, profile.touch]);

  return (
    <div className="living-scene" aria-hidden="true" data-testid="living-scene">
      <canvas ref={canvasRef} />
      <div className="scene-vignette" />
      <div className="scene-grain" />
    </div>
  );
}
