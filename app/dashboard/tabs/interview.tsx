"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  HelpCircle,
  Send,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight,
  ArrowLeft,
  Shield,
  X,
  ChevronRight,
  AlertCircle,
  Check,
  RotateCcw,
  Plus
} from "lucide-react";

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
  referencesPrior?: string;
  askingWhy?: boolean;
}

interface CoverageSection {
  id: string;
  title: string;
  status: "confirmed" | "needs-input" | "empty";
  confidence: number;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    sender: "agent",
    text: "To begin building the detailed security spec for Momentum Secure Auth Gateway, I see we have defined JWT as our primary authentication token mechanism. Can you specify where the refresh tokens are persisted: are they stored in a HttpOnly cookie, in the database, or entirely client-side?",
    timestamp: "10:30 AM"
  },
  {
    id: "m2",
    sender: "user",
    text: "They are stored in a HttpOnly cookie on the backend, and we also keep a hash of the current active session in our PostgreSQL database for revoking sessions.",
    timestamp: "10:32 AM"
  },
  {
    id: "m3",
    sender: "agent",
    text: "Understood. Storing refresh tokens in HttpOnly cookies is standard practice for XSS protection, and matching them with a PostgreSQL state enables granular session revocation. But why did you decide to store a session hash in SQL rather than Redis? Is Redis memory constraints a factor, or do you prioritize exact state consistency over lookup speed?",
    timestamp: "10:33 AM",
    referencesPrior: "PostgreSQL active session hash tracking",
    askingWhy: true
  },
  {
    id: "m4",
    sender: "user",
    text: "Database consistency is critical for our security policy. We want to ensure that once a session is revoked, the access is immediately blocked across all microservices without any replication lag.",
    timestamp: "10:35 AM"
  },
  {
    id: "m5",
    sender: "agent",
    text: "That makes sense. Prioritizing instant consistency across microservices justifies SQL overhead, especially when revoking compromised sessions. Now, let's look at key safety. Under what conditions should a session be automatically locked: after 14 days of inactivity, absolute token expiry, or when a sudden geographical IP addresses mutation is detected?",
    timestamp: "10:36 AM"
  }
];

const INITIAL_COVERAGE: CoverageSection[] = [
  { id: "c1", title: "Core Platform & Vision", status: "confirmed", confidence: 100 },
  { id: "c2", title: "User Sessions & JWT Persistence", status: "needs-input", confidence: 60 },
  { id: "c3", title: "Data Consistency Rules", status: "needs-input", confidence: 45 },
  { id: "c4", title: "Multi-Factor Auth Flow", status: "empty", confidence: 0 },
  { id: "c5", title: "Key Rotation Policy", status: "needs-input", confidence: 20 },
  { id: "c6", title: "Stripe Webhook Gateway", status: "empty", confidence: 0 },
  { id: "c7", title: "Geo-Velocity Security Policies", status: "confirmed", confidence: 100 }
];

type FormatType = "open" | "options" | "examples" | "template" | "confirm" | "scale";

