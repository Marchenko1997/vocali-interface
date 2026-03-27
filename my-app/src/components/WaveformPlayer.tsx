import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play } from "lucide-react";
import api from "../services/api"; // 🔥 используем твой axios

type Props = {
  audioUrl: string;
  audioId: string;
  activeAudio: string | null;
  setActiveAudio: (id: string | null) => void;
};

const WaveformPlayer = ({
  audioUrl,
  audioId,
  activeAudio,
  setActiveAudio,
}: Props) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";

    if (t > 10000) {
      t = t / 1000;
    }

    const totalSeconds = Math.floor(t);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!waveformRef.current) return;

    let ws: any;
    let isCancelled = false;

    const loadAudio = async () => {
      try {
        waveformRef.current!.innerHTML = "";

        const response = await api.get(audioUrl, {
          responseType: "blob",
        });

        if (isCancelled) return;

        const blobUrl = URL.createObjectURL(response.data);

        ws = WaveSurfer.create({
          container: waveformRef.current!,
          waveColor: "#cbd5f5",
          progressColor: "#4ade80",
          height: 60,
          barWidth: 2,
          cursorWidth: 1,
        });

        ws.load(blobUrl);

        ws.on("ready", () => {
          if (!isCancelled) setDuration(ws.getDuration());
        });

        ws.on("audioprocess", () => {
          const time = Math.floor(ws.getCurrentTime());

          if (!isCancelled) {
            setCurrentTime((prev) => {
              if (prev !== time) {
                return time;
              }
              return prev;
            });
          }
        });
        ws.on("finish", () => {
          if (!isCancelled) {
            setIsPlaying(false);
            setCurrentTime(0);
            setActiveAudio(null);
          }
        });

        wavesurferRef.current = ws;
      } catch (error) {
        console.error("❌ WaveSurfer load error:", error);
      }
    };

    loadAudio();

    return () => {
      isCancelled = true;

      if (ws) ws.destroy();
    };
  }, [audioUrl]);

  useEffect(() => {
    if (activeAudio !== audioId && wavesurferRef.current) {
      wavesurferRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeAudio, audioId]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;

    if (activeAudio === audioId) {
      wavesurferRef.current.playPause();

      setIsPlaying((prev) => {
        const next = !prev;

        if (!next) {
          setActiveAudio(null);
        }

        return next;
      });
    } else {
      setActiveAudio(audioId);
      wavesurferRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div ref={waveformRef} className="flex-1 min-w-[200px]" />

      <div className="text-xs text-gray-500 whitespace-nowrap">
        {formatTime(currentTime)} : {formatTime(duration)}
      </div>

      <button
        onClick={togglePlay}
        className={`p-2 sm:p-3 transition-all duration-200 rounded-lg flex items-center justify-center ${
          isPlaying
            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
            : "text-gray-600 hover:text-green-600 hover:bg-green-50"
        }`}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-1 h-3 sm:h-4 bg-white rounded-sm"></div>
              <div className="w-1 h-3 sm:h-4 bg-white rounded-sm"></div>
            </div>
          </div>
        ) : (
          <Play className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </button>
    </div>
  );
};

export default WaveformPlayer;
