"use client";

import { motion } from "motion/react";
import { AlertCircle, Trash2, ShieldX, RefreshCw } from "lucide-react";

export default function Problem() {
  const pains = [
    {
      icon: Trash2,
      tag: "Token Waste",
      title: "Blind Context Dumping",
      desc: "Throwing loose CLAUDE.md files and massive directories at your AI builder wastes millions of tokens. The LLM gets drowned in flat file noise instead of understanding architecture.",
      iconColor: "text-rose-500"
    },
    {
      icon: ShieldX,
      tag: "Context Amnesia",
      title: "Re-explaining Decisions Every Chat",
      desc: "Every fresh terminal shell is a blank slate. You spend 50% of your prompt time re-explaining DB structures, third-party hook restrictions, and architectural gotchas over and over.",
      iconColor: "text-amber-500"
    },
    {
      icon: AlertCircle,
      tag: "Silent Regressions",
      title: "AI Making Decisions Blind",
      desc: "AI builders write whatever compiles, ignoring system-wide architectural constraints. They switch your database type or hook structure silently because they can't see the wider picture.",
      iconColor: "text-orange-500"
    },
    {
      icon: RefreshCw,
      tag: "Obsolete Standard",
      title: "Immediate Document Decay",
      desc: "Static markdown documentation is a write-once, never-read graveyard. The minute your AI builder completes a PR, the README and schema descriptions are instantly out of sync.",
      iconColor: "text-red-500"
    }
  ];

  return (
    <section id="problem" className="relative py-32 bg-transparent border-t border-[var(--border)] overflow-hidden">
      {/* Subtle fade transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--accent)] font-semibold bg-[var(--accent-subtle)] border border-[var(--accent)]/15 px-3 py-1 rounded-full mb-4 inline-block">
            The Context Gap
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[var(--text-primary)] mb-6">
            AI code builders are only as good as the context you paste.
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg">
            Indie developers spend more time correcting code, explaining constraints, and pruning files than actually designing software. 
          </p>
        </div>

        {/* 4 Pain Points in Asymmetrical style with Sequential Stagger */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pains.map((pain, index) => {
            const Icon = pain.icon;
            return (
              <motion.div
                key={pain.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border)] p-8 hover:border-[var(--border-hover)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle highlight sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[var(--accent)]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--bg-surface)] py-1 px-3 rounded-full border border-[var(--border)]">
                        {pain.tag}
                      </span>
                    </div>
                    <div className={`p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] ${pain.iconColor}`}>
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-xl font-sans font-semibold text-[var(--text-primary)] mb-3 tracking-tight">
                    {pain.title}
                  </h3>
                  
                  <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed">
                    {pain.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
