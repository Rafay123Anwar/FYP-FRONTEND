import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableComboboxProps {
  label?: string;
  placeholder?: string;
  options: readonly string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  label,
  placeholder = "Search or type...",
  options,
  value,
  onChange,
  error,
  helperText,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal query with external value changes
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = query.trim()
    ? options.filter((opt) => opt.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = (option: string) => {
    setQuery(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
  };

  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            className={cn(
              "w-full pl-10 pr-16 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent",
              error && "border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20"
            )}
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
          />

          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md focus:outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md focus:outline-none"
            >
              <ChevronDown
                className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors",
                      isSelected ? "bg-orange-50/80 text-[#FF6B00] font-bold" : "text-slate-700"
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3.5 py-2.5 text-xs text-slate-400 italic">
                Press Enter or click to use "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
