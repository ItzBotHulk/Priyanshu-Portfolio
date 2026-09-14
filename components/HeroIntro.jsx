"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const techStack = [
  { name: "HTML5", src: "/img/html.svg", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS3", src: "/img/css.svg", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "JavaScript", src: "/img/javascript.svg", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "React", src: "/img/react.svg", url: "https://react.dev/" },
  { name: "Next.js", src: "/img/nextjs.svg", url: "https://nextjs.org/", invert: true },
  { name: "Node.js", src: "/img/nodejs.svg", url: "https://nodejs.org/" },
  { name: "Express.js", src: "/img/express.svg", url: "https://expressjs.com/", invert: true },
  { name: "Tailwind CSS", src: "/img/tailwind.svg", url: "https://tailwindcss.com/" },
  { name: "Python", src: "/img/python.svg", url: "https://www.python.org/" },
  { name: "Django", src: "/img/django.svg", url: "https://www.djangoproject.com/" },
  { name: "Postman", src: "/img/postman.svg", url: "https://www.postman.com/" },
  { name: "MongoDB", src: "/img/MongoDB.svg", url: "https://www.mongodb.com/" },
  { name: "Mongoose", src: "/img/mongoose.svg", url: "https://mongoosejs.com/" },
  { name: "Git", src: "/img/git.svg", url: "https://git-scm.com/" },
  { name: "GitHub", src: "/img/github.svg", url: "https://github.com/", invert: true },
];

export default function HeroIntro() {
  const containerRef = useRef(null);
  const currentProgress = useRef(0);

  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const getTargetProgress = () => {
      const scrollY = window.scrollY || 0;
      // Phase 2: Starts at 0px, smoothly completes at 450px (synced with 3D model mid-to-left shift)
      const enter = Math.min(Math.max(scrollY / 450, 0), 1);
      // Fade out as user scrolls into Experience section (850px -> 1250px)
      const exit = Math.min(Math.max((scrollY - 850) / 400, 0), 1);
      return { enter, exit };
    };

    const initial = getTargetProgress();
    currentProgress.current = initial.enter;

    const update = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const { enter, exit } = getTargetProgress();
      // Match 3D model damping (lambda = 4)
      currentProgress.current += (enter - currentProgress.current) * (1 - Math.exp(-4 * dt));
      const p = currentProgress.current;

      if (containerRef.current) {
        const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
        // Slide slowly from left (-160px on desktop, -60px on mobile) to right (0px)
        const startX = isDesktop ? -160 : -60;
        const currentX = (1 - p) * startX;
        const currentY = -40 * exit;
        const rawOpacity = Math.min(Math.max((p - 0.05) / 0.95, 0), 1) * (1 - exit);

        containerRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        containerRef.current.style.opacity = rawOpacity.toFixed(3);
        containerRef.current.style.pointerEvents = (p > 0.7 && exit < 0.3) ? "auto" : "none";
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col justify-center items-center md:items-start text-center md:text-left will-change-transform"
      style={{
        transform: "translateX(-160px)",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      {/* Title & Name */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-2">
        Hello I am, <br />
        <span className="text-[#8b5cf6] drop-shadow-[0_0_25px_rgba(139,92,246,0.35)]">
          Priyanshu!
        </span>
      </h1>

      {/* Subtitle */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1 mb-3">
        A Full Stack Developer.
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base text-zinc-400 max-w-md mb-8 leading-relaxed">
        Currently open to new opportunities in web development.
      </p>

      {/* Status & Focus Badge */}
      <div className="flex items-center gap-3 select-none pointer-events-none">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-medium backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Available for Opportunities
        </span>
      </div>
    </div>
  );
}
