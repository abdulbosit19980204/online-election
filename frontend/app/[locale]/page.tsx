"use client";
import { Link } from "@/navigation";
import { ShieldCheck, Zap, BarChart3, Globe, Lock, Users, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Zap,
      title: tFeatures("realtime_title"),
      desc: tFeatures("realtime_desc"),
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Lock,
      title: tFeatures("fraud_title"),
      desc: tFeatures("fraud_desc"),
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: BarChart3,
      title: tFeatures("analytics_title"),
      desc: tFeatures("analytics_desc"),
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Globe,
      title: tFeatures("accessible_title"),
      desc: tFeatures("accessible_desc"),
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Users,
      title: tFeatures("anon_title"),
      desc: tFeatures("anon_desc"),
      color: "from-cyan-500 to-sky-600",
    },
  ];

  const stats = [
    { value: "256-bit", label: tStats("encryption") },
    { value: "< 100ms", label: tStats("response_time") },
    { value: "99.9%", label: tStats("uptime") },
    { value: "Zero", label: tStats("breaches") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-50 dark:opacity-100" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Production-Ready · Open Source · Secure by Design
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              {t("title").split(" ")[0]}{" "}
              <span className="text-gradient">
                {t("title").split(" ").slice(1).join(" ")}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-4 flex-wrap"
            >
              {hydrated && isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary px-8 py-3 text-sm">
                  {t("view_elections")}
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-primary px-8 py-3 text-sm">
                    {t("cta")}
                    <ArrowRight size={16} />
                  </Link>
                  <Link href="/elections" className="btn-secondary px-8 py-3 text-sm">
                    {t("view_elections")}
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 w-full max-w-[500px]"
          >
            <div className="relative aspect-square card border-none bg-gradient-to-br from-card to-muted/20 p-8 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="w-12 h-1.5 rounded-full bg-primary/30" />
                     <div className="w-24 h-1.5 rounded-full bg-primary/20" />
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-32 h-32 rounded-full border-[8px] border-primary/20 border-t-primary animate-spin-slow mb-6" />
                     <div className="text-xl font-bold text-foreground">Secure Voting System</div>
                     <div className="text-xs text-muted-foreground mt-2 font-mono">ENCRYPTED_DATA_V1</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                     <div className="h-8 rounded-lg bg-card shadow-inner" />
                     <div className="h-8 rounded-lg bg-card shadow-inner" />
                     <div className="h-8 rounded-lg bg-card shadow-inner" />
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
