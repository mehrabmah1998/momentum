"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Trash2, ShieldX, RefreshCw } from "lucide-react";

interface PainPoint {
  icon: React.ComponentType<any>;
  tag: string;
  title: string;
  desc: string;
}

function SpotlightCard({ pain, index }: { pain: PainPoint; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = pain.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-3xl bg-[var(--bg-card)]/40 backdrop-blur-xl border border-[var(--border)]/70 hover:border-[var(--accent)]/40 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.1)] transition-all duration-500 cursor-pointer select-none"
        style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, shadow 0.4s ease",
        }}
      >
        {/* Sleek top-edge micro reflective highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Dynamic GPU-accelerated refraction spotlight circle overlay */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(59, 130, 246, 0.06), transparent 80%)`
          }}
        />

        {/* High-tech micro-alignment blueprint dot crosshairs in corner */}
        <div className="absolute top-4 right-4 text-[var(--border)] opacity-30 group-hover:opacity-70 group-hover:rotate-45 transition-all duration-500 pointer-events-none font-sans text-[10px] select-none">
          +
        </div>

        {/* Card content */}
        <div className="relative z-10 flex-grow">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)] border border-[var(--border)]/80 bg-[var(--bg-card)]/80 px-2.5 py-1 rounded-md select-none">
              {pain.tag}
            </span>
            
            {/* Visual indicator logo with coherent brand styling */}
            <div className="p-2.5 rounded-xl border border-[var(--border)]/80 bg-[var(--bg-card)]/50 text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--accent)]/5 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.08)]">
              <Icon className="w-4 h-4 transition-transform duration-500" strokeWidth={1.5} />
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-sans font-semibold text-[var(--text-primary)] mb-3 tracking-tight transition-colors duration-300">
            {pain.title}
          </h3>
          
          <p className="text-[var(--text-secondary)] text-[13px] sm:text-sm font-sans leading-relaxed transition-colors duration-300">
            {pain.desc}
          </p>
        </div>

        {/* Subtle, hyper-clean line indicator running under the card on hover */}
        <div className="w-full h-[1.5px] bg-[var(--border)]/20 mt-6 relative overflow-hidden rounded-full pointer-events-none">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Problem() {
  const pains: PainPoint[] = [
    {
      icon: Trash2,
      tag: "Token Waste",
      title: "Blind Context Dumping",
      desc: "Throwing loose CLAUDE.md files and massive directories at your AI builder wastes millions of tokens. The LLM gets drowned in flat file noise instead of understanding architecture.",
    },
    {
      icon: ShieldX,
      tag: "Context Amnesia",
      title: "Re-explaining Decisions Every Chat",
      desc: "Every fresh terminal shell is a blank slate. You spend 50% of your prompt time re-explaining DB structures, third-party hook restrictions, and architectural gotchas over and over.",
    },
    {
      icon: AlertCircle,
      tag: "Silent Regressions",
      title: "AI Making Decisions Blind",
      desc: "AI builders write whatever compiles, ignoring system-wide architectural constraints. They switch your database type or hook structure silently because they can't see the wider picture.",
    },
    {
      icon: RefreshCw,
      tag: "Obsolete Standard",
      title: "Immediate Document Decay",
      desc: "Static markdown documentation is a write-once, never-read graveyard. The minute your AI builder completes a PR, the README and schema descriptions are instantly out of sync.",
    }
  ];

  return (
    <section id="problem" className="relative py-32 bg-transparent border-t border-[var(--border)] overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--accent)] font-semibold bg-[var(--accent-subtle)] border border-[var(--accent)]/15 px-3 py-1 rounded-full mb-4 inline-block select-none">
            The Context Gap
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[var(--text-primary)] mb-6">
            AI code builders are only as good as the context you paste.
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg">
            Indie developers spend more time correcting code, explaining constraints, and pruning files than actually designing software. 
          </p>
        </div>

        {/* Continuous backdrop-blur grid for professional visual hierarchy */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pains.map((pain, index) => {
            return (
              <SpotlightCard key={pain.title} pain={pain} index={index} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
