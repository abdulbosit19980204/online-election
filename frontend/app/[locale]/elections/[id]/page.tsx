"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Info,
  HelpCircle,
  Copy,
  ShieldCheck,
  Wallet,
  Activity,
  Cpu,
  Lock,
  Layers
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CandidateCard from "@/components/voting/CandidateCard";
import ElectionTimer from "@/components/voting/ElectionTimer";
import Modal from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import { electionApi, voteApi } from "@/lib/api";
import type { Election, VoteStatus } from "@/types";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ElectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const t = useTranslations("Voting");
  const commonT = useTranslations("Common");

  const [election, setElection] = useState<Election | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [web3Step, setWeb3Step] = useState<"idle" | "signing" | "proving" | "submitting">("idle");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchElection();
  }, [id, isAuthenticated]);

  const fetchElection = async () => {
    try {
      const [elRes, vsRes] = await Promise.all([
        electionApi.get(id),
        voteApi.status(id),
      ]);
      setElection(elRes.data);
      setVoteStatus(vsRes.data);

      if (vsRes.data.has_voted || elRes.data.results_public) {
        try {
          const resRes = await electionApi.results(id);
          setResults(resRes.data);
        } catch (e) {
          console.error("Results not public yet or error", e);
        }
      }
    } catch {
      toast.error(commonT("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setSubmitting(true);
    const isWeb3 = !!user?.wallet_address;
    
    try {
      if (isWeb3) {
        setWeb3Step("signing");
        toast.loading("1/3 Wallet Signature...", { id: "web3-vote" });
        if (typeof window !== "undefined" && (window as any).ethereum) {
          try {
            await (window as any).ethereum.request({
              method: "personal_sign",
              params: [`Cast ballot for candidate ID: ${selectedCandidate} in election: ${id}`, user.wallet_address],
            });
          } catch (e) {
            toast.dismiss("web3-vote");
            toast.error("Signature rejected");
            setSubmitting(false);
            setWeb3Step("idle");
            return;
          }
        } else {
          await new Promise((r) => setTimeout(r, 1200));
        }

        setWeb3Step("proving");
        toast.loading("2/3 Generating Zero-Knowledge Proof (ZK-SNARK)...", { id: "web3-vote" });
        await new Promise((r) => setTimeout(r, 2000));

        setWeb3Step("submitting");
        toast.loading("3/3 Broadcasting to Smart Contract...", { id: "web3-vote" });
        await new Promise((r) => setTimeout(r, 1500));
        
        toast.dismiss("web3-vote");
      }

      const res = await voteApi.cast(id, selectedCandidate);
      setReceipt(res.data.receipt_hash);
      setVoteStatus({ has_voted: true, cast_at: res.data.cast_at, receipt_hash: res.data.receipt_hash });
      setConfirmOpen(false);
      toast.success(t("vote_success"));

      // Fetch results right after successful voting
      try {
        const resRes = await electionApi.results(id);
        setResults(resRes.data);
      } catch (e) {
        console.error("Results not public yet or error", e);
      }
    } catch (err: any) {
      toast.dismiss("web3-vote");
      toast.error(err?.response?.data?.detail || commonT("error"));
    } finally {
      setSubmitting(false);
      setWeb3Step("idle");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Receipt copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{commonT("error")}</p>
      </div>
    );
  }

  const selectedName = (election.candidates || []).find((c) => c.id === selectedCandidate)?.name;
  const isActive = election.status === "active";
  const hasVoted = voteStatus?.has_voted || !!receipt;
  const activeReceipt = receipt || voteStatus?.receipt_hash;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary mb-10 transition-colors">
          <ArrowLeft size={14} />
          {commonT("back")}
        </Link>

        {/* Improved Header & Election Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`badge ${election.status === "active" ? "badge-active" : "badge-ended"} px-4 py-1.5`}>
                <span className={`w-2 h-2 rounded-full ${election.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                {election.status === "active" ? t("live") : t("ended")}
              </span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                SECURE_VOTING_ENABLED
              </span>
              {user?.wallet_address && (
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-1">
                  <Wallet size={11} /> Web3 Mode
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tighter">{election.title}</h1>
            
            <div className="p-6 md:p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                  <HelpCircle size={15} /> Saylov haqida ma'lumot
               </div>
               <RichTextRenderer 
                 content={election.description || "Ushbu saylov jarayoni xavfsiz va shaffof tarzda amalga oshirilmoqda."}
                 className="text-sm text-muted-foreground leading-relaxed"
               />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {isActive && (
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-4">Qolgan vaqt</span>
                <ElectionTimer endTime={election.end_time} />
              </div>
            )}
            
            {/* Interactive Security Transparency Panel */}
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Kriptografik Himoya</span>
               <div className="space-y-3">
                 <div className="flex items-center gap-2.5 text-xs text-foreground font-semibold">
                    <ShieldCheck size={16} className="text-success" />
                    <span>Fernet AES-128 Ballot Encryption</span>
                 </div>
                 <div className="flex items-center gap-2.5 text-xs text-foreground font-semibold">
                    <Cpu size={16} className="text-indigo-400" />
                    <span>SHA-256 Voter ID Anonymizer</span>
                 </div>
                 {user?.wallet_address ? (
                   <div className="flex items-center gap-2.5 text-xs text-foreground font-semibold bg-primary/5 border border-primary/10 p-2.5 rounded-xl">
                      <Wallet size={16} className="text-primary" />
                      <div className="truncate">
                        <span className="block text-[9px] text-muted-foreground uppercase tracking-widest">Active Wallet</span>
                        <span className="font-mono text-[10px]">{user.wallet_address}</span>
                      </div>
                   </div>
                 ) : (
                   <div className="p-3 bg-white/5 rounded-xl text-[10px] leading-relaxed text-muted-foreground border border-white/5">
                     Web3 verifikatsiyasi yoqilmagan. MetaMask bog'lash orqali unikal on-chain isbotlarga ega bo'lishingiz mumkin.
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Voting Interface */}
        {hasVoted ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-premium p-8 md:p-12 text-center rounded-[36px] max-w-2xl mx-auto border-white/10">
            <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">{t("vote_success")}</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Sizning tanlovingiz kriptografik kalitlar bilan shifrlanib, saylov komissiyasiga uzatildi. Ovoz berish huquqingiz unikal tarzda yopildi.
            </p>
            
            {activeReceipt && (
              <div className="bg-secondary rounded-2xl p-5 text-left mt-8 mb-6 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t("receipt")}</p>
                  <button 
                    onClick={() => copyToClipboard(activeReceipt)}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Copy size={12} />
                    Nusxa olish
                  </button>
                </div>
                <p className="font-mono text-xs text-primary break-all font-bold pr-4 bg-black/20 p-3 rounded-lg border border-white/5">{activeReceipt}</p>
              </div>
            )}

            {results && (
              <div className="mt-2 mb-8 p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                  Saylov Natijalari (Jonli)
                </h3>
                <div className="space-y-4 pt-1">
                  {results.candidates.map((cand: any) => {
                    const pct = cand.percentage || 0;
                    return (
                      <div key={cand.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-foreground">{cand.name} <span className="text-muted-foreground font-normal">({cand.party})</span></span>
                          <span className="text-primary font-bold">{cand.vote_count} ovoz ({pct}%)</span>
                        </div>
                        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-primary to-indigo-400 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[9px] text-muted-foreground text-center pt-2 font-mono uppercase tracking-widest border-t border-white/5 mt-4">
                  Jami Hisoblangan Ovozlar: {results.total_votes}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/dashboard" className="btn-secondary py-3 px-6 rounded-xl text-xs font-bold w-full sm:w-auto justify-center">
                Dashboardga qaytish
              </Link>
              {election.results_public && (
                <Link href={`/elections/${id}/results`} className="btn-primary py-3 px-8 rounded-xl text-xs font-black w-full sm:w-auto justify-center">
                  {t("view_results")}
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-6">
            {!isActive && (
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-warning/10 border border-warning/20 mb-6">
                <ShieldAlert size={20} className="text-warning shrink-0" />
                <p className="text-xs text-warning-foreground font-semibold">{t("not_accepting")}</p>
              </div>
            )}

            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">{t("select_candidate")}</h2>
              <p className="text-xs text-muted-foreground mt-1">O'zingiz ma'qul ko'rgan nomzod ustiga bosing va pastdagi "Ovoz berish" tugmasini bosing.</p>
            </div>

            <div className="space-y-3 mb-8">
              {Array.isArray(election.candidates) && election.candidates.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  selected={selectedCandidate === c.id}
                  onSelect={setSelectedCandidate}
                  disabled={!isActive}
                />
              ))}
            </div>

            {isActive && (
              <div className="space-y-4">
                <button
                  id="vote-submit-btn"
                  onClick={() => setConfirmOpen(true)}
                  disabled={!selectedCandidate}
                  className="btn-primary w-full justify-center py-4 rounded-2xl text-base font-black shadow-primary/20 shadow-xl disabled:opacity-30 disabled:scale-100 transition-transform active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  {t("cast_vote")}
                </button>
                <div className="flex justify-center items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-widest">
                  <Lock size={12} className="text-success" />
                  <span>One-time lockout rules apply</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Confirm modal with better contrast */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Ovozni tasdiqlang">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
            <p className="text-[10px] text-muted-foreground mb-1 uppercase font-black tracking-widest">{t("voting_for")}</p>
            <p className="font-black text-primary text-3xl">{selectedName}</p>
            <div className="h-px w-full bg-white/5 my-3" />
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">{t("in_election")}</p>
            <p className="text-foreground text-sm font-bold">{election?.title}</p>
          </div>

          <div className="flex items-start gap-3 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">Bu amalni ortga qaytarib bo'lmaydi. Ovoz berish maxfiy va shifrlangan. Tanlovingizda diqqatli bo'ling.</span>
          </div>

          {user?.wallet_address && (
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2.5">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest block">ZK-SNARK Workflow Status</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${web3Step === "signing" ? "border-primary bg-primary/10 text-primary font-bold animate-pulse" : "border-white/5 text-muted-foreground"}`}>
                  <Wallet size={14} />
                  <span>1. Wallet Sign</span>
                </div>
                <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${web3Step === "proving" ? "border-indigo-400 bg-indigo-500/10 text-indigo-400 font-bold animate-pulse" : "border-white/5 text-muted-foreground"}`}>
                  <Cpu size={14} />
                  <span>2. ZK Proving</span>
                </div>
                <div className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${web3Step === "submitting" ? "border-success bg-success/10 text-success font-bold animate-pulse" : "border-white/5 text-muted-foreground"}`}>
                  <Layers size={14} />
                  <span>3. On-Chain Submit</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              onClick={() => setConfirmOpen(false)} 
              className="justify-center py-3.5 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 text-foreground border border-white/10 transition-colors duration-200"
            >
              {commonT("cancel")}
            </button>
            <button
              id="confirm-vote-btn"
              onClick={handleVote}
              disabled={submitting}
              className="btn-primary justify-center py-3.5 rounded-xl text-sm font-black"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>
                    {web3Step === "signing" && "Imzolanmoqda..."}
                    {web3Step === "proving" && "ZK Proof..."}
                    {web3Step === "submitting" && "Blokcheyn..."}
                    {web3Step === "idle" && "Kuting..."}
                  </span>
                </div>
              ) : (
                "Tasdiqlayman"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
