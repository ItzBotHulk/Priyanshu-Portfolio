"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: "itask",
    title: "iTask Manager",
    description:
      "iTask Manager is a simple and efficient to-do website. All the tasks are securely stored in your browser's local storage. so there's no need for sign-ups or internet connection.",
    image: "/project/itask.png",
    liveUrl: "https://itzbothulk.github.io/e-Todo-site/",
    githubUrl: "https://github.com/ItzBotHulk/e-Todo-site/tree/main",
    tags: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
  },
  {
    id: "getmeachai",
    title: "Get Me a Chai",
    description:
      "Get Me a Chai is a heartfelt charity website for online communities, where supporters can donate to their favorite creators with a simple gesture - buying them a chai.",
    image: "/project/getmeachai.png",
    liveUrl: "https://github.com/ItzBotHulk/GetMeChai",
    githubUrl: "https://github.com/ItzBotHulk/GetMeChai",
    tags: ["Next.js", "React", "Tailwind CSS", "MongoDB", "Razorpay"],
  },
  {
    id: "linktree",
    title: "LinkTree",
    description:
      "LinkTree is a simple, customizable link-in-bio tool that lets you share all your important links through one xlart URL. Perfect for social media, it's your central hub for everything online, inspired by Linktree.",
    image: "/project/linktree.png",
    liveUrl: "https://github.com/ItzBotHulk/LinkTree-Clone",
    githubUrl: "https://github.com/ItzBotHulk/LinkTree-Clone",
    tags: ["React", "Next.js", "Tailwind CSS", "MongoDB"],
  },
  {
    id: "bitlinks",
    title: "BitLinks",
    description:
      "BitLinks is a simple URL shortener that lets you create short, shareable links and saves them for future use. Perfect for easy access and clean sharing.",
    image: "/project/bitlinks.png",
    liveUrl: "https://github.com/ItzBotHulk/URL-Shortner",
    githubUrl: "https://github.com/ItzBotHulk/URL-Shortner",
    tags: ["JavaScript", "Node.js", "Express", "MongoDB"],
  },
  {
    id: "passecure",
    title: "PassSecure",
    description:
      "PassSecure is a lightweight password saver that securely stores your passwords in your browser's local storage. It can always accessible directly from Chrome.",
    image: "/project/passecure.png",
    liveUrl: "https://github.com/ItzBotHulk/PassSecure",
    githubUrl: "https://github.com/ItzBotHulk/PassSecure",
    tags: ["React", "Tailwind CSS", "LocalStorage", "Security"],
  },
];

function ProjectItem({ project, idx }) {
  const [hovered, setHovered] = useState(null); // 'text' | 'image' | null
  const isEven = idx % 2 === 1;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${
        isEven ? "lg:flex-row-reverse" : "lg:flex-row"
      } w-full max-w-5xl mx-auto`}
    >
      {/* Frosted Glass Description Card (Overlapping) */}
      <div
        onMouseEnter={() => setHovered("text")}
        onMouseLeave={() => setHovered(null)}
        className={`w-full sm:w-[440px] md:w-[480px] lg:w-[495px] transition-all duration-400 ease-out cursor-pointer ${
          isEven ? "lg:-ml-16 xl:-ml-24" : "lg:-mr-16 xl:-mr-24"
        } ${
          hovered === "text"
            ? "z-30 scale-[1.03] shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            : hovered === "image"
            ? "z-10 scale-[0.98] opacity-80"
            : "z-20 scale-100 opacity-95"
        }`}
      >
        <div
          className={`relative p-7 sm:p-9 rounded-2xl bg-zinc-900/60 backdrop-blur-2xl border transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.5)] ${
            hovered === "text"
              ? "border-purple-400/60 bg-zinc-900/80"
              : "border-white/10"
          }`}
        >
          <p className="text-[14px] sm:text-[15.5px] text-zinc-200/90 font-serif leading-relaxed mb-6 font-normal">
            {project.description}
          </p>

          {/* Action Icons matching user reference (Click/Pointer Star & GitHub) */}
          <div
            className={`flex items-center gap-4 ${
              isEven ? "justify-start lg:justify-end" : "justify-start"
            }`}
          >
            {/* Live Demo Icon */}
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white hover:scale-110 transition-transform p-1"
              title="Live Demo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
              >
                <path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm6.364 3.636a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM22 12a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm-3.636 6.364a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 1 1 1.414-1.414l1.414 1.414a1 1 0 0 1 0 1.414zM12 22a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1zm-6.364-3.636a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zM2 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm3.636-6.364a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 1 1-1.414 1.414L5.636 7.05a1 1 0 0 1 0-1.414z" />
              </svg>
            </Link>

            {/* GitHub Source Icon */}
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white hover:scale-110 transition-transform p-1"
              title="GitHub Source"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Project Mockup Card (With Purple Glow) */}
      <div
        onMouseEnter={() => setHovered("image")}
        onMouseLeave={() => setHovered(null)}
        className={`w-full sm:w-[500px] md:w-[560px] lg:w-[600px] transition-all duration-400 ease-out cursor-pointer ${
          hovered === "image"
            ? "z-30 scale-[1.03] shadow-[0_0_55px_rgba(168,85,247,0.55)]"
            : hovered === "text"
            ? "z-10 scale-[0.98] opacity-80"
            : "z-10 scale-100 opacity-95"
        }`}
      >
        <div
          className={`relative rounded-2xl overflow-hidden border transition-all duration-300 shadow-[0_0_45px_rgba(147,51,234,0.35)] ${
            hovered === "image"
              ? "border-purple-400/80 shadow-[0_0_55px_rgba(168,85,247,0.55)]"
              : "border-purple-500/35"
          }`}
        >
          {/* Edge-to-edge Project Screenshot */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-top hover:scale-[1.02] transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const canvasRef = useRef(null);

  // Constellation background
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
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
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
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        gradient.addColorStop(0.4, "rgba(192, 132, 252, 0.75)");
        gradient.addColorStop(1, "rgba(147, 51, 234, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 22000), 50);
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

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.8;
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
      id="projects"
      className="relative w-full min-h-screen pt-12 sm:pt-16 pb-28 px-6 md:px-14 flex flex-col items-center bg-transparent overflow-hidden"
    >
      {/* Background Constellation Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
      />

      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-start">
        {/* Section Heading matching reference */}
        <div className="mb-10 md:mb-14 flex flex-col gap-2">
          <h2 className="text-4xl sm:text-5xl font-serif font-normal text-white tracking-tight">
            Projects
          </h2>
        </div>

        {/* Projects List with Overlapping Cards & Dynamic Hover Override */}
        <div className="w-full flex flex-col gap-12 sm:gap-16 md:gap-20">
          {projects.map((project, idx) => (
            <ProjectItem key={project.id} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
