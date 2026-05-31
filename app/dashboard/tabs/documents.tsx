"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Building2,
  Layers,
  GitBranch,
  HelpCircle,
  RefreshCw,
  Loader2,
  Search,
  Eye,
  Edit3,
  Columns2,
  Copy,
  Check,
  ChevronRight
} from "lucide-react";

type DocType = "insider" | "ai" | "public";
type ViewMode = "preview" | "edit" | "split";

interface DocPage {
  id: string;
  title: string;
  content: Record<DocType, string>;
  wordCount: Record<DocType, number>;
  completeness: Record<DocType, number>;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  pages: DocPage[];
}

const SECTIONS: DocSection[] = [
  {
    id: "vision",
    title: "Project Vision",
    icon: Target,
    pages: [
      {
        id: "mission-purpose",
        title: "Mission & Purpose",
        content: {
          insider: "## Mission\n\nMomentum maintains a live, structured knowledge base of every project so AI tools always have the full context they need to build accurately.\n\n## Why This Exists\n\nEvery AI coding session starts with re-explaining the project. Momentum eliminates that.",
          ai: "## Mission\n\nMomentum is a knowledge graph platform that captures, structures, and serves project context to AI tools.",
          public: "## Mission\n\nMomentum helps technical teams build with AI more effectively by maintaining a single source of truth about their project."
        },
        wordCount: { insider: 42, ai: 24, public: 28 },
        completeness: { insider: 90, ai: 85, public: 80 }
      },
      {
        id: "goals-outcomes",
        title: "Goals & Outcomes",
        content: {
          insider: "## Primary Goal\n\nReduce time-to-context for every AI coding session from minutes to zero.\n\n## Success Metrics\n\n- AI prompts include correct context 95%+ of the time\n- Teams report fewer repeated questions from AI tools\n- Knowledge base stays current without manual maintenance",
          ai: "## Goals\n\n- Zero-latency context injection into AI prompts\n- Automated knowledge graph maintenance via git integration\n- Quality-validated knowledge nodes only",
          public: "## What Momentum Does\n\nMomentum keeps your project knowledge structured, current, and immediately available for AI tools."
        },
        wordCount: { insider: 55, ai: 35, public: 22 },
        completeness: { insider: 85, ai: 80, public: 75 }
      }
    ]
  },
  {
    id: "organization",
    title: "Organization",
    icon: Building2,
    pages: [
      {
        id: "identity-mission",
        title: "Identity & Mission",
        content: {
          insider: "## Organization\n\nBuildWithMomentum — Developer tools for AI-native founders.\n\n## Stage\n\nEarly-stage, solo founder, pre-revenue. Building with AI tools exclusively.",
          ai: "## Organization Profile\n\nDeveloper tools company. Serves technical founders and small engineering teams building software with AI assistance.",
          public: "## About\n\nWe build tools that make AI-assisted development faster and more reliable."
        },
        wordCount: { insider: 30, ai: 25, public: 18 },
        completeness: { insider: 95, ai: 90, public: 85 }
      },
      {
        id: "audience-positioning",
        title: "Audience & Positioning",
        content: {
          insider: "## Primary Persona\n\nAI-native solo founder. Technical enough to review architecture. Pain: every AI session requires re-explaining the project from scratch.\n\n## Secondary Persona\n\n2-5 person early-stage team. Using AI to accelerate. Pain: each member has a different mental model of the system.",
          ai: "## Target Users\n\n1. Solo technical founders using AI coding tools\n2. Small engineering teams (2-5) at early-stage startups\n\n## Core Pain Point\n\nAI tools lack persistent project context.",
          public: "## Who We Serve\n\nTechnical founders and small engineering teams who build software with AI tools and want better results."
        },
        wordCount: { insider: 65, ai: 40, public: 25 },
        completeness: { insider: 88, ai: 82, public: 78 }
      }
    ]
  },
  {
    id: "modules",
    title: "Modules",
    icon: Layers,
    pages: [
      {
        id: "knowledge-graph-engine",
        title: "Knowledge Graph Engine",
        content: {
          insider: "## Responsibility\n\nStores all knowledge as typed nodes connected by typed edges. PostgreSQL + pgvector for storage and semantic search.\n\n## Node Types\n\nModule, Feature, Decision, Constraint, Entity\n\n## Key Invariant\n\nNo document edit committed without passing agent validation gate.",
          ai: "## Knowledge Graph Engine\n\nTyped node/edge graph stored in PostgreSQL with pgvector. Node types: Module, Feature, Decision, Constraint, Entity. Semantic similarity search via embeddings.",
          public: "## Knowledge Graph\n\nAll project knowledge is stored as structured nodes in a graph database, making it searchable and contextually linkable."
        },
        wordCount: { insider: 58, ai: 32, public: 22 },
        completeness: { insider: 92, ai: 88, public: 75 }
      },
      {
        id: "extraction-engine",
        title: "Extraction Engine",
        content: {
          insider: "## Responsibility\n\nDynamic interview that builds the knowledge graph. 8 question formats, 5-dimension quality gate, saturation detection.\n\n## Quality Gate Dimensions\n\nSpecificity, Completeness, Rationale, Actionability, Consistency\n\n## Key Behavior\n\nNot a fixed script — adapts to user responses. Vague input is re-asked, not stored.",
          ai: "## Extraction Engine\n\nAdaptive interview system. 8 question formats. Quality gate with 5 dimensions. Saturation detection stops when graph is complete.",
          public: "## How Knowledge Is Captured\n\nMomentum uses an adaptive conversation to gather project knowledge, validating quality at every step."
        },
        wordCount: { insider: 62, ai: 28, public: 20 },
        completeness: { insider: 90, ai: 85, public: 70 }
      },
      {
        id: "document-engine",
        title: "Document Engine",
        content: {
          insider: "## Responsibility\n\nRenders three doc types (Insider, AI, Public) from the knowledge graph on demand. Documents never stored — always generated fresh.\n\n## Doc Types\n\n- Insider: Full context for the team\n- AI: Dense technical spec for AI tools\n- Public: Accessible summary for external stakeholders",
          ai: "## Document Engine\n\nGenerates three document types from knowledge graph nodes on demand. No persistent storage — always fresh. Types: Insider, AI, Public.",
          public: "## Documentation\n\nMomentum generates three types of documentation from your knowledge base, each tailored for a different audience."
        },
        wordCount: { insider: 68, ai: 30, public: 22 },
        completeness: { insider: 88, ai: 90, public: 80 }
      }
    ]
  },
  {
    id: "architecture",
    title: "Architecture",
    icon: GitBranch,
    pages: [
      {
        id: "tech-stack-decisions",
        title: "Tech Stack Decisions",
        content: {
          insider: "## Core Stack\n\n- Framework: Next.js 15 App Router\n- Auth: better-auth with Cloudflare D1 adapter\n- Deploy: Cloudflare Pages via opennextjs-cloudflare\n- DB: PostgreSQL + pgvector\n- Styling: Tailwind CSS + CSS variables\n\n## Key Decision\n\nAll colors use CSS variables defined in globals.css. Never hardcode Tailwind color classes.",
          ai: "## Stack\n\nNext.js 15, better-auth, Cloudflare Pages (opennextjs-cloudflare), PostgreSQL + pgvector, Tailwind CSS with CSS variable design system.",
          public: "## Built With\n\nMomentum is built on Next.js and deployed on Cloudflare's global network."
        },
        wordCount: { insider: 72, ai: 25, public: 15 },
        completeness: { insider: 95, ai: 90, public: 70 }
      },
      {
        id: "deployment-infra",
        title: "Deployment & Infra",
        content: {
          insider: "## Deployment\n\nCloudflare Pages via opennextjs-cloudflare build + node scripts/deploy-pages.js. Never run next build alone.\n\n## Auth\n\nDashboard is client-only, dynamic imported with ssr:false. Auth check via useSession hook.",
          ai: "## Deployment\n\nopennextjs-cloudflare build pipeline. Cloudflare Pages hosting. Dashboard: dynamic import ssr:false for Cloudflare compatibility.",
          public: "## Infrastructure\n\nDeployed globally on Cloudflare Pages for fast load times worldwide."
        },
        wordCount: { insider: 48, ai: 22, public: 15 },
        completeness: { insider: 88, ai: 85, public: 65 }
      }
    ]
  },
  {
    id: "open-questions",
    title: "Open Questions",
    icon: HelpCircle,
    pages: [
      {
        id: "integrations-roadmap",
        title: "Integrations Roadmap",
        content: {
          insider: "## Pending Decisions\n\n1. Realtime collaboration: Pusher vs Ably vs custom WebSocket\n2. Additional git providers: GitLab, Bitbucket\n3. IDE plugins: VS Code extension for inline context\n\n## Status\n\nNone of these are scheduled. Evaluating post-PMF.",
          ai: "## Open Integration Questions\n\n- Realtime: Pusher / Ably / WebSocket\n- Git: GitLab + Bitbucket support\n- IDE: VS Code extension",
          public: "## Coming Soon\n\nWe are evaluating integrations with additional developer tools."
        },
        wordCount: { insider: 52, ai: 20, public: 12 },
        completeness: { insider: 70, ai: 65, public: 60 }
      },
      {
        id: "pricing-business",
        title: "Pricing & Business",
        content: {
          insider: "## Current Thinking\n\nFreemium with Pro tier at $29/mo. Team plan at $99/mo for up to 10 members.\n\n## Open Questions\n\n- Where does the free tier cap? (nodes? calls? team size?)\n- Annual pricing discount?\n- Enterprise custom pricing?",
          ai: "## Pricing Model\n\nFreemium + Pro ($29/mo) + Team ($99/mo). Free tier limits TBD. Enterprise custom.",
          public: "## Pricing\n\nFree tier available. Pro plan for individuals. Team plan for collaborative projects. Details coming soon."
        },
        wordCount: { insider: 55, ai: 18, public: 20 },
        completeness: { insider: 65, ai: 60, public: 70 }
      }
    ]
  }
];

