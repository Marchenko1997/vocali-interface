export type VisualizerMode =
  | "spectrum"
  | "wave"
  | "circle"
  | "particles"
  | "tunnel"
  | "lissajous";

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

  {
    id: "hiphop",
    label: "Hip-Hop",
    icon: "🎤",
    mode: "spectrum",
    hueBase: 30,
    hueRange: 40,
    saturation: 85,
    glowColor: "255, 140, 0",
    bgAlpha: 0.18,
  },
  {
    id: "jazz",
    label: "Jazz",
    icon: "🎷",
    mode: "wave",
    hueBase: 40,
    hueRange: 30,
    saturation: 55,
    glowColor: "200, 160, 80",
    bgAlpha: 0.22,
  },
  {
    id: "classical",
    label: "Classical",
    icon: "🎻",
    mode: "wave",
    hueBase: 45,
    hueRange: 20,
    saturation: 40,
    glowColor: "220, 200, 140",
    bgAlpha: 0.28,
  },
  {
    id: "rock",
    label: "Rock",
    icon: "🎸",
    mode: "spectrum",
    hueBase: 0,
    hueRange: 30,
    saturation: 90,
    glowColor: "255, 40, 40",
    bgAlpha: 0.14,
  },

  {
    id: "techno",
    label: "Techno",
    icon: "⚙️",
    mode: "circle",
    hueBase: 20,
    hueRange: 20,
    saturation: 50,
    glowColor: "180, 120, 80",
    bgAlpha: 0.12,
  },
  {
    id: "dnb",
    label: "DnB",
    icon: "💧",
    mode: "particles",
    hueBase: 190,
    hueRange: 70,
    saturation: 75,
    glowColor: "60, 180, 255",
    bgAlpha: 0.16,
  },
  {
    id: "psytrance",
    label: "Psytrance",
    icon: "🚀",
    mode: "spectrum",
    hueBase: 280,
    hueRange: 80,
    saturation: 90,
    glowColor: "200, 80, 255",
    bgAlpha: 0.14,
  },
  {
    id: "lofi",
    label: "Lo-Fi",
    icon: "☕",
    mode: "wave",
    hueBase: 35,
    hueRange: 25,
    saturation: 45,
    glowColor: "180, 140, 100",
    bgAlpha: 0.3,
  },
];

export const MODES: { id: VisualizerMode; label: string; icon: string }[] = [
  { id: "spectrum", label: "Spectrum", icon: "📊" },
  { id: "wave", label: "Wave", icon: "🌊" },
  { id: "circle", label: "Circle", icon: "🔵" },
  { id: "particles", label: "Particles", icon: "✨" },
  { id: "tunnel", label: "Tunnel", icon: "🌀" },
  { id: "lissajous", label: "Lissajous", icon: "〰️" },
];
