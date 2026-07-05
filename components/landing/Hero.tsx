"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, AlertTriangle, Cpu, GitBranch, RefreshCw, FileText, CheckCircle2, ChevronRight, Database, Code } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide loop every 7.5 seconds, paused on interactive click or hover
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 3);
      }, 7500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const stepsInfo = [
    {
      title: "01 / The Blind Build",
      subtitle: "Context Amnesia Era",
      desc: "Without Momentum, your AI builder guesses: it re-invents decisions you already made, violates constraints nobody wrote down, and contradicts the architecture in its own last session.",
    },
    {
      title: "02 / The Extraction Interview",
      subtitle: "Knowledge Built From Conversation",
      desc: "Momentum interviews you — one sharp question at a time, validating every answer for specificity and rationale — and files each fact into a structured knowledge graph of modules, decisions, and constraints.",
    },
    {
      title: "03 / The Precision Prompt",
      subtitle: "Exact Context, Zero Guessing",
      desc: "When you plan a feature, Momentum debates it against your graph — flags conflicts, names affected modules — and exports a precision prompt with exact constraints and what must not break, ready to paste into Claude Code or Cursor.",
    }
  ];

  return (
    <section className="relative min-h-[100dvh] pt-32 pb-24 overflow-hidden flex flex-col justify-center dot-grid">
      {/* Background radial glows (Ethereal Glass theme) */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[var(--accent-glow)] glow-spot opacity-60" />
      <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] glow-spot opacity-40" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center md:text-left max-w-5xl mx-auto">
          {/* Eyebrow tag preceding heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border)] rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)] font-medium">
              The Living Knowledge Base for AI-Built Software
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
            <span className="premium-text-gradient">
              guessing blind.
            </span>
          </motion.h1>

          {/* Subheadline & Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--text-secondary)] text-lg md:text-xl font-sans font-normal max-w-4xl lg:max-w-5xl leading-relaxed mb-10"
          >
            Claude Code, Cursor, and Codex operate on flat markdown files and loose context. Momentum interviews you, structures what you know into a living knowledge graph — every module, decision, and constraint with its why — and turns it into three living documents and precision prompts your AI builder can actually trust.
          </motion.p>

          {/* Dual CTAs with Button-in-Button Arrow interaction */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-16"
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

        {/* Master Integrated Interface Console (Double-Bezel Doppelrand Pattern) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative max-w-5xl mx-auto rounded-[2.5rem] bg-[var(--border)] p-2 shadow-[0_45px_90px_-25px_rgba(0,0,0,0.25)] overflow-hidden"
        >
          {/* Inner core with glass shadow highlights in a self-contained flex layer */}
          <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--bg-card)] border border-[var(--border)] p-4 sm:p-8 backdrop-blur-2xl relative overflow-hidden flex flex-col gap-6">
            
            {/* Ambient shimmer background lines */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40 animate-pulse" />

            {/* INTEGRATED PIPELINE CONTROL PANEL HEADER */}
            <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 relative z-10">
              
              {/* Window Controls & Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                {/* Simulated IDE breadcrumbs & Window Actions */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  
                  <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider text-[var(--text-muted)] font-bold">
                    <span>MOMENTUM_RUN</span>
                    <span className="text-[var(--accent)]">/</span>
                    <span className="text-[var(--text-secondary)]">KNOWLEDGE_LOOP_SIMULATOR</span>
                  </div>
                </div>

                {/* Automation Running Banner */}
                <div className="flex items-center gap-2 self-start sm:self-auto px-2.5 py-1 rounded bg-[var(--accent-subtle)] border border-[var(--border)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPaused ? "bg-amber-400" : "bg-emerald-400"}`} />
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isPaused ? "bg-amber-500" : "bg-emerald-500"}`} />
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-wider font-bold text-[var(--text-secondary)]">
                    {isPaused ? "AUTO_ADVANCE_PAUSED_ON_INTERACT" : "PLAYING_SIMULATION_FLOW"}
                  </span>
                </div>
              </div>

              {/* Grid of Integrated Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[var(--bg-surface)] p-2 rounded-xl border border-[var(--border)]">
                {stepsInfo.map((info, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveStep(idx);
                      setIsPaused(true);
                    }}
                    className={`relative flex flex-col justify-start items-start p-4 sm:p-5 rounded-lg text-left select-none transition-all duration-300 overflow-hidden group border ${
                      activeStep === idx 
                        ? "border-[var(--accent)]/20 bg-[var(--bg-card)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]" 
                        : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/40"
                    }`}
                  >
                    {activeStep === idx && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute inset-0 bg-[var(--accent-subtle)] z-0"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    
                    {/* Progress indicator representing active transition cooldown */}
                    {activeStep === idx && !isPaused && (
                      <motion.div 
                        key={activeStep}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 7.5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] z-10"
                      />
                    )}

                    <div className="relative z-10 flex flex-col justify-start h-full w-full">
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`font-sans text-xs sm:text-[13px] md:text-sm font-bold tracking-tight transition-colors duration-300 ${
                          activeStep === idx ? "text-[var(--accent)]" : "text-[var(--text-primary)]/70 group-hover:text-[var(--text-primary)]"
                        }`}>
                          {info.title}
                        </span>
                        
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0 ml-2 ${
                          activeStep === idx 
                            ? "bg-[var(--accent)] ring-4 ring-[var(--accent)]/15 animate-pulse" 
                            : "bg-transparent border border-[var(--text-muted)]"
                        }`} />
                      </div>
                      
                      <span className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-wider font-bold block mb-1 transition-colors duration-300 ${
                        activeStep === idx ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                      }`}>
                        {info.subtitle}
                      </span>
                      <p className={`text-[11px] sm:text-[12px] leading-relaxed transition-colors duration-300 ${
                        activeStep === idx ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]/80"
                      }`}>
                        {info.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live Comparative System Panel */}
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              
              {/* SIDE A: PROJECT GROUNDING SOURCE OF TRUTH */}
              <div className="bg-[var(--bg-surface)] backdrop-blur-md rounded-2xl p-6 border border-[var(--border)] flex flex-col justify-between min-h-[410px] relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[var(--accent-glow)] via-transparent to-transparent opacity-10 pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-[var(--text-secondary)]" strokeWidth={1.5} />
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] font-bold tracking-wider uppercase">Project Source Architecture</span>
                    </div>
                    
                    <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      NODE_VARS
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeStep === 0 && (
                      <motion.div
                        key="state-unaware"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4 font-mono text-xs"
                      >
                        {/* Outdated text mockup */}
                        <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">▲ Stale File: CLAUDE.md</span>
                            <span className="text-[9px] text-[var(--text-muted)] bg-rose-500/10 px-1.5 py-0.5 rounded">30 Days Stale</span>
                          </div>
                          <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
                            # Project Settings<br />
                            - auth: basic cookies.<br />
                            - core module: routing logic.<br />
                            <span className="text-rose-400 font-bold italic block mt-1.5 font-sans">
                              (Missing: active token rotation rules, org hierarchy limits, and recent auth security constraints)
                            </span>
                          </p>
                        </div>

                        {/* Flat folder structure mismatch visualization */}
                        <div className="space-y-1 text-[11px] text-[var(--text-muted)] bg-[var(--bg-card)]/40 p-3 rounded-lg border border-[var(--border)]">
                          <p className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Flat context fed to AI:</p>
                          <p className="text-rose-400 line-through">✗ Missing: Auth & organization rules</p>
                          <p className="text-rose-400 line-through">✗ Missing: Multi-tenant design decisions</p>
                          <p className="text-[var(--text-muted)] opacity-60">✓ raw_router_v2.ts</p>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 1 && (
                      <motion.div
                        key="state-extracting"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        {/* Interactive interview question & answer block */}
                        <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-xs font-mono">
                          <div className="flex items-center justify-between mb-2">
                            <span className="flex items-center gap-1.5 text-amber-500 font-bold text-[10px] uppercase tracking-wider">
                              <Sparkles className="w-3 h-3 text-amber-500 animate-spin-slow" /> ACTIVE EXTRACTION INTERVIEW
                            </span>
                            <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-bold">QA_INTAKE</span>
                          </div>
                          <div className="space-y-2 text-[11px] leading-relaxed">
                            <p className="text-amber-400">Q: Why did you choose better-auth over Clerk for user authentication?</p>
                            <p className="text-[var(--text-secondary)] italic">&quot;We wanted organization-scoped invites that don&apos;t trigger per-seat price limitations.&quot;</p>
                          </div>
                        </div>

                        {/* Storing and validating animation block */}
                        <div className="relative h-44 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/50 flex flex-col justify-center items-center overflow-hidden p-4">
                          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-[0.03] pointer-events-none">
                            <div className="border border-[var(--text-primary)]" />
                            <div className="border border-[var(--text-primary)]" />
                            <div className="border border-[var(--text-primary)]" />
                            <div className="border border-[var(--text-primary)]" />
                          </div>

                          {/* Quality gate pass label & check animation */}
                          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
                            <motion.div
                              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold"
                            >
                              QUALITY_GATE: PASS · RATIONALE CAPTURED
                            </motion.div>

                            {/* Connecting and mapping node flow */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[9px]">
                                Conversation Input
                              </div>
                              <div className="w-6 h-[1px] bg-amber-500/40" />
                              <div className="p-1 rounded-full bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div className="w-6 h-[1px] bg-emerald-500/40" />
                              <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px]">
                                project.modules.auth.decisions
                              </div>
                            </div>

                            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-bold block mt-3">
                              NODE STORED → org-invite-auth
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 2 && (
                      <motion.div
                        key="state-grounded"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4 font-mono text-xs"
                      >
                        {/* Synced Knowledge Base showing prompt bundle */}
                        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/15">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> PRECISION PROMPT COMPILED
                            </span>
                            <span className="text-[9px] text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded font-bold">PROMPT_READY</span>
                          </div>
                          
                          {/* Generated prompt mock block */}
                          <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/10 font-mono text-[9px] leading-relaxed text-[var(--text-secondary)] space-y-2 max-h-44 overflow-y-auto">
                             <p className="text-emerald-400 font-bold">## Project Context</p>
                             <p className="text-[var(--text-muted)]">- @core-stack: organization-scoped invites, better-auth with organization boundaries</p>
                             <p className="text-emerald-400 font-bold">## What to Build</p>
                             <p className="text-[var(--text-muted)]">- Organizers must manually approve guest invitations before guest gets seat access</p>
                             <p className="text-emerald-400 font-bold">## Constraints to Respect</p>
                             <p className="text-[var(--text-muted)]">- Organizations owner invitation overrides, NextEdge edge function rules</p>
                             <p className="text-emerald-400 font-bold">## Do Not Break</p>
                             <p className="text-[var(--text-muted)]">- D1 and better-auth multi-tenant custom session middleware</p>
                             <p className="text-emerald-400 font-bold">## Files Likely Involved</p>
                             <p className="text-[var(--text-muted)]">- /lib/auth.ts, /app/dashboard/tabs/keys.tsx</p>
                           </div>
                        </div>

                        {/* Interactive prompt clipboard action indicator */}
                        <div className="p-3 bg-[var(--bg-card)] rounded-lg border border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Copied to clipboard → Ready for Claude Code / Cursor
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Left card bottom state summary pill */}
                <div className="mt-4 border-t border-[var(--border)] pt-4 z-10">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider">
                    {activeStep === 0 && "SYSTEM STATUS: AMNESIA MODE · OUT-OF-DATE CONTEXT"}
                    {activeStep === 1 && "SYSTEM STATUS: GRAPH GENERATION IN PROGRESS"}
                    {activeStep === 2 && "SYSTEM STATUS: PRECISION GROUNDING PROMPT COMPILED"}
                  </span>
                </div>
              </div>


              {/* SIDE B: THE AI BUILDER WRAPPER TERMINAL */}
              <div className="bg-[var(--bg-surface)] backdrop-blur-md rounded-2xl p-6 border border-[var(--border)] flex flex-col justify-between min-h-[410px] relative overflow-hidden transition-all duration-500">
                
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
                      <span className="text-[10px] font-mono text-[var(--text-secondary)] font-bold tracking-wider uppercase">AI Agent Development Environment</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border)] font-mono text-[9px] font-bold text-[var(--text-secondary)]">
                      <span>LLM: CLAUDE_CODE</span>
                    </div>
                  </div>

                  {/* Dev Input Bubble */}
                  <div className="mb-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-3 text-xs">
                    <span className="font-mono text-[9px] text-[var(--accent)] font-bold uppercase tracking-wider block mb-1">
                      {activeStep === 0 && "Developer Request"}
                      {activeStep === 1 && "Interview Interaction"}
                      {activeStep === 2 && "Active Feature Plan"}
                    </span>
                    <p className="text-[var(--text-primary)] font-mono text-[11px] leading-tight">
                      {activeStep === 0 && "\"Add organization owner approvals to the user invitation module.\""}
                      {activeStep === 1 && "\"Organization owners must manually approve guest invitations before they can access specifications.\""}
                      {activeStep === 2 && "\"Export specification directory to ZIP bundle with integrity tag.\""}
                    </p>
                  </div>

                  {/* AI Response Output Block */}
                  <div className="bg-black/40 rounded-xl p-4 border border-[var(--border)] font-mono text-[11px] leading-normal min-h-[160px] flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] block mb-2">Compiled Agent Code Generation:</span>
                      
                      <AnimatePresence mode="wait">
                        {activeStep === 0 && (
                          <motion.div
                            key="gpt-fail-out"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-rose-400 space-y-2"
                          >
                            <p className="text-[10px] bg-rose-500/10 px-2 py-1 rounded inline-block font-sans font-bold">
                              ⚠️ DESIGN MISALIGNMENT: Wrong Assumptions
                            </p>
                            <p className="text-[11px] tracking-tight text-rose-500/90 leading-relaxed font-mono">
                              &gt; AI: &quot;I will set up basic cookies and a standard database schema.&quot;<br />
                              &gt; User: &quot;No, we decided to use D1 and better-auth inside organization-scopes!&quot;<br />
                              &gt; AI: &quot;Understood. Rewriting auth layout... wait, where are the BetterAuth session constraints stored?&quot;
                            </p>
                          </motion.div>
                        )}

                        {activeStep === 1 && (
                          <motion.div
                            key="gpt-waiting-out"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-amber-400 space-y-2 font-mono"
                          >
                            <p className="text-[10px] bg-amber-500/10 px-2 py-1 rounded inline-block font-sans font-bold">
                              ⚙️ CONVERSATIONAL SYNTHESIS ENGINE
                            </p>
                            <p className="text-[11px] tracking-tight text-amber-500/90 leading-relaxed font-mono">
                              &gt; validating answers against existing graph...<br />
                              &gt; resolving dependency overlaps on org validation...<br />
                              &gt; building node-relations mapping...<br />
                              &gt; <span className="font-bold text-amber-300">SYSTEM:</span> Ready to export grounded prompt guidelines for target design specifications.
                            </p>
                          </motion.div>
                        )}

                         {activeStep === 2 && (
                           <motion.div
                             key="gpt-success-out"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="text-emerald-400 space-y-2"
                           >
                             <p className="text-[10px] bg-emerald-500/10 px-2 py-1 rounded inline-block font-sans font-bold">
                               ✓ CLAUDE_CODE: PRECISION PROMPT RECEIVED
                             </p>
                             <p className="text-[11px] text-emerald-500/90 leading-relaxed font-mono">
                               &gt; aligned with 5/5 precision prompt constraints...<br />
                               &gt; verified org authorization rules bypass risk...<br />
                               &gt; writing organization owner invitations approval hook...<br />
                               &gt; <span className="font-bold text-emerald-400">COMPILE SUCCESS:</span> Perfect execution. Saved 10,240 development tokens.
                             </p>
                           </motion.div>
                         )}
                      </AnimatePresence>
                    </div>

                    {/* Grounding Context injection tag */}
                    <div className="mt-4 border-t border-[var(--border)]/30 pt-2 flex items-center justify-between">
                      <span className="text-[9px] text-[var(--text-muted)] font-mono">
                        {activeStep === 0 && "ENGINE STATUS: ZERO-GROUNDING CONVERSATION"}
                        {activeStep === 1 && "CONSTRUCTOR STATUS: STRUCTURING INTERVIEW NODES"}
                        {activeStep === 2 && "BUILDER STATUS: FLAWLESS EXECUTION GATEWAY"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry outcome feedback badge on Side B */}
                <div className="mt-4 border-t border-[var(--border)] pt-4 relative z-10 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)]">
                    MOMENTUM KNOWLEDGE SYSTEM
                  </span>

                  <AnimatePresence mode="wait">
                    {activeStep === 0 && (
                      <motion.span
                        key="badge-f"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-mono font-bold uppercase tracking-wider"
                      >
                        Severe Regression Risk
                      </motion.span>
                    )}

                    {activeStep === 1 && (
                      <motion.span
                        key="badge-p"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono font-bold uppercase tracking-wider"
                      >
                        Structuring Knowledge Graph
                      </motion.span>
                    )}

                    {activeStep === 2 && (
                      <motion.span
                        key="badge-s"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider"
                      >
                        100% Correct. 0 Regressions
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

