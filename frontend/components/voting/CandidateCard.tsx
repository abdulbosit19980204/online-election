"use client";
import React, { useState } from "react";
import { User, Info, FileText, CheckCircle2 } from "lucide-react";
import type { Candidate } from "@/types";
import Modal from "@/components/ui/Modal";
import RichTextRenderer from "@/components/ui/RichTextRenderer";
import { getMediaUrl } from "@/lib/api";

interface CandidateCardProps {
  candidate: Candidate;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  showVotes?: boolean;
  totalVotes?: number;
}

export default function CandidateCard({ candidate, selected, onSelect, disabled, showVotes, totalVotes }: CandidateCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className={`
          relative group transition-all duration-500 p-6 rounded-3xl border-2 flex items-center justify-between overflow-hidden
          ${selected 
            ? "bg-primary/10 border-primary shadow-2xl shadow-primary/20 scale-[1.02]" 
            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => !disabled && onSelect(candidate.id)}
      >
        <div className="flex items-center gap-6 flex-1">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
            ${selected ? "bg-primary text-white scale-110 rotate-3" : "bg-white/5 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"}
          `}>
            {candidate.photo_url ? (
              <img src={getMediaUrl(candidate.photo_url)} alt={candidate.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <User size={32} />
            )}
          </div>
          
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{candidate.name}</h4>
            <div className="flex items-center gap-2">
               <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                 {candidate.party || "Mustaqil nomzod"}
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showVotes && candidate.vote_count !== undefined && (
            <div className="text-right mr-4">
              <div className="text-2xl font-black text-primary">
                {totalVotes ? Math.round((candidate.vote_count / totalVotes) * 100) : 0}%
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {candidate.vote_count} ovoz
              </div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
            className="p-3 rounded-xl bg-white/5 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all"
            title="Batafsil ma'lumot"
          >
            <Info size={20} />
          </button>
          
          <div className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500
            ${selected ? "bg-primary border-primary scale-110" : "border-white/10"}
          `}>
            {selected && <CheckCircle2 size={16} className="text-white" />}
          </div>
        </div>

        {/* Selected Glow Effect */}
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Candidate Details Modal */}
      <Modal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        title={`${candidate.name} - Saylovoldi dasturi`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
             <div className="w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <User size={40} />
             </div>
             <div>
                <h3 className="text-2xl font-bold text-foreground">{candidate.name}</h3>
                <p className="text-primary font-bold text-sm uppercase tracking-widest">{candidate.party || "Mustaqil"}</p>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter">
                <FileText size={18} />
                <span>Biografiya va Dastur</span>
             </div>
             <RichTextRenderer 
                content={candidate.bio || "Ushbu nomzod haqida ma'lumot kiritilmagan."}
                className="text-lg"
             />
          </div>

          <button 
            onClick={() => setShowDetails(false)}
            className="btn-secondary w-full justify-center py-4 rounded-xl font-bold"
          >
            Yopish
          </button>
        </div>
      </Modal>
    </>
  );
}
