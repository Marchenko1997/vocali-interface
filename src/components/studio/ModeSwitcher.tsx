
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
        {modes.map((m) => {
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 overflow-hidden focus:outline-none"
              style={{
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                ...(isActive
                  ? {
                      background: "rgba(236,72,153,0.18)",
                      border: "1px solid rgba(236,72,153,0.5)",
                      color: "rgba(251,191,217,1)",
                      boxShadow:
                        "0 0 16px rgba(236,72,153,0.25), 0 0 4px rgba(236,72,153,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.28)",
                      boxShadow: "none",
                    }),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(236,72,153,0.08)";
                  e.currentTarget.style.borderColor = "rgba(236,72,153,0.2)";
                  e.currentTarget.style.color = "rgba(251,191,217,0.6)";
                  e.currentTarget.style.boxShadow =
                    "0 0 8px rgba(236,72,153,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.28)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
          
              {isActive && (
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                  }}
                />
              )}
              <span className="relative z-10">{m.icon}</span>
              <span className="relative z-10">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
