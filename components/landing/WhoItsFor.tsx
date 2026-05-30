"use client";

import { motion } from "motion/react";
import { User, Users, FileSignature, ArrowRight } from "lucide-react";

export default function WhoItsFor() {
  const personas = [
    {
      title: "The Solo Founder",
      role: "SaaS Builder with Claude Code",
      frustration: "Your codebase crossed 12,000 lines. Suddenly, your AI builder can't fit everything into the context window, and is starting to overwrite vital API files because it lacks global constraint maps.",
      deliverable: "Locked Architectural Rails",
      desc: "Momentum holds context rules in place. Claude Code refers directly to the target schema, completing work 3x faster with zero regression bugs.",
      icon: User,
      iconColor: "text-brand-blue"
    },
    {
      title: "The Squad (2-4 Devs)",
      role: "High-Speed Indie Team",
      frustration: "Dev A updates the database schema. Dev B, prompting their AI locally with yesterday's layout config, accidentally commits conflicting code that breaks the staging builds.",
      deliverable: "CI Git Collaborative Sync",
      desc: "Real-time collaborative diagram coordinates instantly with code changes. Every member of the squad generates prompts from the identical source.",
      icon: Users,
      iconColor: "text-brand-cyan"
    },
    {
      title: "The Technical PM",
      role: "Precision Prompt Architect",
      frustration: "You spend hours writing design sheets, manually pasting JSON objects and database structures into Slack messages to tell engineers what context they need to prompt with.",
      deliverable: "One-Click Prompt Synthesis",
      desc: "Momentum automates the context collection. Select the epic, query the dependencies, and instantly generate prompts containing exact constraints.",
      icon: FileSignature,
      iconColor: "text-indigo-400"
    }
  ];

  return (
    <section id="who-its-for" className="relative py-32 bg-[#030613]/80 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-cyan font-semibold bg-brand-cyan/10 px-3 py-1 rounded-full mb-4 inline-block">
            Target Audience
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white mb-6">
            Designed for those who build with silicon.
          </h2>
          <p className="text-slate-400 text-lg">
            Whether you operate as a solo developer with cursor or deploy in collaborative indie squads, Momentum streamlines your context.
          </p>
        </div>

        {/* 3 Columns Persona Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {personas.map((per, index) => {
            const Icon = per.icon;
            return (
              <motion.div
                key={per.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#090e1c]/40 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between hover:border-white/20 hover:bg-[#090e1c]/80 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 bg-white/5 py-1 px-3 rounded border border-white/5">
                      {per.role}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-brand-cyan block">
                      <Icon className={`w-5 h-5 ${per.iconColor}`} strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-sans font-bold text-white mb-4 tracking-tight">
                    {per.title}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-[10px] font-mono text-rose-400 uppercase tracking-wider mb-1 font-bold">The Pain:</p>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed italic">
                        &ldquo;{per.frustration}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1 font-bold">The Momentum Value:</p>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        <strong className="text-white block mb-0.5">{per.deliverable}</strong>
                        {per.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                  <a href="#waitlist" className="text-xs font-mono uppercase tracking-widest text-slate-400 group-hover:text-brand-cyan inline-flex items-center gap-1.5 transition-colors duration-300">
                    <span>Solve this</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
