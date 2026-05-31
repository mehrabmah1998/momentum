"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Users,
  Bot,
  Globe,
  Copy,
  Check,
  Zap,
} from "lucide-react";

export interface ContextNode {
  id: string;
  type: "Decision" | "Constraint" | "Feature" | "Module" | "Entity";
  name: string;
  content: string;
}

export type KeyCategory = "architecture" | "product" | "people" | "custom";

export interface ContextKey {
  id: string;
  handle: string;
  label: string;
  description: string;
  category: KeyCategory;
  nodes: ContextNode[];
  usageCount: number;
  lastUsed: string;
  status: "active" | "draft";
}

const CONTEXT_KEYS: ContextKey[] = [
  {
    id: "core-stack",
    handle: "core-stack",
    label: "Core Stack",
    description: "Technology stack decisions and deployment conventions. Always include when generating implementation prompts.",
    category: "architecture",
    status: "active",
    usageCount: 23,
    lastUsed: "2h ago",
    nodes: [
      {
        id: "d1",
        type: "Decision",
        name: "Cloudflare Pages Deployment",
        content: "Deploy via opennextjs-cloudflare build then node scripts/deploy-pages.js. Never run next build alone — it skips the Cloudflare bundle step."
      },
      {
        id: "d2",
        type: "Decision",
        name: "CSS Variables System",
        content: "All colors use CSS variables defined in globals.css. Never use hardcoded Tailwind color classes. Design system enforced globally via :root variables."
      },
      {
        id: "d3",
        type: "Decision",
        name: "better-auth over Clerk",
        content: "better-auth with Cloudflare D1 adapter for auth. Avoids Clerk's per-seat pricing at early stage. Handles org/team/role out of the box."
      },
      {
        id: "d4",
        type: "Decision",
        name: "Next.js 15 App Router",
        content: "SSR for initial load and SEO on marketing pages. Dashboard uses dynamic import with ssr:false for Cloudflare compatibility."
      }
    ]
  },
  {
    id: "auth-rules",
    handle: "auth-rules",
    label: "Auth Rules",
    description: "Authentication approach, session handling, and access control constraints.",
    category: "architecture",
    status: "active",
    usageCount: 14,
    lastUsed: "5h ago",
    nodes: [
      {
        id: "d5",
        type: "Decision",
        name: "Client-side Auth Check",
        content: "Dashboard renders client-only. Auth check via useSession hook from better-auth/react. Redirect to /sign-in if no session."
      },
      {
        id: "c1",
        type: "Constraint",
        name: "No SSR on Dashboard",
        content: "Dashboard is dynamic-imported with ssr:false. This is a deliberate tradeoff for Cloudflare Pages compatibility."
      },
      {
        id: "c2",
        type: "Constraint",
        name: "Auth Client Import",
        content: "lib/auth-client.ts must use createAuthClient from better-auth/react. Never replace with localStorage mock or custom implementation."
      }
    ]
  },
  {
    id: "user-personas",
    handle: "user-personas",
    label: "User Personas",
    description: "Target user profiles that inform product decisions and document tone.",
    category: "people",
    status: "active",
    usageCount: 8,
    lastUsed: "yesterday",
    nodes: [
      {
        id: "e1",
        type: "Entity",
        name: "AI-Native Solo Founder",
        content: "Building software with AI tools. Technical enough to review architecture, not a full-time engineer. Pain: every AI session requires re-explaining the project. Wants AI that already knows their project."
      },
      {
        id: "e2",
        type: "Entity",
        name: "Small Technical Team",
        content: "2–5 person early-stage startup. Using AI tools to accelerate. Pain: each team member has different mental models. Wants shared context that AI tools can use directly."
      }
    ]
  },
  {
    id: "module-overview",
    handle: "module-overview",
    label: "Module Overview",
    description: "High-level responsibilities of each core module. Include when prompts affect cross-module behavior.",
    category: "architecture",
    status: "active",
    usageCount: 19,
    lastUsed: "1h ago",
    nodes: [
      {
        id: "m1",
        type: "Module",
        name: "Knowledge Graph Engine",
        content: "Stores all knowledge as typed nodes (Module, Feature, Decision, Constraint, Entity) connected by typed edges. PostgreSQL + pgvector for storage and semantic search."
      },
      {
        id: "m2",
        type: "Module",
        name: "Extraction Engine",
        content: "Dynamic interview that builds the knowledge graph. 8 question formats, 5-dimension quality gate, saturation detection. Not a fixed script — adapts to user responses."
      },
      {
        id: "m3",
        type: "Module",
        name: "Document Engine",
        content: "Renders three doc types (Insider, AI, Public) from the knowledge graph on demand. Documents never stored — always generated fresh. All edits pass through agent validation gate."
      }
    ]
  },
  {
    id: "active-constraints",
    handle: "active-constraints",
    label: "Active Constraints",
    description: "Hard invariants the platform must always respect. Include in any prompt that modifies core behavior.",
    category: "product",
    status: "active",
    usageCount: 31,
    lastUsed: "30m ago",
    nodes: [
      {
        id: "c3",
        type: "Constraint",
        name: "Document-Graph Consistency",
        content: "No document edit committed without passing agent validation gate. Document and knowledge graph must always be consistent. Non-negotiable."
      },
      {
        id: "c4",
        type: "Constraint",
        name: "Hard Floor Enforcement",
        content: "Required mind map sections must have passing-quality nodes before any document can be generated. Defined by required:true in mind map schema."
      },
      {
        id: "c5",
        type: "Constraint",
        name: "Prompt Context Limits",
        content: "Generated prompts must never include the full knowledge graph. Only top-N relevant nodes via pgvector similarity search."
      },
      {
        id: "c6",
        type: "Constraint",
        name: "Quality Gate Required",
        content: "All knowledge input must pass 5-dimension quality check (Specificity, Completeness, Rationale, Actionability, Consistency). Vague input re-asked, not stored."
      }
    ]
  },
  {
    id: "brand-voice",
    handle: "brand-voice",
    label: "Brand Voice",
    description: "Communication tone and principles for document generation. Draft — needs refinement.",
    category: "product",
    status: "draft",
    usageCount: 3,
    lastUsed: "3d ago",
    nodes: [
      {
        id: "d6",
        type: "Decision",
        name: "Precise and Honest Tone",
        content: "No false confidence. Gaps shown explicitly as open questions. Agent interrupts only for genuine conflicts. Never hide uncertainty behind vague language."
      },
      {
        id: "d7",
        type: "Decision",
        name: "Specificity Over Volume",
        content: "A knowledge base with 20 specific, confirmed nodes is worth more than 200 vague AI-generated nodes. Quality gates enforce this at every input point."
      }
    ]
  }
];

