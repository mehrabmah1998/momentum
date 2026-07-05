"use client";

import { motion } from "motion/react";
import { Users, Cpu, Globe, RefreshCw } from "lucide-react";

export default function ThreeDocuments() {
  const docs = [
    {
      title: "Insider Doc",
      audience: "For Your Human Team",
      desc: "Detailed modular design specs, historical technical rationale, and architectural logs. Keeps onboarding engineers from having to dig through Slack or commit logs.",
      icon: Users,
      iconColor: "text-[var(--accent)] font-bold",
      badge: "Narrative & Rationale",
      preview: (
        <div className="space-y-3 text-[11px] font-sans text-[var(--text-secondary)]">
          <p className="text-[var(--text-primary)] font-semibold"># Multi-Tenant Billing Rules</p>
          <p>We chose the Stripe direct charge route (RFC-24) to avoid holding transaction liability across cross-border setups.</p>
          <div className="border-l-2 border-[var(--accent)] pl-2 bg-[var(--accent-subtle)] py-1 text-[var(--text-primary)]">
            <strong>Rationale:</strong> Allows instant payouts directly to sub-accounts without manual ledger queries.
          </div>
          <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
            <span className="text-[9px] bg-[var(--accent-subtle)] text-[var(--accent)] font-mono px-2 py-0.5 rounded-full">Owner: Mehrab Mah</span>
            <span className="text-[9px] bg-[var(--bg-surface)] text-[var(--text-muted)] font-mono px-2 py-0.5 rounded-full">Updated: 2 days ago</span>
          </div>
        </div>
      )
    },
    {
      title: "AI Doc",
      audience: "For Your Code Builder AI",
      desc: "Hyper-condensed, highly structured YAML/Markdown files. Tells Claude Code or Cursor only what it doesn't already know. Eliminates token waste and stops amnesia.",
      icon: Cpu,
      iconColor: "text-[var(--accent)]",
      badge: "The Intelligent CLAUDE.md",
      preview: (
        <div className="space-y-2.5 text-[11px] font-mono text-[var(--text-secondary)]">
          <p className="text-[var(--accent)] font-bold">@module billing_pipeline</p>
          <p className="text-[var(--text-muted)]">## STRICT_CONSTRAINTS</p>
          <p className="-my-1 text-[var(--text-primary)]">- stripe_currency: USD</p>
          <p className="-my-1 text-[var(--text-primary)]">- use_webhook_handler: true</p>
          <p className="-my-1 text-rose-500 font-semibold">- never_mock_stripe_calls: true</p>
          <p className="text-[var(--text-muted)]">## API_GRAPH_LINKS</p>
          <p className="-my-1 text-[var(--text-primary)]">→ auth_module.active_sessions</p>
          <p className="-my-1 text-[var(--text-primary)]">→ stripe_webhook.ts/POST</p>
        </div>
      )
    },
    {
      title: "Public spec",
      audience: "For Users and API Indexers",
      desc: "Perfect, simple English summary profiles and public API specs. Instantly feed into external search indexers or developer portals without manual synthesis.",
      icon: Globe,
      iconColor: "text-emerald-500",
      badge: "Changelog and API Spec",
      preview: (
        <div className="space-y-3.5 text-[11px] font-sans text-[var(--text-secondary)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="text-[var(--text-primary)] font-semibold">GET /v1/billing/subscribers</span>
            <span className="text-emerald-500 font-mono text-[9px] uppercase tracking-wider bg-emerald-500/10 px-1 py-0.2 rounded font-bold">Stable</span>
          </div>
          <p className="text-[var(--text-secondary)] leading-normal">
            Lists subscribers linked with billing parameters. Returns payload with stripe customer ID hash.
          </p>
          <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--border)] font-mono text-[10px] text-[var(--text-secondary)]">
            Returns: subscriber_profile: {"{ cus_id, tier, status }"}
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="three-docs" className="relative py-32 bg-transparent border-t border-[var(--border)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--accent)] font-semibold bg-[var(--accent-subtle)] border border-[var(--accent)]/15 px-3 py-1 rounded-full mb-4 inline-block">
            One Knowledge Source
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-[var(--text-primary)] mb-6">
            Three documents. One single source of truth.
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg">
            Momentum renders three tailored documents from one knowledge graph. When the knowledge updates, all three update with it — making contradictions physically impossible.
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
                whileHover={{ y: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: idx * 0.1
                }}
                className="bg-[var(--border)] border border-[var(--border)] rounded-[2rem] p-1.5 shadow-[0_20px_40px_-15px_var(--accent-glow)] transition-all duration-300 hover:border-[var(--border-hover)] group flex flex-col justify-between"
              >
                {/* Inner Bezel core */}
                <div className="bg-[var(--bg-card)] backdrop-blur-md rounded-[1.8rem] p-8 border border-[var(--border)] h-full flex flex-col justify-between">
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)] bg-[var(--bg-surface)] px-2.5 py-0.5 rounded border border-[var(--border)]">
                        {doc.badge}
                      </span>
                      <IconComponent className={`w-5 h-5 ${doc.iconColor}`} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-2xl font-sans font-semibold text-[var(--text-primary)] tracking-tight leading-none mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider mb-4">
                      {doc.audience}
                    </p>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                      {doc.desc}
                    </p>
                  </div>

                  {/* Render simulated beautifully styled sub-preview */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] backdrop-blur-md p-5">
                    {doc.preview}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Knowledge pipeline message */}
        <div className="mt-16 flex flex-col sm:flex-row items-center gap-4 justify-center text-center sm:text-left bg-gradient-to-r from-[var(--accent-subtle)] to-transparent border border-[var(--border)] max-w-2xl mx-auto rounded-full py-4 px-8 backdrop-blur">
          <RefreshCw className="w-5 h-5 text-[var(--accent)] animate-spin-slow shrink-0" strokeWidth={1.5} />
          <p className="text-xs sm:text-sm font-sans text-[var(--text-primary)] text-center sm:text-left">
            <strong>The Knowledge Pipeline:</strong> Changing a relationship in your graph instantly compiles and updates all three target documents.
          </p>
        </div>
      </div>
    </section>
  );
}
