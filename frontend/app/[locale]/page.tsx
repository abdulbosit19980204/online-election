"use client";
import { Link } from "@/navigation";
import { ShieldCheck, Zap, BarChart3, Globe, Lock, Users, ArrowRight, ShieldAlert, Cpu, Network, Fingerprint, Users2, Vote, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { electionApi } from "@/lib/api";
import type { Election } from "@/types";
import ElectionTimer from "@/components/voting/ElectionTimer";

// Import Hologram component dynamically
const Hologram = dynamic(() => import("@/components/landing/Hologram"), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] flex items-center justify-center bg-white/5 rounded-[40px] animate-pulse">
    <div className="text-primary font-bold">Initializing 3D Systems...</div>
  </div>
});

export default function LandingPage() {
  const t = useTranslations("Landing");
  const tFeatures = useTranslations("Features");
  const tStats = useTranslations("Stats");
  const tVoting = useTranslations("Voting");
  const tDashboard = useTranslations("Dashboard");
  
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [activeElections, setActiveElections] = useState<Election[]>([]);

  // Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 100, damping: 30 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-500, 500], [5, -5]);
  const rotateY = useTransform(smoothX, [-500, 500], [-5, 5]);
  
  const moveX = useTransform(smoothX, [-500, 500], [-10, 10]);
  const moveY = useTransform(smoothY, [-500, 500], [-10, 10]);

  useEffect(() => {
    setHydrated(true);
    fetchActiveElections();
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchActiveElections = async () => {
    try {
      const res = await electionApi.list("active");
      setActiveElections(res.data);
    } catch (err) {
      console.error("Failed to fetch active elections", err);
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      title: tFeatures("security_title"),
      desc: tFeatures("security_desc"),
      color: "from-blue-500/20 to-indigo-600/20",
      accent: "bg-blue-500",
    },
    {
      icon: Zap,
      title: tFeatures("realtime_title"),
      desc: tFeatures("realtime_desc"),
      color: "from-violet-500/20 to-purple-600/20",
      accent: "bg-violet-500",
    },
    {
      icon: Lock,
      title: tFeatures("fraud_title"),
      desc: tFeatures("fraud_desc"),
      color: "from-emerald-500/20 to-teal-600/20",
      accent: "bg-emerald-500",
    },
    {
      icon: BarChart3,
      title: tFeatures("analytics_title"),
      desc: tFeatures("analytics_desc"),
      color: "from-amber-500/20 to-orange-600/20",
      accent: "bg-amber-500",
    },
    {
      icon: Globe,
      title: tFeatures("accessible_title"),
      desc: tFeatures("accessible_desc"),
      color: "from-pink-500/20 to-rose-600/20",
      accent: "bg-pink-500",
    },
    {
      icon: Users,
      title: tFeatures("anon_title"),
      desc: tFeatures("anon_desc"),
      color: "from-cyan-500/20 to-sky-600/20",
      accent: "bg-cyan-500",
    },
  ];

  const stats = [
    { value: "256-bit", label: tStats("encryption"), icon: Fingerprint },
    { value: "< 100ms", label: tStats("response_time"), icon: Cpu },
    { value: "99.9%", label: tStats("uptime"), icon: Network },
    { value: "Zero", label: tStats("breaches"), icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden perspective-1000">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.2),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <motion.div 
            style={{ x: moveX, y: moveY, rotateX, rotateY }}
            className="flex-1 text-center lg:text-left space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Digital Democracy 2.0
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
                {t("title")}
              </h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-6 flex-wrap pt-6"
            >
              {hydrated && isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary px-12 py-5 text-lg rounded-[24px] shadow-primary/40 shadow-3xl">
                  {t("view_elections")}
                  <ArrowRight size={22} />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary px-12 py-5 text-lg rounded-[24px] shadow-primary/40 shadow-3xl">
                    {t("cta")}
                    <ArrowRight size={22} />
                  </Link>
                  <Link href="/elections" className="btn-secondary px-12 py-5 text-lg rounded-[24px] border-white/10 bg-white/5 backdrop-blur-2xl">
                    {t("view_elections")}
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div 
            style={{ rotateX, rotateY, x: moveX, y: moveY }}
            className="flex-1 w-full max-w-[700px] relative h-[650px] cursor-grab active:cursor-grabbing"
          >
             <Hologram />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6 bg-muted/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <s.icon size={32} />
                </div>
                <div className="text-5xl font-black text-foreground mb-2 tracking-tighter group-hover:text-primary transition-colors">{s.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IXCHAM: Active Elections Section */}
      {activeElections.length > 0 && (
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {tDashboard("live_now")}
                </div>
                <h2 className="text-5xl font-black text-foreground tracking-tight">{tDashboard("active_elections")}</h2>
              </div>
              <Link href="/elections" className="btn-secondary rounded-2xl px-6 py-3 text-sm">
                {t("view_elections")} <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeElections.map((election, i) => (
                <motion.div
                  key={election.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-premium p-8 rounded-[32px] group border-white/5 hover:border-primary/40 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Vote size={28} />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                        {election.status}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{election.title}</h3>
                      <div 
                        className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-4 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: election.description || "Ushbu saylov jarayoni xavfsiz va shaffof tarzda amalga oshirilmoqda." }}
                      />
                      
                      {/* Stats Inline */}
                      <div className="flex items-center gap-4 py-3 border-y border-white/5 mb-4">
                         <div className="flex items-center gap-2">
                            <Users2 size={16} className="text-primary" />
                            <span className="text-sm font-bold text-foreground">{election.voters_count || 0}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{tDashboard("voted")}</span>
                         </div>
                         <div className="h-4 w-px bg-white/10" />
                         <div className="flex items-center gap-2">
                            <Info size={16} className="text-accent" />
                            <span className="text-[10px] text-muted-foreground uppercase">Transparent</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Time Left</span>
                       <ElectionTimer endTime={election.end_time} />
                    </div>
                    <Link href={`/elections/${election.id}`} className="btn-primary w-full justify-center py-3.5 rounded-[18px] text-base font-bold shadow-primary/20 shadow-lg">
                       {tVoting("cast_vote")}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-32 px-6 relative bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
             <h2 className="text-5xl lg:text-6xl font-black text-foreground tracking-tighter">Production-Grade <span className="text-primary">Ecosystem</span></h2>
             <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">Military-grade protection meets high-speed real-time updates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-12 group border-white/5"
              >
                <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${f.color} flex items-center justify-center mb-8 relative`}>
                   <f.icon size={32} className="text-foreground relative z-10" />
                   <div className={`absolute inset-0 rounded-[22px] ${f.accent} blur-2xl opacity-10 group-hover:opacity-30 transition-opacity`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium text-base">
                  {f.desc}
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-700 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-32 px-6 overflow-hidden">
         <motion.div 
           whileInView={{ scale: [0.98, 1], opacity: [0, 1] }}
           className="max-w-7xl mx-auto glass-premium rounded-[60px] p-12 lg:p-24 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden border-white/20 shadow-4xl"
         >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] -z-10" />
            <div className="flex-1 space-y-8 text-center lg:text-left">
               <div className="w-14 h-14 bg-success/20 rounded-2xl flex items-center justify-center text-success mb-6">
                  <ShieldCheck size={32} />
               </div>
               <h2 className="text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tighter">Your Data is <br/><span className="text-success">Permanently Anonymous</span></h2>
               <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-xl">
                  Cryptographic hashing ensures that not even the database administrators can link a vote to a specific user.
               </p>
            </div>
            <div className="flex-1 w-full flex justify-center">
               <img src="/security_shield_3d_1777582729225.png" alt="Security Shield" className="w-full max-w-[450px] animate-float drop-shadow-[0_0_50px_rgba(16,185,129,0.2)]" />
            </div>
         </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-24 text-center border-t border-white/10 bg-muted/10">
         <div className="max-w-3xl mx-auto px-6 space-y-12">
            <div className="space-y-4">
               <h2 className="text-4xl font-black tracking-tighter">Secure the Future.</h2>
               <p className="text-muted-foreground text-lg">Join thousands of voters in a transparent and secure environment.</p>
            </div>
            <Link href="/register" className="btn-primary px-16 py-6 rounded-[28px] text-xl font-black shadow-primary/40 shadow-4xl hover:scale-105 transition-transform">
               Get Started Now
            </Link>
            <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase pt-12">© 2026 VoteSecure Platform</p>
         </div>
      </footer>
    </div>
  );
}

function VoteIcon({ size, className }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 12 2 2 4-4"/><rect width="18" height="18" x="3" y="3" rx="2"/>
    </svg>
  );
}
