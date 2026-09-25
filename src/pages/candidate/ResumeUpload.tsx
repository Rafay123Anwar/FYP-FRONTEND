import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UploadCloud, FileText, Trash2, ExternalLink, ShieldCheck,
  FileCheck, Loader2, Sparkles, AlertCircle, CheckCircle2, X,
} from "lucide-react";
import { deleteResume, listResumes, uploadResume, type ResumeOut } from "@/api/resume";
import { parseResume, type ParsedResumeOut } from "@/api/ai";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ResumeSkeleton } from "@/components/ui/Skeleton";
import { ResumeIntelligenceModal } from "@/components/candidate/ResumeIntelligenceModal";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export const ResumeUpload: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: resumes = [], isLoading, isFetching } = useQuery<ResumeOut[]>({
    queryKey: ["resumes"],
    queryFn: listResumes,
    staleTime: 5 * 60 * 1000,
  });

  const [isDragging, setIsDragging]         = useState(false);
  const [analyzingId, setAnalyzingId]       = useState<number | null>(null);
  const [analyzedCache, setAnalyzedCache]   = useState<Record<number, ParsedResumeOut>>({});
  const [modalData, setModalData]           = useState<ParsedResumeOut | null>(null);
  const [modalResume, setModalResume]       = useState<ResumeOut | null>(null);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [deletingId, setDeletingId]         = useState<number | null>(null);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: (_, file) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      toast.success("Resume uploaded!", `'${file.name}' is now in your cloud storage.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (err: any) => {
      toast.error("Upload failed", err?.response?.data?.detail ?? "Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      toast.success("Resume deleted", "The file has been removed from your storage.");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Delete failed", "Could not remove the resume. Please try again.");
      setDeletingId(null);
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFileProcess = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      toast.error("Unsupported format", "Please upload a PDF or DOCX file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", "Maximum file size is 10 MB.");
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileProcess(e.dataTransfer.files[0]);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const openAnalysis = (data: ParsedResumeOut, resume: ResumeOut) => {
    setModalData(data);
    setModalResume(resume);
    setIsModalOpen(true);
  };

  const handleAnalyze = async (resume: ResumeOut) => {
    setAnalyzingId(resume.id);
    try {
      const parsed = await parseResume(resume.id);
      setAnalyzedCache((p) => ({ ...p, [resume.id]: parsed }));
      openAnalysis(parsed, resume);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      toast.success("AI analysis complete!", `Insights ready for '${resume.file_name}'.`);
    } catch (err: any) {
      toast.error(
        "Analysis failed",
        err?.code === "ECONNABORTED"
          ? "AI model timed out. Please retry."
          : err?.response?.data?.detail ?? "Could not parse document."
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleViewAnalysis = async (resume: ResumeOut) => {
    const cached = analyzedCache[resume.id] ?? (resume.parsed_data as ParsedResumeOut | undefined);
    if (cached) { openAnalysis(cached, resume); return; }
    setAnalyzingId(resume.id);
    try {
      const parsed = await parseResume(resume.id);
      setAnalyzedCache((p) => ({ ...p, [resume.id]: parsed }));
      openAnalysis(parsed, resume);
    } catch {
      toast.error("Load failed", "Could not load AI insights. Please retry.");
    } finally {
      setAnalyzingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--color-text)" }}>
          Resume & Documents
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
          Upload, manage, and AI-analyze your CVs for recruiter review and automated matching.
        </p>
      </div>

      {/* AI Analyzing Banner */}
      {analyzingId && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F172A] border border-white/10 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 text-[#FF6B00] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            AI analyzing your resume…
            <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              Do not close
            </span>
          </h4>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
            Extracting skills, timeline, education & computing ATS health score
          </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing…
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={cn(
          "card-base border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-[#FF6B00] bg-orange-50/60 dark:bg-orange-900/10 scale-[0.995]"
            : "border-slate-200 dark:border-slate-700 hover:border-[#FF6B00]"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
        />
        <div className="flex flex-col items-center justify-center text-center p-10">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] flex items-center justify-center mb-4 shadow-sm border border-orange-100 dark:border-orange-800/40 transition-transform duration-200 group-hover:scale-110">
            {uploadMutation.isPending
              ? <Loader2 className="w-8 h-8 animate-spin" />
              : <UploadCloud className="w-8 h-8" />
            }
          </div>

          <h3 className="text-base font-bold mb-1" style={{ color: "var(--color-text)" }}>
            {uploadMutation.isPending ? "Uploading to Supabase…" : "Drop your resume or browse files"}
          </h3>
          <p className="text-xs mb-5 max-w-sm" style={{ color: "var(--color-muted)" }}>
            PDF and DOCX supported, up to 10 MB. Files are encrypted and stored in your dedicated bucket.
          </p>

          <Button isLoading={uploadMutation.isPending} type="button">
            Select File from Device
          </Button>

          <div className="flex items-center gap-5 mt-5 text-[11px] font-medium" style={{ color: "var(--color-muted)" }}>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> PDF & DOCX
            </span>
            <span className="opacity-30">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Encrypted Storage
            </span>
          </div>
        </div>
      </div>

      {/* Resumes List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>
              Uploaded Resumes
            </h2>
            <Badge variant="default">{resumes.length}</Badge>
            {isFetching && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-muted)" }}>
                <Loader2 className="w-3 h-3 animate-spin text-[#FF6B00]" /> Syncing
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <ResumeSkeleton />
        ) : resumes.length === 0 ? (
          <div className="card-base flex flex-col items-center justify-center py-16 gap-4 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                No resumes uploaded yet
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                Upload your CV to qualify for AI auto-matching with job listings
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => {
              const downloadUrl = (resume as any).file_path ?? (resume as any).file_url;
              const isAnalyzing = analyzingId === resume.id;
              const isAnalyzed  = Boolean(resume.is_analyzed ?? analyzedCache[resume.id]);
              const cachedData  = analyzedCache[resume.id] ?? (resume.parsed_data as ParsedResumeOut | undefined);
              const atsScore    = cachedData?.resume_health?.overall_resume_health_score;

              return (
                <div
                  key={resume.id}
                  className="card-base card-hover p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up"
                >
                  {/* File info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-800/40">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate" style={{ color: "var(--color-text)" }}>
                        {resume.file_name}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="default" className="uppercase text-[10px]">
                          {resume.file_type}
                        </Badge>
                        <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                          {new Date(resume.uploaded_at).toLocaleDateString()}
                        </span>
                        {atsScore !== undefined && (
                          <Badge variant="success" dot>
                            ATS {atsScore}/100
                          </Badge>
                        )}
                        {isAnalyzed && !atsScore && (
                          <Badge variant="info" dot>Analyzed</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                    {isAnalyzing ? (
                      <Button variant="outline" size="sm" isLoading disabled>
                        Analyzing…
                      </Button>
                    ) : isAnalyzed ? (
                      <button
                        onClick={() => handleViewAnalysis(resume)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 hover:from-slate-800 hover:to-slate-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all active:scale-[0.97]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                        View AI Insights
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAnalyze(resume)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-[#E55F00] hover:to-[#C2410C] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Analyze with AI
                      </button>
                    )}

                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(resume.id)}
                      disabled={deletingId === resume.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-50"
                      title="Delete resume"
                    >
                      {deletingId === resume.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Modal */}
      <ResumeIntelligenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
        resumeFileName={modalResume?.file_name}
      />
    </div>
  );
};
