"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={14} />
          {commonT("back")}
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`badge ${election.status === "active" ? "badge-active" : "badge-ended"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${election.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
              {election.status === "active" ? t("live") : t("ended")}
            </span>
            {election.results_public && (
              <Link href={`/elections/${id}/results`} className="badge badge-admin text-xs hover:bg-accent/20 transition-colors">
                {t("results_avail")} →
              </Link>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{election.title}</h1>
          {election.description && <p className="text-muted-foreground text-sm">{election.description}</p>}

          {isActive && (
            <div className="mt-4">
              <ElectionTimer endTime={election.end_time} />
            </div>
          )}
        </motion.div>

        {/* Already voted */}
        {hasVoted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
            <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{t("vote_success")}</h2>
            
            {(receipt || voteStatus?.receipt_hash) && (
              <div className="bg-secondary rounded-xl p-4 text-left mt-6 mb-6">
                <p className="text-xs text-muted-foreground mb-1">{t("receipt")}</p>
                <p className="font-mono text-xs text-primary break-all">{receipt || voteStatus?.receipt_hash}</p>
              </div>
            )}

            {election.results_public && (
              <Link href={`/elections/${id}/results`} className="btn-primary justify-center">
                {t("view_results")}
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Vote panel */}
            {!isActive && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20 mb-6">
                <ShieldAlert size={16} className="text-warning shrink-0" />
                <p className="text-sm text-warning-foreground">{t("not_accepting")}</p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="font-semibold text-foreground mb-1">{t("select_candidate")}</h2>
            </div>

            <div className="space-y-3 mb-8">
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
                className="btn-primary w-full justify-center py-3 disabled:opacity-40"
              >
                <CheckCircle2 size={16} />
                {t("cast_vote")}
              </button>
            )}
          </motion.div>
        )}
      </main>

      {/* Confirm modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title={t("confirm_title")}>
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">{t("voting_for")}</p>
            <p className="font-bold text-foreground text-lg">{selectedName}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("in_election")} <span className="text-foreground font-medium">{election?.title}</span></p>
          </div>

          <div className="flex items-start gap-2 text-xs text-warning-foreground bg-warning/10 border border-warning/20 rounded-lg p-3">
            <ShieldAlert size={12} className="text-warning shrink-0 mt-0.5" />
            <span>{t("confirm_warning")}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setConfirmOpen(false)} className="btn-secondary flex-1 justify-center">
              {commonT("cancel")}
            </button>
            <button
              id="confirm-vote-btn"
              onClick={handleVote}
              disabled={submitting}
              className="btn-primary flex-1 justify-center"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("cast_vote")
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
