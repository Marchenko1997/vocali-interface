import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";

const Studio = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [isListening, setIsListening] = useState(false);
  const { start, stop, getAnalyzerData } = useAudioAnalyzer();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { frequencyData, bass } = getAnalyzerData();
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "rgba(10, 10, 20, 0.15)";
    ctx.fillRect(0, 0, W, H);

    if (frequencyData.length === 0) {
      frameRef.current = requestAnimationFrame(draw);
      return;
    }

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

    frameRef.current = requestAnimationFrame(draw);
  }, [getAnalyzerData]);

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

  // Resize canvas
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

  // Cleanup только при размонтировании
  useEffect(() => {
    return () => {
      stop();
      cancelAnimationFrame(frameRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Кнопка СНАРУЖИ canvas div */}
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
