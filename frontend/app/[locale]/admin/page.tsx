"use client";
import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import toast from "react-hot-toast";
import {
  Vote, Users, BarChart3, TrendingUp, Plus, Play, Square, Trash2,
  Eye, CheckCircle, Loader2, Globe, Edit
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { adminApi } from "@/lib/api";
import type { Election, SystemStats } from "@/types";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const tAdmin = useTranslations("Admin");
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
    console.log(`Attempting to update election ${id} status to ${status}`);
    try {
      const res = await adminApi.updateElection(id, { status });
      console.log("Update response:", res.data);
      toast.success(`Election marked as ${status}`);
      fetchData();
    } catch (err: any) {
      console.error("Failed to update status:", err.response?.data || err.message);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold text-foreground">{tAdmin("dashboard")}</h1>
            <p className="text-muted-foreground mt-1">{tAdmin("stats_overview")}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <Link href="/admin/elections/new" id="create-election-btn" className="btn-primary">
              <Plus size={15} />
              {tAdmin("create_new")}
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
            {[
              { label: tAdmin("total_elections"), value: stats.total_elections, icon: Vote, color: "text-primary" },
              { label: tAdmin("active"), value: stats.active_elections, icon: TrendingUp, color: "text-green-500" },
              { label: tAdmin("total_users"), value: stats.total_users, icon: Users, color: "text-blue-500" },
              { label: tAdmin("total_votes"), value: stats.total_votes, icon: BarChart3, color: "text-purple-500" },
              { label: "Voters", value: stats.total_voters || 0, icon: CheckCircle, color: "text-orange-500" },
            ].map((s, i) => (
              <div key={i} className="card p-4 text-center border-none shadow-lg">
                <s.icon className={`mx-auto mb-2 ${s.color}`} size={20} />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Elections Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-0 overflow-hidden border-none shadow-xl">
          <div className="p-6 border-b border-border bg-card/50">
            <h2 className="text-lg font-bold text-foreground">{tAdmin("manage_elections")}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed">
              <colgroup>
                <col className="w-1/2" />
                <col className="w-24" />
                <col className="w-24" />
                <col className="w-32" />
              </colgroup>
              <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                <tr>
                  <th className="px-6 py-4">{tAdmin("title")}</th>
                  <th className="px-6 py-4">{tAdmin("status")}</th>
                  <th className="px-6 py-4 text-center">{tAdmin("candidates")}</th>
                  <th className="px-6 py-4 text-right">{tAdmin("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {elections.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-foreground">{e.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[300px]">
                        {e.description ? e.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"') : ""}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`badge ${e.status === 'active' ? 'badge-active' : e.status === 'ended' ? 'badge-ended' : 'badge-draft'}`}>
                        {e.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Users size={12} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{e.candidates.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/elections/${e.id}/edit`}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title={tAdmin("edit")}
                        >
                          <Edit size={16} />
                        </Link>

                        {e.status === "draft" && (
                          <button
                            onClick={() => handleStatusChange(e.id, "active")}
                            className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                            title={tAdmin("activate")}
                          >
                            <Play size={16} />
                          </button>
                        )}
                        {e.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(e.id, "ended")}
                            className="p-2 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors"
                            title="End"
                          >
                            <Square size={16} />
                          </button>
                        )}
                        {e.status === "ended" && !e.results_public && (
                          <button
                            onClick={() => handlePublish(e.id)}
                            className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                            title={tAdmin("publish")}
                          >
                            <Globe size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(e.id, e.title)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
