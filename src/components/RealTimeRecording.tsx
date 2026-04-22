import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  Save,
  RotateCcw,
} from "lucide-react";
import type {
  RealTimeRecordingProps,
  RecordingInterfaceProps,
} from "../types/real_time_recording";
import { createSpeechmaticsJWT } from "@speechmatics/auth";
import { useTheme } from "../context/ThemeContext";

const RealTimeRecording: React.FC<RealTimeRecordingProps> = ({
  onTranscriptionComplete,
  onError,
  isSaving = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [finalTranscription, setFinalTranscription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("disconnected");
  const [showPlayback, setShowPlayback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [accumulatedTranscript, setAccumulatedTranscript] = useState("");

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const recognitionStartedRef = useRef(false);
  const audioChunkCountRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const startRecording = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setTranscription("");
      setFinalTranscription("");
      setShowPlayback(false);
      setAudioBlob(null);
      setAudioUrl(null);
      setConnectionStatus("connecting");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setShowPlayback(true);
      };

      mediaRecorderRef.current.start();
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };

      const workletCode = `
        class AudioProcessor extends AudioWorkletProcessor {
          process(inputs) {
            const input = inputs[0];
            if (input.length > 0) this.port.postMessage({ audioData: input[0] });
            return true;
          }
        }
        registerProcessor('audio-processor', AudioProcessor);
      `;

      const workletBlob = new Blob([workletCode], {
        type: "application/javascript",
      });
      await audioContextRef.current.audioWorklet.addModule(
        URL.createObjectURL(workletBlob),
      );

      workletNodeRef.current = new AudioWorkletNode(
        audioContextRef.current,
        "audio-processor",
      );

      workletNodeRef.current.port.onmessage = (event) => {
        if (
          websocketRef.current &&
          recognitionStartedRef.current &&
          websocketRef.current.readyState === WebSocket.OPEN
        ) {
          try {
            const float32 = event.data.audioData;
            const int16 = new Int16Array(float32.length);
            for (let i = 0; i < float32.length; i++) {
              const s = Math.max(-1, Math.min(1, float32[i]));
              int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }
            websocketRef.current.send(int16.buffer);
            audioChunkCountRef.current++;
          } catch (err) {
            console.warn("Failed to send audio data:", err);
          }
        }
      };

      microphoneRef.current.connect(workletNodeRef.current);
      setIsRecording(true);
      setIsConnecting(false);
      setConnectionStatus("connected");
      updateAudioLevel();
    } catch (err: any) {
      setError(err.message || "Failed to start recording");
      onError(err.message || "Failed to start recording");
      setIsConnecting(false);
      setConnectionStatus("error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording")
      mediaRecorderRef.current.stop();

    setTimeout(() => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(
          JSON.stringify({
            message: "EndOfStream",
            last_seq_no: audioChunkCountRef.current,
          }),
        );
        setTimeout(() => {
          websocketRef.current?.close(1000, "Normal closure");
          websocketRef.current = null;
        }, 100);
      } else if (websocketRef.current) {
        websocketRef.current.close(1000, "Normal closure");
        websocketRef.current = null;
      }
    }, 3000);

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    workletNodeRef.current?.disconnect();
    workletNodeRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;

    setIsRecording(false);
    setConnectionStatus("disconnected");
    setAudioLevel(0);
  };

  const handlePlayPause = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSave = async () => {
    if (audioBlob && finalTranscription)
      await onTranscriptionComplete(finalTranscription, audioBlob);
  };

  const handleRerecord = () => {
    setTranscription("");
    setFinalTranscription("");
    setShowPlayback(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setAccumulatedTranscript("");
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div
      className="rounded-2xl p-4 sm:p-6 transition-all duration-300 relative overflow-hidden"
      style={
        isDark
          ? {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(239,68,68,0.2)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow:
                "0 4px 32px rgba(0,0,0,0.3), 0 0 40px rgba(239,68,68,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
            }
          : {
              backgroundColor: "var(--bg-card)",
              boxShadow: "var(--shadow-card)",
              border: "1px solid rgba(239,68,68,0.08)",
            }
      }
    >
      {/* Top accent line */}
      {isDark && (
        <div
          className="absolute top-0 left-6 right-6 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), rgba(168,85,247,0.4), transparent)",
          }}
        />
      )}
      {/* Corner glow */}
      {isDark && (
        <div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(239,68,68,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-6 relative">
        <div className="flex items-center justify-center gap-2.5 mb-1">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={
              isDark
                ? {
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    boxShadow: "0 0 14px rgba(239,68,68,0.15)",
                  }
                : {
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }
            }
          >
            <Mic
              className="w-4 h-4"
              style={{
                color: isDark ? "rgba(252,165,165,0.95)" : "rgb(220,38,38)",
              }}
            />
          </div>
          <h3
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Real-Time Recording
          </h3>
        </div>
        <p
          className="text-sm sm:text-base"
          style={{ color: "var(--text-muted)" }}
        >
          Record audio with live transcription
        </p>
      </div>

      <RecordingInterface
        isRecording={isRecording}
        isConnecting={isConnecting}
        transcription={transcription}
        finalTranscription={finalTranscription}
        error={error}
        audioLevel={audioLevel}
        connectionStatus={connectionStatus}
        showPlayback={showPlayback}
        isPlaying={isPlaying}
        audioUrl={audioUrl}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onTranscriptionComplete={onTranscriptionComplete}
        onError={onError}
        onPlayPause={handlePlayPause}
        onSave={handleSave}
        onRerecord={handleRerecord}
        setFinalTranscription={setFinalTranscription}
        setIsPlaying={setIsPlaying}
        websocketRef={websocketRef}
        recognitionStartedRef={recognitionStartedRef}
        audioChunkCountRef={audioChunkCountRef}
        setTranscription={setTranscription}
        setConnectionStatus={setConnectionStatus}
        audioElementRef={audioElementRef}
        accumulatedTranscript={accumulatedTranscript}
        setAccumulatedTranscript={setAccumulatedTranscript}
        isSaving={isSaving}
      />
    </div>
  );
};

// ─── Status badge config ─────────────────────────────────────────────────────
const STATUS_CONFIG_DARK: Record<
  string,
  { bg: string; border: string; color: string; dot: string }
> = {
  connected: {
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.3)",
    color: "rgba(134,239,172,0.95)",
    dot: "bg-green-400 animate-pulse",
  },
  connecting: {
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.3)",
    color: "rgba(253,230,138,0.95)",
    dot: "bg-yellow-400 animate-pulse",
  },
  error: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    color: "rgba(252,165,165,0.95)",
    dot: "bg-red-400",
  },
  disconnected: {
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    color: "rgba(200,180,255,0.5)",
    dot: "bg-gray-500",
  },
};

