"use client";

import React, { useState, useEffect } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-1/2 z-50 w-[92vw] sm:w-[580px] max-w-xl top-4 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isScrolled
          ? "-translate-x-1/2 translate-y-0"
          : "-translate-x-1/2 translate-y-[calc(50vh-50%-1rem)]"
      }`}
    >
      <nav
        className={`relative flex items-center justify-between w-full h-[52px] px-5 rounded-full border transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[background-color,border-color,box-shadow] ${
          isScrolled
            ? "bg-zinc-900/85 backdrop-blur-xl border-white/20 shadow-2xl shadow-indigo-500/10"
            : "bg-zinc-900/60 backdrop-blur-md border-white/10 shadow-2xl shadow-black/60"
        }`}
      >
        {/* CENTER SLOT: "Welcome" - Perfectly centered initially, dissolves slowly on scroll */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none will-change-[transform,opacity] ${
            isScrolled
              ? "opacity-0 scale-90 -translate-y-2 pointer-events-none delay-0"
              : "opacity-100 scale-100 translate-y-0 delay-150"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
          <span className="text-base sm:text-lg font-bold tracking-widest text-white uppercase">
            Welcome
          </span>
        </div>

        {/* LEFT SLOT: "Priyanshu" - Slides in slowly and gracefully on scroll */}
        <a
          href="#"
          className={`flex items-center gap-2 text-sm font-semibold tracking-wide text-white hover:text-indigo-400 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap will-change-[transform,opacity] ${
            isScrolled
              ? "opacity-100 translate-x-0 pointer-events-auto delay-150"
              : "opacity-0 -translate-x-4 pointer-events-none delay-0"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
          <span>Priyanshu</span>
        </a>

        {/* RIGHT SLOT: Navigation Links & CTA - Slides in slowly and gracefully on scroll */}
        <div
          className={`flex items-center gap-3 sm:gap-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity] ${
            isScrolled
              ? "opacity-100 translate-x-0 pointer-events-auto delay-150"
              : "opacity-0 translate-x-4 pointer-events-none delay-0"
          }`}
        >
          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-zinc-300 shrink-0">
            <a
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 1550, behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Experience
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Skills
            </a>
            <a
              href="#education"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("education")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Education
            </a>
          </div>

          {/* Contact CTA Button */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full bg-white text-zinc-950 hover:bg-indigo-400 hover:text-white transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            Contact
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
