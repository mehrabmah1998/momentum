"use client";

import { useTheme } from "@/hooks/useTheme";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-card)] backdrop-blur-md border-t border-[var(--border)] py-12 px-4 relative z-10 font-mono text-xs">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6 text-[var(--text-secondary)] text-center sm:text-left">
        
        {/* Brand logo details */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-6 h-6 rounded bg-[var(--bg-surface)] p-[1px] border border-[var(--border)]">
            <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
          </div>
          <span className="font-sans font-bold text-[var(--text-primary)]">Momentum</span>
        </div>

        {/* Links or permissions disclaimers */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-wider">
          <a href="#problem" className="hover:text-[var(--text-primary)] transition-colors">The Pain</a>
          <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">The Loop</a>
          <a href="#three-docs" className="hover:text-[var(--text-primary)] transition-colors">Three Docs</a>
          <a href="#waitlist" className="hover:text-[var(--text-primary)] transition-colors">Waitlist Beta</a>
        </div>

        {/* Technical context indicators */}
        <div className="text-[10px] text-[var(--text-muted)]">
          <span>&copy; {new Date().getFullYear()} Momentum Technology. All permissions reserved.</span>
        </div>

      </div>
    </footer>
  );
}
