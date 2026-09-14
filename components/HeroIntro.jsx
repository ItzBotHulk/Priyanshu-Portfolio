"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const row1Techs = [
  { name: "HTML5", src: "/img/html.svg", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS3", src: "/img/css.svg", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "JavaScript", src: "/img/javascript.svg", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "React", src: "/img/react.svg", href: "https://react.dev/" },
  { name: "Next.js", src: "/img/nextjs.svg", href: "https://nextjs.org/", invert: true },
  { name: "Node.js", src: "/img/nodejs.svg", href: "https://nodejs.org/en" },
  { name: "Express", src: "/img/express.svg", href: "https://expressjs.com/", invert: true },
  { name: "Tailwind CSS", src: "/img/tailwind.svg", href: "https://tailwindcss.com/" },
  { name: "Python", src: "/img/python.svg", href: "https://www.python.org/" },
];

const row2Techs = [
  { name: "Django", src: "/img/django.svg", href: "https://www.djangoproject.com/" },
  { name: "Postman", src: "/img/postman.svg", href: "https://www.postman.com/" },
  { name: "MongoDB", src: "/img/MongoDB.svg", href: "https://www.mongodb.com/" },
  { name: "Mongoose", src: "/img/mongoose.svg", href: "https://mongoosejs.com/" },
  { name: "Git", src: "/img/git.svg", href: "https://git-scm.com/" },
  { name: "GitHub", src: "/img/github.svg", href: "https://github.com/", invert: true },
];

export default function HeroIntro() {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY || 0;

      // Phase 1: Welcome Page (0px -> 140px): HeroIntro is hidden, allowing Welcome page full focus
      // Phase 2: Transition to Name Page (140px -> 460px): Smoothly fades in and slides into place
      const enterProgress = Math.min(Math.max((scrollY - 140) / 320, 0), 1);

      // Phase 3: Transition to Experience Section (850px -> 1350px): Smoothly fades out
      const exitProgress = Math.min(Math.max((scrollY - 850) / 500, 0), 1);

      const opacity = (enterProgress * (1 - exitProgress)).toFixed(3);
      const translateX = ((1 - enterProgress) * 35).toFixed(2);
      const translateY = (-30 * exitProgress).toFixed(2);

      containerRef.current.style.opacity = opacity;
      containerRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      containerRef.current.style.pointerEvents = (enterProgress > 0.75 && exitProgress < 0.85) ? "auto" : "none";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col justify-center items-center md:items-start text-center md:text-left will-change-[transform,opacity] px-2 sm:px-4 md:px-0"
      style={{
        opacity: 0,
        transform: "translate3d(35px, 0, 0)",
        pointerEvents: "none",
      }}
    >
      {/* Title & Name */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold text-white tracking-tight leading-[1.15] mb-2 text-center md:text-left">
        Hello I am, <br />
        <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
          Priyanshu!
        </span>
      </h1>

      {/* Subtitle */}
      <h2 className="text-xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-zinc-100 tracking-tight mt-1 mb-2 text-center md:text-left">
        A Full Stack Developer.
      </h2>

      {/* Description */}
      <p className="text-xs sm:text-sm md:text-base 2xl:text-lg text-zinc-400 max-w-xs sm:max-w-md 2xl:max-w-xl mb-5 leading-relaxed text-center md:text-left">
        Currently open to new opportunities in modern web development &amp; actively exploring CRM tech (Salesforce).
      </p>

      {/* Tech Stack Icons Grid (2 Rows) */}
      <div className="flex flex-col gap-3 mb-6 items-center md:items-start pointer-events-auto">
        {/* Row 1: 9 Core Technologies */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
          {row1Techs.map((tech) => (
            <Link
              key={tech.name}
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              title={tech.name}
              className="hover:scale-120 hover:-translate-y-1 transition-all duration-200 cursor-pointer pointer-events-auto shrink-0"
            >
              <Image
                src={tech.src}
                alt={tech.name}
                width={42}
                height={42}
                className={`w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform drop-shadow-md ${
                  tech.invert ? "brightness-0 invert" : ""
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Row 2: 6 Database & Tools */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
          {row2Techs.map((tech) => (
            <Link
              key={tech.name}
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              title={tech.name}
              className="hover:scale-120 hover:-translate-y-1 transition-all duration-200 cursor-pointer pointer-events-auto shrink-0"
            >
              <Image
                src={tech.src}
                alt={tech.name}
                width={42}
                height={42}
                className={`w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform drop-shadow-md ${
                  tech.invert ? "brightness-0 invert" : ""
                }`}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Actions & Exploration Badges */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 pointer-events-auto">
        <a
          href="/document/resume.pdf"
          download="Priyanshu_Prajapati_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/60 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs sm:text-[13px] font-medium transition-all backdrop-blur-sm cursor-pointer shrink-0"
        >
          <svg
            className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download Resume</span>
        </a>

        {/* Exploring CRM Tech Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#00A1E0]/10 border border-[#00A1E0]/30 text-sky-200 text-xs sm:text-[13px] font-medium backdrop-blur-sm shrink-0">
          <Image
            src="/img/salesforce.svg"
            alt="Salesforce"
            width={18}
            height={18}
            className="w-4 h-4 object-contain"
          />
          <span>Exploring CRM Tech (Salesforce)</span>
        </div>
      </div>
    </div>
  );
}
