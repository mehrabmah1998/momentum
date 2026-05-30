"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles, AlertTriangle, Cpu, GitBranch, RefreshCw, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] pt-32 pb-24 overflow-hidden flex flex-col justify-center dot-grid">
      {/* Background radial glows (Ethereal Glass theme) */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-brand-blue/10 glow-spot" />
      <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-brand-cyan/8 glow-spot" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center md:text-left max-w-5xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-slate-300 font-medium">
              The Living Knowledge Graph for Software Architecture
            </span>
          </motion.div>

          {/* Master 2-3 Line Headline - strictly controlled to prevent large text-walls */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-sans font-bold leading-[0.95] tracking-tighter text-white mb-6"
          >
            Your AI code builders are <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-white">guessing.</span>
          </motion.h1>

          {/* Subheadline & Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl font-sans font-normal max-w-3xl leading-relaxed mb-10"
          >
            Claude Code, Cursor, and Codex operate on flat files and loose chat contexts. Momentum maintains a structured, living database of your project’s architecture, constraints, and features—rendering precise prompt injection contexts and verifying every code commit automatically.
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-20"
          >
            <a
              href="#waitlist"
              className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-black bg-white hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-[0_20px_40px_-15px_rgba(255,255,255,0.15)]"
            >
              <span>Get Early Access</span>
              <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </span>
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-slate-300 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-300 bg-white/5 backdrop-blur"
            >
              Learn the loop
            </a>
          </motion.div>
        </div>

        {/* Cinematic Visual Comparison Split */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-[#070b18]/40 p-2 sm:p-4 backdrop-blur-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Subtle noise layer (applied only as fixed-like container overlay safely) */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent" />

          <div className="grid md:grid-cols-2 gap-4 relative">
            {/* Chaotic CLAUDE.md File (Left Side) */}
            <div className="bg-[#040813]/90 rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
                    <span className="text-xs font-mono text-slate-400 font-medium">CLAUDE.md (Out of Date)</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/15">
                    <AlertTriangle className="w-3 h-3 text-rose-400 animate-pulse" />
                    <span className="text-[9px] uppercase font-mono text-rose-400">Desynced</span>
                  </div>
                </div>

                <div className="space-y-3.5 font-mono text-xs text-slate-500">
                  <p className="text-slate-400"># System Architecture</p>
                  <p>- Primary DB is SQLite <span className="text-rose-400/80 line-through">SQLite</span> <span className="text-emerald-400 font-bold">{"(Oops, team migrated to Postgres last week)"}</span></p>
                  <p>- Users sync auth through Clerk. <span className="text-rose-400 text-[10px] ml-2">{"(AI hallucinates Clerk functions in Stripe hook)"}</span></p>
                  <p>- <span className="text-slate-400">{"(TODO: Update this file when adding Postgres vector extension config)"}</span></p>
                  <p>- Feature X relies on redis queue. <span className="text-rose-500/90 font-medium">[CRITICAL: AI re-implemented queue using basic array stack]</span></p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/5 pt-4">
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-rose-500/10 text-rose-400">
                    <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="text-[11px] font-sans leading-tight">
                    <p className="font-semibold text-slate-200">The Context Gap</p>
                    <p className="text-slate-400 mt-0.5">The AI doesn&apos;t know Redis was deprecated, breaking the API route under load.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Living Knowledge Graph (Right Side) */}
            <div className="bg-[#040813]/90 rounded-2xl p-6 border border-brand-blue/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-brand-cyan" strokeWidth={1.5} />
                    <span className="text-xs font-mono text-slate-400 font-medium">Momentum Knowledge Graph</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/15">
                    <GitBranch className="w-3 h-3 text-brand-cyan animate-spin-slow" />
                    <span className="text-[9px] uppercase font-mono text-brand-cyan">Synchronized</span>
                  </div>
                </div>

                <div className="relative font-mono text-xs space-y-3">
                  {/* Visual simulated graph nodes */}
                  <div className="flex items-center gap-2 text-brand-cyan font-bold bg-[#09152b] py-1 px-2.5 rounded-lg border border-brand-cyan/20 w-fit">
                    <span>Node: postgres_config</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">Git-Confirmed</span>
                  </div>

                  <div className="pl-6 border-l-2 border-slate-800 space-y-2">
                    <div className="text-slate-400 flex items-center gap-2 py-0.5">
                      <span className="text-slate-600">↳ Relates to:</span>
                      <span className="text-slate-200 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/5">auth_service</span>
                    </div>
                    <div className="text-indigo-300 flex items-center gap-2 py-0.5">
                      <span className="text-slate-600">↳ Constraint:</span>
                      <span className="text-indigo-200">vector_chunk_limit = 1536</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 mt-2 bg-slate-900/50 py-1 px-2 rounded w-fit text-[11px]">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Active Plan: Migrate stripe events route to Next.js webhook edge standard.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/5 pt-4 bg-gradient-to-r from-transparent to-brand-blue/5 -mx-6 -mb-6 p-6 rounded-b-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-brand-cyan/10 text-brand-cyan">
                    <RefreshCw className="w-4 h-4 animate-spin-slow" strokeWidth={1.5} />
                  </div>
                  <div className="text-[11px] font-sans leading-tight">
                    <p className="font-semibold text-white">Graph-Guided prompt injected</p>
                    <p className="text-slate-400 mt-0.5">Prompt verified: constraints mapped from the PostgreSQL and Stripe modules.</p>
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
