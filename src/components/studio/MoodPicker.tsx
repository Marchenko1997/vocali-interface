
import { useRef } from "react";
import type { MoodConfig } from "../../constants/studioConfig";

interface MoodPickerProps {
  moods: MoodConfig[];
  activeMood: string;
  onChange: (mood: MoodConfig) => void;
}

export const MoodPicker = ({
  moods,
  activeMood,
  onChange,
}: MoodPickerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    e.preventDefault();
    el.scrollLeft += e.deltaY;
  };

  return (
    <div
      ref={scrollRef}
      onWheel={handleWheel}
      className="overflow-x-auto scrollbar-none py-2"
    >
      <div className="flex gap-2 px-4 w-max mx-auto lg:justify-center lg:w-auto lg:flex-wrap lg:px-6 lg:gap-3">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onChange(mood)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 lg:px-4 lg:py-2"
            style={
              activeMood === mood.id
                ? {
                    background: "rgba(168,85,247,0.18)",
                    border: "1px solid rgba(168,85,247,0.45)",
                    color: "rgba(216,180,254,0.95)",
                    boxShadow: "0 0 14px rgba(168,85,247,0.2)",
                    backdropFilter: "blur(8px)",
                    transform: "scale(1.05)",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.35)",
                  }
            }
            onMouseEnter={(e) => {
              if (activeMood !== mood.id) {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeMood !== mood.id) {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "rgba(255,255,255,0.35)";
              }
            }}
          >
            <span>{mood.icon}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
