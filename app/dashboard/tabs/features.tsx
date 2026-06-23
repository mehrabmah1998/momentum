"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  MessageSquare,
  ArrowRight,
  Plus,
  Check,
  Copy,
  AlertTriangle,
  RefreshCw,
  FolderSync,
  Bot,
  BookOpen,
  ArrowLeft,
  X,
  FileCheck
} from "lucide-react";
import { CONTEXT_KEYS, ContextKey, getCategoryBadgeStyle, getNodeTypeBadgeStyle } from "./keys";

interface FeaturesTabProps {
  onNavigate?: (tabId: string) => void;
}

// Preset feature ideas for quick user filling
const PRESET_IDEAS = [
  {
    title: "Multi-tenant role approval flow",
    description: "Multi-tenant role approval flow where organization owners must manually approve invitations before guest users can access generated specifications."
  },
  {
    title: "Embeddings-based semantic cache",
    description: "Embeddings-based semantic cache for Claude API. If a newly generated question matches a previous prompt similarity score above 0.95, reuse the query."
  },
  {
    title: "Export specs to GitHub ZIP",
    description: "Export the Insider Specification directly to a downloadable ZIP file containing Markdown and metadata.json with automatic commit tags."
  }
];

export default function FeaturesTab({ onNavigate }: FeaturesTabProps) {
  const [step, setStep] = useState<"describe" | "debate" | "prompt">("describe");
  const [description, setDescription] = useState("");
  const [selectedKeyIds, setSelectedKeyIds] = useState<string[]>(["core-stack", "active-constraints"]);
  const [isDebating, setIsDebating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Toggle Context Key attachment
  const handleToggleKey = (keyId: string) => {
    setSelectedKeyIds(prev => 
      prev.includes(keyId) ? prev.filter(id => id !== keyId) : [...prev, keyId]
    );
  };

  // Pre-fill prompt description
  const handleUsePreset = (desc: string) => {
    setDescription(desc);
  };

  // Trigger simulated debate
  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsDebating(true);
    setStep("debate");
    setTimeout(() => {
      setIsDebating(false);
    }, 2400); // realistic think timer
  };

  // Generate dynamic, realistic debate based on description input
  const generatedDebate = useMemo(() => {
    const descLower = description.toLowerCase();
    
    let affectedModules = ["m5 (Prompt Engine)", "m1 (Knowledge Graph)"];
    let relevantPastDecision = "Cloudflare D1 + better-auth for custom authentication schemas.";
    let clarifyingQuestions = [
      "Should this behavior bypass current role constraints, or inherit custom hierarchy from existing nodes?",
      "Do we need persistent database state adjustments to support this feature?"
    ];
    let whatMightBreak = "This might break the Document-Graph Consistency constraint (c1) by introducing untracked entities that bypass graph validation gates.";

    if (descLower.includes("auth") || descLower.includes("tenant") || descLower.includes("role") || descLower.includes("user")) {
      affectedModules = ["m4 (Auth & Teams)", "m3 (Document Engine)"];
      relevantPastDecision = "better-auth over Clerk to avoid per-seat limitations (d4).";
      clarifyingQuestions = [
        "Will org owner invitations expire automatically, and should pending approvals count towards max system tier seats?",
        "Do approvals trigger real-time WebSocket sync events, or simple client-side page polling?"
      ];
      whatMightBreak = "Could cause race conditions with client-side Auth Checks (d5) inside the useSession hook if session states aren't forcefully invalidated.";
    } else if (descLower.includes("cache") || descLower.includes("semantic") || descLower.includes("embed") || descLower.includes("claude")) {
      affectedModules = ["m1 (Knowledge Graph)", "m2 (Extraction Engine)"];
      relevantPastDecision = "PostgreSQL + pgvector for semantic mapping & caching (d1).";
      clarifyingQuestions = [
        "At what similarity threshold should we flag semantic cache hits vs trigger raw Claude API reasoning?",
        "Should cache validation rules be stored directly inside the Graph Node attributes (e1)?"
      ];
      whatMightBreak = "Might clash with Quality Gate Constraints (c2) if cached questions produce lower density mappings than natural user exploration loops.";
    } else if (descLower.includes("export") || descLower.includes("zip") || descLower.includes("markdown") || descLower.includes("doc")) {
      affectedModules = ["m3 (Document Engine)", "m5 (Prompt Engine)"];
      relevantPastDecision = "No document storage - documents are always rendered from graph on demand (d3).";
      clarifyingQuestions = [
        "Should the exported ZIP pack only the raw Markdown drafts, or include complete JSON schema dumps representing node lineages?",
        "Should the bundle trigger automatic git-inferred integrity tags?"
      ];
      whatMightBreak = "Breaks prompt context limits (c3) if full document generation dumps excessive uncompressed node contents into inline builder context.";
    }

    return {
      affectedModules,
      relevantPastDecision,
      clarifyingQuestions,
      whatMightBreak
    };
  }, [description]);

  // Generate dynamic system builder prompt
  const generatedPromptText = useMemo(() => {
    // Collect active context key details
    const activeKeys = CONTEXT_KEYS.filter(k => selectedKeyIds.includes(k.id));
    
    let contextHeader = "No specific context keys attached.";
    if (activeKeys.length > 0) {
      contextHeader = activeKeys.map(k => {
        const nodesStr = k.nodes.map(n => `- [${n.type}] ${n.name}: ${n.content}`).join("\n");
        return `### @${k.handle} (${k.label})\n${k.description}\n${nodesStr}`;
      }).join("\n\n");
    }

    let filesInvolved = "- /app/dashboard/tabs/features.tsx\n- /app/dashboard/_client.tsx\n- /lib/auth-client.ts";
    if (description.toLowerCase().includes("auth") || description.toLowerCase().includes("tenant")) {
      filesInvolved = "- /app/dashboard/tabs/keys.tsx\n- /lib/auth.ts\n- /app/api/auth/[...better-auth]/route.ts";
    } else if (description.toLowerCase().includes("cache") || description.toLowerCase().includes("embed")) {
      filesInvolved = "- /app/dashboard/tabs/graph.tsx\n- /lib/pgvector.ts\n- /app/api/embed/route.ts";
    }

    return `## Project Context
${contextHeader}

## What to Build
${description || "[No specification provided]"}

## Constraints to Respect
- Strictly adhere to established CSS variables in globals.css.
- All modifications must preserve real-time client-only compatibility.
- Node data structures must maintain parent-child referential integrity.

## Do Not Break
- Past Decision: ${generatedDebate.relevantPastDecision}
- Critical Constraint Impact: ${generatedDebate.whatMightBreak}

## Files Likely Involved
${filesInvolved}`;
  }, [description, selectedKeyIds, generatedDebate]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPromptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] font-sans text-[var(--text-primary)] p-6 select-none" id="features-tab-root">
      
      {/* Tab Header */}
      <div className="mb-8 select-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] font-bold mb-1.5 block">
          ONGOING_CYCLE: SYSTEM INTEGRATION PROMPT LAB
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] leading-none font-sans">
          Features
        </h1>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2 max-w-[70ch]">
          Translate raw product wishlists into perfectly synchronized, context-aware prompt payloads. Attach context keys, discuss specifications, and generate bulletproof builder directives.
        </p>
      </div>

      {/* Main Tab Grid: Left (Step Flow) & Right (Supporting Context Panel) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Step Flow Panel */}
        <div className="xl:col-span-3 flex flex-col gap-6">

          {/* Stepper Progress bar */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "describe" ? "bg-[var(--accent)] text-white" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                {step !== "describe" ? <Check className="w-3.5 h-3.5" /> : "1"}
              </div>
              <span className={`text-xs font-bold font-sans ${step === "describe" ? "text-[var(--text-primary)] font-extrabold" : "text-[var(--text-muted)]"}`}>Describe</span>
            </div>

            <div className="flex-1 h-[1px] bg-[var(--border)] mx-4" />

            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "debate" ? "bg-[var(--accent)] text-white" : step === "prompt" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-black/10 dark:bg-white/[0.04] text-[var(--text-muted)] border border-[var(--border)]"}`}>
                {step === "prompt" ? <Check className="w-3.5 h-3.5" /> : "2"}
              </div>
              <span className={`text-xs font-bold font-sans ${step === "debate" ? "text-[var(--text-primary)] font-extrabold" : "text-[var(--text-muted)]"}`}>Debate & Validate</span>
            </div>

            <div className="flex-1 h-[1px] bg-[var(--border)] mx-4" />

            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "prompt" ? "bg-[var(--accent)] text-white" : "bg-black/10 dark:bg-white/[0.04] text-[var(--text-muted)] border border-[var(--border)]"}`}>
                3
              </div>
              <span className={`text-xs font-bold font-sans ${step === "prompt" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>Builder Prompt</span>
            </div>
          </div>

          {/* Stepper Content Frame */}
          <AnimatePresence mode="wait">
            
            {/* Step 1: Describe Feature Form */}
            {step === "describe" && (
              <motion.div
                key="describe-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[24px] ring-1 ring-black/5 dark:ring-white/5 shadow-md"
              >
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[23px] p-6">
                  <h3 className="text-base font-bold font-sans tracking-tight text-[var(--text-primary)] mb-1">
                    What would you like to build next?
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                    Explain your upcoming feature idea. The Co-Pilot Agent will lookup your specified mind-map dependencies below and evaluate architectural constraints before compiling instructions.
                  </p>

                  <form onSubmit={handleStartSubmit} className="space-y-6">
                    <div className="relative">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Define organization owner approvals before adding user invites..."
                        className="w-full h-40 px-4 py-3 rounded-2xl border border-[var(--border)] bg-black/10 dark:bg-black/15 hover:border-[var(--border-hover)] focus:border-[var(--accent)] focus:outline-none transition-all resize-none text-xs text-[var(--text-primary)] leading-relaxed"
                      />
                      {description && (
                        <button
                          type="button"
                          onClick={() => setDescription("")}
                          className="absolute top-3 right-3 p-1 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors border-none cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Presets Grid */}
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold block mb-2.5">
                        OR SELECT A SAMPLE INITIATIVE PRESET:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {PRESET_IDEAS.map((preset, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleUsePreset(preset.description)}
                            className="p-3.5 bg-black/5 dark:bg-white/[0.02] border border-[var(--border)] hover:border-[var(--accent)]/30 rounded-xl cursor-pointer transition-all flex flex-col justify-between text-left group"
                          >
                            <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors block mb-1">
                              {preset.title}
                            </span>
                            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed line-clamp-3">
                              {preset.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Row */}
                    <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4 mt-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)] font-medium">
                        <FolderSync className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Attached bundles ({selectedKeyIds.length}) will populate the prompt.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={!description.trim()}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold font-sans tracking-wide flex items-center justify-center gap-1.5 transition-all outline-none ${
                          description.trim()
                            ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md hover:shadow-[0_4px_20px_var(--accent-glow)] cursor-pointer active:scale-[0.98]"
                            : "bg-black/10 dark:bg-white/[0.04] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed"
                        }`}
                      >
                        <span>Start Co-Pilot Discussion</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 2: Debate & Validate */}
            {step === "debate" && (
              <motion.div
                key="debate-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[24px] ring-1 ring-black/5 dark:ring-white/5 shadow-md"
              >
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[23px] p-6">
                  
                  {/* Thinking Loader */}
                  {isDebating ? (
                    <div className="py-16 text-center flex flex-col items-center justify-center select-none">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center mb-4 animate-spin" style={{ animationDuration: "2s" }}>
                        <RefreshCw className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <span className="font-mono text-[10px] uppercase text-[var(--text-primary)] font-bold tracking-[0.2em] block mb-2">
                        COMPARING AGAINST GRAPH SCHEMAS
                      </span>
                      <p className="text-xs text-[var(--text-muted)] max-w-sm">
                        Traversing constraints database, flagging dependencies, and checking consistency layers...
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Debate result interface */}
                      <div className="flex items-start gap-4 mb-6 select-none border-b border-[var(--border)] pb-5">
                        <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/[0.08] text-[var(--accent)] border border-[var(--accent)]/20 shadow-inner flex items-center justify-center shrink-0">
                          <Bot className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[var(--accent)] uppercase tracking-[0.15em] font-extrabold block mb-1">
                            CO-PILOT AGENT ANALYSIS COMPLETE
                          </span>
                          <h3 className="text-base font-bold font-sans tracking-tight text-[var(--text-primary)] mb-1">
                            Architectural Review & Schema Impacts
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            Based on verified graph node constraints, I found both alignment matches and conflicts associated with your modification.
                          </p>
                        </div>
                      </div>

                      {/* Diagnostic Points Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        
                        {/* Affected Modules */}
                        <div className="p-4 bg-black/5 dark:bg-black/10 border border-[var(--border)] rounded-xl flex flex-col justify-between">
                          <span className="text-[9px] font-mono uppercase text-[var(--text-muted)] font-extrabold block mb-2 pb-1.5 border-b border-[var(--border)]">AFFECTED MODULE NODES</span>
                          <div className="flex flex-col gap-1">
                            {generatedDebate.affectedModules.map((m, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Past Decision Lock */}
                        <div className="p-4 bg-black/5 dark:bg-black/10 border border-[var(--border)] rounded-xl flex flex-col justify-between">
                          <span className="text-[9px] font-mono uppercase text-amber-500 font-extrabold block mb-2 pb-1.5 border-b border-[var(--border)]">PAST DESIGN DECISION</span>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {generatedDebate.relevantPastDecision}
                          </p>
                        </div>

                        {/* Clarifying Questions */}
                        <div className="p-4 bg-black/5 dark:bg-black/10 border border-[var(--border)] rounded-xl flex flex-col justify-between md:col-span-2">
                          <span className="text-[9px] font-mono uppercase text-[var(--text-primary)] font-extrabold block mb-2 pb-1.5 border-b border-[var(--border)]">CO-PILOT CONSTRAINTS CLARIFICATION</span>
                          <div className="space-y-2 mt-2">
                            {generatedDebate.clarifyingQuestions.map((q, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">0{idx + 1}.</span>
                                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed italic">
                                  &ldquo;{q}&rdquo;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Warning/Breaks */}
                        <div className="p-4 bg-rose-500/[0.02] border border-rose-500/20 rounded-xl md:col-span-2 flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <span className="text-[9px] font-mono uppercase text-rose-400 font-extrabold block mb-1">INTEGRITY OVERLAP & SYSTEM BREAK RISKS</span>
                            <p className="text-xs text-rose-300 font-medium leading-relaxed font-sans">
                              {generatedDebate.whatMightBreak}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Debate Controls */}
                      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setStep("describe")}
                          className="px-4 py-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/[0.04] text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border)] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Edit Description</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStep("prompt")}
                          className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold font-sans tracking-wide rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-[0_4px_20px_var(--accent-glow)] cursor-pointer active:scale-[0.98] transition-colors"
                        >
                          <span>Confirm Specs & Compile Prompt</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* Step 3: Generated Builder Prompt */}
            {step === "prompt" && (
              <motion.div
                key="prompt-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[24px] ring-1 ring-black/5 dark:ring-white/5 shadow-md opacity-100"
              >
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[23px] p-6 relative">
                  
                  {/* Headline Copy Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5 mb-5 select-none">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.12em] font-extrabold block mb-1 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>PROMPT COMPILATION READY</span>
                      </span>
                      <h3 className="text-base font-bold font-sans tracking-tight text-[var(--text-primary)]">
                        Copy to your AI Builder
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold font-sans tracking-wide px-5 py-2.5 flex items-center gap-2 shadow-md hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)] select-none cursor-pointer border-none transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Generated Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* High contrast formatted terminal prompt container */}
                  <div className="p-4 rounded-xl bg-black/25 dark:bg-black/35 border border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed font-mono select-text overflow-y-auto max-h-[480px]">
                    <div className="text-[9px] text-[var(--text-muted)] border-b border-[var(--border)] pb-2 mb-3 font-extrabold select-none flex items-center justify-between">
                      <span>MOMENTUM_BUILDER_INSTRUCTION_SET.md</span>
                      <span className="text-emerald-400 font-bold">SHA-256 PARSED</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono relative pr-12 text-[11px]">
                      {generatedPromptText}
                    </pre>
                  </div>

                  {/* Foot actions */}
                  <div className="flex items-center justify-between mt-6 border-t border-[var(--border)] pt-4 select-none">
                    <button
                      type="button"
                      onClick={() => setStep("debate")}
                      className="px-4 py-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/[0.04] text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border)] rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Debate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDescription("");
                        setStep("describe");
                      }}
                      className="px-4 py-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/[0.04] text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/10 rounded-xl hover:border-[var(--accent)]/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Create New Specs</span>
                      <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Side: Reusable Context Keys Sidebar Panel */}
        <div className="xl:col-span-1 select-none flex flex-col gap-4">
          <div className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[24px] ring-1 ring-black/5 dark:ring-white/10 shadow-md">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[23px] p-5 flex flex-col min-h-[480px]">
              
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--accent)] font-extrabold block">Context Keys</span>
                  <div className="text-xs font-bold font-sans text-[var(--text-primary)] mt-0.5">Attachable Bundles</div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[9px] font-mono font-bold text-[var(--accent)] border border-[var(--accent)]/20 uppercase">
                  Active
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] font-sans leading-normal mb-4 select-none">
                Select context keys below to automatically reference decision blocks in the generated Prompt Context:
              </p>

              {/* Context Key selection blocks */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
                {CONTEXT_KEYS.map((key) => {
                  const isChecked = selectedKeyIds.includes(key.id);
                  return (
                    <div
                      key={key.id}
                      onClick={() => handleToggleKey(key.id)}
                      className={`p-3 border rounded-xl cursor-pointer transition-all ${
                        isChecked 
                          ? "border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] shadow-inner" 
                          : "border-[var(--border)] bg-black/5 dark:bg-white/[0.01] hover:border-[var(--border-hover)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10.5px] font-bold text-[var(--text-secondary)] leading-none">
                          @{key.handle}
                        </span>

                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked 
                            ? "bg-[var(--accent)] border-[var(--accent)] text-white" 
                            : "border-[var(--border)] bg-transparent"
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-[var(--text-primary)] leading-snug">
                        {key.label}
                      </div>

                      <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 mt-1 leading-normal">
                        {key.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-[var(--border)]/40 mt-2.5 pt-1.5 text-[9px]">
                        <span className={`font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border text-[8px] font-bold ${getCategoryBadgeStyle(key.category)}`}>
                          {key.category}
                        </span>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          {key.nodes.length} nodes
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
