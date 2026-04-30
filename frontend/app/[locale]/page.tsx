"use client";
import { Link } from "@/navigation";
import { ShieldCheck, Zap, BarChart3, Globe, Lock, Users, ArrowRight, ShieldAlert, Cpu, Network, Fingerprint, Clock, Users2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { electionApi } from "@/lib/api";
import type { Election } from "@/types";
import ElectionTimer from "@/components/voting/ElectionTimer";

export default function LandingPage() {
  const t = useTranslations("Landing");
  const tFeatures = useTranslations("Features");
  const tStats = useTranslations("Stats");
  const tVoting = useTranslations("Voting");
  const tDashboard = useTranslations("Dashboard");
  
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [activeElections, setActiveElections] = useState<Election[]>([]);

  useEffect(() => {
    setHydrated(true);
    fetchActiveElections();
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Next-Gen Democracy
            </motion.div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6">
              {t("title")}
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-6 flex-wrap pt-4"
            >
              {hydrated && isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary px-10 py-4 text-base rounded-2xl shadow-primary/30 shadow-2xl">
                  {t("view_elections")}
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary px-10 py-4 text-base rounded-2xl shadow-primary/30 shadow-2xl">
                    {t("cta")}
                    <ArrowRight size={20} />
                  </Link>
                  <Link href="/elections" className="btn-secondary px-10 py-4 text-base rounded-2xl border-white/10 bg-white/5 backdrop-blur-lg">
                    {t("view_elections")}
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 w-full max-w-[600px]"
          >
            <div className="relative group">
               <div className="relative z-10 glass-premium p-4 rounded-[40px] shadow-3xl overflow-hidden border-white/20">
                  <img 
                    src="/voting_hologram_3d_1777582708776.png" 
                    alt="Voting Hologram" 
                    className="w-full h-auto rounded-[32px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <s.icon size={28} />
                </div>
                <div className="text-4xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{s.value}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Elections Section (NEW) */}
      {activeElections.length > 0 && (
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[160px] -z-10" />
          
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-success/10 border border-success/20 text-success text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  {tDashboard("live_now")}
                </div>
                <h2 className="text-4xl font-black text-foreground">{tDashboard("active_elections")}</h2>
              </div>
              <Link href="/elections" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                {t("view_elections")} <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeElections.map((election, i) => (
                <motion.div
                  key={election.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-premium p-8 rounded-[32px] group hover:border-primary/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <VoteIcon size={24} />
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/20 px-2 py-1 rounded">
                        ID: {election.id.slice(0, 8)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{election.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">{election.description}</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                          <Users2 size={14} /> {tDashboard("voted")}
                        </span>
                        <span className="text-foreground font-bold">{election.voters_count || 0}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "65%" }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-6">
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time Remaining</span>
                       <ElectionTimer endTime={election.end_time} />
                    </div>
                    <Link href={`/elections/${election.id}`} className="btn-primary w-full justify-center rounded-2xl">
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
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl sm:text-5xl font-black text-foreground">{tFeatures("security_title").split(" ")[0]} <span className="text-primary">Ecosystem</span></h2>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Combining advanced cryptography with high-performance real-time infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 group"
              >
                <div className={`w-16 h-16 rounded-[22px] bg-gradient-to-br ${f.color} flex items-center justify-center mb-8 relative`}>
                   <f.icon size={32} className="text-foreground relative z-10" />
                   <div className={`absolute inset-0 rounded-[22px] ${f.accent} blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {f.desc}
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-24 px-6 overflow-hidden">
         <motion.div 
           whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
           className="max-w-6xl mx-auto glass-premium rounded-[50px] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="flex-1 space-y-6 text-center lg:text-left">
               <div className="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center text-success mb-6">
                  <ShieldCheck size={28} />
               </div>
               <h2 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">Your Identity is <br/><span className="text-success">Perfectly Anonymous</span></h2>
               <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  Votes are cryptographically detached from your personal data. 
                  Not even the government or system administrators can trace a vote back to you.
               </p>
            </div>
            <div className="flex-1 w-full flex justify-center">
               <img src="/security_shield_3d_1777582729225.png" alt="Security Shield" className="w-full max-w-[350px] animate-float" />
            </div>
         </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-border">
         <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8">Ready to shape the future?</h2>
            <Link href="/register" className="btn-primary px-12 py-4 rounded-2xl text-lg font-bold">
               Get Started Now
            </Link>
            <p className="text-muted-foreground mt-8 text-sm">© 2026 VoteSecure. All Rights Reserved.</p>
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
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 12 2 2 4-4"/><rect width="18" height="18" x="3" y="3" rx="2"/>
    </svg>
  );
}
