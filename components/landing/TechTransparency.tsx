"use client";

import { motion } from "motion/react";
import { Cpu, Database, Github, CodeXml } from "lucide-react";

export default function TechTransparency() {
  const stack = [
    {
      name: "Next.js & App Router",
      category: "Frontend & API Core",
      desc: "Our server-driven, Standalone Next.js engine provides instant static compile generation alongside high-speed API routes to serve your prompt models locally.",
      logo: CodeXml,
      metrics: ["TypeScript", "App Router standard"]
    },
    {
      name: "PostgreSQL & pgvector",
      category: "Vector Graph Cache",
      desc: "Our backend caches your system nodes as high-dimensional embeddings. Postgres coordinates vector calculations to map which modules relate adjacent features.",
      logo: Database,
      metrics: ["COSINE index search", "UUID schemas"]
    },
    {
      name: "Claude Extraction API",
      category: "Cognitive Synthesizer",
      desc: "We route our dynamic conversational interview extraction through Claude Sonnet model weights, checking logical consistency and completeness iteratively.",
      logo: Cpu,
      metrics: ["System-level constraint checks"]
    },
    {
      name: "GitHub Webhook Syncer",
      category: "CI/CD Orchestration",
      desc: "A secure, native OAuth / webhook integration. When any member of the team commits a branch, our sync listens to diffs, updates the graph variables, and logs audit health logs.",
      logo: Github,
      metrics: ["Active diff analysis", "SSH keys enabled"]
    }
  ];

  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden dot-grid border-t border-white/5">
      <div className="absolute top-[35%] right-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 glow-spot" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-cyan font-semibold bg-brand-cyan/10 px-3 py-1 rounded-full mb-4 inline-block">
              Tech Transparency
            </span>
            <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white mb-4">
              Real infrastructure, not a simple AI wrapper.
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl">
              Understand the core services mapping your system relationships. We maintain real vector indices and robust database structures.
            </p>
          </div>
          <div className="p-6 bg-[#090e1c]/40 border border-white/10 rounded-3xl shrink-0 md:max-w-xs backdrop-blur">
            <p className="text-xs font-mono text-brand-cyan font-bold uppercase tracking-wider mb-2">
              Performance verified
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Graph serialization completes under 45ms. Native vector diffs parse live across continuous integration runs securely.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid Layout with custom borders */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stack.map((item, idx) => {
            const BrandLogo = item.logo;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="bg-[#090e1c]/50 border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    <div className="p-2 bg-white/5 border border-white/15 rounded-xl text-slate-300">
                      <BrandLogo className="w-5 h-5 text-brand-cyan" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-lg font-sans font-bold text-white mb-3">
                    {item.name}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                  {item.metrics.map((met) => (
                    <span
                      key={met}
                      className="text-[8px] font-mono uppercase tracking-widest text-slate-400 bg-white/5 px-2 py-0.5 rounded"
                    >
                      {met}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
