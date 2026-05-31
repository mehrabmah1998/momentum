"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  Lock,
  Database,
  Square,
  Layers,
  ShieldCheck,
  Shield,
  Hash,
  Circle,
  Zap
} from "lucide-react";

// --- Schema Types ---
interface SchemaSection {
  id: string;
  label: string;
  type: "pre-defined" | "expandable" | "custom";
  locked?: boolean;
  cardinality?: "single" | "many";
  required?: boolean;
  min?: number;
  description: string;
  nodeCount?: number;       // mock: how many nodes are currently in this section
  confidence?: "confirmed" | "needs-input" | "empty";
  children?: SchemaSection[];
}

// --- Mind Map Schema Constant ---
const SCHEMA: SchemaSection[] = [
  {
    id: "organization",
    label: "Organization",
    type: "pre-defined",
    locked: true,
    description: "Who the company is, why it exists, and who it serves. Same structure for every company on the platform.",
    nodeCount: 6,
    confidence: "confirmed",
    children: [
      {
        id: "organization.identity",
        label: "Identity",
        type: "pre-defined",
        locked: true,
        cardinality: "single",
        required: true,
        description: "Core identity fields: mission, vision, values, industry, company stage. One entry total.",
        nodeCount: 1,
        confidence: "confirmed",
      },
      {
        id: "organization.goals",
        label: "Goals",
        type: "pre-defined",
        locked: true,
        cardinality: "many",
        required: true,
        min: 1,
        description: "Time-bound company goals with measurable outcomes. Each goal has a target and deadline.",
        nodeCount: 3,
        confidence: "confirmed",
      },
      {
        id: "organization.audience",
        label: "Audience",
        type: "pre-defined",
        locked: true,
        description: "Who the company serves.",
        nodeCount: 2,
        confidence: "confirmed",
        children: [
          {
            id: "organization.audience.niche",
            label: "Niche",
            type: "pre-defined",
            locked: true,
            cardinality: "single",
            required: true,
            description: "The specific market segment being targeted. One entry.",
            nodeCount: 1,
            confidence: "confirmed",
          },
          {
            id: "organization.audience.personas",
            label: "Personas",
            type: "pre-defined",
            locked: true,
            cardinality: "many",
            required: true,
            min: 1,
            description: "Detailed user personas. Each persona has: role, context, pain point, goal, and what they measure success by.",
            nodeCount: 2,
            confidence: "confirmed",
          },
        ],
      },
      {
        id: "organization.positioning",
        label: "Positioning",
        type: "pre-defined",
        locked: true,
        description: "How the company stands out in the market.",
        nodeCount: 1,
        confidence: "needs-input",
        children: [
          {
            id: "organization.positioning.differentiators",
            label: "Differentiators",
            type: "pre-defined",
            locked: true,
            cardinality: "single",
            required: true,
            description: "What makes this company meaningfully different from alternatives.",
            nodeCount: 1,
            confidence: "confirmed",
          },
          {
            id: "organization.positioning.competitors",
            label: "Competitors",
            type: "pre-defined",
            locked: true,
            cardinality: "many",
            required: false,
            description: "Known alternatives in the market and how this company differs from each.",
            nodeCount: 0,
            confidence: "empty",
          },
          {
            id: "organization.positioning.market_context",
            label: "Market Context",
            type: "pre-defined",
            locked: true,
            cardinality: "single",
            required: false,
            description: "Industry dynamics, timing, and why now is the right moment.",
            nodeCount: 0,
            confidence: "empty",
          },
        ],
      },
      {
        id: "organization.brand",
        label: "Brand Voice",
        type: "pre-defined",
        locked: true,
        cardinality: "single",
        required: true,
        description: "How the company communicates. Tone setting, phrases to use, phrases to avoid.",
        nodeCount: 1,
        confidence: "confirmed",
      },
    ],
  },
  {
    id: "project",
    label: "Project",
    type: "pre-defined",
    locked: true,
    description: "What is being built. Multiple projects can exist under one organization.",
    nodeCount: 14,
    confidence: "needs-input",
    children: [
      {
        id: "project.vision",
        label: "Vision",
        type: "pre-defined",
        locked: true,
        cardinality: "single",
        required: true,
        description: "Why this project exists, what problem it solves, and who uses it.",
        nodeCount: 1,
        confidence: "confirmed",
      },
      {
        id: "project.modules",
        label: "Modules",
        type: "expandable",
        locked: false,
        cardinality: "many",
        required: true,
        min: 2,
        description: "Major system components. Each module is a container for its own features, decisions, and constraints.",
        nodeCount: 5,
        confidence: "confirmed",
        children: [
          {
            id: "project.modules.*.features",
            label: "Features",
            type: "expandable",
            cardinality: "many",
            required: true,
            min: 1,
            description: "Specific user-facing or system capabilities within this module.",
            nodeCount: 14,
            confidence: "confirmed",
          },
          {
            id: "project.modules.*.decisions",
            label: "Decisions",
            type: "expandable",
            cardinality: "many",
            required: false,
            description: "Technical and architectural choices made for this module. Every decision must include rationale.",
            nodeCount: 4,
            confidence: "confirmed",
          },
          {
            id: "project.modules.*.constraints",
            label: "Constraints",
            type: "expandable",
            cardinality: "many",
            required: false,
            description: "Rules and limits that apply specifically to this module.",
            nodeCount: 3,
            confidence: "confirmed",
          },
        ],
      },
      {
        id: "project.entities",
        label: "Entities",
        type: "pre-defined",
        locked: true,
        cardinality: "many",
        required: false,
        description: "Data models and domain objects shared across modules.",
        nodeCount: 3,
        confidence: "confirmed",
      },
      {
        id: "project.decisions",
        label: "Global Decisions",
        type: "pre-defined",
        locked: true,
        cardinality: "many",
        required: true,
        min: 1,
        description: "Architectural decisions that affect the entire project and are not owned by a single module.",
        nodeCount: 1,
        confidence: "needs-input",
      },
      {
        id: "project.constraints",
        label: "Global Constraints",
        type: "pre-defined",
        locked: true,
        cardinality: "many",
        required: true,
        min: 1,
        description: "Project-wide rules and limits that every module must respect.",
        nodeCount: 0,
        confidence: "empty",
      },
    ],
  },
];

