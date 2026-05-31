"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitBranch,
  Network,
  FileText,
  Plus,
  Clock,
  X
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  nodes: number;
  documents: number;
  lastUpdated: string;
  status: string;
  color: string;
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "momentum-core",
      name: "Momentum Core",
      description: "Primary knowledge base for product architecture, decisions, and technical documentation.",
      nodes: 412,
      documents: 67,
      lastUpdated: "2 hours ago",
      status: "active",
      color: "var(--accent)",
    },
    {
      id: "research-archive",
      name: "Research Archive",
      description: "Collection of research papers, competitive analysis, and market insights.",
      nodes: 289,
      documents: 43,
      lastUpdated: "Yesterday",
      status: "active",
      color: "#a78bfa",
    },
    {
      id: "personal-notes",
      name: "Personal Notes",
      description: "Private workspace for personal knowledge, ideas, and scratch notes.",
      nodes: 146,
      documents: 14,
      lastUpdated: "3 days ago",
      status: "idle",
      color: "#34d399",
    },
  ]);

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: Project = {
      id: name.toLowerCase().trim().replace(/\s+/g, "-"),
      name: name.trim(),
      description: description.trim() || "No description provided.",
      nodes: 0,
      documents: 0,
      lastUpdated: "Just now",
      status: "active",
      color: "var(--accent)",
    };

    setProjects([...projects, newProject]);
    setName("");
    setDescription("");
    setShowNewProjectModal(false);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering any card-clicks
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Derivative metrics
  const totalProjects = projects.length;
  const totalNodes = projects.reduce((acc, p) => acc + p.nodes, 0);
  const totalDocuments = projects.reduce((acc, p) => acc + p.documents, 0);

  return (
    <div className="w-full px-8 py-8 relative" id="projects-tab-root">
      {/* Page header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8" id="projects-header-row">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] px-2.5 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] font-bold inline-block" id="projects-label">
            Projects
          </span>
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] mt-3 tracking-tight" id="projects-title">
            Your Projects
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mt-1" id="projects-subtitle">
            Organize your knowledge into focused workspaces.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowNewProjectModal(true)}
          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-all cursor-pointer border-none"
          id="btn-new-project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Stats row */}
      {totalProjects > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" id="projects-stats-row">
          {[
            { label: "Total Projects", value: totalProjects, icon: GitBranch },
            { label: "Active Nodes", value: totalNodes, icon: Network },
            { label: "Documents", value: totalDocuments, icon: FileText },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-5 py-4 relative overflow-hidden flex flex-col justify-between"
                id={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />
                <div className="flex items-center justify-between" id={`stat-header-${index}`}>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] font-bold">
                    {stat.label}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/[0.08] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                </div>
                <div className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-3" id={`stat-val-${index}`}>
                  {stat.value.toLocaleString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Section label */}
      {totalProjects > 0 && (
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold mb-4" id="section-label-all-workspaces">
          All Workspaces
        </div>
      )}

      {/* Projects Grid / Empty State */}
      {totalProjects > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="projects-list-grid">
          {projects.map((proj, index) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 cursor-pointer relative overflow-hidden hover:border-[var(--border-hover)] transition-colors duration-200 group flex flex-col justify-between min-h-[180px]"
              id={`project-card-${proj.id}`}
            >
              {/* Left accent strip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                style={{ backgroundColor: proj.color }}
              />

              {/* Main content wrapper */}
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-2" id={`proj-card-header-${proj.id}`}>
                  <h3 className="text-base font-semibold font-sans text-[var(--text-primary)] tracking-tight">
                    {proj.name}
                  </h3>
                  <div className="flex items-center gap-2" id={`proj-badge-row-${proj.id}`}>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border font-bold ${
                        proj.status === "active"
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : "text-[var(--text-muted)] bg-[var(--bg-surface)] border-[var(--border)]"
                      }`}
                    >
                      {proj.status}
                    </span>
                    {/* Trash bin to delete workspace and test empty state */}
                    <button
                      onClick={(e) => handleDeleteProject(proj.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-rose-500/10 hover:text-rose-400 transition-all text-[var(--text-muted)] cursor-pointer border-none bg-transparent"
                      title="Delete Workspace"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-sans text-[var(--text-muted)] line-clamp-2 leading-relaxed" id={`proj-card-desc-${proj.id}`}>
                  {proj.description}
                </p>
              </div>

              {/* Stats row */}
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs" id={`proj-card-stats-${proj.id}`}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-sans" id={`nodes-stat-${proj.id}`}>
                    <Network className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="font-mono text-xs text-[var(--text-primary)] font-semibold">{proj.nodes}</span>
                    <span className="text-[var(--text-muted)] text-[11px]">nodes</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-sans" id={`docs-stat-${proj.id}`}>
                    <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="font-mono text-xs text-[var(--text-primary)] font-semibold">{proj.documents}</span>
                    <span className="text-[var(--text-muted)] text-[11px]">docs</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]" id={`last-updated-${proj.id}`}>
                  <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>{proj.lastUpdated}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-2xl relative overflow-hidden" id="projects-empty-state">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent" />
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center mb-4">
            <GitBranch className="w-6 h-6 text-[var(--text-muted)]/60" />
          </div>
          <h3 className="text-base font-bold font-sans text-[var(--text-primary)]" id="empty-title">
            No projects yet
          </h3>
          <p className="text-sm text-[var(--text-muted)] font-sans max-w-sm mt-1 mb-6" id="empty-desc">
            Create your first project to get started.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewProjectModal(true)}
            className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-all cursor-pointer border-none"
            id="empty-btn-create"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </motion.button>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      <AnimatePresence>
        {showNewProjectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="modal-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
              id="modal-card"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-surface)] border-none bg-transparent cursor-pointer"
                id="modal-close-btn"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-lg font-bold font-sans text-[var(--text-primary)] tracking-tight mb-4" id="modal-title">
                New Project
              </h2>

              <form onSubmit={handleCreateProject} className="space-y-5" id="new-project-form">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-1.5" htmlFor="project-name-input">
                    Project Name
                  </label>
                  <input
                    id="project-name-input"
                    type="text"
                    required
                    placeholder="e.g. My Workspace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] py-3 text-sm focus:outline-none w-full text-[var(--text-primary)] placeholder-gray-500 transition-colors bg-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-1.5" htmlFor="project-desc-input">
                    Description
                  </label>
                  <textarea
                    id="project-desc-input"
                    rows={3}
                    placeholder="Short description of this project's purpose..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] py-3 text-sm focus:outline-none w-full text-[var(--text-primary)] placeholder-gray-500 resize-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]" id="modal-button-row">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewProjectModal(false);
                      setName("");
                      setDescription("");
                    }}
                    className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-2.5 px-4 rounded-full border-none bg-transparent cursor-pointer"
                    id="modal-cancel-btn"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={!name.trim()}
                    className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                    id="modal-submit-btn"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Project</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
