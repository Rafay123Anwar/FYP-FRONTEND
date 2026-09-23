import * as z from "zod";

const LINKEDIN_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)?linkedin\.com\/.*$/i;
const GITHUB_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/.*$/i;
const WEBSITE_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;

const todayStr = new Date().toISOString().split("T")[0];
const maxFutureGraduationDate = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 6);
  return d.toISOString().split("T")[0];
})();

// ---------------- Profile Schema ----------------
export const profileValidationSchema = z.object({
  headline: z.string().max(255, "Headline cannot exceed 255 characters").optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  location: z.string().max(255, "Location cannot exceed 255 characters").optional().or(z.literal("")),
  phone: z.string().max(50, "Phone cannot exceed 50 characters").optional().or(z.literal("")),
  website: z
    .string()
    .max(255, "Website cannot exceed 255 characters")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || WEBSITE_REGEX.test(val), {
      message: "Please enter a valid website URL (e.g., https://myportfolio.dev)",
    }),
  linkedin: z
    .string()
    .max(255, "LinkedIn URL cannot exceed 255 characters")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || LINKEDIN_REGEX.test(val), {
      message: "Must be a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)",
    }),
  github: z
    .string()
    .max(255, "GitHub URL cannot exceed 255 characters")
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || GITHUB_REGEX.test(val), {
      message: "Must be a valid GitHub profile URL (e.g., https://github.com/username)",
    }),
});

export type ProfileFormValues = z.infer<typeof profileValidationSchema>;


// ---------------- Education Schema ----------------
export const educationValidationSchema = z
  .object({
    institution: z.string().min(1, "Institution name is required").max(255, "Institution name cannot exceed 255 characters"),
    degree: z.string().max(255, "Degree cannot exceed 255 characters").optional().or(z.literal("")),
    field: z.string().max(255, "Field of study cannot exceed 255 characters").optional().or(z.literal("")),
    start_date: z.string().optional().or(z.literal("")),
    end_date: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date > data.start_date;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  )
  .refine(
    (data) => {
      if (data.end_date) {
        return data.end_date <= maxFutureGraduationDate;
      }
      return true;
    },
    {
      message: "Graduation date cannot be more than 6 years in the future",
      path: ["end_date"],
    }
  );

export type EducationFormValues = z.infer<typeof educationValidationSchema>;


// ---------------- Experience Schema ----------------
export const experienceValidationSchema = z
  .object({
    company: z.string().min(1, "Company name is required").max(255, "Company name cannot exceed 255 characters"),
    job_title: z.string().min(1, "Job title is required").max(255, "Job title cannot exceed 255 characters"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().or(z.literal("")),
    is_current: z.boolean().optional(),
    description: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.start_date) {
        return data.start_date <= todayStr;
      }
      return true;
    },
    {
      message: "Start date cannot be in the future",
      path: ["start_date"],
    }
  )
  .refine(
    (data) => {
      if (!data.is_current && data.start_date && data.end_date) {
        return data.end_date >= data.start_date;
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    }
  )
  .refine(
    (data) => {
      if (!data.is_current && data.end_date) {
        return data.end_date <= todayStr;
      }
      return true;
    },
    {
      message: "End date cannot be in the future for past experience",
      path: ["end_date"],
    }
  );

export type ExperienceFormValues = z.infer<typeof experienceValidationSchema>;
