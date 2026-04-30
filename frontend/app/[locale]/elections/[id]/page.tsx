"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, Loader2, ShieldAlert, Info, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import CandidateCard from "@/components/voting/CandidateCard";
import ElectionTimer from "@/components/voting/ElectionTimer";
import Modal from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import { electionApi, voteApi } from "@/lib/api";
import type { Election, VoteStatus } from "@/types";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ElectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations("Voting");
  const commonT = useTranslations("Common");

  const [election, setElection] = useState<Election | null>(null);
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);

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
    } catch {
      toast.error(commonT("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setSubmitting(true);
    try {
      const res = await voteApi.cast(id, selectedCandidate);
      setReceipt(res.data.receipt_hash);
      setVoteStatus({ has_voted: true, cast_at: res.data.cast_at, receipt_hash: res.data.receipt_hash });
      setConfirmOpen(false);
      toast.success(t("vote_success"));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || commonT("error"));
    } finally {
      setSubmitting(false);
    }
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

  const selectedName = election.candidates.find((c) => c.id === selectedCandidate)?.name;
  const isActive = election.status === "active";
  const hasVoted = voteStatus?.has_voted || !!receipt;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
          <ArrowLeft size={14} />
          {commonT("back")}
        </Link>

        {/* Improved Header & Election Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <span className={`badge ${election.status === "active" ? "badge-active" : "badge-ended"} px-4 py-1.5`}>
                <span className={`w-2 h-2 rounded-full ${election.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                {election.status === "active" ? t("live") : t("ended")}
              </span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                SECURE_VOTING_ENABLED
              </span>
            </div>
            
            <h1 className="text-5xl font-black text-foreground leading-tight tracking-tighter">{election.title}</h1>
            
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
               <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                  <HelpCircle size={16} /> Saylov haqida ma'lumot
               </div>
               <p className="text-muted-foreground text-lg leading-relaxed">
                  {election.description || "Ushbu saylov jarayoni xavfsiz va shaffof tarzda amalga oshirilmoqda. Har bir ovoz shifrlangan holda saqlanadi."}
               </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {isActive && (
              <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-4">Qolgan vaqt</span>
                <ElectionTimer endTime={election.end_time} />
              </div>
            )}
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-4">Xavfsizlik darajasi</span>
               <div className="flex items-center gap-2 text-success font-black">
                  <ShieldAlert size={18} />
                  <span>256-bit AES Encryption</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Voting Interface */}
        {hasVoted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-premium p-12 text-center rounded-[40px]">
            <div className="w-20 h-20 bg-success/10 border border-success/20 rounded-[28px] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-success" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4">{t("vote_success")}</h2>
            
            {(receipt || voteStatus?.receipt_hash) && (
              <div className="bg-secondary rounded-2xl p-6 text-left mt-8 mb-8 border border-white/5">
                <p className="text-xs text-muted-foreground mb-2 uppercase font-black tracking-widest">{t("receipt")}</p>
                <p className="font-mono text-sm text-primary break-all font-bold">{receipt || voteStatus?.receipt_hash}</p>
              </div>
            )}

            {election.results_public && (
              <Link href={`/elections/${id}/results`} className="btn-primary justify-center px-10 py-4 text-lg">
                {t("view_results")}
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {!isActive && (
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-warning/10 border border-warning/20 mb-8">
                <ShieldAlert size={24} className="text-warning shrink-0" />
                <p className="text-warning-foreground font-medium">{t("not_accepting")}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight">{t("select_candidate")}</h2>
            </div>

            <div className="space-y-4 mb-10">
              {election.candidates.map((c) => (
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
              <button
                id="vote-submit-btn"
                onClick={() => setConfirmOpen(true)}
                disabled={!selectedCandidate}
                className="btn-primary w-full justify-center py-5 rounded-[24px] text-xl font-black shadow-primary/20 shadow-2xl disabled:opacity-30 disabled:scale-100 transition-transform active:scale-95"
              >
                <CheckCircle2 size={22} />
                {t("cast_vote")}
              </button>
            )}
          </motion.div>
        )}
      </main>

      {/* Confirm modal with better contrast */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Ovozni tasdiqlang">
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-2 uppercase font-black tracking-widest">{t("voting_for")}</p>
            <p className="font-black text-foreground text-3xl">{selectedName}</p>
            <div className="h-px w-full bg-white/5 my-4" />
            <p className="text-xs text-muted-foreground uppercase font-bold">{t("in_election")}</p>
            <p className="text-foreground font-bold">{election?.title}</p>
          </div>

          <div className="flex items-start gap-4 text-[14px] text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <ShieldAlert size={20} className="text-amber-500 shrink-0" />
            <span className="leading-relaxed font-medium">Bu amalni ortga qaytarib bo'lmaydi. Ovoz berish maxfiy va shifrlangan. Tanlovingizda diqqatli bo'ling.</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button onClick={() => setConfirmOpen(false)} className="btn-secondary justify-center py-4 rounded-xl text-lg font-bold">
              {commonT("cancel")}
            </button>
            <button
              id="confirm-vote-btn"
              onClick={handleVote}
              disabled={submitting}
              className="btn-primary justify-center py-4 rounded-xl text-lg font-black"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
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
