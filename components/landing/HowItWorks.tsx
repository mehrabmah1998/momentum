"use client";

import { motion } from "motion/react";
import { MessageSquareCode, Copy, GitPullRequest, LayoutDashboard, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: MessageSquareCode,
      title: "Talk with the Extraction Engine",
      desc: "Answer a dynamic context interview. Momentum doesn't just parse text—it actively validates answers for logical consistency, and queries design patterns to build the primary architecture node.",
      tags: ["Conversational Extraction", "Context Check"]
    },
    {
      step: "02",
      icon: LayoutDashboard,
      title: "Synthesize the 3 Document Layer",
      desc: "One single knowledge graph compiles three dedicated formats: Insider Docs for your human engineers, high-speed structured markdown files for your LLMs, and indexable public API specifications.",
      tags: ["Zero Disconnections", "Single Graph Output"]
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
      title: "Export Pristine Prompt Context",
      desc: "Momentum packs exactly what the LLM needs—including specific interfaces, constraints, and relationships. Copy/paste or inject the perfect context block straight into Claude Code or Cursor.",
      tags: ["Token Saving", "Clean Prompts"]
    },
    {
      step: "05",
      icon: GitPullRequest,
      title: "Git Hook Syncs the Loop",
      desc: "Once your AI builder completes the task and you make a commit, Momentum listens to the repository hook, diffs the code changes, updates the graph variables, and logs confidence trust scores.",
      tags: ["CI Hook", "Auto Refresh"]
    }
  ];

  return (
    <section id="how-it-works" className="relative py-32 bg-[#020617] overflow-hidden dot-grid">
      <div className="absolute top-[25%] right-[5%] w-[450px] h-[450px] rounded-full bg-brand-cyan/5 glow-spot" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-brand-blue/5 glow-spot" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-cyan font-semibold bg-brand-cyan/10 px-3 py-1 rounded-full mb-4 inline-block">
            The Continuous Loop
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white mb-6">
            The Momentum loop makes development bulletproof.
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            A precise, continuous loop where human design coordinates with structured context, prompting, and automated system synchronization.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical joining line with gradient glow */}
          <div className="absolute left-[36px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-brand-blue/40 via-brand-cyan/20 to-slate-800" />

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
                  <div className="relative z-10 flex items-center justify-center w-[74px] h-[74px] shrink-0 rounded-full border border-white/10 bg-[#090e1c] group-hover:border-brand-cyan/50 shadow-md group-hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all duration-500">
                    <span className="font-mono text-base font-bold text-slate-300 group-hover:text-brand-cyan transition-colors duration-300">
                      {item.step}
                    </span>
                  </div>

                  {/* Content Container */}
                  <div className="flex-1 bg-[#090e1c]/50 p-8 rounded-3xl border border-white/5 group-hover:border-white/15 hover:bg-[#090e1c]/80 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-brand-blue">
                          <IconComp className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-sans font-bold text-white tracking-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-5">
                      {item.desc}
                    </p>

                    {/* Step specific tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tg) => (
                        <span
                          key={tg}
                          className="text-[9px] font-mono uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded"
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
