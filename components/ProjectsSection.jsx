"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: "itask",
    num: "01",
    title: "iTask Manager",
    category: "Productivity",
    description:
      "iTask Manager is a simple and efficient to-do website. All the tasks are securely stored in your browser's local storage, so there's no need for sign-ups or an internet connection.",
    image: "/project/itask.png",
    liveUrl: "https://itzbothulk.github.io/e-Todo-site/",
    githubUrl: "https://github.com/ItzBotHulk/e-Todo-site/tree/main",
    tags: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    matcap: "/matcap/mat-19.png",
    matcapId: "mat-19",
    matcapName: "Polished Gold",
    hoverBorder: "border-amber-400/80",
    hoverGlow: "shadow-[0_16px_48px_rgba(251,191,36,0.22)]",
  },
  {
    id: "getmeachai",
    num: "02",
    title: "Get Me a Chai",
    category: "Creator Platform",
    description:
      "Get Me a Chai is a heartfelt charity website for online communities, where supporters can donate to their favorite creators with a simple gesture — buying them a chai.",
    image: "/project/getmeachai.png",
    liveUrl: "https://github.com/ItzBotHulk/GetMeChai",
    githubUrl: "https://github.com/ItzBotHulk/GetMeChai",
    tags: ["Next.js", "React", "Tailwind CSS", "MongoDB", "Razorpay"],
    matcap: "/matcap/mat-18.png",
    matcapId: "mat-18",
    matcapName: "Sunset Amber",
    hoverBorder: "border-rose-400/80",
    hoverGlow: "shadow-[0_16px_48px_rgba(251,113,133,0.22)]",
  },
  {
    id: "linktree",
    num: "03",
    title: "LinkTree",
    category: "Bio Link Hub",
    description:
      "LinkTree is a customizable link-in-bio tool that lets you share all your important links through one smart URL. Perfect for social media, it's your central hub for everything online.",
    image: "/project/linktree.png",
    liveUrl: "https://github.com/ItzBotHulk/LinkTree-Clone",
    githubUrl: "https://github.com/ItzBotHulk/LinkTree-Clone",
    tags: ["React", "Next.js", "Tailwind CSS", "MongoDB"],
    matcap: "/matcap/mat-7.png",
    matcapId: "mat-7",
    matcapName: "Neon Violet",
    hoverBorder: "border-purple-400/80",
    hoverGlow: "shadow-[0_16px_48px_rgba(168,85,247,0.22)]",
  },
  {
    id: "bitlinks",
    num: "04",
    title: "BitLinks",
    category: "URL Shortener",
    description:
      "BitLinks is a fast URL shortener that lets you create short, shareable links and saves them for future use. Perfect for easy access, clean sharing, and traffic monitoring.",
    image: "/project/bitlinks.png",
    liveUrl: "https://github.com/ItzBotHulk/URL-Shortner",
    githubUrl: "https://github.com/ItzBotHulk/URL-Shortner",
    tags: ["JavaScript", "Node.js", "Express", "MongoDB"],
    matcap: "/matcap/mat-5.png",
    matcapId: "mat-5",
    matcapName: "Pearl Silver",
    hoverBorder: "border-indigo-300/80",
    hoverGlow: "shadow-[0_16px_48px_rgba(224,231,255,0.22)]",
  },
  {
    id: "passecure",
    num: "05",
    title: "PassSecure",
    category: "Security Vault",
    description:
      "PassSecure is a lightweight password saver that securely stores your credentials in your browser's local storage. Always accessible directly from Chrome with zero server dependencies.",
    image: "/project/passecure.png",
    liveUrl: "https://github.com/ItzBotHulk/PassSecure",
    githubUrl: "https://github.com/ItzBotHulk/PassSecure",
    tags: ["React", "Tailwind CSS", "LocalStorage", "Security"],
    matcap: "/matcap/mat-18.png",
    matcapId: "mat-18",
    matcapName: "Sunset Amber",
    hoverBorder: "border-rose-400/80",
    hoverGlow: "shadow-[0_16px_48px_rgba(251,113,133,0.22)]",
  },
];

