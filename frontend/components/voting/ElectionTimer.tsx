"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ElectionTimerProps {
  endTime: string;
  onExpire?: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function ElectionTimer({ endTime, onExpire }: ElectionTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpire?.();
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime, onExpire]);

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Clock size={14} />
        Election has ended
      </div>
    );
  }

  const units = [
    { label: "Days", value: pad(timeLeft.days) },
    { label: "Hrs", value: pad(timeLeft.hours) },
    { label: "Min", value: pad(timeLeft.minutes) },
    { label: "Sec", value: pad(timeLeft.seconds) },
  ];

  return (
    <div className="flex items-center gap-3">
      <Clock size={14} className="text-blue-400 shrink-0" />
      <div className="flex items-center gap-1.5">
        {units.map((u, i) => (
          <span key={u.label} className="flex items-center gap-1.5">
            <span className="flex flex-col items-center">
              <span className="font-mono text-sm font-semibold text-slate-100 bg-[#26262f] px-2 py-0.5 rounded-md min-w-[32px] text-center tabular-nums">
                {u.value}
              </span>
              <span className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wide">{u.label}</span>
            </span>
            {i < units.length - 1 && (
              <span className="text-slate-600 font-mono text-sm self-start mt-0.5">:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
