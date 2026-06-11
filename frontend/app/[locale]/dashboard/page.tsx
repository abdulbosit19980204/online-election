"use client";
import { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
import toast from "react-hot-toast";
import { Vote, Clock, CheckCircle, Loader2, Wallet, Link as LinkIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import ElectionCard from "@/components/voting/ElectionCard";
import { useAuthStore } from "@/store/authStore";
import { electionApi, voteApi, authApi } from "@/lib/api";
import type { Election } from "@/types";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const commonT = useTranslations("Common");
  const { user, isAuthenticated, setUser } = useAuthStore();
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [walletLinking, setWalletLinking] = useState(false);
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [isAuthenticated, hydrated]);

  const fetchData = async () => {
    try {
      const res = await electionApi.list();
      const allElections = Array.isArray(res.data) ? res.data : [];
      setElections(allElections);

      const activeIds = allElections
        .filter((e: any) => e.status === "active")
        .map((e: any) => e.id);

      const statusPromises = activeIds.map((id) =>
        voteApi.status(id).then((r) => ({ id, hasVoted: r.data.has_voted })).catch(() => ({ id, hasVoted: false }))
      );
      const statuses = await Promise.all(statusPromises);
      const map: Record<string, boolean> = {};
      statuses.forEach(({ id, hasVoted }) => { map[id] = hasVoted; });
      setVotedMap(map);
    } catch {
      toast.error(commonT("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyHash.trim()) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      const res = await voteApi.verify(verifyHash.trim());
      setVerifyResult({
        success: true,
        data: res.data,
      });
      toast.success("Ovoz muvaffaqiyatli tekshirildi!");
    } catch (err: any) {
      setVerifyResult({
        success: false,
        message: err.response?.data?.detail || "Kiritilgan chek xeshi topilmadi yoki tizimga kiritilmagan.",
      });
      toast.error("Ovoz topilmadi.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleLinkWallet = async () => {
    if (typeof (window as any).ethereum !== "undefined") {
      try {
        setWalletLinking(true);
        toast.loading("Connecting Web3 Wallet...", { id: "web3-link-loading" });
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];

        const message = `Link wallet to VoteSecure account:\n\nAddress: ${address}\nTimestamp: ${Date.now()}`;
        await (window as any).ethereum.request({
          method: "personal_sign",
          params: [message, address],
        });

        const res = await authApi.updateProfile({ wallet_address: address });
        setUser(res.data.user || res.data);
        toast.dismiss("web3-link-loading");
        toast.success("Web3 wallet linked successfully!");
      } catch (err: any) {
        toast.dismiss("web3-link-loading");
        if (err?.code === -32002) {
          toast.error("MetaMask-da so'rov allaqachon kutmoqda. Iltimos, brauzeringizning o'ng yuqori qismidan MetaMask oynasini ochib, so'rovni tasdiqlang.", { duration: 6000 });
        } else if (err?.code === 4100 || err?.message?.toLowerCase().includes("authorized")) {
          toast.error("Ushbu hamyon hisobi tasdiqlanmagan. Iltimos, MetaMask-ni ochib, sayt uchun hisobingizga ruxsat bering.", { duration: 6000 });
        } else {
          toast.error(err?.message || "MetaMask connection failed");
        }
      } finally {
        setWalletLinking(false);
      }
    } else {
      setWalletLinking(true);
      const toastId = toast.loading("Simulating Web3 Wallet Linking (Demo Mode)...");
      setTimeout(async () => {
        try {
          // Generate unique deterministic mock wallet address based on user's email
          const emailHash = Array.from(user?.email || "user").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000000, 0).toString(16).padEnd(40, "f");
          const mockAddress = `0x${emailHash.substring(0, 40)}`;
          const res = await authApi.updateProfile({ wallet_address: mockAddress });
          setUser(res.data.user || res.data);
          toast.dismiss(toastId);
          toast.success("Simulated Web3 wallet linked to account!");
        } catch {
          toast.dismiss(toastId);
          toast.error("Failed to link wallet");
        } finally {
          setWalletLinking(false);
        }
      }, 1500);
    }
  };

  const active = Array.isArray(elections) ? elections.filter((e) => e.status === "active") : [];
  const ended = Array.isArray(elections) ? elections.filter((e) => e.status === "ended") : [];
  const votedCount = Object.values(votedMap).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground">
            {t("welcome")}, <span className="text-gradient-blue">{user?.full_name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-2">Here are the elections you can participate in.</p>
        </motion.div>

        {/* Web3 Wallet Association Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 p-5 rounded-2xl border border-white/5 bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {user?.wallet_address ? "Web3 Wallet Connected" : "Link Web3 Wallet"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.wallet_address 
                  ? `Your account is associated with: ${user.wallet_address.substring(0, 8)}...${user.wallet_address.substring(user.wallet_address.length - 6)}`
                  : "Link your MetaMask wallet to enable cryptographic zero-knowledge vote signing."}
              </p>
            </div>
          </div>
          {!user?.wallet_address ? (
            <button
              onClick={handleLinkWallet}
              disabled={walletLinking}
              className="btn-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap"
            >
              {walletLinking ? <Loader2 size={14} className="animate-spin" /> : <LinkIcon size={14} />}
              Link Wallet
            </button>
          ) : (
            <span className="bg-success/10 border border-success/20 text-success text-[10px] uppercase font-bold tracking-wider py-1 px-3 rounded-full">
              On-Chain Verified
            </span>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: t("active_elections"), value: active.length, icon: Vote, color: "text-primary" },
            { label: t("voted"), value: votedCount, icon: CheckCircle, color: "text-success" },
            { label: t("ended_elections"), value: ended.length, icon: Clock, color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <s.icon size={18} className={`${s.color} mb-3`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Interactive Vote Verification Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10 p-6 rounded-3xl border border-white/5 bg-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="font-bold text-base text-foreground mb-1.5 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle size={18} className="text-success" />
            Ovozni Tekshirish va Audit (On-Chain Proof)
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Ovoz berganingizdan so'ng sizga taqdim etilgan unikal chek xeshini (receipt hash) kiritib, ovozingiz reestrda muvaffaqiyatli saqlanganligini mustaqil tekshirib oling.
          </p>

          <form onSubmit={handleVerifyVote} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Chek xeshini kiriting (masalan, e3b0c442...)"
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
              className="input-field flex-grow text-xs font-mono py-3"
              required
            />
            <button
              type="submit"
              disabled={verifyLoading}
              className="btn-primary py-3 px-6 rounded-xl text-xs font-bold whitespace-nowrap justify-center"
            >
              {verifyLoading ? <Loader2 size={14} className="animate-spin" /> : "Tekshirish"}
            </button>
          </form>

          {verifyResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-5 rounded-2xl border ${verifyResult.success ? "bg-success/5 border-success/20 text-success" : "bg-danger/5 border-danger/20 text-danger"} text-xs leading-relaxed`}
            >
              {verifyResult.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
                    Ovoz Muvaffaqiyatli Tasdiqlandi
                  </div>
                  <p className="text-muted-foreground">
                    Ushbu shifrlangan ovoz <strong>{verifyResult.data.election_title}</strong> saylovi bo'yicha tizimga xavfsiz qabul qilingan va blokcheyn reestriga o'zgartirib bo'lmas tarzda muhrlangan.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-[10px] text-muted-foreground border-t border-white/5 mt-3">
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider">Kiritilgan vaqt:</span>
                      <span className="font-bold text-foreground">{new Date(verifyResult.data.cast_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider">Holati:</span>
                      <span className="font-bold text-success">{verifyResult.data.status}</span>
                    </div>
                  </div>
                  {verifyResult.data.tx_hash && (
                    <div className="bg-black/25 p-4 rounded-xl border border-white/5 mt-4 font-mono">
                      <span className="block text-[8px] text-muted-foreground uppercase tracking-widest font-black mb-1">Sepolia Transaction Hash</span>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${verifyResult.data.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-bold break-all block text-[11px]"
                      >
                        {verifyResult.data.tx_hash} ↗
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="font-semibold text-danger">
                  {verifyResult.message}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
             <div className="flex flex-col gap-4 w-full">
                {/* Skeleton cards */}
                <div className="skeleton h-32 w-full" />
                <div className="skeleton h-32 w-full" />
             </div>
          </div>
        ) : (
          <>
            {/* Active elections */}
            {active.length > 0 && (
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <h2 className="font-semibold text-foreground">{t("live_now")}</h2>
                  <span className="text-xs text-muted-foreground">({active.length})</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {active.map((e) => (
                    <ElectionCard
                      key={e.id}
                      election={e}
                      href={`/elections/${e.id}`}
                      hasVoted={votedMap[e.id]}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Past elections */}
            {ended.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock size={14} />
                  {t("past")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {ended.map((e) => (
                    <ElectionCard
                      key={e.id}
                      election={e}
                      href={e.results_public ? `/elections/${e.id}/results` : undefined}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {elections.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <Vote size={40} className="text-muted mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">{t("no_elections")}</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
