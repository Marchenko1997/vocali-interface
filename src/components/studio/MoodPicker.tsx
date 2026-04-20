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
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) return;
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
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-300 whitespace-nowrap flex-shrink-0
              lg:px-4 lg:py-2
              ${
                activeMood === mood.id
                  ? "bg-white/20 text-white border border-white/40 scale-105"
                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70"
              }
            `}
          >
            <span>{mood.icon}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
