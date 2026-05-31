"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Network,
  GitBranch,
  FileText,
  Clock,
  Plus,
  Minus,
  X,
  ExternalLink,
  ShieldAlert,
  HelpCircle
} from "lucide-react";

// --- Graph Types ---
interface Node {
  id: string;
  type: "Module" | "Feature" | "Decision" | "Constraint" | "Entity";
  label: string;
  x: number;
  y: number;
  description: string;
  status: "confirmed" | "proposed" | "deprecated";
}

interface Edge {
  from: string;
  to: string;
  type: "belongs_to" | "depends_on" | "governs" | "constrained_by" | "uses" | "conflicts_with";
}

// --- Mock Data ---
const NODES: Node[] = [
  // MODULES — large, spaced around the canvas
  { 
    id: "m1", 
    type: "Module", 
    label: "Knowledge Graph", 
    x: 420, 
    y: 200, 
    description: "Core graph engine. Stores all nodes and edges, routes new input through the mind map, and powers the semantic search that drives prompt generation.", 
    status: "confirmed" 
  },
  { 
    id: "m2", 
    type: "Module", 
    label: "Extraction Engine", 
    x: 180, 
    y: 340, 
    description: "Conducts dynamic extraction interviews. Generates targeted questions, validates answer quality, detects saturation, and routes confirmed claims into the graph.", 
    status: "confirmed" 
  },
  { 
    id: "m3", 
    type: "Module", 
    label: "Document Engine", 
    x: 660, 
    y: 340, 
    description: "Renders three document types (Insider, AI, Public) from the knowledge graph on demand. All documents are always consistent with the current graph state.", 
    status: "confirmed" 
  },
  { 
    id: "m4", 
    type: "Module", 
    label: "Auth & Teams", 
    x: 250, 
    y: 510, 
    description: "Handles user authentication, organization management, and role-based access control. Supports Owner, Admin, Editor, and Viewer roles.", 
    status: "confirmed" 
  },
  { 
    id: "m5", 
    type: "Module", 
    label: "Prompt Engine", 
    x: 600, 
    y: 500, 
    description: "Generates structured prompts for AI builders. Traverses the graph semantically, selects the most relevant nodes, and formats context for Claude Code, Codex, etc.", 
    status: "confirmed" 
  },

  // FEATURES
  { 
    id: "f1", 
    type: "Feature", 
    label: "Mind map routing", 
    x: 340, 
    y: 120, 
    description: "AI reads the mind map section descriptions and scores each section for match against new input. Routes claims to the correct section.", 
    status: "confirmed" 
  },
  { 
    id: "f2", 
    type: "Feature", 
    label: "Semantic search", 
    x: 510, 
    y: 110, 
    description: "pgvector embeddings on all node descriptions. A feature request triggers similarity search — not a full graph scan.", 
    status: "confirmed" 
  },
  { 
    id: "f3", 
    type: "Feature", 
    label: "Constellation view", 
    x: 560, 
    y: 200, 
    description: "Spatial graph visualization. Modules are the largest nodes. Features orbit their parent. Edges are typed and colored.", 
    status: "confirmed" 
  },
  { 
    id: "f4", 
    type: "Feature", 
    label: "Confidence health map", 
    x: 480, 
    y: 290, 
    description: "Renders each mind map section as a color-coded tile based on the confidence distribution of nodes inside it. Shows trust level at a glance.", 
    status: "confirmed" 
  },
  { 
    id: "f5", 
    type: "Feature", 
    label: "Dynamic questions", 
    x: 90, 
    y: 270, 
    description: "Questions are generated per-turn based on what is still missing from the graph and what the user just said. Not a fixed script.", 
    status: "confirmed" 
  },
  { 
    id: "f6", 
    type: "Feature", 
    label: "Quality gate", 
    x: 160, 
    y: 430, 
    description: "Every answer is evaluated on specificity, completeness, rationale, actionability, and consistency before the claim is stored as a node.", 
    status: "confirmed" 
  },
  { 
    id: "f7", 
    type: "Feature", 
    label: "Saturation detection", 
    x: 80, 
    y: 390, 
    description: "Tracks information density per answer. Stops extraction when new claim ratio drops below 20% for 3 consecutive answers.", 
    status: "confirmed" 
  },
  { 
    id: "f8", 
    type: "Feature", 
    label: "Insider document", 
    x: 720, 
    y: 260, 
    description: "Full narrative. Every module, feature, decision, and constraint explained in detail with all rationale included.", 
    status: "confirmed" 
  },
  { 
    id: "f9", 
    type: "Feature", 
    label: "AI document", 
    x: 790, 
    y: 350, 
    description: "Structured and terse. Only non-obvious decisions, constraints, module relationships, and data flows. The advanced CLAUDE.md.", 
    status: "confirmed" 
  },
  { 
    id: "f10", 
    type: "Feature", 
    label: "Public document", 
    x: 720, 
    y: 430, 
    description: "Plain language. What the product does, who it is for, high-level modules. No sensitive architectural details.", 
    status: "confirmed" 
  },
  { 
    id: "f11", 
    type: "Feature", 
    label: "Prompt structure", 
    x: 680, 
    y: 510, 
    description: "Every generated prompt follows a fixed format: Project Context, What to Build, Constraints to Respect, Do Not Break, Files Likely Involved.", 
    status: "confirmed" 
  },
  { 
    id: "f12", 
    type: "Feature", 
    label: "Context window builder", 
    x: 550, 
    y: 580, 
    description: "Top N most relevant nodes by semantic similarity. Never sends the full graph. Ranked and filtered per request.", 
    status: "confirmed" 
  },
  { 
    id: "f13", 
    type: "Feature", 
    label: "OAuth (Google, GitHub)", 
    x: 160, 
    y: 570, 
    description: "Social sign-in via Google and GitHub. Redirect URI: /api/auth/callback/{provider}.", 
    status: "confirmed" 
  },
  { 
    id: "f14", 
    type: "Feature", 
    label: "Role-based access", 
    x: 320, 
    y: 560, 
    description: "Owner / Admin / Editor / Viewer. All edits go through agent validation regardless of role.", 
    status: "confirmed" 
  },

  // DECISIONS
  { 
    id: "d1", 
    type: "Decision", 
    label: "PostgreSQL + pgvector", 
    x: 420, 
    y: 310, 
    description: "Graph nodes, embeddings, and all relational data in one store. Avoids a separate vector DB. pgvector handles semantic search.", 
    status: "confirmed" 
  },
  { 
    id: "d2", 
    type: "Decision", 
    label: "Claude API", 
    x: 300, 
    y: 200, 
    description: "Best long-context reasoning for extraction interviews and document generation. All agents use the same provider.", 
    status: "confirmed" 
  },
  { 
    id: "d3", 
    type: "Decision", 
    label: "No document storage", 
    x: 750, 
    y: 160, 
    description: "Documents are not stored statically. They are rendered from the graph on demand. Graph is always the source of truth.", 
    status: "confirmed" 
  },
  { 
    id: "d4", 
    type: "Decision", 
    label: "Cloudflare D1 + better-auth", 
    x: 140, 
    y: 490, 
    description: "Auth uses better-auth backed by Cloudflare D1. Chosen for Cloudflare Pages deployment model.", 
    status: "confirmed" 
  },

  // CONSTRAINTS
  { 
    id: "c1", 
    type: "Constraint", 
    label: "Graph = source of truth", 
    x: 380, 
    y: 390, 
    description: "Documents can never contradict the knowledge graph. No edit is committed without passing the agent validation gate.", 
    status: "confirmed" 
  },
  { 
    id: "c2", 
    type: "Constraint", 
    label: "Quality gate is blocking", 
    x: 90, 
    y: 170, 
    description: "The hard floor of required mind map sections must be met before document generation is allowed. No bypass.", 
    status: "confirmed" 
  },
  { 
    id: "c3", 
    type: "Constraint", 
    label: "Prompts select context", 
    x: 530, 
    y: 430, 
    description: "Generated prompts must never include the full knowledge graph. Only top-N semantically relevant nodes.", 
    status: "confirmed" 
  },

  // ENTITIES
  { 
    id: "e1", 
    type: "Entity", 
    label: "Node", 
    x: 310, 
    y: 290, 
    description: "id, section_id, type, name, description, rationale, status (proposed|confirmed|deprecated), confidence (human-confirmed|ai-suggested|git-inferred), created_by, updated_at", 
    status: "confirmed" 
  },
  { 
    id: "e2", 
    type: "Entity", 
    label: "Edge", 
    x: 450, 
    y: 390, 
    description: "from_node_id, to_node_id, relationship (belongs_to|depends_on|constrained_by|governs|uses|conflicts_with), created_at", 
    status: "confirmed" 
  },
  { 
    id: "e3", 
    type: "Entity", 
    label: "Project", 
    x: 420, 
    y: 470, 
    description: "id, org_id, name, description, created_at, updated_at, mind_map_version", 
    status: "confirmed" 
  },
];

