"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Orbit, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

type ActiveView = "document" | "constellation" | "health";

export default function KnowledgeViews() {
  const [activeTab, setActiveTab] = useState<ActiveView>("document");

  const constellationNodes = [
    { id: "1", label: "users/:id/POST", size: "w-24 h-24", x: "30%", y: "45%", color: "border-[var(--accent)] bg-[var(--bg-card)]", features: 8, trust: "Git-Confirmed", textColor: "text-[var(--accent)]" },
    { id: "2", label: "stripe_webhook", size: "w-28 h-28", x: "65%", y: "40%", color: "border-emerald-500 bg-[var(--bg-card)]", features: 12, trust: "Git-Confirmed", textColor: "text-emerald-500" },
    { id: "3", label: "redis_queue_handler", size: "w-20 h-20", x: "45%", y: "20%", color: "border-amber-500/70 bg-[var(--bg-card)]", features: 4, trust: "AI-Suggested", textColor: "text-amber-500" },
    { id: "4", label: "postgres_db_schema", size: "w-32 h-32", x: "50%", y: "70%", color: "border-[var(--text-primary)] bg-[var(--bg-card)]", features: 16, trust: "Human-Confirmed", textColor: "text-[var(--text-primary)]" },
    { id: "5", label: "auth_middleware", size: "w-22 h-22", x: "15%", y: "25%", color: "border-[var(--accent)]/50 bg-[var(--bg-card)]", features: 6, trust: "Git-Confirmed", textColor: "text-[var(--accent)]" }
  ];

  const healthTiles = [
    { name: "Auth Module Config", trust: "Human-Confirmed", level: "high", textColor: "text-emerald-500" },
    { name: "POST /v1/users Endpoint", trust: "Git-Confirmed", level: "high", textColor: "text-emerald-500" },
    { name: "Database Schema postgres", trust: "Human-Confirmed", level: "high", textColor: "text-emerald-500" },
    { name: "Stripe Event Router", trust: "Git-Confirmed", level: "high", textColor: "text-emerald-500" },
    { name: "Redis Invalidation Queue", trust: "AI-Suggested", level: "medium", textColor: "text-amber-500" },
    { name: "Clerk Session Webhook", trust: "AI-Suggested", level: "medium", textColor: "text-amber-500" },
    { name: "S3 Picture Upload Hook", trust: "Empty / Unverified", level: "low", textColor: "text-rose-500" },
    { name: "Postgres Vector Extension", trust: "Human-Confirmed", level: "high", textColor: "text-emerald-500" },
    { name: "Sendgrid Email Router", trust: "Desynced (Git Diverged)", level: "low", textColor: "text-rose-500" }
  ];

  return (
    <section id="knowledge-views" className="relative py-32 bg-transparent overflow-hidden border-t border-[var(--border)] dot-grid">
      <div className="absolute top-[25%] left-[20%] w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] glow-spot" />
      <div className="absolute bottom-[25%] right-[20%] w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] glow-spot" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--accent)] font-semibold bg-[var(--accent-subtle)] border border-[var(--accent)]/15 px-3 py-1 rounded-full mb-4 inline-block">
            High Density Dashboard
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[var(--text-primary)] mb-6">
            Visualize your project&apos;s true state.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">
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
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 border font-medium cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white border-transparent shadow-[0_4px_12px_var(--accent-glow)]"
                  : "bg-[var(--bg-card)]/50 text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              }`}
            >
              <tab.icon className="w-4 h-4" strokeWidth={1.5} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* The Frame / OS Window chrome */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/90 shadow-[0_45px_100px_-25px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* OS Header Bar */}
          <div className="bg-[var(--bg-surface)] border-b border-[var(--border)] py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)] tracking-wider">
              {activeTab === "document" && "momentum.app / workspace / document-view"}
              {activeTab === "constellation" && "momentum.app / workspace / interactive-graph"}
              {activeTab === "health" && "momentum.app / workspace / trust-registry"}
            </div>
            <div className="w-12 h-1.5" />
          </div>

          <div className="p-6 sm:p-8 min-h-[440px] flex items-center justify-center relative bg-[var(--bg-card)]/40">
            <AnimatePresence mode="wait">
              {/* Tab 1: Document View */}
              {activeTab === "document" && (
                <motion.div
                  key="document"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full grid md:grid-cols-3 gap-6"
                >
                  {/* Left Column Section Tree */}
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 font-mono text-xs space-y-2.5">
                    <div className="text-[var(--text-muted)] uppercase tracking-widest text-[9px] mb-3 font-semibold">Project Modules</div>
                    <div className="text-[var(--accent)] font-bold flex items-center gap-2 py-1 px-2 rounded bg-[var(--accent-subtle)] border-l-2 border-[var(--accent)]">
                      <FileText className="w-3.5 h-3.5 animate-pulse" />
                      <span>1. billing_pipeline</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1 px-2 hover:bg-[var(--bg-card)] rounded cursor-pointer transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      <span>2. users_onboarding</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1 px-2 hover:bg-[var(--bg-card)] rounded cursor-pointer transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      <span>3. socket_notification</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1 px-2 hover:bg-[var(--bg-card)] rounded cursor-pointer transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                      <span>4. analytics_funnels</span>
                    </div>
                  </div>

                  {/* Right Column Content View */}
                  <div className="md:col-span-2 bg-[var(--bg-surface)]/50 border border-[var(--border)] rounded-2xl p-6 font-mono text-xs text-[var(--text-secondary)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="p-1.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-bold text-[10px]">active</span>
                        <span className="text-[var(--text-primary)] font-bold">1. billing_pipeline.md</span>
                      </div>
                      
                      <div className="space-y-4 text-xs">
                        <p className="text-[var(--text-primary)] font-semibold">### 1.1 Webhook Integrity Check</p>
                        <p>Our Stripe hooks require processing via idempotency key verifiers. If a payment signal arrives twice, return 204 instantly.</p>
                        <p className="text-[var(--text-primary)] font-semibold">### 1.2 DB Synchronization</p>
                        <p>Write custom row changes to <code className="text-[var(--accent)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono font-semibold">user_subscription</code> securely. Lock write queues globally.</p>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-[var(--border)] pt-4 flex justify-between items-center text-[10px] text-[var(--text-muted)] font-mono">
                      <span>Rendered source: metadata_graph_v1.2</span>
                      <span className="flex items-center gap-1.5 font-mono text-emerald-500 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Complied & Consistent
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
                  className="w-full h-[400px] relative"
                >
                  {/* Top indicators */}
                  <span className="text-xs font-mono absolute top-2 right-4 text-[var(--text-secondary)] bg-[var(--bg-card)] py-1 px-2.5 rounded border border-[var(--border)] flex items-center gap-2 pointer-events-none z-10">
                    <Orbit className="w-3.5 h-3.5 text-[var(--accent)] animate-spin-slow" />
                    <span>Dynamic Layout: Feature Mass Sizing</span>
                  </span>

                  {constellationNodes.map((node, nIdx) => (
                    <motion.div
                      key={node.id}
                      style={{ left: node.x, top: node.y }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: nIdx * 0.05
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid p-1 flex flex-col justify-center items-center shadow-lg cursor-pointer ${node.size} ${node.color}`}
                    >
                      <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-primary)] font-bold text-center leading-none px-1">
                        {node.label}
                      </span>
                      <span className="text-[8px] font-mono text-[var(--text-muted)] mt-1 font-semibold">
                        {node.features} feats
                      </span>
                      <span className={`text-[7px] font-mono uppercase tracking-wider block mt-0.5 font-bold ${node.textColor}`}>
                        {node.trust}
                      </span>
                    </motion.div>
                  ))}

                  {/* Connective labels or lines represented as ambient SVGs */}
                  <svg className="absolute inset-0 w-full h-full -z-10 opacity-30">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      d="M 15% 25% L 30% 45% M 30% 45% L 50% 70% M 65% 40% L 50% 70% M 45% 20% L 65% 40% M 15% 25% L 45% 20%"
                      stroke="var(--text-primary)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      fill="none"
                    />
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
                  <div className="mb-6 flex flex-wrap gap-4 items-center justify-between pointer-events-none">
                    <div className="text-xs font-sans text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] font-bold">Confidence Engine:</span> Every knowledge node tracks logic completeness. Momentum audits differences automatically.
                    </div>
                    {/* Color legends */}
                    <div className="flex gap-4 font-mono text-[9px] tracking-wider uppercase">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-500">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                        <span>Confirmed</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-amber-500">
                        <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                        <span>Suggested</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-500">
                        <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                        <span>Diverged</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid layout with neat stagger timing loading on load */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {healthTiles.map((tile, idx) => (
                      <motion.div
                        key={tile.name}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] p-4 rounded-xl flex flex-col justify-between min-h-[90px] transition-all duration-300 hover:shadow-md cursor-pointer group"
                      >
                        <div>
                          <p className={`text-[10px] font-mono tracking-wider uppercase font-bold ${tile.textColor}`}>
                            {tile.trust}
                          </p>
                          <h4 className="text-xs sm:text-sm font-sans font-bold text-[var(--text-primary)] mt-1 group-hover:text-[var(--accent)] transition-colors">
                            {tile.name}
                          </h4>
                        </div>
                        <div className={`flex justify-end pt-2 ${tile.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                          <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                        </div>
                      </motion.div>
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
