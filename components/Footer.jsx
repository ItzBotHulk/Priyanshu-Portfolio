"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const containerRef = useRef(null);
  const [expandProgress, setExpandProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollDist = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollDist <= 0) return;

      // When the top of this container reaches the viewport top
      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / scrollDist, 0), 1);
      setExpandProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Emergence calculation:
  // 0.0 -> 0.25: 3D model zooms into face in background (footer hidden)
  // 0.25 -> 0.85: Footer emerges & blossoms directly from the model's face (50% X, 42% Y)
  // 0.85 -> 1.0: Footer takes over full screen, completely visible and interactive
  const emergeT = Math.min(Math.max((expandProgress - 0.25) / 0.60, 0), 1);
  const ease = emergeT * emergeT * (3 - 2 * emergeT);

  const scale = 0.2 + 0.8 * ease;
  const opacity = ease;
  const isFullyOpen = expandProgress >= 0.85;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[200vh] bg-transparent"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center pointer-events-none">
        
        {/* Expanding Glow Pulse from the Face */}
        {emergeT > 0.05 && emergeT < 0.95 && (
          <div
            className="absolute rounded-full pointer-events-none z-10 border border-purple-400/60 shadow-[0_0_80px_rgba(168,85,247,0.7),inset_0_0_40px_rgba(236,72,153,0.5)] transition-none"
            style={{
              left: "50%",
              top: "42%",
              width: `${ease * 140}vw`,
              height: `${ease * 140}vw`,
              transform: "translate(-50%, -50%)",
              opacity: 1 - ease * 0.5,
            }}
          />
        )}

        {/* Full-Screen Footer Content (Expands outward from the model's face) */}
        <div
          className={`w-full h-full bg-black border-t border-white/10 flex flex-col justify-between items-center px-6 py-10 md:py-14 select-none transition-none ${
            isFullyOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{
            transform: isFullyOpen ? "none" : `scale(${scale})`,
            transformOrigin: "50% 42%",
            clipPath: isFullyOpen
              ? "none"
              : `circle(${ease * 160}% at 50% 42%)`,
            opacity: opacity,
            visibility: emergeT > 0.01 ? "visible" : "hidden",
          }}
        >
          {/* Subtle Background Ambiance Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-950/25 blur-[120px] pointer-events-none rounded-full" />

          {/* Top Header */}
          <div className="w-full max-w-4xl text-center flex flex-col items-center pt-2 md:pt-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/30 backdrop-blur-md text-xs text-purple-300 font-mono mb-3 tracking-wide shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3">
              Let&apos;s Connect &amp;{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Collaborate
              </span>
            </h2>
            <p className="text-zinc-400 max-w-lg text-sm sm:text-base font-light">
              Have an exciting project, full-time role, or idea in mind? Feel free to reach out anytime!
            </p>
          </div>

          {/* Main Content: Socials & Email on Left, Pixel Workstation GIF on Right */}
          <div className="w-full max-w-5xl my-auto py-6 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-items-center">
              
              {/* Left Column: Glass Card with Social Links & Email Address */}
              <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center gap-5 text-center hover:border-purple-500/30 transition-all duration-300">
                <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                  Connect With Me
                </span>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-5">
                  <Link
                    href="https://www.linkedin.com/in/priyanshu-20x/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-purple-400/60 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                    aria-label="LinkedIn"
                  >
                    <Image
                      src="/bgs/linkedin.svg"
                      alt="LinkedIn"
                      width={26}
                      height={26}
                      className="w-6 h-6 invert brightness-200 transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>

                  <Link
                    href="https://github.com/ItzBotHulk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-purple-400/60 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                    aria-label="GitHub"
                  >
                    <Image
                      src="/bgs/github.svg"
                      alt="GitHub"
                      width={26}
                      height={26}
                      className="w-6 h-6 invert brightness-200 transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>

                  <Link
                    href="mailto:prajapatipriyanshu123p2@gmail.com"
                    className="group p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-purple-400/60 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                    aria-label="Email"
                  >
                    <Image
                      src="/bgs/mail.svg"
                      alt="Email"
                      width={26}
                      height={26}
                      className="w-6 h-6 invert brightness-200 transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>
                </div>

                {/* Email Pill Link */}
                <a
                  href="mailto:prajapatipriyanshu123p2@gmail.com"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/[0.03] hover:bg-purple-900/20 border border-white/10 hover:border-purple-500/40 text-xs sm:text-sm text-zinc-300 hover:text-white font-mono transition-all duration-300 tracking-wide flex items-center justify-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-125 transition-transform" />
                  <span>prajapatipriyanshu123p2@gmail.com</span>
                </a>
              </div>

              {/* Right Column: Workstation Pixel Art GIF */}
              <div className="flex items-center justify-center">
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
                  <Image
                    src="/bgs/comp.gif"
                    alt="Developer Workstation"
                    width={280}
                    height={280}
                    unoptimized
                    className="object-contain filter drop-shadow-[0_12px_35px_rgba(0,0,0,0.85)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Notice */}
          <div className="w-full pt-4 border-t border-white/5 text-center z-10">
            <p className="text-xs sm:text-sm text-zinc-400 tracking-wide font-normal">
              Copyright &copy; {currentYear} Priyanshu&apos;s Portfolio - All rights reserved!
            </p>
          </div>
        </div>
      </div>

      {/* Anchor for Navbar Contact Link */}
      <div id="contact" className="absolute bottom-0 w-full h-4 pointer-events-none" />
    </section>
  );
}