const EDGES: Edge[] = [
  // Module → Module relationships
  { from: "m2", to: "m1", type: "depends_on" },
  { from: "m3", to: "m1", type: "depends_on" },
  { from: "m5", to: "m1", type: "depends_on" },

  // Feature → Module (belongs_to)
  { from: "f1", to: "m1", type: "belongs_to" },
  { from: "f2", to: "m1", type: "belongs_to" },
  { from: "f3", to: "m1", type: "belongs_to" },
  { from: "f4", to: "m1", type: "belongs_to" },
  { from: "f5", to: "m2", type: "belongs_to" },
  { from: "f6", to: "m2", type: "belongs_to" },
  { from: "f7", to: "m2", type: "belongs_to" },
  { from: "f8", to: "m3", type: "belongs_to" },
  { from: "f9", to: "m3", type: "belongs_to" },
  { from: "f10", to: "m3", type: "belongs_to" },
  { from: "f11", to: "m5", type: "belongs_to" },
  { from: "f12", to: "m5", type: "belongs_to" },
  { from: "f13", to: "m4", type: "belongs_to" },
  { from: "f14", to: "m4", type: "belongs_to" },

  // Decision → Module (governs)
  { from: "d1", to: "m1", type: "governs" },
  { from: "d2", to: "m2", type: "governs" },
  { from: "d3", to: "m3", type: "governs" },
  { from: "d4", to: "m4", type: "governs" },

  // Constraint relationships
  { from: "c1", to: "m3", type: "constrained_by" },
  { from: "c2", to: "m2", type: "constrained_by" },
  { from: "c3", to: "m5", type: "constrained_by" },

  // Feature → Entity (uses)
  { from: "f1", to: "e1", type: "uses" },
  { from: "f2", to: "e1", type: "uses" },
  { from: "f6", to: "e1", type: "uses" },

  // Cross-feature dependencies
  { from: "f4", to: "f3", type: "depends_on" },
  { from: "f12", to: "f2", type: "depends_on" },
  { from: "f11", to: "f12", type: "depends_on" },
];