function parseInline(text: string): React.ReactNode {
  const boldParts = text.split("**");
  const firstPass: { text: string; isBold: boolean }[] = [];
  boldParts.forEach((part, index) => {
    firstPass.push({ text: part, isBold: index % 2 === 1 });
  });

  const secondPass: { text: string; isBold: boolean; isCode: boolean }[] = [];
  firstPass.forEach(item => {
    const codeParts = item.text.split("`");
    codeParts.forEach((part, index) => {
      secondPass.push({
        text: part,
        isBold: item.isBold,
        isCode: index % 2 === 1
      });
    });
  });

  const thirdPass: React.ReactNode[] = [];
  secondPass.forEach((item, index) => {
    if (item.isCode) {
      thirdPass.push(
        <span
          key={`code-${index}`}
          className="font-mono text-xs bg-[var(--bg-surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--accent)] font-semibold inline-block"
        >
          {item.text}
        </span>
      );
    } else {
      const italicParts = item.text.split("_");
      italicParts.forEach((part, subIndex) => {
        const isItalic = subIndex % 2 === 1;
        let content: React.ReactNode = part;
        if (item.isBold) {
          content = (
            <span key={`bold-${index}-${subIndex}`} className="font-semibold text-[var(--text-primary)]">
              {content}
            </span>
          );
        }
        if (isItalic) {
          thirdPass.push(
            <span key={`italic-${index}-${subIndex}`} className="italic text-[var(--text-secondary)]">
              {content}
            </span>
          );
        } else {
          thirdPass.push(content);
        }
      });
    }
  });

  return <>{thirdPass}</>;
}

function renderContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listKey = 0;
  let inList = false;
  let isNumbered = false;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumbered) {
        nodes.push(
          <ol key={`ol-${listKey++}`} className="list-decimal pl-5 my-3 space-y-1 text-sm text-[var(--text-secondary)]">
            {currentList}
          </ol>
        );
      } else {
        nodes.push(
          <ul key={`ul-${listKey++}`} className="list-disc pl-5 my-3 space-y-1 text-sm text-[var(--text-secondary)]">
            {currentList}
          </ul>
        );
      }
      currentList = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      nodes.push(<div key={`spacer-${i}`} className="h-2" />);
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushList();
      let codeText = "";
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeText += lines[i] + "\n";
        i++;
      }
      nodes.push(
        <pre key={`codeblock-${i}`} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 font-mono text-xs text-[var(--text-secondary)] my-4 whitespace-pre overflow-x-auto">
          <code>{codeText.trim()}</code>
        </pre>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      nodes.push(
        <h1 key={`h1-${i}`} className="text-xl font-bold text-[var(--text-primary)] mt-6 mb-3 font-sans tracking-tight">
          {parseInline(trimmed.substring(2))}
        </h1>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList();
      nodes.push(
        <h2 key={`h2-${i}`} className="text-base font-bold text-[var(--text-primary)] mt-5 mb-2.5 font-sans border-b border-[var(--border)] pb-2 tracking-tight">
          {parseInline(trimmed.substring(3))}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold text-[var(--text-secondary)] mt-4 mb-2 font-sans tracking-tight">
          {parseInline(trimmed.substring(4))}
        </h3>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (inList && isNumbered) {
        flushList();
      }
      inList = true;
      isNumbered = false;
      currentList.push(
        <li key={`li-${i}`} className="text-xs text-[var(--text-secondary)] leading-relaxed pl-1 py-0.5">
          {parseInline(trimmed.substring(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      if (match) {
        if (inList && !isNumbered) {
          flushList();
        }
        inList = true;
        isNumbered = true;
        currentList.push(
          <li key={`li-${i}`} className="text-xs text-[var(--text-secondary)] leading-relaxed pl-1 py-0.5">
            {parseInline(match[2])}
          </li>
        );
      }
    } else {
      flushList();
      nodes.push(
        <p key={`p-${i}`} className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed my-2">
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();
  return nodes;
}

export default function DocumentsTab() {
  const [activeDocType, setActiveDocType] = useState<DocType>("insider");
  const [selectedPageId, setSelectedPageId] = useState<string>("mission-purpose");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["vision", "modules"]));
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [editContent, setEditContent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // In-memory simulation of pages contents database edits
  const [pagesContent, setPagesContent] = useState<Record<string, Record<DocType, string>>>(() => {
    const contentMap: Record<string, Record<DocType, string>> = {};
    SECTIONS.forEach(sec => {
      sec.pages.forEach(pg => {
        contentMap[pg.id] = { ...pg.content };
      });
    });
    return contentMap;
  });

  // Calculate live word counts
  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  // Compute average completeness across all pages for each doc type
  const calculateCompleteness = (type: DocType) => {
    let sum = 0;
    let count = 0;
    SECTIONS.forEach(sec => {
      sec.pages.forEach(p => {
        sum += p.completeness[type];
        count++;
      });
    });
    return count > 0 ? Math.round(sum / count) : 0;
  };

  // useEffect 1: when selectedPageId or activeDocType changes, sync editContent to the page's current state
  useEffect(() => {
    const savedText = pagesContent[selectedPageId]?.[activeDocType] || "";
    const timer = setTimeout(() => {
      setEditContent(savedText);
      setHasUnsavedChanges(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedPageId, activeDocType, pagesContent]);

  // useEffect 2: when searchQuery changes, auto-expand sections that contain pages matching the query
  useEffect(() => {
    if (!searchQuery) return;
    const matchingSections: string[] = [];
    SECTIONS.forEach(section => {
      const hasMatch = section.pages.some(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (hasMatch) {
        matchingSections.push(section.id);
      }
    });

    if (matchingSections.length > 0) {
      const timer = setTimeout(() => {
        setExpandedSections(prev => {
          const next = new Set(prev);
          matchingSections.forEach(id => next.add(id));
          return next;
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Find active Page and Section details
  let activeSectionTitle = "";
  let activePageTitle = "";
  SECTIONS.forEach(sec => {
    const found = sec.pages.find(p => p.id === selectedPageId);
    if (found) {
      activeSectionTitle = sec.title;
      activePageTitle = found.title;
    }
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setPagesContent(prev => ({
        ...prev,
        [selectedPageId]: {
          ...prev[selectedPageId],
          [activeDocType]: editContent
        }
      }));
      setIsSaving(false);
      setHasUnsavedChanges(false);
    }, 1200);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] font-sans w-full text-[var(--text-primary)]" id="documents-tab-root">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pt-8 pb-4" id="documents-header">
        <div className="flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0 }}
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.08] inline-block w-fit"
          >
            Documents
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
            className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1"
          >
            Documents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="text-sm text-[var(--text-muted)] mt-1 font-medium"
          >
            GitBook-style knowledge documentation. Three doc types, always generated fresh.
          </motion.p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] hover:bg-[var(--border-hover)] text-[var(--text-secondary)] font-medium text-xs px-5 py-2.5 transition-all select-none hover:text-[var(--text-primary)] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
          <span>{isGenerating ? "Regenerating..." : "Regenerate All"}</span>
        </button>
      </div>

      {/* BODY */}
      <div className="flex flex-col lg:flex-row gap-0 px-8 pb-8 flex-1 min-h-0" id="documents-body">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[var(--border)] pb-6 lg:pb-0" id="documents-sidebar">
          
          {/* Doc Type Selector */}
          <div className="flex gap-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-1" id="doc-type-pills">
            {(["insider", "ai", "public"] as DocType[]).map((type) => {
              const isActive = activeDocType === type;
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveDocType(type)}
                  className={`text-xs font-mono uppercase tracking-wider px-3 py-1.5 cursor-pointer transition-all flex-1 text-center border-none rounded-lg focus:outline-none ${
                    isActive
                      ? "bg-[var(--bg-card)] border border-[var(--border)] shadow-sm text-[var(--text-primary)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-transparent"
                  }`}
                >
                  {type}
                </motion.button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full" id="search-container">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="bg-[var(--bg-card)] border border-[var(--border)] focus:border-[var(--accent)] text-xs rounded-xl pl-8 pr-3 py-2 transition-colors outline-none w-full placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
            />
          </div>

          {/* Tree Navigation */}
          <div className="flex-1 overflow-y-auto max-h-[350px] lg:max-h-full pr-1" id="tree-nav">
            <div className="flex flex-col gap-3">
              {SECTIONS.map((section) => {
                const isExpanded = expandedSections.has(section.id);
                const IconComponent = section.icon;

                // Segment pages matching the query
                const filteredPages = section.pages.filter(page =>
                  page.title.toLowerCase().includes(searchQuery.toLowerCase())
                );

                // Hide section if query is active but there are no matching pages
                if (searchQuery && filteredPages.length === 0) {
                  return null;
                }

                return (
                  <div key={section.id} className="flex flex-col gap-1">
                    {/* Section Header Row */}
                    <div
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[var(--bg-surface)]/20 cursor-pointer select-none"
                    >
                      <motion.span
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      </motion.span>
                      
                      <IconComponent className="w-3.5 h-3.5 text-[var(--accent)]" />
                      
                      <span className="text-xs font-semibold font-sans uppercase tracking-wider text-[var(--text-muted)] truncate">
                        {section.title}
                      </span>
                    </div>

                    {/* Pages list drawer */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? "auto" : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                      className="flex flex-col pl-4 gap-0.5"
                    >
                      {filteredPages.map((page) => {
                        const isActive = selectedPageId === page.id;
                        const isMatched = searchQuery && page.title.toLowerCase().includes(searchQuery.toLowerCase());
                        
                        return (
                          <motion.div
                            key={page.id}
                            whileHover={{ x: 2 }}
                            onClick={() => setSelectedPageId(page.id)}
                            className={`text-xs font-sans pl-6 py-1.5 cursor-pointer rounded-lg mx-1 transition-colors border ${
                              isActive
                                ? "bg-[var(--accent)]/[0.08] text-[var(--accent)] border-[var(--accent)]/20 font-semibold"
                                : isMatched
                                  ? "text-[var(--text-primary)] border-transparent bg-[var(--bg-surface)]/30"
                                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-surface)]/10"
                            }`}
                          >
                            {page.title}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completeness Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 shrink-0" id="completeness-panel">
            <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-2">
              COMPLETENESS
            </div>
            <div className="flex flex-col gap-2.5">
              {(["insider", "ai", "public"] as DocType[]).map((type) => {
                const completePct = calculateCompleteness(type);
                return (
                  <div key={type} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="capitalize text-[var(--text-muted)]">{type}</span>
                      <span className="text-[var(--text-primary)] font-bold">{completePct}%</span>
                    </div>
                    {/* Progress Bar container */}
                    <div className="h-1 bg-[var(--bg-surface)] rounded-full overflow-hidden w-full">
                      <div
                        style={{ width: `${completePct}%` }}
                        className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col min-w-0 pl-0 lg:pl-6 pt-6 lg:pt-0" id="documents-right-pane">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shrink-0" id="documents-toolbar">
            
            {/* Breadcrumb / Spec details */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--text-muted)] text-xs">{activeSectionTitle}</span>
                <span className="text-[var(--text-muted)] text-xs">/</span>
                <span className="text-[var(--text-secondary)] text-xs font-semibold">{activePageTitle}</span>
              </div>
              
              <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border ${
                activeDocType === "insider"
                  ? "text-[var(--accent)] bg-[var(--accent)]/[0.08] border-[var(--accent)]/20"
                  : activeDocType === "ai"
                    ? "text-[#a78bfa] bg-[#a78bfa]/[0.08] border-[#a78bfa]/20"
                    : "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
              }`}>
                {activeDocType}
              </span>

              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {getWordCount(editContent)} words
              </span>
            </div>

            {/* Actions group */}
            <div className="flex items-center gap-3 self-end sm:self-auto" id="toolbar-actions">
              
              {/* View Mode selection pills */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-0.5 flex" id="view-mode-pills">
                {(["preview", "edit", "split"] as ViewMode[]).map((mode) => {
                  const isActive = viewMode === mode;
                  const Icon = mode === "preview" ? Eye : mode === "edit" ? Edit3 : Columns2;
                  return (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-1.5 rounded transition-all cursor-pointer border-none focus:outline-none ${
                        isActive
                          ? "bg-[var(--bg-card)] border border-[var(--border)] shadow-sm text-[var(--text-primary)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-transparent"
                      }`}
                      title={`${mode} mode`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-hover)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer focus:outline-none"
                title="Copy contents"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Save button (edit/split modes only) */}
              {(viewMode === "edit" || viewMode === "split") && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[10px] font-semibold py-1.5 px-3 uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 select-none cursor-pointer border-none shadow-[0_4px_12px_-4px_var(--accent-glow)]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      {hasUnsavedChanges && <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />}
                      <span>Save</span>
                    </>
                  )}
                </button>
              )}

            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden h-full min-h-[400px]">
            
            {/* Shimmer overlay when regenerating/generating entire pages */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[var(--bg-card)]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                >
                  <RefreshCw className="w-6 h-6 text-[var(--accent)] animate-spin mb-2" />
                  <span className="font-mono text-xs text-[var(--text-muted)]">Regenerating document from knowledge base...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedPageId}-${activeDocType}-${viewMode}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                {viewMode === "preview" && (
                  <div className="h-full overflow-y-auto pr-1 select-text scroll-smooth text-[var(--text-secondary)]">
                    {renderContent(pagesContent[selectedPageId]?.[activeDocType] || "")}
                  </div>
                )}

                {viewMode === "edit" && (
                  <textarea
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full h-full bg-transparent border border-[var(--border)] focus:border-[var(--accent)] rounded-xl p-4 text-sm font-mono text-[var(--text-secondary)] leading-relaxed resize-none outline-none overflow-y-auto"
                  />
                )}

                {viewMode === "split" && (
                  <div className="flex flex-col md:flex-row gap-4 h-full">
                    <textarea
                      value={editContent}
                      onChange={(e) => {
                        setEditContent(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full md:w-1/2 h-1/2 md:h-full bg-transparent border border-[var(--border)] focus:border-[var(--accent)] rounded-xl p-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed resize-none outline-none overflow-y-auto"
                    />
                    <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto pr-1 border border-[var(--border)] rounded-xl p-4 select-text text-[var(--text-secondary)]">
                      {renderContent(editContent)}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>

    </div>
  );
}
