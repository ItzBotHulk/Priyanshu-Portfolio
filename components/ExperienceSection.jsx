"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const experiences = [
  {
    id: "drdo",
    shortName: "DRDO Jodhpur",
    role: "Development Trainee",
    company: "Defence Laboratory, Jodhpur (DRDO)",
    type: "On-site",
    duration: "Sep 2025 - Present",
    isCurrent: true,
    logo: "/img/drdo.png",
    link: "https://www.drdo.gov.in/drdo/labs-establishment/defence-laboratory-jodhpur-dlj",
    tags: ["Unity 3D", "C#", "Interactive Simulations", "Hardware Controls"],
    description:
      "Engineered interactive 3D simulations utilizing the Unity engine and C#. Designed and integrated complex 3D assets with responsive control systems, enabling real-time navigation via physical inputs and wireless controllers.",
    matcap: "/matcap/mat-18.png",
    matcapId: "mat-18",
    matcapName: "Sunset Amber",
    hoverBorder: "group-hover:border-rose-400/60",
    hoverGlow: "group-hover:shadow-[0_12px_40px_rgba(251,113,133,0.25)]",
  },
  {
    id: "relux",
    shortName: "Relux",
    role: "Freelance Full Stack Developer",
    company: "Relux (relux.co.in)",
    type: "Production",
    duration: "Nov 2024 - Feb 2025",
    isCurrent: false,
    logo: "/img/relux.png",
    link: "https://relux.co.in",
    extraLink: "https://github.com/ItzBotHulk",
    tags: ["Next.js", "Tailwind CSS", "Node.js", "Payment Gateways", "DNS/SSL"],
    description:
      "Architected and deployed a streetwear e-commerce platform end-to-end. Built high-performance responsive UI, engineered backend order pipelines, and managed custom domain routing and SSL security.",
    matcap: "/matcap/mat-7.png",
    matcapId: "mat-7",
    matcapName: "Neon Violet",
    hoverBorder: "group-hover:border-purple-400/60",
    hoverGlow: "group-hover:shadow-[0_12px_40px_rgba(192,132,252,0.25)]",
  },
  {
    id: "hashtrust",
    shortName: "HashTrust",
    role: "Software Intern",
    company: "HashTrust Technologies Pvt. Ltd",
    type: "Internship",
    duration: "Jun 2024 - Aug 2024",
    isCurrent: false,
    logo: "/img/logo.png",
    link: "https://hashtrust.in/",
    extraLink: "/document/Internship Certificate - Priyanshu Prajapati (1).pdf",
    tags: ["Django", "Flask", "React.js", "RESTful APIs", "MVT/MVC"],
    description:
      "Developed full-stack web applications using Django & Flask backend architectures coupled with React.js frontend modules. Designed REST APIs, database schemas, and state management workflows.",
    matcap: "/matcap/mat-19.png",
    matcapId: "mat-19",
    matcapName: "Polished Gold",
    hoverBorder: "group-hover:border-amber-400/60",
    hoverGlow: "group-hover:shadow-[0_12px_40px_rgba(251,191,36,0.25)]",
  },
];

export default function ExperienceSection() {
  const containerRef = useRef(null);
  const currentProgress = useRef(0);

  const handleCardHover = (matcap) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio-hover-matcap", { detail: matcap })
      );
    }
  };

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
        const width = typeof window !== "undefined" ? window.innerWidth : 1200;
        const isDesktop = width >= 1024;
        const isTablet = width >= 768 && width < 1024;
        const startX = isDesktop ? -140 : (isTablet ? -80 : -25);
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
    return () => {
      cancelAnimationFrame(animId);
      handleCardHover(null);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="experience"
      className="w-full max-w-2xl 2xl:max-w-3xl flex flex-col justify-center will-change-transform py-1 sm:py-2 px-1 sm:px-3 md:px-0"
      style={{
        transform: "translateX(-25px)",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      {/* Editorial Section Header */}
      <div className="mb-2.5 sm:mb-3 text-left">
        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] 2xl:text-xs font-mono uppercase tracking-widest text-purple-400 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span>Career Journey</span>
        </div>
        <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-bold text-white tracking-tight">
          Work <span className="text-zinc-400 font-normal">Experience</span>
        </h2>
      </div>

      {/* Modern Bento Experience Cards with MatCap Integration */}
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            onMouseEnter={() => handleCardHover(exp.matcap)}
            onMouseLeave={() => handleCardHover(null)}
            className={`group relative w-full rounded-2xl bg-zinc-900/65 hover:bg-zinc-900/90 border border-white/[0.08] ${exp.hoverBorder} p-3.5 sm:p-4 px-4 sm:px-5 shadow-[0_8px_30px_rgba(0,0,0,0.45)] ${exp.hoverGlow} backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-2.5 overflow-hidden cursor-pointer`}
          >
            {/* MatCap Ambient Glow & Texture Sheen Overlay */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
              <div
                className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-cover bg-center filter blur-2xl opacity-35 mix-blend-screen transition-transform duration-700 group-hover:scale-125"
                style={{ backgroundImage: `url(${exp.matcap})` }}
              />
              <div
                className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-cover bg-center filter blur-3xl opacity-20 mix-blend-screen transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${exp.matcap})` }}
              />
            </div>

            <div className="relative z-10 flex flex-col gap-2.5 w-full">
              {/* Header: Logo, Role, Company, MatCap Orb & Duration */}
              <div className="flex items-start justify-between gap-3">
                {/* Left: Logo + Role & Company */}
                <div className="flex items-center gap-3 min-w-0">
                  <Link
                    href={exp.link}
                    target="_blank"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] p-1.5 flex items-center justify-center shrink-0 group-hover:border-white/30 group-hover:bg-white/[0.08] transition-all"
                  >
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    />
                  </Link>

                  <div className="flex flex-col min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-[15px] md:text-base font-semibold text-white tracking-tight group-hover:text-white transition-colors truncate">
                        {exp.role}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white/[0.05] text-zinc-400 border border-white/[0.06] hidden sm:inline-block">
                        {exp.type}
                      </span>
                    </div>

                    <Link
                      href={exp.link}
                      target="_blank"
                      className="text-xs text-zinc-400 hover:text-white transition-colors truncate font-medium flex items-center gap-1 mt-0.5"
                    >
                      <span className="truncate">{exp.company}</span>
                    </Link>
                  </div>
                </div>

                {/* Right: Duration Pill & External Action */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                      exp.isCurrent
                        ? "border-emerald-500/30 bg-emerald-950/25 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "border-white/[0.08] bg-white/[0.03] text-zinc-400"
                    }`}
                  >
                    {exp.isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    <span>{exp.duration}</span>
                  </span>

                  <Link
                    href={exp.link}
                    target="_blank"
                    className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-purple-400/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all group/btn"
                    title="Visit Website"
                  >
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 17L17 7M17 7H7M17 7V17"
                      />
                    </svg>
                  </Link>

                  {exp.extraLink && (
                    <Link
                      href={exp.extraLink}
                      target="_blank"
                      className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-purple-400/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                      title="View Certificate / GitHub"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>

              {/* Narrative Description (Left-aligned, crisp typographical contrast) */}
              <p className="text-[11.5px] sm:text-xs md:text-[13px] text-zinc-300/85 leading-relaxed text-left font-normal pl-0 sm:pl-0.5">
                {exp.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-white/[0.04]">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-purple-950/30 border border-white/[0.06] hover:border-purple-500/30 text-[10px] sm:text-[11px] font-mono text-zinc-400 hover:text-purple-300 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
