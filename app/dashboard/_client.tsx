"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  GitBranch,
  Network,
  Database,
  FileText,
  Key,
  Settings,
  LogOut,
  Plus,
  Zap,
  Activity,
  GitCommit,
  AlertCircle
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: GitBranch },
  { id: "graph", label: "Knowledge Graph", icon: Network },
  { id: "schema", label: "Schema Explorer", icon: Database },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "keys", label: "Context Keys", icon: Key },
];

const mockProjects = [
  { id: "api-service", name: "api-service", branch: "main", status: "Synced" },
  { id: "web-frontend", name: "web-frontend", branch: "develop", status: "Syncing" },
  { id: "auth-worker", name: "auth-worker", branch: "main", status: "Idle" },
];

const mockActivity = [
  {
    id: 1,
    icon: GitCommit,
    iconColorClass: "text-[var(--accent)]",
    action: "Schema updated — users table +3 columns",
    meta: "api-service / main",
    time: "2m ago",
  },
  {
    id: 2,
    icon: Network,
    iconColorClass: "text-[var(--accent)]",
    action: "Graph rebuilt — 124 new nodes indexed",
    meta: "api-service / main",
    time: "2m ago",
  },
  {
    id: 3,
    icon: Zap,
    iconColorClass: "text-emerald-400",
    action: "Context injected to claude-agent-01",
    meta: "web-frontend",
    time: "18m ago",
  },
  {
    id: 4,
    icon: GitCommit,
    iconColorClass: "text-[var(--accent)]",
    action: "API route parsed — POST /v2/invoices",
    meta: "api-service / main",
    time: "1h ago",
  },
  {
    id: 5,
    icon: AlertCircle,
    iconColorClass: "text-amber-400",
    action: "Schema drift detected — orders.total type mismatch",
    meta: "auth-worker / main",
    time: "3h ago",
  },
];

const miniStats = [
  { label: "Schema Nodes", value: "412" },
  { label: "API Nodes", value: "867" },
  { label: "Webhook Nodes", value: "234" },
  { label: "Edges", value: "334" },
];

