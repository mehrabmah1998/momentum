"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Orbit, ShieldCheck, CheckCircle2, 
  Database, Cpu, Terminal, Activity 
} from "lucide-react";

type ActiveView = "document" | "constellation" | "health";

interface NodeConnection {
  node: string;
  edge: "depends_on" | "constrained_by" | "governs";
}

interface ConstellationNode {
  id: string;
  label: string;
  tag: string;
  desc: string;
  trust: "Human-Confirmed" | "AI-Suggested" | "Code-Verified";
  status: "confirmed" | "needs-input";
  connections: NodeConnection[];
  x: number;
  y: number;
  icon: React.ComponentType<any>;
  textColor: string;
  borderColor: string;
  bgGlow: string;
}

const constellationNodes: ConstellationNode[] = [
  { 
    id: "auth", 
    label: "Auth & Teams", 
    tag: "MODULE",
    desc: "Core identity system managing multi-tenant organizational boundaries and workspace invitations.",
    trust: "Human-Confirmed", 
    status: "confirmed",
    connections: [
      { node: "User Profile", edge: "depends_on" },
      { node: "OAuth Login", edge: "governs" }
    ],
    x: 125, 
    y: 100, 
    icon: ShieldCheck, 
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30 group-hover:border-blue-500",
    bgGlow: "rgba(59, 130, 246, 0.08)"
  },
  { 
    id: "oauth_node", 
    label: "OAuth Login", 
    tag: "FEATURE",
    desc: "Provides seamless federated authentication using external OAuth credentials.",
    trust: "Code-Verified", 
    status: "confirmed",
    connections: [
      { node: "Auth & Teams", edge: "constrained_by" },
      { node: "JWT over Sessions", edge: "depends_on" }
    ],
    x: 235, 
    y: 285, 
    icon: FileText, 
    textColor: "text-indigo-400",
    borderColor: "border-indigo-500/30 group-hover:border-indigo-500",
    bgGlow: "rgba(99, 102, 241, 0.08)"
  },
  { 
    id: "queue", 
    label: "JWT over Sessions", 
    tag: "DECISION",
    desc: "Leverages lightweight cryptographic tokens to achieve stateless, low-latency validation.",
    trust: "Human-Confirmed", 
    status: "confirmed",
    connections: [
      { node: "Auth & Teams", edge: "depends_on" },
      { node: "Session Expiration", edge: "governs" }
    ],
    x: 455, 
    y: 100, 
    icon: Cpu, 
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30 group-hover:border-amber-500",
    bgGlow: "rgba(245, 158, 11, 0.08)"
  },
  { 
    id: "database", 
    label: "User Profile", 
    tag: "ENTITY",
    desc: "Represents verified system actors, their subscription status, and role metadata.",
    trust: "Human-Confirmed", 
    status: "confirmed",
    connections: [
      { node: "Auth & Teams", edge: "governs" }
    ],
    x: 475, 
    y: 300, 
    icon: Database, 
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30 group-hover:border-emerald-500",
    bgGlow: "rgba(16, 185, 129, 0.08)"
  },
  { 
    id: "session_expiry", 
    label: "Session Expiration", 
    tag: "CONSTRAINT",
    desc: "Mandates a strict 15-minute key lifetime to mitigate replay vulnerability vectors.",
    trust: "AI-Suggested", 
    status: "needs-input",
    connections: [
      { node: "JWT over Sessions", edge: "constrained_by" }
    ],
    x: 695, 
    y: 195, 
    icon: CheckCircle2, 
    textColor: "text-violet-400",
    borderColor: "border-violet-500/30 group-hover:border-violet-500",
    bgGlow: "rgba(139, 92, 246, 0.08)"
  }
];

