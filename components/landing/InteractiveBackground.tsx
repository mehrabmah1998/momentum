"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Hook into system/document-level theme changes to keep styling perfectly matched
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateTheme = () => {
      const isLight = document.documentElement.classList.contains("light");
      setTheme(isLight ? "light" : "dark");
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Mouse coordinates and interactive boundary metrics
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 180,
      active: false,
    };

    // Rich layers of ASCII character arrays representing different structural visual densities
    const GLYPH_SETS = {
      light: ["·", ".", " ", " ", " ", " ", "·", "+", "-"],
      medium: ["/", "\\", "|", ":", ";", "=", "~", "!", "?"],
      heavy: ["{", "}", "[", "]", "<", ">", "(", ")", "*", "#", "&", "%", "@"]
    };

    // Grid tracking parameters
    let cellSize = 33; // px per character cell (optimized sweet spot)
    let cols = 0;
    let rows = 0;
    let isMobile = false;

    const initCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;

      // Limit DPR rendering size to avoid heavy GPU rasterization fillrate on Retina/Ultra-HD screens
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Adjust density dynamically based on viewport width
      isMobile = width < 768;
      cellSize = isMobile ? 38 : 33;

      cols = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;
    };

    // Handle viewport resize event
    window.addEventListener("resize", initCanvas);
    initCanvas();

    // Dynamic mouse event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Slow, steady progression for fluid dynamic movement
      time += 0.015;

      const isDark = theme === "dark";

      // Smooth lag interpolation for elegant mouse response
      if (mouse.active) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }
      } else {
        mouse.x += (-1000 - mouse.x) * 0.08;
        mouse.y += (-1000 - mouse.y) * 0.08;
      }

      // 1. Ambient Spotlights centered at the mouse coordinates
      if (mouse.x !== -1000 && mouse.active) {
        const glowRadius = isMobile ? 150 : 260;
        const radGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
        if (isDark) {
          radGrad.addColorStop(0, "rgba(59, 130, 246, 0.08)");
          radGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.02)");
          radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        } else {
          radGrad.addColorStop(0, "rgba(37, 99, 235, 0.05)");
          radGrad.addColorStop(0.5, "rgba(37, 99, 235, 0.01)");
          radGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        }
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Configure globally uniform monospace typographical settings ONCE to avoid heavy layout layout recalculations
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = isMobile 
        ? "600 10px 'JetBrains Mono', 'Geist Mono', SFMono-Regular, monospace" 
        : "600 12.5px 'JetBrains Mono', 'Geist Mono', SFMono-Regular, monospace";

      // Pre-resolve theme-specific static colors to avoid string concatenation GC performance hits in cell loop
      const defaultColor = isDark ? "#ffffff" : "#0f172a";
      const hoverColor = isDark ? "#60a5fa" : "#2563eb";
      
      const radiusSq = mouse.radius * mouse.radius;

      // 2. Compute and Draw character matrix cells
      for (let c = 0; c < cols; c++) {
        const baseX = c * cellSize;

        for (let r = 0; r < rows; r++) {
          const baseY = r * cellSize;

          // Double harmonic trigonometric ripple setup
          const waveX = Math.sin(c * 0.12 + time * 1.1) * Math.cos(r * 0.08 - time * 0.6);
          const waveY = Math.sin((c + r) * 0.05 + time * 0.8);
          const waveVal = (waveX + waveY) * 0.5;

          // Distance vector from cursor to compute magnetic displacement and decode fields
          const dx = baseX - mouse.x;
          const dy = baseY - mouse.y;
          let drawY = baseY + waveVal * 4.5;
          let drawX = baseX;

          let hoverFactor = 0;

          // Perform fast squared check first to avoid heavy Math.sqrt calls for out-of-bounds cells
          if (mouse.x !== -1000) {
            const distSq = dx * dx + dy * dy;
            if (distSq < radiusSq) {
              const distance = Math.sqrt(distSq);
              hoverFactor = 1 - distance / mouse.radius;
              const pushFactor = Math.sin(hoverFactor * Math.PI * 0.5) * 12;
              
              if (distance > 5) {
                drawX += (dx / distance) * pushFactor;
                drawY += (dy / distance) * pushFactor;
              }
            }
          }

          // Choose character glyph dynamically based on wave heights
          let glyph = "";
          if (hoverFactor > 0.45) {
            glyph = (c + r + Math.floor(time * 8)) % 2 === 0 ? "1" : "0";
          } else {
            if (waveVal < -0.3) {
              const idx = (c * 3 + r * 7) % GLYPH_SETS.light.length;
              glyph = GLYPH_SETS.light[idx >= 0 ? idx : -idx];
            } else if (waveVal > 0.3) {
              const idx = (c * 2 + r * 5) % GLYPH_SETS.heavy.length;
              glyph = GLYPH_SETS.heavy[idx >= 0 ? idx : -idx];
            } else {
              const idx = (c * 4 + r * 3) % GLYPH_SETS.medium.length;
              glyph = GLYPH_SETS.medium[idx >= 0 ? idx : -idx];
            }
          }

          if (!glyph || glyph === " ") continue;

          // Base opacity configurations
          let baseOpacity = 0.04;
          baseOpacity += Math.abs(waveVal) * 0.07;

          // Mouse proximity scales opacity
          let finalOpacity = baseOpacity * (1 + hoverFactor * 7.5);
          finalOpacity = Math.max(0.01, Math.min(isDark ? 0.45 : 0.35, finalOpacity));

          // Set state properties rapidly (globalAlpha + static hex color keeps rendering extremely performant)
          ctx.fillStyle = hoverFactor > 0.15 ? hoverColor : defaultColor;
          ctx.globalAlpha = finalOpacity;

          ctx.fillText(glyph, drawX, drawY);
        }
      }

      // Reset global alpha back for ambient passes
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", initCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
