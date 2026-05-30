"use client";

import { motion } from "motion/react";
import { Users, Cpu, Globe, RefreshCw, CheckCircle2 } from "lucide-react";

export default function ThreeDocuments() {
  const docs = [
    {
      title: "Insider Doc",
      audience: "For Your Human Team",
      desc: "Detailed modular design specs, historical technical rationale, and architectural logs. Keeps onboarding engineers from having to dig through Slack or commit logs.",
      icon: Users,
      iconColor: "text-indigo-400 font-bold",
      accent: "#4f46e5",
      badge: "Narrative & Rationale",
      preview: (
        <div className="space-y-3 text-[11px] font-sans text-slate-400">
          <p className="text-white font-semibold"># Multi-Tenant Billing Rules</p>
          <p>We chose the Stripe direct charge route (RFC-24) to avoid holding transaction liability across cross-border setups.</p>
          <p className="border-l-2 border-indigo-500 pl-2 bg-indigo-500/5 py-1 text-slate-300">
            <strong>Rationale:</strong> Allows instant payouts directly to sub-accounts without manual ledger queries.
          </p>
          <div className="flex gap-2 pt-2 border-t border-white/5">
            <span className="text-[9px] bg-indigo-500/10 text-indigo-300 font-mono px-2 py-0.5 rounded-full">Owner: Mehrab Mah</span>
            <span className="text-[9px] bg-white/5 text-slate-400 font-mono px-2 py-0.5 rounded-full">Updated: 2 days ago</span>
          </div>
        </div>
      )
    },
    {
      title: "AI Doc",
      audience: "For Your Code Builder AI",
      desc: "Hyper-condensed, highly structured YAML/Markdown files. Tells Claude Code or Cursor only what it doesn't already know. Eliminates token waste and stops amnesia.",
      icon: Cpu,
      iconColor: "text-brand-cyan",
      accent: "#22d3ee",
      badge: "The Intelligent CLAUDE.md",
      preview: (
        <div className="space-y-2.5 text-[11px] font-mono text-slate-400">
          <p className="text-brand-cyan font-bold">@module billing_pipeline</p>
          <p className="text-slate-500">## STRICT_CONSTRAINTS</p>
          <p className="-my-1 text-slate-300">- stripe_currency: USD</p>
          <p className="-my-1 text-slate-300">- use_webhook_handler: true</p>
          <p className="-my-1 text-rose-400">- never_mock_stripe_calls: true</p>
          <p className="text-slate-500">## API_GRAPH_LINKS</p>
          <p className="-my-1 text-slate-300">→ auth_module.active_sessions</p>
          <p className="-my-1 text-slate-300">→ stripe_webhook.ts/POST</p>
        </div>
      )
    },
    {
      title: "Public spec",
      audience: "For Users and API Indexers",
      desc: "Perfect, simple English summary profiles and public API specs. Instantly feed into external search indexers or developer portals without manual synthesis.",
      icon: Globe,
      iconColor: "text-emerald-400",
      accent: "#10b981",
      badge: "Changelog and API Spec",
      preview: (
        <div className="space-y-3.5 text-[11px] font-sans text-slate-500">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-slate-200 font-semibold">GET /v1/billing/subscribers</span>
            <span className="text-emerald-400 font-mono text-[9px] uppercase tracking-wider bg-emerald-400/10 px-1 py-0.2 rounded font-bold">Stable</span>
          </div>
          <p className="text-slate-400 leading-normal">
            Lists subscribers linked with billing parameters. Returns payload with stripe customer ID hash.
          </p>
          <div className="p-2 rounded bg-slate-900/50 border border-white/5 font-mono text-[10px] text-slate-400">
            Returns: subscriber_profile: {"{ cus_id, tier, status }"}
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="three-docs" className="relative py-32 bg-[#030613]/80 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-brand-cyan font-semibold bg-brand-cyan/10 px-3 py-1 rounded-full mb-4 inline-block">
            One Knowledge Source
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white mb-6">
            Three documents. One single source of truth.
          </h2>
          <p className="text-slate-400 text-base md:text-lg">
            Momentum renders three tailored formats from the identical underlying system graph. When code updates, all views sync perfectly—making contradictions physically impossible.
          </p>
        </div>

        {/* 3 Panel Grid using the Doppelrand Double-Bezel spec */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {docs.map((doc, idx) => {
            const IconComponent = doc.icon;
            return (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-1.5 shadow-[0_20px_40px_-15px_rgba(34,211,238,0.05)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_40px_-15px_rgba(14,165,233,0.1)] group flex flex-col justify-between"
              >
                {/* Inner Bezel core */}
                <div className="bg-[#050915] rounded-[1.8rem] p-8 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] h-full flex flex-col justify-between">
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 bg-white/5 px-2.5 py-0.5 rounded border border-white/5">
                        {doc.badge}
                      </span>
                      <IconComponent className={`w-5 h-5 ${doc.iconColor}`} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-2xl font-sans font-semibold text-white tracking-tight leading-none mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-mono text-brand-cyan uppercase tracking-wider mb-4">
                      {doc.audience}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {doc.desc}
                    </p>
                  </div>

                  {/* Render simulated beautifully styled sub-preview */}
                  <div className="rounded-xl border border-white/10 bg-[#02050e] p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                    {doc.preview}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sync message */}
        <div className="mt-16 flex flex-col sm:flex-row items-center gap-4 justify-center text-center sm:text-left bg-gradient-to-r from-brand-blue/5 via-brand-cyan/5 to-transparent border border-white/5 max-w-2xl mx-auto rounded-full py-4 px-8 backdrop-blur">
          <RefreshCw className="w-5 h-5 text-brand-cyan animate-spin-slow" strokeWidth={1.5} />
          <p className="text-xs sm:text-sm font-sans text-slate-300 text-center sm:text-left">
            <strong>The Sync Pipeline:</strong> Changing a relationship in your graph instantly compiles and redeploys previews across all three target audiences.
          </p>
        </div>
      </div>
    </section>
  );
}
