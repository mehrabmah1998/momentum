"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[var(--bg)] relative overflow-hidden px-4 py-8">
      {/* Floating Back to Home Trigger */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/50 backdrop-blur-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all duration-300 select-none active:scale-[0.98] font-sans"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" strokeWidth={2.5} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center">
        {/* Centered Momentum Logo */}
        <Link href="/" className="group flex items-center gap-3 mb-8 transition-opacity hover:opacity-90">
          {/* Logo container */}
          <div className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center relative overflow-hidden">
            {/* Pulsing glow inside */}
            <div className="absolute inset-0 bg-[var(--accent-glow)] opacity-10 rounded-lg blur-[2px]" />
            {/* Spinning accent dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="w-2.5 h-2.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full shadow-[0_0_8px_var(--accent)]"
            />
          </div>
          <span className="font-sans font-bold text-lg text-[var(--text-primary)] tracking-tight">
            Momentum
          </span>
        </Link>

        {/* Outer Card structure mimicking Doppelrand bezel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-2xl bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] p-8 sm:p-10 relative overflow-hidden"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
          
          {children}
        </motion.div>
      </div>
    </div>
  );
}
