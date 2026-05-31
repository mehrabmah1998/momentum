"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Building2,
  Plug,
  Users,
  CreditCard,
  AlertTriangle,
  Check,
  MoreHorizontal,
  Info,
  Sparkles,
  Eye,
  MessageSquare,
  Github,
  Plus,
} from "lucide-react";

type SettingsSection = "account" | "organization" | "integrations" | "team" | "billing" | "danger";

type TeamRole = "Owner" | "Admin" | "Member" | "Viewer";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarInitial: string;
  joinedAt: string;
  status: "active" | "invited";
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Alex Morgan", email: "alex@buildwithmomentum.io", role: "Owner", avatarInitial: "A", joinedAt: "May 2026", status: "active" },
  { id: "2", name: "Sam Rivera", email: "sam@buildwithmomentum.io", role: "Admin", avatarInitial: "S", joinedAt: "May 2026", status: "active" },
  { id: "3", name: "Jordan Lee", email: "jordan@buildwithmomentum.io", role: "Member", avatarInitial: "J", joinedAt: "May 2026", status: "active" },
  { id: "4", name: "Taylor Kim", email: "taylor@buildwithmomentum.io", role: "Viewer", avatarInitial: "T", joinedAt: "Invited", status: "invited" },
];

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");
  const [saved, setSaved] = useState(false);

  // Editable Form fields
  const [displayName, setDisplayName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@buildwithmomentum.io");
  const [orgName, setOrgName] = useState("BuildWithMomentum");
  const [orgMission, setOrgMission] = useState("Help technical founders maintain a single source of truth that makes AI tools dramatically more effective.");
  const [orgIndustry, setOrgIndustry] = useState("Developer Tools");
  const [orgWebsite, setOrgWebsite] = useState("https://buildwithmomentum.io");
  const [inviteEmail, setInviteEmail] = useState("");

  // Stateful toggles for Preferences
  const [prefEmailNotifications, setPrefEmailNotifications] = useState(true);
  const [prefAutoSave, setPrefAutoSave] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const menuItems: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "account", label: "Account", icon: User },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "team", label: "Team", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
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
    <div className="w-full flex flex-col min-h-screen bg-[var(--bg)] font-sans" id="settings-root">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 pt-8 pb-6" id="settings-header">
        <div className="flex flex-col gap-1">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0 }}
            className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--accent)] px-3 py-1 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/[0.08] font-bold inline-block w-fit"
          >
            Settings
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
            className="text-2xl font-bold font-sans text-[var(--text-primary)] mt-2 tracking-tight"
            id="settings-page-title"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="text-sm text-[var(--text-muted)] font-sans mt-1"
          >
            Manage your account, organization, integrations, and team.
          </motion.p>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 px-4 md:px-8 pb-8" id="settings-body-container">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-52 shrink-0 lg:pr-6 mb-6 lg:mb-0 flex flex-col gap-1.5" id="settings-left-sidebar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isDanger = item.id === "danger";

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium font-sans transition-colors duration-200 w-full text-left bg-transparent relative border border-transparent focus:outline-none ${
                  isActive
                    ? isDanger
                      ? "text-red-400 font-semibold"
                      : "text-[var(--accent)] font-semibold"
                    : isDanger
                      ? "text-red-400/70 hover:text-red-400"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                id={`settings-nav-${item.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="settingsActive"
                    className={`absolute inset-0 rounded-lg -z-10 border ${
                      isDanger
                        ? "bg-red-500/[0.08] border-red-500/20"
                        : "bg-[var(--accent)]/[0.08] border-[var(--accent)]/20"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDanger ? "text-red-400" : "text-[var(--accent)]") : "text-current"}`} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 min-w-0" id="settings-right-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-full"
              id={`settings-section-${activeSection}`}
            >
              
              {/* Account Section */}
              {activeSection === "account" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                      Account Profile
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Your personal display information visible to your team.
                    </p>
                  </div>

                  {/* Card 1 - Identity */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 relative">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[var(--accent)]/[0.12] border-2 border-[var(--accent)]/25 flex items-center justify-center font-mono text-xl font-bold text-[var(--accent)]">
                        {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)]">Profile Avatar</div>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Auto-generated from your display name.</p>
                      </div>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-lg px-3 py-2 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
                          placeholder="Your display name"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-lg px-3 py-2 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
                          placeholder="Your email address"
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end mt-2">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white uppercase tracking-wider text-xs font-semibold py-2.5 px-6 shadow-[0_4px_20px_-4px_var(--accent-glow)] cursor-pointer select-none border-none flex items-center gap-1.5"
                          id="account-save-btn"
                        >
                          {saved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved ✓</span>
                            </>
                          ) : (
                            <span>Save Changes</span>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </div>

                  {/* Card 2 - Preferences */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mt-1">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 tracking-tight">
                      Preferences
                    </h3>
                    
                    <div className="flex flex-col gap-2">
                      {/* Preference Row 1 */}
                      <div className="flex items-center justify-between py-3 border-b border-[var(--border)]/40 last:border-0">
                        <div>
                          <div className="text-sm font-medium text-[var(--text-primary)]">Email Notifications</div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">Receive digest of knowledge graph changes</p>
                        </div>
                        <div
                          onClick={() => setPrefEmailNotifications(!prefEmailNotifications)}
                          className={`w-10 h-5.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center p-0.5 ${
                            prefEmailNotifications
                              ? "bg-[var(--accent)]/[0.15] border-[var(--accent)]/30 justify-end"
                              : "bg-[var(--bg-surface)] border-[var(--border)] justify-start"
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`w-4 h-4 rounded-full ${prefEmailNotifications ? "bg-[var(--accent)]" : "bg-[var(--text-muted)]"}`}
                          />
                        </div>
                      </div>

                      {/* Preference Row 2 */}
                      <div className="flex items-center justify-between py-3 border-b border-[var(--border)]/40 last:border-0">
                        <div>
                          <div className="text-sm font-medium text-[var(--text-primary)]">Auto-save Drafts</div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">Save document edits automatically every 30s</p>
                        </div>
                        <div
                          onClick={() => setPrefAutoSave(!prefAutoSave)}
                          className={`w-10 h-5.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center p-0.5 ${
                            prefAutoSave
                              ? "bg-[var(--accent)]/[0.15] border-[var(--accent)]/30 justify-end"
                              : "bg-[var(--bg-surface)] border-[var(--border)] justify-start"
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`w-4 h-4 rounded-full ${prefAutoSave ? "bg-[var(--accent)]" : "bg-[var(--text-muted)]"}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Section */}
              {activeSection === "organization" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                      Organization Profile
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Core identity shared across all projects. Used to ground AI prompts and document tone.
                    </p>
                  </div>

                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 relative">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />
                    
                    <form onSubmit={handleSave} className="flex flex-col gap-4">
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-lg px-3 py-2 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
                          placeholder="Organization name"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold">
                          Mission Statement
                        </label>
                        <textarea
                          value={orgMission}
                          onChange={(e) => setOrgMission(e.target.value)}
                          className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-lg px-3 py-2 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full resize-none h-20 leading-relaxed font-sans"
                          placeholder="Organization mission statement"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold">
                            Industry
                          </label>
                          <input
                            type="text"
                            value={orgIndustry}
                            onChange={(e) => setOrgIndustry(e.target.value)}
                            className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-lg px-3 py-2 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
                            placeholder="Industry vertical"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold">
                            Website
                          </label>
                          <input
                            type="text"
                            value={orgWebsite}
                            onChange={(e) => setOrgWebsite(e.target.value)}
                            className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-lg px-3 py-2 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full"
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      {/* Info Callout */}
                      <div className="mt-2 bg-[var(--accent)]/[0.04] border border-[var(--accent)]/15 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          Organization profile is pre-filled into all AI prompts and document generation. Changes apply to future generations only.
                        </p>
                      </div>

                      <div className="flex justify-end mt-3">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white uppercase tracking-wider text-xs font-semibold py-2.5 px-6 shadow-[0_4px_20px_-4px_var(--accent-glow)] cursor-pointer select-none border-none flex items-center gap-1.5"
                          id="org-save-btn"
                        >
                          {saved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved ✓</span>
                            </>
                          ) : (
                            <span>Save Changes</span>
                          )}
                        </motion.button>
                      </div>

                    </form>
                  </div>
                </div>
              )}

              {/* Integrations Section */}
              {activeSection === "integrations" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                      Integrations
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Connect external services to power the knowledge feedback loop.
                    </p>
                  </div>

                  {/* Card 1 - GitHub */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative flex flex-col justify-between">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Github className="w-5 h-5 text-[var(--text-primary)]" />
                          <span className="font-semibold text-sm text-[var(--text-primary)]">GitHub</span>
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 text-emerald-400 font-bold">
                          Connected
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-2 font-sans">
                        Webhook active · 3 repositories syncing · Last push: 2 minutes ago
                      </p>
                      
                      {/* Stats row */}
                      <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-[var(--border)]/50">
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">3 repos</span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">·</span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">1,847 nodes indexed</span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">·</span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">284 context calls today</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-4 pt-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] text-[10px] font-semibold py-2 px-4 uppercase tracking-wider bg-transparent cursor-not-allowed"
                        id="github-manage-btn"
                      >
                        Manage Repos
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-[10px] font-semibold py-2 px-4 uppercase tracking-wider cursor-not-allowed"
                        id="github-disconnect-btn"
                      >
                        Disconnect
                      </motion.button>
                    </div>
                  </div>

                  {/* Card 2 - Gemini API */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                        <span className="font-semibold text-sm text-[var(--text-primary)]">Gemini API</span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/[0.1] border border-emerald-500/20 text-emerald-400 font-bold">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-2 font-sans">
                      Used for extraction interview, quality validation, and prompt generation.
                    </p>

                    <div className="mt-4 flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 max-w-md">
                      <span className="font-mono text-xs text-[var(--text-secondary)] select-all">
                        AIza••••••••••••••••••••••••••••XQ7f
                      </span>
                      <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] leading-none transition-colors border-none bg-transparent cursor-not-allowed p-0.5">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex gap-2.5 mt-4 pt-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] text-[10px] font-semibold py-2 px-4 uppercase tracking-wider bg-transparent cursor-not-allowed"
                        id="gemini-rotate-btn"
                      >
                        Rotate Key
                      </motion.button>
                    </div>
                  </div>

                  {/* Card 3 - Slack */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative opacity-85">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-5 h-5 text-[var(--text-muted)]" />
                        <span className="font-semibold text-sm text-[var(--text-primary)]">Slack</span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] font-bold">
                        Not Connected
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-2 font-sans">
                      Get notified when knowledge graph nodes change or documents are regenerated.
                    </p>

                    <div className="flex gap-2.5 mt-4 pt-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white uppercase tracking-wider text-[10px] font-semibold py-2 px-4 shadow-[0_4px_15px_-4px_var(--accent-glow)] cursor-not-allowed"
                        id="slack-connect-btn"
                      >
                        Connect Slack
                      </motion.button>
                    </div>
                  </div>

                </div>
              )}

              {/* Team Section */}
              {activeSection === "team" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                      Team Members
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Manage who has access to this project and their permission level.
                    </p>
                  </div>

                  {/* Invite Row */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center relative">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />
                    
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Invite by email address..."
                      className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-lg px-3 py-2.5 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] flex-1 min-w-0"
                    />

                    <div className="flex gap-2 shrink-0 items-center">
                      <button className="font-mono text-xs bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-not-allowed select-none transition-colors whitespace-nowrap bg-transparent">
                        Member ▾
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white uppercase tracking-wider text-[10px] font-semibold py-2.5 px-4 shadow-[0_4px_15px_-4px_var(--accent-glow)] cursor-not-allowed border-none shrink-0"
                        id="invite-send-btn"
                      >
                        Send Invite
                      </motion.button>
                    </div>
                  </div>

                  {/* Members List */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col" id="team-members-list">
                    {TEAM_MEMBERS.map((member, index) => {
                      const isInvited = member.status === "invited";
                      
                      const getRoleStyle = (role: TeamRole) => {
                        switch (role) {
                          case "Owner":
                            return "text-[var(--accent)] bg-[var(--accent)]/[0.08] border-[var(--accent)]/20";
                          case "Admin":
                            return "text-[#a78bfa] bg-[#a78bfa]/[0.08] border-[#a78bfa]/20";
                          case "Member":
                            return "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20";
                          case "Viewer":
                          default:
                            return "text-[var(--text-muted)] bg-[var(--bg-surface)] border-[var(--border)]";
                        }
                      };

                      return (
                        <motion.div
                          key={member.id}
                          initial={false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--border)]/45 last:border-0"
                          id={`member-row-${member.id}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ring-1 shrink-0 ${
                              isInvited
                                ? "bg-[var(--bg-surface)] ring-[var(--border)] text-[var(--text-muted)]"
                                : "bg-[var(--accent)]/[0.1] ring-[var(--accent)]/15 text-[var(--accent)]"
                            }`}>
                              {member.avatarInitial}
                            </div>
                            <div className="min-w-0 leading-tight">
                              <span className="text-sm font-semibold text-[var(--text-primary)] block truncate">
                                {member.name}
                              </span>
                              <span className="text-xs text-[var(--text-muted)] block truncate mt-0.5">
                                {member.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {isInvited && (
                              <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20 text-amber-400 font-bold select-none">
                                Invited
                              </span>
                            )}
                            <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold select-none ${getRoleStyle(member.role)}`}>
                              {member.role}
                            </span>
                            {member.role !== "Owner" && (
                              <button className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] p-1 rounded hover:bg-[var(--bg-surface)] transition-colors border-none bg-transparent cursor-not-allowed">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === "billing" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
                      Plan & Usage
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Your current plan and usage metrics this billing cycle.
                    </p>
                  </div>

                  {/* Current Plan Card */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 relative flex flex-col">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent" />
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[9px] uppercase px-3 py-1 rounded-full bg-[var(--accent)]/[0.08] border border-[var(--accent)]/20 text-[var(--accent)] font-bold tracking-wider select-none">
                        Pro
                      </span>
                      <span className="text-[var(--text-muted)] font-mono text-xs select-none">·</span>
                      <span className="text-xs text-[var(--text-muted)]">Billed monthly</span>
                    </div>

                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold font-sans text-[var(--text-primary)]">$29</span>
                      <span className="text-sm text-[var(--text-muted)]">/mo</span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] mt-1 block">Renews June 30, 2026</span>

                    <div className="border-t border-[var(--border)]/45 my-4" />

                    <div className="flex flex-col gap-2.5" id="billing-features">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-[var(--text-secondary)]">Unlimited knowledge nodes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-[var(--text-secondary)]">Up to 5 team members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-[var(--text-secondary)]">GitHub + webhook integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-[var(--text-secondary)]">All 3 document types (Insider, AI, Public)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-[var(--text-secondary)]">Context Keys & prompt generation</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white uppercase tracking-wider text-[10px] font-semibold py-2.5 px-5 shadow-[0_4px_15px_-4px_var(--accent-glow)] cursor-not-allowed border-none"
                        id="billing-upgrade-btn"
                      >
                        Upgrade to Team
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] text-[10px] font-semibold py-2.5 px-5 uppercase tracking-wider bg-transparent cursor-not-allowed"
                        id="billing-manage-btn"
                      >
                        Manage Billing
                      </motion.button>
                    </div>
                  </div>

                  {/* Usage Card */}
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mt-1">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 tracking-tight">
                      This Month&apos;s Usage
                    </h3>

                    <div className="flex flex-col gap-4">
                      {/* Metric 1 */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[var(--text-muted)] uppercase tracking-wider font-semibold">Knowledge Nodes</span>
                          <span className="text-[var(--text-secondary)]">
                            <span className="text-[var(--text-primary)] font-bold">1,847</span> / 5,000
                          </span>
                        </div>
                        <div className="bg-[var(--bg-surface)] rounded-full h-1.5 w-full mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "37%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-[var(--accent)] rounded-full h-full"
                          />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[var(--text-muted)] uppercase tracking-wider font-semibold">Context Calls</span>
                          <span className="text-[var(--text-secondary)]">
                            <span className="text-[var(--text-primary)] font-bold">284</span> / 1,000
                          </span>
                        </div>
                        <div className="bg-[var(--bg-surface)] rounded-full h-1.5 w-full mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "28%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-[var(--accent)] rounded-full h-full"
                          />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[var(--text-muted)] uppercase tracking-wider font-semibold">Team Members</span>
                          <span className="text-[var(--text-secondary)]">
                            <span className="text-[var(--text-primary)] font-bold">3</span> / 5
                          </span>
                        </div>
                        <div className="bg-[var(--bg-surface)] rounded-full h-1.5 w-full mt-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-[var(--accent)] rounded-full h-full"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* Danger Zone Section */}
              {activeSection === "danger" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-red-400 tracking-tight">
                      Danger Zone
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Irreversible actions. These cannot be undone.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Danger Card 1 */}
                    <div className="bg-red-500/[0.03] border border-red-500/15 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="max-w-sm">
                        <span className="text-sm font-semibold text-[var(--text-primary)] block tracking-tight">Reset Knowledge Graph</span>
                        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                          Permanently delete all knowledge nodes and edges for this project. The org profile is preserved.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2.5 px-6 uppercase tracking-wider shrink-0 cursor-not-allowed select-none"
                        id="danger-reset-btn"
                      >
                        Reset Graph
                      </motion.button>
                    </div>

                    {/* Danger Card 2 */}
                    <div className="bg-red-500/[0.03] border border-red-500/15 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="max-w-sm">
                        <span className="text-sm font-semibold text-[var(--text-primary)] block tracking-tight">Archive Project</span>
                        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                          Disable all active syncing and document generation. The project remains viewable in read-only mode.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2.5 px-6 uppercase tracking-wider shrink-0 cursor-not-allowed select-none"
                        id="danger-archive-btn"
                      >
                        Archive
                      </motion.button>
                    </div>

                    {/* Danger Card 3 */}
                    <div className="bg-red-500/[0.03] border border-red-500/15 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="max-w-sm">
                        <span className="text-sm font-semibold text-[var(--text-primary)] block tracking-tight">Delete Project</span>
                        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                          Permanently delete this project, all knowledge nodes, documents, and git history links. This action cannot be reversed.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2.5 px-6 uppercase tracking-wider shrink-0 cursor-not-allowed select-none"
                        id="danger-delete-btn"
                      >
                        Delete Project
                      </motion.button>
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
