import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, GraduationCap, Briefcase, Code2, Plus, Trash2, Check,
  Building2, MapPin, Calendar, Globe, Linkedin, Github, Loader2, Sparkles,
} from "lucide-react";
import { generateProfessionalHeadline } from "@/api/ai";
import {
  addSkill, createEducation, createExperience, deleteEducation,
  deleteExperience, deleteSkill, getFullCandidateProfile, upsertProfile,
  type CandidateFullProfileOut, type CandidateSkillOut,
  type EducationOut, type ExperienceOut,
} from "@/api/profile";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProfileSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { SearchableCombobox } from "@/components/ui/SearchableCombobox";
import { SkillsSelect } from "@/components/ui/SkillsSelect";
import { PAKISTANI_CITIES, PAKISTANI_UNIVERSITIES } from "@/lib/constants/pakistanData";
import {
  profileValidationSchema, educationValidationSchema, experienceValidationSchema,
  type ProfileFormValues, type EducationFormValues, type ExperienceFormValues,
} from "@/lib/validations/profile";

export const ProfileBuilder: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: fullProfile, isLoading, isFetching } = useQuery<CandidateFullProfileOut | null>({
    queryKey: ["profile", "full"],
    queryFn: getFullCandidateProfile,
    staleTime: 5 * 60 * 1000,
  });

  const [activeTab, setActiveTab] = useState<"basic" | "education" | "experience" | "skills">("basic");

  // Profile entities
  const [educations, setEducations] = useState<EducationOut[]>(fullProfile?.educations || []);
  const [experiences, setExperiences] = useState<ExperienceOut[]>(fullProfile?.experiences || []);
  const [skills, setSkills] = useState<CandidateSkillOut[]>(fullProfile?.skills || []);

  const {
    register: regProfile,
    handleSubmit: submitProfile,
    reset: resetProfile,
    control: controlProfile,
    watch: watchProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting, isDirty: isProfileDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      headline: "",
      summary: "",
      location: "",
      phone: "",
      website: "",
      linkedin: "",
      github: "",
    },
  });

  // 2. Education Form
  const {
    register: regEdu,
    handleSubmit: submitEdu,
    reset: resetEdu,
    control: controlEdu,
    formState: { errors: eduErrors, isSubmitting: isEduSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationValidationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      start_date: "",
      end_date: "",
      description: "",
    },
  });

  // 3. Experience Form
  const {
    register: regExp,
    handleSubmit: submitExp,
    reset: resetExp,
    watch: watchExp,
    setValue: setExpValue,
    formState: { errors: expErrors, isSubmitting: isExpSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceValidationSchema),
    defaultValues: {
      company: "",
      job_title: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    },
  });

  const isCurrentJob = watchExp("is_current");

  // Modals / Collapsible forms
  const [showEduForm, setShowEduForm] = useState<boolean>(false);
  const [showExpForm, setShowExpForm] = useState<boolean>(false);

  // Sync form values and local arrays whenever query fullProfile changes
  useEffect(() => {
    if (fullProfile) {
      if (fullProfile.profile) {
        resetProfile({
          headline: fullProfile.profile.headline || "",
          summary: fullProfile.profile.summary || "",
          location: fullProfile.profile.location || "",
          phone: fullProfile.profile.phone || "",
          website: fullProfile.profile.website || "",
          linkedin: fullProfile.profile.linkedin || "",
          github: fullProfile.profile.github || "",
        });
      }
      setEducations(fullProfile.educations || []);
      setExperiences(fullProfile.experiences || []);
      setSkills(fullProfile.skills || []);
    }
  }, [fullProfile, resetProfile]);

  const showNotification = (type: "success" | "error", text: string) => {
    if (type === "success") toast.success(text);
    else toast.error(text);
  };

  // 1. Profile Overview Mutation
  const upsertMutation = useMutation({
    mutationFn: upsertProfile,
    onSuccess: (updatedProfile) => {
      // Invalidate both profile queries
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // Instantly update query cache
      queryClient.setQueryData<CandidateFullProfileOut | null>(["profile", "full"], (old) => {
        if (!old) return old;
        return { ...old, profile: updatedProfile };
      });

      // Synchronize form inputs with updated profile data
      resetProfile({
        headline: updatedProfile.headline || "",
        summary: updatedProfile.summary || "",
        location: updatedProfile.location || "",
        phone: updatedProfile.phone || "",
        website: updatedProfile.website || "",
        linkedin: updatedProfile.linkedin || "",
        github: updatedProfile.github || "",
      });

      showNotification("success", "Profile overview updated successfully!");
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ")
          : "Failed to update profile.";
      showNotification("error", msg);
    },
  });

  const onSaveProfile = (formData: ProfileFormValues) => {
    const normalizeUrl = (url?: string | null) => {
      if (!url) return undefined;
      const trimmed = url.trim();
      if (!trimmed) return undefined;
      if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
      }
      return trimmed;
    };

    const cleanData = {
      headline: formData.headline?.trim() || undefined,
      summary: formData.summary?.trim() || undefined,
      location: formData.location?.trim() || undefined,
      phone: formData.phone?.trim() || undefined,
      website: normalizeUrl(formData.website),
      linkedin: normalizeUrl(formData.linkedin),
      github: normalizeUrl(formData.github),
    };
    upsertMutation.mutate(cleanData);
  };

  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false);

  const handleAutoGenerateHeadline = async () => {
    if (!fullProfile) return;
    try {
      setIsGeneratingHeadline(true);
      const generatedHeadline = await generateProfessionalHeadline(fullProfile);
      setProfileValue("headline", generatedHeadline, { shouldDirty: true, shouldValidate: true });
      showNotification("success", "AI generated a professional headline!");
    } catch (err: any) {
      showNotification("error", "Failed to generate headline: " + (err?.response?.data?.detail || "Unknown error"));
    } finally {
      setIsGeneratingHeadline(false);
    }
  };


  // 2. Education Mutations
  const addEducationMutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      resetEdu();
      setShowEduForm(false);
      showNotification("success", "Education added successfully!");
    },
    onError: (err: any) => {
      showNotification("error", err?.response?.data?.detail || "Failed to save education.");
    },
  });

  const onAddEducation = (formData: EducationFormValues) => {
    const payload = {
      institution: formData.institution.trim(),
      degree: formData.degree?.trim() || undefined,
      field: formData.field?.trim() || undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
      description: formData.description?.trim() || undefined,
    };
    addEducationMutation.mutate(payload as any);
  };

  const deleteEducationMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      showNotification("success", "Education record deleted.");
    },
    onError: () => {
      showNotification("error", "Failed to delete education.");
    },
  });

  const onDeleteEducation = (id: number) => {
    deleteEducationMutation.mutate(id);
  };

  // 3. Experience Mutations
  const addExperienceMutation = useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      resetExp();
      setShowExpForm(false);
      showNotification("success", "Experience record added successfully!");
    },
    onError: (err: any) => {
      showNotification("error", err?.response?.data?.detail || "Failed to save experience.");
    },
  });

  const onAddExperience = (formData: ExperienceFormValues) => {
    const payload = {
      company: formData.company.trim(),
      job_title: formData.job_title.trim(),
      start_date: formData.start_date,
      end_date: formData.is_current ? null : formData.end_date || null,
      description: formData.description?.trim() || undefined,
    };
    addExperienceMutation.mutate(payload as any);
  };

  const deleteExperienceMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      showNotification("success", "Experience record deleted.");
    },
    onError: () => {
      showNotification("error", "Failed to delete experience.");
    },
  });

  const onDeleteExperience = (id: number) => {
    deleteExperienceMutation.mutate(id);
  };

  // 4. Skills Tag Mutations
  const addSkillMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: (_, skillName) => {
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      showNotification("success", `Skill '${skillName}' added!`);
    },
    onError: (err: any) => {
      showNotification("error", err?.response?.data?.detail || "Skill already exists or failed to add.");
    },
  });

  const handleAddSkill = async (skillName: string): Promise<void> => {
    try {
      await addSkillMutation.mutateAsync(skillName);
    } catch {
      // Error notifications handled by addSkillMutation.onError
    }
  };

  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "full"] });
      showNotification("success", "Skill removed from profile.");
    },
    onError: () => {
      showNotification("error", "Failed to remove skill.");
    },
  });

  const handleDeleteSkill = async (skillId: number): Promise<void> => {
    try {
      await deleteSkillMutation.mutateAsync(skillId);
    } catch {
      // Error notifications handled by deleteSkillMutation.onError
    }
  };

  const tabs = [
    { id: "basic", label: "Overview & Headline", icon: User },
    { id: "education", label: `Education (${educations.length})`, icon: GraduationCap },
    { id: "experience", label: `Experience (${experiences.length})`, icon: Briefcase },
    { id: "skills", label: `Skills (${skills.length})`, icon: Code2 },
  ] as const;

  const todayStr = new Date().toISOString().split("T")[0];
  const maxFutureGraduationDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 6);
    return d.toISOString().split("T")[0];
  })();

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Profile Builder</h1>
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-medium">
                <Loader2 className="w-3 h-3 animate-spin text-[#FF6B00]" /> Syncing
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Build your comprehensive ATS profile to match recruiter job specifications.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/60 border max-w-fit" style={{ borderColor: "var(--color-border)" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-item ${isActive ? "active" : ""}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>


      {/* Tab 1: Basic Info */}
      {activeTab === "basic" && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Overview & Contact</CardTitle>
            <CardDescription>
              This information will be displayed prominently on your talent summary page.
            </CardDescription>
          </CardHeader>

          <form onSubmit={submitProfile(onSaveProfile)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
                  Professional Headline
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateHeadline}
                  disabled={isGeneratingHeadline || !fullProfile}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B00] hover:text-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingHeadline ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Auto-Generate
                </button>
              </div>
              <Input
                placeholder="e.g. Senior Full-Stack Engineer | Python & React"
                helperText="Brief statement summarizing your primary role and expertise"
                error={profileErrors.headline?.message}
                {...regProfile("headline")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Professional Summary / Bio
              </label>
              <textarea
                rows={4}
                placeholder="Detail your background, technical leadership, and core accomplishments..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all"
                {...regProfile("summary")}
              />
              {profileErrors.summary?.message && (
                <p className="text-xs text-rose-600 font-medium">{profileErrors.summary.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Input with Pakistani Cities Suggestions */}
              <div>
                <Input
                  label="Location (City / Country)"
                  placeholder="e.g. Karachi, Pakistan"
                  leftIcon={<MapPin className="w-4 h-4" />}
                  list="pakistan-cities-list"
                  error={profileErrors.location?.message}
                  {...regProfile("location")}
                />
                <datalist id="pakistan-cities-list">
                  {PAKISTANI_CITIES.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <Input
                label="Phone Number"
                placeholder="+92 300 1234567"
                error={profileErrors.phone?.message}
                {...regProfile("phone")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <Input
                label="Personal Website"
                placeholder="https://..."
                leftIcon={<Globe className="w-4 h-4" />}
                error={profileErrors.website?.message}
                {...regProfile("website")}
              />
              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/username"
                leftIcon={<Linkedin className="w-4 h-4" />}
                error={profileErrors.linkedin?.message}
                {...regProfile("linkedin")}
              />
              <Input
                label="GitHub URL"
                placeholder="https://github.com/username"
                leftIcon={<Github className="w-4 h-4" />}
                error={profileErrors.github?.message}
                {...regProfile("github")}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                size="md" 
                disabled={!isProfileDirty}
                isLoading={isProfileSubmitting || upsertMutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Education */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic Background</h2>
              <p className="text-xs text-slate-500">Add degrees, certifications, or universities attended.</p>
            </div>
            {!showEduForm && (
              <Button size="sm" onClick={() => setShowEduForm(true)} className="gap-1.5">
                <Plus className="w-4 h-4" /> Add Education
              </Button>
            )}
          </div>

          {/* New Education Form */}
          {showEduForm && (
            <Card className="border-[#FF6B00]/40 bg-orange-50/10">
              <CardHeader>
                <CardTitle className="text-base">Add New Degree / Institution</CardTitle>
              </CardHeader>
              <form onSubmit={submitEdu(onAddEducation)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Searchable Institution Combobox */}
                  <Controller
                    name="institution"
                    control={controlEdu}
                    render={({ field }) => (
                      <SearchableCombobox
                        label="Institution / University"
                        placeholder="Search e.g. FAST, NUST, LUMS, IBA, NED..."
                        options={PAKISTANI_UNIVERSITIES}
                        value={field.value || ""}
                        onChange={field.onChange}
                        required
                        error={eduErrors.institution?.message}
                      />
                    )}
                  />

                  <Input
                    label="Degree"
                    placeholder="e.g. Bachelor of Science"
                    error={eduErrors.degree?.message}
                    {...regEdu("degree")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Field of Study"
                    placeholder="e.g. Computer Science"
                    error={eduErrors.field?.message}
                    {...regEdu("field")}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    error={eduErrors.start_date?.message}
                    {...regEdu("start_date")}
                  />
                  <Input
                    label="End Date (or Expected)"
                    type="date"
                    max={maxFutureGraduationDate}
                    error={eduErrors.end_date?.message}
                    {...regEdu("end_date")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Description / Honors
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Optional details, major projects, thesis, or honors..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#FF6B00] outline-none"
                    {...regEdu("description")}
                  />
                  {eduErrors.description?.message && (
                    <p className="text-xs text-rose-600 font-medium">{eduErrors.description.message}</p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      resetEdu();
                      setShowEduForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" isLoading={isEduSubmitting || addEducationMutation.isPending}>
                    Save Education
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* List of Education records */}
          <div className="space-y-3">
            {educations.length === 0 ? (
              <Card className="text-center py-12 text-slate-400">
                <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No education records added yet.</p>
              </Card>
            ) : (
              educations.map((edu) => (
                <Card key={edu.id} className="p-5 flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      {edu.institution}
                    </h3>
                    <div className="text-sm text-[#FF6B00] font-medium">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    {(edu.start_date || edu.end_date) && (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {edu.start_date || "N/A"} — {edu.end_date || "Present"}
                      </div>
                    )}
                    {edu.description && <p className="text-xs text-slate-600 mt-2">{edu.description}</p>}
                  </div>
                  <button
                    onClick={() => onDeleteEducation(edu.id)}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Experience */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Work History</h2>
              <p className="text-xs text-slate-500">List previous companies and technical roles.</p>
            </div>
            {!showExpForm && (
              <Button size="sm" onClick={() => setShowExpForm(true)} className="gap-1.5">
                <Plus className="w-4 h-4" /> Add Experience
              </Button>
            )}
          </div>

          {/* New Experience Form */}
          {showExpForm && (
            <Card className="border-[#FF6B00]/40 bg-orange-50/10">
              <CardHeader>
                <CardTitle className="text-base">Add Work Experience</CardTitle>
              </CardHeader>
              <form onSubmit={submitExp(onAddExperience)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    placeholder="e.g. Systems Limited, Careem, Arbisoft"
                    required
                    error={expErrors.company?.message}
                    {...regExp("company")}
                  />
                  <Input
                    label="Job Title"
                    placeholder="e.g. Senior Backend Engineer"
                    required
                    error={expErrors.job_title?.message}
                    {...regExp("job_title")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    max={todayStr}
                    required
                    error={expErrors.start_date?.message}
                    {...regExp("start_date")}
                  />

                  <div>
                    <Input
                      label="End Date"
                      type="date"
                      max={todayStr}
                      disabled={isCurrentJob}
                      placeholder={isCurrentJob ? "Present" : ""}
                      error={expErrors.end_date?.message}
                      {...regExp("end_date")}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id="is_current"
                        type="checkbox"
                        className="w-4 h-4 text-[#FF6B00] border-slate-300 rounded focus:ring-[#FF6B00]"
                        {...regExp("is_current", {
                          onChange: (e) => {
                            if (e.target.checked) {
                              setExpValue("end_date", "");
                            }
                          },
                        })}
                      />
                      <label htmlFor="is_current" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        I am currently working in this role
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Key Responsibilities & Impact
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe engineering milestones, tech stack used, and achievements..."
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#FF6B00] outline-none"
                    {...regExp("description")}
                  />
                  {expErrors.description?.message && (
                    <p className="text-xs text-rose-600 font-medium">{expErrors.description.message}</p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      resetExp();
                      setShowExpForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" isLoading={isExpSubmitting || addExperienceMutation.isPending}>
                    Save Position
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* List of Experience records */}
          <div className="space-y-3">
            {experiences.length === 0 ? (
              <Card className="text-center py-12 text-slate-400">
                <Briefcase className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No work experience added yet.</p>
              </Card>
            ) : (
              experiences.map((exp) => (
                <Card key={exp.id} className="p-5 flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{exp.job_title}</h3>
                    <div className="text-sm font-semibold text-[#FF6B00]">{exp.company}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {exp.start_date || "N/A"} — {exp.end_date || "Present"}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 mt-2 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteExperience(exp.id)}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Skills */}
      {activeTab === "skills" && (
        <Card>
          <CardHeader>
            <CardTitle>Technical & Professional Skills</CardTitle>
            <CardDescription>
              Select and add verified skills that recruiters search for (e.g. Python, FastAPI, Docker, React).
            </CardDescription>
          </CardHeader>

          {/* Curated Searchable Skills Select */}
          <SkillsSelect
            skills={skills}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
            isAdding={addSkillMutation.isPending}
          />
        </Card>
      )}
    </div>
  );
};
