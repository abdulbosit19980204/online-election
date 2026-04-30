"use client";
import { Link } from "@/navigation";
import { ShieldCheck, Zap, BarChart3, Globe, Lock, Users, ArrowRight, ShieldAlert, Cpu, Network, Fingerprint } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const t = useTranslations("Landing");
  const tFeatures = useTranslations("Features");
  const tStats = useTranslations("Stats");
  
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
      <section className="relative pt-32 pb-32 px-6 overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Next-Gen Democracy
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6"
            >{t("title").split(" ")[0]} <span className="text-gradient block sm:inline">{t("title").split(" ").slice(1).join(" ")}</span></h1>

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

          {/* Right: 3D Hologram Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="flex-1 w-full max-w-[600px] perspective-1000"
          >
            <div className="relative group">
               {/* Main 3D Hologram Image */}
               <div className="relative z-10 glass-premium p-4 rounded-[40px] shadow-3xl overflow-hidden border-white/20">
                  <img 
                    src="/voting_hologram_3d_1777582708776.png" 
                    alt="Voting Hologram" 
                    className="w-full h-auto rounded-[32px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Digital overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                     <div className="h-1.5 w-16 bg-primary/40 rounded-full blur-[1px]" />
                     <div className="h-1.5 w-1.5 bg-primary/80 rounded-full animate-pulse" />
                  </div>
               </div>
               
               {/* Floating elements */}
               <motion.div 
                 animate={{ y: [0, -15, 0] }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-10 -right-10 w-24 h-24 glass-premium rounded-3xl flex items-center justify-center text-primary z-20"
               >
                  <ShieldCheck size={40} />
               </motion.div>
               <motion.div 
                 animate={{ y: [0, 15, 0] }} 
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 className="absolute -bottom-10 -left-10 w-32 h-32 glass-premium rounded-3xl p-4 flex flex-col justify-between z-20"
               >
                  <div className="h-1 w-12 bg-primary/30 rounded-full" />
                  <div className="text-xs font-bold text-foreground">ENCRYPTED_ID</div>
                  <div className="h-8 w-full bg-primary/10 rounded flex items-center justify-center">
                     <div className="h-0.5 w-full bg-primary/40 mx-2" />
                  </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section (Redesigned) */}
      <section className="relative py-20 px-6 overflow-hidden">
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
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[25px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (3D Cards) */}
      <section className="py-32 px-6 relative">
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
                whileHover={{ rotateX: 5, rotateY: 5, z: 20 }}
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

                {/* Decorative border highlight */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Banner (Redesigned) */}
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
               <div className="flex items-center gap-4 pt-4 flex-wrap justify-center lg:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold">
                     <Lock size={14} className="text-primary" /> SHA-256 SALT
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold">
                     <ShieldCheck size={14} className="text-success" /> AES-128 GCM
                  </div>
               </div>
            </div>

            <div className="flex-1 w-full flex justify-center">
               <div className="relative">
                  <img 
                    src="/security_shield_3d_1777582729225.png" 
                    alt="Security Shield" 
                    className="w-full max-w-[350px] animate-float"
                  />
                  <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse" />
               </div>
            </div>
         </motion.div>
      </section>

      {/* Footer-like CTA */}
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
