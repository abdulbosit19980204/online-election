"use client";
import { Link } from "@/navigation";
import { ShieldCheck, Zap, BarChart3, Globe, Lock, Users, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const t = useTranslations("Landing");
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: "Military-Grade Security",
      desc: "Every vote is encrypted with Fernet AES-128. Voter identity is permanently separated from the ballot via one-way SHA-256 hashing.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Zap,
      title: "Real-Time Results",
      desc: "WebSocket-powered live vote counts update instantly across all connected clients as ballots are cast.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: Lock,
      title: "Fraud Prevention",
      desc: "Duplicate vote prevention enforced at DB level. Rate limiting, JWT auth, and audit logs cover every action.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Admin-only live analytics with participation rates, candidate breakdowns, and time-series charts.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Globe,
      title: "Fully Accessible",
      desc: "WCAG 2.1 AA compliant, mobile-first responsive design with keyboard navigation and screen reader support.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Users,
      title: "Anonymous Voting",
      desc: "Votes are cryptographically anonymous. Not even administrators can link a vote back to a voter's identity.",
      color: "from-cyan-500 to-sky-600",
    },
  ];

  const stats = [
    { value: "256-bit", label: "Encryption" },
    { value: "< 100ms", label: "Response Time" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "Zero", label: "Data Breaches" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-50 dark:opacity-100" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Production-Ready · Open Source · Secure by Design
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-slide-up">
              {t("title").split(" ")[0]}{" "}
              <span className="text-gradient">
                {t("title").split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
              {t("subtitle")}
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap animate-slide-up" style={{ animationDelay: "200ms" }}>
              {hydrated && isAuthenticated ? (
                <Link href="/dashboard" className="btn-primary px-8 py-3 text-sm">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/register" className="btn-primary px-8 py-3 text-sm">
                  {t("cta")}
                  <ArrowRight size={16} />
                </Link>
              )}
              <Link href="/elections" className="btn-secondary px-8 py-3 text-sm">
                {t("view_elections")}
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 flex-wrap animate-fade-in" style={{ animationDelay: "400ms" }}>
              {["JWT Secured", "GDPR Ready", "Open Audit Logs", "Zero Knowledge"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <CheckCircle size={12} className="text-success" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="flex-1 hidden lg:block animate-fade-in relative" style={{ animationDelay: "300ms" }}>
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 -z-10" />
            <img 
              src="/hero_illustration.png" 
              alt="Voting Security Illustration" 
              className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/50 relative z-20">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-gradient-blue">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built for the Real World
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every feature is designed for production environments where security, performance, and trust aren't negotiable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {features.map((f) => (
              <div key={f.title} className="card p-6 group hover:border-border-active transition-all duration-300 animate-slide-up">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <f.icon size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to modernize your elections?</h2>
              <p className="text-muted-foreground mb-8">
                Get started in minutes. Create an election, add candidates, and share the link.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {hydrated && isAuthenticated ? (
                  <Link href="/dashboard" className="btn-primary px-8 py-3">
                    Go to Dashboard
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link href="/register" className="btn-primary px-8 py-3">
                      Create Account
                      <ArrowRight size={16} />
                    </Link>
                    <Link href="/login" className="btn-secondary px-8 py-3 bg-background/50 backdrop-blur-md">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <p>© 2026 VoteSecure. Built with Django + Next.js.</p>
          <p>Secure · Transparent · Democratic</p>
        </div>
      </footer>
    </div>
  );
}
