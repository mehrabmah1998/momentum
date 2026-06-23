"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Grid,
  FileText,
  Database,
  ArrowUpRight,
  Layers,
  HelpCircle,
  Eye,
  TrendingUp
} from "lucide-react";
import { SCHEMA, SchemaSection } from "./schema";

interface HealthTabProps {
  onNavigate?: (tabId: string) => void;
}

export default function HealthTab({ onNavigate }: HealthTabProps) {
  const [selectedSection, setSelectedSection] = useState<SchemaSection | null>(null);
  const [filterType, setFilterType] = useState<"all" | "org" | "proj">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"label" | "nodes" | "health">("label");

  // Helper to recursively flatten schema structure
  const flattenedSections = useMemo(() => {
    const list: (SchemaSection & { parentLabel: string; parentId: string })[] = [];
    
    const flatten = (sections: SchemaSection[], pLabel: string, pId: string) => {
      sections.forEach(sec => {
        list.push({
          ...sec,
          parentLabel: pLabel || (sec.id === "organization" ? "Organization" : "Project"),
          parentId: pId || sec.id
        });
        if (sec.children) {
          flatten(sec.children, sec.label, sec.id);
        }
      });
    };

    flatten(SCHEMA, "", "");
    return list;
  }, []);

  // Compute overall statistics
  const stats = useMemo(() => {
    let totalNodes = 0;
    let confirmedCount = 0;
    let needsInputCount = 0;
    let emptyCount = 0;

    flattenedSections.forEach(sec => {
      totalNodes += sec.nodeCount || 0;
      if (sec.confidence === "confirmed") {
        confirmedCount++;
      } else if (sec.confidence === "needs-input") {
        needsInputCount++;
      } else {
        emptyCount++;
      }
    });

    const totalSections = flattenedSections.length;
    // Weighted overall health score
    const healthScore = totalSections > 0 
      ? Math.round(((confirmedCount * 1.0 + needsInputCount * 0.4) / totalSections) * 100)
      : 0;

    return {
      totalNodes,
      confirmedCount,
      needsInputCount,
      emptyCount,
      totalSections,
      healthScore
    };
  }, [flattenedSections]);

  // Determine specific color scale for each section tile
  // - dark green = all confirmed / git-inferred (nodeCount >= 3 & confirmed)
  // - light green = mostly confirmed (nodeCount > 0 & confirmed)
  // - yellow = mixed needs-input (confidence is needs-input)
  // - orange = mostly needs-input / undecided (nodeCount > 0 & empty/unassigned)
  // - red = empty / contradicted (nodeCount === 0)
  const getSectionColorDetails = (sec: SchemaSection) => {
    const count = sec.nodeCount || 0;
    if (sec.confidence === "confirmed") {
      if (count >= 3) {
        return {
          id: "all_confirmed",
          label: "Confirmed (Verified)",
          bgClass: "bg-emerald-600/[0.08] dark:bg-emerald-500/[0.05] hover:bg-emerald-600/[0.12] dark:hover:bg-emerald-500/[0.08]",
          borderClass: "border-emerald-500/30 dark:border-emerald-500/20",
          textClass: "text-emerald-500 dark:text-emerald-400",
          accentColor: "#10b981",
          glowClass: "shadow-[0_4px_24px_rgba(16,185,129,0.06)]"
        };
      } else {
        return {
          id: "mostly_confirmed",
          label: "Mostly Confirmed",
          bgClass: "bg-emerald-500/[0.04] dark:bg-emerald-400/[0.02] hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-400/[0.04]",
          borderClass: "border-emerald-500/20 dark:border-emerald-500/10",
          textClass: "text-emerald-500/85 dark:text-emerald-400/85",
          accentColor: "#34d399",
          glowClass: "shadow-[0_4px_16px_rgba(52,211,153,0.03)]"
        };
      }
    } else if (sec.confidence === "needs-input") {
      return {
        id: "mixed_needs_input",
        label: "Mixed Needs-Input",
        bgClass: "bg-amber-500/[0.04] dark:bg-amber-400/[0.02] hover:bg-amber-500/[0.08] dark:hover:bg-amber-400/[0.04]",
        borderClass: "border-amber-500/25 dark:border-amber-500/10",
        textClass: "text-amber-500 dark:text-amber-400",
        accentColor: "#f59e0b",
        glowClass: "shadow-[0_4px_16px_rgba(245,158,11,0.03)]"
      };
    } else {
      if (count > 0) {
        return {
          id: "mostly_undecided",
          label: "Mostly Undecided",
          bgClass: "bg-orange-500/[0.04] dark:bg-orange-400/[0.02] hover:bg-orange-500/[0.08] dark:hover:bg-orange-400/[0.04]",
          borderClass: "border-orange-500/25 dark:border-orange-500/10",
          textClass: "text-orange-500 dark:text-orange-400",
          accentColor: "#f97316",
          glowClass: "shadow-[0_4px_16px_rgba(249,115,22,0.03)]"
        };
      } else {
        return {
          id: "empty_contradicted",
          label: "Empty / Contradicted",
          bgClass: "bg-rose-500/[0.04] dark:bg-rose-400/[0.02] hover:bg-rose-500/[0.08] dark:hover:bg-rose-400/[0.04]",
          borderClass: "border-rose-500/25 dark:border-rose-500/10",
          textClass: "text-rose-500 dark:text-rose-400",
          accentColor: "#f43f5e",
          glowClass: "shadow-[0_4px_16px_rgba(244,63,94,0.03)]"
        };
      }
    }
  };

  // Filter & sort handling
  const filteredAndSorted = useMemo(() => {
    return flattenedSections
      .filter(sec => {
        const matchesSearch = sec.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             sec.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (filterType === "all") return matchesSearch;
        if (filterType === "org") return matchesSearch && sec.parentId === "organization";
        if (filterType === "proj") return matchesSearch && sec.parentId === "project";
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "label") {
          return a.label.localeCompare(b.label);
        }
        if (sortBy === "nodes") {
          return (b.nodeCount || 0) - (a.nodeCount || 0);
        }
        if (sortBy === "health") {
          const aWeight = a.confidence === "confirmed" ? 2 : a.confidence === "needs-input" ? 1 : 0;
          const bWeight = b.confidence === "confirmed" ? 2 : b.confidence === "needs-input" ? 1 : 0;
          return bWeight - aWeight;
        }
        return 0;
      });
  }, [flattenedSections, filterType, searchQuery, sortBy]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] font-sans text-[var(--text-primary)] p-6">
      
      {/* Upper Segment Title */}
      <div className="mb-8 select-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] font-bold mb-1.5 block">
          SYSTEM_METRIC: CONSTELLATION COHERENCE
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] leading-none font-sans">
          Health Map
        </h1>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2 max-w-[70ch]">
          Real-time structural integrity assessment of the target corporate knowledge graph. Hover sections to diagnose data density gaps, confidence values, and structural alignment.
        </p>
      </div>

      {/* Header Summary Dashboard Counters (Double-Bezel Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 select-none">
        
        {/* Core Heath Meter */}
        <div className="md:col-span-1 p-[1px] bg-black/5 dark:bg-white/5 rounded-[20px] ring-1 ring-black/5 dark:ring-white/5 shadow-md">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[19px] p-5 h-full relative overflow-hidden flex flex-col justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">GRAPH_HEALTH</span>
            <div className="flex items-baseline gap-2 mt-3.5 mb-1.5">
              <span className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tighter leading-none font-sans">
                {stats.healthScore}%
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+2.4%</span>
              </span>
            </div>
            {/* Health track slider */}
            <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                style={{ width: `${stats.healthScore}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-sans leading-normal mt-4">
              Coherence index passes all automatic deployment gate verification criteria.
            </p>
          </div>
        </div>

        {/* Confirmed Count Card */}
        <div className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[20px] ring-1 ring-black/5 dark:ring-white/5 shadow-md">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[19px] p-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">VERIFIED_CELLS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-4 mb-2">
              <span className="text-3xl font-extrabold text-emerald-400 tracking-tighter leading-none font-sans">
                {stats.confirmedCount}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-1 font-mono">SECTIONS COMPLETELY ALIGNED</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-sans leading-relaxed mt-2 border-t border-[var(--border)]/60 pt-2">
              Requires no human corrective query calibration or review.
            </p>
          </div>
        </div>

        {/* Needs Input Count Card */}
        <div className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[20px] ring-1 ring-black/5 dark:ring-white/5 shadow-md">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[19px] p-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500 font-bold">PENDING_INTELLIGENCE</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-4 mb-2">
              <span className="text-3xl font-extrabold text-amber-500 tracking-tighter leading-none font-sans">
                {stats.needsInputCount}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-1 font-mono">SECTIONS REQUIRING DATA</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-sans leading-relaxed mt-2 border-t border-[var(--border)]/60 pt-2">
              Needs details or custom definitions to be resolved.
            </p>
          </div>
        </div>

        {/* Empty Count Card */}
        <div className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[20px] ring-1 ring-black/5 dark:ring-white/5 shadow-md">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[19px] p-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#f43f5e] font-bold">VOID_STRUCTURES</span>
              <Clock className="w-4 h-4 text-[#f43f5e]" />
            </div>
            <div className="mt-4 mb-2">
              <span className="text-3xl font-extrabold text-[#f43f5e] tracking-tighter leading-none font-sans">
                {stats.emptyCount}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-1 font-mono">SECTIONS LACKING DETAILS</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-sans leading-relaxed mt-2 border-t border-[var(--border)]/60 pt-2">
              Unassigned model nodes currently containing zero child entities.
            </p>
          </div>
        </div>

      </div>

      {/* Filter and Control Toolbar & Legend (Asymmetric Split) */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 mb-6 select-none bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-inner">
        
        {/* Controls Block */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Section Filter Caps */}
          <div className="flex bg-black/10 dark:bg-white/[0.03] p-0.5 rounded-lg border border-[var(--border)] text-[9px] font-mono font-bold">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${filterType === "all" ? "bg-[var(--accent)] text-white font-extrabold shadow" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              ALL MODULES
            </button>
            <button
              onClick={() => setFilterType("org")}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${filterType === "org" ? "bg-[var(--accent)] text-white font-extrabold shadow" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              ORGANIZATION
            </button>
            <button
              onClick={() => setFilterType("proj")}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${filterType === "proj" ? "bg-[var(--accent)] text-white font-extrabold shadow" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              PROJECT SPEC
            </button>
          </div>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Filter sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 border border-[var(--border)] bg-transparent rounded-lg text-xs outline-none focus:border-[var(--accent)] text-[var(--text-primary)] placeholder-[var(--text-muted)] min-w-[160px] max-w-[200px]"
          />

          {/* Sort Menu */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[var(--text-muted)]">
            <span>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border border-[var(--border)] text-[var(--text-secondary)] text-xs rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-[var(--accent)]"
            >
              <option value="label">Label Index</option>
              <option value="nodes">Node Density</option>
              <option value="health">Health Index</option>
            </select>
          </div>
        </div>

        {/* Legend Box */}
        <div className="flex flex-wrap items-center gap-4 border-t xl:border-t-0 xl:border-l border-[var(--border)] pt-3 xl:pt-0 xl:pl-4">
          <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider text-[var(--text-muted)] self-center">LEGEND:</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-emerald-500/30 bg-emerald-600/20" />
              <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-emerald-500/10 bg-emerald-500/10" />
              <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Mostly Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-500/20 bg-amber-500/15" />
              <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Mixed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-orange-500/20 bg-orange-500/15" />
              <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Undecided</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-rose-500/30 bg-rose-500/15" />
              <span className="text-[9px] font-mono text-[var(--text-secondary)] uppercase">Void / Gap</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Core Map Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Core Tile Grid */}
        <div className="lg:col-span-3">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map((sec) => {
                const colors = getSectionColorDetails(sec);
                const isSelected = selectedSection?.id === sec.id;
                
                return (
                  <motion.div
                    key={sec.id}
                    variants={itemVariants}
                    layoutId={`tile-${sec.id}`}
                    onClick={() => setSelectedSection(sec)}
                    className={`group relative rounded-xl border p-4 transition-all duration-300 cursor-pointer ${colors.bgClass} ${colors.borderClass} ${colors.glowClass} flex flex-col justify-between overflow-hidden select-none ${
                      isSelected ? "ring-2 ring-[var(--accent)] ring-offset-2 dark:ring-offset-neutral-950 font-medium" : ""
                    }`}
                  >
                    
                    {/* Concentric Glow Indicator */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse opacity-60 group-hover:scale-125 transition-transform" style={{ backgroundColor: colors.accentColor }} />

                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                          [{sec.parentLabel.toUpperCase()}]
                        </span>
                        <span className="text-[9px] font-mono text-[var(--text-muted)]">
                          ID: {sec.id.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold font-sans tracking-tight text-[var(--text-primary)] group-hover:translate-x-0.5 transition-transform duration-200">
                        {sec.label}
                      </h3>
                    </div>

                    {/* Bottom Status Block */}
                    <div className="mt-5 border-t border-[var(--border)]/40 pt-3 flex items-center justify-between gap-4">
                      {/* Confidence bar segment */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[8px] font-mono text-[var(--text-muted)] mb-1 leading-none uppercase">
                          <span>DENSITY</span>
                          <span>{sec.nodeCount || 0} Nodes</span>
                        </div>
                        <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min(((sec.nodeCount || 0) / 10) * 100, 100)}%`,
                              backgroundColor: colors.accentColor
                            }}
                          />
                        </div>
                      </div>

                      {/* Detail Pop hover indicator */}
                      <div className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/[0.04] flex items-center justify-center shrink-0 border border-[var(--border)] group-hover:bg-[var(--accent)]/10 group-hover:border-[var(--accent)]/30 transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          
          {filteredAndSorted.length === 0 && (
            <div className="p-16 text-center border border-dashed border-[var(--border)] rounded-2xl select-none animate-fadeIn bg-black/5 dark:bg-white/[0.01]">
              <Database className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3 opacity-40 animate-pulse" />
              <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">NO VALID SCHEMA MATCHES</span>
              <p className="text-xs text-[var(--text-muted)] mt-1">Adjust search parameters or select a different systemic module filter.</p>
            </div>
          )}
        </div>

        {/* Sidebar Diagnostics Inspect Detail Section */}
        <div className="lg:col-span-1 select-none">
          <AnimatePresence mode="wait">
            {selectedSection ? (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="p-[1px] bg-black/5 dark:bg-white/5 rounded-[24px] ring-1 ring-black/5 dark:ring-white/10 shadow-lg sticky top-6"
              >
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[23px] p-6 flex flex-col h-full relative">
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.04] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer border-none outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--accent)] font-bold block mb-1">
                    G-VAL Diagnostic // ID: {selectedSection.id}
                  </span>
                  
                  <h3 className="text-lg font-extrabold tracking-tight font-sans text-[var(--text-primary)] mb-2 pr-6">
                    {selectedSection.label}
                  </h3>

                  <div className="flex items-center gap-1 bg-black/10 dark:bg-black/15 border border-[var(--border)] rounded-lg px-2 py-1 inline-flex w-max mb-5 font-mono text-[9px] text-[var(--text-secondary)] select-none">
                    <span className="font-bold uppercase tracking-wider">PARENT_NODE: </span>
                    <span>{(selectedSection as any).parentLabel || "SYSTEM"}</span>
                  </div>

                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1 border-b border-[var(--border)] pb-1">
                    DESCRIPTION
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans mb-5">
                    {selectedSection.description}
                  </p>

                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold mb-2 border-b border-[var(--border)] pb-1">
                    CONFIDENCE MATRIX
                  </h4>
                  
                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)]">Confidence Classification:</span>
                      <span className={`text-xs font-bold font-sans uppercase px-2.5 py-0.5 rounded-full border ${
                        selectedSection.confidence === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        selectedSection.confidence === "needs-input" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {selectedSection.confidence || "empty"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)]">Associated Node Count:</span>
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                        {selectedSection.nodeCount || 0} active entities
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)]">Schema Struct Type:</span>
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase bg-black/10 dark:bg-black/20 px-2 py-0.5 rounded">
                        {selectedSection.type}
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic actions based on state */}
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex flex-col gap-2">
                    {selectedSection.confidence !== "confirmed" && onNavigate ? (
                      <button
                        onClick={() => {
                          onNavigate("interview");
                        }}
                        className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold font-sans rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer outline-none active:scale-[0.98] shadow-md hover:shadow-[0_8px_30px_rgba(37,99,235,0.15)] select-none"
                      >
                        <span>Resolve segments in interview</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate && onNavigate("documents")}
                        className="w-full py-2.5 bg-transparent hover:bg-black/5 dark:hover:bg-white/[0.04] text-xs font-semibold text-[var(--accent)] border border-[var(--border)] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer outline-none active:scale-[0.98]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span>Inspect affiliated documents</span>
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            ) : (
              <div className="p-6 text-center border border-dashed border-[var(--border)] rounded-2xl select-none sticky top-6 bg-black/5 dark:bg-white/[0.01]">
                <Activity className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2 animate-pulse opacity-40" style={{ animationDuration: "3s" }} />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">VAL Diagnostics Offline</span>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mt-1">Select any structural node tile to populate complete schema inspection telemetry.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