export default function InterviewTab({ onNavigate }: { onNavigate?: (tabId: string) => void } = {}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [coverage, setCoverage] = useState<CoverageSection[]>(INITIAL_COVERAGE);
  const [selectedSection, setSelectedSection] = useState<string>("c2");
  const [composerText, setComposerText] = useState("");
  const [activeFormat, setActiveFormat] = useState<FormatType>("options");
  const [showScenarioGate, setShowScenarioGate] = useState(true);
  const [scenarioState, setScenarioState] = useState<"new" | "existing" | null>(null);
  const [saturationProgress, setSaturationProgress] = useState(68);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedScale, setSelectedScale] = useState<number | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isConfirmPassOpen, setIsConfirmPassOpen] = useState(false);
  const [confirmPassStatus, setConfirmPassStatus] = useState<"idle" | "building" | "completed">("idle");
  const [templateDb, setTemplateDb] = useState("PostgreSQL Database");
  const [templateExpiry, setTemplateExpiry] = useState("15");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiThinking]);

  const handleSelectScenario = (type: "new" | "existing") => {
    setScenarioState(type);
    // Visual progress/state feedback
    setTimeout(() => {
      setShowScenarioGate(false);
    }, 400);
  };

  const handleSendText = () => {
    const textToSend = composerText.trim();
    if (!textToSend) return;

    // Send user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setComposerText("");
    setIsAiThinking(true);

    // Simulate agent processing and replying
    setTimeout(() => {
      setIsAiThinking(false);
      let replyText = "";
      if (activeFormat === "template") {
        replyText = `Understood. Specifying ${templateDb} with a ${templateExpiry} minutes access token expiry constraint has been locked inside the session rules. Why did you select ${templateExpiry} minutes rather than 5 or 30 minutes? Does this align with high-rotation security standards or a spec limit?`;
      } else if (activeFormat === "options") {
        replyText = `Thank you for choosing ${selectedOption || "Custom selection"}. Restricting access to HTTPOnly secure cookies helps defend against cross-site scripting vulnerabilities. Let's push this into our specification list.`;
      } else if (activeFormat === "scale") {
        replyText = `I have logged a level ${selectedScale || 4} confidence for this specific microservice constraint. We will proceed to detail the retry-fallback behaviors when databases are unreachable.`;
      } else {
        replyText = `Got it. This specification has been structured and aligned inside the knowledge graph. Let's move to our next point. Why do you define these failover mechanisms at the application layer instead of the gateway layer?`;
      }

      const agentMsg: Message = {
        id: `a-${Date.now()}`,
        sender: "agent",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencesPrior: userMsg.text,
        askingWhy: true
      };

      setMessages(prev => [...prev, agentMsg]);
      setSaturationProgress(prev => Math.min(prev + 4, 100));

      // Update confidence of the selected section visually
      setCoverage(prev => prev.map(sec => {
        if (sec.id === selectedSection) {
          const nextConf = Math.min(sec.confidence + 15, 100);
          return {
            ...sec,
            confidence: nextConf,
            status: nextConf >= 100 ? "confirmed" : "needs-input" as any
          };
        }
        return sec;
      }));
    }, 1500);
  };

  const selectOptionChip = (opt: string) => {
    setSelectedOption(opt);
    setComposerText(`We prefer using ${opt} to guarantee secure isolation bounds.`);
  };

  const selectScaleBtn = (val: number) => {
    setSelectedScale(val);
    setComposerText(`Our confidence for this security policy is rated at ${val}/5. It is a high-priority requirement.`);
  };

  const selectExample = (ex: string) => {
    setComposerText(ex);
  };

  const handleStartConfirmationPass = () => {
    setIsConfirmPassOpen(true);
    setConfirmPassStatus("building");
    setTimeout(() => {
      setConfirmPassStatus("completed");
    }, 2800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] lg:h-full font-sans w-full text-[var(--text-primary)] overflow-hidden min-h-0" id="interview-tab-root">
      
      {/* SCENARIO GATE BANNER */}
      <AnimatePresence>
        {showScenarioGate && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, height: "auto", scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="px-8 pt-6 pb-2 shrink-0 overflow-hidden"
          >
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 relative overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
              
              <div className="flex gap-4 items-start text-center md:text-left">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                  <Shield className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">Configure Extraction Vibe</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xl leading-relaxed">
                    Let us tailor our interview logic to match your workflow bounds. Are you starting something new from absolute zero, or analyzing an existing codebase?
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleSelectScenario("new")}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
                    scenarioState === "new"
                      ? "bg-[var(--accent)] text-white border-transparent"
                      : "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Starting Something New
                </button>
                <button
                  onClick={() => handleSelectScenario("existing")}
                  className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
                    scenarioState === "existing"
                      ? "bg-[var(--accent)] text-white border-transparent"
                      : "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Analyze Existing Product
                </button>
                <button
                  onClick={() => setShowScenarioGate(false)}
                  className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Dismiss Gate"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6 px-8 py-6 flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT RAIL: COVERAGE (Gaps tracker) */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4 min-h-0">
          <div className="bg-[var(--bg-surface)] p-[6px] border border-[var(--border)] rounded-[20px] shadow-sm flex flex-col h-full min-h-0">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-3 mb-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-[var(--text-muted)] font-bold block">
                      COVERAGE COMPILATOR
                    </span>
                    <h3 className="text-sm font-bold tracking-tight text-[var(--text-primary)] mt-1">
                      Gaps in Documentation
                    </h3>
                  </div>
                  <span className="text-[10px] bg-amber-500/[0.08] text-amber-400 font-mono font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
                    Active
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0 pr-1 mb-4">
                  {coverage.map((section) => {
                    const isSelected = selectedSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                          isSelected
                            ? "bg-[var(--accent)]/[0.08] text-[var(--accent)] border-[var(--accent)]/30 font-semibold shadow-sm"
                            : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-transparent hover:bg-black/10 dark:hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {section.status === "confirmed" ? (
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                          ) : section.status === "needs-input" ? (
                            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.4)] animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 rounded-full border border-[var(--border-hover)] shrink-0 bg-transparent" />
                          )}
                          <span className={`text-[12px] font-medium truncate font-sans ${isSelected ? "text-[var(--text-primary)] font-bold" : ""}`}>
                            {section.title}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] opacity-80 shrink-0 pl-1">
                          {section.confidence}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4 mt-4">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1.5 uppercase font-bold">
                  <span>General Saturation</span>
                  <span className="text-[var(--accent)] font-bold">{saturationProgress}%</span>
                </div>
                <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden w-full relative mb-1">
                  <div
                    style={{ width: `${saturationProgress}%` }}
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full transition-all duration-500 shadow-[0_0_8px_var(--accent-glow)] lg:shadow-none"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mb-4">
                  Momentum validates coherence thresholds automatically before triggering spec builds.
                </p>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate("documents")}
                    className="w-full py-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/[0.04] text-xs font-semibold text-[var(--accent)] border border-[var(--border)] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer outline-none active:scale-[0.98]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to documents</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: CONVERSATION FRAMEWORK & INTERACTION COMPONENTS */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 min-h-0">
          
          {/* HEADER OPTIONS BAR */}
          <div className="shrink-0 h-14 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold text-xs tracking-tight text-[var(--text-primary)]">Interactive Extraction Loop</span>
              <span className="hidden sm:inline-block font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[var(--text-muted)] border border-[var(--border)]">
                {messages.length} exchanges
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline font-mono text-[10px] text-[var(--text-muted)]">
                Knowledge Saturation: <span className="text-[var(--accent)] font-bold">{saturationProgress}%</span>
              </span>
              <button
                onClick={handleStartConfirmationPass}
                className="rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white hover:border-transparent text-[10px] font-bold py-1.5 px-4 uppercase tracking-wider transition-all shadow-[0_4px_15px_-4px_var(--accent-glow)] active:scale-[0.98] outline-none max-w-[170px] border-none cursor-pointer"
              >
                Review & Confirm &rarr;
              </button>
            </div>
          </div>

          {/* CHAT THREAD PORTAL */}
          <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden min-h-0">
            
            {/* Conversation Flow Area */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 scroll-smooth min-h-0 select-text">
              {messages.map((msg, idx) => {
                const isAgent = msg.sender === "agent";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex flex-col max-w-[85%] ${
                      isAgent ? "self-start items-start" : "self-end items-end"
                    }`}
                  >
                    {/* Tiny headers */}
                    <div className="flex items-center gap-2 mb-1 pl-1">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                        {isAgent ? "Momentum AI" : "You (Builder)"}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)]/50">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Bubble Content nested elegantly */}
                    <div
                      className={`text-[13px] leading-relaxed p-4 rounded-2xl border ${
                        isAgent
                          ? "bg-[var(--bg-surface)] border-[var(--border)] rounded-tl-sm text-[var(--text-secondary)]"
                          : "bg-[var(--accent)] text-white border-transparent rounded-tr-sm"
                      }`}
                    >
                      <p>{msg.text}</p>
                      
                      {msg.referencesPrior && (
                        <div className="mt-2.5 pt-2 border-t border-[var(--border)]/40 text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                          <span>Referencing: &ldquo;{msg.referencesPrior}&rdquo;</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {isAiThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="self-start flex flex-col max-w-[80%]"
                >
                  <div className="flex items-center gap-2 mb-1.5 pl-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-semibold animate-pulse">
                      Momentum AI is drafting response...
                    </span>
                  </div>
                  <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="w-4 h-4 border border-[var(--accent)] border-t-transparent rounded-full"
                    />
                    <span className="font-mono text-xs text-[var(--text-muted)]">Re-verifying extraction schema boundaries...</span>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* FORMAT DISPLAY SECTION */}
            <div className="border-t border-[var(--border)]/60 pt-4.5 mt-auto flex flex-col gap-3">
              
              {/* Interaction Format Controller Switcher */}
              <div className="flex items-center justify-between mb-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                    Formatting Adapter Mode:
                  </span>
                  <span className="text-[10px] font-mono bg-[var(--accent)]/[0.1] text-[var(--accent)] font-semibold px-2 py-0.5 rounded border border-[var(--accent)]/15 uppercase tracking-wide">
                    {activeFormat === "open" && "Open text input"}
                    {activeFormat === "options" && "Multi-Choice Chips"}
                    {activeFormat === "examples" && "Open text with Quick Examples"}
                    {activeFormat === "template" && "Inline Spec template filler"}
                    {activeFormat === "confirm" && "Draft Approval / Adjust Block"}
                    {activeFormat === "scale" && "Priority Saturation Rating"}
                  </span>
                </div>

                <span className="text-[9px] font-mono text-[var(--text-muted)] hidden xsm:inline">
                  Select to test formatting adapters below
                </span>
              </div>

              {/* Adapter Mode selector buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-black/15 dark:bg-black/25 border border-[var(--border)] rounded-xl p-1 shrink-0">
                {(["open", "options", "examples", "template", "confirm", "scale"] as FormatType[]).map((fmt) => {
                  const isActive = activeFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      onClick={() => {
                        setActiveFormat(fmt);
                        // Prepopulate composer appropriately
                        if (fmt === "template") {
                          setComposerText(`We store session in template formatting.`);
                        } else if (fmt === "options") {
                          setSelectedOption(null);
                          setComposerText("");
                        } else if (fmt === "scale") {
                          setSelectedScale(null);
                          setComposerText("");
                        } else {
                          setComposerText("");
                        }
                      }}
                      className={`text-[10px] font-mono font-bold capitalize py-1 px-1.5 text-center transition-all cursor-pointer rounded-md focus:outline-none border-none ${
                        isActive
                          ? "bg-[var(--bg-surface)] text-[var(--accent)] border border-[var(--accent)]/15 shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-transparent"
                      }`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>

              {/* RENDER ACTIVE FORMAT COMPONENT CONTAINER */}
              <div className="bg-[var(--bg-surface)]/45 border border-[var(--border)]/75 rounded-2xl p-4.5">
                
                {activeFormat === "open" && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 bg-black/10 dark:bg-black/20 px-2 py-1.5 rounded-lg border border-[var(--border)] w-max">
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-tight font-semibold">
                        FORMAT ADAPTER: Open-Ended Technical Spec Write-In
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Please expand on any high-availability backup systems or multi-region fallbacks you require in the secure auth microservice.
                    </p>
                  </div>
                )}

                {activeFormat === "options" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1 bg-black/10 dark:bg-black/20 px-2 py-1.5 rounded-lg border border-[var(--border)] w-max">
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-tight font-semibold">
                        FORMAT ADAPTER: Interactive Selectable Chips
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Where precisely do you isolate active token storage bounds?
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        "HttpOnly Strict Cookies",
                        "Encrypted LocalStorage Sync",
                        "Secure Browser Context Cache",
                        "In-Memory Session Redux Store"
                      ].map((opt) => {
                        const isChosen = selectedOption === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => selectOptionChip(opt)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 cursor-pointer ${
                              isChosen
                                ? "bg-[var(--accent)]/[0.12] text-[var(--accent)] border-[var(--accent)]/50 font-semibold shadow-sm"
                                : "border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => {
                          setSelectedOption("Other");
                          setComposerText("For token storage, we use a distinct secure bounds: ");
                        }}
                        className="px-3 py-1.5 text-xs rounded-full border border-dashed border-[var(--border-hover)] bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                      >
                        Other (Specify inside composer)
                      </button>
                    </div>
                  </div>
                )}

                {activeFormat === "examples" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1 bg-black/10 dark:bg-black/20 px-2 py-1.5 rounded-lg border border-[var(--border)] w-max">
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-tight font-semibold">
                        FORMAT ADAPTER: Predefined Spec Examples (Click to Fill)
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Give us details on access token lifetimes. Click any example below to fill the composer.
                    </p>
                    <div className="flex flex-col gap-2 pt-1 font-sans">
                      {[
                        "We run strict 15-minute access expirations combined with rotating refresh keys.",
                        "Static access credentials are valid for precisely 2 hours of active developer access.",
                        "Absolute expirations hit at exactly 30 days of inactivity, forcing MFA validation."
                      ].map((ex) => (
                        <button
                          key={ex}
                          onClick={() => selectExample(ex)}
                          className="w-full text-left p-2.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/30 hover:bg-[var(--bg-card)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all flex items-center justify-between select-none cursor-pointer group"
                        >
                          <span className="truncate pr-4 italic">&ldquo;{ex}&rdquo;</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeFormat === "template" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1 bg-black/10 dark:bg-black/20 px-2 py-1.5 rounded-lg border border-[var(--border)] w-max">
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-tight font-semibold">
                        FORMAT ADAPTER: Spec Sentence Builder Template
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Build your exact spec rule by filling out the placeholders below:
                    </p>
                    
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex flex-wrap items-center gap-2 text-xs leading-loose leading-relaxed font-sans mt-1">
                      <span className="text-[var(--text-secondary)] font-medium">We store primary user session context inside</span>
                      <select
                        value={templateDb}
                        onChange={(e) => {
                          setTemplateDb(e.target.value);
                          setComposerText(`We store session in ${e.target.value} with a ${templateExpiry} minutes lifetime spec.`);
                        }}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] px-2 py-1 rounded-md text-xs text-[var(--accent)] font-semibold outline-none hover:bg-neutral-800/10 transition-colors"
                      >
                        <option>PostgreSQL Database</option>
                        <option>Redis (In-Memory Key/Value)</option>
                        <option>DynamoDB Schema</option>
                        <option>Local JWT State Only</option>
                      </select>
                      <span className="text-[var(--text-secondary)] font-medium">and invalidate secure access tokens after exactly</span>
                      <input
                        type="number"
                        value={templateExpiry}
                        onChange={(e) => {
                          setTemplateExpiry(e.target.value);
                          setComposerText(`We store session in ${templateDb} with a ${e.target.value} minutes lifetime spec.`);
                        }}
                        className="w-12 bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--accent)] px-2 py-1 rounded-md text-xs text-center text-[var(--accent)] font-semibold outline-none hover:bg-neutral-800/10 transition-colors"
                      />
                      <span className="text-[var(--text-secondary)] font-medium">minutes of active idle state.</span>
                    </div>
                  </div>
                )}

                {activeFormat === "confirm" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1 bg-[var(--accent)]/[0.08] px-2 py-1.5 rounded-lg border border-[var(--accent)]/20 w-max text-[var(--accent)]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px] tracking-tight font-bold uppercase">
                        FORMAT ADAPTER: Spec Proposal Feedback Loop
                      </span>
                    </div>
                    
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4.5 flex flex-col gap-3 font-sans shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] font-bold">PROPOSAL DRAFT: SEC-AUTH-04</span>
                        <span className="text-[9px] bg-emerald-500/[0.08] text-emerald-400 font-mono font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">Highly action-ready</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-[var(--text-secondary)] font-medium">
                        <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" /> Require instant session invalidation across Microservice nodes.</p>
                        <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" /> Persist state sync db mapping checks inside gateway verification workflows.</p>
                        <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" /> Database unavailability enforces absolute failover security blocks.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => {
                          setComposerText("Draft Proposal SEC-AUTH-04 accepted successfully. Looks perfect.");
                          handleSendText();
                        }}
                        className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-none select-none cursor-pointer text-[10px] font-bold py-1.5 px-4 uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_12px_-3px_rgba(16,185,129,0.3)] duration-200 active:scale-[0.97]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Proposal</span>
                      </button>
                      <button
                        onClick={() => {
                          setComposerText("Under SEC-AUTH-04, we want to change database unavailability block to fallback gracefully. Let is allow reads but block writes: ");
                        }}
                        className="rounded-full border border-[var(--border)] hover:border-slate-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-neutral-800/10 text-[10px] font-bold py-1.5 px-4 uppercase tracking-wider transition-all select-none cursor-pointer active:scale-[0.97]"
                      >
                        Adjust Specification
                      </button>
                    </div>
                  </div>
                )}

                {activeFormat === "scale" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1 bg-black/10 dark:bg-black/20 px-2 py-1.5 rounded-lg border border-[var(--border)] w-max">
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span className="font-mono text-[10px] text-[var(--text-secondary)] tracking-tight font-semibold">
                        FORMAT ADAPTER: Saturation Priority Rating Scale
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Rate the critical importance of restricting geographical velocity mutations from 1 (Low priority background constraint) to 5 (Production critical security wall).
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isChosen = selectedScale === val;
                        return (
                          <button
                            key={val}
                            onClick={() => selectScaleBtn(val)}
                            className={`w-9 h-9 rounded-xl border font-mono text-sm font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                              isChosen
                                ? "bg-[var(--accent)] text-white border-transparent scale-105 shadow-[0_0_12px_var(--accent-glow)]"
                                : "border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-102"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                      <div className="ml-3 flex flex-col font-sans">
                        <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)] leading-none mb-1">
                          {selectedScale === null && "Select a scale rating"}
                          {selectedScale === 1 && "Background Constraint"}
                          {selectedScale === 2 && "Nice-to-Have Rule"}
                          {selectedScale === 3 && "Important Guideline"}
                          {selectedScale === 4 && "High Priority Spec"}
                          {selectedScale === 5 && "Production Hardened Gate"}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)] leading-none">
                          Informs auto-spec clustering priority weightings.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* INTEGRATED TEXTAREA COMPOSER BOX */}
              <div className="relative pt-1">
                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendText();
                    }
                  }}
                  className="bg-transparent border border-[var(--border)] focus:border-[var(--accent)] text-sm rounded-2xl pl-4 pr-12 py-3.5 transition-colors outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full resize-none h-[82px] leading-relaxed font-sans shadow-inner"
                  placeholder="Type your response here... (Press Enter to Send)"
                />
                
                <button
                  onClick={handleSendText}
                  disabled={composerText.trim() === ""}
                  className="absolute right-3.5 bottom-4 p-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-30 disabled:hover:bg-[var(--accent)] disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_var(--accent-glow)] flex items-center justify-center shrink-0 cursor-pointer border-none"
                  title="Send Answer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* REVIEWS & CONFIRM PASS DIALOGUE MODAL */}
      <AnimatePresence>
        {isConfirmPassOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsConfirmPassOpen(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--bg-surface)] border border-white/10 [html.light_&]:border-slate-200 p-6 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-10 max-w-lg w-full relative"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                  <span className="font-bold font-sans text-sm text-[var(--text-primary)]">Confirmation Pass Mode</span>
                </div>
                <button
                  onClick={() => setIsConfirmPassOpen(false)}
                  className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {confirmPassStatus === "building" ? (
                <div className="py-8 flex flex-col items-center justify-center text-center gap-4 animate-fadeIn">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full shadow-[0_0_15px_var(--accent-glow)]"
                  />
                  <div>
                    <h5 className="font-semibold text-sm text-[var(--text-primary)] font-sans">Compiling Specification Blueprint</h5>
                    <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm leading-relaxed">
                      Syncing extraction threads, evaluating edge integrity models, and exporting updated specification formats.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn font-sans">
                  <div className="bg-[var(--accent)]/[0.04] p-4.5 border border-[var(--border)] rounded-xl">
                    <h6 className="text-[12px] font-bold text-[var(--text-primary)] mb-1">Coherence Threshold Satisfied ({saturationProgress}%)</h6>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Momentum has logged active structural answers for user-auth subsystems. No critical gaps or conflicting requirements exist in the model.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[9px] font-mono tracking-wider text-[var(--text-muted)] font-bold uppercase block">Confirmable Actions Log</span>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[var(--text-secondary)]">Commit <code className="font-mono text-[10px] bg-black/20 px-1 py-0.5 rounded text-[var(--accent)]">SEC-AUTH-04</code>: Refresh tokens stored in cookies matching state session SQL validations</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[var(--text-secondary)]">Lock Access Lifetime limit: Hard absolute sessions expire after exactly 30 days of inactivity</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[var(--text-secondary)]">Publish spec updates onto both Insider and AI contexts</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-3 justify-end">
                    <button
                      onClick={() => setIsConfirmPassOpen(false)}
                      className="rounded-full border border-[var(--border)] hover:bg-neutral-800/10 text-[10px] font-bold py-2 px-4 uppercase tracking-wider transition-all select-none cursor-pointer outline-none text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmPassOpen(false);
                        setMessages([]);
                        setSaturationProgress(85);
                      }}
                      className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-none select-none cursor-pointer text-[10px] font-bold py-2 px-5 uppercase tracking-wider flex items-center gap-1 shadow-[0_4px_12px_-3px_rgba(16,185,129,0.35)] duration-200"
                    >
                      <span>Finalize Confirmation Pass</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
