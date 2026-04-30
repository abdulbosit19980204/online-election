"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={`w-full ${sizeClasses[size]} glass rounded-2xl border border-[#26262f] shadow-2xl animate-slide-up`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#26262f]">
          <h3 className="font-semibold text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-[#26262f] flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