function ProjectItem({ project, idx }) {
  const [hovered, setHovered] = useState(null); // 'text' | 'image' | null
  const isEven = idx % 2 === 1;

  const handleTextHoverEnter = () => {
    setHovered("text");
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio-hover-matcap", { detail: project.matcap })
      );
    }
  };

  const handleTextHoverLeave = () => {
    setHovered(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("portfolio-hover-matcap", { detail: null })
      );
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${
        isEven ? "lg:flex-row-reverse" : "lg:flex-row"
      } w-full max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto gap-0`}
    >
      {/* Frosted Glass Description Card (Overlapping with Depth Effect, Overlapping Bottom on Phone) */}
      <div
        onMouseEnter={handleTextHoverEnter}
        onMouseLeave={handleTextHoverLeave}
        className={`w-[93%] sm:w-[95%] lg:w-[460px] xl:w-[495px] 2xl:w-[560px] 3xl:w-[620px] max-w-md sm:max-w-lg lg:max-w-none order-2 lg:order-none -mt-8 sm:-mt-11 lg:mt-0 transition-all duration-400 ease-out cursor-pointer ${
          isEven ? "lg:-ml-10 xl:-ml-16 2xl:-ml-20" : "lg:-mr-10 xl:-mr-16 2xl:-mr-20"
        } ${
          hovered === "text"
            ? `z-30 scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.85)]`
            : hovered === "image"
            ? "z-10 scale-[0.98] opacity-80"
            : "z-20 scale-100 opacity-95"
        }`}
      >
        <div
          className={`relative p-5 sm:p-7 md:p-8 rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.55)] overflow-hidden ${
            hovered === "text"
              ? `${project.hoverBorder} bg-zinc-900/90 ${project.hoverGlow}`
              : "border-white/[0.12]"
          }`}
        >
          {/* MatCap Ambient Glow & Texture Sheen Overlay on Card Hover */}
          <div
            className={`absolute inset-0 rounded-2xl overflow-hidden pointer-events-none transition-opacity duration-500 z-0 ${
              hovered === "text" ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-cover bg-center filter blur-2xl opacity-35 mix-blend-screen transition-transform duration-700 scale-125"
              style={{ backgroundImage: `url(${project.matcap})` }}
            />
            <div
              className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-cover bg-center filter blur-3xl opacity-20 mix-blend-screen transition-transform duration-700 scale-110"
              style={{ backgroundImage: `url(${project.matcap})` }}
            />
          </div>

          <div className="relative z-10">
            {/* Header Row: Index & Category */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  #{project.num}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  {project.category}
                </span>
              </div>
            </div>

          {/* Project Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2.5">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-[13px] sm:text-[14px] text-zinc-200/90 leading-relaxed mb-4 font-sans font-normal">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex items-center gap-1.5 flex-wrap mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-zinc-300 bg-white/[0.05] border border-white/[0.08]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div
            className={`flex items-center gap-3 pt-3 border-t border-white/[0.08] ${
              isEven ? "justify-start lg:justify-end" : "justify-start"
            }`}
          >
            {/* Live Demo Link */}
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 hover:text-white bg-white/[0.06] hover:bg-purple-600/30 border border-white/[0.1] hover:border-purple-400/40 transition-all hover:scale-105 active:scale-95"
              title="Live Demo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current text-purple-400"
              >
                <path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm6.364 3.636a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM22 12a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm-3.636 6.364a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 1 1 1.414-1.414l1.414 1.414a1 1 0 0 1 0 1.414zM12 22a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1zm-6.364-3.636a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zM2 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1zm3.636-6.364a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 1 1-1.414 1.414L5.636 7.05a1 1 0 0 1 0-1.414z" />
              </svg>
              <span>Demo</span>
            </Link>

            {/* GitHub Source Link */}
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/[0.2] transition-all hover:scale-105 active:scale-95"
              title="GitHub Source"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Code</span>
            </Link>
          </div>
        </div>
      </div>
    </div>

      {/* Project Mockup Card (With Rich Purple Glow & Depth, Top on Phone) */}
      <div
        onMouseEnter={() => setHovered("image")}
        onMouseLeave={() => setHovered(null)}
        className={`w-full max-w-md sm:max-w-lg lg:max-w-none lg:w-[540px] xl:w-[600px] 2xl:w-[680px] 3xl:w-[760px] order-1 lg:order-none transition-all duration-400 ease-out cursor-pointer ${
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
          {/* Edge-to-edge Project Screenshot with subtle gloss overlay */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-top hover:scale-[1.02] transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-white/[0.04] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative w-full min-h-screen pt-12 sm:pt-16 pb-28 px-4 sm:px-6 md:px-14 flex flex-col items-center bg-transparent overflow-hidden"
    >
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-start">
        {/* Section Heading matching user reference */}
        <div className="mb-10 md:mb-14 flex flex-col gap-2">
          <h2 className="text-4xl sm:text-5xl font-serif font-normal text-white tracking-tight">
            Projects
          </h2>
        </div>

        {/* Projects List with Overlapping Cards & Dynamic Hover-Depth */}
        <div className="w-full flex flex-col gap-14 sm:gap-18 md:gap-24">
          {projects.map((project, idx) => (
            <ProjectItem key={project.id} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
