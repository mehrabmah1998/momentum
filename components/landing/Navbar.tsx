"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "The Pain", href: "#problem" },
    { name: "The Loop", href: "#how-it-works" },
    { name: "Three Docs", href: "#three-docs" },
    { name: "Teaser Views", href: "#knowledge-views" },
    { name: "Who It's For", href: "#who-its-for" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-4 px-4 sm:px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "mx-auto max-w-5xl rounded-full transition-all duration-500",
            scrolled
              ? "bg-[#090e1c]/80 border border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl px-6 py-3"
              : "bg-transparent border border-transparent px-4 py-4"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-cyan p-[1px] overflow-hidden">
                <div className="absolute inset-0 bg-[#020617] rounded-[7px]" />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="z-10 w-2.5 h-2.5 bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                />
              </div>
              <span className="font-sans font-bold tracking-tight text-lg text-white">
                Momentum
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-xs uppercase tracking-widest font-mono text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="#waitlist"
                className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand-blue to-brand-cyan/85 hover:to-brand-cyan transition-all duration-300 active:scale-[0.98] shadow-[0_4px_20px_-4px_rgba(14,165,233,0.3)]"
              >
                <span>Get Early Access</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                  <ArrowRight className="w-3 h-3" strokeWidth={2} />
                </span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl md:hidden flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-8 text-center">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-medium text-slate-300 hover:text-white block tracking-wide"
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6 border-t border-white/10"
              >
                <a
                  href="#waitlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-brand-blue to-brand-cyan shadow-lg w-full justify-center"
                >
                  <span>Get Early Access</span>
                  <ArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
