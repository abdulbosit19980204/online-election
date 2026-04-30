"use client";
import { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle2, ShieldAlert } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const [form, setForm] = useState({ full_name: "", email: "", password: "", national_id: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getStrength(form.password);
  const strengthColors = ["bg-muted", "bg-danger", "bg-warning", "bg-success/80", "bg-success"];
  const strengthLabels = ["", t("weak"), t("fair"), t("good"), t("strong")];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strengthScore < 2) {
      toast.error("Password is too weak.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { access_token, refresh_token, user } = res.data;
      setAuth(user, access_token, refresh_token);
      toast.success(t("register_success"));
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.email?.[0] || err?.response?.data?.national_id?.[0] || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* Left side form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-50 dark:opacity-100" />
        
        <div className="w-full max-w-md relative z-10 animate-slide-up">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">
                Vote<span className="text-primary">Secure</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">{t("register_title")}</h1>
            <p className="text-sm text-muted-foreground mt-2">{t("register_subtitle")}</p>
          </div>

          <div className="card p-8 shadow-2xl border-primary/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("fullname")}</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("national_id")}</label>
                <div className="relative">
                  <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="reg-national-id"
                    type="text"
                    required
                    placeholder="AA1234567"
                    value={form.national_id}
                    onChange={(e) => setForm({ ...form, national_id: e.target.value })}
                    className="input-field pl-10 uppercase uppercase-placeholder"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Lock size={10} /> {t("id_encrypted")}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("email")}</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t("password")}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {form.password && (
                  <div className="mt-2.5 animate-fade-in">
                    <div className="flex gap-1 h-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-colors duration-300 ${
                            strengthScore >= level ? strengthColors[strengthScore] : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[10px] font-medium text-right ${strengthScore > 2 ? "text-success" : "text-muted-foreground"}`}>
                      {strengthLabels[strengthScore]}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg p-3">
                <ShieldAlert size={14} className="text-primary shrink-0 mt-0.5" />
                <p>
                  By creating an account, you agree to our strict <Link href="#" className="text-primary hover:underline">One-Vote Policy</Link> and <Link href="#" className="text-primary hover:underline">Privacy Terms</Link>.
                </p>
              </div>

              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 mt-4"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <><CheckCircle2 size={16} /> {t("create_account")}</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("have_account")}{" "}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                {t("sign_in_here")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-card border-l border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <img 
          src="/auth_illustration.png" 
          alt="Authentication Security" 
          className="w-full max-w-xl object-contain relative z-10 drop-shadow-2xl animate-float" 
        />
        
        {/* Aesthetic overlay details */}
        <div className="absolute top-10 left-10 text-left z-20 hidden xl:block animate-fade-in" style={{ animationDelay: "500ms" }}>
          <p className="text-sm font-bold text-foreground">Zero-Knowledge Proofs</p>
          <p className="text-xs text-muted-foreground">Your identity is completely detached from your vote.</p>
        </div>
      </div>

    </div>
  );
}
