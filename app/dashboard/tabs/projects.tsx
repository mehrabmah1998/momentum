"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FolderGit2,
  ChevronDown,
  Plus,
  ArrowRight,
  GitPullRequest,
  CheckCircle2,
  X,
  FileText,
  Network,
  Clock,
  Sparkles
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  completeness: number;
  docStatus: "KNOWLEDGE COMPLETE" | "DOCS STALE" | "EXTRACTION NEEDED" | "NEVER EXTRACTED";
  repo: string;
  lastGenerated: string;
  lastActivity: string;
  techStack: string[];
  color: string;
}

const mockProjects: Project[] = [
  {
    id: "momentum-core",
    name: "Momentum Core",
    description: "Main monorepo containing the Next.js frontend, Python extraction workers, and graph database schemas.",
    completeness: 87,
    docStatus: "DOCS STALE",
    repo: "github.com/buildwithmomentum/core · main",
    lastGenerated: "3 days ago",
    lastActivity: "2h ago",
    techStack: ["Next.js", "Python", "Neo4j"],
    color: "#06B6D4",
  },
  {
    id: "chrome-extension",
    name: "Context Capture Extension",
    description: "Browser extension that intercepts and formats developer reading history for the knowledge graph.",
    completeness: 100,
    docStatus: "KNOWLEDGE COMPLETE",
    repo: "github.com/buildwithmomentum/extension · master",
    lastGenerated: "Just now",
    lastActivity: "Just now",
    techStack: ["React", "TypeScript", "Chrome API"],
    color: "#10B981",
  },
  {
    id: "pricing-engine",
    name: "Stripe Billing Engine",
    description: "Standalone service for handling usage-based billing, webhooks, and subscription metered plans.",
    completeness: 42,
    docStatus: "EXTRACTION NEEDED",
    repo: "github.com/buildwithmomentum/billing · main",
    lastGenerated: "Never",
    lastActivity: "Yesterday",
    techStack: ["Node.js", "Stripe", "PostgreSQL"],
    color: "#F59E0B",
  },
  {
    id: "marketing-site",
    name: "Marketing & Blog",
    description: "Public facing landing pages, blog using MDX, and documentation site.",
    completeness: 0,
    docStatus: "NEVER EXTRACTED",
    repo: "github.com/buildwithmomentum/site · main",
    lastGenerated: "Never",
    lastActivity: "5 days ago",
    techStack: ["Next.js", "Tailwind", "MDX"],
    color: "#EF4444",
  }
];

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProjectId, setActiveProjectId] = useState("momentum-core");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showSwitcherDropdown, setShowSwitcherDropdown] = useState(false);
  
  // Modal state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRepo, setNewRepo] = useState("");

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const otherProjects = projects.filter(p => p.id !== activeProjectId);
  const activeKnowledgeCount = projects.filter(p => ["KNOWLEDGE COMPLETE", "DOCS STALE"].includes(p.docStatus)).length;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const proj: Project = {
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      description: newDesc || "No description provided.",
      completeness: 0,
      docStatus: "NEVER EXTRACTED",
      repo: newRepo || "No repository connected",
      lastGenerated: "Never",
      lastActivity: "Just now",
      techStack: ["Draft"],
      color: "#6B7280"
    };

    setProjects([proj, ...projects]);
    setActiveProjectId(proj.id);
    setNewName("");
    setNewDesc("");
    setNewRepo("");
    setShowNewProjectModal(false);
  };

  const getStatusColor = (status: Project["docStatus"]) => {
    switch (status) {
      case "KNOWLEDGE COMPLETE": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "DOCS STALE": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "EXTRACTION NEEDED": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "NEVER EXTRACTED": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  if (projects.length === 0) {
    return (
      <div className="w-full max-w-7xl xl:max-w-[1500px] 2xl:max-w-[1700px] mx-auto px-6 md:px-10 py-10 relative">
        <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center mb-6">
            <FolderGit2 className="w-8 h-8 text-[var(--accent)]/60" />
          </div>
          <h2 className="text-2xl font-bold font-sans text-[var(--text-primary)] tracking-tight mb-2">
            No projects yet
          </h2>
          <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8 leading-relaxed">
            Create your first project to start building your knowledge base. Momentum will extract and structure your context.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewProjectModal(true)}
            className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold uppercase tracking-wider px-8 py-4 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-all cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showNewProjectModal && <NewProjectModal onClose={() => setShowNewProjectModal(false)} onSubmit={handleCreateProject} newName={newName} setNewName={setNewName} newDesc={newDesc} setNewDesc={setNewDesc} newRepo={newRepo} setNewRepo={setNewRepo} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl xl:max-w-[1500px] 2xl:max-w-[1700px] mx-auto px-6 md:px-10 py-10 relative">
      
      {/* PAGE HEADER */}
      <div className="flex items-start justify-between mb-8 pr-48">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold mb-2">
            PROJECTS
          </div>
          <h1 className="text-3xl font-bold font-sans text-[var(--text-primary)] tracking-tight mb-2">
            Your Projects
          </h1>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            {projects.length} projects · {activeKnowledgeCount} with active knowledge extraction
          </p>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewProjectModal(true)}
            className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-all cursor-pointer border-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </motion.button>
        </div>
      </div>

      {/* ACTIVE PROJECT BANNER */}
      {activeProject && (
        <div className="mb-10 relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[var(--accent)]/40 to-transparent rounded-[2rem] opacity-50 blur-sm pointer-events-none" />
          <div className="bg-[var(--bg-card)] border border-[var(--accent)]/30 rounded-[2rem] p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-[var(--accent)]/50 to-transparent" />
            <div className="absolute left-0 inset-y-0 w-1 bg-[var(--accent)]" />
            
            <div className="flex-1 min-w-0 pl-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[var(--accent)]">ACTIVE PROJECT</span>
                <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border font-bold ${getStatusColor(activeProject.docStatus)}`}>
                  {activeProject.docStatus}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2 truncate">
                {activeProject.name}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-5 max-w-2xl line-clamp-2 leading-relaxed">
                {activeProject.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] hover:bg-white text-xs font-bold rounded-full transition-colors flex items-center gap-2">
                  <span>Open Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
                <button className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-xs font-semibold rounded-full transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Generate Docs</span>
                </button>
                <button className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-xs font-semibold rounded-full transition-colors flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>Plan Feature</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center shrink-0 pr-4">
              {/* Circular Progress Indicator for Completeness */}
              <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-surface)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="40" fill="transparent" 
                    stroke="var(--accent)" strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={251.2} 
                    strokeDashoffset={251.2 - (251.2 * activeProject.completeness) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-[var(--text-primary)]">{activeProject.completeness}%</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider text-center">
                Knowledge<br/>Extracted
              </div>
              <div className="mt-4 text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 opacity-80">
                <Clock className="w-3 h-3" />
                <span>Last worked on {activeProject.lastActivity}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS GRID */}
      {otherProjects.length > 0 && (
        <>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold mb-4">
            Other Projects
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {otherProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[1.5rem] p-6 hover:border-[var(--border-hover)] transition-colors flex flex-col justify-between group h-full"
              >
                {/* TOP ROW */}
                <div className="mb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border)] font-bold text-lg font-mono" style={{ backgroundColor: proj.color + "15", color: proj.color }}>
                        {proj.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{proj.name}</h3>
                        <div className="flex gap-1.5 mt-1">
                          {proj.techStack.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)] font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border font-bold shrink-0 ${getStatusColor(proj.docStatus)}`}>
                      {proj.docStatus}
                    </span>
                  </div>
                </div>

                {/* MIDDLE ROW */}
                <div className="mb-6 space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                      <span className="text-[var(--text-secondary)]">Knowledge Completeness</span>
                      <span className="font-mono text-[var(--text-primary)]">{proj.completeness}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: proj.completeness + "%", backgroundColor: proj.color }} />
                    </div>
                  </div>
                  
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Docs · Last generated {proj.lastGenerated}</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 font-mono">
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span className="truncate">{proj.repo}</span>
                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] gap-2">
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveProjectId(proj.id)} className="px-3 py-1.5 bg-[var(--text-primary)] hover:bg-white text-[var(--bg)] text-[11px] font-bold rounded-lg transition-colors leading-none">
                      Open
                    </motion.button>
                    <button className="px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-[11px] font-semibold rounded-lg transition-colors leading-none">
                      Generate
                    </button>
                    <button className="px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-primary)] text-[11px] font-semibold rounded-lg transition-colors leading-none hidden sm:block">
                      Plan
                    </button>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono text-right whitespace-nowrap shrink-0">
                    Active {proj.lastActivity}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* NEW PROJECT MODAL */}
      <AnimatePresence>
        {showNewProjectModal && <NewProjectModal onClose={() => setShowNewProjectModal(false)} onSubmit={handleCreateProject} newName={newName} setNewName={setNewName} newDesc={newDesc} setNewDesc={setNewDesc} newRepo={newRepo} setNewRepo={setNewRepo} />}
      </AnimatePresence>
    </div>
  );
}

