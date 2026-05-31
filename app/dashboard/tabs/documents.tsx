"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RefreshCw,
  Users,
  Bot,
  Globe,
  Copy,
  Check,
  Zap,
} from "lucide-react";

const DOC_INSIDER = `# Momentum — Insider Documentation

## Project Vision

Momentum is a living knowledge and documentation platform for software projects. It sits between the human with an idea and the AI tools that build it. The core problem: AI builders like Claude Code and Codex lack deep, structured understanding of the project they are working on. Momentum fixes this by maintaining a rich, structured knowledge base that is always up to date.

## Organization

**Mission**: Give every software team an always-current intelligence layer that makes every AI interaction smarter.

**Target audience**: Solo founders and small teams building software products with AI tools. Technically comfortable but not necessarily full-stack engineers.

**Stage**: Pre-seed. Building the core product.

## Modules

### Knowledge Graph Engine
The core of the platform. Stores all knowledge as a graph of typed nodes (Module, Feature, Decision, Constraint, Entity) connected by typed edges (belongs_to, depends_on, governs, constrained_by, uses, conflicts_with). Every node lives inside a section of the mind map schema.

**Why a graph instead of a flat document**: Relationships between concepts are as important as the concepts themselves. A decision governs multiple features. A constraint blocks certain features. A flat document cannot represent this structure.

### Extraction Engine
Conducts dynamic extraction interviews. Questions are generated one at a time based on what is still missing from the graph and what the user just said — not a fixed script. Includes saturation detection, quality gates, and multi-session continuity.

**Key decision**: Dynamic question generation over fixed scripts. Fixed scripts produce shallow answers because they cannot adapt to what the user already said.

### Document Engine
Renders three document types from the knowledge graph on demand. Documents are never stored — they are generated fresh each time. This guarantees consistency: the document always reflects the current graph.

### Auth & Teams
Role-based access control: Owner, Admin, Editor, Viewer. All edits go through agent validation regardless of role.

## Architectural Decisions

- **PostgreSQL + pgvector**: Graph nodes, embeddings, and relational data in one store. Avoids a separate vector database.
- **Claude API for all agents**: Best long-context reasoning for extraction interviews and document generation.
- **No document storage**: Documents rendered on demand from graph. Graph is always source of truth.
- **Cloudflare Pages + D1**: Chosen for deployment simplicity and edge performance.

## Constraints

- Documents and knowledge graph must always be consistent. No edit is committed without passing agent validation.
- The hard floor of required mind map sections must be met before document generation.
- Generated prompts must never include the full knowledge graph — only top-N relevant nodes.

## Open Questions

- Git integration timeline (GitHub webhook vs manual trigger)
- Realtime collaboration layer (Pusher vs Ably vs custom WebSocket)
- Pricing model (per-seat vs usage-based vs project-based)
`;

