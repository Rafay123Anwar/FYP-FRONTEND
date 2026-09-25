import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import type { ParsedResumeOut } from "@/api/ai";
import { ATSScoreCard } from "./ATSScoreCard";
import { ParsedDataPreview } from "./ParsedDataPreview";

interface ResumeIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ParsedResumeOut | null;
  resumeFileName?: string;
  onApplyToProfile?: () => void;
}

export const ResumeIntelligenceModal: React.FC<ResumeIntelligenceModalProps> = ({
  isOpen,
  onClose,
  data,
  resumeFileName,
  onApplyToProfile,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Dimmed backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        {/* Modal Dialog Card */}
        <div
          className="w-full max-w-5xl transform overflow-hidden rounded-2xl card-base text-left align-middle shadow-2xl transition-all flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 z-10" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-[#FF6B00] flex items-center justify-center border border-orange-100 dark:border-orange-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--color-text)" }}>
                    AI Resume Intelligence & ATS Health
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#FF6B00] to-[#EA580C] text-white shadow-sm shadow-orange-500/20">
                    Cohere V2
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-xs font-medium">{resumeFileName || "Uploaded Resume Document"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ color: "var(--color-muted)" }}
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6" style={{ background: "var(--color-bg)" }}>
            {/* ATS Score Card */}
            <ATSScoreCard health={data.resume_health} />

            {/* Extracted Structured Data */}
            <ParsedDataPreview data={data} onApplyToProfile={onApplyToProfile} />
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t flex items-center justify-between text-xs shrink-0" style={{ borderColor: "var(--color-border)", color: "var(--color-muted)", background: "var(--color-surface)" }}>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Evidence-based zero-hallucination parsing completed.
            </span>
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)", background: "var(--color-bg)" }}
            >
              Close View
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
