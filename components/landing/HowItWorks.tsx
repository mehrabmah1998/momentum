"use client";

import { motion } from "motion/react";
import { MessageSquareCode, Copy, GitPullRequest, LayoutDashboard, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: MessageSquareCode,
      title: "Talk with the Extraction Engine",
      desc: "The primary input for your project's knowledge. Momentum interviews you by asking one sharp question at a time, dynamically adapting its format to your style, and validating every answer for specificity and rationale before storing it.",
      tags: ["Conversational Extraction", "Primary Input"]
    },
    {
      step: "02",
      icon: LayoutDashboard,
      title: "Build the Structured Knowledge Graph",
      desc: "Your interview answers instantly compile into a living knowledge graph. It structures modules, features, decisions (along with their core rationales), constraints, and entities inside a pre-defined, queryable mind map.",
      tags: ["Knowledge Graph", "Pre-defined Mind Map"]
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Describe the Feature & Debate",
      desc: "Draft a simple feature idea. Momentum queries your graph, crosschecks existing modules, flags data inconsistencies or design violations, and brainstorms architecture before a line of code is written.",
      tags: ["Conflict Checker", "Precheck Query"]
    },
    {
      step: "04",
      icon: Copy,
      title: "Export the Precision Prompt",
      desc: "Momentum exports a compiled precision prompt containing exact guidelines across key sections: context, constraints to respect, what must not break, and files likely involved. Copy/paste this prompt straight into Claude Code or Cursor to start coding.",
      tags: ["Precision Prompt", "Zero Guessing"]
    },
    {
      step: "05",
      icon: GitPullRequest,
      title: "Optional Feature Verification",
      desc: "Optionally connect GitHub, and after your AI builder commits, Momentum diffs the commit against the planned feature — confirming it was built as agreed, or flagging where it diverged. This verification outcome marks features as built and elevates graph confidence.",
      tags: ["Optional", "Feature Verification"]
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 bg-transparent border-t border-[var(--border)] overflow-hidden dot-grid">
      <div className="absolute top-[25%] right-[5%] w-[450px] h-[450px] rounded-full bg-[var(--accent-glow)] glow-spot" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-[var(--accent-glow)] glow-spot" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--accent)] font-semibold bg-[var(--accent-subtle)] border border-[var(--accent)]/15 px-3 py-1 rounded-full mb-4 inline-block">
            The Continuous Loop
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[var(--text-primary)] mb-6">
            The Momentum loop makes development bulletproof.
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg">
            A precise, continuous loop: you talk, Momentum structures, your AI builder executes — and the knowledge never goes stale.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical joining line with elegant gradient transition */}
          <div className="absolute left-[36px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[var(--accent)]/60 via-[var(--accent-hover)]/30 to-[var(--border)]" />

          <div className="space-y-16">
            {steps.map((item, index) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-8 relative group"
                >
                  {/* Step Bubble marker */}
                  <div className="relative z-10 flex items-center justify-center w-[74px] h-[74px] shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-md group-hover:border-[var(--accent)] shadow-md group-hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-500">
                    <span className="font-mono text-base font-bold text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors duration-300">
                      {item.step}
                    </span>
                  </div>

                  {/* Content Container */}
                  <div className="flex-1 bg-[var(--bg-card)]/50 backdrop-blur-md p-8 rounded-3xl border border-[var(--border)] group-hover:border-[var(--border-hover)] hover:bg-[var(--bg-card)]/80 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--accent)]">
                          <IconComp className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-sans font-bold text-[var(--text-primary)] tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-5">
                      {item.desc}
                    </p>

                    {/* Step specific tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tg) => (
                        <span
                          key={tg}
                          className="text-[9px] font-mono uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border)] px-2 py-0.5 rounded"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
