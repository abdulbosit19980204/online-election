"use client";
import { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Mail, Lock, Wallet } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const [form, setForm] = useState({ email: "", password: "" });
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

  const handleWeb3Login = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        setLoading(true);
        toast.loading("Connecting Web3 Wallet...", { id: "web3-loading" });
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];
        
        const timestamp = Date.now();
        const message = `Welcome to VoteSecure!\n\nSign this message to prove ownership of your wallet.\n\nAddress: ${address}\nTimestamp: ${timestamp}`;
        const signature = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [message, address],
        });

        // Call the backend to verify the signature cryptographically
        const res = await authApi.web3Login({
          wallet_address: address,
          signature: signature,
          message: message
        });

        const { user, access_token, refresh_token } = res.data;
        setAuth(user, access_token, refresh_token);
        
        toast.dismiss("web3-loading");
        toast.success(`Web3 wallet verified successfully!`);
        router.push("/dashboard");
      } catch (err: any) {
        toast.dismiss("web3-loading");
        toast.error(err?.response?.data?.detail || err?.message || "MetaMask verification failed");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      const toastId = toast.loading("Simulating Web3 Wallet Verification (Demo Mode)...");
      setTimeout(async () => {
        try {
          const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
          const message = `Welcome to VoteSecure!\n\nSign this message to prove ownership of your wallet.\n\nAddress: ${mockAddress}`;
          const mockSignature = "0x82a613589bdf3d68bcf8df611f7c6e611f67f654b9f291e0a811c750e82f5b5f25a3a7892b15e478be32717904031d6837882b5f7e7f6e6f666f7f6f6f6f6f6f1c";
          
          // Call the backend to register/login the mock address securely
          const res = await authApi.web3Login({
            wallet_address: mockAddress,
            signature: mockSignature,
            message: message
          });
          
          const { user, access_token, refresh_token } = res.data;
          setAuth(user, access_token, refresh_token);
          
          toast.dismiss(toastId);
          toast.success(`Simulated Web3 Wallet verified!`);
          router.push("/dashboard");
        } catch {
          toast.dismiss(toastId);
          toast.error("Failed to authenticate Web3 wallet.");
        } finally {
          setLoading(false);
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* Left side form */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
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
            <h1 className="text-2xl font-bold text-foreground">{t("login_title")}</h1>
          </div>

          <div className="card p-8 shadow-2xl border-primary/10">
            {/* Demo credentials hint */}
            <div className="mb-5 p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground">
              <p className="font-medium text-primary mb-1">Demo Credentials</p>
              <p>Email: <span className="font-mono text-foreground">admin@election.local</span> / Password: <span className="font-mono text-foreground">Admin@123456</span></p>
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

            <div className="flex items-center my-6">
              <div className="h-px bg-border flex-grow" />
              <span className="text-[10px] text-muted-foreground px-3 font-semibold uppercase tracking-wider">yoki</span>
              <div className="h-px bg-border flex-grow" />
            </div>

            <button
              onClick={handleWeb3Login}
              type="button"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 text-foreground transition-all duration-300 font-bold text-xs"
            >
              <Wallet size={16} className="text-primary" />
              Web3 Hamyon orqali kirish (MetaMask / TON)
            </button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("no_account")}{" "}
              <Link href="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
                {t("register_here")}
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
        <div className="absolute bottom-10 right-10 text-right z-20 hidden xl:block animate-fade-in" style={{ animationDelay: "500ms" }}>
          <p className="text-sm font-bold text-foreground">Military-Grade Security</p>
          <p className="text-xs text-muted-foreground">Encrypted end-to-end sessions.</p>
        </div>
      </div>

    </div>
  );
}
