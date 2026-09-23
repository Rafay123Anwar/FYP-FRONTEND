import React, { useState, useRef, useEffect } from "react";
import { Plus, X, Search, Check, Sparkles, AlertCircle } from "lucide-react";
import { CURATED_SKILLS } from "@/lib/constants/pakistanData";
import { cn } from "@/lib/utils";
import type { CandidateSkillOut } from "@/api/profile";

interface SkillsSelectProps {
  skills: CandidateSkillOut[];
  onAddSkill: (skillName: string) => Promise<void>;
  onDeleteSkill: (skillId: number) => Promise<void>;
  isAdding: boolean;
}

export const SkillsSelect: React.FC<SkillsSelectProps> = ({
  skills,
  onAddSkill,
  onDeleteSkill,
  isAdding,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set of already added skill names (lowercase)
  const existingNames = new Set(skills.map((s) => s.skill.name.toLowerCase()));

  // Filter available skills that are not already added
  const filteredSuggestions = CURATED_SKILLS.filter(
    (skill) =>
      !existingNames.has(skill.toLowerCase()) &&
      skill.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleSelectSkill = async (skillName: string) => {
    setValidationError(null);
    if (existingNames.has(skillName.toLowerCase())) {
      setValidationError(`'${skillName}' is already added.`);
      return;
    }

    try {
      await onAddSkill(skillName);
      setQuery("");
      setIsOpen(false);
    } catch (err: any) {
      setValidationError(err?.response?.data?.detail || "Failed to add skill.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      // Find exact or closest match in CURATED_SKILLS
      const exactMatch = CURATED_SKILLS.find(
        (s) => s.toLowerCase() === trimmed.toLowerCase()
      );

      if (exactMatch) {
        handleSelectSkill(exactMatch);
      } else if (filteredSuggestions.length > 0) {
        handleSelectSkill(filteredSuggestions[0]);
      } else {
        setValidationError(
          "Please select a verified professional skill from the suggestions (e.g., Python, React, AWS)."
        );
      }
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Search & Suggestions Input */}
      <div className="relative">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
          Search & Add Skills
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            className={cn(
              "w-full pl-10 pr-24 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent disabled:bg-slate-50",
              validationError && "border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20"
            )}
            placeholder="Type e.g., Python, React, Docker, Machine Learning..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setValidationError(null);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={isAdding}
          />

          <div className="absolute inset-y-0 right-1.5 flex items-center">
            <button
              type="button"
              disabled={isAdding || !query.trim()}
              onClick={() => {
                const trimmed = query.trim();
                const match = CURATED_SKILLS.find(
                  (s) => s.toLowerCase() === trimmed.toLowerCase()
                );
                if (match) {
                  handleSelectSkill(match);
                } else if (filteredSuggestions.length > 0) {
                  handleSelectSkill(filteredSuggestions[0]);
                } else {
                  setValidationError(
                    "Please select a verified professional skill from the suggestions."
                  );
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#FF6B00] text-white text-xs font-semibold hover:bg-[#E55F00] transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Dropdown Suggestions */}
        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
              <span>Verified Industry Skills</span>
              <span className="text-[10px] text-[#FF6B00]">Select from list</span>
            </div>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.slice(0, 30).map((skillName) => (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => handleSelectSkill(skillName)}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-[#FF6B00] flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">{skillName}</span>
                  <Plus className="w-3 h-3 text-slate-400 group-hover:text-[#FF6B00]" />
                </button>
              ))
            ) : (
              <div className="px-3.5 py-3 text-xs text-slate-400 text-center">
                No matching verified skill found. Try searching e.g., "Python", "FastAPI", "AWS".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Skills Tags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">
            Active Skills on Profile ({skills.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Click <X className="inline w-2.5 h-2.5" /> to remove
          </span>
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 min-h-[56px] items-center">
            {skills.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-orange-200 text-slate-800 text-xs font-semibold shadow-xs hover:border-[#FF6B00] transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#FF6B00]" />
                {s.skill.name}
                <button
                  type="button"
                  onClick={() => onDeleteSkill(s.id)}
                  title={`Remove ${s.skill.name}`}
                  className="p-0.5 text-slate-400 hover:text-rose-500 rounded transition-colors focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-xs">
            No verified skills added yet. Use the search input above to add your primary technologies.
          </div>
        )}
      </div>
    </div>
  );
};
