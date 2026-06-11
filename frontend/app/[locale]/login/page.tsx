"use client";
import { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ShieldCheck, Eye, EyeOff, ArrowRight, Mail, Lock, Wallet, X, CheckCircle2, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"choose" | "connect" | "signing" | "success">("choose");
  const [demoAddress, setDemoAddress] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [simLoading, setSimLoading] = useState(false);
  const [simStepText, setSimStepText] = useState("");
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
    } catch {
      toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRealWeb3Login = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setLoading(true);
      try {
        toast.loading("Connecting Web3 Wallet...", { id: "web3-loading" });
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];
        const message = `Welcome to VoteSecure!\n\nSign this message to prove ownership of your wallet.\n\nAddress: ${address}`;
        const signature = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [message, address],
        });

        const res = await authApi.web3Login({
          wallet_address: address,
          signature: signature,
          message: message,
        });

        const { user, access_token, refresh_token } = res.data;
        setAuth(user, access_token, refresh_token);
        
        toast.dismiss("web3-loading");
        toast.success(`Web3 wallet verified successfully!`);
        setWalletModalOpen(false);
        router.push("/dashboard");
      } catch (err: any) {
        toast.dismiss("web3-loading");
        if (err?.code === -32002) {
          toast.error("MetaMask-da so'rov allaqachon kutmoqda. Iltimos, brauzeringizning o'ng yuqori qismidan MetaMask oynasini ochib, so'rovni tasdiqlang.", { duration: 6000 });
        } else {
          toast.error(err?.response?.data?.detail || err?.message || "MetaMask verification failed");
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("MetaMask browser extension not detected.");
    }
  };

  const handleSimulatedConnect = async () => {
    setSimLoading(true);
    setSimStepText("Connecting to Simulated MetaMask...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSimLoading(false);
    setModalStep("signing");
  };

  const handleSimulatedSign = async () => {
    setSimLoading(true);
    setSimStepText("Signing message using simulated ECDSA key...");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    try {
      let mockAddress = demoAddress;
      if (demoAddress === "random") {
        const randHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        mockAddress = `0x${randHex}`;
      }

      const message = `Welcome to VoteSecure!\n\nSign this message to prove ownership of your wallet.\n\nAddress: ${mockAddress}`;
      const mockSignature = "0x82a613589bdf3d68bcf8df611f7c6e611f67f654b9f291e0a811c750e82f5b5f25a3a7892b15e478be32717904031d6837882b5f7e7f6e6f666f7f6f6f6f6f6f1c";

      const res = await authApi.web3Login({
        wallet_address: mockAddress,
        signature: mockSignature,
        message: message,
      });

      const { user, access_token, refresh_token } = res.data;
      setAuth(user, access_token, refresh_token);
      setModalStep("success");
      toast.success("Simulated Web3 Wallet signed & verified!");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setWalletModalOpen(false);
      router.push("/dashboard");
    } catch {
      toast.error("Failed to verify simulated signature.");
    } finally {
      setSimLoading(false);
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
              onClick={() => {
                setWalletModalOpen(true);
                setModalStep("choose");
              }}
              type="button"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 text-foreground transition-all duration-300 font-bold text-xs"
            >
              <Wallet size={16} className="text-primary" />
              Web3 Hamyon orqali kirish (MetaMask / TON)
            </button>

            {walletModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-sm relative z-50 overflow-hidden shadow-2xl animate-fade-in">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Header */}
                  <div className="flex justify-between items-center mb-5 border-b border-border pb-3">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <Wallet size={16} className="text-primary" />
                      Web3 Hamyon Ulash
                    </h3>
                    <button 
                      onClick={() => setWalletModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Step 1: Choose real vs simulated */}
                  {modalStep === "choose" && (
                    <div className="space-y-4">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Tizimga kirish uchun Web3 hamyoningizni ulang. Sinov rejimida bo'lsangiz, MetaMask simulyatorini tanlashingiz mumkin.
                      </p>
                      
                      <button
                        onClick={handleRealWeb3Login}
                        className="w-full p-4 bg-secondary/40 border border-border hover:bg-secondary/70 hover:border-primary/30 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20 shrink-0">
                          <Wallet size={20} />
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-xs text-foreground">MetaMask (Real Rejim)</strong>
                          <span className="block text-[10px] text-muted-foreground truncate">Brauzerdagi real hamyon orqali kirish</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setModalStep("connect")}
                        className="w-full p-4 bg-secondary/40 border border-border hover:bg-secondary/70 hover:border-primary/30 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shrink-0">
                          <ShieldCheck size={20} />
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-xs text-foreground">MetaMask Simulator (Demo)</strong>
                          <span className="block text-[10px] text-muted-foreground truncate">Imzolash jarayonini sinab ko'rish</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Step 2: Simulated Connect */}
                  {modalStep === "connect" && (
                    <div className="space-y-4">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Demo Hamyon Manzilini Tanlang:</label>
                      <select
                        value={demoAddress}
                        onChange={(e) => setDemoAddress(e.target.value)}
                        className="input-field py-2.5 text-xs font-mono bg-card"
                        disabled={simLoading}
                      >
                        <option value="0x71C7656EC7ab88b098defB751B7401B5f6d8976F">Voter Account 1 (0x71C76...)</option>
                        <option value="0x2B5AD5c27D26444dE967D9C6400f91c9535d97EF">Voter Account 2 (0x2B5AD...)</option>
                        <option value="0x9c6E601Bf65427d11019052b61D99fD8EADaE125">Voter Account 3 (0x9c6E6...)</option>
                        <option value="random">Yangi tasodifiy hamyon yaratish (Random)</option>
                      </select>

                      <button
                        onClick={handleSimulatedConnect}
                        disabled={simLoading}
                        className="btn-primary w-full justify-center py-3 text-xs cursor-pointer"
                      >
                        {simLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            {simStepText}
                          </span>
                        ) : (
                          "Hamyonni Ulash (Connect)"
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 3: Simulated Sign */}
                  {modalStep === "signing" && (
                    <div className="space-y-4">
                      <div className="p-3 bg-secondary/40 rounded-xl border border-border text-[10px] font-mono leading-relaxed text-muted-foreground text-left">
                        <span className="text-primary font-bold block mb-1">Signature Request (MetaMask Sim)</span>
                        Message: Welcome to VoteSecure!<br/>
                        Sign this message to prove ownership.<br/>
                        Address: <span className="text-foreground break-all">{demoAddress}</span>
                      </div>

                      <button
                        onClick={handleSimulatedSign}
                        disabled={simLoading}
                        className="btn-primary w-full justify-center py-3 text-xs cursor-pointer"
                      >
                        {simLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            {simStepText}
                          </span>
                        ) : (
                          "Xabarni Imzolash (Sign Message)"
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 4: Success */}
                  {modalStep === "success" && (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center text-success border border-success/20 animate-bounce">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="font-bold text-sm text-foreground">Imzo Tasdiqlandi</h4>
                      <p className="text-xs text-muted-foreground">JWT seans tokenlari muvaffaqiyatli saqlandi.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
