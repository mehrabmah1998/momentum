import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import ThreeDocuments from "@/components/landing/ThreeDocuments";
import KnowledgeViews from "@/components/landing/KnowledgeViews";
import WhoItsFor from "@/components/landing/WhoItsFor";
import TechTransparency from "@/components/landing/TechTransparency";
import Waitlist from "@/components/landing/Waitlist";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full max-w-full min-h-screen bg-[#020617] text-slate-100 flex flex-col relative selection:bg-brand-blue/30 selection:text-white">
      {/* Decorative ambient glowing lines at macro scale */}
      <div className="absolute top-[5%] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent pointer-events-none" />
      <div className="absolute top-[40%] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/10 to-transparent pointer-events-none" />
      
      {/* Structural layout components */}
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <ThreeDocuments />
      <KnowledgeViews />
      <WhoItsFor />
      <TechTransparency />
      <Waitlist />
      <Footer />
    </main>
  );
}
