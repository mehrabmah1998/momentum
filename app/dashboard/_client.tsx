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
  AlertCircle,
  Clock,
  RefreshCw,
  Table2,
  Code2,
  ExternalLink,
  Hash,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  ChevronsUpDown,
  CheckCircle2,
  Bell,
  Search,
  Check,
  Trash,
  X,
  Folder,
  FolderPlus,
  Edit2,
  Layers,
  Grid,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CircleCheck,
  CircleDashed,
  HelpCircle,
  MessageSquare,
  Pencil
} from "lucide-react";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import GraphTab from "./tabs/graph";
import SchemaTab from "./tabs/schema";
import DocumentsTab from "./tabs/documents";
import InterviewTab from "./tabs/interview";
import KeysTab from "./tabs/keys";
import SettingsTab from "./tabs/settings";
import ExtractionTab from "./tabs/extraction";
import HealthTab from "./tabs/health";
import FeaturesTab from "./tabs/features";

const navItems = [
  { id: "documents", label: "Documents", icon: FileText },
  { id: "interview", label: "Interview", icon: MessageSquare },
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "graph", label: "Knowledge Graph", icon: Network },
  { id: "health", label: "Health Map", icon: Activity },
  { id: "schema", label: "Schema Explorer", icon: Database },
  { id: "features", label: "Features", icon: Sparkles },
];

const mockDocuments = [
  { id: "insider-spec", name: "Insider Specification", description: "Confidential source-of-truth spec detailing high-level requirements, core goals, and key user flows.", completeness: 86, status: "UP TO DATE" },
  { id: "ai-spec", name: "AI Specification", description: "Optimized context layout crafted specifically to feed into LLMs to guide code generation.", completeness: 82, status: "UP TO DATE" },
  { id: "public-spec", name: "Public Specification", description: "Simplified public-facing documentation highlighting features, changelogs, and integrations.", completeness: 73, status: "STALE" },
];

const mockProjectDetails = [
  {
    id: "momentum-core",
    name: "Momentum Core Engine",
    org: "BuildWithMomentum",
    completeness: 88,
    confirmedNodes: 147,
    modules: 12,
    openQuestions: 2,
    lastInterview: "2h ago",
    recentChanges: [
      { id: "rc1", type: "confirmed", title: "Core state machine loop definition", time: "10m ago" },
      { id: "rc2", type: "refined", title: "Target workspace sandbox constraints", time: "2h ago" },
      { id: "rc3", type: "new", title: "Pricing tier multi-region scalability rules", time: "1d ago" },
    ],
  },
  {
    id: "momentum-ui",
    name: "Momentum UI Library",
    org: "BuildWithMomentum",
    completeness: 64,
    confirmedNodes: 84,
    modules: 6,
    openQuestions: 5,
    lastInterview: "1d ago",
    recentChanges: [
      { id: "rc4", type: "confirmed", title: "Framer Motion layout transition curves", time: "1d ago" },
      { id: "rc5", type: "new", title: "Tactile feedback haptic specification", time: "2d ago" },
    ],
  },
  {
    id: "momentum-auth",
    name: "Momentum Secure Auth Gateway",
    org: "BuildWithMomentum",
    completeness: 92,
    confirmedNodes: 110,
    modules: 4,
    openQuestions: 0,
    lastInterview: "3d ago",
    recentChanges: [
      { id: "rc6", type: "refined", title: "Session storage & token storage policy", time: "3d ago" },
    ],
  },
];

const mockActivity = [
  {
    id: 1,
    icon: CircleCheck,
    iconColorClass: "text-emerald-400",
    rowClass: "border-l-[3px] border-l-emerald-500/80 pl-2.5 -ml-[11px]",
    action: "Confirmed: Extraction Engine quality gate",
    meta: "Updated validation metrics",
    time: "2m ago",
  },
  {
    id: 2,
    icon: Pencil,
    iconColorClass: "text-amber-400",
    rowClass: "border-l-[3px] border-l-amber-500/80 pl-2.5 -ml-[11px]",
    action: "Refined: Target Users persona",
    meta: "Updated core audience parameters",
    time: "1h ago",
  },
  {
    id: 3,
    icon: Plus,
    iconColorClass: "text-[var(--accent)]",
    rowClass: "border-l-[3px] border-l-[var(--accent)] pl-2.5 -ml-[11px]",
    action: "New: Cloudflare deployment decision",
    meta: "Infrastructure constraints updated",
    time: "3h ago",
  },
  {
    id: 4,
    icon: Pencil,
    iconColorClass: "text-amber-400",
    rowClass: "border-l-[3px] border-l-amber-500/80 pl-2.5 -ml-[11px]",
    action: "Refined: Key Database associations",
    meta: "Adjusted relationship cardinality",
    time: "5h ago",
  },
];

const healthData = [
  { day: "Mon", "api-service": 64, "web-frontend": 45, "auth-worker": 82 },
  { day: "Tue", "api-service": 68, "web-frontend": 52, "auth-worker": 82 },
  { day: "Wed", "api-service": 74, "web-frontend": 52, "auth-worker": 82 },
  { day: "Thu", "api-service": 81, "web-frontend": 61, "auth-worker": 85 },
  { day: "Fri", "api-service": 88, "web-frontend": 65, "auth-worker": 85 },
  { day: "Sat", "api-service": 92, "web-frontend": 70, "auth-worker": 89 },
  { day: "Sun", "api-service": 95, "web-frontend": 74, "auth-worker": 89 },
];

const docStatusData = [
  { id: "api-service", name: "api-service", branch: "main", completeness: 95, lastGenerated: "2 hours ago", status: "UP TO DATE" },
  { id: "web-frontend", name: "web-frontend", branch: "develop", completeness: 74, lastGenerated: "4 days ago", status: "STALE" },
  { id: "auth-worker", name: "auth-worker", branch: "main", completeness: 0, lastGenerated: "-", status: "NEVER GENERATED" },
];

const agentActivity = [
  { id: 1, agent: "claude-agent-01", project: "web-frontend", tokens: "~3,400 tokens", time: "18m ago" },
  { id: 2, agent: "gpt-4-architect", project: "api-service", tokens: "~8,120 tokens", time: "1h ago" },
  { id: 3, agent: "claude-agent-02", project: "api-service", tokens: "~1,200 tokens", time: "3h ago" },
  { id: 4, agent: "gpt-3.5-reviewer", project: "auth-worker", tokens: "~450 tokens", time: "5h ago" },
];

const miniStats = [
  { label: "Completed Sections", value: "18" },
  { label: "Pending Loops", value: "3" },
  { label: "Open Clarifications", value: "5" },
  { label: "Valid Edges", value: "12" },
];

