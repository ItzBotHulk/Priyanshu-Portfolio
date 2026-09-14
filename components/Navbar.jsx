"use client";

import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Transition from centered Welcome pill to docked top navbar as user scrolls
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      name: "Experience",
      onClick: (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        window.scrollTo({ top: 1550, behavior: "smooth" });
      },
    },
    {
      name: "Projects",
      onClick: (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      name: "Skills",
      onClick: (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      name: "Education",
      onClick: (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        document.getElementById("education")?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  const handleContactClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`fixed left-1/2 z-50 top-4 w-[94vw] sm:w-[640px] max-w-2xl transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isScrolled
          ? "-translate-x-1/2 translate-y-0"
          : "-translate-x-1/2 translate-y-[calc(50vh-50%-1rem)]"
      }`}
    >
      <nav
        className={`relative flex items-center justify-between w-full h-[52px] px-4 sm:px-6 rounded-full border overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "bg-zinc-900/90 backdrop-blur-xl border-white/20 shadow-[0_12px_40px_rgba(113,39,186,0.15)]"
            : "bg-zinc-950/80 backdrop-blur-xl border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.85)]"
        }`}
      >
        {/* CENTER SLOT: "WELCOME" - Centered on Welcome Page, gently dissolves upward with blur on scroll */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none will-change-[transform,opacity,filter] ${
            isScrolled
              ? "opacity-0 scale-90 -translate-y-3.5 blur-sm pointer-events-none delay-0"
              : "opacity-100 scale-100 translate-y-0 blur-0 delay-[250ms]"
          }`}
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7127BA] shadow-[0_0_10px_#7127BA]" />
          </span>
          <span className="text-sm sm:text-base font-bold tracking-[0.22em] bg-gradient-to-r from-white via-purple-100 to-[#c084fc] bg-clip-text text-transparent uppercase font-mono">
            Welcome
          </span>
        </div>

        {/* LEFT SLOT: "Priyanshu" brand - Slides in smoothly from left as navbar docks */}
        <a
          href="#"
          className={`flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight text-white hover:text-purple-300 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 will-change-[transform,opacity,filter] ${
            isScrolled
              ? "opacity-100 translate-x-0 blur-0 pointer-events-auto delay-[300ms]"
              : "opacity-0 -translate-x-5 blur-sm pointer-events-none delay-0"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#7127BA] shadow-[0_0_8px_#7127BA] animate-pulse" />
          <span className="bg-gradient-to-r from-white via-purple-200 to-[#7127BA] bg-clip-text text-transparent font-semibold">
            Priyanshu
          </span>
        </a>

        {/* RIGHT SLOT: Navigation Links & CTA - Slides in from right with gentle cascade */}
        <div
          className={`flex items-center gap-2 sm:gap-3 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity,filter] ${
            isScrolled
              ? "opacity-100 translate-x-0 blur-0 pointer-events-auto delay-[300ms]"
              : "opacity-0 translate-x-5 blur-sm pointer-events-none delay-0"
          }`}
        >
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 text-xs lg:text-sm text-zinc-300 shrink-0">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase()}`}
                onClick={link.onClick}
                style={{
                  transitionDelay: isScrolled ? `${360 + idx * 55}ms` : "0ms",
                }}
                className={`px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all duration-[600ms] font-medium cursor-pointer ${
                  isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Contact CTA */}
          <a
            href="#contact"
            onClick={handleContactClick}
            style={{
              transitionDelay: isScrolled ? "600ms" : "0ms",
            }}
            className={`text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7127BA] to-[#8d42e6] hover:from-[#8d42e6] hover:to-[#7127BA] text-white shadow-[0_0_12px_rgba(113,39,186,0.4)] hover:shadow-[0_0_20px_rgba(113,39,186,0.7)] transition-all duration-[600ms] shrink-0 cursor-pointer ${
              isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            Contact
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none ml-1"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {isScrolled && mobileMenuOpen && (
        <div className="md:hidden mt-2 w-full rounded-2xl bg-zinc-900/95 backdrop-blur-2xl border border-white/15 p-3 shadow-2xl shadow-black/80 flex flex-col gap-1 animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.name.toLowerCase()}`}
              onClick={link.onClick}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
            >
              <span>{link.name}</span>
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
          <div className="pt-2 border-t border-white/10 mt-1">
            <a
              href="#contact"
              onClick={handleContactClick}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7127BA] to-[#8d42e6] text-white font-medium text-sm text-center block transition-colors shadow-md shadow-purple-600/30"
            >
              Get In Touch
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
