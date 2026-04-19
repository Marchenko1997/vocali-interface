import type { MoodConfig } from "../../constants/studioConfig";

interface MoodPickerProps {
  moods: MoodConfig[];
  activeMood: string;
  onChange: (mood: MoodConfig) => void;
}

export const MoodPicker = ({ moods, activeMood, onChange }: MoodPickerProps) => (
  <div className="flex justify-center gap-3 pb-2">
    {moods.map((mood) => (
      <button
        key={mood.id}
        onClick={() => onChange(mood)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          transition-all duration-300
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
);
