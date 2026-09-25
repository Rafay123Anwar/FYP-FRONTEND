import axiosClient from "./axiosClient";

export interface ContactInfo {
  location: string | null;
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface SkillsOut {
  project_and_product_coordination: string[];
  process_and_automation: string[];
  technical_foundation: string[];
  data_informed_decision_making: string[];
  other: string[];
}

export interface ParsedProject {
  name: string;
  technologies: string[];
  description: string | null;
  evidence: string | null;
}

export interface ParsedExperience {
  job_title: string | null;
  company: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  responsibilities: string[];
  technologies: string[];
  evidence: string | null;
}

export interface ParsedEducation {
  degree: string | null;
  institution: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  cgpa: string | null;
  evidence: string | null;
}

export interface ParsedCertification {
  name: string;
  provider: string | null;
  date: string | null;
  evidence: string | null;
}

export interface ParsedAchievement {
  title: string;
  description: string | null;
  evidence: string | null;
}

export interface ParsedLanguage {
  language: string;
  proficiency: string | null;
  evidence: string | null;
}

export interface ResumeUnderstanding {
  candidate_profile: string | null;
  technical_profile: string | null;
  project_profile: string | null;
  experience_profile: string | null;
  education_profile: string | null;
  certification_profile: string | null;
  language_profile: string | null;
}

export interface ResumeStructure {
  present_sections: string[];
  missing_sections: string[];
  incomplete_sections: string[];
}

export interface ResumeHealthOut {
  completeness_score: number;
  contact_information_score: number;
  section_structure_score: number;
  skills_clarity_score: number;
  project_detail_score: number;
  education_detail_score: number;
  experience_detail_score: number;
  overall_resume_health_score: number;
  reasons: string[];
}

export interface ParsedResumeOut {
  resume_id?: number | null;
  name: string | null;
  contact: ContactInfo;
  professional_summary: string | null;
  skills: SkillsOut;
  projects: ParsedProject[];
  experience: ParsedExperience[];
  education: ParsedEducation[];
  certifications: ParsedCertification[];
  achievements: ParsedAchievement[];
  languages: ParsedLanguage[];
  resume_understanding: ResumeUnderstanding;
  resume_structure: ResumeStructure;
  resume_health: ResumeHealthOut;
}

/**
 * Trigger AI parsing on an uploaded resume by resume ID.
 * Returns structured intelligence without overwriting the candidate DB profile.
 */
export async function parseResume(resumeId: number): Promise<ParsedResumeOut> {
  const res = await axiosClient.post<ParsedResumeOut>(
    `/ai/parse-resume/${resumeId}`,
    undefined,
    { timeout: 120000 } // 2 minutes for LLM extraction
  );
  return res.data;
}

/**
 * Request ATS Resume Health analysis and score for an uploaded resume.
 */
export async function getResumeHealth(resumeId: number): Promise<ResumeHealthOut> {
  const res = await axiosClient.post<ResumeHealthOut>(
    `/ai/resume-health/${resumeId}`,
    undefined,
    { timeout: 120000 }
  );
  return res.data;
}

/**
 * Parse raw text directly using Cohere AI (useful for previews or text pasting).
 */
export async function parseResumeText(text: string): Promise<ParsedResumeOut> {
  const res = await axiosClient.post<ParsedResumeOut>(
    "/ai/parse-text",
    { text },
    { timeout: 120000 }
  );
  return res.data;
}

/**
 * Generate a professional headline using AI based on existing profile data.
 */
export async function generateProfessionalHeadline(profileData: any): Promise<string> {
  const res = await axiosClient.post<{ headline: string }>(
    "/ai/generate-headline",
    { profile_data: profileData },
    { timeout: 60000 }
  );
  return res.data.headline;
}
