"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const experiences = [
  {
    id: "drdo",
    shortName: "DRDO Jodhpur",
    role: "Development Trainee",
    company: "Defence Laboratory, Jodhpur (DRDO)",
    duration: "Sep 2025 - Present",
    logo: "/img/drdo.png",
    link: "https://www.drdo.gov.in/drdo/labs-establishment/defence-laboratory-jodhpur-dlj",
    description:
      "Developed interactive 3D simulations utilizing the Unity engine and C#. Designed and integrated complex 3D models with responsive control systems, enabling real-time navigation and interaction via physical keyboard inputs as well as wireless controllers.",
  },
  {
    id: "relux",
    shortName: "Relux",
    role: "Freelance Full Stack Developer",
    company: "Relux (relux.co.in)",
    duration: "Nov 2024 - Feb 2025",
    logo: "/img/relux.png",
    link: "https://relux.co.in",
    extraLink: "https://github.com/ItzBotHulk",
    description:
      "Developed a premium streetwear e-commerce platform from scratch. Designed responsive user interfaces and implemented robust backend architecture. Managed production deployment, custom domain mapping, DNS record routing, and SSL certificate installation to guarantee secure HTTPS transactions.",
  },
  {
    id: "hashtrust",
    shortName: "HashTrust",
    role: "Software Intern",
    company: "HashTrust Technologies Pvt. Ltd",
    duration: "Jun 2024 - Aug 2024",
    logo: "/img/logo.png",
    link: "https://hashtrust.in/",
    extraLink: "/document/Internship Certificate - Priyanshu Prajapati (1).pdf",
    description:
      "Developed full-stack web applications using Django and Flask for robust backend solutions, combined with React.js for building modular, interactive user interfaces. Applied essential web development concepts including RESTful APIs, database schema design, MVC/MVT architecture patterns, state management, and component-based routing.",
  },
];

export default function ExperienceSection() {
  const containerRef = useRef(null);
  const currentProgress = useRef(0);

  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const getTargetProgress = () => {
      const scrollY = window.scrollY || 0;
      // Phase 3: Enters between 850px and 1400px
      const enter = Math.min(Math.max((scrollY - 850) / 550, 0), 1);
      // Fades out when leaving experience track (~2550px -> 2850px)
      const exit = Math.min(Math.max((scrollY - 2550) / 300, 0), 1);
      return { enter, exit };
    };

    currentProgress.current = getTargetProgress().enter;

    const update = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const { enter, exit } = getTargetProgress();
      currentProgress.current += (enter - currentProgress.current) * (1 - Math.exp(-4 * dt));
      const p = currentProgress.current;

      if (containerRef.current) {
        const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
        const startX = isDesktop ? -140 : -50;
        const currentX = (1 - p) * startX;
        const currentY = -30 * exit;
        const opacity = Math.min(Math.max((p - 0.05) / 0.95, 0), 1) * (1 - exit);

        containerRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        containerRef.current.style.opacity = opacity.toFixed(3);
        containerRef.current.style.pointerEvents = (p > 0.6 && exit < 0.4) ? "auto" : "none";
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      id="experience"
      className="w-full max-w-2xl flex flex-col justify-center will-change-transform py-2"
      style={{
        transform: "translateX(-140px)",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      {/* Section Header */}
      <div className="mb-2.5 text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Work</span>
          <span className="text-[#8b5cf6] drop-shadow-[0_0_20px_rgba(139,92,246,0.35)]">Experience</span>
        </h2>
      </div>

      {/* All 3 Cards Visible Simultaneously */}
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="relative w-full rounded-3xl bg-[#190634] border border-purple-900/60 hover:border-purple-500/50 p-3.5 sm:p-4 px-4 sm:px-6 flex flex-row items-center justify-between gap-3 sm:gap-5 shadow-xl shadow-purple-950/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]"
          >
            {/* Left: Company Logo */}
            <div className="flex justify-center items-center shrink-0">
              <Link
                href={exp.link}
                target="_blank"
                className="hover:opacity-85 transition-opacity block"
              >
                <Image
                  src={exp.logo}
                  alt={exp.company}
                  width={90}
                  height={90}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-2xl drop-shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                />
              </Link>
            </div>

            {/* Center: Details (Role, Company, Duration, Description) */}
            <div className="flex flex-col items-center justify-center text-center flex-1 px-1 sm:px-2">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
                {exp.role}
              </h3>

              <Link
                href={exp.link}
                target="_blank"
                className="text-xs sm:text-sm md:text-base font-medium text-white/90 hover:underline mt-0.5 transition-colors text-center"
              >
                {exp.company}
              </Link>

              <p className="text-[10px] sm:text-xs opacity-70 text-zinc-300 mt-0.5 font-mono">
                {exp.duration}
              </p>

              <p className="text-[11px] sm:text-xs opacity-85 text-zinc-300 mt-1.5 leading-relaxed text-center">
                {exp.description}
              </p>
            </div>

            {/* Right: Click Action Icon */}
            <div className="flex flex-col items-center justify-center gap-2 shrink-0">
              <Link
                href={exp.link}
                target="_blank"
                title="Visit Website"
                className="p-1.5 rounded-full hover:bg-white/10 transition-transform hover:scale-115 flex items-center justify-center"
              >
                <Image
                  src="/bgs/click.png"
                  alt="click"
                  width={18}
                  height={18}
                  className="brightness-0 invert opacity-85 hover:opacity-100 transition-opacity"
                />
              </Link>

              {exp.extraLink && (
                <Link
                  href={exp.extraLink}
                  target="_blank"
                  title="View Certificate / GitHub"
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-115 flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
