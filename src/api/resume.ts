import axiosClient from "./axiosClient";
import type { ParsedResumeOut, ResumeHealthOut } from "./ai";

export interface ResumeOut {
  id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_url?: string;
  file_type: string;
  uploaded_at: string;
  is_analyzed?: boolean;
  parsed_data?: ParsedResumeOut | null;
  health_data?: ResumeHealthOut | null;
}

/**
 * Upload a candidate resume file (PDF or DOCX).
 */
export async function uploadResume(file: File): Promise<ResumeOut> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post<ResumeOut>("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

/**
 * List all uploaded resumes of the current user.
 */
export async function listResumes(): Promise<ResumeOut[]> {
  const res = await axiosClient.get<ResumeOut[]>("/resumes/");
  return res.data;
}

/**
 * Delete a resume by ID.
 */
export async function deleteResume(id: number): Promise<{ message: string }> {
  const res = await axiosClient.delete<{ message: string }>(`/resumes/${id}`);
  return res.data;
}
