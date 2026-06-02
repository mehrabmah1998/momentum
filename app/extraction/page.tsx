"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ExtractionRootFallback() {
  const router = useRouter();

  useEffect(() => {
    // Try to retrieve existing projects from global store, fallback to default 'api-service'
    const saved = localStorage.getItem("workspace_global_projects");
    let targetId = "api-service";
    
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (list && list.length > 0) {
          targetId = list[0].id || "api-service";
        }
      } catch (e) {
        console.error("Failed to parse projects:", e);
      }
    }
    
    router.replace(`/extraction/${targetId}`);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#090a0f] text-white">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
      <span className="text-sm font-mono tracking-widest uppercase opacity-75">Configuring Extraction Environment...</span>
    </div>
  );
}
