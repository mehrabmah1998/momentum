"use client";

import React, { useEffect, useState, useRef } from "react";
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
  ChevronRight,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Code,
  Terminal,
  List,
  ListOrdered,
  Quote,
  FileText,
  Sparkles,
  Save,
  CheckCircle2
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
          className="font-mono text-[11px] bg-[var(--bg-surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--accent)] font-semibold inline-block mx-0.5"
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
            <span key={`bold-${index}-${subIndex}`} className="font-bold text-[var(--text-primary)] tracking-tight">
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

// Inner helper copy block component for our elegant code sections
function CopyBlockButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors cursor-pointer border-none bg-transparent"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function renderContent(content: string, activeDocType: DocType): React.ReactNode {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listKey = 0;
  let inList = false;
  let isNumbered = false;

  // Determine doc theme colors inside render scope
  const themeColor =
    activeDocType === "insider"
      ? "#2563eb"
      : activeDocType === "ai"
      ? "#a78bfa"
      : "#10b981";

  const flushList = () => {
    if (currentList.length > 0) {
      nodes.push(
        <ul key={`list-${listKey++}`} className="my-4 pl-1 space-y-2">
          {currentList}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      nodes.push(<div key={`spacer-${i}`} className="h-3" />);
      continue;
    }

    // Blockquote handling (e.g. starting with >)
    if (trimmed.startsWith(">")) {
      flushList();
      nodes.push(
        <blockquote
          key={`quote-${i}`}
          className="my-5 border-l-4 pl-4 py-2.5 italic font-sans text-sm text-[var(--text-secondary)] bg-[var(--bg-card)]/35 border-l-[3px] rounded-r-xl"
          style={{ borderLeftColor: themeColor }}
        >
          {parseInline(trimmed.substring(1).trim())}
        </blockquote>
      );
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushList();
      let codeText = "";
      let lang = trimmed.substring(3).trim() || "markdown";
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeText += lines[i] + "\n";
        i++;
      }
      nodes.push(
        <div key={`codeblock-${i}`} className="group relative my-5 overflow-hidden rounded-xl border border-[var(--border)] bg-black/30 dark:bg-black/50 shadow-inner">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-black/20 text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
            <span>SYNTAX: {lang.toUpperCase()}</span>
            <CopyBlockButton text={codeText.trim()} />
          </div>
          <pre className="p-4 font-mono text-[11px] text-[var(--text-secondary)] leading-relaxed whitespace-pre overflow-x-auto">
            <code>{codeText.trim()}</code>
          </pre>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      nodes.push(
        <div key={`h1-${i}`} className="mt-8 mb-4 border-l-2 pl-3" style={{ borderColor: themeColor }}>
          <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-[var(--text-primary)] leading-snug">
            {parseInline(trimmed.substring(2))}
          </h1>
        </div>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList();
      nodes.push(
        <div key={`h2-${i}`} className="mt-7 mb-3 border-l pl-3 ml-1" style={{ borderColor: `${themeColor}60` }}>
          <h2 className="text-base md:text-lg font-bold font-sans tracking-tight text-[var(--text-primary)] leading-normal">
            {parseInline(trimmed.substring(3))}
          </h2>
        </div>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold tracking-tight text-[var(--text-secondary)] mt-5 mb-2 font-sans">
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
        <li key={`li-${i}`} className="text-sm text-[var(--text-secondary)] leading-relaxed pl-1 py-0.5 flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ backgroundColor: themeColor }} />
          <span className="flex-1">{parseInline(trimmed.substring(2))}</span>
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
          <li key={`li-${i}`} className="text-sm text-[var(--text-secondary)] leading-relaxed pl-1 py-0.5 flex items-start gap-2.5">
            <span className="font-mono text-xs font-semibold min-w-[18px] text-right mt-0.5" style={{ color: themeColor }}>
              {match[1]}.
            </span>
            <span className="flex-1">{parseInline(match[2])}</span>
          </li>
        );
      }
    } else {
      flushList();
      nodes.push(
        <p key={`p-${i}`} className="text-sm text-[var(--text-secondary)] [html.light_&]:text-slate-700 font-sans leading-relaxed my-2 max-w-[70ch]">
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();
  return nodes;
}

export default function DocumentsTab({
  setIsSidebarCollapsed,
}: {
  setIsSidebarCollapsed?: (collapsed: boolean) => void;
} = {}) {
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Collapse sidebar when entering split mode
  useEffect(() => {
    if (viewMode === "split" && setIsSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  }, [viewMode, setIsSidebarCollapsed]);

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

  // Core Markdown helper click handler inserting text at selection
  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    if (syntax === "bold") {
      replacement = `**${selectedText || placeholder || "bold text"}**`;
    } else if (syntax === "italic") {
      replacement = `_${selectedText || placeholder || "italic text"}_`;
    } else if (syntax === "h1") {
      replacement = `\n# ${selectedText || placeholder || "Heading 1"}\n`;
    } else if (syntax === "h2") {
      replacement = `\n## ${selectedText || placeholder || "Heading 2"}\n`;
    } else if (syntax === "code") {
      replacement = `\`${selectedText || placeholder || "code"}\``;
    } else if (syntax === "codeblock") {
      replacement = `\n\`\`\`javascript\n${selectedText || placeholder || "// code goes here"}\n\`\`\`\n`;
    } else if (syntax === "list") {
      replacement = `\n- ${selectedText || placeholder || "list item"}\n`;
    } else if (syntax === "numlist") {
      replacement = `\n1. ${selectedText || placeholder || "list item"}\n`;
    } else if (syntax === "quote") {
      replacement = `\n> ${selectedText || placeholder || "blockquote"}\n`;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setEditContent(newValue);
    setHasUnsavedChanges(true);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Compute theme color variables inside react tree scope
  const themeColor =
    activeDocType === "insider"
      ? "#2563eb"
      : activeDocType === "ai"
      ? "#8b5cf6"
      : "#10b981";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] font-sans w-full text-[var(--text-primary)]" id="documents-tab-root">
      
      {/* BODY */}
      <div className="flex flex-col lg:flex-row gap-6 px-8 py-8 flex-1 min-h-0" id="documents-body">
        
        {/* LEFT SIDEBAR: Standard Doppelrand structure nested perfectly */}
        {viewMode !== "split" && (
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4" id="documents-sidebar">
          
          <div className="bg-[var(--bg-surface)] p-[6px] border border-[var(--border)] rounded-[20px] shadow-sm flex flex-col gap-3">
            
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 flex flex-col gap-4">
              
              {/* Doc Type Selector */}
              <div className="flex gap-1 bg-black/10 dark:bg-black/20 border border-[var(--border)] rounded-xl p-1" id="doc-type-pills">
                {(["insider", "ai", "public"] as DocType[]).map((type) => {
                  const isActive = activeDocType === type;
                  const itemColor = type === "insider" ? "#2563eb" : type === "ai" ? "#8b5cf6" : "#10b981";
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveDocType(type)}
                      className={`text-[10px] font-mono uppercase tracking-wider py-1.5 cursor-pointer transition-all flex-1 text-center border-none rounded-lg focus:outline-none font-bold ${
                        isActive
                          ? "bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm text-white"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-transparent"
                      }`}
                      style={isActive ? { border: `1px solid ${itemColor}25`, color: itemColor } : {}}
                    >
                      {type}
                    </motion.button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full" id="search-container">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search document pages..."
                  className="bg-black/15 dark:bg-black/25 border border-[var(--border)] focus:border-[var(--accent)] text-xs rounded-xl pl-8 pr-3 py-2 transition-colors outline-none w-full placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                />
              </div>

              {/* Hierarchy Tree Navigator (The Relation Folder Representation) */}
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[300px] lg:max-h-full pr-1 font-sans" id="tree-nav">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-2 block font-bold">
                  PROJECT RELATIONS
                </span>
                <div className="flex flex-col gap-2">
                  {SECTIONS.map((section) => {
                    const isExpanded = expandedSections.has(section.id);
                    const IconComponent = section.icon as any;

                    const filteredPages = section.pages.filter(page =>
                      page.title.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (searchQuery && filteredPages.length === 0) {
                      return null;
                    }

                    return (
                      <div key={section.id} className="flex flex-col gap-1">
                        {/* Folder Section Line Row */}
                        <div
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-[var(--bg-surface)]/20 cursor-pointer select-none transition-colors border border-transparent hover:border-[var(--border)] group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <motion.span
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-center shrink-0"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            </motion.span>
                            <IconComponent className="w-3.5 h-3.5 transition-colors duration-200 shrink-0" style={{ color: themeColor }} />
                            <span className="text-xs font-bold font-sans tracking-wide text-[var(--text-primary)] truncate">
                              {section.title}
                            </span>
                          </div>
                          
                          <span className="text-[9px] font-mono opacity-60 text-[var(--text-muted)] border border-[var(--border)] px-1.5 py-0.5 rounded-full bg-black/5">
                            {filteredPages.length}
                          </span>
                        </div>

                        {/* Stagger Drawer pages */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isExpanded ? "auto" : 0,
                            opacity: isExpanded ? 1 : 0
                          }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                          className="flex flex-col pl-4 mt-0.5 relative pt-1 pb-2 ml-2.5"
                        >
                          {/* Vertical directory nesting branch hairline */}
                          <div className="absolute left-[3px] top-0 bottom-4 w-[1px] bg-gradient-to-b from-[var(--border)] to-[var(--border)]/15 pointer-events-none" />

                          {filteredPages.map((page) => {
                            const isActive = selectedPageId === page.id;
                            const isMatched = searchQuery && page.title.toLowerCase().includes(searchQuery.toLowerCase());
                            return (
                              <motion.div
                                key={page.id}
                                whileHover={{ x: 2 }}
                                onClick={() => setSelectedPageId(page.id)}
                                className={`group text-xs font-sans pl-1.5 pr-2.5 py-1.5 cursor-pointer rounded-lg mx-1 transition-all border flex items-center justify-between select-none relative ${
                                  isActive
                                    ? "bg-[var(--accent)]/[0.08] text-[var(--accent)] border-[var(--accent)]/30 font-semibold shadow-sm"
                                    : isMatched
                                      ? "text-[var(--text-primary)] border-transparent bg-[var(--bg-surface)]/30 font-medium"
                                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-surface)]/10"
                                }`}
                                style={isActive ? { color: themeColor, borderColor: `${themeColor}25`, backgroundColor: `${themeColor}08` } : {}}
                              >
                                <div className="flex items-center gap-1.5 min-w-0 flex-1 z-10">
                                  {/* Horizontal elbow/branch connection segment line */}
                                  <span className={`w-2.5 h-[1.5px] shrink-0 opacity-40 transition-all group-hover:opacity-100 ${
                                    isActive ? "bg-[var(--accent)] opacity-80" : "bg-[var(--border)]"
                                  }`} style={isActive ? { backgroundColor: themeColor } : {}} />
                                  <span className="truncate">{page.title}</span>
                                </div>

                                {/* Mini Completeness ring/tag indicator */}
                                <span className={`text-[9px] font-mono scale-[0.85] px-1.5 py-0.5 rounded shrink-0 z-10 ${
                                  page.completeness[activeDocType] >= 90
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : page.completeness[activeDocType] >= 75
                                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/25"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                                }`}>
                                  {page.completeness[activeDocType]}%
                                </span>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Section Progress Indicators inside sidebar */}
              <div className="border-t border-[var(--border)] pt-4 mt-1" id="completeness-panel">
                <div className="font-mono text-[9px] tracking-widest text-[var(--text-muted)] mb-3 uppercase font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>SECTION COMPLETENESS</span>
                </div>
                <div className="flex flex-col gap-3">
                  {(["insider", "ai", "public"] as DocType[]).map((type) => {
                    const completePct = calculateCompleteness(type);
                    const pillColor = type === "insider" ? "#2563eb" : type === "ai" ? "#8b5cf6" : "#10b981";
                    return (
                      <div key={type} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="capitalize text-[var(--text-secondary)] font-bold">{type} spec</span>
                          <span className="font-bold" style={{ color: pillColor }}>{completePct}%</span>
                        </div>
                        {/* Bar */}
                        <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden w-full">
                          <div
                            style={{ width: `${completePct}%`, backgroundColor: pillColor }}
                            className="h-full rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
        )}

        {/* RIGHT PANEL: Workspace Canvas */}
        <div className="flex-1 flex flex-col min-w-0" id="documents-right-pane">
          
          {/* Dashboard Toolbar with breadcrumbs & controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0" id="documents-toolbar">
            
            {/* Breadcrumbs metadata line */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--text-muted)] text-xs font-mono">{activeSectionTitle}</span>
                <span className="text-[var(--text-muted)] text-[10px] font-mono">/</span>
                <span className="text-[var(--text-secondary)] text-xs font-bold font-sans">{activePageTitle}</span>
              </div>
              
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full border tracking-wider font-extrabold" style={{ color: themeColor, borderColor: `${themeColor}25`, backgroundColor: `${themeColor}08` }}>
                {activeDocType} MODE
              </span>

              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {getWordCount(editContent)} words
              </span>
            </div>

            {/* View selectors & save/copy helpers */}
            <div className="flex items-center gap-3 self-end sm:self-auto" id="toolbar-actions">
              
              {/* View Selection Segment Tabs */}
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-1 flex shadow-sm gap-0.5" id="view-mode-pills">
                {(["preview", "edit", "split"] as ViewMode[]).map((mode) => {
                  const isActive = viewMode === mode;
                  const Icon = mode === "preview" ? Eye : mode === "edit" ? Edit3 : Columns2;
                  const label = mode === "preview" ? "Read" : mode === "edit" ? "Write" : "Split";
                  return (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-none focus:outline-none flex items-center gap-1.5 text-xs font-semibold ${
                        isActive
                          ? "bg-[var(--bg-card)] border border-[var(--border)] shadow-sm font-bold text-[var(--text-primary)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-transparent"
                      }`}
                      style={isActive ? { color: themeColor } : {}}
                      title={`${mode} mode`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline capitalize">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Copy file contents action */}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--border-hover)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer focus:outline-none"
                title="Copy markdown content"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Save command button */}
              {(viewMode === "edit" || viewMode === "split") && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg text-white text-[10px] font-bold py-1.5 px-3.5 uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 select-none cursor-pointer border-none shadow-md transition-all active:scale-[0.97]"
                  style={{ backgroundColor: themeColor }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      {hasUnsavedChanges && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      <Save className="w-3 h-3" />
                      <span>Save Draft</span>
                    </>
                  )}
                </button>
              )}

            </div>
          </div>

          {/* Inner Content writing/reading workspace container */}
          <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden h-full min-h-[500px]">
            
            {/* Shimmer loading mask */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[var(--bg-card)]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                >
                  <RefreshCw className="w-6 h-6 animate-spin mb-2" style={{ color: themeColor }} />
                  <span className="font-mono text-xs text-[var(--text-primary)] font-bold">REGENERATING DRAFT FROM GRAPH CONSTELLATION...</span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] mt-1">Verifying completeness index gates</span>
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
                {/* PREVIEW CONTAINER VIEW MODE */}
                {viewMode === "preview" && (
                  <div className="h-full overflow-y-auto pr-1 select-text scroll-smooth text-[var(--text-secondary)]">
                    
                    {/* Document Editorial Header Cover */}
                    <div className="border-b border-[var(--border)] pb-6 mb-6 select-none animate-fadeIn">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold">
                          {activeSectionTitle}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">/</span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold" style={{ color: themeColor }}>
                          {activePageTitle}
                        </span>
                      </div>
                      
                      <h1 className="text-2xl md:text-3xl font-extrabold font-sans tracking-tight text-[var(--text-primary)] leading-tight mb-4">
                        {activePageTitle}
                      </h1>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border font-bold" style={{ color: themeColor, borderColor: `${themeColor}25`, backgroundColor: `${themeColor}06` }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                          <span>{activeDocType} SPECIFICATION</span>
                        </span>

                        <span className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1 bg-[var(--bg-surface)] px-2.5 py-1 rounded border border-[var(--border)]">
                          <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          <span>{getWordCount(pagesContent[selectedPageId]?.[activeDocType] || "")} words</span>
                        </span>

                        <span className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1 bg-[var(--bg-surface)] px-2.5 py-1 rounded border border-[var(--border)]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{calculateCompleteness(activeDocType)}% completeness</span>
                        </span>
                      </div>
                    </div>

                    {/* Rendered Document body container - styled as an elegant manuscript page */}
                    <div className="max-w-2xl mx-auto py-3 my-4">
                      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] backdrop-blur-md relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                        {/* Elegant micro watermark accent for declassified tech look */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--border)] to-transparent opacity-10 pointer-events-none rounded-bl-full" />
                        <div className="absolute top-3 right-4 font-mono text-[8px] text-[var(--text-muted)] select-none uppercase tracking-widest font-bold">
                          MOM_DOC_REF_{selectedPageId.toUpperCase().replace(/-/g, '_')}
                        </div>
                        {renderContent(pagesContent[selectedPageId]?.[activeDocType] || "", activeDocType)}
                      </div>
                    </div>
                  </div>
                )}

                {/* EDIT/WRITE PREVIEW CONTAINER VIEW MODE */}
                {viewMode === "edit" && (
                  <div className="flex flex-col h-full bg-black/10 dark:bg-black/15 border border-[var(--border)] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--accent)]/15 focus-within:border-[var(--accent)] transition-all">
                    
                    {/* Rich Editor Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[var(--bg-surface)] border-b border-[var(--border)] shrink-0 select-none">
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          onClick={() => insertMarkdown("bold", "bold text")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => insertMarkdown("italic", "italic text")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />
                        <button
                          onClick={() => insertMarkdown("h1", "Heading 1")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Heading 1"
                        >
                          <Heading1 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => insertMarkdown("h2", "Heading 2")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Heading 2"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />
                        <button
                          onClick={() => insertMarkdown("code", "code")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Inline Code"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => insertMarkdown("codeblock", "// code")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Code Block"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-[1px] h-4 bg-[var(--border)] mx-1" />
                        <button
                          onClick={() => insertMarkdown("list", "list item")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Bullet list"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => insertMarkdown("numlist", "list item")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Numbered list"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => insertMarkdown("quote", "quote text")}
                          className="p-1.5 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          title="Blockquote"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Prominent high-contrast CTA to open split live preview while writing */}
                        <button
                          onClick={() => setViewMode("split")}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[var(--border)] hover:border-emerald-500/40 hover:bg-emerald-500/5 text-[9px] uppercase font-mono text-[var(--text-secondary)] hover:text-emerald-400 font-bold transition-all cursor-pointer bg-black/10 shadow-sm"
                          title="Show side-by-side split rendering"
                        >
                          <Columns2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                          <span>Show Live Preview</span>
                        </button>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold hidden xs:inline">
                          Markdown Active
                        </span>
                      </div>
                    </div>

                    {/* Writing Panel workspace with line lines column */}
                    <div className="flex-1 relative min-h-0 flex flex-row">
                      <div className="hidden sm:flex flex-col pr-2.5 pl-3 pt-4 select-none text-right font-mono text-[10px] text-[var(--text-muted)] border-r border-[var(--border)] leading-relaxed h-full overflow-hidden bg-black/5 dark:bg-black/10 w-10">
                        {Array.from({ length: Math.max(1, editContent.split("\n").length) }).map((_, idx) => (
                          <div key={idx} className="h-[21px]">{idx + 1}</div>
                        ))}
                      </div>

                      <textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={(e) => {
                          setEditContent(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                        className="flex-1 h-full bg-transparent p-4 text-[13px] font-mono text-[var(--text-secondary)] leading-relaxed resize-none outline-none overflow-y-auto"
                        placeholder="Start typing your structured document spec cards here..."
                      />
                    </div>

                    {/* Editor Status bar strip */}
                    <div className="flex justify-between items-center px-4 py-1.5 bg-[var(--bg-surface)] border-t border-[var(--border)] shrink-0 text-[10px] font-mono text-[var(--text-muted)] select-none">
                      <div className="flex items-center gap-3">
                        <span>Lines: {editContent.split("\n").length}</span>
                        <span>Words: {getWordCount(editContent)}</span>
                        <span>Chars: {editContent.length}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                        <span className="uppercase tracking-wider">{activeDocType} editor loaded</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SPLIT VIEW PREVIEW VIEW MODE */}
                {viewMode === "split" && (
                  <div className="flex flex-col lg:flex-row gap-5 h-full">
                    
                    {/* Writing column left side */}
                    <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-black/10 dark:bg-black/15 border border-[var(--border)] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--accent)]/15 focus-within:border-[var(--accent)] transition-all">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-surface)] border-b border-[var(--border)] shrink-0 select-none">
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => insertMarkdown("bold", "bold text")}
                            className="p-1 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                            title="Bold"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => insertMarkdown("italic", "italic text")}
                            className="p-1 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                            title="Italic"
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-[1px] h-3 bg-[var(--border)] mx-0.5" />
                          <button
                            onClick={() => insertMarkdown("h1", "Heading 1")}
                            className="p-1 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                            title="H1"
                          >
                            <Heading1 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => insertMarkdown("h2", "Heading 2")}
                            className="p-1 rounded hover:bg-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                            title="H2"
                          >
                            <Heading2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewMode("edit")}
                            className="px-2 py-0.5 rounded border border-[var(--border)] bg-black/10 hover:border-rose-500/40 text-[8px] font-mono uppercase text-[var(--text-secondary)] hover:text-rose-400 transition-all cursor-pointer animate-pulse"
                            title="Switch back to full-screen editor"
                          >
                            Hide Preview
                          </button>
                          <span className="text-[8px] font-mono text-[var(--text-muted)]">SPLIT VIEW</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 relative min-h-0 flex flex-row">
                        <textarea
                          ref={textareaRef}
                          value={editContent}
                          onChange={(e) => {
                            setEditContent(e.target.value);
                            setHasUnsavedChanges(true);
                          }}
                          className="flex-1 h-full bg-transparent p-3 text-xs font-mono text-[var(--text-secondary)] leading-relaxed resize-none outline-none overflow-y-auto"
                          placeholder="Drafting workspace..."
                        />
                      </div>
                      
                      <div className="px-3 py-1 bg-[var(--bg-surface)] border-t border-[var(--border)] shrink-0 text-[8px] font-mono text-[var(--text-muted)] flex justify-between select-none">
                        <span>Words: {getWordCount(editContent)}</span>
                        {hasUnsavedChanges && <span className="text-yellow-400 font-bold">UNSAVED DRAFT</span>}
                      </div>
                    </div>

                    {/* Reading live rendering column right side */}
                    <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto pr-1 border border-[var(--border)] rounded-2xl p-6 select-text bg-[var(--bg-surface)] backdrop-blur-md shadow-inner relative">
                      <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2 select-none flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <Eye className="w-3 h-3 text-[var(--accent)]" />
                          <span>LIVE RENDERING</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                          <span className="text-[8px] opacity-75">LIVE</span>
                        </span>
                      </div>
                      
                      <div className="font-mono text-[8px] text-[var(--text-muted)] select-none uppercase tracking-widest font-bold mb-3">
                        DOC_SPLIT_PREVIEW_{activeDocType.toUpperCase()}
                      </div>

                      <div className="max-w-prose">
                        {renderContent(editContent, activeDocType)}
                      </div>
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
