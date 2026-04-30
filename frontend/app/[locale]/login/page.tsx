"use client";
import { useState } from "react";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { access_token, refresh_token, user } = res.data;
      setAuth(user, access_token, refresh_token);
      toast.success(`Welcome back, ${user.full_name}!`);
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 transition-colors duration-300">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-50 dark:opacity-100" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">
              Vote<span className="text-primary">Secure</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{t("login_title")}</h1>
        </div>

        <div className="card p-8 shadow-2xl">
          {/* Demo credentials hint */}
          <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground">
            <p className="font-medium text-primary mb-1">Demo Admin</p>
            <p>Email: <span className="font-mono text-foreground">admin@election.local</span></p>
            <p>Password: <span className="font-mono text-foreground">Admin@123456</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">{t("email")}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-email"
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
              <label className="block text-xs font-medium text-muted-foreground mb-2">{t("password")}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-password"
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
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-4"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>{t("login_btn")} <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("no_account")}{" "}
            <Link href="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
              {t("register_here")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
