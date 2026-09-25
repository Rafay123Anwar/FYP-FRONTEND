import React from "react";
import { Link } from "react-router-dom";
import {
  User, GraduationCap, Briefcase, Code2, FileText,
  ArrowRight, Sparkles, UploadCloud, TrendingUp, CheckCircle2,
  MapPin, Phone, ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCandidateData } from "@/context/CandidateDataContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getCompletionColor(pct: number) {
  if (pct >= 80) return "#10B981";
  if (pct >= 50) return "#FF6B00";
  return "#F43F5E";
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ElementType;
  count: number;
  label: string;
  color: string;
  bg: string;
  delay?: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, count, label, color, bg, delay = "0ms" }) => (
  <div
    className="card-base card-hover p-5 flex flex-col gap-3 animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
      <Icon className={cn("w-5 h-5", color)} />
    </div>
    <div>
      <div className="text-3xl font-black" style={{ color: "var(--color-text)" }}>{count}</div>
      <div className="text-xs font-semibold mt-0.5" style={{ color: "var(--color-muted)" }}>{label}</div>
    </div>
  </div>
);

// ── Completion Step ───────────────────────────────────────────────────────────
interface StepProps { label: string; done: boolean; }
const CompletionStep: React.FC<StepProps> = ({ label, done }) => (
  <div className="flex items-center gap-2.5 text-xs">
    <div className={cn(
      "w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
      done
        ? "bg-emerald-500 text-white"
        : "bg-slate-100 dark:bg-slate-700 text-slate-400"
    )}>
      {done && <CheckCircle2 className="w-3 h-3" />}
    </div>
    <span className={done
      ? "text-slate-700 dark:text-slate-300 font-medium"
      : "text-slate-400 dark:text-slate-500"
    }>
      {label}
    </span>
    {done && <Badge variant="success" className="ml-auto text-[10px] py-0">Done</Badge>}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { fullProfile, isLoading } = useCandidateData();

  const completion = React.useMemo(() => {
    if (!fullProfile) return 15;
    let s = 20;
    if (fullProfile.profile?.headline)       s += 20;
    if (fullProfile.educations?.length > 0)  s += 20;
    if (fullProfile.experiences?.length > 0) s += 20;
    if (fullProfile.skills?.length > 0)      s += 10;
    if (fullProfile.resumes?.length > 0)     s += 10;
    return Math.min(s, 100);
  }, [fullProfile]);

  if (isLoading) return <DashboardSkeleton />;

  const completionColor = getCompletionColor(completion);
  const profile = fullProfile?.profile;

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-6 sm:p-8">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-[#FF6B00]/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] text-[11px] font-bold uppercase tracking-wider mb-4 border border-[#FF6B00]/25">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered ATS Platform
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {getGreeting()},{" "}
              <span className="text-[#FF6B00]">{user?.full_name?.split(" ")[0] ?? "Candidate"}</span>!
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-lg">
              Your profile is being indexed for recruiter discovery. Keep your resume, skills, and experience up to date for maximum visibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
            <Link to="/candidate/profile">
              <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Edit Profile
              </Button>
            </Link>
            <Link to="/candidate/resumes">
              <Button
                variant="outline"
                size="md"
                className="!border-white/20 !bg-white/5 !text-white hover:!bg-white/10"
                leftIcon={<UploadCloud className="w-4 h-4 text-[#FF6B00]" />}
              >
                Upload Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats + Completion ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Stats grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={GraduationCap} count={fullProfile?.educations?.length ?? 0}  label="Education Degrees" color="text-blue-500"   bg="bg-blue-50 dark:bg-blue-900/20"    delay="0ms"   />
          <StatCard icon={Briefcase}     count={fullProfile?.experiences?.length ?? 0}  label="Work Positions"   color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-900/20" delay="60ms"  />
          <StatCard icon={Code2}         count={fullProfile?.skills?.length ?? 0}       label="Verified Skills"  color="text-purple-500"  bg="bg-purple-50 dark:bg-purple-900/20" delay="120ms" />
          <StatCard icon={FileText}      count={fullProfile?.resumes?.length ?? 0}      label="Cloud Resumes"    color="text-[#FF6B00]"   bg="bg-orange-50 dark:bg-orange-900/20" delay="180ms" />
        </div>

        {/* Profile Strength */}
        <div className="card-base p-6 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>Profile Strength</h3>
            <Badge variant={completion >= 80 ? "success" : completion >= 50 ? "orange" : "error"}>
              {completion}%
            </Badge>
          </div>

          {/* Ring progress */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" className="dark:stroke-slate-700" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={completionColor}
                  strokeWidth="3"
                  strokeDasharray={`${completion} ${100 - completion}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.8s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black" style={{ color: completionColor }}>
                {completion}%
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <CompletionStep label="Account created"     done={true} />
              <CompletionStep label="Headline added"       done={!!profile?.headline} />
              <CompletionStep label="Education added"      done={(fullProfile?.educations?.length ?? 0) > 0} />
              <CompletionStep label="Experience added"     done={(fullProfile?.experiences?.length ?? 0) > 0} />
              <CompletionStep label="Resume uploaded"      done={(fullProfile?.resumes?.length ?? 0) > 0} />
            </div>
          </div>

          <Link
            to="/candidate/profile"
            className="text-xs font-bold text-[#FF6B00] hover:text-[#E55F00] flex items-center gap-1 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Boost your profile score
          </Link>
        </div>
      </div>

      {/* ── Profile Snapshot + Recent Resumes ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Professional Headline */}
        <div className="card-base p-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-5 pb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <h3 className="font-bold text-base" style={{ color: "var(--color-text)" }}>Professional Headline</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>How recruiters find you</p>
            </div>
            <Link to="/candidate/profile">
              <Button variant="outline" size="xs">Edit</Button>
            </Link>
          </div>

          {profile?.headline ? (
            <div className="space-y-3 animate-fade-in">
              <div className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                {profile.headline}
              </div>
              {profile.summary && (
                <p className="text-xs leading-relaxed p-3.5 rounded-xl border"
                  style={{ color: "var(--color-muted)", background: "rgba(148,163,184,0.07)", borderColor: "var(--color-border)" }}>
                  {profile.summary.slice(0, 200)}{profile.summary.length > 200 && "..."}
                </p>
              )}
              <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--color-muted)" }}>
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" /> {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF6B00]" /> {profile.phone}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>No headline yet</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>Add one in Profile Builder to boost visibility</p>
              </div>
              <Link to="/candidate/profile">
                <Button size="sm" variant="outline">Add Headline</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Resumes */}
        <div className="card-base p-6 animate-fade-in-up" style={{ animationDelay: "180ms" }}>
          <div className="flex items-center justify-between mb-5 pb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <h3 className="font-bold text-base" style={{ color: "var(--color-text)" }}>Latest Resumes</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>Stored in Supabase Cloud</p>
            </div>
            <Link to="/candidate/resumes">
              <Button variant="outline" size="xs">Manage</Button>
            </Link>
          </div>

          {fullProfile?.resumes && fullProfile.resumes.length > 0 ? (
            <div className="space-y-2.5">
              {fullProfile.resumes.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 hover:shadow-sm"
                  style={{ borderColor: "var(--color-border)", background: "rgba(148,163,184,0.05)" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: "var(--color-text)" }}>
                      {res.file_name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="default" className="text-[10px]">{res.file_type?.toUpperCase()}</Badge>
                      <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>
                        {new Date(res.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <a
                    href={(res as any).file_path || (res as any).file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF6B00] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>No resume uploaded</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>Upload a PDF or DOCX to qualify for AI matching</p>
              </div>
              <Link to="/candidate/resumes">
                <Button size="sm" leftIcon={<UploadCloud className="w-3.5 h-3.5" />}>Upload Resume</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
