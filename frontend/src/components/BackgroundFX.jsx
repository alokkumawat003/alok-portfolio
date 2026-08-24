import { useEffect, useRef } from "react";

export default function BackgroundFX() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(22, Math.min(52, Math.floor(width / 28)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: ((index * 193) % width) - width / 2,
        y: ((index * 97) % height) - height / 2,
        z: 120 + ((index * 71) % 720),
        speed: 0.24 + (index % 5) * 0.06,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const projected = particles.map((particle) => {
        if (!reduced) {
          particle.z -= particle.speed;
          if (particle.z < 80) particle.z = 840;
        }
        const scale = 420 / particle.z;
        return {
          x: width / 2 + particle.x * scale,
          y: height / 2 + particle.y * scale,
          r: Math.max(0.45, 1.8 * scale),
          alpha: Math.min(0.32, 0.05 + scale * 0.15),
        };
      });

      projected.forEach((point, index) => {
        context.beginPath();
        context.fillStyle = `rgba(229, 234, 235, ${point.alpha})`;
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();

        for (let peerIndex = index + 1; peerIndex < projected.length; peerIndex += 1) {
          const peer = projected[peerIndex];
          const distance = Math.hypot(point.x - peer.x, point.y - peer.y);
          if (distance < 112) {
            context.beginPath();
            context.strokeStyle = `rgba(220, 226, 228, ${(1 - distance / 112) * 0.055})`;
            context.lineWidth = 0.7;
            context.moveTo(point.x, point.y);
            context.lineTo(peer.x, peer.y);
            context.stroke();
          }
        }
      });

      if (!reduced) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="bg-fx" aria-hidden="true" data-testid="background-fx">
      <canvas ref={canvasRef} className="system-field" />
      <div className="perspective-grid" />
      <div className="grain" />
    </div>
  );
}
