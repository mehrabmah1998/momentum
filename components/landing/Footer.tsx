"use client";

import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#02050e] border-t border-white/5 py-12 px-4 relative z-10 font-mono text-xs">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-500 text-center sm:text-left">
        
        {/* Brand logo details */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-6 h-6 rounded bg-white/5 p-[1px] border border-white/10">
            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
          </div>
          <span className="font-sans font-bold text-slate-300">Momentum</span>
        </div>

        {/* Links or permissions disclaimers */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-wider">
          <a href="#problem" className="hover:text-white transition-colors">The Pain</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">The Loop</a>
          <a href="#three-docs" className="hover:text-white transition-colors">Three Docs</a>
          <a href="#waitlist" className="hover:text-white transition-colors">Waitlist Beta</a>
        </div>

        {/* Technical context indicators */}
        <div className="text-[10px] text-slate-600">
          <span>&copy; {new Date().getFullYear()} Momentum Technology. All permissions reserved.</span>
        </div>

      </div>
    </footer>
  );
}
