"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/navigation";
import { ArrowLeft, Trophy, Users, BarChart3, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import Navbar from "@/components/Navbar";
import CandidateCard from "@/components/voting/CandidateCard";
import { electionApi } from "@/lib/api";
import type { Election } from "@/types";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const CHART_COLORS = ["#4f46e5", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="font-bold text-foreground">{payload[0].value} votes</p>
      </div>
    );
  }
  return null;
};

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const commonT = useTranslations("Common");
  const t = useTranslations("Voting");
  
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    electionApi
      .results(id)
      .then((r) => setElection(r.data))
      .catch((e) => setError(e?.response?.data?.detail || "Results not available"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">{error || "Election not found"}</p>
        <Link href="/dashboard" className="btn-secondary text-sm">← {commonT("back")}</Link>
      </div>
    );
  }

  const candidates = Array.isArray(election.candidates) ? election.candidates : [];
  const winner = [...candidates].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))[0];
  const totalVotes = election.total_votes || 0;
  const chartData = candidates.map((c) => ({
    name: (c.name || "").split(" ")[0],
    votes: c.vote_count || 0,
    percentage: c.percentage || 0,
  }));
  const pieData = candidates.map((c, i) => ({
    name: c.name,
    value: c.vote_count || 0,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={14} /> {commonT("back")}
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="badge badge-ended mb-3 inline-flex">Final Results</span>
          <h1 className="text-2xl font-bold text-foreground mb-2">{election.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Users size={13} />{totalVotes} total votes</span>
            <span className="flex items-center gap-1.5"><BarChart3 size={13} />{election.candidates.length} candidates</span>
          </div>
        </motion.div>

        {/* Winner card */}
        {winner && totalVotes > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="card p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-warning to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-warning font-medium mb-1">🎉 Winner</p>
                <h2 className="text-xl font-bold text-foreground">{winner.name}</h2>
                {winner.party && <p className="text-sm text-muted-foreground">{winner.party}</p>}
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-extrabold text-gradient-blue">{winner.percentage?.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{winner.vote_count} votes</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid sm:grid-cols-2 gap-6 mb-10">
          {/* Bar chart */}
          <div className="card p-6">
            <h3 className="font-semibold text-foreground mb-5 text-sm">Vote Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(128,128,128,0.1)" }} />
                <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card p-6">
            <h3 className="font-semibold text-foreground mb-5 text-sm">Share of Votes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(v: any) => [`${v} votes`, ""]}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Candidate breakdown */}
        <h3 className="font-semibold text-foreground mb-4 text-sm">Candidate Breakdown</h3>
        <div className="space-y-3">
          {[...candidates]
            .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
            .map((c) => (
              <CandidateCard
                key={c.id}
                candidate={c}
                selected={c.id === winner?.id}
                onSelect={() => {}}
                disabled
                showVotes
                totalVotes={totalVotes}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
