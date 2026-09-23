import axiosClient from "./axiosClient";

export interface ProfileData {
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ProfileOut extends ProfileData {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface EducationData {
  institution: string;
  degree?: string;
  field?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface EducationOut extends EducationData {
  id: number;
  user_id: number;
  created_at: string;
}

export interface ExperienceData {
  company: string;
  job_title: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface ExperienceOut extends ExperienceData {
  id: number;
  user_id: number;
  created_at: string;
}

export interface SkillOut {
  id: number;
  name: string;
}

export interface CandidateSkillOut {
  id: number;
  user_id: number;
  skill_id: number;
  skill: SkillOut;
}

export interface ProjectData {
  title: string;
  description?: string;
  technologies?: string;
  url?: string;
}

export interface ProjectOut extends ProjectData {
  id: number;
  user_id: number;
  created_at: string;
}

export interface CandidateFullProfileOut {
  profile?: ProfileOut | null;
  educations: EducationOut[];
  experiences: ExperienceOut[];
  skills: CandidateSkillOut[];
  projects: ProjectOut[];
  resumes: any[];
}

// ---------------- Profile API ----------------
export async function getProfile(): Promise<ProfileOut> {
  const res = await axiosClient.get<ProfileOut>("/profile/");
  return res.data;
}

export async function upsertProfile(data: ProfileData): Promise<ProfileOut> {
  const res = await axiosClient.put<ProfileOut>("/profile/", data);
  return res.data;
}

export async function getFullCandidateProfile(): Promise<CandidateFullProfileOut> {
  const res = await axiosClient.get<CandidateFullProfileOut>("/profile/full");
  return res.data;
}

// ---------------- Education API ----------------
export async function listEducations(): Promise<EducationOut[]> {
  const res = await axiosClient.get<EducationOut[]>("/profile/education");
  return res.data;
}

export async function createEducation(data: EducationData): Promise<EducationOut> {
  const res = await axiosClient.post<EducationOut>("/profile/education", data);
  return res.data;
}

export async function updateEducation(id: number, data: Partial<EducationData>): Promise<EducationOut> {
  const res = await axiosClient.put<EducationOut>(`/profile/education/${id}`, data);
  return res.data;
}

export async function deleteEducation(id: number): Promise<{ message: string }> {
  const res = await axiosClient.delete<{ message: string }>(`/profile/education/${id}`);
  return res.data;
}

// ---------------- Experience API ----------------
export async function listExperiences(): Promise<ExperienceOut[]> {
  const res = await axiosClient.get<ExperienceOut[]>("/profile/experience");
  return res.data;
}

export async function createExperience(data: ExperienceData): Promise<ExperienceOut> {
  const res = await axiosClient.post<ExperienceOut>("/profile/experience", data);
  return res.data;
}

export async function updateExperience(id: number, data: Partial<ExperienceData>): Promise<ExperienceOut> {
  const res = await axiosClient.put<ExperienceOut>(`/profile/experience/${id}`, data);
  return res.data;
}

export async function deleteExperience(id: number): Promise<{ message: string }> {
  const res = await axiosClient.delete<{ message: string }>(`/profile/experience/${id}`);
  return res.data;
}

// ---------------- Skills API ----------------
export async function listSkills(): Promise<CandidateSkillOut[]> {
  const res = await axiosClient.get<CandidateSkillOut[]>("/profile/skills");
  return res.data;
}

export async function addSkill(name: string): Promise<CandidateSkillOut> {
  const res = await axiosClient.post<CandidateSkillOut>("/profile/skills", { name });
  return res.data;
}

export async function deleteSkill(id: number): Promise<{ message: string }> {
  const res = await axiosClient.delete<{ message: string }>(`/profile/skills/${id}`);
  return res.data;
}

// ---------------- Projects API ----------------
export async function listProjects(): Promise<ProjectOut[]> {
  const res = await axiosClient.get<ProjectOut[]>("/profile/projects");
  return res.data;
}

export async function createProject(data: ProjectData): Promise<ProjectOut> {
  const res = await axiosClient.post<ProjectOut>("/profile/projects", data);
  return res.data;
}

export async function updateProject(id: number, data: Partial<ProjectData>): Promise<ProjectOut> {
  const res = await axiosClient.put<ProjectOut>(`/profile/projects/${id}`, data);
  return res.data;
}

export async function deleteProject(id: number): Promise<{ message: string }> {
  const res = await axiosClient.delete<{ message: string }>(`/profile/projects/${id}`);
  return res.data;
}

// ---------------- AI Intelligence Profile Sync ----------------
export async function syncAIData(data: import("./ai").ParsedResumeOut): Promise<{ status: string; message: string }> {
  const res = await axiosClient.post<{ status: string; message: string }>("/profile/sync-ai-data", data);
  return res.data;
}
