"use client";

import React, { useEffect } from "react";
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
    matcap: "/matcap/mat-7.png",
    matcapId: "mat-7",
    matcapName: "Neon Violet",
    hoverBorder: "group-hover:border-purple-400/70",
    hoverGlow: "group-hover:shadow-[0_12px_40px_rgba(168,85,247,0.22)]",
  },
  {
    institution: "Sangam University",
    degree: "Diploma in Computer Science & Engineering",
    duration: "Aug 2022 - Aug 2025",
    logo: "/img/sangam.png",
    alt: "Sangam University Logo",
    link: "https://sangamuniversity.ac.in/",
    matcap: "/matcap/mat-19.png",
    matcapId: "mat-19",
    matcapName: "Polished Gold",
    hoverBorder: "group-hover:border-amber-400/70",
    hoverGlow: "group-hover:shadow-[0_12px_40px_rgba(251,191,36,0.22)]",
  },
];

export default function EducationSection() {
  const handleCardHover = (matcap) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio-hover-matcap", { detail: matcap })
      );
    }
  };

  useEffect(() => {
    return () => {
      handleCardHover(null);
    };
  }, []);

  return (
    <section
      id="education"
      className="relative w-full min-h-0 md:min-h-[50vh] py-8 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center bg-transparent overflow-hidden"
    >
      {/* Section Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">
        {/* Editorial Section Heading */}
        <div className="flex flex-col gap-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-purple-400 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Education &amp; <span className="text-zinc-400 font-normal">Qualifications</span>
          </h2>
        </div>

        {/* Education Cards Stack */}
        <div className="flex flex-col gap-3.5 sm:gap-4.5 w-full">
          {educationData.map((item) => (
            <div
              key={item.institution}
              onMouseEnter={() => handleCardHover(item.matcap)}
              onMouseLeave={() => handleCardHover(null)}
              className={`group relative w-full rounded-2xl bg-zinc-900/65 hover:bg-zinc-900/90 border border-white/[0.08] ${item.hoverBorder} shadow-[0_8px_30px_rgba(0,0,0,0.45)] ${item.hoverGlow} backdrop-blur-xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden cursor-pointer`}
            >
              {/* MatCap Ambient Glow & Texture Sheen Overlay */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                <div
                  className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-cover bg-center filter blur-2xl opacity-35 mix-blend-screen transition-transform duration-700 group-hover:scale-125"
                  style={{ backgroundImage: `url(${item.matcap})` }}
                />
                <div
                  className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-cover bg-center filter blur-3xl opacity-20 mix-blend-screen transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.matcap})` }}
                />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                {/* Left: Logo & Details */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  {/* Institute Logo Box */}
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] p-2 flex items-center justify-center shrink-0 group-hover:border-white/30 group-hover:bg-white/[0.08] transition-all"
                  >
                    <Image
                      src={item.logo}
                      alt={item.alt}
                      width={52}
                      height={52}
                      className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    />
                  </Link>

                  {/* Degree & Institution */}
                  <div className="flex flex-col text-left">
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>{item.degree}</span>
                      <span className="text-zinc-500 text-xs group-hover:translate-x-0.5 transition-transform">↗</span>
                    </Link>
                    <span className="text-xs sm:text-[13px] text-zinc-400 font-medium mt-0.5">
                      {item.institution}
                    </span>
                  </div>
                </div>

                {/* Right: Duration Pill */}
                <div className="shrink-0 sm:self-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
                    {item.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