const DOC_AI = `# Momentum — AI Builder Context

## What This Project Is

A knowledge graph platform for software projects. NOT a coding tool. Generates structured documentation and AI prompts from a knowledge graph. Think of it as the intelligence layer between a human with an idea and the AI tools that build it.

## Stack

- Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS, motion/react
- Auth: better-auth + Cloudflare D1
- Deployment: Cloudflare Pages (OpenNext adapter)
- DB target: PostgreSQL + pgvector (not yet connected)
- AI: Claude API (not yet integrated)

## Non-Obvious Decisions

**No SSR on dashboard**: Dashboard uses dynamic import with ssr:false. Session check runs client-side via better-auth useSession hook. Redirect to /sign-in if no session.

**OpenNext deploy flow**: \`npm run deploy\` runs \`opennextjs-cloudflare build\` then \`node scripts/deploy-pages.js\`. Do NOT run just \`next build\` — it skips the Cloudflare bundle step.

**CSS variables only**: All colors use CSS variables defined in globals.css (:root). Never use hardcoded Tailwind color classes. Design system: --bg, --bg-surface, --bg-card, --border, --border-hover, --text-primary, --text-secondary, --text-muted, --accent, --accent-hover, --accent-glow, --accent-subtle.

**Tab architecture**: Dashboard tabs are separate files in app/dashboard/tabs/. The shell (_client.tsx) imports and routes to them. Each tab is self-contained.

## File Structure (relevant parts)

\`\`\`
app/
  dashboard/
    page.tsx          — SSR wrapper (dynamic import, ssr:false)
    _client.tsx       — Shell: auth, sidebar, tab routing
    tabs/
      overview.tsx    — Overview tab (inline data)
      projects.tsx    — Projects tab
      graph.tsx       — Knowledge graph visualization (SVG)
      schema.tsx      — Mind map schema explorer
      documents.tsx   — Document viewer (this file)
      keys.tsx        — Context keys (placeholder)
      settings.tsx    — Settings (placeholder)
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
lib/
  auth.ts             — better-auth server config (D1)
  auth-client.ts      — better-auth client (createAuthClient)
app/api/auth/[...all]/route.ts
\`\`\`

## Constraints

- All tab files must have "use client" directive
- lib/auth-client.ts must use createAuthClient from better-auth/react — never replace with localStorage mock
- Deploy always via npm run deploy, never node scripts/deploy-pages.js alone
`;

const DOC_PUBLIC = `# Momentum

Momentum is a knowledge and documentation platform for software teams building with AI.

## What it does

When you use AI tools like Claude Code or Cursor to build software, those tools only see what you show them. They don't know your architecture decisions, your constraints, or why you built things the way you did. Every conversation starts from scratch.

Momentum maintains a structured knowledge base about your project — and uses it to make every AI interaction smarter.

## How it works

1. **Tell Momentum about your project** — through a conversation, not a form. Momentum asks targeted questions and builds a structured knowledge base from your answers.

2. **Get documentation** — Momentum generates three types of documents from your knowledge base: one for your team, one optimized for AI builders, and one for the public.

3. **Plan new features** — describe what you want to build. Momentum checks it against your existing architecture, flags conflicts, and generates a precise prompt for your AI builder of choice.

4. **Stay in sync** — as your project evolves, Momentum keeps the knowledge base updated.

## Who it's for

Founders and small teams who are building software products with AI tools and want those tools to actually understand their project.

## What Momentum is not

- Not a coding tool — it doesn't write or run code
- Not a project manager — no tasks, sprints, or timelines
- Not a Git client — it reads commits but doesn't replace GitHub

---

*Built for the AI-native builder.*
`;

type DocType = "insider" | "ai" | "public";

const DOC_MAP: Record<DocType, string> = {
  insider: DOC_INSIDER,
  ai: DOC_AI,
  public: DOC_PUBLIC,
};

function parseInline(text: string): React.ReactNode {
  const boldParts = text.split("**");
  const elements: React.ReactNode[] = [];

  boldParts.forEach((part, index) => {
    const isBold = index % 2 === 1;
    const codeParts = part.split("`");
    
    const subElements = codeParts.map((subPart, subIndex) => {
      const isCode = subIndex % 2 === 1;
      if (isCode) {
        return (
          <span
            key={`code-${index}-${subIndex}`}
            className="font-mono text-xs bg-[var(--bg-surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--accent)]"
          >
            {subPart}
          </span>
        );
      }
      return subPart;
    });

    if (isBold) {
      elements.push(
        <span key={`bold-${index}`} className="font-semibold text-[var(--text-primary)]">
          {subElements}
        </span>
      );
    } else {
      elements.push(...subElements);
    }
  });

  return <>{elements}</>;
}

