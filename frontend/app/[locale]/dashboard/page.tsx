"use client";
import { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
import toast from "react-hot-toast";
import { Vote, Clock, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ElectionCard from "@/components/voting/ElectionCard";
import { useAuthStore } from "@/store/authStore";
import { electionApi, voteApi } from "@/lib/api";
import type { Election } from "@/types";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const commonT = useTranslations("Common");
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

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
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-foreground">
            {t("welcome")}, <span className="text-gradient-blue">{user?.full_name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-2">Here are the elections you can participate in.</p>
        </motion.div>

        {/* Stats row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
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