const healthTiles = [
  { name: "Organization → Identity", trust: "Human-Confirmed", level: "high", textColor: "text-emerald-500" },
  { name: "Organization → Goals", trust: "Human-Confirmed", level: "high", textColor: "text-emerald-500" },
  { name: "Organization → Audience", trust: "Human-Confirmed", level: "high", textColor: "text-emerald-500" },
  { name: "Project → Vision", trust: "Code-Verified", level: "high", textColor: "text-emerald-500" },
  { name: "Project → Modules", trust: "Human-Confirmed", level: "high", textColor: "text-emerald-500" },
  { name: "Project → Constraints", trust: "AI-Suggested", level: "medium", textColor: "text-amber-500" },
  { name: "Project → Decisions", trust: "Code-Verified", level: "high", textColor: "text-emerald-500" },
  { name: "Project → Integrations", trust: "AI-Suggested", level: "medium", textColor: "text-amber-500" },
  { name: "Project → Edge Cases", trust: "Stale — needs re-confirmation", level: "low", textColor: "text-rose-500" }
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
            Say goodbye to flat README folders. Every module, decision, and constraint you&apos;ve confirmed — rendered as living documents, an explorable graph, and a confidence map you can trust at a glance.
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
              {activeTab === "document" && "MOMENTUM // WORKSPACE // LIVING_DOCUMENTS"}
              {activeTab === "constellation" && "MOMENTUM // WORKSPACE // KNOWLEDGE_GRAPH"}
              {activeTab === "health" && "MOMENTUM // WORKSPACE // CONFIDENCE_HEALTH_MAP"}
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
                    <div className="text-[var(--text-muted)] uppercase tracking-widest text-[8px] mb-3 font-semibold select-none">Living Document Chapters</div>
                    <div className="text-[var(--accent)] font-bold flex items-center gap-2 py-1.5 px-2.5 rounded bg-[var(--accent-subtle)] border-l-2 border-[var(--accent)]">
                      <FileText className="w-4 h-4 animate-pulse" />
                      <span>1. Identity & Auth Bounds</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1.5 px-2.5 hover:bg-[var(--bg-card)]/50 rounded cursor-pointer transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>2. Team Invitation Spec</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1.5 px-2.5 hover:bg-[var(--bg-card)]/50 rounded cursor-pointer transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>3. Session Security Config</span>
                    </div>
                    <div className="text-[var(--text-secondary)] flex items-center gap-2 py-1.5 px-2.5 hover:bg-[var(--bg-card)]/50 rounded cursor-pointer transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>4. Feature Integration Map</span>
                    </div>
                  </div>

                  {/* Render page views */}
                  <div className="md:col-span-2 bg-[var(--bg-surface)]/30 backdrop-blur-md border border-[var(--border)]/70 rounded-2xl p-6 font-mono text-xs text-[var(--text-secondary)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4 justify-between border-b border-[var(--border)] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1 px-2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] text-[9px] font-bold">active</span>
                          <span className="text-[var(--text-primary)] font-bold">Identity & Auth Bounds Spec</span>
                        </div>
                        <span className="text-[9px] text-[var(--text-muted)]">rev-a4.8</span>
                      </div>
                      
                      <div className="space-y-4 text-xs leading-relaxed">
                        <div>
                          <p className="text-[var(--text-primary)] font-bold mb-1">### 1.1 Multi-Tenant Isolation</p>
                          <p className="opacity-80">Our identity boundaries partition organizations cleanly. If workspace contexts shift, check user invitation mappings before session grant.</p>
                        </div>
                        <div>
                          <p className="text-[var(--text-primary)] font-bold mb-1">### 1.2 Access Validation</p>
                          <p className="opacity-80">Validate authorization tokens directly against organizational boundaries with a strict single-seat security sequence.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-[var(--border)] pt-4 flex justify-between items-center text-[9px] text-[var(--text-muted)] font-mono">
                      <span>Ref source: knowledge_graph_v1.2</span>
                      <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Compiled & Consistent
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
                      {/* Connection 1: Auth -> OAuth Node */}
                      <path d="M 125 100 Q 180 192 235 285" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 2: OAuth Node -> Database */}
                      <path d="M 235 285 Q 355 292 475 300" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 3: Auth -> Queue */}
                      <path d="M 125 100 Q 290 100 455 100" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 4: Queue -> Database */}
                      <path d="M 455 100 Q 465 200 475 300" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 5: Session Expiry -> Database */}
                      <path d="M 695 195 Q 585 247 475 300" stroke="url(#glow-grad)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      {/* Connection 6: Session Expiry -> Queue */}
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
                      Scale: Project knowledge mapping
                    </span>
                  </div>

                  {/* Right Column: Node Detail Panel */}
                  <div className="col-span-12 md:col-span-4 flex flex-col justify-between rounded-2xl border border-[var(--border)]/70 bg-[var(--bg-surface)]/25 px-5 py-6 font-mono text-left relative overflow-hidden">
                    {/* Visual active radar background overlay */}
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.03] text-[var(--accent)] border-b border-l border-dashed border-current rounded-bl-full" />

                    <div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] border-b border-[var(--border)] pb-3 mb-4 justify-between">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span className="text-[10px] font-bold tracking-wider">KNOWLEDGE_DETAIL</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[var(--bg-card)]/50 p-3 rounded-xl border border-[var(--border)]/60">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] text-[var(--text-muted)] tracking-wider">NODE_TYPE</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/10">{activeNode.tag}</span>
                          </div>
                          <h3 className="text-sm font-sans font-bold text-[var(--text-primary)] mt-1">
                            {activeNode.label}
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-[8px] text-[var(--text-muted)] block mb-1">DESCRIPTION</span>
                            <p className="text-[11px] font-sans text-[var(--text-secondary)] leading-relaxed">
                              {activeNode.desc}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-1">
                             <div>
                               <span className="text-[8px] text-[var(--text-muted)] block mb-1">CONFIDENCE</span>
                               <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10">
                                 {activeNode.trust}
                               </span>
                             </div>
                             <div>
                               <span className="text-[8px] text-[var(--text-muted)] block mb-1">STATUS</span>
                               <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                 activeNode.status === "confirmed" 
                                   ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" 
                                   : "bg-amber-500/10 text-amber-400 border-amber-500/10"
                               }`}>
                                 {activeNode.status}
                               </span>
                             </div>
                          </div>

                          {activeNode.connections && activeNode.connections.length > 0 && (
                            <div className="border-t border-[var(--border)]/60 pt-3">
                              <span className="text-[8px] text-[var(--text-muted)] block mb-2">CONNECTIONS & EDGES</span>
                              <div className="space-y-1.5">
                                {activeNode.connections.map((conn, cIdx) => (
                                  <div key={cIdx} className="flex items-center justify-between text-[9px] bg-[var(--bg-card)]/30 px-2 py-1 rounded border border-[var(--border)]/40">
                                    <span className="text-[var(--text-primary)] font-bold">{conn.node}</span>
                                    <span className="text-[8px] font-bold text-[var(--accent)] bg-[var(--accent-subtle)] px-1 py-0.2 rounded border border-[var(--accent)]/5 uppercase">
                                      {conn.edge}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[var(--border)]/60 pt-3 flex items-center justify-between text-[8px] text-[var(--text-muted)]">
                      <div className="flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5 text-[var(--accent)] animate-pulse" />
                        <span>MOMENTUM KNOWLEDGE HUB</span>
                      </div>
                      <span className="text-[9.5px] text-emerald-500 font-bold uppercase">{activeNode.status === "confirmed" ? "VERIFIED" : "PENDING REVIEW"}</span>
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
                      <span className="text-[var(--accent)] font-bold">Confidence Engine:</span> Every section of organizational and project knowledge tracks verified completeness and structural integrity.
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
                        <span>Stale</span>
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
