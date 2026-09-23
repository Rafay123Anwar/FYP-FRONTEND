import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Layers,
  Phone,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
} from "lucide-react";
import type { ResumeHealthOut } from "@/api/ai";

interface ATSScoreCardProps {
  health: ResumeHealthOut;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({ health }) => {
  const score = health.overall_resume_health_score;

  // Determine score color badge & ring
  const getScoreTheme = (val: number) => {
    if (val >= 80) {
      return {
        label: "Excellent ATS Readiness",
        color: "text-emerald-600",
        bg: "bg-emerald-500",
        bgLight: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800",
        stroke: "#10B981",
      };
    }
    if (val >= 50) {
      return {
        label: "Good Foundation",
        color: "text-amber-600",
        bg: "bg-amber-500",
        bgLight: "bg-amber-50",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-800",
        stroke: "#F59E0B",
      };
    }
    return {
      label: "Needs Improvement",
      color: "text-rose-600",
      bg: "bg-rose-500",
      bgLight: "bg-rose-50",
      border: "border-rose-200",
      badge: "bg-rose-100 text-rose-800",
      stroke: "#EF4444",
    };
  };

  const theme = getScoreTheme(score);

  // SVG circular gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Granular metric items
  const metrics = [
    {
      label: "Completeness",
      score: health.completeness_score,
      icon: Layers,
    },
    {
      label: "Contact Info",
      score: health.contact_information_score,
      icon: Phone,
    },
    {
      label: "Section Structure",
      score: health.section_structure_score,
      icon: Award,
    },
    {
      label: "Skills Clarity",
      score: health.skills_clarity_score,
      icon: Cpu,
    },
    {
      label: "Project Depth",
      score: health.project_detail_score,
      icon: FolderGit2,
    },
    {
      label: "Education Detail",
      score: health.education_detail_score,
      icon: GraduationCap,
    },
    {
      label: "Experience Detail",
      score: health.experience_detail_score,
      icon: Briefcase,
    },
  ];

  // Derive strengths, issues and suggestions from health data
  const strengths: string[] = [];
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (health.contact_information_score >= 75) {
    strengths.push("Comprehensive contact details detected (Email, Location, Phone, LinkedIn).");
  } else {
    issues.push("Contact details are incomplete (missing phone, location, or LinkedIn).");
    suggestions.push("Add a full contact block with verified email, phone, and professional links.");
  }

  if (health.project_detail_score >= 80) {
    strengths.push("High-impact technical projects with explicit technologies and descriptions.");
  }

  if (health.skills_clarity_score >= 80) {
    strengths.push("Well-categorized technical foundation and automation competencies.");
  }

  if (health.education_detail_score >= 70) {
    strengths.push("Explicit degree and academic institution verified with evidence.");
  }

  // Parse backend reasons
  health.reasons.forEach((r) => {
    if (r.toLowerCase().includes("missing") || r.toLowerCase().includes("no work experience")) {
      issues.push(r);
    } else if (r.toLowerCase().includes("identified")) {
      strengths.push(r);
    }
  });

  if (health.experience_detail_score === 0) {
    suggestions.push("If you have completed internships or professional jobs, include an explicit 'Work Experience' section with dates and responsibilities.");
  }

  if (health.project_detail_score > 0 && health.project_detail_score < 100) {
    suggestions.push("Add quantifiable metrics (e.g. 40% performance gain, 60 FPS) to your project descriptions.");
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Banner / Score Summary */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Circular Score Gauge */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="#334155"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke={theme.stroke}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white tracking-tight">{score}</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">/ 100</span>
              </div>
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/10 text-orange-400 border border-white/10">
                <Award className="w-3.5 h-3.5 text-[#FF6B00]" /> ATS Resume Score
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">{theme.label}</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Evaluated against enterprise ATS parsing standards for formatting, clarity, evidence, and structural completeness.
              </p>
            </div>
          </div>

          {/* Quick Metrics Pill Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full md:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Completeness</div>
              <div className="text-base font-bold text-white mt-0.5">{health.completeness_score}%</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Skills Clarity</div>
              <div className="text-base font-bold text-white mt-0.5">{health.skills_clarity_score}%</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 font-medium">Structure</div>
              <div className="text-base font-bold text-white mt-0.5">{health.section_structure_score}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Score Progress Bars Grid */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Detailed Dimension Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5 truncate">
                    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {m.label}
                  </span>
                  <span className="font-bold text-slate-900">{m.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.score >= 80 ? "bg-emerald-500" : m.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths, Issues & Suggestions Tabs / Lists */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Strengths ({strengths.length})
          </div>
          <div className="space-y-2">
            {strengths.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No significant strengths detected yet.</p>
            ) : (
              strengths.map((str, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Potential Issues Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> ATS Red Flags ({issues.length})
          </div>
          <div className="space-y-2">
            {issues.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No critical formatting issues found.</p>
            ) : (
              issues.map((iss, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-950 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{iss}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actionable Suggestions Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C] uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-[#FF6B00]" /> Optimization Tips ({suggestions.length})
          </div>
          <div className="space-y-2">
            {suggestions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Your CV is well-optimized for parsing!</p>
            ) : (
              suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 text-xs text-orange-950 font-medium flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
                  <span>{sug}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
