import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/candidate/dashboard";

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail || "Invalid email or password. Please check your credentials.";
      setServerError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#F8FAFC]">
      {/* Left Panel: Slate Branding & Value Props */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-[#FF6B00] mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Next-Generation AI ATS Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FB923C] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-[#FF6B00]/25">
              AI
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">TalentStream ATS</h1>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
              Accelerate your hiring journey with intelligent automation.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Connect top job seekers with leading enterprises through AI-powered resume matching, unbiased skill scoring, and instant workflow pipelines.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              "1000+ Concurrent High-Throughput Matching Pipeline",
              "Automated Cloud Resume Parsing & Skill Extraction",
              "Role-Based Access Control & Strict Tenant Isolation",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Security badge */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Enterprise-grade encryption and Supabase cloud infrastructure</span>
        </div>
      </div>

      {/* Right Panel: Clean White Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-elevated p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B00] mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Enter your credentials to access your candidate workspace
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-[#FF6B00] hover:text-[#E55F00] transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#FF6B00] hover:text-[#E55F00] transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
