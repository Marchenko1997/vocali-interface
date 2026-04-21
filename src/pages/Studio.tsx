import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { useAudioAnalyzer, type AudioSource } from "../hooks/useAudioAnalyzer";
import { useVisualizer } from "../hooks/useVisualizer";
import { MOODS, MODES } from "../constants/studioConfig";
import { MoodPicker } from "../components/studio/MoodPicker";
import { ModeSwitcher } from "../components/studio/ModeSwitcher";
import logoAnimated from "../assets/logo-vocali-animated.mp4";

const Studio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [isListening, setIsListening] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioSource>("microphone");
  const [sensitivity, setSensitivity] = useState(1);
  const [showSplash, setShowSplash] = useState(() => {
    return location.state?.showSplash === true;
  });

  const [displayBpm, setDisplayBpm] = useState<number>(0);
  const bpmUpdateTimerRef = useRef<number>(0);

  const { start, stop, getAnalyzerData } = useAudioAnalyzer();
  const {
    draw,
    mode,
    setMode,
    activeMood,
    handleMoodChange,
    currentBpmRef,
    resetBpm,
  } = useVisualizer(getAnalyzerData, canvasRef, sensitivity);

  const handleToggle = async () => {
    if (isListening) {
      stop();
      cancelAnimationFrame(frameRef.current);
      clearInterval(bpmUpdateTimerRef.current);
      resetBpm();
      setDisplayBpm(0);
      setIsListening(false);
    } else {
      await start(audioSource);
      setIsListening(true);

      bpmUpdateTimerRef.current = window.setInterval(() => {
        setDisplayBpm(currentBpmRef.current);
      }, 500);

      const loop = () => {
        draw();
        frameRef.current = requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    }
  };

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
      clearInterval(bpmUpdateTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <video
            autoPlay
            muted
            loop
            className="w-48 h-48 sm:w-64 sm:h-64 mx-auto max-w-[300px] max-h-[300px]"
          >
            <source src={logoAnimated} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="mt-8">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white text-lg mt-4 font-medium">
              Welcome to Vocali Studio
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-3 items-center px-6 py-2 lg:py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 lg:gap-2 text-white/60 hover:text-white transition-colors focus:outline-none text-sm lg:text-base justify-self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vocali
        </button>

        <h1
          className="text-lg lg:text-2xl font-semibold tracking-wide text-center justify-self-center"
          style={{
            background:
              "linear-gradient(90deg, #ff6b35, #f7c948, #4ecb71, #38c8e0, #e040c8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 8px rgba(56, 200, 224, 0.4))",
          }}
        >
          Vocali Studio
        </h1>

        {/* BPM badge */}
        <div className="justify-self-end">
          {isListening && displayBpm > 0 && (
            <div
              className="flex items-center gap-1 px-3 py-1 rounded-full border border-white/20 bg-white/5"
              title="Detected BPM"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs tabular-nums font-medium">
                {displayBpm} BPM
              </span>
            </div>
          )}
          {isListening && displayBpm === 0 && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-white/10 bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
              <span className="text-white/30 text-xs">— BPM</span>
            </div>
          )}
          {!isListening && <div className="w-20" />}
        </div>
      </div>

      {/* Source Picker */}
      <div className="flex justify-center gap-2 pt-2 pb-1">
        {(
          [
            { id: "microphone", label: "Microphone", icon: "🎙️" },
            { id: "system", label: "System Audio", icon: "🖥️" },
          ] as { id: AudioSource; label: string; icon: string }[]
        ).map((src) => (
          <button
            key={src.id}
            disabled={isListening}
            onClick={() => setAudioSource(src.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm
              transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
              ${
                audioSource === src.id
                  ? "bg-white/20 text-white border border-white/40"
                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/70"
              }
            `}
          >
            {src.icon} {src.label}
          </button>
        ))}
      </div>

      <MoodPicker
        moods={MOODS}
        activeMood={activeMood}
        onChange={handleMoodChange}
      />
      <ModeSwitcher modes={MODES} activeMode={mode} onChange={setMode} />

      {/* Sensitivity */}
      <div className="flex justify-center items-center gap-3 pt-1 pb-3 px-6">
        <span className="text-white/20 text-xs uppercase tracking-widest">
          Sens
        </span>
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.1}
          value={sensitivity}
          onChange={(e) => setSensitivity(parseFloat(e.target.value))}
          className="w-36 accent-white/50 cursor-pointer focus:outline-none"
        />
        <span className="text-white/30 text-xs tabular-nums w-8">
          {sensitivity.toFixed(1)}x
        </span>
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
            {audioSource === "microphone" ? (
              <p className="text-white/20 text-sm">
                Microphone listens to your speakers
              </p>
            ) : (
              <p className="text-white/20 text-sm">
                Select a browser tab with music playing
              </p>
            )}
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
              <MicOff className="w-5 h-5" /> Stop Visualizer
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" /> Start Visualizer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Studio;