// --- Recursive Counting Helpers ---
const countSections = (sections: SchemaSection[]): number => {
  return sections.reduce((acc, sec) => {
    return acc + 1 + (sec.children ? countSections(sec.children) : 0);
  }, 0);
};

const countRequired = (sections: SchemaSection[]): number => {
  return sections.reduce((acc, sec) => {
    const isReq = sec.required ? 1 : 0;
    return acc + isReq + (sec.children ? countRequired(sec.children) : 0);
  }, 0);
};

const countConfirmed = (sections: SchemaSection[]): number => {
  return sections.reduce((acc, sec) => {
    const isConf = sec.confidence === "confirmed" ? 1 : 0;
    return acc + isConf + (sec.children ? countConfirmed(sec.children) : 0);
  }, 0);
};

const getAllIds = (sections: SchemaSection[]): string[] => {
  let ids: string[] = [];
  sections.forEach((sec) => {
    ids.push(sec.id);
    if (sec.children) {
      ids = [...ids, ...getAllIds(sec.children)];
    }
  });
  return ids;
};

const getFlatSectionList = (sections: SchemaSection[]): SchemaSection[] => {
  let list: SchemaSection[] = [];
  sections.forEach((sec) => {
    list.push(sec);
    if (sec.children) {
      list = [...list, ...getFlatSectionList(sec.children)];
    }
  });
  return list;
};

