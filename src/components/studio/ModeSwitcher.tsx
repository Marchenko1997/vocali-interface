import type { VisualizerMode } from "../../constants/studioConfig";

interface ModeSwitcherProps {
  modes: { id: VisualizerMode; label: string; icon: string }[];
  activeMode: VisualizerMode;
  onChange: (mode: VisualizerMode) => void;
}

export const ModeSwitcher = ({ modes, activeMode, onChange }: ModeSwitcherProps) => (
  <div className="flex justify-center gap-2 pt-1 pb-3">
    {modes.map((m) => (
      <button
        key={m.id}
        onClick={() => onChange(m.id)}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
          transition-all duration-200
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
);