const CATEGORIES: { label: string; value: KeyCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Architecture", value: "architecture" },
  { label: "Product", value: "product" },
  { label: "People", value: "people" }
];

const getCategoryBadgeStyle = (category: KeyCategory) => {
  switch (category) {
    case "architecture":
      return "text-blue-400 bg-blue-500/[0.08] border-blue-500/20";
    case "product":
      return "text-[#a78bfa] bg-[#a78bfa]/[0.08] border-[#a78bfa]/20";
    case "people":
      return "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20";
    case "custom":
    default:
      return "text-amber-400 bg-amber-500/[0.08] border-amber-500/20";
  }
};

const getNodeTypeBadgeStyle = (type: string) => {
  switch (type) {
    case "Decision":
      return "text-[var(--accent)] bg-[var(--accent)]/[0.08] border-[var(--accent)]/20";
    case "Constraint":
      return "text-amber-400 bg-amber-500/[0.08] border-amber-500/20";
    case "Feature":
      return "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20";
    case "Module":
      return "text-[#a78bfa] bg-[#a78bfa]/[0.08] border-[#a78bfa]/20";
    case "Entity":
    default:
      return "text-[var(--text-muted)] bg-[var(--bg-surface)] border-[var(--border)]";
  }
};

export default function KeysTab() {
  const [selectedKeyId, setSelectedKeyId] = useState<string>("core-stack");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<KeyCategory | "all">("all");
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [copiedBundle, setCopiedBundle] = useState(false);

  const selectedKey = useMemo(() => {
    return CONTEXT_KEYS.find((k) => k.id === selectedKeyId) || CONTEXT_KEYS[0];
  }, [selectedKeyId]);

  const filteredKeys = useMemo(() => {
    return CONTEXT_KEYS.filter((key) => {
      const matchesSearch =
        key.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || key.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleCopyHandle = async (handle: string) => {
    try {
      await navigator.clipboard.writeText(`@${handle}`);
      setCopiedHandle(true);
      setTimeout(() => setCopiedHandle(false), 2000);
    } catch (err) {
      console.error("Failed to copy handle:", err);
    }
  };

  const handleCopyBundle = async (key: ContextKey) => {
    const formatted = `## @${key.handle} — ${key.label}\n\n${key.nodes
      .map((node) => `**[${node.type}] ${node.name}**: ${node.content}`)
      .join("\n\n")}`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedBundle(true);
      setTimeout(() => setCopiedBundle(false), 2000);
    } catch (err) {
      console.error("Failed to copy bundle:", err);
    }
  };

  return (
    <div style={{
      '--bg': '#090a0f',
      '--bg-surface': 'rgba(13, 14, 20, 0.45)',
      '--bg-card': 'rgba(20, 21, 28, 0.55)',
      '--border': 'rgba(255,255,255,0.06)',
      '--border-hover': 'rgba(255,255,255,0.12)',
      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255,255,255,0.6)',
      '--text-muted': 'rgba(255,255,255,0.3)',
      '--accent': '#2563EB',
      '--accent-hover': '#3B82F6',
      '--accent-glow': 'rgba(37,99,235,0.15)',
      '--accent-subtle': 'rgba(37,99,235,0.04)',
    } as React.CSSProperties}>
    <div className="w-full flex flex-col min-h-screen bg-[var(--bg)] font-sans" id="keys-tab-root">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pt-8 pb-5" id="keys-header">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] px-2.5 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] font-bold inline-block">
            Context Keys
          </span>
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] mt-3 tracking-tight" id="keys-page-title">
            Context Keys
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
            Named context bundles for AI prompt generation. Curate which knowledge nodes get included in prompts.
          </p>
        </div>

        <div className="shrink-0" id="keys-header-controls">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] cursor-not-allowed select-none transition-colors border-none opacity-80"
            id="new-key-disabled-btn"
          >
            <Plus className="w-4 h-4" />
            <span>New Key</span>
          </motion.button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 md:px-8 pb-8" id="keys-body-container">
        
        {/* LEFT PANEL */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3 lg:h-[700px]" id="keys-left-panel">
          
          {/* Search Box */}
          <div className="relative" id="keys-search-wrapper">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-xl pl-9 pr-3 py-2.5 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              id="keys-search-input"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5" id="keys-category-pills">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`border font-mono text-[10px] uppercase tracking-wider font-semibold rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[var(--accent)]/[0.08] border-[var(--accent)]/20 text-[var(--text-primary)]"
                      : "bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                  id={`pill-${cat.value}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Key List */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0 pr-1" id="keys-list-container">
            {filteredKeys.length > 0 ? (
              filteredKeys.map((item, index) => {
                const isSelected = selectedKeyId === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedKeyId(item.id)}
                    className={`bg-[var(--bg-card)] border rounded-2xl px-4 py-4 cursor-pointer select-none transition-all duration-200 ${
                      isSelected
                        ? "border-[var(--accent)]/30 bg-[var(--accent)]/[0.04] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
                        : "hover:border-[var(--border-hover)] border-[var(--border)]"
                    }`}
                    id={`key-card-${item.id}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-semibold text-[var(--text-primary)] tracking-tight">
                        @{item.handle}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                        <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                          {item.status}
                        </span>
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-[var(--text-secondary)] mb-2 tracking-tight">
                      {item.label}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]/50">
                      <span className={`font-mono text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold ${getCategoryBadgeStyle(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] font-medium">
                        {item.nodes.length} nodes · Used {item.usageCount}x
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 text-center select-none" id="keys-empty-list">
                <span className="font-mono text-xs text-[var(--text-muted)] block">No context keys found</span>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 h-[520px] lg:h-[700px]" id="keys-right-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedKey.id}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.25 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden h-full"
              id="selected-key-details"
            >
              
              {/* HEADER SECTION */}
              <div className="px-6 py-5 border-b border-[var(--border)] flex flex-col gap-2 shrink-0 bg-[var(--bg-card)]/50 backdrop-blur-md relative" id="details-header-block">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-[var(--text-primary)] tracking-tight">
                      @{selectedKey.handle}
                    </span>
                    <button
                      onClick={() => handleCopyHandle(selectedKey.handle)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded hover:bg-[var(--bg-surface)] border-none bg-transparent cursor-pointer"
                      title="Copy handle"
                      id="copy-handle-mini-btn"
                    >
                      {copiedHandle ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 animate-fade-in" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 animate-fade-in" />
                      )}
                    </button>
                  </div>

                  <span className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border font-bold ${
                    selectedKey.status === "active"
                      ? "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
                      : "text-amber-400 bg-amber-500/[0.08] border-amber-500/20 animate-pulse"
                  }`}>
                    {selectedKey.status}
                  </span>
                </div>

                <div className="text-sm font-semibold text-[var(--text-secondary)] tracking-tight">
                  {selectedKey.label}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mt-1 border-t border-[var(--border)]/30 pt-2 pb-0.5">
                  <span className={`font-mono text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold self-start ${getCategoryBadgeStyle(selectedKey.category)}`}>
                    {selectedKey.category}
                  </span>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed flex-1">
                    {selectedKey.description}
                  </p>
                </div>
              </div>

              {/* NODES SECTION */}
              <div className="flex-1 overflow-y-auto px-6 py-5 scroll-smooth" id="details-nodes-section">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold mb-4 block select-none">
                  INCLUDED NODES ({selectedKey.nodes.length})
                </div>

                <div className="flex flex-col gap-3" id="nodes-list-wrapper">
                  {selectedKey.nodes.map((node, nIdx) => {
                    return (
                      <motion.div
                        key={node.id}
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: nIdx * 0.03 }}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col"
                        id={`node-item-${node.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-mono text-[8px] uppercase px-2 py-0.5 rounded-full border font-bold tracking-wider ${getNodeTypeBadgeStyle(node.type)}`}>
                            {node.type}
                          </span>
                          <span className="font-mono text-[9.5px] text-[var(--text-muted)] select-none">
                            ID: {node.id}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight mb-1">
                          {node.name}
                        </h4>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {node.content}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER SECTION */}
              <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--bg-card)]/30 backdrop-blur-sm" id="details-footer-block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCopyBundle(selectedKey)}
                  className="rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 flex items-center gap-2 shadow-[0_4px_15px_-4px_var(--accent-glow)] select-none cursor-pointer border-none transition-colors"
                  id="copy-context-bundle-btn"
                >
                  {copiedBundle ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Context Bundle</span>
                    </>
                  )}
                </motion.button>

                <div className="font-mono text-[10px] text-[var(--text-muted)] text-right lg:block hidden select-none">
                  Used {selectedKey.usageCount} times · Last used: {selectedKey.lastUsed}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
    </div>
  );
}
