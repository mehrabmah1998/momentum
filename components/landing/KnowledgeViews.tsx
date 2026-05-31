"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Orbit, ShieldCheck, CheckCircle2, 
  Database, Cpu, Terminal, Activity 
} from "lucide-react";

type ActiveView = "document" | "constellation" | "health";

interface ConstellationNode {
  id: string;
  label: string;
  tag: string;
  desc: string;
  features: number;
  trust: string;
  level: string;
  x: number;
  y: number;
  icon: React.ComponentType<any>;
  textColor: string;
  borderColor: string;
  bgGlow: string;
  incoming: string;
  outgoing: string;
}

const constellationNodes: ConstellationNode[] = [
  { 
    id: "auth", 
    label: "auth_middleware", 
    tag: "MIDDLEWARE",
    desc: "Token validation & session security credentials.",
    features: 6, 
    trust: "Git-Confirmed", 
    level: "Verified",
    x: 125, 
    y: 100, 
    icon: ShieldCheck, 
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30 group-hover:border-blue-500",
    bgGlow: "rgba(59, 130, 246, 0.08)",
    incoming: "Client Web Browser / API Route",
    outgoing: "users/:id/POST"
  },
  { 
    id: "endpoint", 
    label: "users/:id/POST", 
    tag: "API ENDPOINT",
    desc: "Primary creation schema, initiates Stripe billing flow.",
    features: 8, 
    trust: "Git-Confirmed", 
    level: "Synced",
    x: 235, 
    y: 285, 
    icon: FileText, 
    textColor: "text-indigo-400",
    borderColor: "border-indigo-500/30 group-hover:border-indigo-500",
    bgGlow: "rgba(99, 102, 241, 0.08)",
    incoming: "auth_middleware",
    outgoing: "postgres_db_schema"
  },
  { 
    id: "queue", 
    label: "redis_queue_handler", 
    tag: "ASYNC QUEUE",
    desc: "Handles async cache updates & Stripe webhook retries.",
    features: 4, 
    trust: "AI-Suggested", 
    level: "AI Synced",
    x: 455, 
    y: 100, 
    icon: Cpu, 
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30 group-hover:border-amber-500",
    bgGlow: "rgba(245, 158, 11, 0.08)",
    incoming: "stripe_webhook",
    outgoing: "postgres_db_schema"
  },
  { 
    id: "database", 
    label: "postgres_db_schema", 
    tag: "RELATIONAL DB",
    desc: "Core database storing user and subscription structures.",
    features: 16, 
    trust: "Human-Confirmed", 
    level: "Verified",
    x: 475, 
    y: 300, 
    icon: Database, 
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30 group-hover:border-emerald-500",
    bgGlow: "rgba(16, 185, 129, 0.08)",
    incoming: "users/:id/POST, redis_queue_handler",
    outgoing: "Analytics Pipeline"
  },
  { 
    id: "webhook", 
    label: "stripe_webhook", 
    tag: "WEBHOOK RECEIVER",
    desc: "Captures billing triggers & charge statuses.",
    features: 12, 
    trust: "Validated", 
    level: "Consistent",
    x: 695, 
    y: 195, 
    icon: CheckCircle2, 
    textColor: "text-violet-400",
    borderColor: "border-violet-500/30 group-hover:border-violet-500",
    bgGlow: "rgba(139, 92, 246, 0.08)",
    incoming: "Stripe API Webhook Gate",
    outgoing: "redis_queue_handler, postgres_db_schema"
  }
];

