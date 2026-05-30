"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Orbit, AlertTriangle, ShieldCheck, PlayCircle, Layers, CheckCircle2, RefreshCw } from "lucide-react";

type ActiveView = "document" | "constellation" | "health";

export default function KnowledgeViews() {
  const [activeTab, setActiveTab] = useState<ActiveView>("document");

  // Mock data for Constellation Graph nodes
  const constellationNodes = [
    { id: "1", label: "users/:id/POST", size: "w-24 h-24", x: "30%", y: "45%", color: "border-brand-blue bg-[#0b172e]", features: 8, trust: "Git-Confirmed" },
    { id: "2", label: "stripe_webhook", size: "w-28 h-28", x: "65%", y: "40%", color: "border-brand-teal bg-[#0d1e25]", features: 12, trust: "Git-Confirmed" },
    { id: "3", label: "redis_queue_handler", size: "w-18 h-18", x: "45%", y: "20%", color: "border-amber-500/50 bg-[#251e12]", features: 4, trust: "AI-Suggested" },
    { id: "4", label: "postgres_db_schema", size: "w-32 h-32", x: "50%", y: "70%", color: "border-emerald-500 bg-[#091f16]", features: 16, trust: "Human-Confirmed" },
    { id: "5", label: "auth_middleware", size: "w-20 h-20", x: "15%", y: "25%", color: "border-brand-blue bg-[#0b172e]", features: 6, trust: "Git-Confirmed" }
  ];

  // Mock data for Confidence Health tiles
  const healthTiles = [
    { name: "Auth Module Config", trust: "Human-Confirmed", level: "high", color: "border-emerald-500/20 bg-emerald-950/20 text-emerald-300" },
    { name: "POST /v1/users Endpoint", trust: "Git-Confirmed", level: "high", color: "border-emerald-500/20 bg-emerald-950/20 text-emerald-300" },
    { name: "Database Schema postgres", trust: "Human-Confirmed", level: "high", color: "border-emerald-500/20 bg-emerald-950/20 text-emerald-300" },
    { name: "Stripe Event Router", trust: "Git-Confirmed", level: "high", color: "border-emerald-500/20 bg-emerald-950/20 text-emerald-300" },
    { name: "Redis Invalidation Queue", trust: "AI-Suggested", level: "medium", color: "border-amber-500/20 bg-amber-950/10 text-amber-300" },
    { name: "Clerk Session Webhook", trust: "AI-Suggested", level: "medium", color: "border-amber-500/20 bg-amber-950/10 text-amber-300" },
    { name: "S3 Picture Upload Hook", trust: "Empty / Unverified", level: "low", color: "border-rose-500/20 bg-rose-950/20 text-rose-300" },
    { name: "Postgres Vector Extension", trust: "Human-Confirmed", level: "high", color: "border-emerald-500/20 bg-emerald-950/20 text-emerald-300" },
    { name: "Sendgrid Email Router", trust: "Desynced (Git Diverged)", level: "low", color: "border-rose-500/20 bg-rose-950/20 text-rose-300" }
  ];

  return (
    <section id="knowledge-views" className="relative py-32 bg-[#020617] overflow-hidden dot-grid">
      <div className="absolute top-[25%] left-[20%] w-[500px] h-[500px] rounded-full bg-brand-blue/5 glow-spot" />
      <div className="absolute bottom-[25%] right-[20%] w-[500px] h-[500px] rounded-full bg-brand-cyan/5 glow-spot" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-cyan font-semibold bg-brand-cyan/10 px-3 py-1 rounded-full mb-4 inline-block">
            High Density Dashboard
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white mb-6">
            Visualize your project&apos;s true state.
          </h2>
          <p className="text-slate-400 text-lg">
            Say goodbye to flat README folders. Toggle through Momentum&apos;s intelligent interfaces mapping every dependency and status.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: "document", label: "Document View", icon: FileText },
            { id: "constellation", label: "Constellation Graph", icon: Orbit },
            { id: "health", label: "Confidence Health Map", icon: ShieldCheck }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveView)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 border font-medium ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-brand-blue to-brand-cyan text-white border-transparent"
                  : "bg-[#090e1c]/50 text-slate-400 border-white/5 hover:border-white/15 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" strokeWidth={1.5} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* The Frame / OS Window chrome */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#040814]/90 shadow-[0_45px_100px_-25px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* OS Header Bar */}
          <div className="bg-[#080d19] border-b border-white/5 py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider">
              {activeTab === "document" && "momentum.app / workspace / document-view"}
              {activeTab === "constellation" && "momentum.app / workspace / interactive-graph"}
              {activeTab === "health" && "momentum.app / workspace / trust-registry"}
            </div>
            <div className="w-12 h-1.5" /> {/* spacing balances chrome */}
          </div>

          <div className="p-6 sm:p-8 min-h-[440px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {/* Tab 1: Document View */}
              {activeTab === "document" && (
                <motion.div
                  key="document"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full grid md:grid-cols-3 gap-6 sound-grid"
                >
                  {/* Left Column Section Tree */}
                  <div className="bg-[#090e1c] border border-white/5 rounded-2xl p-4 font-mono text-xs space-y-2.5">
                    <div className="text-slate-500 uppercase tracking-widest text-[9px] mb-3">Project Modules</div>
                    <div className="text-brand-cyan font-bold flex items-center gap-2 py-1 px-2 rounded bg-white/5 border-l-2 border-brand-cyan">
                      <FileText className="w-3.5 h-3.5" />
                      <span>1. billing_pipeline</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      <span>2. users_onboarding</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      <span>3. socket_notification</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-2 py-1 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      <span>4. analytics_funnels</span>
                    </div>
                  </div>

                  {/* Right Column Content View */}
                  <div className="md:col-span-2 bg-[#090e1c]/50 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-400 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="p-1.5 rounded bg-brand-cyan/10 text-brand-cyan font-bold text-[10px]">active</span>
                        <span className="text-slate-200 font-bold">1. billing_pipeline.md</span>
                      </div>
                      
                      <div className="space-y-3.5 text-xs">
                        <p className="text-slate-200">### 1.1 Webhook Integrity Check</p>
                        <p>Our Stripe hooks require processing via idempotency key verifiers. If a payment signal arrives twice, return 204 instantly.</p>
                        <p className="text-slate-200">### 1.2 DB Synchronization</p>
                        <p>Write custom row changes to <code className="text-brand-cyan bg-slate-900 px-1 py-0.5 rounded">user_subscription</code> securely. Lock write queues globally.</p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                      <span>Rendered source: metadata_graph_v1.2</span>
                      <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> Complied & Consistent
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Constellation Graph */}
              {activeTab === "constellation" && (
                <motion.div
                  key="constellation"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-[400px] relative pointer-events-none"
                >
                  {/* Absolute node positioning canvas mock */}
                  <span className="text-xs font-mono absolute top-2 right-4 text-slate-400 bg-white/5 py-1 px-2.5 rounded border border-white/5 flex items-center gap-2">
                    <Orbit className="w-3.5 h-3.5 text-brand-cyan animate-spin-slow" />
                    <span>Dynamic Layout: Feature Mass Sizing</span>
                  </span>

                  {constellationNodes.map((node) => (
                    <div
                      key={node.id}
                      style={{ left: node.x, top: node.y }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid p-1 flex flex-col justify-center items-center shadow-lg transition-transform hover:scale-105 duration-300 ${node.size} ${node.color}`}
                    >
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-200 font-bold text-center leading-none px-1">
                        {node.label}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500 mt-1">
                        {node.features} feats
                      </span>
                      <span className="text-[7px] font-mono text-brand-cyan uppercase tracking-wider block mt-0.5">
                        {node.trust}
                      </span>
                    </div>
                  ))}

                  {/* Connective labels or lines represented as ambient SVGs */}
                  <svg className="absolute inset-0 w-full h-full -z-10 opacity-30">
                    <path d="M 15% 25% L 30% 45% M 30% 45% L 50% 70% M 65% 40% L 50% 70% M 45% 20% L 65% 40% M 15% 25% L 45% 20%" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" fill="none" />
                  </svg>
                </motion.div>
              )}

              {/* Tab 3: Confidence Health Map */}
              {activeTab === "health" && (
                <motion.div
                  key="health"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col justify-between"
                >
                  <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                    <div className="text-xs font-sans text-slate-300">
                      <span className="text-rose-400 font-bold">Confidence Engine:</span> Every knowledge node tracks logic completeness. Momentum audits differences automatically.
                    </div>
                    {/* Color legends */}
                    <div className="flex gap-4 font-mono text-[9px] tracking-wider uppercase text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                        <span>Confirmed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                        <span>Suggested</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                        <span>Diverged</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {healthTiles.map((tile) => (
                      <div
                        key={tile.name}
                        className={`p-4 rounded-xl border flex flex-col justify-between min-h-[90px] transition-all duration-300 hover:scale-[1.01] ${tile.color}`}
                      >
                        <div>
                          <p className="text-[10px] font-mono tracking-wider opacity-60 uppercase">
                            {tile.trust}
                          </p>
                          <h4 className="text-xs sm:text-sm font-sans font-bold text-slate-100 mt-1">
                            {tile.name}
                          </h4>
                        </div>
                        <div className="flex justify-end pt-2">
                          <CheckCircle2 className="w-4 h-4 opacity-75" strokeWidth={1.5} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
