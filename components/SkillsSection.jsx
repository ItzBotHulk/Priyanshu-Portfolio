"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const skillCategories = [
  {
    title: "Front End",
    skills: [
      { name: "HTML", icon: "/img/html.svg" },
      { name: "CSS", icon: "/img/css.svg" },
      { name: "JavaScript", icon: "/img/javascript.svg" },
      { name: "React.js", icon: "/img/react.svg" },
      { name: "Next.js", icon: "/img/nextjs.svg", invert: true },
      { name: "Bootstrap", icon: "/img/bootstrap.svg" },
      { name: "Tailwind CSS", icon: "/img/tailwind.svg" },
    ],
  },
  {
    title: "Back End",
    skills: [
      { name: "Express.js", icon: "/img/express.svg", invert: true },
      { name: "Node.js", icon: "/img/nodejs.svg" },
      { name: "Python", icon: "/img/python.svg" },
      { name: "Django", icon: "/img/django.svg", isDjango: true },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", icon: "/img/MongoDB.svg" },
      { name: "Mongoose", icon: "/img/mongoose.svg" },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "Git", icon: "/img/git.svg" },
      { name: "GitHub", icon: "/img/github.svg", invert: true },
      { name: "Postman", icon: "/img/postman.svg" },
      { name: "VS Code", icon: "/img/vscode.svg" },
      { name: "Figma", icon: "/img/figma.svg" },
      { name: "Vercel", icon: "/img/Vercel.svg", invert: true },
    ],
  },
];

export default function SkillsSection() {
  const canvasRef = useRef(null);

  // Ambient constellation particles matching portfolio theme
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
        40
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
      id="skills"
      className="relative w-full min-h-screen pt-8 sm:pt-10 pb-12 px-6 md:px-12 flex flex-col items-center justify-center bg-transparent overflow-hidden"
    >
      {/* Background Constellation Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
      />

      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10">
        {/* Left Column: Skills Content matching user's design */}
        <div className="w-full lg:w-[56%] flex flex-col">
          {/* Section Header */}
          <div className="mb-5 flex flex-col gap-1.5">
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-white tracking-tight">
              My Skills
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed">
              Technologies and tools I&apos;ve worked with throughout my projects
              and experience
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-5 sm:gap-5.5 w-full">
            {skillCategories.map((category) => (
              <div key={category.title} className="flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-100 tracking-wide mb-2">
                  {category.title}
                </h3>

                <div className="flex flex-wrap gap-3 sm:gap-3.5 items-center">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="group flex flex-col items-center cursor-pointer"
                    >
                      {/* Circular Glass Badge */}
                      <div className="relative w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg shadow-black/40 group-hover:border-purple-400/80 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all duration-300">
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={30}
                          height={30}
                          className={`w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:scale-110 transition-transform duration-300 ${
                            skill.invert ? "invert brightness-200" : ""
                          } ${
                            skill.isDjango
                              ? "brightness-150 contrast-125 sepia hue-rotate-[290deg]"
                              : ""
                          }`}
                        />
                      </div>
                      {/* Skill Name */}
                      <span className="text-[11px] sm:text-[11.5px] text-zinc-300/90 group-hover:text-white transition-colors text-center mt-1.5 font-medium tracking-wide">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Reserved stage space for 3D model to dock clearly on the right */}
        <div className="hidden lg:flex lg:w-[44%] h-[580px] pointer-events-none" aria-hidden="true" />
      </div>
    </section>
  );
}
