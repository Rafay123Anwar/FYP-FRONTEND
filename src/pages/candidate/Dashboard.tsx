import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  GraduationCap,
  Briefcase,
  Code2,
  FileText,
  ArrowRight,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCandidateData } from "@/context/CandidateDataContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { fullProfile: profileData } = useCandidateData();

  // Compute profile completion percentage
  const calculateCompletion = () => {
    if (!profileData) return 15;
    let score = 20; // Account created
    if (profileData.profile?.headline) score += 20;
    if (profileData.educations?.length > 0) score += 20;
    if (profileData.experiences?.length > 0) score += 20;
    if (profileData.skills?.length > 0) score += 10;
    if (profileData.resumes?.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const completionPercent = calculateCompletion();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-8 text-white relative overflow-hidden shadow-elevated">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-4 border border-[#FF6B00]/30">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Workspace
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || "Candidate"}!
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Your candidate profile is currently being indexed for recruiter discovery. Keep your education, skills, and resume updated for higher visibility.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link to="/candidate/profile">
              <Button size="md" className="gap-2">
                Edit Profile <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/candidate/resumes">
              <Button variant="outline" size="md" className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700 gap-2">
                <UploadCloud className="w-4 h-4 text-[#FF6B00]" /> Upload Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Strength Card */}
        <Card className="md:col-span-1 border-orange-100 bg-gradient-to-b from-white to-orange-50/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Profile Strength</h3>
            <span className="text-xs font-bold text-[#FF6B00] px-2 py-0.5 rounded-full bg-orange-100">
              {completionPercent}% Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-[#FF6B00] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            {completionPercent === 100
              ? "Your profile is fully optimized and ready for enterprise recruiter matching!"
              : "Complete missing education, experience, or resume files to achieve 100% profile score."}
          </p>

          <Link
            to="/candidate/profile"
            className="inline-flex items-center text-xs font-bold text-[#FF6B00] hover:text-[#E55F00] transition-colors"
          >
            Enhance profile details →
          </Link>
        </Card>

        {/* Overview Stats */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="flex flex-col justify-between p-4">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {profileData?.educations?.length || 0}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Education Degrees</div>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {profileData?.experiences?.length || 0}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Work Positions</div>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-4">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {profileData?.skills?.length || 0}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Verified Skills</div>
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-4">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {profileData?.resumes?.length || 0}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Cloud Resumes</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Snapshot Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details Snapshot */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Professional Headline</CardTitle>
              <CardDescription>How you appear in candidate search results</CardDescription>
            </div>
            <Link to="/candidate/profile">
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          </CardHeader>

          {profileData?.profile?.headline ? (
            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-900">
                {profileData.profile.headline}
              </div>
              {profileData.profile.summary && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {profileData.profile.summary}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                {profileData.profile.location && <span>📍 {profileData.profile.location}</span>}
                {profileData.profile.phone && <span>📞 {profileData.profile.phone}</span>}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <User className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No headline set yet. Add one in Profile Builder.</p>
            </div>
          )}
        </Card>

        {/* Resumes Snapshot */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Latest Resumes</CardTitle>
              <CardDescription>Resumes saved in Supabase Storage</CardDescription>
            </div>
            <Link to="/candidate/resumes">
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </Link>
          </CardHeader>

          {profileData?.resumes && profileData.resumes.length > 0 ? (
            <div className="space-y-2.5">
              {profileData.resumes.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-[#FF6B00] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {res.file_name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Uploaded {new Date(res.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <a
                    href={res.file_path || res.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#FF6B00] hover:underline shrink-0"
                  >
                    View File
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No resume uploaded yet. Upload a PDF/DOCX to get started.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