// Active simulated telemetry payload values
const liveTelemetryData: Record<string, any> = {
  auth: {
    latency: "14ms",
    invocations: "14.2k/m",
    lastEvent: "AUTH_SUCCESS",
    codeRef: "src/lib/jwt_verifier.ts",
    activeRevision: "rev-24.8"
  },
  endpoint: {
    latency: "42ms",
    invocations: "8.1k/m",
    lastEvent: "POST_OK user_9ac",
    codeRef: "src/app/api/users/route.ts",
    activeRevision: "rev-10.2"
  },
  queue: {
    latency: "3ms",
    invocations: "2.4k/m",
    lastEvent: "CACHE_INVALIDATED",
    codeRef: "src/workers/redis_queue.ts",
    activeRevision: "rev-04.5"
  },
  database: {
    latency: "8ms",
    invocations: "41.6k/m",
    lastEvent: "COMMIT user_sub_9ac",
    codeRef: "prisma/schema.prisma",
    activeRevision: "rev-99.1"
  },
  webhook: {
    latency: "19ms",
    invocations: "4.8k/m",
    lastEvent: "WEBHOOK_OK evt_SUBS_041",
    codeRef: "src/app/api/stripe/route.ts",
    activeRevision: "rev-08.9"
  }
};

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

export default function KnowledgeViews() {
  const [activeTab, setActiveTab] = useState<ActiveView>("document");
  const [progress, setProgress] = useState(0);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const snoozeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constellation interactive state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeCycleIndex, setActiveCycleIndex] = useState(0);

  // Tab cycling autoplay with micro progress bar tracker
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      // Pause progression during snooze
      if (isSnoozed) {
        return;
      }

      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((current) => {
            if (current === "document") return "constellation";
            if (current === "constellation") return "health";
            return "document";
          });
          return 0;
        }
        return prev + 1.25; // 100% full in approx 6.4 seconds
      });
    }, 80);

    return () => clearInterval(cycleInterval);
  }, [isSnoozed]);

  // Telemetry cycle when not hovered
  useEffect(() => {
    if (activeTab !== "constellation" || hoveredNodeId !== null) return;
    const telemetryInterval = setInterval(() => {
      setActiveCycleIndex((prev) => (prev + 1) % constellationNodes.length);
    }, 3200);
    return () => clearInterval(telemetryInterval);
  }, [activeTab, hoveredNodeId]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (snoozeTimerRef.current) {
        clearTimeout(snoozeTimerRef.current);
      }
    };
  }, []);

  const handleTabSelect = (tabId: ActiveView) => {
    setActiveTab(tabId);
    setProgress(0);
    
    // Snooze autoplay for 15 seconds so developers can manually interact at length
    setIsSnoozed(true);
    if (snoozeTimerRef.current) {
      clearTimeout(snoozeTimerRef.current);
    }
    snoozeTimerRef.current = setTimeout(() => {
      setIsSnoozed(false);
    }, 15000);
  };

  const activeNode = hoveredNodeId 
    ? constellationNodes.find(n => n.id === hoveredNodeId) || constellationNodes[0]
    : constellationNodes[activeCycleIndex];

  const nodeStats = liveTelemetryData[activeNode.id] || liveTelemetryData["auth"];

  return (
    <section id="knowledge-views" className="relative py-32 bg-transparent overflow-hidden border-t border-[var(--border)] dot-grid select-none">
      <div className="absolute top-[25%] left-[20%] w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] glow-spot pointer-events-none" />
      <div className="absolute bottom-[25%] right-[20%] w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] glow-spot pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--accent)] font-semibold bg-[var(--accent-subtle)] border border-[var(--accent)]/15 px-3 py-1 rounded-full mb-4 inline-block">
            High Density Dashboard
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[var(--text-primary)] mb-6">
            Visualize your project&apos;s true state.
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg">
            Say goodbye to flat README folders. Momentum maps every logic endpoint, database query, and third-party event listener automatically.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { id: "document", label: "Document View", icon: FileText },
            { id: "constellation", label: "Constellation Graph", icon: Orbit },
            { id: "health", label: "Confidence Health Map", icon: ShieldCheck }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSelect(tab.id as ActiveView)}
                className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 border font-bold cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-[var(--accent)] text-white border-transparent shadow-[0_8px_20px_rgba(59,130,246,0.15)]"
                    : "bg-[var(--bg-card)]/40 backdrop-blur-md text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive && tab.id === "constellation" ? "animate-spin-slow" : ""}`} strokeWidth={1.5} />
                <span>{tab.label}</span>

                {/* Ambient loading playhead bar beneath active tab */}
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 h-[2.5px] bg-white/40 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Frame Context Board */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/40 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.22)] overflow-hidden">
          {/* Hardware Header Panel */}
          <div className="bg-[var(--bg-surface)] border-b border-[var(--border)] py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[10px] font-mono text-[var(--text-secondary)] tracking-widest">
              {activeTab === "document" && "MOMENTUM // WORKSPACE // CODE_DOCUMENT"}
              {activeTab === "constellation" && "MOMENTUM // WORKSPACE // REACTION_FLOW_GRAPH"}
              {activeTab === "health" && "MOMENTUM // WORKSPACE // SCHEMA_INTEGRITY_MAP"}
            </div>
            <div className="w-10 flex justify-end font-mono text-[8px] text-[var(--text-secondary)] opacity-50 bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border)] uppercase">
              LIVE
            </div>
          </div>

          <div className="p-6 md:p-8 min-h-[460px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {/* TAB 1: DOCUMENTED CODE SPECS */}
              {activeTab === "document" && (
                <motion.div
                  key="document"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full grid md:grid-cols-3 gap-6"
                >
                  {/* Tree list */}
                  <div className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border)]/70 rounded-2xl p-4 font-mono text-xs space-y-2">
                    <div className="text-[var(--text-muted)] uppercase tracking-widest text-[8px] mb-3 font-semibold select-none">Project Workspace Files</div>
                    <div className="text-[var(--accent)] font-bold flex items-center gap-2 py-1.5 px-2.5 rounded bg-[var(--accent-subtle)] border-l-2 border-[var(--accent)]">
                      <FileText className="w-4 h-4 animate-pulse" />
                      <span>1. billing_pipeline</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1.5 px-2.5 hover:bg-[var(--bg-card)]/50 rounded cursor-pointer transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>2. users_onboarding</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1.5 px-2.5 hover:bg-[var(--bg-card)]/50 rounded cursor-pointer transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>3. socket_notification</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1.5 px-2.5 hover:bg-[var(--bg-card)]/50 rounded cursor-pointer transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>4. analytics_funnels</span>
                    </div>
                  </div>

                  {/* Render page views */}
                  <div className="md:col-span-2 bg-[var(--bg-surface)]/30 backdrop-blur-md border border-[var(--border)]/70 rounded-2xl p-6 font-mono text-xs text-[var(--text-secondary)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4 justify-between border-b border-[var(--border)]pb-3 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1 px-2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] text-[9px] font-bold">active</span>
                          <span className="text-[var(--text-primary)] font-bold">billing_pipeline.md</span>
                        </div>
                        <span className="text-[9px] text-[var(--text-muted)]">rev-a4.8</span>
                      </div>
                      
                      <div className="space-y-4 text-xs leading-relaxed">
                        <div>
                          <p className="text-[var(--text-primary)] font-bold mb-1">### 1.1 Webhook Integrity Check</p>
                          <p className="opacity-80">Our Stripe hooks require processing via unique idempotency values check. If duplicate signature matches, respond immediately with 204 status.</p>
                        </div>
                        <div>
                          <p className="text-[var(--text-primary)] font-bold mb-1">### 1.2 DB Synchronization</p>
                          <p className="opacity-80">Sync relational writes directly to <code className="text-[var(--accent)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono font-semibold">user_subscription</code> keys with strict locking sequence.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-[var(--border)] pt-4 flex justify-between items-center text-[9px] text-[var(--text-muted)] font-mono">
                      <span>Ref source: metadata_graph_v1.2</span>
                      <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Complied & Consistent
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ADVANCED CONSTELLATION GRAPH & TELEMETRY */}
              {activeTab === "constellation" && (
                <motion.div
                  key="constellation"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col md:grid md:grid-cols-12 gap-6 min-h-[400px]"
                >
                  {/* Left Column: Visual Map layout (Aspect Box) */}
                  <div className="col-span-12 md:col-span-8 relative rounded-2xl border border-[var(--border)]/70 bg-[var(--bg-surface)]/20 overflow-hidden min-h-[340px] md:min-h-[400px]">
                    
                    {/* SVG Connections Canvas displaying active flowing packets */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#c084fc" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>

                      {/* SVG Bezier path links connecting elements */}
                      {/* Connection 1: Auth -> Endpoint */}
                      <path d="M 125 100 Q 180 192 235 285" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 2: Endpoint -> Database */}
                      <path d="M 235 285 Q 355 292 475 300" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 3: Auth -> Queue */}
                      <path d="M 125 100 Q 290 100 455 100" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 4: Queue -> Database */}
                      <path d="M 455 100 Q 465 200 475 300" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 5: Webhook -> Database */}
                      <path d="M 695 195 Q 585 247 475 300" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 6: Webhook -> Queue */}
                      <path d="M 695 195 Q 575 147 455 100" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />

                      {/* Animated Flowing packet light indicators */}
                      <circle r="3" fill="#3b82f6" opacity="0.95">
                        <animateMotion dur="2.8s" repeatCount="indefinite" path="M 125 100 Q 180 192 235 285" />
                      </circle>
                      <circle r="3" fill="#10b981" opacity="0.95">
                        <animateMotion dur="3.2s" repeatCount="indefinite" path="M 235 285 Q 355 292 475 300" />
                      </circle>
                      <circle r="3" fill="#f59e0b" opacity="0.95">
                        <animateMotion dur="3.8s" repeatCount="indefinite" path="M 125 100 Q 290 100 455 100" />
                      </circle>
                      <circle r="3" fill="#8b5cf6" opacity="0.95">
                        <animateMotion dur="3.1s" repeatCount="indefinite" path="M 695 195 Q 585 247 475 300" />
                      </circle>
                    </svg>

                    {/* Nodes positioned precisely against coordinate frame */}
                    {constellationNodes.map((node) => {
                      const NodeIcon = node.icon;
                      const isCurrentlyActive = activeNode.id === node.id;
                      
                      return (
                        <div
                          key={node.id}
                          style={{
                            left: `${(node.x / 800) * 100}%`,
                            top: `${(node.y / 400) * 100}%`,
                          }}
                          onMouseEnter={() => setHoveredNodeId(node.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                        >
                          {/* Outer heartbeat ring */}
                          <div 
                            className={`absolute inset-0 rounded-xl transition-all duration-500 -m-1.5 border border-dashed ${
                              isCurrentlyActive 
                                ? "border-[var(--accent)]/60 scale-105 rotate-12 animate-pulse-slow" 
                                : "border-transparent group-hover:scale-105 group-hover:border-[var(--border-hover)]"
                            }`} 
                          />

                          {/* Node pill/capsule body */}
                          <div 
                            className={`min-w-[130px] rounded-xl border p-2.5 backdrop-blur-2xl transition-all duration-500 flex items-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.12)] ${
                              isCurrentlyActive 
                                ? "bg-[var(--bg-card)] border-[var(--accent)] shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.03]" 
                                : "bg-[var(--bg-card)]/80 border-[var(--border)]/80 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card)]"
                            }`}
                            style={{
                              background: isCurrentlyActive ? `radial-gradient(ellipse at center, ${node.bgGlow}, transparent 95%)` : undefined
                            }}
                          >
                            <div className={`p-1.5 rounded-lg border border-[var(--border)] transition-all duration-300 ${
                              isCurrentlyActive ? "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent)]/30" : "bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                            }`}>
                              <NodeIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </div>

                            <div className="flex flex-col text-left">
                              <span className="text-[7px] font-mono tracking-widest text-[var(--text-muted)] uppercase font-semibold leading-none mb-1">
                                {node.tag}
                              </span>
                              <span className={`text-[9.5px] font-mono leading-none font-bold ${isCurrentlyActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                                {node.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <span className="text-[8px] font-mono absolute bottom-3 left-4 text-[var(--text-muted)] uppercase bg-[var(--bg-card)]/70 px-2 py-0.5 rounded border border-[var(--border)] select-none">
                      Scale: Contextual volume mapping
                    </span>
                  </div>

                  {/* Right Column: High Density Telemetry Monitor Panel */}
                  <div className="col-span-12 md:col-span-4 flex flex-col justify-between rounded-2xl border border-[var(--border)]/70 bg-[var(--bg-surface)]/25 px-5 py-6 font-mono text-left relative overflow-hidden">
                    {/* Visual active radar background overlay */}
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.03] text-[var(--accent)] border-b border-l border-dashed border-current rounded-bl-full" />

                    <div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] border-b border-[var(--border)] pb-3 mb-4 justify-between">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span className="text-[10px] font-bold tracking-wider">TELEMETRY_LOG</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[var(--bg-card)]/50 p-2.5 rounded-xl border border-[var(--border)]/60">
                          <div className="text-[7px] text-[var(--text-muted)] tracking-wider">INSPECTING_NODE</div>
                          <div className="text-xs font-bold text-[var(--text-primary)] mt-1 flex items-center justify-between">
                            <span>{activeNode.label}</span>
                            <span className="text-[8px] font-bold bg-[var(--accent-subtle)] text-[var(--accent)] px-1.5 py-0.5 rounded-md border border-[var(--accent)]/10">{activeNode.trust}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] block">AVG_LATENCY</span>
                            <span className="font-bold text-[var(--text-primary)]">{nodeStats.latency}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] block">HIT_FREQUENCY</span>
                            <span className="font-bold text-[var(--text-primary)]">{nodeStats.invocations}</span>
                          </div>
                        </div>

                        <div className="border-t border-[var(--border)]/60 pt-3 text-[10px] space-y-2.5">
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] block">INCOMING_FLOW</span>
                            <span className="text-[9.5px] text-[var(--text-secondary)] truncate block">{activeNode.incoming}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] block">OUTGOING_TARGET</span>
                            <span className="text-[9.5px] text-[var(--text-secondary)] truncate block">{activeNode.outgoing}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] block">FILE_PATH_BOUNDS</span>
                            <span className="text-[9.5px]/none text-indigo-400 font-semibold truncate block">{nodeStats.codeRef}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[var(--border)]/60 pt-3 flex items-center justify-between text-[8px] text-[var(--text-muted)]">
                      <div className="flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5 text-[var(--accent)] animate-pulse" />
                        <span>STATE_ID: {nodeStats.activeRevision}</span>
                      </div>
                      <span className="text-[9.5px] text-emerald-500 font-bold uppercase">{activeNode.level}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: CONFIDENCE HEALTH MAP */}
              {activeTab === "health" && (
                <motion.div
                  key="health"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col justify-between"
                >
                  <div className="mb-6 flex flex-wrap gap-4 items-center justify-between pointer-events-none border-b border-[var(--border)]/60 pb-3">
                    <div className="text-xs font-sans text-[var(--text-secondary)] text-left">
                      <span className="text-[var(--accent)] font-bold">Confidence Engine:</span> Every schema and endpoint tracks logic integrity. Out of sync files highlight automatically.
                    </div>
                    {/* Color legends */}
                    <div className="flex gap-4 font-mono text-[9px] tracking-wider uppercase">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-500">
                        <span className="w-2 h-2 rounded bg-emerald-500" />
                        <span>Confirmed</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-amber-500">
                        <span className="w-2 h-2 rounded bg-amber-500" />
                        <span>Suggested</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-rose-500">
                        <span className="w-2 h-2 rounded bg-rose-500" />
                        <span>Diverged</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {healthTiles.map((tile, idx) => (
                      <motion.div
                        key={tile.name}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border)]/70 hover:border-[var(--border-hover)] p-4 rounded-xl flex flex-col justify-between min-h-[96px] transition-all duration-300 hover:shadow-md cursor-pointer group"
                      >
                        <div className="text-left">
                          <p className={`text-[9px] font-mono tracking-wider uppercase font-bold ${tile.textColor}`}>
                            {tile.trust}
                          </p>
                          <h4 className="text-xs sm:text-sm font-sans font-bold text-[var(--text-primary)] mt-1.5 group-hover:text-[var(--accent)] transition-colors">
                            {tile.name}
                          </h4>
                        </div>
                        <div className={`flex justify-end pt-2 ${tile.textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
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
