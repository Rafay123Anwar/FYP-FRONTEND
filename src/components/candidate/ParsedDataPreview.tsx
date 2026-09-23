import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Code,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Quote,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Award,
  Globe,
  Sparkles,
  ArrowRight,
  Check,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import type { ParsedResumeOut } from "@/api/ai";
import { syncAIData } from "@/api/profile";

interface ParsedDataPreviewProps {
  data: ParsedResumeOut;
  onApplyToProfile?: () => void;
}

export const ParsedDataPreview: React.FC<ParsedDataPreviewProps> = ({
  data,
  onApplyToProfile,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"skills" | "projects" | "experience" | "education" | "summary">("skills");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (onApplyToProfile) {
        return await onApplyToProfile();
      } else {
        return await syncAIData(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setSyncSuccess("Profile successfully updated with AI data! Redirecting to profile builder...");
      setTimeout(() => {
        setIsConfirmOpen(false);
        navigate("/candidate/profile");
      }, 1500);
    },
    onError: (err: any) => {
      setSyncError(err?.response?.data?.detail || "Failed to synchronize profile. Please try again.");
    },
  });

  const handleApplyClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSync = () => {
    setSyncError(null);
    syncMutation.mutate();
  };

  const skillCategories = [
    {
      title: "Technical Foundation",
      skills: data.skills.technical_foundation,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100",
    },
    {
      title: "Process & Automation",
      skills: data.skills.process_and_automation,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100",
    },
    {
      title: "Project & Product Coordination",
      skills: data.skills.project_and_product_coordination,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100",
    },
    {
      title: "Data-Informed Decision Making",
      skills: data.skills.data_informed_decision_making,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100",
    },
    {
      title: "Other Recognized Competencies",
      skills: data.skills.other,
      badgeColor: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
    },
  ].filter((c) => c.skills.length > 0);

  const totalSkillsCount =
    data.skills.technical_foundation.length +
    data.skills.process_and_automation.length +
    data.skills.project_and_product_coordination.length +
    data.skills.data_informed_decision_making.length +
    data.skills.other.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Candidate Profile Ribbon */}
      <div className="p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#FF6B00]">
              <Sparkles className="w-3 h-3" /> Cohere V2 Intelligence
            </span>
            <span className="text-xs text-slate-400 font-medium">Evidence Grounded</span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            {data.name || "Candidate Name Not Detected"}
          </h3>

          {/* Contact Details Bar */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-600">
            {data.contact.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {data.contact.email}
              </span>
            )}
            {data.contact.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {data.contact.phone}
              </span>
            )}
            {data.contact.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {data.contact.location}
              </span>
            )}
            {data.contact.linkedin && (
              <a
                href={data.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {data.contact.github && (
              <a
                href={data.contact.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-800 hover:underline font-medium"
              >
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* Action Button: Apply Data to Profile */}
        <div className="relative shrink-0">
          <button
            onClick={handleApplyClick}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <span>Apply Data to Profile</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 px-6 overflow-x-auto scrollbar-none gap-2 bg-white">
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "skills"
              ? "border-[#FF6B00] text-[#FF6B00]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Extracted Skills ({totalSkillsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "projects"
              ? "border-[#FF6B00] text-[#FF6B00]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({data.projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "experience"
              ? "border-[#FF6B00] text-[#FF6B00]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Work Experience ({data.experience.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "education"
              ? "border-[#FF6B00] text-[#FF6B00]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education ({data.education.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("summary")}
          className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "summary"
              ? "border-[#FF6B00] text-[#FF6B00]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Summary & Understanding</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {skillCategories.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skills were explicitly extracted from the resume.</p>
            ) : (
              skillCategories.map((cat) => (
                <div key={cat.title} className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {cat.title} ({cat.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${cat.badgeColor}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {data.projects.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No project records explicitly found.</p>
            ) : (
              data.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-orange-200 transition-all shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map((t, ti) => (
                          <span
                            key={ti}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {proj.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  )}

                  {proj.evidence && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border-l-2 border-orange-400 text-slate-500 font-mono text-[11px] flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Extraction Evidence
                        </span>
                        <span className="italic">"{proj.evidence}"</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            {data.experience.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Work Experience Section Found</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
                  In compliance with strict zero-hallucination rules, titles in headers or project listings are never converted into phantom employment.
                </p>
              </div>
            ) : (
              data.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-orange-200 transition-all shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{exp.job_title}</h4>
                      <div className="text-xs text-slate-600 font-medium">{exp.company} {exp.location && `• ${exp.location}`}</div>
                    </div>
                    {(exp.start_date || exp.end_date) && (
                      <span className="text-xs font-semibold text-slate-400">
                        {exp.start_date || ""} - {exp.end_date || "Present"}
                      </span>
                    )}
                  </div>

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600">
                      {exp.responsibilities.map((r, ri) => (
                        <li key={ri}>{r}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((t, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {exp.evidence && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border-l-2 border-orange-400 text-slate-500 font-mono text-[11px] flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Extraction Evidence
                        </span>
                        <span className="italic">"{exp.evidence}"</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === "education" && (
          <div className="space-y-4">
            {data.education.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No education records explicitly identified.</p>
            ) : (
              data.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-orange-200 transition-all shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                      <div className="text-xs text-slate-600 font-medium">
                        {edu.institution} {edu.location && `• ${edu.location}`}
                      </div>
                    </div>
                    <div className="text-right">
                      {(edu.start_date || edu.end_date) && (
                        <div className="text-xs font-semibold text-slate-400">
                          {edu.start_date || ""} - {edu.end_date || ""}
                        </div>
                      )}
                      {edu.cgpa && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          CGPA: {edu.cgpa}
                        </span>
                      )}
                    </div>
                  </div>

                  {edu.evidence && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border-l-2 border-orange-400 text-slate-500 font-mono text-[11px] flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Extraction Evidence
                        </span>
                        <span className="italic">"{edu.evidence}"</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* SUMMARY & UNDERSTANDING TAB */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            {/* Professional Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Explicit Professional Summary
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {data.professional_summary || "No explicit summary statement in resume."}
              </p>
            </div>

            {/* Profile Understanding Profiles */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Cohere AI Profile Understanding (Factual Synthesis)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.resume_understanding.candidate_profile && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Candidate Profile
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.resume_understanding.candidate_profile}</p>
                  </div>
                )}
                {data.resume_understanding.technical_profile && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Technical Foundation Profile
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.resume_understanding.technical_profile}</p>
                  </div>
                )}
                {data.resume_understanding.project_profile && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Projects Profile
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.resume_understanding.project_profile}</p>
                  </div>
                )}
                {data.resume_understanding.education_profile && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Education Profile
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.resume_understanding.education_profile}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Canonical Structure Status */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Detected Canonical Sections
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.resume_structure.present_sections.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    ✓ {s}
                  </span>
                ))}
                {data.resume_structure.missing_sections.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200"
                  >
                    — {s} (Absent)
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Yes / No Confirmation Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                type="button"
                disabled={syncMutation.isPending}
                onClick={() => !syncMutation.isPending && setIsConfirmOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Profile Update
              </h3>
              <p className="text-sm font-semibold text-slate-800">
                Do you want to overwrite your current profile with this AI-extracted data? (Yes / No)
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will synchronize your skills, summary, and replace your current education and work experience records with the verified AI extraction.
              </p>

              {/* Error feedback */}
              {syncError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{syncError}</span>
                </div>
              )}

              {/* Success feedback */}
              {syncSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{syncSuccess}</span>
                </div>
              )}
            </div>

            {/* Actions (Yes / No) */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={syncMutation.isPending}
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              >
                No, Cancel
              </button>
              <button
                type="button"
                disabled={syncMutation.isPending || !!syncSuccess}
                onClick={handleConfirmSync}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#FF6B00] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {syncMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Yes, Overwrite Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
