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

    // Seamless artificial delayed submit
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <section id="waitlist" className="relative py-40 bg-[#030613]/80 border-t border-white/5 overflow-hidden dot-grid">
      <div className="absolute top-[35%] left-[30%] w-[500px] h-[500px] rounded-full bg-brand-blue/10 glow-spot" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 relative">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-slate-300 font-medium">
              Join the Private Beta
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-white mb-6">
            Keep your AI code builders in active alignment.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">
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
                <div className="relative p-1.5 rounded-full bg-[#090e1c] border border-white/10 hover:border-white/20 focus-within:border-brand-cyan transition-all duration-300 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent px-5 py-3 rounded-full text-sm font-sans placeholder-slate-500 focus:outline-none text-white overflow-hidden text-ellipsis"
                    disabled={status === "submitting"}
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group select-none relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-black bg-white hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shrink-0"
                  >
                    <span>{status === "submitting" ? "Synthesizing..." : "Join Waitlist"}</span>
                    {status !== "submitting" && (
                      <span className="w-4 h-4 rounded-full bg-black/5 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                      </span>
                    )}
                  </button>
                </div>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-400 font-mono text-[11px] mt-4 uppercase tracking-widest"
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
                className="max-w-md mx-auto p-8 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur flex flex-col items-center gap-4 text-center shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-sans font-bold text-white leading-tight">
                  You are registered
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Thank you! Your spot has been secured at position <strong className="text-white">#1,284</strong> on our waitlist tier. We will invite you in batches.
                </p>
                <div className="text-[10px] uppercase tracking-widest font-mono text-emerald-400/80 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/15">
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
