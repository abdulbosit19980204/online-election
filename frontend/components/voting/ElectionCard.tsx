"use client";
import { Clock, Users, CheckCircle } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { Link } from "@/navigation";
import type { Election } from "@/types";
import { useTranslations } from "next-intl";

interface ElectionCardProps {
  election: Election;
  href?: string;
  hasVoted?: boolean;
}

export default function ElectionCard({ election, href, hasVoted }: ElectionCardProps) {
  const t = useTranslations("Voting");
  
  const statusConfig: any = {
    active: { label: t("live"), class: "badge-active", dot: "bg-success" },
    ended: { label: t("ended"), class: "badge-ended", dot: "bg-muted-foreground" },
    draft: { label: "Draft", class: "badge-draft", dot: "bg-warning" },
  };

  const cfg = statusConfig[election.status] || statusConfig.draft;
  const isEnded = isPast(new Date(election.end_time));
  const timeLabel = isEnded
    ? `Ended ${formatDistanceToNow(new Date(election.end_time), { addSuffix: true })}`
    : `Ends ${formatDistanceToNow(new Date(election.end_time), { addSuffix: true })}`;

  const card = (
    <div className="card card-interactive p-6 flex flex-col gap-4 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {election.title}
          </h3>
          {election.description && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{election.description}</p>
          )}
        </div>
        <span className={`badge ${cfg.class} shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Users size={12} />
          {election.candidates.length} candidates
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {timeLabel}
        </span>
      </div>

      {hasVoted && (
        <div className="flex items-center gap-2 text-xs text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">
          <CheckCircle size={12} />
          {t("vote_success")}
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}