const systemStatusRows = [
  { label: "Knowledge Graph", status: "Ready", colorClass: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20", dotClass: "bg-emerald-400" },
  { label: "Document Generator", status: "Ready", colorClass: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20", dotClass: "bg-emerald-400" },
  { label: "Extraction Engine", status: "Ready", colorClass: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20", dotClass: "bg-emerald-400" },
  { label: "Validation Agent", status: "Ready", colorClass: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20", dotClass: "bg-emerald-400" },
];

const tabMetadata: Record<string, { label: string; icon: React.ComponentType<any> }> = {
  overview: { label: "Home", icon: LayoutDashboard },
  workspace: { label: "Workspace", icon: Grid },
  graph: { label: "Knowledge Graph", icon: Network },
  health: { label: "Health Map", icon: Activity },
  schema: { label: "Schema Explorer", icon: Database },
  documents: { label: "Documents", icon: FileText },
  interview: { label: "Interview", icon: MessageSquare },
  features: { label: "Features", icon: Sparkles },
  settings: { label: "Settings", icon: Settings },
};

const SEARCHABLE_ITEMS = [
  // Documents
  { title: "Database Schema Architecture", desc: "Detailed mapping of the user, workspaces, and keys database schemas.", type: "document", matches: ["db", "schema", "database", "postgres", "sql", "migration"] },
  { title: "Stripe Metered Billing Integration", desc: "Overview of Stripe webhooks, pricing calculations, and subscription workflows.", type: "document", matches: ["stripe", "billing", "webhook", "invoice", "payment"] },
  { title: "Authentication JWT Middleware", desc: "Security session checks, token verification, and sign-out route definitions.", type: "document", matches: ["auth", "jwt", "login", "session", "security"] },
  { title: "CI/CD Deployment Pipelines", desc: "Automated test runs, compilation checkers, and Docker builders to production.", type: "document", matches: ["ci", "cd", "deploy", "pipeline", "github", "build"] },
  
  // Topics
  { title: "Next.js 15 App Router Architecture", desc: "Explaining Next Server Components, server actions, dynamic caching.", type: "topic", matches: ["nextjs", "react", "routing", "server"] },
  { title: "Neo4j Semantic Knowledge Graph", desc: "Interactive visualization engine representing code graphs and relational dependencies.", type: "topic", matches: ["neo4j", "graph", "knowledge", "relationships", "interactive"] },
  { title: "Context Capture Vector Embeddings", desc: "Machine-learning driven code tokenization and contextual extraction pipelines.", type: "topic", matches: ["embeddings", "vector", "ai", "context", "llm"] },
  
  // Knowledge Graph nodes
  { title: "Node: users (Table)", desc: "Database physical model tracking verified credential logs.", type: "node", matches: ["users", "table", "postgress", "node"] },
  { title: "Node: GET /v2/invoices (Route)", desc: "Core Stripe billing API endpoint for customer calculations.", type: "node", matches: ["get", "invoices", "endpoint", "api", "route"] },
  { title: "Node: sessions (Table)", desc: "Active auth session tokens representing logged users.", type: "node", matches: ["sessions", "table", "auth"] },
];

export interface WorkspaceProject {
  id: string;
  name: string;
  color: string;
  description: string;
  recentActivity: string;
  docStatus?: "KNOWLEDGE COMPLETE" | "DOCS STALE" | "EXTRACTION NEEDED" | "NEVER EXTRACTED";
  completeness?: number;
}

export default function DashboardClient() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("documents");
  const [extractionProjectId, setExtractionProjectId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dateString, setDateString] = useState("");
  const [showGlobalSwitcher, setShowGlobalSwitcher] = useState(false);
  const [activeGlobalProject, setActiveGlobalProject] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("active_global_project_name");
      if (saved) return saved;
    }
    return "Momentum Core";
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    { id: "1", title: "Knowledge Extraction Complete", body: "Successfully analyzed and extracted context for context-capture-extension.", time: "10m ago", read: false, type: "success" },
    { id: "2", title: "Schema Drift Detected", body: "New unrecognized database mutations detected in main monorepo.", time: "1h ago", read: false, type: "warning" },
    { id: "3", title: "Stripe Billing Sync", body: "Stripe webhook endpoints mapped successfully into the schema graph.", time: "4h ago", read: true, type: "info" },
    { id: "4", title: "Failed to extract docs", body: "Missing description for marketing-site metadata causing extraction skip.", time: "1 day ago", read: true, type: "error" }
  ]);

  const [globalProjects, setGlobalProjects] = useState<WorkspaceProject[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workspace_global_projects");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    return [
      { id: "momentum-core", name: "Momentum Core", color: "#06B6D4", description: "Core service containing unified auth microservices, node orchestration, and context injection controllers.", recentActivity: "Extracted database mutation context 12m ago", docStatus: "DOCS STALE", completeness: 87 },
      { id: "chrome-extension", name: "Context Capture Extension", color: "#10B981", description: "Browser utility mapping developer web workflows directly into the central schema graph.", recentActivity: "Refreshed session variables and webhooks 2h ago", docStatus: "KNOWLEDGE COMPLETE", completeness: 100 },
      { id: "pricing-engine", name: "Stripe Billing Engine", color: "#F59E0B", description: "Plan synchronizer, checkout tunnels, and subscription webhook controllers.", recentActivity: "Successfully synced with gateway sandbox 4h ago", docStatus: "EXTRACTION NEEDED", completeness: 42 },
      { id: "marketing-site", name: "Marketing & Blog", color: "#EF4444", description: "Next-gen static frontend showcasing product modules, blog articles, and feature telemetry.", recentActivity: "Skipped documentation refresh due to metadata check 1d ago", docStatus: "NEVER EXTRACTED", completeness: 0 }
    ];
  });

  useEffect(() => {
    localStorage.setItem("workspace_global_projects", JSON.stringify(globalProjects));
  }, [globalProjects]);

  useEffect(() => {
    localStorage.setItem("active_global_project_name", activeGlobalProject);
  }, [activeGlobalProject]);

  // Shortcut for search: Meta/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const isNoWorkspaceActive = activeGlobalProject === "No Active Project" || globalProjects.length === 0 || !globalProjects.some(p => p.name === activeGlobalProject);

  const filteredSearchItems = searchQuery.trim() === "" 
    ? SEARCHABLE_ITEMS.slice(0, 4) 
    : SEARCHABLE_ITEMS.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.matches.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const stats = [
    { id: "completeness", label: "Documentation Completeness", value: "68%", sub: "Across all document specifications", icon: FileText, trend: "↑ 4% this session", trendColorClass: "text-emerald-400" },
    { id: "nodes", label: "Confirmed Nodes", value: "41", sub: "Validated in knowledge graph", icon: CircleCheck, trend: "↑ 12 since yesterday", trendColorClass: "text-emerald-400" },
    { id: "gaps", label: "Needs Input", value: "7", sub: "Missing crucial constraints", icon: CircleDashed, trend: "Resolve via interviewer", trendColorClass: "text-amber-400" },
    { id: "questions", label: "Open Questions", value: "3", sub: "Awaiting your clarification", icon: HelpCircle, trend: "Active discussion items", trendColorClass: "text-emerald-400" },
  ];

  const meta = tabMetadata[activeTab];
  const TabIcon = meta?.icon || Settings;
  const tabLabel = meta?.label || "Settings";

  return (
    <div className="h-[100dvh] w-full flex flex-row bg-[var(--bg)] overflow-hidden">
      {/* LEFT: Collapsible Sidebar */}
      {activeTab !== "extraction" && (
        <motion.aside 
        animate={{ 
          width: isSidebarCollapsed ? 68 : 240,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 28,
          restDelta: 0.5 
        }}
        className="shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] relative z-40"
        style={{ 
          overflow: isSidebarCollapsed ? "hidden" : "visible" 
        }}
      >
        {/* Workspace Dropdown and Toggle Area */}
        <div className="border-b border-[var(--border)] relative z-40 shrink-0">
          <div className="relative h-[65px] w-full flex items-center px-3 overflow-hidden">
            <AnimatePresence mode="wait">
              {isSidebarCollapsed ? (
                <motion.div
                  key="collapsed-workspace"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="w-full flex justify-center"
                >
                  <div className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center relative overflow-hidden shadow-sm shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-hover)] opacity-20" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                      className="w-2.5 h-2.5 border border-[var(--accent)] border-t-transparent rounded-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded-workspace"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center gap-1.5"
                >
                  {/* Interactive Workspace Dropdown Trigger */}
                  <button
                    onClick={() => setShowGlobalSwitcher(!showGlobalSwitcher)}
                    className={`flex-1 flex items-center justify-between gap-2.5 p-2 rounded-xl border transition-all duration-200 select-none text-left focus:outline-none cursor-pointer group min-w-0 ${
                      activeTab === "workspace"
                        ? "border-[var(--accent)]/40 bg-[var(--accent-subtle)]/15 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]"
                        : "border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg)]/50 hover:bg-[var(--bg-surface)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-105 transition-all duration-200">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-hover)] opacity-20" />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                          className="w-3 h-3 border border-[var(--accent)] border-t-transparent rounded-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-sans font-bold text-xs text-[var(--text-primary)] leading-none truncate mb-1 border-none bg-transparent">
                          {activeGlobalProject || "No Active Project"}
                        </span>
                        <span className="block text-[10px] text-[var(--text-muted)] leading-none font-sans font-medium transition-colors group-hover:text-[var(--accent)]">
                          Switch Project
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDown className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0" />
                  </button>

                  {/* Sidebar Collapse Action */}
                  <button
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-2 rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg)]/30 hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                    title="Collapse Sidebar"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown panel */}
          <AnimatePresence>
            {showGlobalSwitcher && !isSidebarCollapsed && (
              <>
                {/* Backdrop to dismiss */}
                <div className="fixed inset-0 z-40" onClick={() => setShowGlobalSwitcher(false)} />

                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.97 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-3 right-3 mt-1.5 premium-blur-container border border-white/10 [html.light_&]:border-slate-200 bg-[var(--bg-surface)] rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] overflow-hidden py-1 z-50 animate-gpu"
                >
                  <div className="px-3.5 py-2 border-b border-white/5 [html.light_&]:border-slate-100">
                    <div className="text-[9px] uppercase font-mono tracking-widest text-[var(--text-muted)] font-bold">Switch Project</div>
                  </div>
                  {globalProjects.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => {
                        setActiveGlobalProject(p.name);
                        if (activeTab === "workspace") {
                          setActiveTab("overview");
                        }
                        setShowGlobalSwitcher(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 transition-colors cursor-pointer border-none bg-transparent hover:bg-white/[0.04] [html.light_&]:hover:bg-slate-100/40 ${p.name === activeGlobalProject ? 'bg-white/[0.02] [html.light_&]:bg-slate-100/50' : ''}`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="text-xs font-semibold text-[var(--text-primary)] truncate font-sans">{p.name}</span>
                      {p.name === activeGlobalProject && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] ml-auto shrink-0" />}
                    </button>
                  ))}
                  <div className="border-t border-white/5 [html.light_&]:border-slate-100 mt-1 pt-1 flex flex-col gap-0.5">
                    <button 
                      onClick={() => { setActiveTab("projects"); setShowGlobalSwitcher(false); }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-[11px] font-mono tracking-wide text-[var(--accent)] hover:text-[var(--accent-hover)] transition-all cursor-pointer border-none bg-transparent hover:bg-white/[0.04] [html.light_&]:hover:bg-slate-100/30 font-bold"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>View All Projects &rarr;</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab("workspace"); setShowGlobalSwitcher(false); }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-[11px] font-mono tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer border-none bg-transparent hover:bg-white/[0.04] [html.light_&]:hover:bg-slate-100/30 font-bold"
                    >
                      <Settings className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Manage Projects Settings ↗</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Section Header */}
        <div className="h-9 overflow-hidden shrink-0">
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="px-4 pt-5 pb-1.5"
              >
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)] font-bold block">
                  Navigation
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items List */}
        <nav className={`flex flex-col gap-1.5 px-2 ${isSidebarCollapsed ? "mt-4 items-center" : "mt-1"} shrink-0`}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isSidebarCollapsed ? 0 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center cursor-pointer select-none transition-all duration-200 text-xs font-semibold font-sans z-10 group h-10 ${
                  isSidebarCollapsed ? "px-2 rounded-xl justify-center w-10 mx-auto" : "px-3 py-2.5 rounded-lg gap-3 w-full"
                } ${
                  isActive 
                    ? "text-[var(--text-primary)]" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveBackground"
                    className="absolute inset-0 rounded-lg bg-white/[0.05] [html.light_&]:bg-black/[0.03] border border-white/5 [html.light_&]:border-black/5 -z-10 shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.03)] [html.light_&]:shadow-none"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <Icon 
                  className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${
                    isSidebarCollapsed ? "w-4 h-4" : "w-3.5 h-3.5"
                  } ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                  }`} 
                  strokeWidth={2} 
                />
                
                <AnimatePresence mode="popLayout" initial={false}>
                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, x: -5 }}
                      animate={{ opacity: 1, width: "auto", x: 0 }}
                      exit={{ opacity: 0, width: 0, x: -5 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="whitespace-nowrap truncate font-semibold"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          <div className={`mx-2 my-1 border-t border-[var(--border)] ${isSidebarCollapsed ? "w-6" : "w-auto"}`} />

          {/* Settings Nav Option */}
          <motion.div
            initial={{ opacity: 0, x: isSidebarCollapsed ? 0 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 6 * 0.03, duration: 0.25 }}
            onClick={() => setActiveTab("settings")}
            className={`relative flex items-center cursor-pointer select-none transition-all duration-200 text-xs font-semibold font-sans z-10 group h-10 ${
              isSidebarCollapsed ? "px-2 rounded-xl justify-center w-10 mx-auto" : "px-3 py-2.5 rounded-lg gap-3 w-full"
            } ${
              activeTab === "settings"
                ? "text-[var(--text-primary)]" 
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            }`}
            title={isSidebarCollapsed ? "Settings" : undefined}
          >
            {activeTab === "settings" && (
              <motion.div
                layoutId="sidebarActiveBackground"
                className="absolute inset-0 rounded-lg bg-white/[0.05] [html.light_&]:bg-black/[0.03] border border-white/5 [html.light_&]:border-black/5 -z-10 shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.03)] [html.light_&]:shadow-none"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            
            <Settings 
              className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${
                isSidebarCollapsed ? "w-4 h-4" : "w-3.5 h-3.5"
              } ${
                activeTab === "settings" ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
              }`} 
              strokeWidth={2} 
            />
            
            <AnimatePresence mode="popLayout" initial={false}>
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0, x: -5 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: -5 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="whitespace-nowrap truncate font-semibold"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>

        {/* Subscribed Plan & Usage Details Card */}
        <div className="px-3 mt-auto shrink-0 border-t border-[var(--border)] overflow-hidden">
          <AnimatePresence initial={false}>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16, marginBottom: 16, paddingTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/50 p-3.5 flex flex-col gap-2.5 relative overflow-hidden group shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/[0.03] to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-between leading-none">
                    <span className="text-[9px] uppercase tracking-[0.12em] font-mono text-[var(--text-muted)] font-bold">
                      PLAN
                    </span>
                    <span className="rounded-full bg-[var(--accent)]/[0.12] [html.light_&]:bg-[var(--accent)]/[0.08] px-2 py-0.5 text-[8px] uppercase tracking-wider text-[var(--accent)] font-bold border border-[var(--accent)]/15">
                      PRO SCALE
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-0.5">
                    <div className="flex items-center justify-between text-[11px] leading-none">
                      <span className="text-[var(--text-secondary)] font-medium">AI Credits</span>
                      <span className="font-mono text-[var(--text-primary)] font-bold">
                        $142.45 <span className="text-[9px] text-[var(--text-muted)] font-normal">/ $150.00</span>
                      </span>
                    </div>

                    {/* Premium micro progress bar */}
                    <div className="relative w-full h-[5px] bg-slate-200/40 dark:bg-neutral-800/60 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full transition-all duration-700 ease-out"
                        style={{ width: "94.97%" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-0.5 text-[9px] font-mono leading-none">
                    <span className="text-[var(--text-muted)]">Resets in 14d</span>
                    <span className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-all flex items-center gap-0.5 cursor-pointer leading-none">
                      Manage Billing <ExternalLink className="w-2.5 h-2.5 inline" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Block at Base */}
        <div className="px-3 pb-4 pt-4 border-t border-[var(--border)] shrink-0">
          <AnimatePresence mode="wait">
            {isSidebarCollapsed ? (
              <motion.div
                key="collapsed-user"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-3 w-full"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/[0.12] border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold font-mono text-[var(--accent)] uppercase">{firstLetter}</span>
                </div>
                
                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-xl text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="expanded-user"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5 w-full"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/[0.12] border border-[var(--accent)]/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold font-mono text-[var(--accent)] uppercase">{firstLetter}</span>
                </div>
                
                {/* Text details */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[var(--text-primary)] truncate font-sans leading-none mb-1">
                    {fullName}
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-muted)] truncate leading-none">
                    {email}
                  </div>
                </div>
                
                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="ml-auto p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-rose-500 transition-all duration-200 cursor-pointer border-0 flex items-center justify-center shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
      )}

      {/* RIGHT: Scrollable main content */}
      <main className="flex-1 dot-grid h-[100dvh] flex flex-col relative overflow-hidden">
        
        {/* GLOBAL HEADER */}
        {activeTab !== "extraction" && (
        <div className="shrink-0 h-16 bg-[var(--bg)] border-b border-[var(--border)] px-6 md:px-10 flex items-center justify-between z-40 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle control (only visible when sidebar is collapsed) */}
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-2 rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)]/80 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm group"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4 text-[var(--accent)] group-hover:scale-111 transition-transform" />
              </button>
            )}

            {/* Breadcrumb path with context-aware tab logic and project view trigger */}
            <div className="flex items-center gap-2 font-sans select-none">
            {activeTab === "workspace" ? (
                <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                  <Grid className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Workspace
                </span>
              ) : (
                <>
                  <span 
                    onClick={() => setActiveTab("workspace")}
                    className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer transition-colors"
                    title="Workspace"
                  >
                    Workspace
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]/40 font-mono">/</span>
                  <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight">{activeGlobalProject}</span>
                </>
              )}
            </div>
          </div>

          {/* SEARCH BAR TRIGGER */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="hidden md:flex items-center gap-2.5 px-4 py-1.5 w-64 max-w-xs rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)]/80 text-left text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all cursor-pointer group focus:outline-none"
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
            <span className="text-xs group-hover:text-[var(--text-primary)] transition-colors flex-1 font-sans">Search projects...</span>
            <kbd className="hidden sm:inline-block font-mono text-[9px] px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">⌘K</kbd>
          </button>

          {/* RIGHT NOTIFICATIONS & MOBILE CONTROLS */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Icon Trigger */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex md:hidden p-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer outline-none focus:outline-none"
              title="Search Workspace"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* NOTIFICATION CENTER */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full border bg-[var(--bg-surface)] hover:border-[var(--border-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer outline-none focus:outline-none ${showNotifications ? 'border-[var(--border-hover)] text-[var(--text-primary)] bg-[var(--bg-surface)]/80' : 'border-[var(--border)]'}`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[var(--bg)] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Backdrop to dismiss */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className="absolute right-0 mt-3 w-80 md:w-96 premium-blur-container border border-white/10 [html.light_&]:border-slate-200 rounded-xl shadow-[0_25px_55px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-white/5 [html.light_&]:border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--text-primary)] font-sans">Notifications</span>
                          {notifications.filter(n => !n.read).length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[9px] font-mono font-bold">
                              {notifications.filter(n => !n.read).length}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            }}
                            className="p-1.5 rounded hover:bg-white/[0.06] [html.light_&]:hover:bg-slate-100 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border-none bg-transparent"
                            title="Mark all as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setNotifications([])}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer border-none bg-transparent"
                            title="Clear all notifications"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* List */}
                      <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5 [html.light_&]:divide-slate-100 relative min-h-[160px]">
                        <AnimatePresence initial={false} mode="popLayout">
                          {notifications.length === 0 ? (
                            <motion.div
                              key="empty-state"
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="py-12 px-4 flex flex-col items-center justify-center text-center gap-2 bg-transparent absolute inset-0 m-auto"
                            >
                              <div className="w-8 h-8 rounded-full border border-dashed border-white/10 [html.light_&]:border-slate-200 flex items-center justify-center text-[var(--text-muted)]">
                                <Bell className="w-3.5 h-3.5 opacity-60" />
                              </div>
                              <div className="text-xs font-medium text-[var(--text-secondary)] font-sans">All caught up!</div>
                              <div className="text-[10px] text-[var(--text-muted)] font-mono">No notifications at this time.</div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="notifications-list"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <AnimatePresence initial={false}>
                                {notifications.map(n => (
                                  <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0, x: -60, transition: { duration: 0.2 } }}
                                    style={{ overflow: "hidden" }}
                                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                    onClick={() => {
                                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                                    }}
                                    className={`p-4 transition-colors hover:bg-white/[0.03] [html.light_&]:hover:bg-slate-50/50 relative flex items-start gap-3 cursor-pointer bg-transparent border-none ${!n.read ? 'bg-white/[0.015]' : 'opacity-75'}`}
                                  >
                                    {!n.read && (
                                      <span className="absolute left-2.5 top-4.5 w-1.5 h-1.5 bg-[var(--accent)] rounded-full shrink-0" />
                                    )}
                                    
                                    <div className="flex-1 min-w-0 pr-1 pl-1">
                                      <div className="text-xs font-semibold text-[var(--text-primary)] leading-tight mb-1 truncate font-sans">
                                        {n.title}
                                      </div>
                                      <div className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-1.5 font-sans">
                                        {n.body}
                                      </div>
                                      <span className="text-[9px] font-mono text-[var(--text-muted)]">
                                        {n.time}
                                      </span>
                                    </div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNotifications(prev => prev.filter(item => item.id !== n.id));
                                      }}
                                      className="p-1 rounded hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer border-none bg-transparent shrink-0 z-10"
                                      title="Delete notification"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        )}

        {activeTab !== "extraction" ? (
        <div className={`flex-1 min-h-0 flex flex-col ${activeTab === "interview" ? "overflow-hidden" : "overflow-y-auto"}`}>
          <AnimatePresence mode="wait">
            {isNoWorkspaceActive && ["overview", "graph", "schema", "documents", "keys"].includes(activeTab) ? (
              <motion.div
                key="no-workspace-selected"
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg mx-auto px-6 py-24 text-center flex flex-col items-center justify-center min-h-[60vh] relative animate-gpu"
              >
                {/* Ambient Glowing Glass Sphere */}
                <div className="absolute -top-12 w-64 h-64 rounded-full bg-[var(--accent)]/5 blur-3xl pointer-events-none select-none" />

                {/* Stunning Premium Motion Graphics Loop */}
                <WorkspaceLoopAnimation />

                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--accent)] font-bold mb-3 block">
                  Project Required
                </span>
                <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2.5 font-sans">
                  No Active Project Selected
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-8 max-w-[38ch]">
                  The page you are trying to view displays project-specific knowledge graphs and living documentation. Select an existing project or initialize a new one.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <button
                    onClick={() => setActiveTab("workspace")}
                    className="group relative flex items-center gap-2.5 px-6 py-3 rounded-full bg-white [html.dark_&]:bg-neutral-900 border border-[var(--border)] hover:border-[var(--accent)] text-black [html.dark_&]:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_8px_30px_rgba(6,182,214,0.15)] active:scale-95 animate-gpu animate-none"
                  >
                    <span>Manage Projects</span>
                    <span className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <Plus className="w-3.5 h-3.5 text-[var(--accent)] group-hover:rotate-90 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </motion.div>
            ) : activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-7xl xl:max-w-[1500px] 2xl:max-w-[1700px] mx-auto px-6 md:px-10 py-10"
            >
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-[var(--border)]/60">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--accent)] font-bold mb-1.5 px-3 py-1 bg-[var(--accent)]/[0.08] border border-[var(--accent)]/15 rounded-full w-fit">
                    KNOWLEDGE BASE
                  </div>
                  <h1 className="text-3xl font-semibold font-sans text-[var(--text-primary)] tracking-tight mt-1">
                    Good to see you, {firstName}
                  </h1>
                  <p className="font-mono text-[11px] text-[var(--text-muted)] mt-2 ml-0.5 flex flex-wrap items-center gap-2">
                    <span>{dateString}</span>
                    <span className="text-[var(--border)]">•</span>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="text-[var(--accent)] hover:text-[var(--accent-hover)] cursor-pointer hover:underline border-none bg-transparent p-0 font-semibold text-[11.5px]"
                    >
                      View All Projects &rarr;
                    </button>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab("interview")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_-4px_var(--accent-glow)] active:scale-[0.98] cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Continue Interview</span>
                  </button>
                </div>
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
                        <div className="mt-2 text-start flex flex-col items-start gap-1">
                          <span className="text-[11px] font-mono text-[var(--text-muted)] leading-none">
                            {stat.sub}
                          </span>
                          {stat.trend && (
                            <span className={`text-[10px] font-mono font-bold leading-none ${stat.trendColorClass}`}>
                              {stat.trend}
                            </span>
                          )}
                        </div>
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
                {/* LEFT Column */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  {/* Your Documents Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-sm font-bold font-sans text-[var(--text-primary)]">
                        Your Documents
                      </h3>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        3 Specs Active
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {mockDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col gap-3 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-4">
                              <span className="text-sm font-semibold text-[var(--text-primary)] font-sans block leading-none">
                                {doc.name}
                              </span>
                              <span className="text-xs text-[var(--text-muted)] mt-1.5 block leading-relaxed max-w-[600px]">
                                {doc.description}
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => setActiveTab("documents")}
                              className="text-[10px] font-mono tracking-wider text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors opacity-80 group-hover:opacity-100 flex items-center gap-1 shrink-0 bg-transparent border-none cursor-pointer outline-none font-bold"
                            >
                              View &rarr;
                            </button>
                          </div>

                          <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]/40 mt-1">
                            <div className="flex-1 h-1 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border)]/20">
                              <div 
                                className="h-full rounded-full transition-all duration-500 bg-[var(--accent)]" 
                                style={{ width: `${doc.completeness}%` }} 
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] min-w-[30px] text-right">
                              {doc.completeness}% Ready
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Knowledge Gaps Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden mb-8">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
                    
                    <h3 className="text-sm font-bold font-sans text-[var(--text-primary)] mb-5">
                      Knowledge Gaps
                    </h3>

                    <div className="flex flex-col gap-3">
                      {[
                        { title: "Document Engine", status: "needs input", badgeClass: "text-amber-400 bg-amber-500/[0.08] border-amber-500/20" },
                        { title: "Global Constraints", status: "empty", badgeClass: "text-rose-400 bg-rose-500/[0.08] border-rose-500/20" },
                        { title: "Pricing & Business", status: "empty", badgeClass: "text-rose-400 bg-rose-500/[0.08] border-rose-500/20" }
                      ].map((gap, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-60 shrink-0" />
                            <span className="text-xs font-semibold text-[var(--text-primary)] font-sans">
                              {gap.title}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded border font-bold ${gap.badgeClass}`}>
                              {gap.status}
                            </span>
                          </div>

                          <button 
                            onClick={() => setActiveTab("interview")}
                            className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none font-bold animate-gpu"
                          >
                            Resolve in interview &rarr;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT Column */}
                <div className="md:col-span-1 flex flex-col gap-6">
                  {/* Recent Knowledge Changes Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden flex flex-col">
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm font-bold font-sans text-[var(--text-primary)]">
                        Recent Knowledge Changes
                      </h3>
                      <button className="text-[10px] text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-semibold font-sans bg-transparent border-none cursor-pointer outline-none">
                        View feed &rarr;
                      </button>
                    </div>

                    <div className="flex flex-col divide-y divide-[var(--border)]/70">
                      {mockActivity.map((act) => {
                        const ActIcon = act.icon;
                        return (
                          <div 
                            key={act.id} 
                            className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                              <ActIcon className={`w-4 h-4 ${act.iconColorClass}`} />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="text-xs font-semibold text-[var(--text-primary)] font-sans leading-snug">
                                {act.action}
                              </div>
                              <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                                {act.meta}
                              </div>
                            </div>

                            <div className="text-[9px] font-mono text-[var(--text-muted)] shrink-0 self-start pt-0.5">
                              {act.time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* System Status Card */}
                  <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden">
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    <h3 className="text-sm font-bold font-sans text-[var(--text-primary)] mb-5">
                      Knowledge System Status
                    </h3>

                    <div className="flex flex-col gap-3">
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
          ) : activeTab === "projects" ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-7xl xl:max-w-[1500px] 2xl:max-w-[1700px] mx-auto px-6 md:px-10 py-10"
            >
              {/* PAGE HEADER */}
              <div className="flex items-start justify-between mb-10 pb-6 border-b border-[var(--border)]/60">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--accent)] font-bold mb-1.5 px-3 py-1 bg-[var(--accent)]/[0.08] border border-[var(--accent)]/15 rounded-full w-fit">
                    ORGANIZATION: BuildWithMomentum
                  </div>
                  <h1 className="text-3xl font-semibold font-sans text-[var(--text-primary)] tracking-tight">
                    Projects
                  </h1>
                  <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1.5 ml-0.5">
                    {mockProjectDetails.length} active knowledge projects under BuildWithMomentum organization
                  </p>
                </div>

                <button 
                  onClick={() => setActiveTab("documents")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_-4px_var(--accent-glow)] active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Project</span>
                </button>
              </div>

              {/* SUMMARY STATS ROW */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-10">
                {[
                  { id: "projects", label: "Active Projects", value: "3", sub: "Under BuildWithMomentum", icon: Layers },
                  { id: "nodes", label: "Confirmed Nodes", value: "341", sub: "Validated structured items", icon: Network },
                  { id: "modules", label: "Modules Defined", value: "22", sub: "Visual functional scopes", icon: Grid },
                  { id: "gaps", label: "Open Questions", value: "7", sub: "Awaiting clarification", icon: HelpCircle },
                ].map((stat, idx) => {
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

              {/* PROJECT CARDS */}
              <div className="flex flex-col gap-6 mt-2">
                {mockProjectDetails.map((proj, index) => (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 relative overflow-hidden"
                  >
                    {/* Top highlight bar */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />

                    {/* CARD HEADER ROW */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        {/* Custom visual cube icon box */}
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        <div>
                          <span className="text-base font-sans font-bold text-[var(--text-primary)] leading-tight block">
                            {proj.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              org / {proj.org}
                            </span>
                            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/15 text-[var(--accent)] font-bold uppercase">
                              Active SPEC
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20 font-bold">
                          Validated
                        </span>

                        {/* Last Interview */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Last Interview: {proj.lastInterview}</span>
                        </div>
                      </div>
                    </div>

                    {/* STATS MINI ROW */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {[
                        { label: "Completeness", value: `${proj.completeness}%`, icon: FileText, showProgress: true, completeness: proj.completeness },
                        { label: "Confirmed Nodes", value: String(proj.confirmedNodes), icon: Network },
                        { label: "Modules", value: String(proj.modules), icon: Grid },
                        { label: "Open Questions", value: String(proj.openQuestions), icon: HelpCircle },
                      ].map((mini, mIdx) => {
                        const MiniIcon = mini.icon;
                        return (
                          <div key={mIdx} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col justify-between h-24">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold block mb-1">
                                {mini.label}
                              </span>
                              <MiniIcon className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                            </div>
                            {mini.showProgress ? (
                              <div className="w-full mt-1.5">
                                <span className="text-xl font-bold font-sans text-[var(--text-primary)] leading-none block">
                                  {mini.value}
                                </span>
                                <div className="w-full h-1 bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border)]/20 mt-1.5">
                                  <div 
                                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" 
                                    style={{ width: `${mini.completeness}%` }} 
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xl font-bold font-sans text-[var(--text-primary)] leading-none mt-1 block">
                                {mini.value}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* LEFT - Recent Knowledge Changes */}
                      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold">
                              Recent Knowledge Changes
                            </span>
                          </div>
                          <div className="flex flex-col gap-2.5">
                            {proj.recentChanges.map((change) => {
                              let badgeColor = "bg-[var(--accent)]/[0.08] border-[var(--accent)]/20 text-[var(--accent)]";
                              if (change.type === "confirmed") badgeColor = "bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400";
                              if (change.type === "refined") badgeColor = "bg-amber-500/[0.08] border-amber-500/20 text-amber-400";
                              return (
                                <div key={change.id} className="flex items-start justify-between gap-3 text-xs leading-snug">
                                  <div className="flex items-start gap-2 min-w-0">
                                    <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${badgeColor} font-bold shrink-0 mt-0.5`}>
                                      {change.type}
                                    </span>
                                    <span className="text-xs font-sans text-[var(--text-secondary)] font-medium truncate">
                                      {change.title}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 mt-0.5">
                                    {change.time}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT - Quick Actions */}
                      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] font-bold mb-3 block">
                          Quick Actions
                        </span>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => setActiveTab("documents")}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] cursor-pointer transition-colors text-xs font-sans font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>View Documents</span>
                            <ExternalLink className="w-3 h-3 text-[var(--text-muted)] ml-auto" />
                          </button>
                          <button 
                            onClick={() => setActiveTab("documents")}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] cursor-pointer transition-colors text-xs font-sans font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>Open Interview Tracker</span>
                            <ExternalLink className="w-3 h-3 text-[var(--text-muted)] ml-auto" />
                          </button>
                          <button 
                            onClick={() => setActiveTab("graph")}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] cursor-pointer transition-colors text-xs font-sans font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            <Network className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>View Knowledge Graph</span>
                            <ExternalLink className="w-3 h-3 text-[var(--text-muted)] ml-auto" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>

              {/* EMPTY STATE CARD */}
              <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-dashed border-[var(--border)] rounded-2xl p-8 relative overflow-hidden flex flex-col items-center text-center gap-4 mt-6">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h3 className="text-base font-bold font-sans text-[var(--text-primary)]">
                  Define a New Project
                </h3>
                <p className="text-sm text-[var(--text-muted)] font-sans max-w-sm">
                  A project is a body of structured knowledge you build through the interactive interview process, transforming open assumptions into solid specifications.
                </p>
                <button 
                  onClick={() => setActiveTab("documents")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_4px_20px_-4px_var(--accent-glow)] active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Project</span>
                </button>
              </div>

            </motion.div>
          ) : activeTab === "workspace" ? (
            <WorkspaceTab
              key="workspace"
              globalProjects={globalProjects}
              setGlobalProjects={setGlobalProjects}
              activeGlobalProject={activeGlobalProject}
              setActiveGlobalProject={setActiveGlobalProject}
              setActiveTab={setActiveTab}
              setExtractionProjectId={setExtractionProjectId}
            />
          ) : activeTab === "graph" ? (
            <GraphTab key="graph" />
          ) : activeTab === "schema" ? (
            <SchemaTab key="schema" />
          ) : activeTab === "health" ? (
            <HealthTab key="health" onNavigate={(tabId) => setActiveTab(tabId)} />
          ) : activeTab === "documents" ? (
            <DocumentsTab key="documents" setIsSidebarCollapsed={setIsSidebarCollapsed} onNavigate={(tabId) => setActiveTab(tabId)} />
          ) : activeTab === "interview" ? (
            <InterviewTab key="interview" onNavigate={(tabId) => setActiveTab(tabId)} />
          ) : activeTab === "features" ? (
            <FeaturesTab key="features" onNavigate={(tabId) => setActiveTab(tabId)} />
          ) : activeTab === "keys" ? (
            <KeysTab key="keys" />
          ) : activeTab === "settings" ? (
            <SettingsTab key="settings" />
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
        </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-[#090a0f]">
            <ExtractionTab
              projectId={extractionProjectId}
              onExit={() => {
                setActiveTab("workspace");
              }}
            />
          </div>
        )}

        {/* SEARCH MODAL OVERLAY */}
        <AnimatePresence>
          {showSearchModal && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
              {/* Backdrop with strong blur and background dimming */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => { setShowSearchModal(false); setSearchQuery(""); }}
                className="absolute inset-0 premium-overlay-blur"
              />

              {/* Search Box Card */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="relative w-full max-w-2xl premium-blur-container border border-white/10 [html.light_&]:border-slate-200 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[80vh] z-50 animate-gpu"
              >
                {/* Input Area */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 [html.light_&]:border-slate-100 relative">
                  <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
                  <input
                    type="text"
                    placeholder="Type to search documents, topics, nodes (e.g. 'stripe', 'schema', 'auth')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none border-none p-0 focus:ring-0 focus:outline-none"
                  />
                  <button
                    onClick={() => { setShowSearchModal(false); setSearchQuery(""); }}
                    className="p-1 rounded-md hover:bg-white/5 [html.light_&]:hover:bg-slate-100 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors border-none bg-transparent flex items-center justify-center cursor-pointer"
                    title="Close Search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Results */}
                <div className="flex-1 overflow-y-auto px-2 py-3 divide-y divide-white/5 [html.light_&]:divide-slate-100 max-h-[50vh]">
                  {filteredSearchItems.length === 0 ? (
                    <div className="py-12 text-center bg-transparent">
                      <AlertCircle className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3 opacity-60" />
                      <p className="text-sm font-medium text-[var(--text-secondary)]">No results found for &quot;{searchQuery}&quot;</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">Try searching for other terms like &apos;users&apos;, &apos;billing&apos;, &apos;embeddings&apos;</p>
                    </div>
                  ) : (
                    <div className="bg-transparent">
                      <div className="px-3 pb-2 text-[9px] uppercase tracking-wider font-mono text-[var(--text-muted)] font-bold">
                        {searchQuery.trim() === "" ? "Recommended Sections" : `Search Results (${filteredSearchItems.length})`}
                      </div>
                      
                      <div className="space-y-1 mt-1.5">
                        {filteredSearchItems.map((item, index) => {
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                if (item.type === "document") setActiveTab("documents");
                                if (item.type === "topic" || item.type === "node") setActiveTab("graph");
                                setShowSearchModal(false);
                                setSearchQuery("");
                              }}
                              className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/[0.03] [html.light_&]:hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg border border-white/5 [html.light_&]:border-slate-100 bg-white/[0.01] [html.light_&]:bg-slate-50 flex items-center justify-center shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/20 transition-all">
                                {item.type === "document" && <FileText className="w-4 h-4" />}
                                {item.type === "topic" && <Network className="w-4 h-4" />}
                                {item.type === "node" && <Database className="w-4 h-4" />}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate font-sans">
                                    {item.title}
                                  </span>
                                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] [html.light_&]:bg-slate-100 text-[var(--text-muted)] shrink-0 font-bold ml-2">
                                    {item.type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors line-clamp-1 font-sans font-normal leading-normal">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Utility Footer */}
                <div className="px-4 py-2.5 bg-white/[0.01] [html.light_&]:bg-slate-50/50 border-t border-white/5 [html.light_&]:border-slate-100 flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                  <div className="flex items-center gap-3">
                    <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 [html.light_&]:border-slate-200 bg-[var(--bg-surface)] text-[9px]">Esc</kbd> to close</span>
                    <span><kbd className="px-1.5 py-0.5 rounded border border-white/10 [html.light_&]:border-slate-200 bg-[var(--bg-surface)] text-[9px]">↵</kbd> to select</span>
                  </div>
                  <span>Momentum Intelligent Index</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function WorkspaceLoopAnimation() {
  return (
    <div className="relative w-64 h-64 mb-10 flex items-center justify-center select-none" style={{ perspective: "1200px" }}>
      {/* Space dust particle simulation floating upwards in 3D */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [-40, -150],
            scale: [0.3, 0.9, 0.3],
            x: [0, Math.sin(i * 1.5) * 28, Math.sin(i * 1.5) * -16]
          }}
          transition={{
            duration: 5.2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.75,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40 blur-[0.3px] pointer-events-none"
          style={{
            left: `${20 + (i * 9)}%`,
          }}
        />
      ))}

      {/* Deep atmospheric pulsing lighting aura */}
      <motion.div
        animate={{
          scale: [0.9, 1.12, 0.9],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-52 h-52 bg-[var(--accent)] rounded-full blur-[52px] pointer-events-none"
      />

      {/* 3D Isometric Core Engine */}
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: [-8, 8, -8],
          rotateX: [52, 56, 52],
          rotateZ: [-35, -45, -35],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-48 h-48 flex items-center justify-center"
      >
        {/* Core synchronization axis vector beam (runs right through all layers) */}
        <motion.div 
          style={{ transform: "rotateX(0deg) translateZ(-95px)" }}
          className="absolute w-[2px] h-[190px] bg-gradient-to-t from-emerald-500/5 via-[var(--accent)]/40 to-rose-400/20"
        />

        {/* ====================================
            LAYER 3: APPLICATION COMPOSITE LAYER
           ==================================== */}
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            translateZ: [58, 72, 58],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
          className="absolute w-36 h-36 rounded-[1.751rem] bg-gradient-to-b from-[var(--bg-card)]/45 via-[var(--bg-card)]/30 to-[var(--bg-card)]/10 border border-[var(--accent)]/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col p-3.5 justify-between ring-1 ring-white/15 backdrop-blur-[8px]"
        >
          {/* Mock dynamic workspace interface details */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-400/30 shrink-0" />
              <div className="h-2 w-8 bg-white/10 rounded-full" />
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/45" />
              <span className="w-5 h-1.5 rounded-full bg-[var(--border)]/60" />
            </div>
          </div>

          <div className="flex-1 my-3 flex flex-col justify-center gap-2">
            <div className="h-4 rounded-lg bg-white/[0.03] border border-white/5 flex items-center px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              <div className="h-1 w-12 bg-white/15 rounded-full" />
            </div>
            <div className="h-4 rounded-lg bg-white/[0.03] border border-white/5 flex items-center px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2" />
              <div className="h-1 w-16 bg-white/15 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="h-6 rounded-lg bg-[var(--accent-subtle)]/30 border border-[var(--accent)]/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
            </div>
            <div className="h-6 rounded-lg bg-[var(--border)]/30 flex items-center justify-center font-mono text-[8px] text-[var(--text-muted)]">
              LIVE
            </div>
          </div>
        </motion.div>

        {/* ====================================
            LAYER 2: SCHEMA EXPLORER GRAPH
           ==================================== */}
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            translateZ: [-5, 10, -5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 1.2
          }}
          className="absolute w-36 h-36 rounded-[1.751rem] bg-gradient-to-b from-[var(--bg-card)]/40 via-[var(--bg-card)]/25 to-[var(--bg-card)]/5 border border-[var(--border)] border-t-[var(--accent)]/20 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center p-3.5 ring-1 ring-white/10 backdrop-blur-[6px]"
        >
          {/* Interactive node relational schema graph inside vector space */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--accent)]/35 select-none pointer-events-none fill-none stroke-[var(--border)]">
            <motion.path 
              d="M 20,50 L 50,20 L 80,50 L 50,80 Z" 
              stroke="var(--accent)" 
              strokeWidth="1.5"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {/* Center interconnected orbits */}
            <circle cx="50" cy="50" r="22" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 3" />
            <circle cx="50" cy="50" r="12" stroke="var(--border)" strokeWidth="0.75" />
            
            {/* Connection lines */}
            <line x1="20" y1="50" x2="50" y2="50" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="1 2" />
            <line x1="50" y1="20" x2="50" y2="50" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="1 2" />
            <line x1="80" y1="50" x2="50" y2="50" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="1 2" />
            <line x1="50" y1="80" x2="50" y2="50" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="1 2" />

            {/* Contextual mapping node points */}
            <circle cx="20" cy="50" r="5" className="fill-[var(--accent)]/50 stroke-[var(--bg-card)]" strokeWidth="1.5" />
            <circle cx="50" cy="20" r="5" className="fill-purple-500/50 stroke-[var(--bg-card)]" strokeWidth="1.5" />
            <circle cx="80" cy="50" r="5" className="fill-[var(--accent)]/50 stroke-[var(--bg-card)]" strokeWidth="1.5" />
            <circle cx="50" cy="80" r="5" className="fill-[var(--accent)]/50 stroke-[var(--bg-card)]" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="4" className="fill-rose-500/50 stroke-[var(--bg-card)]" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* ====================================
            LAYER 1: KNOWLEDGE STORAGE & DB CORE
           ==================================== */}
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            translateZ: [-72, -58, -72],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 2.4
          }}
          className="absolute w-36 h-36 rounded-[1.751rem] bg-gradient-to-b from-[var(--bg-card)]/35 via-[var(--bg-card)]/15 to-[var(--bg-card)]/5 border border-emerald-500/25 shadow-sm flex items-center justify-center ring-1 ring-white/10 backdrop-blur-[5px]"
        >
          {/* Segmented DB scan disk visualization */}
          <div className="w-24 h-24 rounded-full border border-dashed border-[var(--border)] flex items-center justify-center relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[4px] rounded-full border border-[var(--accent)]/40 border-t-transparent border-r-transparent"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[12px] rounded-full border border-dashed border-[var(--accent)]/20"
            />
            <motion.div 
              animate={{ rotate: 180 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[20px] rounded-full border border-dotted border-emerald-400/40"
            />
            <span className="w-5 h-5 rounded bg-emerald-500/15 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 animate-ping opacity-60" />
            </span>
          </div>
        </motion.div>

        {/* Central Token: Core Node ascending along Z-Axis through layers */}
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            translateZ: [-105, 115],
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1.15, 1.15, 0.6]
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-[var(--accent)] animate-ping opacity-50 shadow-[0_0_18px_var(--accent)]" />
          <span className="w-2 h-2 rounded-full bg-white select-none pointer-events-none" />
        </motion.div>
      </motion.div>
    </div>
  );
}

interface WorkspaceTabProps {
  globalProjects: WorkspaceProject[];
  setGlobalProjects: React.Dispatch<React.SetStateAction<WorkspaceProject[]>>;
  activeGlobalProject: string;
  setActiveGlobalProject: React.Dispatch<React.SetStateAction<string>>;
  setActiveTab: (tab: string) => void;
  setExtractionProjectId: (id: string | null) => void;
}

function WorkspaceTab({
  globalProjects,
  setGlobalProjects,
  activeGlobalProject,
  setActiveGlobalProject,
  setActiveTab,
  setExtractionProjectId,
}: WorkspaceTabProps) {
  const router = useRouter();
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjColor, setNewProjColor] = useState("#06B6D4");
  const [showAddForm, setShowAddForm] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editColor, setEditColor] = useState("");

  // Simulation progress state
  const [extractionProgress, setExtractionProgress] = useState<Record<string, number>>({});
  const [regeneratingProjectId, setRegeneratingProjectId] = useState<string | null>(null);

  const handleRegenerateDocs = (projId: string) => {
    setRegeneratingProjectId(projId);
    setTimeout(() => {
      setRegeneratingProjectId(null);
      setGlobalProjects(prev => prev.map(proj => {
        if (proj.id === projId) {
          return {
            ...proj,
            recentActivity: "Docs regenerated successfully just now",
            docStatus: "KNOWLEDGE COMPLETE" as const,
            completeness: 100
          };
        }
        return proj;
      }));
    }, 2000);
  };

  const simulateExtraction = (projectId: string) => {
    if (extractionProgress[projectId] === 100) return;
    setExtractionProgress(prev => ({ ...prev, [projectId]: 0 }));
    
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        // update the global project activity state
        setGlobalProjects(prev => prev.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              recentActivity: "Knowledge capture complete · Unified graph compiled"
            };
          }
          return p;
        }));
      }
      setExtractionProgress(prev => ({ ...prev, [projectId]: current }));
    }, 400);
  };

  // Deletion Confirmation state
  const [targetForDeletion, setTargetForDeletion] = useState<WorkspaceProject | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

  const premiumColors = [
    { value: "#06B6D4", name: "Aura Teal" },
    { value: "#3B82F6", name: "Sapphire" },
    { value: "#F59E0B", name: "Amber" },
    { value: "#EF4444", name: "Crimson" },
    { value: "#10B981", name: "Forest" },
    { value: "#8B5CF6", name: "Amethyst" },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newProj: WorkspaceProject = {
      id: "proj-" + Math.random().toString(36).substring(2, 9),
      name: newProjName.trim(),
      color: newProjColor,
      description: newProjDesc.trim() || "A Momentum project knowledge base.",
      recentActivity: "Project created · Knowledge extraction not started",
      docStatus: "NEVER EXTRACTED",
      completeness: 0
    };

    setGlobalProjects(prev => [...prev, newProj]);
    setActiveGlobalProject(newProj.name);

    // Reset Form
    setNewProjName("");
    setNewProjDesc("");
    setNewProjColor("#06B6D4");
    setShowAddForm(false);
  };

  const startEditing = (proj: WorkspaceProject) => {
    setEditingId(proj.id);
    setEditName(proj.name);
    setEditDesc(proj.description || "");
    setEditColor(proj.color);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;

    setGlobalProjects(prev => prev.map(p => {
      if (p.id === id) {
        if (p.name === activeGlobalProject) {
          setActiveGlobalProject(editName.trim());
        }
        return {
          ...p,
          name: editName.trim(),
          description: editDesc.trim(),
          color: editColor,
          recentActivity: `Metadata changed: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        };
      }
      return p;
    }));

    setEditingId(null);
  };

  const executeDelete = (id: string) => {
    const projectToDelete = globalProjects.find(p => p.id === id);
    const remaining = globalProjects.filter(p => p.id !== id);
    setGlobalProjects(remaining);

    if (projectToDelete && projectToDelete.name === activeGlobalProject) {
      if (remaining.length > 0) {
        setActiveGlobalProject(remaining[0].name);
      } else {
        setActiveGlobalProject("No Active Project");
      }
    }
    setTargetForDeletion(null);
    setDeleteConfirmName("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-7xl xl:max-w-[1500px] 2xl:max-w-[1700px] mx-auto px-6 md:px-10 py-10"
    >
      {/* MASTER HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold mb-1">
            YOUR WORKSPACE
          </div>
          <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
            Workspace
          </h1>
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1.5">
            Your knowledge bases. Each project contains a full knowledge graph, living documentation, and AI-ready context.
          </p>
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_4px_20px_-4px_var(--accent-glow)] active:scale-[0.98] cursor-pointer self-start md:self-auto"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <FolderPlus className="w-3.5 h-3.5" />}
          <span>{showAddForm ? "Cancel" : "New Project"}</span>
        </button>
      </div>

      {/* CREATION MODAL WINDOW */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl p-1 rounded-[2rem] bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--accent)]/5 border border-[var(--border)]/80 shadow-2xl z-10"
            >
              <div className="bg-[var(--bg-card)] rounded-[calc(2rem-0.25rem)] p-6 md:p-8">
                {/* Header with Close */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center shrink-0">
                      <FolderPlus className="w-4 h-4 text-[var(--accent)]" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-[var(--text-primary)]">
                        Create New Project
                      </h3>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                        Create a new knowledge base for your project
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all cursor-pointer"
                    title="Close Window"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  {/* Grid Fields */}
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                        Project Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Invoicing Microservice"
                        value={newProjName}
                        onChange={(e) => setNewProjName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 hover:bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 font-bold">
                        Project Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Core service containing unified auth microservices and context injection controllers."
                        value={newProjDesc}
                        onChange={(e) => setNewProjDesc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 hover:bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold">
                        Identity Color
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {premiumColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setNewProjColor(color.value)}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer relative"
                            style={{
                              borderColor: newProjColor === color.value ? color.value : "transparent",
                              backgroundColor: newProjColor === color.value ? `${color.value}0D` : "rgba(0,0,0,0.02)"
                            }}
                          >
                            <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: color.value }} />
                            <span className="text-[9px] font-mono text-[var(--text-muted)] truncate max-w-full leading-none">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-5 py-2.5 rounded-full border border-[var(--border)] text-xs uppercase tracking-wider font-semibold hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white [html.dark_&]:bg-neutral-900 border border-[var(--border)] hover:border-[var(--accent)] text-black [html.dark_&]:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      <span>Create Project</span>
                      <span className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Plus className="w-3 h-3 text-[var(--accent)] group-hover:rotate-90 transition-transform" />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETION CONFIRMATION MODAL WINDOW */}
      <AnimatePresence>
        {targetForDeletion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-gpu">
            {/* Dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTargetForDeletion(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md p-1 rounded-[2rem] bg-gradient-to-br from-rose-500/20 via-transparent to-rose-500/5 border border-rose-500/30 shadow-2xl z-10"
            >
              <div className="bg-[var(--bg-card)] rounded-[calc(2rem-0.25rem)] p-6 md:p-8">
                {/* Header with Close */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-rose-500">
                        Confirm Deletion
                      </h3>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                        Irreversible destruction procedure
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTargetForDeletion(null)}
                    className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer"
                    title="Close Window"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs text-[var(--text-secondary)] leading-relaxed">
                    Are you sure you want to delete the project <strong className="text-[var(--text-primary)]">{targetForDeletion.name}</strong>? All knowledge graph connections, document contexts, and references will be lost permanently.
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold">
                      Type the project name with exact casing to confirm:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={targetForDeletion.name}
                        value={deleteConfirmName}
                        onChange={(e) => setDeleteConfirmName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]/50 hover:bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-rose-500 transition-all font-mono"
                      />
                      {deleteConfirmName === targetForDeletion.name && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 animate-bounce" /> Matched
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions footer */}
                <div className="flex justify-end gap-3 pt-5 border-t border-[var(--border)] mt-6">
                  <button
                    type="button"
                    onClick={() => setTargetForDeletion(null)}
                    className="px-5 py-2.5 rounded-full border border-[var(--border)] text-xs uppercase tracking-wider font-semibold hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleteConfirmName !== targetForDeletion.name}
                    onClick={() => executeDelete(targetForDeletion.id)}
                    className={`group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98] shadow-sm ${
                      deleteConfirmName === targetForDeletion.name
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-neutral-800/40 text-neutral-500 border border-neutral-800/50 pointer-events-none"
                    }`}
                  >
                    <span>Permanently Delete</span>
                    <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                      <Trash className="w-3 h-3 text-rose-200" />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MATRIX OF CARDS OR EMPTY STATE */}
      {globalProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-24 px-6 relative min-h-[50vh]"
        >
          {/* Ambient Glowing Glass Sphere */}
          <div className="absolute -top-6 w-48 h-48 rounded-full bg-[var(--accent)]/5 blur-3xl pointer-events-none select-none" />

          {/* Subtle knowledge graph / document icon (cleaner, flatter) */}
          <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-[var(--accent)]" id="empty-state-graph-svg">
              <motion.line
                x1="50" y1="20" x2="20" y2="50"
                stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"
                strokeDasharray="4, 4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.line
                x1="50" y1="20" x2="80" y2="50"
                stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"
                strokeDasharray="4, 4"
                animate={{ strokeDashoffset: [0, 20] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.line
                x1="20" y1="50" x2="35" y2="80"
                stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"
              />
              <motion.line
                x1="80" y1="50" x2="65" y2="80"
                stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"
              />
              <motion.line
                x1="20" y1="50" x2="80" y2="50"
                stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2"
              />

              <motion.circle
                cx="50" cy="20" r="7"
                fill="var(--bg-card)" stroke="currentColor" strokeWidth="2.5"
                animate={{ r: [6, 8, 6], strokeWidth: [2.5, 3, 2.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.circle
                cx="20" cy="50" r="5"
                fill="currentColor"
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.circle
                cx="80" cy="50" r="5"
                fill="currentColor"
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.circle
                cx="35" cy="80" r="4"
                fill="currentColor" fillOpacity="0.7"
              />
              <motion.circle
                cx="65" cy="80" r="4"
                fill="currentColor" fillOpacity="0.7"
              />

              <circle
                cx="50" cy="20" r="14"
                fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15"
                strokeDasharray="3 3"
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-[var(--bg)] pointer-events-none" />
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--accent)] font-bold mb-3 block">
            NO PROJECTS YET
          </span>
          <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2.5 font-sans animate-gpu">
            Create Your First Project
          </h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-8 max-w-[42ch]">
            Create a project to start building your knowledge base. Momentum will guide you through extracting your project knowledge through a structured conversation.
          </p>

          <button
            onClick={() => setShowAddForm(true)}
            className="group flex items-center gap-2.5 px-6 py-3 rounded-full bg-white [html.dark_&]:bg-neutral-900 border border-[var(--border)] hover:border-[var(--accent)] text-black [html.dark_&]:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_8px_30px_rgba(6,182,214,0.15)] active:scale-95"
          >
            <span>Create First Project</span>
            <span className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
              <Plus className="w-3.5 h-3.5 text-[var(--accent)] group-hover:rotate-90 transition-transform duration-300" />
            </span>
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {globalProjects.map((p, idx) => {
            const isActive = activeGlobalProject === p.name;
            const isEditing = editingId === p.id;

            // status badge & progress computation
            let extractionStatus: "NEVER EXTRACTED" | "EXTRACTION NEEDED" | "IN PROGRESS" | "KNOWLEDGE COMPLETE" | "DOCS STALE" = p.docStatus || "NEVER EXTRACTED";
            let completeness = p.completeness !== undefined ? p.completeness : 0;
            let documentationText = "Documentation · Never generated";
            let repoText = "No repo connected";

            if (p.id === "momentum-core" || p.name === "Momentum Core" || p.name === "Momentum Dashboard" || p.id === "proj-0" || p.name === "TEST PROJECT") {
              extractionStatus = p.docStatus || "DOCS STALE";
              completeness = p.completeness !== undefined ? p.completeness : 87;
              documentationText = "Documentation · Stale / Outdated";
              repoText = "github.com/buildwithmomentum/site · main";
            } else if (p.id === "chrome-extension" || p.name === "Context Capture Extension") {
              extractionStatus = p.docStatus || "KNOWLEDGE COMPLETE";
              completeness = p.completeness !== undefined ? p.completeness : 100;
              documentationText = "Documentation · Generated 2h ago";
              repoText = "github.com/buildwithmomentum/browser-ext · main";
            } else if (p.id === "pricing-engine" || p.name === "Stripe Billing Engine") {
              extractionStatus = p.docStatus || "EXTRACTION NEEDED";
              completeness = p.completeness !== undefined ? p.completeness : 42;
              documentationText = "Documentation · Never generated";
              repoText = "github.com/buildwithmomentum/billing · main";
            } else if (p.id === "marketing-site" || p.name === "Marketing & Blog") {
              extractionStatus = p.docStatus || "NEVER EXTRACTED";
              completeness = p.completeness !== undefined ? p.completeness : 0;
              documentationText = "Documentation · Never generated";
              repoText = "No repo connected";
            }

            if (p.recentActivity?.includes("Knowledge capture complete") || p.recentActivity?.includes("Extraction Complete") || p.recentActivity?.includes("complete")) {
              completeness = 100;
              extractionStatus = "KNOWLEDGE COMPLETE";
              documentationText = "Documentation · Generated just now";
            }

            const progress = extractionProgress[p.id];
            if (progress !== undefined) {
              completeness = progress;
              if (progress === 100) {
                extractionStatus = "KNOWLEDGE COMPLETE";
                documentationText = "Documentation · Generated just now";
              } else {
                extractionStatus = "IN PROGRESS";
                documentationText = `Documentation · Extracting (${progress}%)`;
              }
            }

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="p-1.5 rounded-[2rem] bg-white/[0.01] [html.light_&]:bg-neutral-900/[0.02] border border-white/5 [html.light_&]:border-black/5 flex flex-col h-full"
              >
                <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-[calc(2rem-0.375rem)] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm hover:border-[var(--border-hover)] transition-colors">
                  {isActive && (
                    <div 
                      className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-[0.03] dark:opacity-[0.05] blur-2xl pointer-events-none"
                      style={{ backgroundColor: p.color }}
                    />
                  )}

                  <div>
                    {/* Header line: label & badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[9px] uppercase tracking-wider font-mono text-[var(--accent)] font-bold">
                          PROJECT
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/15">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Extraction Status Badge */}
                      <span className={`px-2 py-0.5 text-[8px] uppercase font-mono font-bold tracking-wider rounded border ${
                        extractionStatus === "EXTRACTION NEEDED" 
                          ? "bg-amber-500/[0.1] text-amber-500 border-amber-500/20"
                          : extractionStatus === "IN PROGRESS"
                          ? "bg-cyan-500/[0.1] text-cyan-500 border-cyan-500/20 animate-pulse"
                          : "bg-emerald-500/[0.1] text-emerald-500 border-emerald-500/20"
                      }`}>
                        {extractionStatus}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-4 mb-5">
                        <div>
                          <label className="block text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
                            Project Name
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all animate-gpu"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
                            Project Description
                          </label>
                          <textarea
                            rows={2}
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all resize-none font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                            Identity Color Scheme
                          </label>
                          <div className="flex gap-2">
                            {premiumColors.map((col) => (
                              <button
                                key={col.value}
                                type="button"
                                onClick={() => setEditColor(col.value)}
                                className="w-5 h-5 rounded-full border border-black/15 transition-all relative flex items-center justify-center cursor-pointer"
                                style={{ 
                                  backgroundColor: col.value,
                                  transform: editColor === col.value ? "scale(1.15)" : "scale(1)"
                                }}
                              >
                                {editColor === col.value && <Check className="w-2.5 h-2.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2.5">
                        <h3 className="text-sm font-bold font-sans text-[var(--text-primary)] tracking-tight mb-1">
                          {p.name}
                        </h3>
                        {(() => {
                          const isDescEmptyOrDuplicate = !p.description || p.description.trim() === "" || p.description.trim().toLowerCase() === p.name.trim().toLowerCase();
                          return isDescEmptyOrDuplicate ? (
                            <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed select-none">
                              No description added yet
                            </p>
                          ) : (
                            <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                              {p.description}
                            </p>
                          );
                        })()}
                      </div>
                    )}

                    {/* TECH STACK TAGS SECTION */}
                    {(() => {
                      let tagsToRender: string[] = [];
                      const upperName = p.name.trim().toUpperCase();
                      if (upperName === "MOMENTUM CORE" || p.id === "momentum-core" || p.id === "proj-0" || p.name === "TEST PROJECT") {
                        tagsToRender = ["Next.js", "Node.js", "PostgreSQL"];
                      } else if (p.id === "test2" || upperName === "test2" || upperName === "TEST2") {
                        tagsToRender = ["Draft"];
                      } else if (p.id === "chrome-extension") {
                        tagsToRender = ["React", "TypeScript", "Chrome API"];
                      } else if (p.id === "pricing-engine") {
                        tagsToRender = ["Node.js", "Stripe", "PostgreSQL"];
                      } else if (p.id === "marketing-site") {
                        tagsToRender = ["Next.js", "Tailwind", "MDX"];
                      }
                      
                      return (
                        <div className="flex flex-wrap items-center gap-1.5 mb-2.5 select-none h-[18px] overflow-hidden">
                          {tagsToRender.length > 0 ? (
                            tagsToRender.map(tag => (
                              <span 
                                key={tag} 
                                className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--bg-surface)] leading-none font-bold border ${
                                  tag === "Draft" 
                                    ? "text-neutral-500 border-neutral-500/20" 
                                    : "text-[var(--text-secondary)] border-[var(--border)]"
                                }`}
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border)] leading-none italic">
                              No stack defined
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    {/* MIDDLE SECTION — Knowledge Status */}
                    <div className="border-t border-[var(--border)] pt-2.5 mt-1.5">
                      <div className="space-y-1.5 mb-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-[var(--text-secondary)] font-medium">Knowledge Completeness</span>
                          <span className="font-bold text-[var(--text-primary)]">{completeness}%</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="h-1 w-full bg-[var(--bg)]/80 rounded-full overflow-hidden border border-[var(--border)]/30">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completeness}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                        </div>

                        {/* Connected status rows */}
                        <div className="flex flex-col gap-0.5 pt-0.5">
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {documentationText}
                          </span>
                          <span className="text-[9px] font-mono text-[var(--text-muted)] truncate">
                            {repoText === "No repo connected" ? (
                              <span className="opacity-60">{repoText}</span>
                            ) : (
                              <span className="text-[var(--accent)] font-semibold">{repoText}</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Recent activity as plain MOMENTUM language */}
                      <span className="text-[8px] uppercase tracking-wider font-mono text-[var(--text-muted)] font-bold block mb-1">
                        RECENT ACTIVITY
                      </span>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[var(--bg)]/30 border border-[var(--border)] font-mono text-[9px] text-[var(--text-secondary)] leading-tight mb-3 select-none">
                        <Activity className="w-3 h-3 shrink-0" style={{ color: p.color }} />
                        <span className="truncate">{p.recentActivity || "No records initialized."}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        {isEditing ? (
                          <div className="flex gap-2 w-full mt-1">
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              className="flex-1 py-1.5 px-3 rounded-lg bg-[var(--accent)] text-white text-[11px] font-semibold text-center hover:bg-[var(--accent-hover)] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Check className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 py-1.5 px-3 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] font-medium text-center hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2.5 w-full mt-1">
                            {/* Context-aware Primary Button */}
                            {extractionStatus === "NEVER EXTRACTED" && (
                              <motion.button 
                                whileHover={{ scale: 1.01 }} 
                                whileTap={{ scale: 0.99 }}
                                onClick={() => {
                                  setExtractionProjectId(p.id);
                                  setActiveTab("extraction");
                                }}
                                className="w-full py-2 bg-[var(--text-primary)] hover:bg-white text-[var(--bg)] text-[11px] font-bold rounded-lg transition-colors leading-none flex items-center justify-center gap-1.5 cursor-pointer border-none font-mono tracking-wide uppercase select-none font-semibold shadow-sm"
                              >
                                <span>Begin Knowledge Extraction</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </motion.button>
                            )}

                            {extractionStatus === "EXTRACTION NEEDED" && (
                              <motion.button 
                                whileHover={{ scale: 1.01 }} 
                                whileTap={{ scale: 0.99 }}
                                onClick={() => {
                                  setExtractionProjectId(p.id);
                                  setActiveTab("extraction");
                                }}
                                className="w-full py-2 bg-amber-500/[0.04] hover:bg-amber-500/[0.08] text-amber-500 border border-amber-500/25 hover:border-amber-500/40 text-[11px] font-bold rounded-lg transition-all leading-none flex items-center justify-center gap-1.5 cursor-pointer font-mono tracking-wide uppercase select-none font-semibold shadow-sm animate-pulse"
                              >
                                <span>Continue Extraction</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </motion.button>
                            )}

                            {extractionStatus === "KNOWLEDGE COMPLETE" && (
                              <motion.button 
                                whileHover={{ scale: 1.01 }} 
                                whileTap={{ scale: 0.99 }}
                                onClick={() => {
                                  setActiveGlobalProject(p.name);
                                  setActiveTab("graph");
                                }}
                                className="w-full py-2 bg-[var(--text-primary)] hover:bg-white text-[var(--bg)] text-[11px] font-bold rounded-lg transition-colors leading-none flex items-center justify-center gap-1.5 cursor-pointer border-none font-mono tracking-wide uppercase select-none font-semibold shadow-sm"
                              >
                                <span>Explore Knowledge Graph</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </motion.button>
                            )}

                            {extractionStatus === "DOCS STALE" && (
                              <div className="flex flex-col gap-2 w-full">
                                <motion.button 
                                  whileHover={{ scale: 1.01 }} 
                                  whileTap={{ scale: 0.99 }}
                                  disabled={regeneratingProjectId === p.id}
                                  onClick={() => handleRegenerateDocs(p.id)}
                                  className="w-full py-2 bg-[var(--text-primary)] hover:bg-white text-[var(--bg)] text-[11px] font-bold rounded-lg transition-colors leading-none flex items-center justify-center gap-1.5 cursor-pointer border-none font-mono tracking-wide uppercase select-none font-semibold disabled:opacity-50"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${regeneratingProjectId === p.id ? "animate-spin" : ""}`} />
                                  <span>{regeneratingProjectId === p.id ? "Regenerating..." : "Regenerate Docs"}</span>
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.01 }} 
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => {
                                    setActiveGlobalProject(p.name);
                                    setActiveTab("graph");
                                  }}
                                  className="w-full py-2 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] font-bold rounded-lg transition-colors leading-none flex items-center justify-center gap-1.5 cursor-pointer font-mono tracking-wide uppercase select-none font-semibold shadow-sm"
                                >
                                  <span>View Knowledge Graph</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                            )}

                            {/* Secondary Row: Edit Project & Delete side-by-side */}
                            <div className="flex items-center gap-2 w-full text-[11px]">
                              <button
                                onClick={() => startEditing(p)}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-medium"
                                title="Edit Project"
                              >
                                <Edit2 className="w-3 h-3 text-[var(--text-muted)]" />
                                Edit Project
                              </button>
                              
                              <button
                                onClick={() => {
                                  setTargetForDeletion(p);
                                  setDeleteConfirmName("");
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 text-rose-500 hover:text-rose-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 font-medium"
                                title="Delete Project"
                              >
                                <Trash className="w-3 h-3" />
                                Delete
                              </button>

                              {!isActive && (
                                <button
                                  onClick={() => {
                                    setActiveGlobalProject(p.name);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[var(--accent-subtle)] hover:bg-[var(--accent)]/[0.2] text-[var(--accent)] text-[11px] font-semibold transition-all cursor-pointer border border-transparent"
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
