import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";

type VisualizerMode = "spectrum" | "wave" | "circle";

const MODES: { id: VisualizerMode; label: string; icon: string }[] = [
  { id: "spectrum", label: "Spectrum", icon: "📊" },
  { id: "wave", label: "Wave", icon: "🌊" },
  { id: "circle", label: "Circle", icon: "🔵" },
];

const Studio = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<VisualizerMode>("spectrum");
  const modeRef = useRef<VisualizerMode>("spectrum");
  const { start, stop, getAnalyzerData } = useAudioAnalyzer();


  const handleModeChange = (m: VisualizerMode) => {
    modeRef.current = m;
    setMode(m);
  };

  // ── SPECTRUM ───────
  const drawSpectrum = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      frequencyData: Uint8Array,
      bass: number,
    ) => {
      const barCount = 128;
      const barWidth = W / barCount;

      for (let i = 0; i < barCount; i++) {
        const value = frequencyData[i] / 255;
        const barH = value * H * 0.8;
        const x = i * barWidth;
        const hue = 200 + i * 1.2 + bass * 60;
        const lightness = 40 + value * 40;
        ctx.fillStyle = `hsl(${hue}, 80%, ${lightness}%)`;
        ctx.fillRect(x, H / 2 - barH / 2, barWidth - 1, barH);
      }
    },
    [],
  );

  // ── WAVE ──────────
  const drawWave = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      timeData: Uint8Array,
      volume: number,
    ) => {
      ctx.lineWidth = 2 + volume * 4;
      ctx.strokeStyle = `hsl(${180 + volume * 60}, 80%, 60%)`;
      ctx.shadowBlur = 10 + volume * 30;
      ctx.shadowColor = `hsl(${180 + volume * 60}, 100%, 60%)`;

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
    },
    [],
  );

  // ── CIRCLE ───────────────
  const drawCircle = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      frequencyData: Uint8Array,
      bass: number,
      volume: number,
    ) => {
      const cx = W / 2;
      const cy = H / 2;
      const baseRadius = Math.min(W, H) * 0.2 + bass * 40;
      const barCount = 128;

   
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${220 + bass * 60}, 80%, 60%, 0.4)`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20 + bass * 40;
      ctx.shadowColor = `hsl(${220 + bass * 60}, 100%, 60%)`;
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

        const hue = 200 + i * 1.4 + volume * 60;
        ctx.strokeStyle = `hsl(${hue}, 90%, ${40 + value * 40}%)`;
        ctx.lineWidth = (W / barCount) * 0.7;
        ctx.shadowBlur = value * 15;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    },
    [],
  );

  // ── MAIN DRAW LOOP ────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { frequencyData, timeData, bass, volume } = getAnalyzerData();
    const W = canvas.width;
    const H = canvas.height;

   
    ctx.fillStyle = "rgba(10, 10, 20, 0.2)";
    ctx.fillRect(0, 0, W, H);

    if (frequencyData.length > 0) {
      const currentMode = modeRef.current;

      if (currentMode === "spectrum") {
        drawSpectrum(ctx, W, H, frequencyData, bass);
      } else if (currentMode === "wave") {
        drawWave(ctx, W, H, timeData, volume);
      } else if (currentMode === "circle") {
        drawCircle(ctx, W, H, frequencyData, bass, volume);
      }
    }

    frameRef.current = requestAnimationFrame(draw);
  }, [getAnalyzerData, drawSpectrum, drawWave, drawCircle]);

  const handleToggle = async () => {
    if (isListening) {
      stop();
      cancelAnimationFrame(frameRef.current);
      setIsListening(false);
    } else {
      await start();
      setIsListening(true);
      frameRef.current = requestAnimationFrame(draw);
    }
  };

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setTimeout(resize, 50);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    return () => {
      stop();
      cancelAnimationFrame(frameRef.current);
    };
  }, []); 

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate("/main")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vocali
        </button>
        <h1 className="text-white font-semibold text-lg">Vocali Studio</h1>
        <div className="w-24" />
      </div>

      {/* Mode switcher */}
      <div className="flex justify-center gap-3 pb-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${
                mode === m.id
                  ? "bg-white/15 text-white border border-white/30"
                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70"
              }
            `}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="flex-1 relative mx-6 rounded-2xl overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ minHeight: "400px" }}
        />
        {!isListening && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
            <p className="text-white/40 text-lg">
              Play music and press the button
            </p>
            <p className="text-white/20 text-sm">
              Microphone listens to your speakers
            </p>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <div className="flex justify-center py-8">
        <button
          onClick={handleToggle}
          className={`
            flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg
            transition-all duration-300
            ${
              isListening
                ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                : "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30"
            }
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              Stop Visualizer
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Visualizer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Studio;
