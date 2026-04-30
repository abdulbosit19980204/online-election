"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, BarChart3, Activity, Loader2 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend,
} from "recharts";
import Navbar from "@/components/Navbar";
import { analyticsApi } from "@/lib/api";
import type { ElectionAnalytics } from "@/types";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#16161d] border border-[#26262f] rounded-xl px-3 py-2 shadow-xl text-xs">
        <p className="text-slate-500 mb-1">{label}</p>
        <p className="font-bold text-slate-100">{payload[0].value} votes</p>
      </div>
    );
  }
  return null;
};

export default function AdminAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ElectionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsApi.election(id);
      setData(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // WebSocket for live updates
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
    const ws = new WebSocket(`${WS_URL}/ws/elections/${id}`);
    wsRef.current = ws;

    ws.onmessage = () => {
      // Refresh analytics on any vote update
      fetchAnalytics();
    };

    // Poll every 10s as fallback
    const poll = setInterval(fetchAnalytics, 10000);

    return () => {
      ws.close();
      clearInterval(poll);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
        <p className="text-slate-500">Analytics not available</p>
      </div>
    );
  }

  const barData = data.candidates.map((c) => ({
    name: c.name.split(" ")[0],
    votes: c.vote_count,
  }));

  const pieData = data.candidates.map((c, i) => ({
    name: c.name,
    value: c.vote_count,
    color: COLORS[i % COLORS.length],
  }));

  const areaData = data.votes_over_time.map((v) => ({
    time: new Date(v.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    votes: v.count,
  }));

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Admin
        </Link>

        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{data.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-gradient-blue">{data.total_votes}</p>
            <p className="text-xs text-slate-500">total votes cast</p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Votes", value: data.total_votes, icon: BarChart3, color: "text-blue-400" },
            { label: "Candidates", value: data.candidates.length, icon: Users, color: "text-violet-400" },
            { label: "Leading Candidate", value: data.candidates[0]?.name?.split(" ")[0] || "—", icon: TrendingUp, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <s.icon size={16} className={`${s.color} mb-3`} />
              <p className="text-xl font-bold text-slate-100">{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="font-semibold text-sm text-slate-200 mb-5">Vote Count by Candidate</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#26262f" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-sm text-slate-200 mb-5">Vote Share</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v} votes`]}
                  contentStyle={{ background: "#16161d", border: "1px solid #26262f", borderRadius: "12px" }}
                  itemStyle={{ color: "#f1f5f9" }}
                />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 11 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area chart: votes over time */}
        {areaData.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold text-sm text-slate-200 mb-5">Votes Over Time</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262f" />
                <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#26262f" }} />
                <Area type="monotone" dataKey="votes" stroke="#3b82f6" strokeWidth={2} fill="url(#voteGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Per-candidate table */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-[#26262f]">
            <h3 className="font-semibold text-sm text-slate-200">Candidate Breakdown</h3>
          </div>
          <div className="divide-y divide-[#26262f]">
            {data.candidates.map((c, i) => (
              <div key={c.candidate_id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: COLORS[i % COLORS.length] + "20", color: COLORS[i % COLORS.length] }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-100">{c.name}</p>
                  {c.party && <p className="text-xs text-slate-500">{c.party}</p>}
                </div>
                <div className="w-32">
                  <div className="progress-bar h-1.5">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${c.percentage}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-100 w-16 text-right">{c.percentage}%</p>
                <p className="text-xs text-slate-500 w-20 text-right">{c.vote_count} votes</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
