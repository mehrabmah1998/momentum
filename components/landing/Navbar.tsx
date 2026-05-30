"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X, Sparkles, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Override standard browser scroll-restoration/hash-jump on mount
    if (typeof window !== "undefined") {
      // Small timeout to guarantee we execute after the browser tries custom scroll jumping
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" as any });
      }, 50);

      if (window.location.hash) {
        // Clear the hash from the address bar to keep page loads clean on subsequent refreshes
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }

      return () => clearTimeout(timer);
    }
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
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-5 px-4 sm:px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "mx-auto max-w-5xl rounded-full transition-all duration-500",
            scrolled
              ? "bg-[var(--bg-card)]/85 border border-[var(--border)] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] backdrop-blur-xl px-6 py-2.5"
              : "bg-transparent border border-transparent shadow-none backdrop-blur-none px-6 py-3.5"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group select-none">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent)]/[0.08] p-[1.5px] overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-colors duration-300">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="z-10 w-2 h-2 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-hover)] rounded-full"
                />
              </div>
              <span className="font-sans font-extrabold tracking-tight text-[15px] sm:text-base text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300">
                Momentum
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 relative">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-1.5 text-[13px] font-medium font-sans tracking-tight rounded-full transition-colors duration-300 select-none",
                    hoveredIndex === index
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="relative z-10">{item.name}</span>
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="navHover"
                      className="absolute inset-0 bg-[var(--text-primary)]/[0.06] rounded-full -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Desktop Controls (Theme + CTA) */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggle}
                className="relative flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] hover:border-[var(--accent)]/30 bg-[var(--bg-surface)] hover:bg-[var(--text-primary)]/[0.04] text-[var(--text-primary)] transition-all duration-300 cursor-pointer active:scale-95"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -8, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 8, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                    ) : (
                      <Moon className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>

              <a
                href="#waitlist"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all duration-300 active:scale-[0.98] shadow-[0_4px_20px_-4px_var(--accent-glow)] overflow-hidden"
              >
                <span className="relative z-10">Get Early Access</span>
                <span className="relative z-10 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                  <ArrowRight className="w-3 h-3 text-white" strokeWidth={2.5} />
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </a>
            </div>

            {/* Mobile Control Row (Theme Toggle & Menu) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggle}
                className="relative flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-all duration-300 cursor-pointer active:scale-95"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />
                )}
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-hover)] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
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
            className="fixed inset-0 z-40 bg-[var(--bg)]/95 backdrop-blur-3xl md:hidden flex flex-col justify-center px-8"
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
                    className="text-xl font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] block tracking-wide transition-colors"
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6 border-t border-[var(--border)] flex flex-col gap-4"
              >
                <div className="flex items-center justify-center gap-3 py-2 text-xs uppercase tracking-widest font-mono text-[var(--text-muted)]">
                  <span>Theme:</span>
                  <span className="font-semibold text-[var(--text-primary)] capitalize">{theme}</span>
                </div>
                <a
                  href="#waitlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all shadow-lg w-full justify-center"
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
