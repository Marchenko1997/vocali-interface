import { useRef } from "react";
import type { VisualizerMode } from "../../constants/studioConfig";

interface ModeSwitcherProps {
  modes: { id: VisualizerMode; label: string; icon: string }[];
  activeMode: VisualizerMode;
  onChange: (mode: VisualizerMode) => void;
}

export const ModeSwitcher = ({
  modes,
  activeMode,
  onChange,
}: ModeSwitcherProps) => {
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
      className="overflow-x-auto scrollbar-none pt-1 pb-3"
    >
      <div className="flex gap-2 px-4 w-max mx-auto lg:justify-center lg:w-auto lg:px-6">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              transition-all duration-200 whitespace-nowrap flex-shrink-0
              ${
                activeMode === m.id
                  ? "bg-white/15 text-white border border-white/30"
                  : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10 hover:text-white/60"
              }
            `}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