function renderContent(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div
            key={`code-block-${i}`}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 font-mono text-xs text-[var(--text-secondary)] my-4 whitespace-pre overflow-x-auto"
          >
            {codeLines.join("\n")}
          </div>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={`spacer-${i}`} className="h-2" />);
      continue;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-bold text-[var(--text-primary)] mt-6 mb-3 font-sans tracking-tight">
          {parseInline(trimmed.substring(2))}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-[var(--text-primary)] mt-5 mb-2.5 font-sans border-b border-[var(--border)] pb-2 tracking-tight">
          {parseInline(trimmed.substring(3))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-semibold text-[var(--text-secondary)] mt-4 mb-2 font-sans tracking-tight">
          {parseInline(trimmed.substring(4))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      elements.push(
        <div key={`list-${i}`} className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed pl-4 flex items-start gap-1.5 my-1.5">
          <span className="text-[var(--text-muted)] mt-[2px] select-none">–</span>
          <span className="flex-1">{parseInline(trimmed.substring(2))}</span>
        </div>
      );
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed my-2">
        {parseInline(line)}
      </p>
    );
  }

  return elements;
}

export default function DocumentsTab() {
  const [activeDoc, setActiveDoc] = useState<DocType>("insider");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeContent = DOC_MAP[activeDoc];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1800);
  };

  const activeDetails = {
    insider: {
      icon: Users,
      iconColor: "text-emerald-400",
      label: "Insider Documentation",
      subtitle: "For the team",
    },
    ai: {
      icon: Bot,
      iconColor: "text-[var(--accent)]",
      label: "AI Builder Context",
      subtitle: "For AI builders",
    },
    public: {
      icon: Globe,
      iconColor: "text-[#a78bfa]",
      label: "Public Documentation",
      subtitle: "For everyone",
    },
  }[activeDoc];

  const ActiveIcon = activeDetails.icon;

  const SELECTORS = [
    {
      id: "insider" as DocType,
      label: "Insider",
      subtitle: "For the team",
      badge: "Full",
      badgeColor: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20",
      icon: Users,
      iconColor: "text-emerald-400",
    },
    {
      id: "ai" as DocType,
      label: "AI Doc",
      subtitle: "For AI builders",
      badge: "Terse",
      badgeColor: "text-[var(--accent)] bg-[var(--accent)]/[0.08] border-[var(--accent)]/20",
      icon: Bot,
      iconColor: "text-[var(--accent)]",
    },
    {
      id: "public" as DocType,
      label: "Public",
      subtitle: "For everyone",
      badge: "Plain",
      badgeColor: "text-[#a78bfa] bg-[#a78bfa]/[0.08] border-[#a78bfa]/20",
      icon: Globe,
      iconColor: "text-[#a78bfa]",
    },
  ];

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
    <div className="w-full flex flex-col min-h-screen bg-[var(--bg)] font-sans" id="documents-root">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pt-8 pb-5" id="documents-header">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] px-2.5 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] font-bold inline-block">
            Documents
          </span>
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] mt-3 tracking-tight" id="documents-page-title">
            Project Documents
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
            Three views of the same knowledge. Always consistent, always generated from the graph.
          </p>
        </div>

        <div className="text-right flex flex-col items-end shrink-0" id="documents-header-controls">
          <span className="font-mono text-[10px] text-[var(--text-muted)] mb-2 block">
            Last generated: Generated just now
          </span>
          <motion.button
            onClick={handleRegenerate}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] cursor-pointer select-none transition-colors border-none disabled:opacity-50"
            id="regenerate-all-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? "Generating..." : "Regenerate All"}</span>
          </motion.button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 px-4 md:px-8 pb-8" id="documents-body-container">
        
        {/* LEFT PANEL */}
        <div className="w-full md:w-52 shrink-0 flex flex-col gap-4" id="documents-left-panel">
          
          {/* Doc type selector */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-3 flex flex-col gap-1" id="doc-type-selector-card">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold px-2 pb-2 pt-1">
              Document Type
            </div>
            {SELECTORS.map((item, index) => {
              const isActive = activeDoc === item.id;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  onClick={() => !isGenerating && setActiveDoc(item.id)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left w-full cursor-pointer select-none transition-all duration-200 border bg-transparent ${
                    isActive
                      ? "bg-[var(--accent)]/[0.08] border-[var(--accent)]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
                      : "hover:bg-[var(--bg-surface)] border-transparent"
                  }`}
                  id={`selector-btn-${item.id}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.iconColor}`} />
                  <div className="min-w-0 flex-1 leading-none text-left">
                    <span className={`text-sm font-semibold font-sans block ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] font-sans text-[var(--text-muted)] mt-1 block">
                      {item.subtitle}
                    </span>
                  </div>
                  <span className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border ml-auto self-start shrink-0 font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Completeness Card */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 * 0.06 }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4"
            id="completeness-card"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold mb-3">
              Knowledge completeness
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--text-primary)]" id="completeness-percentage">
              78%
            </div>
            <div className="text-[10px] font-sans text-[var(--text-muted)] mt-0.5">
              of required sections filled
            </div>

            <div className="w-full h-1.5 bg-[var(--bg-surface)] rounded-full mt-3 overflow-hidden">
              <div className="w-[78%] h-full bg-[var(--accent)] rounded-full" id="completeness-bar-fill" />
            </div>

            <div className="mt-3 flex flex-col gap-1.5" id="completeness-stats-list">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">14 confirmed nodes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">3 needs input</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full border border-[var(--text-muted)]/40 shrink-0" />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">2 empty sections</span>
              </div>
            </div>
          </motion.div>

          {/* Copy Prompt Card */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4 * 0.06 }}
            className="bg-[var(--accent)]/[0.04] border border-[var(--accent)]/10 rounded-2xl p-4 flex flex-col gap-1"
            id="copy-prompt-card"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--accent)] font-semibold">Prompt Context</span>
            </div>
            <p className="text-[11px] font-sans text-[var(--text-muted)] leading-relaxed mt-1">
              This document is used as context when generating prompts for your AI builder.
            </p>
          </motion.div>

        </div>

        {/* RIGHT PANEL: Document viewer */}
        <div className="flex-1 flex flex-col h-[520px] lg:h-[650px] min-w-0" id="documents-right-panel">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden h-full relative" id="document-viewer-card">
            
            {/* Viewer toolbar */}
            <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--bg-card)]/50 backdrop-blur-md" id="viewer-toolbar">
              <div className="flex items-center gap-3">
                <ActiveIcon className={`w-4 h-4 ${activeDetails.iconColor}`} />
                <div>
                  <span className="text-xs font-semibold font-sans text-[var(--text-primary)] block">
                    {activeDetails.label}
                  </span>
                  <span className="text-[9px] font-sans text-[var(--text-muted)] mt-0.5 block">
                    {activeDetails.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4" id="viewer-toolbar-actions">
                <span className="font-mono text-[10px] text-[var(--text-muted)] animate-fade-in" id="document-word-count">
                  {activeContent.trim().split(/\s+/).length} words
                </span>

                <button
                  onClick={handleCopy}
                  className="rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border)] px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer select-none"
                  id="copy-content-btn"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Display Area */}
            <div className="flex-1 overflow-y-auto px-8 py-6 relative select-text scroll-smooth" id="document-scroll-container">
              
              {/* Pulsing overlay on regeneration */}
              {isGenerating && (
                <div className="absolute inset-0 bg-[var(--bg-card)]/85 backdrop-blur-sm flex flex-col items-center justify-center z-10" id="regenerating-overlay">
                  <RefreshCw className="w-5 h-5 text-[var(--accent)] animate-spin mb-2" />
                  <span className="font-mono text-xs text-[var(--text-muted)]">Regenerating from graph...</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDoc}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-h-0 text-[var(--text-secondary)]"
                  id="document-text-content"
                >
                  {renderContent(activeContent)}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>

    </div>
    </div>
  );
}