export default function SchemaTab() {
  const [selectedSection, setSelectedSection] = useState<SchemaSection | null>(SCHEMA[0]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["organization", "project", "organization.audience", "organization.positioning", "project.modules"]));
  const [expandAll, setExpandAll] = useState(false);

  // Stats calculation
  const totalSections = countSections(SCHEMA);
  const requiredSections = countRequired(SCHEMA);
  const confirmedSections = countConfirmed(SCHEMA);

  // Indexing map for stagger on mount animations
  const flatSections = getFlatSectionList(SCHEMA);
  const sectionIndices = new Map<string, number>();
  flatSections.forEach((sec, idx) => {
    sectionIndices.set(sec.id, idx);
  });

  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedIds(new Set(["organization", "project"]));
      setExpandAll(false);
    } else {
      setExpandedIds(new Set(getAllIds(SCHEMA)));
      setExpandAll(true);
    }
  };

  const handleRowClick = (section: SchemaSection, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSection(section);

    if (section.children && section.children.length > 0) {
      const next = new Set(expandedIds);
      if (next.has(section.id)) {
        next.delete(section.id);
      } else {
        next.add(section.id);
      }
      setExpandedIds(next);
    }
  };

  // Pre-compiled confidence labels matching schema dot styling
  const getConfidenceBadgeStyles = (conf: SchemaSection["confidence"]) => {
    switch (conf) {
      case "confirmed":
        return "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20";
      case "needs-input":
        return "text-amber-400 bg-amber-500/[0.08] border-amber-500/20";
      default:
        return "text-[var(--text-muted)] bg-[var(--bg-surface)] border-[var(--border)]";
    }
  };

  // Recursive Tree Row Render Function
  const renderSection = (section: SchemaSection, depth: number) => {
    const isSelected = selectedSection?.id === section.id;
    const hasChildren = section.children && section.children.length > 0;
    const isExpanded = expandedIds.has(section.id);
    const visualIndex = sectionIndices.get(section.id) ?? 0;

    return (
      <div key={section.id} className="flex flex-col" id={`schema-item-${section.id.replace(/\*/g, "-").replace(/\./g, "-")}`}>
        {/* Row Element with Mount-Stagger Trigger */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: visualIndex * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => handleRowClick(section, e)}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`group flex items-center gap-2.5 py-2.5 pr-2 rounded-lg cursor-pointer transition-colors border-l-2 select-none h-11 ${
            isSelected
              ? "bg-[var(--accent)]/[0.06] border-[var(--accent)]"
              : "border-transparent hover:bg-[var(--bg-surface)]"
          }`}
          id={`row-${section.id.replace(/\*/g, "-").replace(/\./g, "-")}`}
        >
          {/* CHEVRON or SPACER */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const next = new Set(expandedIds);
                if (next.has(section.id)) {
                  next.delete(section.id);
                } else {
                  next.add(section.id);
                }
                setExpandedIds(next);
              }}
              className="p-1 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <ChevronRight
                className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          ) : (
            <div className="w-5.5 h-5.5 shrink-0" />
          )}

          {/* CONFIDENCE DOT */}
          {section.confidence === "confirmed" ? (
            <span className="w-2 h-2 rounded-full bg-[#34d399] shrink-0" title="Confirmed" />
          ) : section.confidence === "needs-input" ? (
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" title="Needs Input" />
          ) : (
            <span className="w-2 h-2 rounded-full border border-[var(--border)] bg-transparent shrink-0" title="Empty" />
          )}

          {/* LABEL */}
          <span
            className={`font-sans truncate ${
              hasChildren
                ? `text-[13px] font-medium ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`
                : `text-[12px] ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`
            }`}
          >
            {section.label}
          </span>

          {/* RIGHT ACCESSIBILITY AND BADGES ROW */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0 pr-1">
            {section.locked && (
              <span title="Locked Pre-defined Section" className="shrink-0">
                <Lock className="w-3 h-3 text-[var(--text-muted)]/50" />
              </span>
            )}
            {section.type === "expandable" && (
              <span className="text-[8px] font-mono tracking-wider font-bold text-[#f59e0b] bg-[#f59e0b]/08 border border-[#f59e0b]/20 px-1.5 py-0.5 rounded uppercase shrink-0">
                exp
              </span>
            )}
            {section.required && (
              <span className="text-[8px] font-mono tracking-wider font-bold text-[var(--accent)] bg-[var(--accent)]/08 border border-[var(--accent)]/20 px-1.5 py-0.5 rounded uppercase shrink-0">
                req
              </span>
            )}
            {section.nodeCount !== undefined && section.nodeCount > 0 && (
              <span className="font-mono text-[9px] text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border)] px-1.5 py-0.5 rounded shrink-0">
                {section.nodeCount}
              </span>
            )}
          </div>
        </motion.div>

        {/* RECURSIVE CHILD RENDER with Height animations */}
        <AnimatePresence initial={false}>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
              id={`children-container-${section.id.replace(/\*/g, "-").replace(/\./g, "-")}`}
            >
              <div className="flex flex-col mt-0.5 pb-1">
                {section.children!.map((child) => renderSection(child, depth + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[var(--bg)] font-sans" id="schema-explorer-root">
      {/* PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pt-8 pb-5"
        id="schema-header"
      >
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] px-2.5 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] font-bold inline-block">
            Schema Explorer
          </span>
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] mt-3 tracking-tight" id="schema-page-title">
            Mind Map Schema
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
            The constitution of your knowledge base. Every section, its rules, and what belongs there.
          </p>
        </div>

        {/* 3 STAT CHIPS STYLE */}
        <div className="flex items-center gap-3 flex-wrap" id="schema-header-stats">
          <div className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4f8ef7]" />
            <span>{totalSections} Sections</span>
          </div>
          <div className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span>{requiredSections} Required</span>
          </div>
          <div className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span>{confirmedSections} Confirmed</span>
          </div>
        </div>
      </motion.div>

      {/* MAIN BODY: ROW OF TREE AND CARD */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-8 pb-8" id="schema-main-body">
        {/* LEFT — Tree panel */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col" id="schema-tree-card-wrapper">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col h-[520px] lg:h-[650px] relative">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />

            {/* Header internal row */}
            <div className="px-4 pt-4 pb-3 border-b border-[var(--border)] flex items-center justify-between" id="tree-card-header">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold">
                Section Tree
              </span>
              <button
                onClick={toggleExpandAll}
                className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer bg-transparent border-none py-1 px-2.5 transition-colors font-semibold"
                id="toggle-expand-all"
              >
                {expandAll ? "Collapse All" : "Expand All"}
              </button>
            </div>

            {/* Hierarchical list container */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar" id="tree-scroll-container">
              {SCHEMA.map((rootSec) => renderSection(rootSec, 0))}
            </div>
          </div>
        </div>

        {/* RIGHT — Detail panel */}
        <div className="flex-1 flex flex-col h-[520px] lg:h-[650px]" id="schema-detail-panel-outer-wrapper">
          {selectedSection ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSection.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-6 h-full overflow-y-auto relative"
                id="selected-detail-card"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />

                {/* Header block */}
                <div id="detail-header-block">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest mb-1.5 block">
                    ID: {selectedSection.id}
                  </span>
                  <h2 className="text-xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
                    {selectedSection.label}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5" id="detail-badge-block">
                    {/* Type badge */}
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-bold ${
                        selectedSection.type === "pre-defined"
                          ? "text-[#4f8ef7] bg-[#4f8ef7]/10 border-[#4f8ef7]/20"
                          : selectedSection.type === "expandable"
                          ? "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20"
                          : "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20"
                      }`}
                    >
                      {selectedSection.type}
                    </span>

                    {/* Locked badge if locked */}
                    {selectedSection.locked && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border)] px-2.5 py-0.5 rounded-full font-bold">
                        <Lock className="w-3 h-3 text-[var(--text-muted)]/70" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Description block */}
                <div id="detail-content-description">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold block mb-1.5">
                    What belongs here
                  </span>
                  <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed p-3.5 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                    {selectedSection.description}
                  </p>
                </div>

                {/* Rules 2x2 grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="detail-rules-grid">
                  {/* Card 1: Cardinality */}
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3">
                    <div className="flex items-center justify-between text-[var(--text-muted)] mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold">
                        Cardinality
                      </span>
                      {selectedSection.cardinality === "single" ? (
                        <Square className="w-3.5 h-3.5 text-[var(--accent)]" />
                      ) : (
                        <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                      )}
                    </div>
                    <div className="text-xs font-sans text-[var(--text-primary)] font-semibold">
                      {selectedSection.cardinality === "single"
                        ? "Single Node Allowed"
                        : selectedSection.cardinality === "many"
                        ? "Many Nodes Stacked"
                        : "No Limit Spec"}
                    </div>
                  </div>

                  {/* Card 2: Required */}
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3">
                    <div className="flex items-center justify-between text-[var(--text-muted)] mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold">
                        Required
                      </span>
                      {selectedSection.required ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                      ) : (
                        <Shield className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <div className="text-xs font-sans text-[var(--text-primary)] font-semibold">
                      {selectedSection.required ? "Required — Must be filled" : "Optional Section"}
                    </div>
                  </div>

                  {/* Card 3: Minimum target */}
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3">
                    <div className="flex items-center justify-between text-[var(--text-muted)] mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold">
                        Minimum Entries
                      </span>
                      <Hash className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </div>
                    <div className="text-xs font-sans text-[var(--text-primary)] font-semibold">
                      {selectedSection.min !== undefined ? `At least ${selectedSection.min} node(s)` : "No minimum restriction"}
                    </div>
                  </div>

                  {/* Card 4: Node count */}
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3">
                    <div className="flex items-center justify-between text-[var(--text-muted)] mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold">
                        Current Nodes
                      </span>
                      <Circle className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </div>
                    <div className="text-xs font-sans text-[var(--text-primary)] font-semibold">
                      {selectedSection.nodeCount ?? 0} mapped nodes
                    </div>
                  </div>
                </div>

                {/* Confidence Status Banner */}
                <div id="detail-confidence-section">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold block mb-2">
                    Confidence Status
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border font-bold w-fit ${getConfidenceBadgeStyles(selectedSection.confidence)}`}>
                      {selectedSection.confidence === "confirmed" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {selectedSection.confidence === "needs-input" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      <span>{selectedSection.confidence === "confirmed" ? "Human Confirmed" : selectedSection.confidence === "needs-input" ? "Needs Input" : "Empty"}</span>
                    </span>
                    <span className="text-xs font-sans text-[var(--text-secondary)]">
                      {selectedSection.confidence === "confirmed"
                        ? "This ecosystem is fully verified and matches production standards."
                        : selectedSection.confidence === "needs-input"
                        ? "Sub-definitions require human input during extraction cycles."
                        : "No claims recorded to complete these architectural constraints."}
                    </span>
                  </div>
                </div>

                {/* AI Routing note (soft banner at bottom) */}
                <div className="bg-[var(--accent)]/[0.04] border border-[var(--accent)]/10 rounded-xl p-3.5 flex gap-2.5 items-start mt-auto" id="ai-soft-callout">
                  <Zap className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <p className="text-xs font-sans text-[var(--text-muted)] leading-relaxed">
                    When new information arrives, the AI reads this section&apos;s description to determine if the input belongs here. It scores each section and routes the node to the best match.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center text-center p-8 h-full select-none" id="detail-empty-card">
              <Database className="w-8 h-8 text-[var(--text-muted)]/30 mb-3" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Select a section
              </h3>
              <p className="text-xs text-[var(--text-muted)]/60 max-w-xs mt-1">
                Click any section in the tree to explore its schema definition.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
