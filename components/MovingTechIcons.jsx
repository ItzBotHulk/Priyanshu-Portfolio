"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const techIcons = [
  { name: "JavaScript", src: "/img/javascript.svg", className: "" },
  { name: "React", src: "/img/react.svg", className: "" },
  { name: "Next.js", src: "/img/nextjs.svg", className: "invert" },
  { name: "Node.js", src: "/img/nodejs.svg", className: "" },
  { name: "Express", src: "/img/express.svg", className: "invert brightness-200" },
  { name: "Tailwind CSS", src: "/img/tailwind.svg", className: "" },
  { name: "Python", src: "/img/python.svg", className: "" },
  {
    name: "Django",
    src: "/img/django.svg",
    className: "invert brightness-150 sepia hue-rotate-[290deg]",
  },
  { name: "HTML5", src: "/img/html.svg", className: "" },
  { name: "CSS3", src: "/img/css.svg", className: "" },
  { name: "Postman", src: "/img/postman.svg", className: "" },
  { name: "MongoDB", src: "/img/MongoDB.svg", className: "" },
  { name: "Git", src: "/img/git.svg", className: "" },
  { name: "GitHub", src: "/img/github.svg", className: "invert" },
];

export default function MovingTechIcons({ scrollDriven = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [opacity, setOpacity] = useState(scrollDriven ? 0 : 1);

  // Scroll visibility control when embedded in the 3D scroll container
  useEffect(() => {
    if (!scrollDriven) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      // Fade in smoothly between 2250px and 2600px
      const enter = Math.min(Math.max((scrollY - 2250) / 350, 0), 1);
      // Fade out as user scrolls past 3200px into projects
      const exit = Math.min(Math.max((scrollY - 3150) / 250, 0), 1);
      const calculatedOpacity = enter * (1 - exit);
      setOpacity(calculatedOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDriven]);

  // Constellation particle effect in banner background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = "rgba(192, 132, 252, 0.85)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const count = Math.min(Math.floor(canvas.width / 35), 45);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.35 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-zinc-950/85 backdrop-blur-md py-4 sm:py-5 border-y border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-opacity duration-300 pointer-events-none select-none"
      style={{ opacity }}
    >
      {/* Background Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0"
      />

      {/* Top Neon Glow Border */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.9)] z-10" />

      {/* Bottom Neon Glow Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.9)] z-10" />

      {/* Ambient background accent glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-24 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Continuously Moving Marquee Track */}
      <div className="relative z-10 w-full overflow-hidden flex items-center">
        <div className="animate-marquee flex items-center shrink-0">
          {/* First set of icons */}
          {techIcons.map((tech, idx) => (
            <div
              key={`tech-1-${idx}`}
              className="flex items-center justify-center mx-6 sm:mx-10 md:mx-14 shrink-0"
            >
              <Image
                src={tech.src}
                alt={tech.name}
                width={46}
                height={46}
                className={`w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.1)] ${tech.className}`}
              />
            </div>
          ))}

          {/* Second duplicate set for seamless infinite loop */}
          {techIcons.map((tech, idx) => (
            <div
              key={`tech-2-${idx}`}
              className="flex items-center justify-center mx-6 sm:mx-10 md:mx-14 shrink-0"
            >
              <Image
                src={tech.src}
                alt={tech.name}
                width={46}
                height={46}
                className={`w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.1)] ${tech.className}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