const systemStatusRows = [
  { label: "Graph Engine", status: "Operational", colorClass: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20", dotClass: "bg-emerald-400" },
  { label: "Git Webhook Listener", status: "Active", colorClass: "text-[var(--accent)] bg-[var(--accent-subtle)] border-[var(--accent)]/20", dotClass: "bg-[var(--accent)] animate-pulse" },
  { label: "Schema Parser", status: "Operational", colorClass: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20", dotClass: "bg-emerald-400" },
  { label: "Context Injector", status: "Active", colorClass: "text-[var(--accent)] bg-[var(--accent-subtle)] border-[var(--accent)]/20", dotClass: "bg-[var(--accent)] animate-pulse" },
  { label: "D1 Database", status: "Operational", colorClass: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20", dotClass: "bg-emerald-400" },
];

const tabMetadata: Record<string, { label: string; icon: React.ComponentType<any> }> = {
  projects: { label: "Projects", icon: GitBranch },
  graph: { label: "Knowledge Graph", icon: Network },
  schema: { label: "Schema Explorer", icon: Database },
  documents: { label: "Documents", icon: FileText },
  keys: { label: "Context Keys", icon: Key },
  settings: { label: "Settings", icon: Settings },
};

export default function DashboardClient() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const updateDate = () => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const now = new Date();
      const dayName = days[now.getDay()];
      const dayNum = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      setDateString(`${dayName}, ${dayNum} ${monthName} ${year}`);
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--accent-glow)] opacity-10 rounded-xl blur-[2px]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full"
            />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] animate-pulse font-bold">
            Verifying Core Session Auth...
          </span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const fullName = session.user.name || "User Name";
  const firstName = fullName.split(" ")[0];
  const firstLetter = fullName.charAt(0) || "U";
  const email = session.user.email || "user@domain.com";

  const stats = [
    { id: "repos", label: "Connected Repos", value: "3", sub: "2 syncing · 1 idle", icon: GitBranch },
    { id: "nodes", label: "Graph Nodes", value: "1,847", sub: "↑ 124 since last push", icon: Network },
    { id: "calls", label: "Context Calls", value: "284", sub: "Today across all agents", icon: Zap },
    { id: "sync", label: "Last Sync", value: "2m ago", sub: "api-service / main", icon: Activity },
  ];

  const meta = tabMetadata[activeTab];
  const TabIcon = meta?.icon || Settings;
  const tabLabel = meta?.label || "Settings";

  return (
    <div className="min-h-[100dvh] w-full flex flex-row bg-[var(--bg)]">
      {/* LEFT: Fixed sidebar */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-xl">
        {/* Logo block */}
        <div className="px-5 pt-6 pb-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--accent-glow)] opacity-10 rounded-lg blur-[2px]" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="w-2.5 h-2.5 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-hover)] rounded-full"
              />
            </div>
            <span className="font-sans font-bold text-[15px] text-[var(--text-primary)]">
              Momentum
            </span>
          </div>
        </div>

        {/* Navigation Label */}
        <div className="px-4 pt-5 pb-2">
          <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)] font-bold">
            Navigation
          </span>
        </div>

        {/* Nav Items List */}
        <nav className="flex flex-col gap-0.5 px-2 mt-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer select-none transition-colors duration-200 text-sm font-medium font-sans z-10 ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute inset-0 rounded-lg bg-[var(--accent)]/[0.08] border border-[var(--accent)]/20 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}

          <div className="mx-3 my-2 border-t border-[var(--border)]" />

          {/* Settings Nav Option */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 6 * 0.05, duration: 0.4 }}
            onClick={() => setActiveTab("settings")}
            className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer select-none transition-colors duration-200 text-sm font-medium font-sans z-10 ${
              activeTab === "settings" ? "text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>Settings</span>
            {activeTab === "settings" && (
              <motion.div
                layoutId="sidebarActive"
                className="absolute inset-0 rounded-lg bg-[var(--accent)]/[0.08] border border-[var(--accent)]/20 -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.div>
        </nav>

        {/* User Block at base */}
        <div className="mt-auto px-3 pb-5 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/[0.12] border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold font-mono text-[var(--accent)] uppercase">{firstLetter}</span>
            </div>
            {/* Text details */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--text-primary)] truncate font-sans">
                {fullName}
              </div>
              <div className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                {email}
              </div>
            </div>
            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="ml-auto p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT: Scrollable main content */}
      <main className="flex-1 overflow-y-auto dot-grid min-h-[100dvh]">
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-7xl xl:max-w-[1500px] 2xl:max-w-[1700px] mx-auto px-6 md:px-10 py-10"
            >
              {/* Page header */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold mb-1">
                    COMMAND CENTER
                  </div>
                  <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
                    Good morning, {firstName}
                  </h1>
                  <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1.5">
                    {dateString}
                  </p>
                </div>

                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_4px_20px_-4px_var(--accent-glow)] active:scale-[0.98] cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect Repo</span>
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, idx) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.5 }}
                      className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top highlight bar */}
                      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                      {/* Icon */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent)]/10 flex items-center justify-center">
                        <StatIcon className="w-4 h-4 text-[var(--accent)]" />
                      </div>

                      {/* Label & Value */}
                      <div className="flex-1 flex flex-col justify-end mt-4">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-2 block">
                          {stat.label}
                        </span>
                        <span className="text-3xl font-bold font-sans text-[var(--text-primary)] leading-none">
                          {stat.value}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)] mt-1.5 block">
                          {stat.sub}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Two Column Grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {/* LEFT Column (SXS) */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  {/* Connected Projects Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xs font-semibold font-sans text-[var(--text-primary)] font-bold">
                        Connected Projects
                      </h3>
                      <span className="text-[11px] font-mono text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer transition-colors">
                        Manage →
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {mockProjects.map((proj) => (
                        <div
                          key={proj.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
                        >
                          {/* Repo SVG Icon box */}
                          <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 shrink-0 fill-[var(--text-muted)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                            </svg>
                          </div>

                          {/* Detail titles */}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-mono font-semibold text-[var(--text-primary)] truncate block leading-tight">
                              {proj.name}
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5 block leading-tight">
                              {proj.branch}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {proj.status === "Synced" && (
                              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20 block font-bold">
                                Synced
                              </span>
                            )}
                            {proj.status === "Syncing" && (
                              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-[var(--accent)] bg-[var(--accent-subtle)] border-[var(--accent)]/20 flex items-center gap-1.5 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                                <span>Syncing</span>
                              </span>
                            )}
                            {proj.status === "Idle" && (
                              <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-[var(--text-muted)] bg-[var(--bg-card)] border-[var(--border)] block font-bold">
                                Idle
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    <h3 className="text-xs font-semibold font-sans text-[var(--text-primary)] mb-5 font-bold">
                      Recent Activity
                    </h3>

                    <div className="flex flex-col divide-y divide-[var(--border)]">
                      {mockActivity.map((act) => {
                        const ActIcon = act.icon;
                        return (
                          <div key={act.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                            <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5">
                              <ActIcon className={`w-3.5 h-3.5 ${act.iconColorClass}`} />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="text-xs font-sans text-[var(--text-secondary)] leading-snug">
                                {act.action}
                              </div>
                              <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                                {act.meta}
                              </div>
                            </div>

                            <div className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 self-start">
                              {act.time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* RIGHT Column */}
                <div className="md:col-span-1 flex flex-col gap-6">
                  {/* Graph Snapshot Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    <h3 className="text-xs font-semibold font-sans text-[var(--text-primary)] mb-5 font-bold">
                      Graph Snapshot
                    </h3>

                    {/* Nodes representing high-fidelity telemetry architecture */}
                    <div className="relative h-[130px] rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] overflow-hidden mb-5">
                      {/* Sub-connections rotated custom */}
                      <div
                        className="w-px bg-[var(--accent)]/10 absolute"
                        style={{
                          height: "45px",
                          transform: "rotate(51deg)",
                          transformOrigin: "top center",
                          top: "25%",
                          left: "30%",
                        }}
                      />
                      <div
                        className="w-px bg-[var(--accent)]/10 absolute"
                        style={{
                          height: "55px",
                          transform: "rotate(135deg)",
                          transformOrigin: "top center",
                          top: "50%",
                          left: "50%",
                        }}
                      />
                      <div
                        className="w-px bg-[var(--accent)]/10 absolute"
                        style={{
                          height: "50px",
                          transform: "rotate(-110deg)",
                          transformOrigin: "top center",
                          top: "30%",
                          left: "75%",
                        }}
                      />
                      <div
                        className="w-px bg-[var(--accent)]/10 absolute"
                        style={{
                          height: "45px",
                          transform: "rotate(20deg)",
                          transformOrigin: "top center",
                          top: "15%",
                          left: "55%",
                        }}
                      />

                      {/* Central primary nodes */}
                      <div className="w-4 h-4 rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/20 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10" />

                      {/* Dispersed satellite nodes in continuous pulsing loop */}
                      <div className="w-2.5 h-2.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] absolute top-[25%] left-[30%] animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] absolute top-[75%] left-[20%]" />
                      <div className="w-2.5 h-2.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] absolute top-[30%] left-[75%] animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] absolute top-[70%] left-[70%]" />
                      <div className="w-2.5 h-2.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] absolute top-[15%] left-[55%] animate-pulse" />
                      <div className="w-2.5 h-2.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] absolute top-[85%] left-[45%]" />
                    </div>

                    {/* Snap Stats */}
                    <div className="grid grid-cols-2 gap-3 text-left">
                      {miniStats.map((mini) => (
                        <div key={mini.label} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-3">
                          <span className="text-[9px] uppercase font-mono tracking-wider text-[var(--text-muted)] mb-1 block font-bold leading-none">
                            {mini.label}
                          </span>
                          <span className="text-xl font-bold font-sans text-[var(--text-primary)] leading-none block mt-1">
                            {mini.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Status Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    <h3 className="text-xs font-semibold font-sans text-[var(--text-primary)] mb-5 font-bold">
                      System Status
                    </h3>

                    <div className="flex flex-col gap-2.5">
                      {systemStatusRows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[var(--text-secondary)]">{row.label}</span>
                          <span className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-bold ${row.colorClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${row.dotClass}`} />
                            <span>{row.status}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[100dvh] p-8 text-center"
            >
              <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                <span className="font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/15 text-[var(--accent)] mb-2 font-bold">
                  In Development
                </span>
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] flex items-center justify-center">
                  <TabIcon className="w-6 h-6 text-[var(--accent)] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-sans text-[var(--text-primary)]">{tabLabel}</h3>
                  <p className="text-sm font-sans text-[var(--text-muted)] mt-1">Coming soon.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
