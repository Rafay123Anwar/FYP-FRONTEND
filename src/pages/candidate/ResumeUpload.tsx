import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import { deleteResume, listResumes, uploadResume, type ResumeOut } from "@/api/resume";
import { parseResume, type ParsedResumeOut } from "@/api/ai";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResumeIntelligenceModal } from "@/components/candidate/ResumeIntelligenceModal";

export const ResumeUpload: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Resumes Query with 5 min staleTime & deduplication
  const {
    data: resumes = [],
    isLoading,
    isFetching,
  } = useQuery<ResumeOut[]>({
    queryKey: ["resumes"],
    queryFn: listResumes,
    staleTime: 5 * 60 * 1000,
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // AI Resume Intelligence state
  const [analyzingResumeId, setAnalyzingResumeId] = useState<number | null>(null);
  const [analyzedCache, setAnalyzedCache] = useState<Record<number, ParsedResumeOut>>({});
  const [activeModalData, setActiveModalData] = useState<ParsedResumeOut | null>(null);
  const [activeModalResume, setActiveModalResume] = useState<ResumeOut | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Upload Resume Mutation
  const uploadMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: (_, file) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      setSuccessMessage(`'${file.name}' successfully uploaded to Supabase Storage!`);
    },
    onError: (err: any) => {
      setErrorMessage(
        err?.response?.data?.detail || "Failed to upload file to cloud storage. Please try again."
      );
    },
    onSettled: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  // 3. Delete Resume Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      setSuccessMessage("Resume removed successfully.");
    },
    onError: () => {
      setErrorMessage("Failed to delete resume.");
    },
  });

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setErrorMessage("Unsupported file format. Please upload a PDF or DOCX file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit.");
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleAnalyzeResume = async (resume: ResumeOut) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setAnalyzingResumeId(resume.id);

    try {
      // Trigger Cohere AI parsing & ATS health analysis (single optimized call)
      const parsedData = await parseResume(resume.id);

      setAnalyzedCache((prev) => ({ ...prev, [resume.id]: parsedData }));
      setActiveModalData(parsedData);
      setActiveModalResume(resume);
      setIsModalOpen(true);

      // Invalidate queries so cached resumes list and dashboard update in background
      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      await queryClient.invalidateQueries({ queryKey: ["profile", "full"] });

      setSuccessMessage(`AI analysis complete for '${resume.file_name}'!`);
    } catch (err: any) {
      const msg =
        err?.code === "ECONNABORTED"
          ? "The AI model is taking longer than expected. Please retry."
          : err?.response?.data?.detail || "AI analysis failed. Please verify the document has readable text.";
      setErrorMessage(msg);
    } finally {
      setAnalyzingResumeId(null);
    }
  };

  const handleViewAnalysis = async (resume: ResumeOut) => {
    const cached = analyzedCache[resume.id] || (resume.parsed_data as ParsedResumeOut | undefined);
    if (cached) {
      setActiveModalData(cached);
      setActiveModalResume(resume);
      setIsModalOpen(true);
      return;
    }

    // Fallback: If not currently in memory, fetch instantly from DB cache without re-running AI
    setAnalyzingResumeId(resume.id);
    try {
      const parsedData = await parseResume(resume.id);
      setAnalyzedCache((prev) => ({ ...prev, [resume.id]: parsedData }));
      setActiveModalData(parsedData);
      setActiveModalResume(resume);
      setIsModalOpen(true);

      await queryClient.invalidateQueries({ queryKey: ["resumes"] });
      await queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
    } catch (err: any) {
      setErrorMessage("Failed to load AI insights. Please try again.");
    } finally {
      setAnalyzingResumeId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resume & Documents</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload and manage your CVs for automated parsing and recruiter review.
        </p>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Modern AI Analyzing Progress Banner */}
      {analyzingResumeId && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF6B00] flex items-center justify-center border border-orange-500/30 shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Cohere AI is analyzing your career data...
                <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                  Do not close window
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Extracting source-grounded skills, projects timeline, education, and computing ATS health score.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 self-end sm:self-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing LLM Response...</span>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <Card className="border-2 border-dashed border-slate-200 hover:border-[#FF6B00] transition-all duration-200 bg-white p-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center cursor-pointer text-center p-8 rounded-xl transition-all ${
            isDragging ? "bg-orange-50/50 scale-[0.99]" : ""
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-4 shadow-sm border border-orange-100">
            {uploadMutation.isPending ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">
            {uploadMutation.isPending ? "Uploading to Supabase Storage..." : "Drop your resume file here or browse"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Supports PDF and DOCX documents up to 10MB. Files are securely encrypted and stored in your dedicated bucket.
          </p>

          <Button variant="primary" size="md" isLoading={uploadMutation.isPending} type="button">
            Select File from Device
          </Button>

          <div className="flex items-center gap-4 mt-6 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> PDF & DOCX Accepted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Encrypted Cloud Storage
            </span>
          </div>
        </div>
      </Card>

      {/* Uploaded Documents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">
              Uploaded Resumes ({resumes.length})
            </h2>
            {isFetching && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin text-[#FF6B00]" /> Syncing
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <Card className="text-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-[#FF6B00]" />
            <p className="text-sm font-medium">Loading uploaded resumes...</p>
          </Card>
        ) : resumes.length === 0 ? (
          <Card className="text-center py-12 text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">No resume uploaded yet.</p>
            <p className="text-xs text-slate-400 mt-1">Upload your CV to qualify for AI auto-matching.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => {
              const downloadUrl = resume.file_path || resume.file_url;
              const isAnalyzingThis = analyzingResumeId === resume.id;
              const isAnalyzed = Boolean(resume.is_analyzed || analyzedCache[resume.id]);
              const cachedAnalysis = analyzedCache[resume.id] || (resume.parsed_data as ParsedResumeOut | undefined);

              return (
                <Card
                  key={resume.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0 border border-orange-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {resume.file_name}
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                        <span className="uppercase font-semibold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {resume.file_type}
                        </span>
                        <span>•</span>
                        <span>Uploaded on {new Date(resume.uploaded_at).toLocaleDateString()}</span>

                        {cachedAnalysis?.resume_health?.overall_resume_health_score !== undefined && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              ATS: {cachedAnalysis.resume_health.overall_resume_health_score}/100
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Primary AI Analysis Trigger */}
                    {isAnalyzingThis ? (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 cursor-not-allowed"
                      >
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B00]" />
                        <span>Analyzing CV...</span>
                      </button>
                    ) : isAnalyzed ? (
                      <button
                        onClick={() => handleViewAnalysis(resume)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                        <span>View AI Insights</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAnalyzeResume(resume)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-[0.98]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>Analyze CV with AI</span>
                      </button>
                    )}

                    {downloadUrl && (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View / Download
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(resume.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Resume Intelligence Modal */}
      <ResumeIntelligenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={activeModalData}
        resumeFileName={activeModalResume?.file_name}
      />
    </div>
  );
};
