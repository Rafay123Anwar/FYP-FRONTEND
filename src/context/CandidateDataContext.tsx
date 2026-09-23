import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFullCandidateProfile, type CandidateFullProfileOut } from "@/api/profile";
import { listResumes, type ResumeOut } from "@/api/resume";
import { useAuth } from "./AuthContext";

interface CandidateDataContextType {
  fullProfile: CandidateFullProfileOut | null;
  resumes: ResumeOut[];
  isLoading: boolean;
  isFetching: boolean;
  isRefreshing: boolean;
  error: string | null;
  refreshProfile: (silent?: boolean) => Promise<CandidateFullProfileOut | null>;
  refreshResumes: (silent?: boolean) => Promise<ResumeOut[]>;
  updateFullProfile: (updater: (prev: CandidateFullProfileOut | null) => CandidateFullProfileOut | null) => void;
  updateResumes: (updater: (prev: ResumeOut[]) => ResumeOut[]) => void;
}

const CandidateDataContext = createContext<CandidateDataContextType | undefined>(undefined);

export const CandidateDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery<CandidateFullProfileOut | null>({
    queryKey: ["profile", "full"],
    queryFn: getFullCandidateProfile,
    enabled: isAuthenticated && Boolean(user),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const resumesQuery = useQuery<ResumeOut[]>({
    queryKey: ["resumes"],
    queryFn: listResumes,
    enabled: isAuthenticated && Boolean(user),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const refreshProfile = useCallback(async (_silent = true): Promise<CandidateFullProfileOut | null> => {
    const result = await profileQuery.refetch();
    return result.data ?? null;
  }, [profileQuery]);

  const refreshResumes = useCallback(async (_silent = true): Promise<ResumeOut[]> => {
    const result = await resumesQuery.refetch();
    return result.data ?? [];
  }, [resumesQuery]);

  const updateFullProfile = useCallback(
    (updater: (prev: CandidateFullProfileOut | null) => CandidateFullProfileOut | null) => {
      queryClient.setQueryData<CandidateFullProfileOut | null>(["profile", "full"], (old) => updater(old ?? null));
    },
    [queryClient]
  );

  const updateResumes = useCallback(
    (updater: (prev: ResumeOut[]) => ResumeOut[]) => {
      queryClient.setQueryData<ResumeOut[]>(["resumes"], (old) => updater(old ?? []));
      queryClient.setQueryData<CandidateFullProfileOut | null>(["profile", "full"], (old) => {
        if (!old) return old;
        return { ...old, resumes: updater(old.resumes ?? []) };
      });
    },
    [queryClient]
  );

  const error = (profileQuery.error as any)?.message || (resumesQuery.error as any)?.message || null;

  return (
    <CandidateDataContext.Provider
      value={{
        fullProfile: profileQuery.data ?? null,
        resumes: resumesQuery.data ?? [],
        isLoading: profileQuery.isLoading || resumesQuery.isLoading,
        isFetching: profileQuery.isFetching || resumesQuery.isFetching,
        isRefreshing: profileQuery.isFetching || resumesQuery.isFetching,
        error,
        refreshProfile,
        refreshResumes,
        updateFullProfile,
        updateResumes,
      }}
    >
      {children}
    </CandidateDataContext.Provider>
  );
};

export const useCandidateData = () => {
  const context = useContext(CandidateDataContext);
  if (!context) {
    throw new Error("useCandidateData must be used within a CandidateDataProvider");
  }
  return context;
};
