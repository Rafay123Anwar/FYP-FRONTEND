import React, { useEffect } from "react";
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dimmed backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        {/* Modal Dialog Card */}
        <div
          className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-slate-50 text-left align-middle shadow-2xl transition-all border border-slate-700/30 flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#FF6B00] flex items-center justify-center border border-orange-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-white tracking-tight">
                    AI Resume Intelligence & ATS Health
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00] text-white">
                    Cohere V2
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-xs">{resumeFileName || "Uploaded Resume Document"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body: Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* ATS Score Card */}
            <ATSScoreCard health={data.resume_health} />

            {/* Extracted Structured Data */}
            <ParsedDataPreview data={data} onApplyToProfile={onApplyToProfile} />
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Evidence-based zero-hallucination parsing completed.
            </span>
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
            >
              Close View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
