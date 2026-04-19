export type VisualizerMode = "spectrum" | "wave" | "circle" | "particles";

export interface MoodConfig {
  id: string;
  label: string;
  icon: string;
  mode: VisualizerMode;
  hueBase: number;
  hueRange: number;
  saturation: number;
  glowColor: string;
  bgAlpha: number;
}

export const MOODS: MoodConfig[] = [
  {
    id: "chill",
    label: "Chill",
    icon: "🌙",
    mode: "wave",
    hueBase: 200,
    hueRange: 60,
    saturation: 70,
    glowColor: "100, 160, 255",
    bgAlpha: 0.2,
  },
  {
    id: "party",
    label: "Party",
    icon: "🔥",
    mode: "particles",
    hueBase: 0,
    hueRange: 50,
    saturation: 100,
    glowColor: "255, 80, 40",
    bgAlpha: 0.15,
  },
  {
    id: "focus",
    label: "Focus",
    icon: "🧠",
    mode: "spectrum",
    hueBase: 140,
    hueRange: 40,
    saturation: 65,
    glowColor: "60, 220, 160",
    bgAlpha: 0.25,
  },
  {
    id: "dark",
    label: "Dark",
    icon: "🌑",
    mode: "circle",
    hueBase: 270,
    hueRange: 40,
    saturation: 80,
    glowColor: "160, 60, 255",
    bgAlpha: 0.12,
  },
];

export const MODES: { id: VisualizerMode; label: string; icon: string }[] = [
  { id: "spectrum", label: "Spectrum", icon: "📊" },
  { id: "wave", label: "Wave", icon: "🌊" },
  { id: "circle", label: "Circle", icon: "🔵" },
  { id: "particles", label: "Particles", icon: "✨" },
];
