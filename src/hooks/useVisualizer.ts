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
// Central pulsing ring with radial frequency bars. Ring radius grows with bass.
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

// ── PARTICLES ─────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

function spawnParticles(
  particles: Particle[],
  W: number,
  H: number,
  bass: number,
  volume: number,
  mood: MoodConfig,
) {
  if (bass < 0.15) return;
  const count = Math.floor(bass * 30 + volume * 10);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * bass * 6;
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * 40,
      y: H / 2 + (Math.random() - 0.5) * 40,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      hue: mood.hueBase + Math.random() * mood.hueRange,
      size: 1.5 + Math.random() * bass * 4,
    });
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  particles: Particle[],
  bass: number,
  volume: number,
  mood: MoodConfig,
) {
  spawnParticles(particles, W, H, bass, volume, mood);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= 0.018;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, ${mood.saturation}%, 65%, ${p.life})`;
    ctx.shadowBlur = 6 + bass * 10;
    ctx.shadowColor = `rgba(${mood.glowColor}, ${p.life * 0.8})`;
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

// ── TUNNEL ────────────────────────────────────────────────
// Concentric rings flying toward the viewer from a vanishing point.
// Ring spacing and speed pulse with bass. Each ring maps to a frequency band.
function drawTunnel(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  frequencyData: Uint8Array,
  bass: number,
  volume: number,
  mood: MoodConfig,
  time: number,
) {
  const cx = W / 2;
  const cy = H / 2;
  const ringCount = 12;
  const maxRadius = Math.sqrt(cx * cx + cy * cy) * 1.2;

  // Each ring flies outward — offset driven by time and bass kick
  const speed = 0.4 + bass * 1.2;

  for (let i = 0; i < ringCount; i++) {
    // Rings are evenly spaced and scroll outward over time
    const t = (time * speed + i / ringCount) % 1;
    // Perspective scale: rings near center are small, near edge are large
    const radius = t * maxRadius;
    const alpha = t * (0.3 + volume * 0.4);

    // Map ring index to a frequency bucket for color reactivity
    const freqIndex = Math.floor((i / ringCount) * 64);
    const freqValue = frequencyData[freqIndex] / 255;
    const hue = mood.hueBase + t * mood.hueRange + freqValue * 40;
    const lightness = 35 + freqValue * 35;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${hue}, ${mood.saturation}%, ${lightness}%, ${alpha})`;
    ctx.lineWidth = 1.5 + freqValue * 3;
    ctx.shadowBlur = 8 + freqValue * 20 + bass * 15;
    ctx.shadowColor = `rgba(${mood.glowColor}, ${alpha})`;
    ctx.stroke();
  }

  // Vanishing point cross-hair that pulses with bass
  const crossSize = 4 + bass * 12;
  ctx.strokeStyle = `rgba(${mood.glowColor}, ${0.3 + bass * 0.5})`;
  ctx.lineWidth = 1;
  ctx.shadowBlur = bass * 20;
  ctx.shadowColor = `rgba(${mood.glowColor}, 0.8)`;
  ctx.beginPath();
  ctx.moveTo(cx - crossSize, cy);
  ctx.lineTo(cx + crossSize, cy);
  ctx.moveTo(cx, cy - crossSize);
  ctx.lineTo(cx, cy + crossSize);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

