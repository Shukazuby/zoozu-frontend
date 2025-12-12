"use client";
import { useState, useRef, useEffect } from "react";

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (option: string) => void;
};

export default function FilterDropdown({ label, options, selected, onSelect }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-yellow-500"
      >
        {selected || label} <span aria-hidden className={`transition ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded border border-slate-200 bg-white shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition ${
                  selected === option
                    ? "bg-yellow-50 text-yellow-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

