"use client";
import { CheckCircle2, User } from "lucide-react";
import type { Candidate } from "@/types";

interface CandidateCardProps {
  candidate: Candidate;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  showVotes?: boolean;
  totalVotes?: number;
}

const COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-sky-600",
];

export default function CandidateCard({
  candidate,
  selected,
  onSelect,
  disabled,
  showVotes,
  totalVotes,
}: CandidateCardProps) {
  const colorIdx = candidate.name.charCodeAt(0) % COLORS.length;
  const gradient = COLORS[colorIdx];
  const initial = candidate.name.charAt(0).toUpperCase();
  const pct = totalVotes && candidate.vote_count !== undefined
    ? Math.round((candidate.vote_count / totalVotes) * 100)
    : 0;

  return (
    <button
      onClick={() => !disabled && onSelect(candidate.id)}
      disabled={disabled}
      className={`
        w-full text-left p-5 rounded-2xl border transition-all duration-200 group relative overflow-hidden
        ${selected
          ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
          : "border-[#26262f] bg-[#16161d] hover:border-blue-500/40 hover:bg-[#1e1e28]"
        }
        ${disabled ? "cursor-default" : "cursor-pointer"}
      `}
    >
      {selected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 size={18} className="text-blue-400" />
        </div>
      )}

      <div className="flex items-center gap-4">
        {candidate.photo_url ? (
          <img
            src={candidate.photo_url}
            alt={candidate.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#26262f]"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shrink-0`}
          >
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-100">{candidate.name}</p>
          {candidate.party && (
            <p className="text-xs text-slate-500 mt-0.5">{candidate.party}</p>
          )}
        </div>
      </div>

      {candidate.bio && (
        <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {candidate.bio}
        </p>
      )}

      {showVotes && candidate.vote_count !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">{candidate.vote_count} votes</span>
            <span className="font-semibold text-slate-300">{pct}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
}
