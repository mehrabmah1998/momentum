"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  CheckCircle,
  Send,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  ChevronDown,
  ChevronRight,
  Grid,
  Save,
  Clock,
  Sparkles,
  Loader2
} from "lucide-react";

interface NodeItem {
  id: string;
  path: string;
  content: string;
  confidence: "CONFIRMED" | "NEEDS INPUT" | "UNDECIDED";
  timestamp: string;
  isNew?: boolean;
}

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
  type?: "default" | "options" | "examples" | "cluster" | "template" | "confirm" | "ranking" | "scale" | "conflict";
  options?: string[];
  examples?: string[];
  subQuestions?: { key: string; label: string }[];
  rankingItems?: string[];
  scaleEndpoints?: { min: string; max: string };
  conflictDetails?: { original: string; conflict: string };
  timestamp: string;
  qualityWarning?: boolean;
}

interface TreeSection {
  id: string;
  name: string;
  status: "empty" | "needs-input" | "confirmed";
  nodesCount: number;
}

interface ExtractionTabProps {
  projectId: string | null;
  onExit: () => void;
}

export default function ExtractionTab({ projectId, onExit }: ExtractionTabProps) {
  // State
  const [project, setProject] = useState<{ id: string; name: string; color: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(0); // 0 to 4
  const [completenessRatio, setCompletenessRatio] = useState<number>(0); // out of 100
  const [stepIndex, setStepIndex] = useState<number>(0); // current progressive script index (0 to 9)
  
  // Custom states for each interactive question format
  const [textInput, setTextInput] = useState<string>("");
  const [textInputB, setTextInputB] = useState<string>("");
  const [textInputC, setTextInputC] = useState<string>("");
  const [selectedChip, setSelectedChip] = useState<string>("");
  const [templateA, setTemplateA] = useState<string>("");
  const [templateB, setTemplateB] = useState<string>("");
  const [templateC, setTemplateC] = useState<string>("");
  const [scaleVal, setScaleVal] = useState<number>(5);
  const [orderedItems, setOrderedItems] = useState<string[]>([
    "High horizontal scalability",
    "Hard database consistency",
    "Low operational pricing",
    "Rapid time-to-market"
  ]);

  // Thread and graph states
  const [messages, setMessages] = useState<Message[]>([]);
  const [capturedNodes, setCapturedNodes] = useState<NodeItem[]>([]);
  const [sections, setSections] = useState<TreeSection[]>([
    { id: "org", name: "Organization Profile", status: "needs-input", nodesCount: 0 },
    { id: "basics", name: "Project Basics", status: "empty", nodesCount: 0 },
    { id: "arch", name: "Architecture Layout", status: "empty", nodesCount: 0 },
    { id: "features", name: "Features & Modules", status: "empty", nodesCount: 0 },
    { id: "confirm", name: "Confirmation", status: "empty", nodesCount: 0 }
  ]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    org: true,
    basics: false,
    arch: false,
    features: false,
    confirm: false,
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load project from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("workspace_global_projects");
    let targetProj = null;
    if (saved && projectId) {
      try {
        const list = JSON.parse(saved);
        targetProj = list.find((p: any) => p.id === projectId);
      } catch (e) {
        console.error(e);
      }
    }

    if (!targetProj) {
      targetProj = {
        id: projectId || "api-service",
        name: projectId === "api-service" ? "api-service" : projectId === "web-frontend" ? "web-frontend" : "Momentum Dashboard",
        color: "#06B6D4",
        description: "A Momentum software project knowledge base with dynamic extraction profiles."
      };
    }
    
    // Set matching project details
    setTimeout(() => {
      setProject(targetProj);
      setIsLoading(false);
    }, 0);
  }, [projectId]);

  // Trigger initial conversation
  useEffect(() => {
    if (!project) return;

    const initialNodes: NodeItem[] = [];
    const initialMsgs: Message[] = [
      {
        id: "m-init-intro",
        sender: "agent",
        text: `Hi Alex — I'm going to guide you through capturing your project knowledge base for ${project.name}. This is a structured knowledge map containing your system architecture, deployment profiles, and specifications. This usually takes 15–20 minutes and can be completed across multiple sessions. Let's start with your overall organization profile first.`,
        timestamp: "12:00 PM"
      },
      {
        id: "m-q1",
        sender: "agent",
        text: "Question 1: What stage is your project currently in?",
        type: "options",
        options: ["Pre-product", "Early product", "Live with users", "Established", "Other"],
        timestamp: "12:01 PM"
      }
    ];

    setTimeout(() => {
      setMessages(initialMsgs);
      setCapturedNodes(initialNodes);
    }, 0);
  }, [project]);

  // Handle scrolling of chat area
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAddNewNode = (path: string, content: string, status: "CONFIRMED" | "NEEDS INPUT" | "UNDECIDED") => {
    const newNode: NodeItem = {
      id: `node-${Date.now()}`,
      path,
      content,
      confidence: status,
      timestamp: "just now",
      isNew: true
    };

    setCapturedNodes(prev => [newNode, ...prev.map(n => ({ ...n, isNew: false }))]);

    // Update section count and status
    const parentSection = path.split(" -> ")[0];
    setSections(prev =>
      prev.map(sec => {
        if (sec.name === parentSection || (sec.id === "org" && parentSection === "Organization")) {
          return {
            ...sec,
            status: "confirmed",
            nodesCount: sec.nodesCount + 1
          };
        }
        return sec;
      })
    );

    // Increment completeness ratio slightly
    setCompletenessRatio(prev => Math.min(prev + 11, 100));
  };

  // Reordering ranking items
  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const nextArr = [...orderedItems];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextArr.length) return;
    
    // swap
    const tmp = nextArr[index];
    nextArr[index] = nextArr[targetIdx];
    nextArr[targetIdx] = tmp;
    setOrderedItems(nextArr);
  };

  // Skip step logic
  const handleSkipQuestion = () => {
    handleUserSubmit("Skipped, decided to skip for now");
  };

  // User message submit router
  const handleUserSubmit = (overrideText?: string, explicitType?: string) => {
    const answerText = overrideText || textInput;

    const formattedUserMsg: Message = {
      id: `user-msg-${Date.now()}`,
      sender: "user",
      text: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, formattedUserMsg]);
    setTextInput("");

    // Setup dynamic script step logic
    const nextIdx = stepIndex + 1;
    setStepIndex(nextIdx);

    // Script sequence
    setTimeout(() => {
      // STEP 1: Process answer to Q1 (Stage) and ask Q2 (Audience)
      if (nextIdx === 1) {
        handleAddNewNode("Organization", `Product stage declared as: ${answerText}.`, "CONFIRMED");
        setActiveStep(0); // still in organization scope
        setSections(prev => prev.map((s, i) => i === 1 ? { ...s, status: "needs-input" } : s));
        setExpandedSections(prev => ({ ...prev, org: true, basics: true }));

        setMessages(prev => [
          ...prev,
          {
            id: `agent-q2`,
            sender: "agent",
            text: "Question 2: Who is your core target audience for this workspace? Describe who they are and their main operational challenges.",
            type: "examples",
            examples: [
              "For example: 'senior backend engineers at Series A startups dealing with slow API deployments'",
              "For example: 'solo founders building their first SaaS products with no dedicated infrastructure team'"
            ],
            timestamp: "just now"
          }
        ]);
      }

      // STEP 2: Process Q2 (Audience) and ask Q3 (Vision Statement Template)
      else if (nextIdx === 2) {
        handleAddNewNode("Organization", `Target audience defined: ${answerText}.`, "CONFIRMED");
        setActiveStep(1); // Project Basics Phase
        setSections(prev => prev.map((s, i) => i === 0 ? { ...s, status: "confirmed" } : i === 1 ? { ...s, status: "needs-input" } : s));
        setExpandedSections(prev => ({ ...prev, org: false, basics: true }));

        setMessages(prev => [
          ...prev,
          {
            id: `agent-q3`,
            sender: "agent",
            text: "Question 3: Perfect. Let's frame your core vision. Please fill in the vision template below to establish the primary value alignment.",
            type: "template",
            timestamp: "just now"
          }
        ]);
      }

      // STEP 3: Process Q3 (Vision Statement) and ask Q4 (Scale Urgency)
      else if (nextIdx === 3) {
        const sentence = `We help developers do ${templateA || "automated schema analysis"} so they can ${templateC || "ship reliable system code faster"}`;
        handleAddNewNode("Project Basics", `Vision statement aligned: "${sentence}".`, "CONFIRMED");
        setActiveStep(1); // Still basics

        setMessages(prev => [
          ...prev,
          {
            id: `agent-q4`,
            sender: "agent",
            text: "Question 4: What is the primary technical issue context window you're trying to solve? Please rate the extreme urgency of this issue from 1 to 10.",
            type: "scale",
            scaleEndpoints: { min: "1 (Low operational friction)", max: "10 (Mission critical blocker)" },
            timestamp: "just now"
          }
        ]);
      }

      // STEP 4: Process Q4 (Scale Urgency) and ask Q5 (Quick Cluster architectural details)
      else if (nextIdx === 4) {
        handleAddNewNode("Project Basics", `Urgency rating mapped: Priority scale ${scaleVal}/10. High level blocker description: ${answerText || "Infrastructure sync bottlenecks"}`, "CONFIRMED");
        setActiveStep(2); // Architecture Phase
        setSections(prev => prev.map((s, i) => i === 1 ? { ...s, status: "confirmed" } : i === 2 ? { ...s, status: "needs-input" } : s));
        setExpandedSections(prev => ({ ...prev, basics: false, arch: true }));

        setMessages(prev => [
          ...prev,
          {
            id: `agent-q5`,
            sender: "agent",
            text: "Question 5: Let's lay the foundations of your technical stack. Fill in this initial cluster identifying the core technologies utilized in production:",
            type: "cluster",
            subQuestions: [
              { key: "env", label: "Cloud Hosting Framework / Provider" },
              { key: "db", label: "Primary Transactional Database" },
              { key: "lang", label: "Core Runtime Language Profile" }
            ],
            timestamp: "just now"
          }
        ]);
      }

      // STEP 5: Process Q5 (Cluster Architecture) and ask Q6 (System Priorities Ranking)
      else if (nextIdx === 5) {
        const clusterSummary = `Hosting Node: ${textInput || "Vercel / AWS"}. Database Node: ${textInputB || "Postgres"}. Logic Engine: ${textInputC || "Go / TypeScript"}.`;
        handleAddNewNode("Architecture Layout", clusterSummary, "CONFIRMED");
        setActiveStep(2); // Still architecture

        setMessages(prev => [
          ...prev,
          {
            id: `agent-q6`,
            sender: "agent",
            text: "Question 6: Got it. Now please rank your physical systems layout priorities. Arrange the following priorities from highest system criticality (top) to lowest (bottom):",
            type: "ranking",
            timestamp: "just now"
          }
        ]);
      }

      // STEP 6: Process Q6 (Priority Ranking) and ask Q7 (Authentication description)
      else if (nextIdx === 6) {
        handleAddNewNode("Architecture Layout", `System priority vector compiled: ${orderedItems.join(" > ")}.`, "CONFIRMED");
        setActiveStep(3); // Features & Modules Phase
        setSections(prev => prev.map((s, i) => i === 2 ? { ...s, status: "confirmed" } : i === 3 ? { ...s, status: "needs-input" } : s));
        setExpandedSections(prev => ({ ...prev, arch: false, features: true }));

        setMessages(prev => [
          ...prev,
          {
            id: `agent-q7`,
            sender: "agent",
            text: "Question 7: Let's focus on the concrete application features now. First, describe your Authentication flow in details. How do users gain access and how are secure sessions persist inside the browser?",
            timestamp: "just now"
          }
        ]);
      }

      // STEP 7: Quality Gate Rejection (Simulating a vague response check on Q7)
      else if (nextIdx === 7) {
        setMessages(prev => [
          ...prev,
          {
            id: `agent-quality-rejection`,
            sender: "agent",
            text: "Could you expand on this auth model? Let's identify specifically whether you are using access tokens, JWTs, a provider like NextAuth, Auth0, or custom server sessions.",
            qualityWarning: true,
            timestamp: "just now"
          }
        ]);
        setStepIndex(6); // stay at Q7 step index so the next answer properly progresses past Q7
      }

      // STEP 8: Process expanded Q7 and ask Q8 (Worker loop with CONTRAST conflict trigger)
      else if (nextIdx === 8) {
        handleAddNewNode("Features & Modules", `Auth implementation: ${answerText}.`, "CONFIRMED");
        setActiveStep(3); // features

        setMessages(prev => [
          ...prev,
          {
            id: `agent-q8`,
            sender: "agent",
            text: "Question 8: Understood. Now please describe your sync background worker sequence. How do asynchronous background loops sync data repositories and write metadata nodes?",
            timestamp: "just now"
          }
        ]);
      }

      // STEP 9: Contradictory Input Event Trigger
      else if (nextIdx === 9) {
        setMessages(prev => [
          ...prev,
          {
            id: `agent-conflict-detected`,
            sender: "agent",
            text: "Conflict Detected. You previously declared a serverless Vercel deployment with relational Postgres transactional session nodes, but your sync worker description indicates a standalone continuous background loop with client-side localStorage in-memory queues without server persistence. Which mapping should resolve this conflict?",
            type: "conflict",
            conflictDetails: {
              original: "Next.js on Vercel utilizing Postgres Database sessions and write persistence",
              conflict: "Continuous backend Node.js worker writing to client browser localStorage and in-memory caches only"
            },
            timestamp: "just now"
          }
        ]);
        setStepIndex(8); // stay at Q8 step index
      }

      // STEP 10: Process resolved conflict and transition to confirmation phases
      else if (nextIdx === 10) {
        handleAddNewNode("Features & Modules", `Synchronous Worker loop flow: ${answerText === "original" ? "Relational database queue system" : "Client-side localStorage fallback"}. Resolved alignment logic to PostgreSQL.`, "CONFIRMED");
        setActiveStep(4); // Confirmation Phase
        setSections(prev => prev.map((s, i) => i === 3 ? { ...s, status: "confirmed" } : i === 4 ? { ...s, status: "needs-input" } : s));
        setExpandedSections(prev => ({
          org: false,
          basics: false,
          arch: false,
          features: false,
          confirm: true
        }));

        setMessages(prev => [
          ...prev,
          {
            id: `agent-confirmation-init`,
            sender: "agent",
            text: "Perfect. We have compiled the full system knowledge layer for this project. Ready for final synthesis. Let me present the proposed structure for your validation:",
            type: "confirm",
            timestamp: "just now"
          }
        ]);
      }

      // STEP 11: Final success confirmation completed!
      else if (nextIdx === 11) {
        setCompletenessRatio(100);
        setSections(prev => prev.map(s => ({ ...s, status: "confirmed" })));
        setMessages(prev => [
          ...prev,
          {
            id: `agent-extraction-complete`,
            sender: "agent",
            text: "Awesome Alex. That concludes our structured knowledge extraction session! The unified graph network and documentation layouts have been resolved. Your live developer dashboard has been initialized with this new active mapping context.",
            timestamp: "just now"
          }
        ]);
        
        // Update global projects data
        const savedProjects = localStorage.getItem("workspace_global_projects");
        if (savedProjects) {
          try {
            const list = JSON.parse(savedProjects);
            const updated = list.map((p: any) => {
              if (p.id === projectId) {
                return {
                  ...p,
                  recentActivity: "Knowledge capture complete · Unified graph compiled"
                };
              }
              return p;
            });
            localStorage.setItem("workspace_global_projects", JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }, 900);
  };

  const handleConfirmAndExit = () => {
    onExit();
  };

  if (isLoading || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-[#090a0f] text-white p-8">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <span className="text-sm font-mono tracking-widest uppercase opacity-75">Loading project environment...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-[#090a0f] text-white rounded-3xl border border-white/5 overflow-hidden relative" style={{ minHeight: "calc(100dvh - 120px)" }}>
      {/* Glow decorations */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-cyan-950/15 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-blue-950/15 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* INNER TABS HEADER */}
      <header className="w-full h-14 bg-[#0d0e14]/90 border-b border-white/5 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-[var(--accent)] text-xs font-mono tracking-wider hover:underline uppercase" onClick={handleConfirmAndExit}>
            ← Exit
          </button>
          <span className="text-white/20 font-mono text-xs">|</span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/20 border border-cyan-800/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold font-mono tracking-wide text-cyan-400 uppercase">
              {project.name}
            </span>
          </div>
        </div>

        {/* Center Progress Tracker */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono tracking-wider text-white/40">
          {[
            { label: "Org Profile", step: 0 },
            { label: "Project Basics", step: 1 },
            { label: "Architecture", step: 2 },
            { label: "Features", step: 3 },
            { label: "Confirmation", step: 4 }
          ].map((phase, idx) => {
            const isCompleted = activeStep > phase.step;
            const isActive = activeStep === phase.step;

            return (
              <React.Fragment key={phase.label}>
                {idx > 0 && <span className="opacity-40">→</span>}
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    isActive
                      ? "text-cyan-400 font-bold bg-cyan-950/25 border border-cyan-500/20"
                      : isCompleted
                      ? "text-emerald-400 font-semibold"
                      : "text-white/30"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
                  ) : (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] border ${
                      isActive ? "bg-cyan-500/10 border-cyan-400" : "border-white/20"
                    }`}>
                      {idx + 1}
                    </span>
                  )}
                  <span>{phase.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right side widgets */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-lg">
            <span className="text-[10px] font-bold font-mono text-white/50 uppercase">Completeness:</span>
            <span className="text-xs font-black font-mono text-cyan-400">{completenessRatio}%</span>
          </div>

          <button
            onClick={handleConfirmAndExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-semibold cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save & Exit</span>
          </button>
        </div>
      </header>

      {/* TWO PANEL WORKSPACE */}
      <div className="w-full flex flex-col lg:flex-row flex-1 overflow-hidden z-10" style={{ height: "calc(100dvh - 176px)" }}>

        {/* LEFT PANEL — CONVERSATION EXPERIENCE (60%) */}
        <section className="w-full lg:w-[60%] flex flex-col border-r border-white/5 bg-[#0a0b10] relative overflow-hidden h-[50dvh] lg:h-auto">
          
          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#0d0e14]/40 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                Unified Mind Portal
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </h2>
              <p className="text-[10px] text-white/50 font-mono mt-0.5">
                Status: Extracting {sections[activeStep]?.name || "Organization Profile"}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Session Persistent</span>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const isAgent = m.sender === "agent";

                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className={`flex gap-3 max-w-[85%] ${isAgent ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold border ${
                      isAgent
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        : "bg-white/5 border-white/10 text-white/70"
                    }`}>
                      {isAgent ? "M" : "A"}
                    </div>

                    <div className="flex flex-col gap-1.5 max-w-full">
                      {/* Message Bubble Container */}
                      <div
                        className={`rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed border ${
                          isAgent
                            ? m.qualityWarning
                              ? "bg-amber-500/5 border-amber-500/30 text-white"
                              : m.type === "conflict"
                              ? "bg-rose-500/5 border-rose-500/30 text-white"
                              : "bg-[#11121a]/80 border-white/5 text-white/90"
                            : "bg-white/5 border-white/10 text-white/95"
                        }`}
                      >
                        {m.qualityWarning && (
                          <div className="text-[9px] uppercase tracking-wider font-bold text-amber-400 font-mono mb-1">
                            {"Let's go deeper ↓"}
                          </div>
                        )}
                        {m.type === "conflict" && (
                          <div className="text-[9px] uppercase tracking-wider font-bold text-rose-400 font-mono mb-1">
                            Conflict Detected
                          </div>
                        )}

                        <div className="whitespace-pre-line">{m.text}</div>

                        {/* Format: Vision template */}
                        {isAgent && m.type === "template" && stepIndex === 2 && (
                          <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-3">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Vision Statement Preview</span>
                            <div className="text-xs md:text-sm leading-8 text-white/90">
                              We help{" "}
                              <input
                                type="text"
                                spellCheck={false}
                                placeholder="developers"
                                value={templateA}
                                onChange={(e) => setTemplateA(e.target.value)}
                                className="inline-block bg-white/5 border-b border-white/30 text-cyan-400 rounded px-1.5 py-0.5 max-w-[120px] outline-none text-center focus:border-cyan-400 font-bold"
                              />{" "}
                              do{" "}
                              <input
                                type="text"
                                spellCheck={false}
                                placeholder="automated schema analysis"
                                value={templateB}
                                onChange={(e) => setTemplateB(e.target.value)}
                                className="inline-block bg-white/5 border-b border-white/30 text-cyan-400 rounded px-1.5 py-0.5 max-w-[180px] outline-none text-center focus:border-cyan-400 font-bold"
                              />{" "}
                              so they can{" "}
                              <input
                                type="text"
                                spellCheck={false}
                                placeholder="ship reliable code fast"
                                value={templateC}
                                onChange={(e) => setTemplateC(e.target.value)}
                                className="inline-block bg-white/5 border-b border-white/30 text-cyan-400 rounded px-1.5 py-0.5 max-w-[180px] outline-none text-center focus:border-cyan-400 font-bold"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const composed = `We help ${templateA || "developers"} do ${templateB || "automated schema analysis"} so they can ${templateC || "ship reliable system code fast"}`;
                                handleUserSubmit(composed);
                              }}
                              className="mt-2 py-1.5 bg-cyan-500 hover:bg-cyan-600 font-bold font-mono text-[10px] uppercase tracking-wider rounded-lg text-black cursor-pointer text-center"
                            >
                              Commit Vision Statement Template
                            </button>
                          </div>
                        )}

                        {/* Format: Dynamic priorities ranking stack */}
                        {isAgent && m.type === "ranking" && stepIndex === 5 && (
                          <div className="mt-4 flex flex-col gap-2">
                            {orderedItems.map((item, idx) => (
                              <div
                                key={item}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono"
                              >
                                <span>{idx + 1}. {item}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleMoveItem(idx, "up")}
                                    disabled={idx === 0}
                                    className="p-1 rounded bg-white/5 text-white/60 hover:text-white disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveItem(idx, "down")}
                                    disabled={idx === orderedItems.length - 1}
                                    className="p-1 rounded bg-white/5 text-white/60 hover:text-white disabled:opacity-30 cursor-pointer"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const orderText = orderedItems.map((x, ii) => `[${ii + 1}] ${x}`).join(", ");
                                handleUserSubmit(orderText);
                              }}
                              className="mt-3 py-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold uppercase tracking-wider font-mono text-[10px] rounded-xl cursor-pointer text-center"
                            >
                              Confirm Priority Order
                            </button>
                          </div>
                        )}

                        {/* Format: Interactive sliding scale priority */}
                        {isAgent && m.type === "scale" && stepIndex === 3 && (
                          <div className="mt-4 p-3 rounded-xl bg-black/35 border border-white/5 flex flex-col gap-3">
                            <div className="flex justify-between items-center text-[10px] font-mono text-white/50">
                              <span>{m.scaleEndpoints?.min}</span>
                              <span className="text-cyan-400 font-black text-sm">{scaleVal}</span>
                              <span>{m.scaleEndpoints?.max}</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={scaleVal}
                              onChange={(e) => setScaleVal(parseInt(e.target.value))}
                              className="w-full accent-cyan-400 cursor-pointer h-1 bg-white/10 rounded-lg outline-none"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Describe operational bottlenecks..."
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 text-xs px-3 py-1.5 rounded-lg text-white"
                              />
                              <button
                                onClick={() => {
                                  handleUserSubmit(`Priority level: ${scaleVal}/10. High friction logs: ${textInput || "infrastructure sync bottlenecks"}`);
                                }}
                                className="px-4 bg-cyan-400 text-black font-bold text-xs uppercase rounded-lg cursor-pointer"
                              >
                                Submit Rating
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Format: Conflict reconciliation */}
                        {isAgent && m.type === "conflict" && stepIndex === 8 && (
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/25 flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] uppercase tracking-widest font-mono text-rose-400 font-bold block mb-1">DECLARATION A</span>
                                <p className="text-[11px] text-white/80 leading-relaxed">{m.conflictDetails?.original}</p>
                              </div>
                              <button
                                onClick={() => handleUserSubmit("original")}
                                className="mt-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-lg font-mono text-[9px] uppercase font-bold cursor-pointer"
                              >
                                Keep Original
                              </button>
                            </div>

                            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/25 flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] uppercase tracking-widest font-mono text-cyan-400 font-bold block mb-1">DECLARATION B</span>
                                <p className="text-[11px] text-white/80 leading-relaxed">{m.conflictDetails?.conflict}</p>
                              </div>
                              <button
                                onClick={() => handleUserSubmit("conflict")}
                                className="mt-4 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/25 rounded-lg font-mono text-[9px] uppercase font-bold cursor-pointer"
                              >
                                Resolve to B
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Format: System Certification Confirm cards */}
                        {isAgent && m.type === "confirm" && stepIndex === 10 && (
                          <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-cyan-500/15">
                            <span className="text-[9px] uppercase tracking-widest font-mono text-cyan-400 font-black block mb-3">CONSOLIDATED PROJECT SPECS</span>
                            <div className="space-y-2 mb-4">
                              <div className="flex border-b border-white/5 pb-1 justify-between text-[11px] font-mono">
                                <span className="text-white/40">Core Stage</span>
                                <span className="text-white/90">Live with Active Users</span>
                              </div>
                              <div className="flex border-b border-white/5 pb-1 justify-between text-[11px] font-mono">
                                <span className="text-white/40">Target Stake</span>
                                <span className="text-white/90">Staff & Infrastructure Engineers</span>
                              </div>
                              <div className="flex border-b border-white/5 pb-1 justify-between text-[11px] font-mono">
                                <span className="text-white/40">Technical Stack</span>
                                <span className="text-white/90">NextJS · PostgreSQL · Vercel</span>
                              </div>
                              <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-white/40">Persistence Loop</span>
                                <span className="text-white/90">Synchronous PostgreSQL DB Queues</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUserSubmit("Looks good", "confirm-final")}
                                className="flex-1 py-2 bg-emerald-400 text-black font-extrabold uppercase tracking-widest font-mono text-[10px] rounded-xl hover:bg-emerald-500 transition-all cursor-pointer text-center"
                              >
                                Looks good ✓
                              </button>
                              <button
                                onClick={() => handleUserSubmit("I need to adjust some answers")}
                                className="px-4 py-2 border border-white/10 hover:border-white/20 text-white/80 font-mono text-[10px] uppercase tracking-wider rounded-xl cursor-pointer text-center"
                              >
                                Adjust
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Final generate documentation action card */}
                        {m.text && m.text.includes("concludes our structured knowledge extraction session") && (
                          <div className="mt-4">
                            <button
                              onClick={() => {
                                handleUserSubmit("generate-complete");
                                setTimeout(() => {
                                  onExit();
                                }, 800);
                              }}
                              className="w-full group py-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 font-extrabold uppercase tracking-widest text-xs text-black shadow-lg shadow-cyan-500/15 flex items-center justify-center gap-2 cursor-pointer hover:shadow-cyan-500/25 transition-all"
                            >
                              <Sparkles className="w-4 h-4 text-black animate-pulse" />
                              <span>Generate Documentation →</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Pill style custom option select chips */}
                      {isAgent && m.type === "options" && stepIndex === 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5 pl-1">
                          {m.options?.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setSelectedChip(opt);
                                setTextInput(opt);
                              }}
                              className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                                selectedChip === opt
                                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 font-semibold"
                                  : "bg-white/5 border-white/10 text-white/70 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Suggested configurations (Examples format) */}
                      {isAgent && m.type === "examples" && stepIndex === 1 && (
                        <div className="mt-2.5 p-3 rounded-lg bg-black/35 border border-white/5 flex flex-col gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-white/30 font-bold">Suggested Configurations</span>
                          {m.examples?.map((ex, i) => (
                            <div key={i} className="text-[11px] text-white/50 italic leading-relaxed pl-2 border-l border-white/15">
                              {ex}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Architecture specifications input cluster */}
                      {isAgent && m.type === "cluster" && stepIndex === 4 && (
                        <div className="mt-3 p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3">
                          <span className="text-[9px] uppercase tracking-widest font-mono text-cyan-400 font-black">Architecture Cluster mapping schema</span>
                          {m.subQuestions?.map((sub) => (
                            <div key={sub.key} className="flex flex-col gap-1">
                              <label className="text-[10px] font-mono whitespace-nowrap text-white/50">{sub.label}</label>
                              <input
                                type="text"
                                placeholder="Specify tech node name..."
                                value={sub.key === "env" ? textInput : sub.key === "db" ? textInputB : textInputC}
                                onChange={(e) => {
                                  if (sub.key === "env") setTextInput(e.target.value);
                                  else if (sub.key === "db") setTextInputB(e.target.value);
                                  else setTextInputC(e.target.value);
                                }}
                                className="w-full bg-[#11121a] text-white text-xs border border-white/10 px-3 py-1.5 rounded-lg outline-none focus:border-cyan-400"
                              />
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const aggregated = `Cluster specs -> Cloud: ${textInput || "AWS / Vercel"}. Database: ${textInputB || "PostgreSQL"}. Language Layer: ${textInputC || "Go / TypeScript"}.`;
                              handleUserSubmit(aggregated);
                            }}
                            className="mt-2 py-2 bg-cyan-400 hover:bg-cyan-500 font-bold uppercase tracking-wider font-mono text-[10px] text-black rounded-lg cursor-pointer text-center"
                          >
                            Submit Cluster Specifications
                          </button>
                        </div>
                      )}

                      <span className={`text-[9px] font-mono text-white/20 select-none ${isAgent ? "text-left ml-1" : "text-right mr-1"}`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* INPUT PORTAL FOOTER */}
          <div className="p-4 border-t border-white/5 bg-[#0d0e14]/70 z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative flex items-center bg-[#11121a] rounded-xl border border-white/10 focus-within:border-cyan-500/50 transition-colors">
                <input
                  type="text"
                  placeholder="Type your answer to support knowledge building..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && textInput.trim()) {
                      handleUserSubmit();
                    }
                  }}
                  className="w-full bg-transparent text-white text-xs px-4 py-3 outline-none"
                />
                
                <div className="absolute right-3 flex items-center gap-2">
                  <span className="hidden md:flex items-center gap-1 text-[9px] font-mono text-white/30 tracking-tight">
                    <span>Press Enter</span>
                    <CornerDownLeft className="w-3 h-3 text-white/20" />
                  </span>

                  <button
                    onClick={() => {
                      if (textInput.trim()) {
                        handleUserSubmit();
                      }
                    }}
                    className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>
            </div>

            {/* Helper status row */}
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mt-3 select-none">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>
                  Currently Filling:{" "}
                  <span className="text-white/70 font-bold uppercase tracking-wider font-sans">
                    {activeStep === 0
                      ? "Organization -> Audience"
                      : activeStep === 1
                      ? "Project Basics -> Vision"
                      : activeStep === 2
                      ? "Architecture -> Cloud foundation"
                      : activeStep === 3
                      ? "Features -> Authentication Spec"
                      : "Knowledge Base Certification -> Completed"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="opacity-75">Saved automatically</span>
                <span>|</span>
                <button
                  onClick={handleSkipQuestion}
                  className="text-white/60 hover:text-cyan-400 cursor-pointer transition-colors"
                >
                  Skip this question
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL — LIVE KNOWLEDGE CAPTURE (40%) */}
        <section className="w-full lg:w-[40%] h-[50dvh] lg:h-auto flex flex-col bg-[#0b0c11] relative overflow-hidden">
          
          <div className="px-6 py-4 border-b border-white/5 bg-[#0d0e14]/30 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xs font-bold font-mono text-white tracking-widest uppercase flex items-center gap-2">
                Unified Knowledge Map
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </h2>
              <p className="text-[10px] text-white/50 font-mono mt-0.5">
                Auto-updating as specification captures complete
              </p>
            </div>
          </div>

          {/* Directory folders list */}
          <div className="p-6 border-b border-white/5 bg-black/20 shrink-0 max-h-[180px] lg:max-h-none overflow-y-auto">
            <span className="text-[9px] uppercase tracking-wider font-mono text-white/40 font-black block mb-3">
              KNOWLEDGE MAP DIRECTORIES
            </span>
            <div className="space-y-2">
              {sections.map((sec, idx) => {
                const isOpen = expandedSections[sec.id];
                const isActive = activeStep === idx;

                return (
                  <div
                    key={sec.id}
                    className={`rounded-xl border transition-colors ${
                      isActive
                        ? "bg-[#11121a]/80 border-cyan-500/20"
                        : "bg-[#0d0e14]/50 border-white/5"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedSections(prev => ({ ...prev, [sec.id]: !prev[sec.id] }))
                      }
                      className="w-full flex items-center justify-between px-3 py-2 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                        )}
                        
                        <div className={`w-2 h-2 rounded-full ${
                          sec.status === "confirmed"
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                            : sec.status === "needs-input"
                            ? "bg-amber-400 animate-pulse"
                            : "bg-white/10"
                        }`} />

                        <span className={`text-xs font-sans ${isActive ? "text-cyan-400 font-bold" : "text-white/80"}`}>
                          {sec.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[9px] text-white/40">
                        <span>{sec.nodesCount} nodes captured</span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-2.5 pt-1 border-t border-white/5 font-mono text-[10px] text-white/60 space-y-1.5 select-none">
                        {sec.id === "org" && (
                          <>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Stage Spec</span>
                              <span className="text-emerald-400 font-bold">✓ Resolved</span>
                            </div>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Target Audience Profile</span>
                              <span className={stepIndex > 1 ? "text-emerald-400 font-bold" : "text-amber-400 animate-pulse font-bold"}>
                                {stepIndex > 1 ? "✓ Captured" : "Required"}
                              </span>
                            </div>
                          </>
                        )}
                        {sec.id === "basics" && (
                          <>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Core Vision Alignment</span>
                              <span className={stepIndex > 2 ? "text-emerald-400 font-bold" : "opacity-40"}>
                                {stepIndex > 2 ? "✓ Captured" : "Pending"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Urgency Bottlenecks Mapping</span>
                              <span className={stepIndex > 3 ? "text-emerald-400 font-bold" : "opacity-40"}>
                                {stepIndex > 3 ? "✓ Captured" : "Pending"}
                              </span>
                            </div>
                          </>
                        )}
                        {sec.id === "arch" && (
                          <>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Cloud Runtime Clusters</span>
                              <span className={stepIndex > 4 ? "text-emerald-400 font-bold" : "opacity-40"}>
                                {stepIndex > 4 ? "✓ Captured" : "Pending"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Systems Priorities Deck</span>
                              <span className={stepIndex > 5 ? "text-emerald-400 font-bold" : "opacity-40"}>
                                {stepIndex > 5 ? "✓ Captured" : "Pending"}
                              </span>
                            </div>
                          </>
                        )}
                        {sec.id === "features" && (
                          <>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Authn/Authz Encryption Node</span>
                              <span className={stepIndex > 7 ? "text-emerald-400 font-bold" : "opacity-40"}>
                                {stepIndex > 7 ? "✓ Captured" : "Pending"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center opacity-85">
                              <span>· Scheduler Queue Synchronization</span>
                              <span className={stepIndex > 9 ? "text-emerald-400 font-bold" : "opacity-40"}>
                                {stepIndex > 9 ? "✓ Captured" : "Pending"}
                              </span>
                            </div>
                          </>
                        )}
                        {sec.id === "confirm" && (
                          <div className="opacity-40 text-center py-1">
                            System Verification Node Block
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Directory detailed live nodes */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <span className="text-[9px] uppercase tracking-widest font-mono text-white/40 font-black block mb-1">
              LIVE NODE STREAM
            </span>

            {capturedNodes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-12">
                <Grid className="w-10 h-10 mb-2 stroke-[1]" />
                <span className="text-xs font-mono">No nodes compiled yet. Complete prompts on the left to resolve nodes.</span>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {capturedNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      boxShadow: node.isNew ? "0 0 16px rgba(6, 182, 212, 0.15)" : "none"
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                    className={`p-4 rounded-2xl border transition-all ${
                      node.isNew
                        ? "bg-cyan-500/10 border-cyan-400"
                        : "bg-[#0d0e14]/60 border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        {node.path}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest font-black uppercase ${
                        node.confidence === "CONFIRMED"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      }`}>
                        {node.confidence}
                      </span>
                    </div>

                    <p className="text-xs text-white/90 leading-relaxed font-sans">{node.content}</p>

                    <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-white/30 select-none">
                      <span>Compiled: JUST NOW</span>
                      <span>HASH IDENTIFIER: {node.id}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* COMPLETENESS DIAL FOOTER LOGS */}
          <div className="p-6 border-t border-white/5 bg-[#0d0e14]/50 shrink-0">
            <div className="flex items-center gap-5">
              {/* Completeness Ring SVG */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-[3.5] stroke-white/5 fill-none"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-[3.5] stroke-cyan-400 stroke-linecap-round fill-none"
                    strokeDasharray={175}
                    initial={{ strokeDashoffset: 175 }}
                    animate={{ strokeDashoffset: 175 - (175 * completenessRatio) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute text-xs font-black font-mono text-white">
                  {completenessRatio}%
                </span>
              </div>

              {/* Completeness stats text */}
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-xs font-bold font-sans text-white">
                  {sections.filter(s => s.status === "confirmed").length} of 5 mapping zones compiled
                </span>
                <p className="text-[11px] font-mono text-white/40 mt-1">
                  {capturedNodes.length} active spec parameters synced to workspace graph network cache.
                </p>
                <div className="flex gap-4 mt-2 font-mono text-[9px] uppercase tracking-wider text-white/55 select-none">
                  <span className="text-amber-400 font-bold">
                    {sections.filter(s => s.status === "needs-input").length} Zones Need Input
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">
                    {sections.filter(s => s.status === "confirmed").length} Certified Nodes
                  </span>
                </div>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
