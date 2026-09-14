'use client';

import React, { useEffect, useRef } from 'react';

const DynamicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const mouse = {
      x: null,
      y: null,
      radius: 130,
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.0 + 1.2;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.baseAlpha = Math.random() * 0.4 + 0.6;
      }

      update(time) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = mouse.radius * mouse.radius;
          if (distSq < radiusSq) {
            const distance = Math.sqrt(distSq);
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 1.2;
            this.y -= (dy / distance) * force * 1.2;
          }
        }

        this.alpha = Math.max(0.3, Math.min(1.0, this.baseAlpha + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.25));
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${0.16 * this.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${0.50 * this.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.92 * this.alpha})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const screenW = canvas.width;
      const maxParticles = screenW < 768 ? 38 : (screenW < 1024 ? 60 : 85);
      const density = Math.floor((canvas.width * canvas.height) / 16000);
      const numberOfParticles = Math.min(density, maxParticles);

      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    const connectParticles = () => {
      const maxDistance = canvas.width < 768 ? 85 : 115;
      const maxDistSq = maxDistance * maxDistance;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    let startTime = performance.now();
    const animate = (currentTime) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = currentTime - startTime;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(elapsed);
        particles[i].draw();
      }

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        startTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Visible right in the background layer
        pointerEvents: 'none', // Never blocks clicks or interaction
        background: '#000000',
      }}
    />
  );
};

export default DynamicBackground;