function NewProjectModal({ onClose, onSubmit, newName, setNewName, newDesc, setNewDesc, newRepo, setNewRepo }: any) {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2rem] p-6 sm:p-8 w-full max-w-lg shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2 rounded-xl hover:bg-[var(--bg-surface)] border-none bg-transparent cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center mb-5">
            <Plus className="w-6 h-6 text-[var(--text-primary)]" />
          </div>
          <h2 className="text-2xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
            Create New Project
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">Connect a repository and start extracting knowledge.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-2">
              Project Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Core Mono Repo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-xl px-4 py-3.5 text-sm outline-none w-full text-[var(--text-primary)] placeholder-gray-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-2">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="What is this project?"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] rounded-xl px-4 py-3.5 text-sm outline-none w-full text-[var(--text-primary)] placeholder-gray-500 resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-2 flex items-center justify-between">
              <span>Connect Repository</span>
              <button type="button" className="text-[var(--accent)] hover:underline capitalize text-[10px]">
                Connect GitHub App
              </button>
            </label>
            <input
              type="text"
              placeholder="https://github.com/organization/repo"
              value={newRepo}
              onChange={(e) => setNewRepo(e.target.value)}
              className="bg-[var(--bg-[var(--bg-surface)])] border border-[var(--border)] focus:border-[var(--accent)] rounded-xl px-4 py-3.5 text-sm outline-none w-full text-[var(--text-primary)] placeholder-gray-500 transition-colors font-mono"
            />
          </div>
          
          <div>
            <label className="block text-[11px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-2">
              Tech Stack
            </label>
            <input
              type="text"
              placeholder="e.g. Next.js, FastAPI, PostgreSQL (comma separated)"
              className="bg-[var(--bg-[var(--bg-surface)])] border border-[var(--border)] focus:border-[var(--accent)] rounded-xl px-4 py-3.5 text-sm outline-none w-full text-[var(--text-primary)] placeholder-gray-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-3 px-5 rounded-full border-none bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!newName.trim()}
              className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Create & Start Extraction</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
