import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CandidateDataProvider } from "@/context/CandidateDataContext";
import { cn } from "@/lib/utils";

export const CandidateLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/candidate/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile Builder",
      path: "/candidate/profile",
      icon: User,
    },
    {
      label: "Resume & Documents",
      path: "/candidate/resumes",
      icon: FileText,
    },
  ];

  return (
    <CandidateDataProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center font-bold text-white text-sm">
            AI
          </div>
          <span className="font-bold text-white text-base">TalentStream</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-64 bg-[#0F172A] text-slate-300 flex-col justify-between shrink-0 border-r border-slate-800/80 p-5 md:flex",
          mobileMenuOpen ? "flex fixed inset-y-0 left-0 z-50" : "hidden"
        )}
      >
        <div>
          {/* Brand */}
          <div className="hidden md:flex items-center gap-2.5 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center font-black text-white shadow-md shadow-[#FF6B00]/20">
              AI
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-none">TalentStream</div>
              <div className="text-[11px] text-slate-400 mt-1">Candidate Portal</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-[#FF6B00] text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-slate-800/80 mt-auto">
          <div className="flex items-center gap-3 px-2 py-2 mb-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF6B00] flex items-center justify-center font-bold text-xs">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user?.full_name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
    </CandidateDataProvider>
  );
};
