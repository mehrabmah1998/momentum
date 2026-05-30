"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles, AlertTriangle, Cpu, GitBranch, RefreshCw, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] pt-32 pb-24 overflow-hidden flex flex-col justify-center dot-grid">
      {/* Background radial glows (Ethereal Glass theme adjusted) */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[var(--accent-glow)] glow-spot" />
      <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] glow-spot" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center md:text-left max-w-5xl mx-auto">
          {/* Eyebrow tag preceding heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)] font-medium">
              The Living Knowledge Graph for Software Architecture
            </span>
          </motion.div>

          {/* Master 2-3 Line Headline - strictly controlled to prevent large text-walls */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-sans font-bold leading-[0.95] tracking-tighter text-[var(--text-primary)] mb-6"
          >
            Your AI code builders are{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-[var(--accent-hover)] to-[var(--text-primary)]">
              guessing.
            </span>
          </motion.h1>

          {/* Subheadline & Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-secondary)] text-lg md:text-xl font-sans font-normal max-w-3xl leading-relaxed mb-10"
          >
            Claude Code, Cursor, and Codex operate on flat files and loose chat contexts. Momentum maintains a structured, living database of your project’s architecture, constraints, and features—rendering precise prompt injection contexts and verifying every code commit automatically.
          </motion.p>

          {/* Dual CTAs with Button-in-Button Arrow interaction */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-20"
          >
            <a
              href="#waitlist"
              className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-[var(--bg)] bg-[var(--text-primary)] hover:opacity-90 transition-all duration-300 active:scale-[0.98] shadow-[0_20px_40px_-15px_var(--accent-glow)] overflow-hidden"
            >
              <span className="relative z-10">Get Early Access</span>
              <span className="relative z-10 w-6 h-6 rounded-full bg-[var(--bg)]/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                <ArrowRight className="w-3.5 h-3.5 text-[var(--bg)]" strokeWidth={2.5} />
              </span>
            </a>
            
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all duration-300 bg-[var(--bg-surface)] backdrop-blur active:scale-[0.98]"
            >
              Learn the loop
            </a>
          </motion.div>
        </div>

        {/* Cinematic Visual Comparison Split styled using Double-Bezel (Doppelrand) Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] bg-[var(--border)] p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          {/* Inner core with glass shadow highlights */}
          <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--bg-card)] border border-[var(--border)] p-4 sm:p-6 backdrop-blur-2xl relative overflow-hidden">
            {/* Ambient shimmer background lines */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40 animate-pulse" />

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              {/* Chaotic CLAUDE.md File (Left Side) */}
              <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="text-rose-500 w-4 h-4" strokeWidth={1.5} />
                      <span className="text-xs font-mono text-[var(--text-secondary)] font-medium">CLAUDE.md (Out of Date)</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/15">
                      <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
                      <span className="text-[9px] uppercase font-mono text-rose-500">Desynced</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 font-mono text-xs text-[var(--text-muted)]">
                    <p className="text-[var(--text-secondary)] font-semibold"># System Architecture</p>
                    <p>- Primary DB is <span className="text-rose-500/80 line-through">SQLite</span> <span className="text-rose-500 font-bold">{"(Wait, team migrated to Postgres last week)"}</span></p>
                    <p>- Users sync auth through Clerk. <span className="text-rose-400 text-[10px] ml-2">{"(AI hallucinates Clerk functions in Stripe hook)"}</span></p>
                    <p>- <span className="text-[var(--text-muted)]">{"(TODO: Update this file when adding Postgres vector configs)"}</span></p>
                    <p>- Queue logic is in Redis. <span className="text-rose-500 font-medium">[CRITICAL: AI re-implemented queue using basic array stack]</span></p>
                  </div>
                </div>

                <div className="mt-8 border-t border-[var(--border)] pt-4">
                  <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center gap-3">
                    <div className="p-2 rounded-full bg-rose-500/10 text-rose-500 shrink-0">
                      <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <div className="text-[11px] font-sans leading-tight">
                      <p className="font-semibold text-[var(--text-primary)]">The Context Gap</p>
                      <p className="text-[var(--text-secondary)] mt-0.5">The AI doesn&apos;t know Redis was deprecated, breaking the API route under load.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Structured Living Knowledge Graph (Right Side) */}
              <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--accent)]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="text-[var(--accent)] w-4 h-4 animate-pulse" strokeWidth={1.5} />
                      <span className="text-xs font-mono text-[var(--text-secondary)] font-medium">Momentum Knowledge Graph</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--accent-subtle)] border border-[var(--accent)]/15">
                      <GitBranch className="w-3 h-3 text-[var(--accent)] animate-spin-slow" />
                      <span className="text-[9px] uppercase font-mono text-[var(--accent)]">Synchronized</span>
                    </div>
                  </div>

                  <div className="relative font-mono text-xs space-y-3">
                    {/* Visual simulated graph nodes */}
                    <div className="flex items-center gap-2 text-[var(--accent)] font-bold bg-[var(--accent-subtle)] py-1.5 px-3 rounded-lg border border-[var(--accent)]/20 w-fit">
                      <span>Node: postgres_config</span>
                      <span className="text-[9.5px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-mono font-bold">Git-Confirmed</span>
                    </div>

                    <div className="pl-6 border-l-2 border-[var(--border-hover)] space-y-2">
                      <div className="text-[var(--text-secondary)] flex items-center gap-2 py-0.5">
                        <span className="text-[var(--text-muted)] font-medium">↳ Relates to:</span>
                        <span className="text-[var(--text-primary)] font-semibold bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border)]">auth_service</span>
                      </div>
                      <div className="text-[var(--text-secondary)] flex items-center gap-2 py-0.5">
                        <span className="text-[var(--text-muted)] font-medium">↳ Constraint:</span>
                        <span className="text-[var(--accent)] font-semibold">vector_chunk_limit = 1536</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[var(--text-secondary)] mt-2 bg-[var(--bg-card)] border border-[var(--border)] py-1.5 px-3 rounded w-fit text-[11px]">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                      <span>Active Plan: Migrate stripe events route to NextEdge.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-[var(--border)] pt-4 bg-gradient-to-r from-transparent to-[var(--accent-subtle)] -mx-6 -mb-6 p-6 rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] shrink-0">
                      <RefreshCw className="w-4 h-4 animate-spin-slow" strokeWidth={1.5} />
                    </div>
                    <div className="text-[11px] font-sans leading-tight">
                      <p className="font-semibold text-[var(--text-primary)]">Graph-Guided prompt injected</p>
                      <p className="text-[var(--text-secondary)] mt-0.5">Prompt verified: constraints mapped from PostgreSQL and Stripe modules.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
