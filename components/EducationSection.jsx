"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const educationData = [
  {
    institution: "Poornima Institute of Engineering & Technology",
    degree: "B.Tech in Computer Science & Engineering (3rd Year)",
    duration: "Aug 2025 - Aug 2028",
    logo: "/img/piet.png",
    alt: "PIET Logo",
    link: "https://poornimainstitute.edu.in",
    logoBg: "bg-white/10 border border-white/10 p-2.5",
  },
  {
    institution: "Sangam University",
    degree: "Diploma in Computer Science & Engineering",
    duration: "Aug 2022 - Aug 2025",
    logo: "/img/sangam.png",
    alt: "Sangam University Logo",
    link: "https://sangamuniversity.ac.in/",
    logoBg: "bg-white/5 border border-white/10 p-2",
  },
];

export default function EducationSection() {
  const canvasRef = useRef(null);

  // Constellation particle canvas matching portfolio theme
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
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        gradient.addColorStop(0.4, "rgba(192, 132, 252, 0.7)");
        gradient.addColorStop(1, "rgba(147, 51, 234, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 25000),
        36
      );
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

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.22;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.7;
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
    <section
      id="education"
      className="relative w-full min-h-[70vh] py-16 sm:py-20 px-6 md:px-12 flex flex-col items-center justify-center bg-transparent overflow-hidden"
    >
      {/* Background Constellation Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
      />

      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-16 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-16 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-7">
        {/* Section Heading */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white tracking-tight">
            Education
          </h2>
        </div>

        {/* Education Cards Stack */}
        <div className="flex flex-col gap-5 sm:gap-6 w-full">
          {educationData.map((item) => (
            <div
              key={item.institution}
              className="group relative w-full rounded-2xl sm:rounded-3xl bg-[#190634]/90 hover:bg-[#1f0940]/95 border border-purple-500/20 hover:border-purple-400/60 shadow-xl shadow-black/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.22)] backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                {/* Institute Logo Box */}
                <div className="shrink-0 flex items-center justify-center">
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group/logo focus:outline-none"
                  >
                    <div
                      className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl ${item.logoBg} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/logo:scale-105 group-hover:border-purple-400/40`}
                    >
                      <Image
                        src={item.logo}
                        alt={item.alt}
                        width={76}
                        height={76}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                      />
                    </div>
                  </Link>
                </div>

                {/* Institute Details - Centered */}
                <div className="flex-1 flex flex-col items-center text-center gap-2">
                  <h3 className="text-xl sm:text-2xl lg:text-[26px] font-serif font-semibold text-white tracking-wide">
                    {item.institution}
                  </h3>

                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg text-zinc-300 hover:text-purple-300 transition-colors font-medium hover:underline underline-offset-4"
                  >
                    {item.degree}
                  </Link>

                  <p className="text-xs sm:text-sm text-zinc-400 font-mono tracking-wide mt-0.5">
                    {item.duration}
                  </p>
                </div>

                {/* Invisible Balancer for desktop symmetry so text stays truly centered */}
                <div className="hidden md:block w-20 sm:w-22 shrink-0 pointer-events-none" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
