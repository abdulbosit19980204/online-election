"use client";
import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import {
  Vote, Users, BarChart3, TrendingUp, Plus, Play, Square, Trash2,
  Eye, CheckCircle, Loader2, Globe
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { adminApi } from "@/lib/api";
import type { Election, SystemStats } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const statusConfig: Record<string, { label: string; cls: string }> = {
  active: { label: "Live", cls: "badge-active" },
  ended: { label: "Ended", cls: "badge-ended" },
  draft: { label: "Draft", cls: "badge-draft" },
};

export default function AdminDashboard() {
  const t = useTranslations("Navbar");
  const commonT = useTranslations("Common");
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [sRes, eRes] = await Promise.all([adminApi.stats(), adminApi.listElections()]);
      setStats(sRes.data);
      setElections(eRes.data);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.updateElection(id, { status });
      toast.success(`Election marked as ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await adminApi.publishResults(id);
      toast.success("Results published!");
      fetchData();
    } catch {
      toast.error("Failed to publish results");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteElection(id);
      toast.success("Election deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-foreground">{t("admin")}</h1>
            <p className="text-muted-foreground mt-1">Manage elections, candidates, and monitor activity</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/admin/elections/new" id="create-election-btn" className="btn-primary">
              <Plus size={15} />
              New Election
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
            {[
              { label: "Total Elections", value: stats.total_elections, icon: Vote, color: "text-primary" },
              { label: "Active Now", value: stats.active_elections, icon: TrendingUp, color: "text-success" },
              { label: "Total Votes", value: stats.total_votes, icon: BarChart3, color: "text-accent" },
              { label: "Total Users", value: stats.total_users, icon: Users, color: "text-warning" },
              { label: "Voters", value: stats.total_voters, icon: CheckCircle, color: "text-danger" },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <s.icon size={16} className={`${s.color} mb-3`} />
                <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Elections table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-semibold text-foreground">Elections</h2>
            <span className="text-xs text-muted-foreground">{elections.length} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={24} className="text-primary animate-spin" />
            </div>
          ) : elections.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Vote size={32} className="text-muted mx-auto mb-3" />
              <p className="text-muted-foreground">No elections yet</p>
              <Link href="/admin/elections/new" className="btn-primary mt-4 inline-flex text-xs">
                <Plus size={13} /> Create First Election
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {elections.map((e) => {
                const cfg = statusConfig[e.status] || statusConfig.draft;
                return (
                  <div key={e.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 hover:bg-hover transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`badge ${cfg.cls} text-[10px]`}>{cfg.label}</span>
                        {e.results_public && (
                          <span className="badge badge-admin text-[10px]">Published</span>
                        )}
                      </div>
                      <p className="font-medium text-sm text-foreground truncate">{e.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {e.candidates.length} candidates ·{" "}
                        {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status actions */}
                      {e.status === "draft" && (
                        <button
                          onClick={() => handleStatusChange(e.id, "active")}
                          className="btn-primary text-xs py-1.5 px-3"
                          title="Activate"
                        >
                          <Play size={11} /> Activate
                        </button>
                      )}
                      {e.status === "active" && (
                        <button
                          onClick={() => handleStatusChange(e.id, "ended")}
                          className="btn-secondary text-xs py-1.5 px-3"
                          title="End Election"
                        >
                          <Square size={11} /> End
                        </button>
                      )}
                      {e.status === "ended" && !e.results_public && (
                        <button
                          onClick={() => handlePublish(e.id)}
                          className="btn-primary text-xs py-1.5 px-3"
                          title="Publish Results"
                        >
                          <Globe size={11} /> Publish
                        </button>
                      )}

                      <Link
                        href={`/admin/elections/${e.id}/analytics`}
                        className="w-8 h-8 rounded-lg border border-border hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        title="Analytics"
                      >
                        <BarChart3 size={13} />
                      </Link>

                      {e.results_public && (
                        <Link
                          href={`/elections/${e.id}/results`}
                          className="w-8 h-8 rounded-lg border border-border hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          title="View Results"
                        >
                          <Eye size={13} />
                        </Link>
                      )}

                      <button
                        onClick={() => handleDelete(e.id, e.title)}
                        className="w-8 h-8 rounded-lg border border-border hover:bg-danger/10 hover:border-danger/30 flex items-center justify-center text-muted-foreground hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
