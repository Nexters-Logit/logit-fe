"use client";

import { Home, AlertCircle } from "lucide-react";

type SectionKind = "text" | "home" | "alert";

interface Section {
  id: string;
  label: string;
  kind?: SectionKind;
}

interface ScrollTrackerProps {
  sections: Section[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function ScrollTracker({ sections, activeId, onNavigate }: ScrollTrackerProps) {
  return (
    <div className="hidden sm:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 items-center gap-0.5 bg-white rounded-full px-2 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.18)]">
      {sections.map(({ id, label, kind = "text" }) => {
        const isActive = activeId === id;
        const isIcon = kind !== "text";

        if (isIcon) {
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              title={label}
              className={`size-7 flex items-center justify-center rounded-full transition-all duration-200 ${
                isActive
                  ? kind === "home"
                    ? "bg-primary-50 text-primary-200"
                    : "bg-gray-400 text-white"
                  : "text-gray-100 hover:text-gray-300"
              }`}
            >
              {kind === "home"
                ? <Home className="size-3.5" strokeWidth={2} />
                : <AlertCircle className="size-3.5" strokeWidth={2} />
              }
            </button>
          );
        }

        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className={`px-3.5 py-1.5 rounded-full text-body-9-1 transition-all duration-200 ${
              isActive
                ? "bg-primary-200 text-white shadow-sm"
                : "text-gray-200 hover:text-gray-400"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
