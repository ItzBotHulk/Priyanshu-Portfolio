"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("prajapatipriyanshu123p2@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  useEffect(() => {
    let animId = null;
    let lastTime = 0;
    let isRunning = false;

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(update);
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight * 1.5) return;
      const scrollDist = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollDist <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / scrollDist, 0), 1);
      targetProgress.current = progress;
      startAnimation();
    };

    const update = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      currentProgress.current += (targetProgress.current - currentProgress.current) * (1 - Math.exp(-7 * dt));
      const p = currentProgress.current;

      const slideProgress = Math.min(Math.max(p / 0.85, 0), 1);
      const ease = 1 - Math.pow(1 - slideProgress, 3);
      const currentY = (1 - ease) * 100;
      const opacity = Math.min(Math.max(slideProgress * 1.5, 0), 1);
      const isInteractive = slideProgress >= 0.75;

      if (panelRef.current) {
        panelRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}%, 0)`;
        panelRef.current.style.opacity = opacity.toFixed(3);
        panelRef.current.style.pointerEvents = isInteractive ? "auto" : "none";
        panelRef.current.style.visibility = slideProgress > 0.005 ? "visible" : "hidden";
      }

      if (Math.abs(targetProgress.current - currentProgress.current) < 0.0008) {
        currentProgress.current = targetProgress.current;
        isRunning = false;
      } else {
        animId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[180vh] bg-transparent"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-y-auto md:overflow-hidden flex flex-col justify-center items-center pointer-events-none">

        {/* Full-Screen Footer Content (Slides smoothly up from down on scroll) */}
        <div
          ref={panelRef}
          className="w-full h-full min-h-screen bg-zinc-950 border-t border-white/[0.08] shadow-[0_-25px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between items-center px-4 sm:px-6 py-6 sm:py-10 md:py-14 select-none will-change-transform pointer-events-none"
          style={{
            transform: "translate3d(0, 100%, 0)",
            opacity: 0,
            visibility: "hidden",
          }}
        >
          {/* Subtle Background Ambiance Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[250px] sm:h-[350px] bg-purple-950/20 blur-[130px] pointer-events-none rounded-full" />

          {/* Clean, Human & Professional Header */}
          <div className="w-full max-w-4xl 2xl:max-w-6xl text-center flex flex-col items-center pt-2 md:pt-4 z-10">
            <h2 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold tracking-tight text-white mb-3">
              Get In Touch
            </h2>
            <p className="text-zinc-400 max-w-md 2xl:max-w-lg text-xs sm:text-sm md:text-base 2xl:text-lg leading-relaxed px-2 font-normal">
              Whether you have an opportunity, a project to build, or just want to say hi — feel free to drop a line.
            </p>
          </div>

          {/* Main Content: Actions on Left, Pixel Workstation GIF on Right */}
          <div className="w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl my-auto py-4 sm:py-6 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 2xl:gap-16 items-center justify-items-center">

              {/* Left Column: Glass Card with Actions, Socials & One-Click Copy */}
              <div className="w-full max-w-sm sm:max-w-md 2xl:max-w-lg p-6 sm:p-8 2xl:p-10 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center gap-5 sm:gap-6 2xl:gap-8 text-center hover:border-purple-500/30 transition-all duration-300">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-zinc-400 font-medium">
                  Direct Inquiries
                </span>

                {/* Interactive Copy Email Pill */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Click to copy email"
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/40 text-xs sm:text-sm text-zinc-200 hover:text-white font-mono transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] group shadow-sm"
                >
                  {copied ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-emerald-400 font-medium">
                        Email copied to clipboard!
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-400 transition-colors shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">
                        prajapatipriyanshu123p2@gmail.com
                      </span>
                    </>
                  )}
                </button>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1">
                  <Link
                    href="https://www.linkedin.com/in/priyanshu-20x/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-purple-400/50 transition-all duration-200 hover:scale-110"
                    aria-label="LinkedIn Profile"
                  >
                    <Image
                      src="/bgs/linkedin.svg"
                      alt="LinkedIn"
                      width={22}
                      height={22}
                      className="w-5 h-5 invert brightness-200"
                    />
                  </Link>

                  <Link
                    href="https://github.com/ItzBotHulk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-purple-400/50 transition-all duration-200 hover:scale-110"
                    aria-label="GitHub Profile"
                  >
                    <Image
                      src="/bgs/github.svg"
                      alt="GitHub"
                      width={22}
                      height={22}
                      className="w-5 h-5 invert brightness-200"
                    />
                  </Link>

                  <Link
                    href="mailto:prajapatipriyanshu123p2@gmail.com"
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-purple-400/50 transition-all duration-200 hover:scale-110"
                    aria-label="Send Direct Email"
                  >
                    <Image
                      src="/bgs/mail.svg"
                      alt="Email"
                      width={22}
                      height={22}
                      className="w-5 h-5 invert brightness-200"
                    />
                  </Link>
                </div>
              </div>

              {/* Right Column: Workstation Pixel Art GIF */}
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
                  <Image
                    src="/bgs/comp.gif"
                    alt="Developer Workstation"
                    width={320}
                    height={320}
                    unoptimized
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Notice */}
          <div className="w-full pt-3 sm:pt-4 border-t border-white/[0.06] text-center z-10 flex items-center justify-center max-w-4xl text-zinc-500 text-[11px] sm:text-xs">
            <p>
              &copy; {currentYear} Priyanshu Prajapati. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Anchor for Navbar Contact Link */}
      <div id="contact" className="absolute bottom-0 w-full h-4 pointer-events-none" />
    </section>
  );
}
