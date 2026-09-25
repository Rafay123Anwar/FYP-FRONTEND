import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, User, FileText, LogOut, Menu, X,
  Sun, Moon, ChevronRight, Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CandidateDataProvider } from "@/context/CandidateDataContext";
import { cn } from "@/lib/utils";

const BRAND_LABEL = "TalentStream";
const BRAND_SUB   = "Candidate Portal";

const NAV_ITEMS = [
  { label: "Dashboard",          path: "/candidate/dashboard", icon: LayoutDashboard },
  { label: "Profile Builder",    path: "/candidate/profile",   icon: User },
  { label: "Resume & Documents", path: "/candidate/resumes",   icon: FileText },
];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return [dark, setDark] as const;
}

export const CandidateLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useDarkMode();

  const handleLogout = () => { logout(); navigate("/login"); };
  const currentPage = NAV_ITEMS.find((n) => location.pathname.startsWith(n.path));

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const initials = user?.full_name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <CandidateDataProvider>
      <div className="min-h-screen flex bg-[var(--color-bg)]">

        {/* ── Mobile Overlay ── */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col w-[260px]",
            "bg-[#0F172A] border-r border-white/[0.06] transition-transform duration-300",
            "md:static md:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          {/* Brand */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FB923C] flex items-center justify-center font-black text-white shadow-lg shadow-orange-500/30 shrink-0">
              AI
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-[15px] tracking-tight leading-none">{BRAND_LABEL}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{BRAND_SUB}</div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">
              Navigation
            </p>
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn("nav-item group", isActive && "active")}
                >
                  <Icon className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-500"
                  )} />
                  <span>{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                </Link>
              );
            })}
          </nav>

          {/* User Card */}
          <div className="px-3 pb-5 border-t border-white/[0.06] pt-4 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/[0.06]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-orange-400/20 border border-[#FF6B00]/40 text-[#FF6B00] flex items-center justify-center font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.full_name}</div>
                <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Area ── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

          {/* Top Header */}
          <header
            className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 h-14 border-b shrink-0"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 dark:text-slate-500 hidden sm:block font-medium">{BRAND_LABEL}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:block" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {currentPage?.label ?? "Dashboard"}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
                title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              </button>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-orange-400/20 border border-[#FF6B00]/40 text-[#FF6B00] flex items-center justify-center font-bold text-xs ml-1">
                {initials}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-fade-in-up">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </CandidateDataProvider>
  );
};
