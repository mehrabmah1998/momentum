"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { LogOut, ArrowLeft, Cpu, Activity, Database, Key } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await signOut();
    // Redirect is handled inside signOut, but routing push acts as extra layer
    router.push("/");
  };

  // While checking session
  if (isPending || !session) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--accent-glow)] opacity-10 rounded-xl blur-[2px]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full"
            />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] animate-pulse">
            Verifying Core Session Auth...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[var(--bg)] relative overflow-hidden px-4 py-12">
      {/* Decorative ambient beams */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-[var(--accent-glow)] glow-spot opacity-30 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-[var(--accent-glow)] glow-spot opacity-20 pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto relative z-10">
        
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="group flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors select-none py-2 px-4 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/50 backdrop-blur-md">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Go Back Home</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-rose-500 hover:text-rose-400 transition-colors select-none py-2 px-4 rounded-full border border-rose-500/10 hover:border-rose-500/20 bg-rose-500/5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Term Session</span>
          </button>
        </div>

        {/* Dashboard Card with Doppelrand Layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2.5rem] bg-[var(--border)] p-2 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--bg-card)] border border-[var(--border)] p-8 sm:p-12 backdrop-blur-2xl relative overflow-hidden flex flex-col gap-8">
            
            {/* Top glass reflection highlight */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />

            {/* Title Block */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border)]">
              <div>
                <span className="font-mono text-[10px] text-[var(--accent)] font-bold uppercase tracking-[0.25em] block mb-1">
                  SECURE PROTOCOL ESTABLISHED
                </span>
                <h1 className="text-3xl font-bold font-sans text-[var(--text-primary)] tracking-tight">
                  Welcome to Momentum
                </h1>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] font-mono text-[9px] text-emerald-400 font-bold uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>Session Live</span>
              </div>
            </div>

            {/* Profile Grid Detail */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Account Credentials block */}
              <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-3 font-bold">
                    Connected Operator Profile
                  </span>
                  <p className="text-xl font-bold font-sans text-[var(--text-primary)] leading-tight">
                    {session.user.name}
                  </p>
                  <p className="text-xs font-mono text-[var(--text-secondary)] mt-1.5 break-all">
                    {session.user.email}
                  </p>
                </div>
              </div>

              {/* API and Integration Credentials Box */}
              <div className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border)] flex flex-col justify-between min-h-[140px]">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] block mb-3 font-bold">
                    Momentum Pipeline Keys
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/5 px-3 py-2 rounded border border-emerald-500/10">
                    <Key className="w-3.5 h-3.5" />
                    <span>MOMENTUM_KEY=•••••••_live</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-2 font-sans font-normal leading-relaxed">
                    Graph-Guided prompt context pipeline endpoints configured successfully.
                  </p>
                </div>
              </div>

            </div>

            {/* Simulated Live Environment Metrics for immersive aesthetics */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-black/30 font-mono text-[11px] leading-relaxed text-[var(--text-muted)] space-y-2">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--text-muted)] block mb-1">
                Active Telemetry & Services
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[var(--accent)]" />
                  <span>Prompt Grounding: <b className="text-[var(--text-secondary)]">OK</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-[var(--accent)]" />
                  <span>Parser Hook: <b className="text-[var(--text-secondary)]">Syncing</b></span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <Database className="w-3 h-3 text-[var(--accent)]" />
                  <span>Metadata Node Schema: <b className="text-[var(--text-secondary)]">v2.1</b></span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
