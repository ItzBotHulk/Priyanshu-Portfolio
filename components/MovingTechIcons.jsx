"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const techIcons = [
  { name: "JavaScript", src: "/img/javascript.svg", className: "" },
  { name: "React", src: "/img/react.svg", className: "" },
  { name: "Next.js", src: "/img/nextjs.svg", className: "invert" },
  { name: "Node.js", src: "/img/nodejs.svg", className: "" },
  { name: "Express", src: "/img/express.svg", className: "invert brightness-200" },
  { name: "Tailwind CSS", src: "/img/tailwind.svg", className: "" },
  { name: "Python", src: "/img/python.svg", className: "" },
  {
    name: "Django",
    src: "/img/django.svg",
    className: "invert brightness-150 sepia hue-rotate-[290deg]",
  },
  { name: "HTML5", src: "/img/html.svg", className: "" },
  { name: "CSS3", src: "/img/css.svg", className: "" },
  { name: "Postman", src: "/img/postman.svg", className: "" },
  { name: "MongoDB", src: "/img/MongoDB.svg", className: "" },
  { name: "Git", src: "/img/git.svg", className: "" },
  { name: "GitHub", src: "/img/github.svg", className: "invert" },
  { name: "Salesforce", src: "/img/salesforce.svg", className: "" },
];

export default function MovingTechIcons({ scrollDriven = false }) {
  const containerRef = useRef(null);
  const [opacity, setOpacity] = useState(scrollDriven ? 0 : 1);

  // Scroll visibility control when embedded in the 3D scroll container
  useEffect(() => {
    if (!scrollDriven) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      // Fade in smoothly between 2250px and 2600px
      const enter = Math.min(Math.max((scrollY - 2250) / 350, 0), 1);
      // Fade out as user scrolls past 3200px into projects
      const exit = Math.min(Math.max((scrollY - 3150) / 250, 0), 1);
      const calculatedOpacity = enter * (1 - exit);
      setOpacity(calculatedOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDriven]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-zinc-950/60 backdrop-blur-md py-4 sm:py-5 border-y border-white/[0.08] transition-opacity duration-300 select-none"
      style={{ opacity }}
    >
      {/* Elegant Left & Right Fade Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20" />

      {/* Continuously Moving Marquee Track */}
      <div className="relative z-10 w-full overflow-hidden flex items-center">
        <div className="animate-marquee flex items-center shrink-0">
          {/* First set of icons */}
          {techIcons.map((tech, idx) => (
            <div
              key={`tech-1-${idx}`}
              className="flex items-center justify-center mx-5 sm:mx-8 md:mx-12 lg:mx-14 shrink-0 opacity-75 hover:opacity-100 transition-opacity"
              title={tech.name}
            >
              <Image
                src={tech.src}
                alt={tech.name}
                width={44}
                height={44}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${tech.className}`}
              />
            </div>
          ))}

          {/* Second duplicate set for seamless infinite loop */}
          {techIcons.map((tech, idx) => (
            <div
              key={`tech-2-${idx}`}
              className="flex items-center justify-center mx-5 sm:mx-8 md:mx-12 lg:mx-14 shrink-0 opacity-75 hover:opacity-100 transition-opacity"
              title={tech.name}
            >
              <Image
                src={tech.src}
                alt={tech.name}
                width={44}
                height={44}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${tech.className}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
