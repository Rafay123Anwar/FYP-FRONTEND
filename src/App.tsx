import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { CandidateLayout } from "@/components/layout/CandidateLayout";
import { Dashboard } from "@/pages/candidate/Dashboard";
import { ProfileBuilder } from "@/pages/candidate/ProfileBuilder";
import { ResumeUpload } from "@/pages/candidate/ResumeUpload";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 min: don't refetch if data is fresh
      gcTime: 10 * 60 * 1000,          // 10 min: keep inactive data in memory
      refetchOnWindowFocus: false,      // no surprise refetches on tab focus
      refetchOnReconnect: true,         // do refetch when network reconnects
      retry: 1,                         // one retry on failure
      networkMode: "always",            // don't pause offline — let server decide
    },
    mutations: {
      retry: 0,                         // mutations (login/register) fail immediately
      networkMode: "always",
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Candidate Portal Routes */}
            <Route
              path="/candidate"
              element={
                <ProtectedRoute allowedRoles={["JOB_SEEKER", "HR", "COMPANY_ADMIN", "SUPER_ADMIN"]}>
                  <CandidateLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/candidate/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<ProfileBuilder />} />
              <Route path="resumes" element={<ResumeUpload />} />
            </Route>

            {/* Root fallback */}
            <Route path="/" element={<Navigate to="/candidate/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/candidate/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default App;
