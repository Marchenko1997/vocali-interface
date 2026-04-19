import { useRef, useState, useCallback } from "react";
import type { AudioAnalyzerData } from "./useAudioAnalyzer";
import {
  MOODS,
  type MoodConfig,
  type VisualizerMode,
} from "../constants/studioConfig";

// ── SPECTRUM ──────────────────────────────────────────────
function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  frequencyData: Uint8Array,
  bass: number,
  mood: MoodConfig,
) {
  const barCount = 128;
  const barWidth = W / barCount;

  for (let i = 0; i < barCount; i++) {
    const value = frequencyData[i] / 255;
    const barH = value * H * 0.8;
    const x = i * barWidth;
    const hue = mood.hueBase + (i / barCount) * mood.hueRange + bass * 30;
    const lightness = 40 + value * 40;

    ctx.shadowBlur = value * 12;
    ctx.shadowColor = `hsl(${hue}, ${mood.saturation}%, 60%)`;
    ctx.fillStyle = `hsl(${hue}, ${mood.saturation}%, ${lightness}%)`;
    ctx.fillRect(x, H / 2 - barH / 2, barWidth - 1, barH);
  }
  ctx.shadowBlur = 0;
}

// ── WAVE ──────────────────────────────────────────────────
function drawWave(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  timeData: Uint8Array,
  volume: number,
  mood: MoodConfig,
) {
  const hue = mood.hueBase + volume * mood.hueRange;

  ctx.lineWidth = 2 + volume * 4;
  ctx.strokeStyle = `hsl(${hue}, ${mood.saturation}%, 60%)`;
  ctx.shadowBlur = 10 + volume * 30;
  ctx.shadowColor = `rgba(${mood.glowColor}, ${0.6 + volume * 0.4})`;

  ctx.beginPath();
  const sliceWidth = W / timeData.length;
  let x = 0;

  for (let i = 0; i < timeData.length; i++) {
    const v = timeData[i] / 128.0;
    const y = (v * H) / 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    x += sliceWidth;
  }

  ctx.lineTo(W, H / 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

// ── CIRCLE ────────────────────────────────────────────────
function drawCircle(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  frequencyData: Uint8Array,
  bass: number,
  volume: number,
  mood: MoodConfig,
) {
  const cx = W / 2;
  const cy = H / 2;
  const baseRadius = Math.min(W, H) * 0.2 + bass * 40;
  const barCount = 128;

  ctx.beginPath();
  ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(${mood.hueBase + bass * 30}, ${mood.saturation}%, 60%, 0.4)`;
  ctx.lineWidth = 2;
  ctx.shadowBlur = 20 + bass * 40;
  ctx.shadowColor = `rgba(${mood.glowColor}, 0.8)`;
  ctx.stroke();
  ctx.shadowBlur = 0;

  for (let i = 0; i < barCount; i++) {
    const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
    const value = frequencyData[i] / 255;
    const barH = value * Math.min(W, H) * 0.25;

    const x1 = cx + Math.cos(angle) * baseRadius;
    const y1 = cy + Math.sin(angle) * baseRadius;
    const x2 = cx + Math.cos(angle) * (baseRadius + barH);
    const y2 = cy + Math.sin(angle) * (baseRadius + barH);

    const hue = mood.hueBase + (i / barCount) * mood.hueRange + volume * 20;
    ctx.strokeStyle = `hsl(${hue}, ${mood.saturation}%, ${40 + value * 40}%)`;
    ctx.lineWidth = (W / barCount) * 0.7;
    ctx.shadowBlur = value * 15;
    ctx.shadowColor = `rgba(${mood.glowColor}, ${value})`;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

export function useVisualizer(
  getAnalyzerData: () => AudioAnalyzerData,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  sensitivity: number = 1, 
) {
  const [mode, setMode] = useState<VisualizerMode>("spectrum");
  const [activeMood, setActiveMood] = useState<string>("chill");
  const modeRef = useRef<VisualizerMode>("wave");
  const moodRef = useRef<MoodConfig>(MOODS[0]);
  const sensitivityRef = useRef(sensitivity);

  
  sensitivityRef.current = sensitivity;

  const handleModeChange = useCallback((m: VisualizerMode) => {
    modeRef.current = m;
    setMode(m);
  }, []);

  const handleMoodChange = useCallback((mood: MoodConfig) => {
    moodRef.current = mood;
    setActiveMood(mood.id);
    modeRef.current = mood.mode;
    setMode(mood.mode);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { frequencyData, timeData, bass, volume } = getAnalyzerData();
    const W = canvas.width;
    const H = canvas.height;
    const mood = moodRef.current;
    const s = sensitivityRef.current;

    ctx.fillStyle = `rgba(10, 10, 20, ${mood.bgAlpha})`;
    ctx.fillRect(0, 0, W, H);

    if (frequencyData.length > 0) {
      
      const scaledFreq = new Uint8Array(
        frequencyData.map((v) => Math.min(255, v * s)),
      );
      const scaledBass = Math.min(1, bass * s);
      const scaledVolume = Math.min(1, volume * s);

      const currentMode = modeRef.current;
      if (currentMode === "spectrum") {
        drawSpectrum(ctx, W, H, scaledFreq, scaledBass, mood);
      } else if (currentMode === "wave") {
        drawWave(ctx, W, H, timeData, scaledVolume, mood);
      } else if (currentMode === "circle") {
        drawCircle(ctx, W, H, scaledFreq, scaledBass, scaledVolume, mood);
      }
    }
  }, [getAnalyzerData, canvasRef]);

  return {
    draw,
    mode,
    setMode: handleModeChange,
    activeMood,
    handleMoodChange,
    moodRef,
    modeRef,
  };
}
