"use client";
import { useState } from "react";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff, ArrowRight, User, Mail, Lock } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { access_token, refresh_token, user } = res.data;
      setAuth(user, access_token, refresh_token);
      toast.success(`Welcome, ${user.full_name}!`);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-50 dark:opacity-100" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
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
        </div>

        {/* Form card */}
        <div className="card p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">{t("full_name")}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">{t("email")}</label>
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

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">{t("password")}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min. 8 characters"
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
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="progress-bar h-1">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((form.password.length / 16) * 100, 100)}%`,
                        background: form.password.length < 8
                          ? "var(--danger)"
                          : form.password.length < 12
                          ? "var(--warning)"
                          : "var(--success)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-4"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {t("register_btn")}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