const STATUS_CONFIG_LIGHT: Record<
  string,
  { bg: string; border: string; color: string; dot: string }
> = {
  connected: {
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
    color: "#16a34a",
    dot: "bg-green-500 animate-pulse",
  },
  connecting: {
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.25)",
    color: "#ca8a04",
    dot: "bg-yellow-500 animate-pulse",
  },
  error: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    color: "#dc2626",
    dot: "bg-red-500",
  },
  disconnected: {
    bg: "var(--bg-card-hover)",
    border: "var(--border-color)",
    color: "var(--text-muted)",
    dot: "bg-gray-400",
  },
};

const STATUS_LABELS: Record<string, string> = {
  connected: "Connected",
  connecting: "Connecting...",
  error: "Connection Error",
  disconnected: "Disconnected",
};

const RecordingInterface: React.FC<RecordingInterfaceProps> = ({
  isRecording,
  transcription,
  finalTranscription,
  error,
  audioLevel,
  connectionStatus,
  showPlayback,
  isPlaying,
  audioUrl,
  onStartRecording,
  onStopRecording,
  onError,
  onPlayPause,
  onSave,
  onRerecord,
  setFinalTranscription,
  setIsPlaying,
  websocketRef,
  recognitionStartedRef,
  setTranscription,
  setConnectionStatus,
  audioElementRef,
  setAccumulatedTranscript,
  isSaving = false,
}) => {
  const [isConnectingToSpeechmatics, setIsConnectingToSpeechmatics] =
    useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const st = isDark
    ? (STATUS_CONFIG_DARK[connectionStatus] ?? STATUS_CONFIG_DARK.disconnected)
    : (STATUS_CONFIG_LIGHT[connectionStatus] ??
      STATUS_CONFIG_LIGHT.disconnected);

  const getSpeechmaticsJWT = async () => {
    const apiKey = import.meta.env.VITE_SPEECHMATICS_API_KEY;
    return await createSpeechmaticsJWT({ type: "rt", apiKey, ttl: 60 });
  };

  const handleStartRecording = async () => {
    setIsConnectingToSpeechmatics(true);
    setConnectionStatus("connecting");

    try {
      const jwt = await getSpeechmaticsJWT();
      const ws = new WebSocket(`wss://eu2.rt.speechmatics.com/v2?jwt=${jwt}`);

      ws.onopen = () => {
        setConnectionStatus("connected");
        setIsConnectingToSpeechmatics(false);
        ws.send(
          JSON.stringify({
            message: "StartRecognition",
            audio_format: {
              type: "raw",
              encoding: "pcm_s16le",
              sample_rate: 48000,
            },
            transcription_config: {
              language: "en",
              enable_partials: true,
              max_delay: 2,
              enable_entities: true,
              diarization: "speaker",
              operating_point: "enhanced",
            },
          }),
        );
      };

      ws.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        const data = JSON.parse(event.data);
        if (data.message === "RecognitionStarted") {
          recognitionStartedRef.current = true;
          onStartRecording();
          return;
        }
        if (data.message === "AddPartialTranscript") {
          setTranscription(data.metadata?.transcript || "");
          return;
        }
        if (data.message === "AddTranscript") {
          const text = data.metadata?.transcript || "";
          setAccumulatedTranscript((prev: string) =>
            prev ? prev + " " + text : text,
          );
          setFinalTranscription((prev: string) =>
            prev ? prev + " " + text : text,
          );
          return;
        }
        if (data.message === "Error")
          console.error("Speechmatics error:", data);
      };

      ws.onerror = () => {
        setConnectionStatus("error");
        setIsConnectingToSpeechmatics(false);
        onError("Failed to connect to Speechmatics");
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        recognitionStartedRef.current = false;
      };

      websocketRef.current = ws;
    } catch (err: any) {
      setConnectionStatus("error");
      setIsConnectingToSpeechmatics(false);
      onError(err.message || "Failed to start recording");
    }
  };

  return (
    <div className="space-y-5 relative">
      {/* Error */}
      {error && (
        <div
          className="rounded-xl p-4"
          style={
            isDark
              ? {
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  backdropFilter: "blur(6px)",
                }
              : {
                  backgroundColor: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }
          }
        >
          <div className="flex items-center space-x-2">
            <AlertCircle
              className="h-5 w-5 flex-shrink-0"
              style={{ color: isDark ? "rgba(252,165,165,0.9)" : "#ef4444" }}
            />
            <span
              className="text-sm"
              style={{ color: isDark ? "rgba(252,165,165,0.9)" : "#ef4444" }}
            >
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Connection status */}
      <div className="flex items-center justify-center">
        <div
          className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: st.bg,
            border: `1px solid ${st.border}`,
            color: st.color,
            boxShadow:
              isDark && connectionStatus === "connected"
                ? "0 0 16px rgba(74,222,128,0.12)"
                : "none",
          }}
        >
          <div className={`w-2 h-2 rounded-full ${st.dot}`} />
          <span>{STATUS_LABELS[connectionStatus]}</span>
        </div>
      </div>

      {/* Audio level meter */}
      {isRecording && (
        <div
          className="flex items-center justify-center gap-4 px-4 py-3 rounded-xl"
          style={
            isDark
              ? {
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }
              : {
                  background: "rgba(239,68,68,0.04)",
                  border: "1px solid rgba(239,68,68,0.1)",
                }
          }
        >
          <div className="flex items-center space-x-2">
            <Mic
              className="h-5 w-5 animate-pulse"
              style={{ color: isDark ? "rgba(252,165,165,0.9)" : "#ef4444" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Recording...
            </span>
          </div>
          <div
            className="w-32 h-2 rounded-full overflow-hidden"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "var(--border-color)",
            }}
          >
            <div
              className="h-full transition-all duration-100 rounded-full"
              style={{
                width: `${audioLevel * 100}%`,
                background: isDark
                  ? `linear-gradient(90deg, rgba(52,211,153,0.9), rgba(239,68,68,${0.5 + audioLevel * 0.5}))`
                  : "linear-gradient(90deg, #22c55e, #ef4444)",
                boxShadow: isDark
                  ? `0 0 8px rgba(239,68,68,${audioLevel * 0.6})`
                  : "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Record / Stop */}
      <div className="flex items-center justify-center">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            disabled={isConnectingToSpeechmatics}
            className="flex items-center space-x-2 font-semibold py-3 px-6 rounded-xl
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed min-h-12 min-w-[160px] justify-center focus:outline-none"
            style={
              isDark
                ? {
                    background:
                      "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.15))",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "rgba(252,165,165,0.95)",
                    boxShadow: "0 0 20px rgba(239,68,68,0.15)",
                  }
                : {
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
                  }
            }
            onMouseEnter={(e) => {
              if (!isConnectingToSpeechmatics && isDark) {
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(239,68,68,0.28)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (isDark) {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(239,68,68,0.15)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
              }
            }}
          >
            {isConnectingToSpeechmatics ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Connecting...</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                <span>Start Recording</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="flex items-center space-x-2 font-semibold py-3 px-6 rounded-xl
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
              min-h-12 min-w-[160px] justify-center focus:outline-none"
            style={
              isDark
                ? {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(200,180,255,0.8)",
                  }
                : {
                    background: "linear-gradient(135deg, #6b7280, #4b5563)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(107,114,128,0.3)",
                  }
            }
          >
            <Square className="h-5 w-5" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Live transcription */}
      {transcription && (
        <div
          className="rounded-xl p-4"
          style={
            isDark
              ? {
                  background: "rgba(59,130,246,0.07)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  backdropFilter: "blur(6px)",
                }
              : {
                  backgroundColor: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.18)",
                }
          }
        >
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: isDark
                  ? "rgba(96,165,250,0.9)"
                  : "rgb(37,99,235)",
                boxShadow: isDark ? "0 0 6px rgba(59,130,246,0.6)" : "none",
              }}
            />
            <span
              className="text-sm font-medium"
              style={{
                color: isDark ? "rgba(96,165,250,0.9)" : "rgb(37,99,235)",
              }}
            >
              Live Transcription
            </span>
          </div>
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: "var(--text-muted)" }}
          >
            "{transcription}"
          </p>
        </div>
      )}

      {/* Final transcription */}
      {finalTranscription && (
        <div
          className="rounded-xl p-4"
          style={
            isDark
              ? {
                  background: "rgba(52,211,153,0.07)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  backdropFilter: "blur(6px)",
                }
              : {
                  backgroundColor: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.18)",
                }
          }
        >
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: isDark
                  ? "rgba(52,211,153,0.9)"
                  : "rgb(22,163,74)",
                boxShadow: isDark ? "0 0 6px rgba(52,211,153,0.5)" : "none",
              }}
            />
            <span
              className="text-sm font-medium"
              style={{
                color: isDark ? "rgba(110,231,183,0.95)" : "rgb(22,163,74)",
              }}
            >
              Final Transcription
            </span>
          </div>
          <p
            className="text-sm leading-relaxed italic mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            "{finalTranscription}"
          </p>

          {showPlayback && audioUrl && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onPlayPause}
                className="flex items-center justify-center space-x-2 font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none"
                style={
                  isDark
                    ? {
                        background: "rgba(59,130,246,0.12)",
                        border: "1px solid rgba(59,130,246,0.3)",
                        color: "rgba(96,165,250,0.95)",
                        boxShadow: "0 0 12px rgba(59,130,246,0.15)",
                      }
                    : {
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        border: "none",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                      }
                }
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span className="text-sm">{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <audio
                ref={audioElementRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      {/* Save / Re-record */}
      {finalTranscription && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center space-x-2 font-semibold py-3 px-6 rounded-xl transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]
              min-h-[48px] min-w-[160px] justify-center focus:outline-none"
            style={
              isDark
                ? {
                    background:
                      "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.15))",
                    border: "1px solid rgba(52,211,153,0.35)",
                    color: "rgba(110,231,183,0.95)",
                    boxShadow: "0 0 20px rgba(52,211,153,0.12)",
                  }
                : {
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                  }
            }
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Recording</span>
              </>
            )}
          </button>

          <button
            onClick={onRerecord}
            className="flex items-center space-x-2 font-semibold py-3 px-6 rounded-xl transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98] min-h-[48px] min-w-[160px] justify-center focus:outline-none"
            style={
              isDark
                ? {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    color: "rgba(200,180,255,0.7)",
                  }
                : {
                    background: "linear-gradient(135deg, #6b7280, #4b5563)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(107,114,128,0.25)",
                  }
            }
            onMouseEnter={(e) => {
              if (isDark) {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
                e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (isDark) {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.2)";
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.05)";
              }
            }}
          >
            <RotateCcw className="h-5 w-5" />
            <span>Record Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RealTimeRecording;