// ── LISSAJOUS ─────────────────────────────────────────────
// Classic oscilloscope Lissajous figure: X axis = left channel (even samples),
// Y axis = right channel (odd samples). When mono, we offset phase by π/2
// to still get a visible figure. Frequency ratios shift with bass.
function drawLissajous(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  timeData: Uint8Array,
  bass: number,
  volume: number,
  mood: MoodConfig,
  time: number,
) {
  const cx = W / 2;
  const cy = H / 2;
 
  const radius = Math.min(W, H) * 0.46;
  const sampleCount = timeData.length;

  const a = 3;
  const b = 2 + Math.sin(time * 0.3) * (0.5 + bass * 1.5);
  const phaseShift = time * 0.5 + bass * Math.PI;

  ctx.beginPath();
  for (let i = 0; i < sampleCount; i++) {
    const sample = (timeData[i] - 128) / 128;
    const t = (i / sampleCount) * Math.PI * 2;

   
    const amplitude = 0.7 + volume * 0.3;
    const x = cx + Math.sin(a * t + phaseShift) * radius * amplitude;
    const y = cy + Math.sin(b * t) * radius * amplitude * 0.85 + sample * radius * 0.15;

    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();

  const hue = mood.hueBase + volume * mood.hueRange;
  // Линия толще — с 1.5 до 2.5 базово
  ctx.lineWidth = 2.5 + volume * 3;
  ctx.strokeStyle = `hsla(${hue}, ${mood.saturation}%, 60%, ${0.6 + volume * 0.4})`;
  ctx.shadowBlur = 16 + volume * 30 + bass * 25;
  ctx.shadowColor = `rgba(${mood.glowColor}, 0.8)`;
  ctx.stroke();

 
  ctx.beginPath();
  for (let i = 0; i < sampleCount; i++) {
    const sample = (timeData[i] - 128) / 128;
    const t = (i / sampleCount) * Math.PI * 2;
  
    const amplitude = 0.5 + volume * 0.25;
    const x = cx + Math.sin(a * t + phaseShift + 0.5) * radius * amplitude;
    const y = cy + Math.sin(b * t + 0.3) * radius * amplitude * 0.85 + sample * radius * 0.12;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.lineWidth = 1.5 + volume * 1.5;
  ctx.strokeStyle = `hsla(${hue + 40}, ${mood.saturation}%, 70%, ${0.25 + volume * 0.25})`;
  ctx.shadowBlur = 8 + bass * 10;
  ctx.stroke();


  ctx.beginPath();
  for (let i = 0; i < sampleCount; i++) {
    const t = (i / sampleCount) * Math.PI * 2;
    const amplitude = 0.72 + volume * 0.28;
    const x = cx + Math.sin(a * t + phaseShift - 0.3) * radius * amplitude;
    const y = cy + Math.sin(b * t - 0.2) * radius * amplitude * 0.85;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = `hsla(${hue - 30}, ${mood.saturation}%, 80%, ${0.1 + bass * 0.2})`;
  ctx.shadowBlur = 4;
  ctx.stroke();

  ctx.shadowBlur = 0;
}

// ── BPM DETECTOR ──────────────────────────────────────────
// Detects beats via local maxima in a sliding bass window.
// More reliable than threshold crossing when bass is consistently high.
interface BpmState {
  history: number[];
  lastPeakTime: number;
  intervals: number[];
  smoothedBpm: number;
}

const PEAK_WINDOW = 5;
const BPM_MIN_INTERVAL = 300;
const BPM_MAX_INTERVAL = 1200;
const BPM_NOISE_FLOOR = 0.3;
const BPM_HISTORY_SIZE = 8;
const BPM_SMOOTH_FACTOR = 0.2;

function detectBpm(state: BpmState, bass: number): number {
  const now = performance.now();

  state.history.push(bass);
  const windowSize = PEAK_WINDOW * 2 + 1;
  if (state.history.length > windowSize) state.history.shift();
  if (state.history.length < windowSize) return Math.round(state.smoothedBpm);

  const center = state.history[PEAK_WINDOW];

  const isLocalMax =
    state.history.slice(0, PEAK_WINDOW).every((v) => center > v) &&
    state.history.slice(PEAK_WINDOW + 1).every((v) => center > v);

  const aboveNoise = center > BPM_NOISE_FLOOR;
  const cooldownOk = now - state.lastPeakTime > BPM_MIN_INTERVAL;

  if (isLocalMax && aboveNoise && cooldownOk) {
    const interval = now - state.lastPeakTime;
    state.lastPeakTime = now;

    if (interval < BPM_MAX_INTERVAL) {
      state.intervals.push(interval);
      if (state.intervals.length > BPM_HISTORY_SIZE) state.intervals.shift();

      if (state.intervals.length >= 3) {
        const avg =
          state.intervals.reduce((a, b) => a + b, 0) / state.intervals.length;
        const raw = 60000 / avg;

        state.smoothedBpm =
          state.smoothedBpm === 0
            ? raw
            : state.smoothedBpm + (raw - state.smoothedBpm) * BPM_SMOOTH_FACTOR;
      }
    }
  }

  if (now - state.lastPeakTime > 4000 && state.smoothedBpm > 0) {
    state.intervals = [];
    state.smoothedBpm = 0;
  }

  return Math.round(state.smoothedBpm);
}

// ── HOOK ──────────────────────────────────────────────────
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
  const particlesRef = useRef<Particle[]>([]);

  // Tunnel and Lissajous need a continuous time counter for animation
  const timeRef = useRef<number>(0);

  const bpmStateRef = useRef<BpmState>({
    history: [],
    lastPeakTime: performance.now(),
    intervals: [],
    smoothedBpm: 0,
  });
  const currentBpmRef = useRef<number>(0);

  sensitivityRef.current = sensitivity;

  const handleModeChange = useCallback((m: VisualizerMode) => {
    modeRef.current = m;
    setMode(m);
    if (m !== "particles") particlesRef.current = [];
  }, []);

  const handleMoodChange = useCallback((mood: MoodConfig) => {
    moodRef.current = mood;
    setActiveMood(mood.id);
    modeRef.current = mood.mode;
    setMode(mood.mode);
    particlesRef.current = [];
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

    // Advance time counter — used by tunnel and lissajous for smooth animation
    timeRef.current += 0.016;

    ctx.fillStyle = `rgba(10, 10, 20, ${mood.bgAlpha})`;
    ctx.fillRect(0, 0, W, H);

    if (frequencyData.length > 0) {
      const scaledFreq = new Uint8Array(
        frequencyData.map((v) => Math.min(255, v * s)),
      );
      const scaledBass = Math.min(1, bass * s);
      const scaledVolume = Math.min(1, volume * s);

      currentBpmRef.current = detectBpm(bpmStateRef.current, scaledBass);

      const currentMode = modeRef.current;
      const t = timeRef.current;

      if (currentMode === "spectrum") {
        drawSpectrum(ctx, W, H, scaledFreq, scaledBass, mood);
      } else if (currentMode === "wave") {
        drawWave(ctx, W, H, timeData, scaledVolume, mood);
      } else if (currentMode === "circle") {
        drawCircle(ctx, W, H, scaledFreq, scaledBass, scaledVolume, mood);
      } else if (currentMode === "particles") {
        drawParticles(
          ctx,
          W,
          H,
          particlesRef.current,
          scaledBass,
          scaledVolume,
          mood,
        );
      } else if (currentMode === "tunnel") {
        drawTunnel(ctx, W, H, scaledFreq, scaledBass, scaledVolume, mood, t);
      } else if (currentMode === "lissajous") {
        drawLissajous(ctx, W, H, timeData, scaledBass, scaledVolume, mood, t);
      }
    }
  }, [getAnalyzerData, canvasRef]);

  const resetBpm = useCallback(() => {
    bpmStateRef.current = {
      history: [],
      lastPeakTime: performance.now(),
      intervals: [],
      smoothedBpm: 0,
    };
    currentBpmRef.current = 0;
  }, []);

  return {
    draw,
    mode,
    setMode: handleModeChange,
    activeMood,
    handleMoodChange,
    moodRef,
    modeRef,
    currentBpmRef,
    resetBpm,
  };
}
