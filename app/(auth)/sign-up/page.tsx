"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, X } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";

export default function SignUpPage() {
  const pathname = usePathname();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // For live helper guidance
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Live password requirements evaluation
  const requirements = [
    { id: "length", label: "At least 8 characters", valid: password.length >= 8 },
    { id: "uppercase", label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(password) },
    { id: "number", label: "One number (0-9)", valid: /[0-9]/.test(password) },
    { id: "special", label: "One special character (!@#...)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const fulfilledCount = requirements.filter(r => r.valid).length;
  
  // Color configuration depending on fulfillment status
  const getStrengthConfig = () => {
    if (password.length === 0) return { label: "Empty", colorClass: "bg-[var(--border)]", textClass: "text-[var(--text-muted)]" };
    if (fulfilledCount <= 1) return { label: "Weak Security", colorClass: "bg-rose-500", textClass: "text-rose-400" };
    if (fulfilledCount <= 3) return { label: "Medium Security", colorClass: "bg-amber-400", textClass: "text-amber-400" };
    return { label: "Strong Guard Activated", colorClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]", textClass: "text-emerald-400" };
  };

  const strength = getStrengthConfig();

  const handleGoogle = () => {
    setError("");
    signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  const handleGithub = () => {
    setError("");
    signIn.social({ provider: "github", callbackURL: "/dashboard" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    // 1. Validate fields are populated
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Validate password strength criteria
    if (fulfilledCount < 4) {
      setError("Please satisfy all password safety requirements listed below.");
      return;
    }

    // 3. Confirm password matching
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your entries.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
      });
      if (res?.error) {
        setError(res.error.message);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during account creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col justify-start"
    >
      {/* Header */}
      <div className="text-center md:text-left mb-6">
        <h1 className="text-2xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed font-sans font-normal">
          Start building with Momentum
        </p>
      </div>

      {/* Social Register Triggers */}
      <div className="flex flex-col gap-3">
        {/* Google Button */}
        <motion.button
          onClick={handleGoogle}
          type="button"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0 }}
          className="w-full rounded-full bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-3 px-6 text-sm transition-all flex items-center justify-center gap-3 cursor-pointer select-none font-sans font-medium hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Google Color G logo standard SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span className="font-medium">Continue with Google</span>
        </motion.button>

        {/* GitHub Button */}
        <motion.button
          onClick={handleGithub}
          type="button"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="w-full rounded-full bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-3 px-6 text-sm transition-all flex items-center justify-center gap-3 cursor-pointer select-none font-sans font-medium hover:scale-[1.01] active:scale-[0.99]"
        >
          {/* Custom SVG cleaner github logo */}
          <svg className="w-4 h-4 shrink-0 fill-[var(--text-secondary)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
          </svg>
          <span className="font-medium">Continue with GitHub</span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="w-full flex items-center justify-between my-6">
        <div className="h-[1px] bg-[var(--border)] flex-grow" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)] mx-4 font-bold select-none">
          or
        </span>
        <div className="h-[1px] bg-[var(--border)] flex-grow" />
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.10 }}
          className="flex flex-col justify-start"
        >
          <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[var(--text-muted)] mb-1 font-bold">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            <input
              required
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] pl-8 pr-4 text-sm py-3 transition-colors outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
            />
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="flex flex-col justify-start"
        >
          <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[var(--text-muted)] mb-1 font-bold">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] pl-8 pr-4 text-sm py-3 transition-colors outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.20 }}
          className="flex flex-col justify-start"
        >
          <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[var(--text-muted)] mb-1 font-bold">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onFocus={() => setIsPasswordFocused(true)}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] pl-8 pr-10 text-sm py-3 transition-colors outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1 flex items-center justify-center cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Live Password Strength Indicator (Animated on focus or type) */}
        <AnimatePresence>
          {(isPasswordFocused || password.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[var(--text-muted)]">
                  Strength Level
                </span>
                <span className={`text-[10px] uppercase font-mono tracking-wider font-bold transition-all duration-300 ${strength.textClass}`}>
                  {strength.label}
                </span>
              </div>

              {/* Segmented Strength Bar */}
              <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                {[1, 2, 3, 4].map((step) => {
                  const isActive = password.length > 0 && fulfilledCount >= step;
                  return (
                    <div
                      key={step}
                      className="h-full rounded-full bg-[var(--border)] overflow-hidden relative"
                    >
                      {isActive && (
                        <motion.div
                          layoutId={`strengthBarSegment-${step}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`absolute inset-0 origin-left ${strength.colorClass}`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Requirements Live Checklist with Micro staggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {requirements.map((req, ridx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ridx * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-350 ${
                      req.valid 
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                        : "border-[var(--border)] text-[var(--text-muted)]"
                    }`}>
                      {req.valid ? (
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                      )}
                    </div>
                    <span className={`text-[11px] font-sans transition-colors duration-300 ${
                      req.valid ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-muted)]"
                    }`}>
                      {req.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="flex flex-col justify-start"
        >
          <label className="text-[10px] uppercase tracking-[0.15em] font-mono text-[var(--text-muted)] mb-1 font-bold">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[var(--border)] focus:border-[var(--accent)] pl-8 pr-10 text-sm py-3 transition-colors outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1 flex items-center justify-center cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Real-time match visual validation indicator */}
          {password && confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[10px] uppercase tracking-wider font-mono font-bold mt-1.5 flex items-center gap-1 ${
                password === confirmPassword ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {password === confirmPassword ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
                  <span>Passwords match</span>
                </>
              ) : (
                <>
                  <X className="w-3 h-3 text-rose-400" strokeWidth={2.5} />
                  <span>Passwords do not match</span>
                </>
              )}
            </motion.p>
          )}
        </motion.div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.30 }}
          className="w-full rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white uppercase tracking-wider text-xs font-semibold py-3.5 px-8 shadow-[0_4px_20px_-4px_var(--accent-glow)] flex items-center justify-center gap-2 cursor-pointer transition-colors mt-4 select-none min-h-[48px]"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 font-bold" />
            </>
          )}
        </motion.button>
      </form>

      {/* Error dynamic panel */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-3 bg-rose-500/10 border border-rose-500/15 rounded-lg text-rose-500 text-[11px] uppercase tracking-widest font-mono text-center font-bold"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-6 text-center text-sm">
        <span className="text-[var(--text-muted)] font-normal font-sans">
          Already have an account?{" "}
        </span>
        <Link href="/sign-in" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium font-sans transition-colors pl-1">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
