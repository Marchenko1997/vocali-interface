import { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, BarChart2, Menu, Mic, MicOff, Sparkles, X } from "lucide-react";
import { useAudioAnalyzer, type AudioSource } from "../hooks/useAudioAnalyzer";
import { useVisualizer } from "../hooks/useVisualizer";
import { MOODS, MODES } from "../constants/studioConfig";
import { MoodPicker } from "../components/studio/MoodPicker";
import { ModeSwitcher } from "../components/studio/ModeSwitcher";
import SplashScreen from "../components/SplashScreen";
import { useMood, type MoodId } from "../context/MoodContext";
import BackButton from "../shared/BackButton";

const Studio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [isListening, setIsListening] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioSource>("microphone");
  const [sensitivity, setSensitivity] = useState(1);
  const [showSplash, setShowSplash] = useState(() => location.state?.showSplash === true);
  const [displayBpm, setDisplayBpm] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bpmUpdateTimerRef = useRef<number>(0);
  const manualMoodTimerRef = useRef<number>(0);
  const isManualMoodActive = useRef(false);


  const isDark = true;

  const textMuted = "rgba(255,255,255,0.45)";
  const textPrimary = "rgba(255,255,255,0.9)";
  const cardBorder = "rgba(255,255,255,0.08)";

  const { start, stop, getAnalyzerData } = useAudioAnalyzer();
  const { draw, mode, setMode, activeMood, handleMoodChange, currentBpmRef, resetBpm } =
    useVisualizer(getAnalyzerData, canvasRef, sensitivity);
  const { setMood } = useMood();

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
    const timer = setTimeout(() => setShowSplash(false), 5000);
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
      clearTimeout(manualMoodTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


useEffect(() => {
  if (!isListening || displayBpm === 0) return;
  if (isManualMoodActive.current) return;
  const id: MoodId =
    displayBpm < 80
      ? "chill"
      : displayBpm < 120
        ? "focus"
        : displayBpm < 140
          ? "party"
          : "dark";
  setMood(id, "auto-bpm");
}, [displayBpm, isListening]);

  
  


 if (showSplash) {
   return <SplashScreen title="Welcome to Vocali Studio" />;
 }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "#060611" }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168,85,247,0) 0px, rgba(168,85,247,0) 39px, rgba(168,85,247,0.8) 39px, rgba(168,85,247,0.8) 40px),
              linear-gradient(90deg, rgba(168,85,247,0) 0px, rgba(168,85,247,0) 39px, rgba(168,85,247,0.8) 39px, rgba(168,85,247,0.8) 40px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)",
            filter: "blur(50px)",
            animation: "orb-drift 18s ease-in-out infinite",
          }}
        />

        <div
          className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(244,114,182,0.06) 50%, transparent 70%)",
            filter: "blur(45px)",
            animation: "orb-drift-reverse 14s ease-in-out infinite",
          }}
        />

        <div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "orb-drift 22s ease-in-out infinite reverse",
          }}
        />

        <div
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-56 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />

        {isListening && (
          <div
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(236,72,153,0.04) 40%, transparent 65%)",
              filter: "blur(70px)",
              animation: "listening-pulse 4s ease-in-out infinite",
            }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.04) 0%, transparent 40%, rgba(236,72,153,0.03) 100%)",
          }}
        />
      </div>

      {/* ── Header DESKTOP (sm+) ── */}
      <div
        className="relative z-10 hidden sm:grid grid-cols-3 items-center justify-between px-6 py-3 lg:py-4"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background:
            "linear-gradient(to bottom, rgba(168,85,247,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {" "}
        <div className="justify-self-start">
          <BackButton
            isDark={isDark}
            cardBorder={cardBorder}
            textMuted={textMuted}
            textPrimary={textPrimary}
          />
        </div>
        <h1
          className="text-lg lg:text-xl font-bold tracking-widest uppercase text-center justify-self-center"
          style={{
            background:
              "linear-gradient(90deg, #c084fc, #e879f9, #38bdf8, #c084fc)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradient-shift 6s linear infinite",
            filter: "drop-shadow(0 0 16px rgba(192,132,252,0.55))",
            letterSpacing: "0.2em",
          }}
        >
          Vocali Studio
        </h1>
        <div className="justify-self-end">
          <button
            onClick={() => navigate("/insights")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-sm transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: "rgba(168,85,247,0.08)",
              borderColor: "rgba(168,85,247,0.25)",
              color: "rgba(192,132,252,0.9)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.15)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(168,85,247,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Insights</span>
          </button>
        </div>
        {/* right col — пусто или BPM badge если есть */}
        <div className="justify-self-end" />
      </div>

      {/* ── Header MOBILE (< sm) ── */}
      <div
        className="relative z-10 sm:hidden sticky top-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(6,6,17,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 1px 0 rgba(168,85,247,0.1), 0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.4) 30%, rgba(236,72,153,0.4) 60%, transparent 100%)",
          }}
        />

        {/* main bar */}
        <div className="h-14 flex items-center justify-between px-4">
          <div className="w-9 h-9" />

          <h1
            className="text-base font-bold tracking-widest uppercase pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #c084fc, #e879f9, #38bdf8, #c084fc)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-shift 6s linear infinite",
              filter: "drop-shadow(0 0 14px rgba(192,132,252,0.5))",
              letterSpacing: "0.18em",
            }}
          >
            Vocali Studio
          </h1>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg focus:outline-none flex-shrink-0"
            style={{
              color: "rgba(200,180,255,0.7)",
              border: "1px solid rgba(168,85,247,0.2)",
              backgroundColor: "rgba(168,85,247,0.06)",
            }}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="border-t"
            style={{ borderColor: "rgba(168,85,247,0.15)" }}
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <button
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl text-sm font-medium group"
                style={{
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.45)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(168,85,247,0.08)";
                  e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)";
                  e.currentTarget.style.color = "rgba(216,180,254,0.85)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }}
              >
                <ArrowLeft className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to Vocali
              </button>

              {/* Insights */}
              <button
                onClick={() => {
                  navigate("/insights");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl text-sm font-medium"
                style={{
                  padding: "10px 12px",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  color: "rgba(165,180,252,0.85)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.18)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 0 14px rgba(99,102,241,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <BarChart2 className="w-4 h-4 flex-shrink-0" />
                Music Insights
              </button>

              {/* Studio current */}
              <div
                className="flex items-center gap-2 rounded-xl text-sm font-medium"
                style={{
                  padding: "10px 12px",
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.08) 100%)",
                  border: "1px solid rgba(168,85,247,0.4)",
                  color: "rgba(216,180,254,0.95)",
                  boxShadow:
                    "0 0 20px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <Sparkles
                  className="w-4 h-4 flex-shrink-0"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(192,132,252,0.6))",
                  }}
                />
                Studio
                <span
                  className="ml-auto text flex items-center justify-center-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(168,85,247,0.25)",
                    color: "rgba(216,180,254,0.9)",
                    border: "1px solid rgba(168,85,247,0.3)",
                  }}
                >
                  current
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Source Picker ── */}
      <div className="relative z-10 flex justify-center gap-3 pt-5 pb-1">
        {(
          [
            { id: "microphone", label: "Microphone", icon: "🎙️" },
            { id: "system", label: "System Audio", icon: "🖥️" },
          ] as { id: AudioSource; label: string; icon: string }[]
        ).map((src) => {
          const isActive = audioSource === src.id;
          return (
            <button
              key={src.id}
              disabled={isListening}
              onClick={() => setAudioSource(src.id)}
              className="relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
              style={{
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                ...(isActive
                  ? {
                      background: "rgba(168,85,247,0.15)",
                      border: "1px solid rgba(168,85,247,0.45)",
                      color: "rgba(216,180,254,0.97)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      boxShadow:
                        "0 0 20px rgba(168,85,247,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.3)",
                    }),
              }}
            >
              {isActive && (
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 55%)",
                  }}
                />
              )}
              <span className="relative z-10">{src.icon}</span>
              <span className="relative z-10">{src.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Mood + Mode + Sensitivity ── */}
      <div className="relative z-10">
        <MoodPicker
          moods={MOODS}
          activeMood={activeMood}
          onChange={(mood) => {
            handleMoodChange(mood);
            setMood(mood.id as MoodId, "manual");
            isManualMoodActive.current = true;
            clearTimeout(manualMoodTimerRef.current);
            manualMoodTimerRef.current = window.setTimeout(() => {
              isManualMoodActive.current = false;
            }, 30_000);
          }}
        />
        <ModeSwitcher modes={MODES} activeMode={mode} onChange={setMode} />

        {/* Sensitivity */}
        <div className="flex justify-center items-center gap-4 pt-1 pb-4 px-6">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            Sens
          </span>
          <div className="relative flex items-center">
            <input
              type="range"
              min={0.2}
              max={3}
              step={0.1}
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-32 cursor-pointer focus:outline-none"
              style={{ accentColor: "#a855f7" }}
            />
          </div>
          <span
            className="text-xs tabular-nums font-medium w-8"
            style={{ color: "rgba(168,85,247,0.7)" }}
          >
            {sensitivity.toFixed(1)}x
          </span>
        </div>
      </div>

      {/* ── Canvas — glass frame ── */}
      <div
        className="relative z-10 flex-1 mx-4 sm:mx-6 rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(10,10,25,0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: isListening
            ? "border-glow 4s ease-in-out infinite"
            : "none",
          boxShadow: isListening
            ? "0 0 50px rgba(168,85,247,0.15), inset 0 0 60px rgba(0,0,0,0.4)"
            : "0 8px 40px rgba(0,0,0,0.4), inset 0 0 40px rgba(0,0,0,0.3)",
          transition: "box-shadow 1s ease",
        }}
      >
        {/* Top edge glow line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: isListening
              ? "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(236,72,153,0.6), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            transition: "background 1s ease",
          }}
        />

        <div
          className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(168,85,247,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(56,189,248,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom right, rgba(236,72,153,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at bottom left, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
        />

        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ minHeight: "400px" }}
        />

        {!isListening && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div
              className="px-8 py-5 rounded-2xl text-center"
              style={{
                background: "rgba(6,6,17,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <p
                className="text-base font-medium mb-1.5"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Play music and press the button
              </p>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.18)" }}
              >
                {audioSource === "microphone"
                  ? "Microphone listens to your speakers"
                  : "Select a browser tab with music playing"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Toggle button ── */}
      <div className="relative z-10 flex justify-center py-8">
        <button
          onClick={handleToggle}
          className="relative flex items-center gap-3 px-12 py-4 rounded-full font-semibold text-base focus:outline-none overflow-hidden"
          style={{
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            ...(isListening
              ? {
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "rgba(252,165,165,0.97)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow:
                    "0 0 30px rgba(239,68,68,0.18), 0 0 80px rgba(239,68,68,0.06), inset 0 1px 0 rgba(255,255,255,0.07)",
                }
              : {
                  background: "rgba(168,85,247,0.13)",
                  border: "1px solid rgba(168,85,247,0.45)",
                  color: "rgba(216,180,254,0.97)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow:
                    "0 0 40px rgba(168,85,247,0.22), 0 0 100px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
                }),
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
          }}
        >
          {/* Diagonal glass sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)",
            }}
          />
          {/* Bottom inner shadow */}
          <div
            className="absolute bottom-0 left-4 right-4 h-px pointer-events-none"
            style={{
              background: "rgba(0,0,0,0.3)",
            }}
          />

          {isListening ? (
            <>
              <MicOff className="w-5 h-5 relative z-10" />
              <span className="relative z-10 tracking-wide">
                Stop Visualizer
              </span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 relative z-10" />
              <span className="relative z-10 tracking-wide">
                Start Visualizer
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Studio;