// --- Node Type Constants ---
const NODE_STYLES: Record<string, { color: string; badgeClass: string }> = {
  Module: { color: "#4f8ef7", badgeClass: "text-[#4f8ef7] bg-[#4f8ef7]/10 border-[#4f8ef7]/20" },
  Feature: { color: "#a78bfa", badgeClass: "text-[#a78bfa] bg-[#a78bfa]/10 border-[#a78bfa]/20" },
  Decision: { color: "#f59e0b", badgeClass: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20" },
  Constraint: { color: "#f87171", badgeClass: "text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20" },
  Entity: { color: "#34d399", badgeClass: "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20" },
};

const EDGE_STYLES: Record<string, { color: string; opacity: number; width: number; dashed: boolean }> = {
  belongs_to: { color: "#4f8ef7", opacity: 0.3, width: 1, dashed: false },
  depends_on: { color: "#a78bfa", opacity: 0.4, width: 1, dashed: true },
  governs: { color: "#f59e0b", opacity: 0.4, width: 1, dashed: false },
  constrained_by: { color: "#f87171", opacity: 0.4, width: 1, dashed: false },
  uses: { color: "#34d399", opacity: 0.3, width: 1, dashed: false },
  conflicts_with: { color: "#ef4444", opacity: 0.6, width: 2, dashed: true },
};

export default function GraphTab() {
  // Required state variables (matched exactly to specs)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: Node } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Secondary states
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Pan action coordinates tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest(".interactive-node") || target.closest("button");
    if (!isInteractive) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    const newScale = e.deltaY < 0 ? transform.scale * zoomFactor : transform.scale / zoomFactor;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.4, Math.min(2.5, newScale)),
    }));
  };

  // Node Interaction Handlers
  const handleNodeMouseEnter = (node: Node, e: React.MouseEvent) => {
    setHoveredNode(node.id);
    const container = canvasRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setTooltip({
        x: e.clientX - rect.left + 8,
        y: e.clientY - rect.top - 44,
        node,
      });
    }
  };

  const handleNodeMouseMove = (node: Node, e: React.MouseEvent) => {
    const container = canvasRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setTooltip({
        x: e.clientX - rect.left + 8,
        y: e.clientY - rect.top - 44,
        node,
      });
    }
  };

  const handleNodeMouseLeave = () => {
    setHoveredNode(null);
    setTooltip(null);
  };

  // Node Filtering check helper
  const isNodeFiltered = (nodeType: string) => {
    return activeFilter !== "All" && nodeType !== activeFilter;
  };

  // Detail panel connections generator
  const connectedNodesList = (() => {
    if (!selectedNode) return [];
    return EDGES.map(edge => {
      const isFromSelected = edge.from === selectedNode.id;
      const isToSelected = edge.to === selectedNode.id;
      if (!isFromSelected && !isToSelected) return null;

      const otherNodeId = isFromSelected ? edge.to : edge.from;
      const otherNode = NODES.find(n => n.id === otherNodeId);
      if (!otherNode) return null;

      return {
        edge,
        isOutgoing: isFromSelected,
        node: otherNode,
      };
    }).filter(Boolean) as Array<{ edge: Edge; isOutgoing: boolean; node: Node }>;
  })();

  const filterOptions = ["All", "Module", "Feature", "Decision", "Constraint", "Entity"];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[var(--bg)] font-sans" id="graph-root">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pt-8 pb-4" id="graph-header">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] px-2.5 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] font-bold inline-block">
            Knowledge Graph
          </span>
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] mt-3 tracking-tight" id="graph-title">
            Constellation Graph
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
            Explore the structured knowledge behind your project. Click any node to inspect it.
          </p>
        </div>

        {/* STAT CHIPS ROW */}
        <div className="flex items-center gap-3" id="header-stats-chips">
          <div className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4f8ef7] animate-pulse" />
            <span>{NODES.length} Nodes</span>
          </div>
          <div className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a78bfa]" />
            <span>{EDGES.length} Edges</span>
          </div>
          <div className="font-mono text-[11px] px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span>{NODES.filter(n => n.status === "confirmed").length} Confirmed</span>
          </div>
        </div>
      </div>

      {/* FILTER CHIPS ROW */}
      <div className="px-8 pb-5 flex items-center gap-2 flex-wrap" id="filter-chips-row">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt;
          const nodeColor = NODE_STYLES[opt]?.color || "var(--accent)";
          return (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer select-none font-bold outline-none ${
                isActive
                  ? "bg-[var(--accent)]/[0.12] border-[var(--accent)]/30 text-[var(--accent)] font-bold shadow-sm"
                  : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
              }`}
            >
              {opt !== "All" && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: nodeColor }} />
              )}
              <span>{opt}s</span>
            </button>
          );
        })}
      </div>

      {/* RECEPTACLE FOR CANVAS + SIDEBAR */}
      <div className="flex-1 px-8 pb-4 flex flex-col md:flex-row gap-6 relative" id="graph-workspace-container">
        {/* WORKSPACE DIV */}
        <div 
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`flex-1 relative overflow-hidden bg-[var(--bg)] border border-[var(--border)] rounded-2xl select-none parser-canvas min-h-[620px] max-h-[820px] flex justify-center items-center ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          id="canvas-wrapper"
        >
          {/* ZOOM CONTROLS */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10" id="zoom-controls">
            <button
              onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(2.5, prev.scale + 0.15) }))}
              className="w-8 h-8 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-primary)] font-semibold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              id="zoom-in-btn"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.4, prev.scale - 0.15) }))}
              className="w-8 h-8 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-primary)] font-semibold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              id="zoom-out-btn"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
              className="px-2.5 h-8 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-xs font-mono font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              id="zoom-reset-btn"
            >
              Reset
            </button>
          </div>

          {/* SVG GRAPH FRAME */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 900 620"
            preserveAspectRatio="xMidYMid meet"
            id="svg-graph-frame"
            className="w-full h-full"
          >
            {/* SVG MARKERS/ARROWHEAD PROTOCOLS */}
            <defs>
              {Object.entries(EDGE_STYLES).map(([key, value]) => (
                <marker
                  key={key}
                  id={`arrow-${key}`}
                  viewBox="0 0 10 10"
                  refX={key === "belongs_to" ? 34 : 26}
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={value.color} fillOpacity={0.7} />
                </marker>
              ))}
            </defs>

            {/* MAIN TRANSFORM ELEMENT */}
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* RENDERING EDGES BEHIND NODES */}
              <g id="edges-group">
                {EDGES.map((edge, index) => {
                  const fromNode = NODES.find(n => n.id === edge.from);
                  const toNode = NODES.find(n => n.id === edge.to);

                  if (!fromNode || !toNode) return null;

                  const style = EDGE_STYLES[edge.type] || { color: "var(--border)", opacity: 0.3, width: 1, dashed: false };
                  const isFiltered = isNodeFiltered(fromNode.type) || isNodeFiltered(toNode.type);
                  const isHovered = hoveredEdgeId === `${edge.from}-${edge.to}`;

                  return (
                    <motion.line
                      key={`${edge.from}-${edge.to}-${index}`}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isFiltered ? 0.05 : isHovered ? Math.min(style.opacity + 0.3, 1.0) : style.opacity,
                        strokeWidth: isHovered ? style.width + 1 : style.width,
                      }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      stroke={style.color}
                      strokeDasharray={style.dashed ? "6 3" : undefined}
                      markerEnd={`url(#arrow-${edge.type})`}
                      className="transition-colors duration-200"
                      onMouseEnter={() => setHoveredEdgeId(`${edge.from}-${edge.to}`)}
                      onMouseLeave={() => setHoveredEdgeId(null)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })}
              </g>

              {/* RENDERING NODES */}
              <g id="nodes-group">
                {NODES.map((node, index) => {
                  const isFiltered = isNodeFiltered(node.type);
                  const isSelected = selectedNode?.id === node.id;
                  const color = NODE_STYLES[node.type]?.color || "var(--accent)";

                  // Node Stagger delays on entry
                  const staggerDelay = isMounted ? 0 : index * 0.02;

                  return (
                    <motion.g
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: isFiltered ? 0.15 : 1,
                        scale: hoveredNode === node.id ? 1.15 : 1,
                      }}
                      transform-origin={`${node.x}px ${node.y}px`}
                      transition={{
                        opacity: { duration: 0.2 },
                        scale: { type: "spring", stiffness: 300, damping: 20 },
                        default: { delay: staggerDelay, duration: 0.4, ease: "easeOut" },
                      }}
                      className="interactive-node cursor-pointer group"
                      onMouseEnter={isFiltered ? undefined : (e) => handleNodeMouseEnter(node, e)}
                      onMouseMove={isFiltered ? undefined : (e) => handleNodeMouseMove(node, e)}
                      onMouseLeave={isFiltered ? undefined : handleNodeMouseLeave}
                      onClick={isFiltered ? undefined : () => setSelectedNode(node)}
                    >
                      {/* SELECTED OUTER HIGHLIGHT RING */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.type === "Module" ? 44 : 26}
                          fill="none"
                          stroke="white"
                          strokeOpacity={0.6}
                          strokeWidth={3}
                          className="animate-pulse"
                        />
                      )}

                      {/* NODE SHAPE ENGINE */}
                      {node.type === "Module" ? (
                        <>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={28}
                            fill={color}
                            fillOpacity={hoveredNode === node.id ? 0.3 : 0.15}
                            stroke={color}
                            strokeWidth={2}
                          />
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={36}
                            fill="none"
                            stroke={color}
                            strokeWidth={1.5}
                            strokeOpacity={hoveredNode === node.id ? 0.6 : 0.4}
                          />
                          <text
                            x={node.x}
                            y={node.y}
                            dy={47}
                            className="font-mono text-[10px] font-bold fill-[var(--text-primary)] tracking-tight select-none pointer-events-none"
                            textAnchor="middle"
                          >
                            {node.label}
                          </text>
                        </>
                      ) : node.type === "Feature" ? (
                        <>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={16}
                            fill={color}
                            fillOpacity={hoveredNode === node.id ? 0.3 : 0.15}
                            stroke={color}
                            strokeWidth={1.5}
                          />
                          <text
                            x={node.x}
                            y={node.y}
                            dy={28}
                            className="font-mono text-[9px] fill-[var(--text-secondary)] select-none pointer-events-none"
                            textAnchor="middle"
                          >
                            {node.label}
                          </text>
                        </>
                      ) : node.type === "Decision" ? (
                        <>
                          <rect
                            x={node.x - 14}
                            y={node.y - 14}
                            width={28}
                            height={28}
                            transform={`rotate(45, ${node.x}, ${node.y})`}
                            fill={color}
                            fillOpacity={hoveredNode === node.id ? 0.3 : 0.15}
                            stroke={color}
                            strokeWidth={1.5}
                          />
                          <text
                            x={node.x}
                            y={node.y}
                            dy={29}
                            className="font-mono text-[9px] fill-[var(--text-secondary)] select-none pointer-events-none"
                            textAnchor="middle"
                          >
                            {node.label}
                          </text>
                        </>
                      ) : node.type === "Constraint" ? (
                        <>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={14}
                            fill={color}
                            fillOpacity={hoveredNode === node.id ? 0.3 : 0.15}
                            stroke={color}
                            strokeWidth={1.5}
                          />
                          <text
                            x={node.x}
                            y={node.y}
                            dy={25}
                            className="font-mono text-[9px] fill-[var(--text-secondary)] select-none pointer-events-none"
                            textAnchor="middle"
                          >
                            {node.label}
                          </text>
                        </>
                      ) : (
                        <>
                          {/* Entity shape (rounded rect) */}
                          <rect
                            x={node.x - 18}
                            y={node.y - 10}
                            width={36}
                            height={20}
                            rx={4}
                            fill={color}
                            fillOpacity={hoveredNode === node.id ? 0.3 : 0.15}
                            stroke={color}
                            strokeWidth={1.5}
                          />
                          <text
                            x={node.x}
                            y={node.y}
                            dy={24}
                            className="font-mono text-[9px] fill-[var(--text-secondary)] select-none pointer-events-none"
                            textAnchor="middle"
                          >
                            {node.label}
                          </text>
                        </>
                      )}
                    </motion.g>
                  );
                })}
              </g>
            </g>
          </svg>

          {/* ABSOLUTE FLOATING TOOLTIP */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "absolute",
                  left: tooltip.x,
                  top: tooltip.y,
                  pointerEvents: "none",
                }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2.5 shadow-xl max-w-xs z-30"
                id="tooltip"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-semibold font-sans text-[var(--text-primary)] truncate">
                    {tooltip.node.label}
                  </span>
                  <span className={`text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border font-semibold shrink-0 ${NODE_STYLES[tooltip.node.type]?.badgeClass}`}>
                    {tooltip.node.type}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {tooltip.node.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DETAILS SIDEBAR PANEL */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full md:w-85 shrink-0 border border-[var(--border)] bg-[var(--bg-card)] rounded-2xl p-6 flex flex-col justify-between overflow-y-auto relative"
              id="details-panel"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-surface)] border-none bg-transparent cursor-pointer"
                id="panel-close-btn"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Primary Panel Content */}
              <div className="flex-1">
                {/* Type badge */}
                <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border font-bold inline-block mb-3 ${NODE_STYLES[selectedNode.type]?.badgeClass}`}>
                  {selectedNode.type}
                </span>

                {/* Node heading info */}
                <h2 className="text-lg font-bold font-sans text-[var(--text-primary)] tracking-tight mb-4" id="panel-node-title">
                  {selectedNode.label}
                </h2>

                {/* Description */}
                <div className="mb-6">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold block mb-1.5">
                    Description
                  </span>
                  <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3" id="panel-node-desc">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Status Column */}
                <div className="mb-6">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold block mb-1.5">
                    Indexing Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{selectedNode.status}</span>
                  </span>
                </div>

                {/* Connections List section */}
                <div className="mb-6">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold block mb-2">
                    Graph Connections ({connectedNodesList.length})
                  </span>

                  {connectedNodesList.length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1" id="panel-connections-list">
                      {connectedNodesList.slice(0, 8).map((item, cIndex) => {
                        const styleColor = EDGE_STYLES[item.edge.type]?.color || "var(--accent)";
                        return (
                          <div
                            key={cIndex}
                            onClick={() => setSelectedNode(item.node)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors cursor-pointer group/link select-none"
                            title={`Jump to ${item.node.label}`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-semibold font-sans text-[var(--text-primary)] group-hover/link:text-[var(--accent)] transition-colors block truncate">
                                {item.node.label}
                              </span>
                              <span className="text-[9px] font-mono text-[var(--text-muted)] mt-0.5 block">
                                {item.node.type}
                              </span>
                            </div>
                            <span 
                              className="font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border font-bold shrink-0 text-center"
                              style={{ 
                                color: styleColor, 
                                borderColor: `${styleColor}25`, 
                                backgroundColor: `${styleColor}08` 
                              }}
                            >
                              {item.isOutgoing ? `→ ${item.edge.type.replace("_", " ")}` : `← ${item.edge.type.replace("_", " ")}`}
                            </span>
                          </div>
                        );
                      })}
                      {connectedNodesList.length > 8 && (
                        <div className="text-[10px] font-mono text-[var(--text-muted)] text-center py-1 mt-1">
                          + {connectedNodesList.length - 8} more relationships
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs font-sans text-[var(--text-muted)] italic py-3 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border)] rounded-xl">
                      No immediate relationships mapped
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER METADATA TIP info */}
              <div className="pt-4 border-t border-[var(--border)] flex gap-2 items-start opacity-75" id="panel-bottom-note">
                <HelpCircle className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 mt-0.5" />
                <p className="font-mono text-[9px] text-[var(--text-muted)] leading-relaxed">
                  This node lives in the knowledge graph and is used in document generation and prompt context selection.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LEGEND BAR */}
      <div 
        className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-8 py-3.5 border-t border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md"
        id="graph-legend-bar"
      >
        {/* Left Side: Nodes info */}
        <div className="flex items-center gap-4 flex-wrap" id="legend-nodes">
          <span className="font-mono text-[9px] uppercase text-[var(--text-muted)] font-bold">
            Node Types:
          </span>
          {[
            { label: "Module", color: "#4f8ef7" },
            { label: "Feature", color: "#a78bfa" },
            { label: "Decision", color: "#f59e0b" },
            { label: "Constraint", color: "#f87171" },
            { label: "Entity", color: "#34d399" },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-1.5 text-[10px] font-sans text-[var(--text-secondary)]">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: t.color }} />
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Right Side: Edges info */}
        <div className="flex items-center gap-4 flex-wrap md:ml-auto" id="legend-edges">
          <span className="font-mono text-[9px] uppercase text-[var(--text-muted)] font-bold">
            Edge Types:
          </span>
          {[
            { label: "belongs to", color: "#4f8ef7", dashed: false },
            { label: "depends on", color: "#a78bfa", dashed: true },
            { label: "governs", color: "#f59e0b", dashed: false },
            { label: "constrained by", color: "#f87171", dashed: false },
            { label: "uses", color: "#34d399", dashed: false },
            { label: "conflicts with", color: "#ef4444", dashed: true },
          ].map(e => (
            <div key={e.label} className="flex items-center gap-1.5 text-[10px] font-sans text-[var(--text-secondary)] font-mono">
              <span
                className="w-4 h-[2px] inline-block"
                style={{
                  backgroundColor: e.color,
                  borderTop: e.dashed ? `1.5px dashed ${e.color}` : "none",
                  height: e.dashed ? "0px" : "1.5px"
                }}
              />
              <span className="capitalize">{e.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
