"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      setStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // Delayed sumbit mock execution
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <section id="waitlist" className="relative py-40 bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden dot-grid">
      <div className="absolute top-[35%] left-[30%] w-[500px] h-[500px] rounded-full bg-[var(--accent-glow)] glow-spot" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full mb-6 relative">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)] font-medium">
              Join the Private Beta
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-[var(--text-primary)] mb-6">
            Keep your AI code builders in active alignment.
          </h2>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-10 leading-relaxed">
            Momentum is currently in private beta for select solo founders and indie tech squads. Drop your email to claim your position in line.
          </p>

          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.form
                key="form-waitlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="w-full max-w-lg mx-auto"
              >
                <div className="relative p-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] focus-within:border-[var(--accent)] transition-all duration-300 shadow-[0_30px_60px_-15px_var(--accent-glow)] flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent px-5 py-3 rounded-full text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none text-[var(--text-primary)] overflow-hidden text-ellipsis placeholder:font-sans"
                    disabled={status === "submitting"}
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group select-none relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--bg)] bg-[var(--text-primary)] hover:opacity-90 transition-all duration-300 active:scale-[0.98] shrink-0 cursor-pointer"
                  >
                    <span>{status === "submitting" ? "Synthesizing..." : "Join Waitlist"}</span>
                    {status !== "submitting" && (
                      <span className="w-4 h-4 rounded-full bg-[var(--bg)]/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="w-3 h-3 text-[var(--bg)]" strokeWidth={2.5} />
                      </span>
                    )}
                  </button>
                </div>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 font-mono text-[11px] mt-4 uppercase tracking-widest font-bold"
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="success-waitlist"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="max-w-md mx-auto p-8 rounded-3xl border border-emerald-500/20 bg-[var(--bg-card)] backdrop-blur flex flex-col items-center gap-4 text-center shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                  <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-sans font-bold text-[var(--text-primary)] leading-tight">
                  You are registered
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Thank you! Your spot has been secured at position <strong className="text-[var(--text-primary)]">#1,284</strong> on our waitlist tier. We will invite you in batches.
                </p>
                <div className="text-[10px] uppercase tracking-widest font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/15 font-bold">
                  Confirm email dispatched
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
