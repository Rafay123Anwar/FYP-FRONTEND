import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Mail, Lock, User, Briefcase, UserCheck, AlertCircle, ArrowRight } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/api/auth";

const registerSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    role: z.enum(["JOB_SEEKER", "HR"] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "JOB_SEEKER",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerAuth({
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        role: data.role as UserRole,
      });
      navigate("/candidate/dashboard", { replace: true });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const errorMsg =
        detail ||
        (err?.message === "Network Error"
          ? "Network Error: Could not connect to the backend server. Please verify your connection or CORS settings."
          : err?.response?.status
          ? `Server error (${err.response.status}): ${err.response.statusText || "Registration failed"}`
          : err?.message || "Registration failed. Please check your information.");
      setServerError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#F8FAFC]">
      {/* Left Panel: Slate Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-[#FF6B00] mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Join 10,000+ Fast-Growing Tech Candidates</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FB923C] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-[#FF6B00]/25">
              AI
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">TalentStream ATS</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Build your smart profile. Get discovered by modern tech employers.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Create an ATS-optimized candidate profile with structured education, experience, validated skills, and cloud-stored resumes.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-extrabold text-[#FF6B00]">1-Click</div>
              <div className="text-xs text-slate-400 mt-1">Direct Cloud Resume Upload</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-2xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1">Data Ownership & Privacy</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 TalentStream AI ATS. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-elevated p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select your role to get started with the recruitment platform
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selection Cards */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Choose Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue("role", "JOB_SEEKER")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all duration-150 flex flex-col justify-between gap-3",
                    selectedRole === "JOB_SEEKER"
                      ? "border-[#FF6B00] bg-orange-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                      selectedRole === "JOB_SEEKER"
                        ? "bg-[#FF6B00] text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Job Seeker</div>
                    <div className="text-xs text-slate-500 mt-0.5">Find jobs & upload resumes</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setValue("role", "HR")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all duration-150 flex flex-col justify-between gap-3",
                    selectedRole === "HR"
                      ? "border-[#FF6B00] bg-orange-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                      selectedRole === "HR"
                        ? "bg-[#FF6B00] text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Recruiter / HR</div>
                    <div className="text-xs text-slate-500 mt-0.5">Post jobs & review candidates</div>
                  </div>
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              placeholder="Jane Doe"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.full_name?.message}
              {...register("full_name")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jane@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-3"
              isLoading={isSubmitting}
            >
              Create Account <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#FF6B00] hover:text-[#E55F00] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
