import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play } from "lucide-react";
import api from "../services/api";

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
    const [playbackRate, setPlaybackRate] = useState(1);

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";

    const totalSeconds = Math.floor(t);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
    };
    
    const toggleSpeed = () => {
      let nextRate = 1;

      if (playbackRate === 1) nextRate = 1.5;
      else if (playbackRate === 1.5) nextRate = 2;
      else nextRate = 1;

      setPlaybackRate(nextRate);

      if (wavesurferRef.current) {
        wavesurferRef.current.setPlaybackRate(nextRate);
      }
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

        
        const ctx = document.createElement("canvas").getContext("2d")!;
        const gradient = ctx.createLinearGradient(0, 0, 300, 0);
        gradient.addColorStop(0, "#a855f7"); 
        gradient.addColorStop(1, "#ec4899"); 

        ws = WaveSurfer.create({
          container: waveformRef.current!,

          
          waveColor: "#e5e7eb",
          progressColor: gradient,

          height: 60,

        
          barWidth: 3,
          barGap: 2,
          barRadius: 3,

       
          cursorWidth: 2,
          cursorColor: "#ba22c5",

          normalize: true,

          
          autoCenter: true,
        });

        ws.load(blobUrl);

        ws.on("ready", () => {
            if (!isCancelled) setDuration(ws.getDuration());
            ws.setPlaybackRate(playbackRate);
        });

       
        ws.on("audioprocess", () => {
          const time = Math.floor(ws.getCurrentTime());

          if (!isCancelled) {
            setCurrentTime((prev) => (prev !== time ? time : prev));
          }
        });

        
        ws.on("interaction", () => {
          setCurrentTime(Math.floor(ws.getCurrentTime()));
        });

          ws.on("play", () => {
          setTimeout(() => setIsPlaying(true), 150);
            waveformRef.current?.classList.add("scale-[1.01]");
            waveformRef.current?.classList.add("waveform-playing");
        });

          ws.on("pause", () => {
              setIsPlaying(false);
             waveformRef.current?.classList.remove("scale-[1.01]");
           waveformRef.current?.classList.remove("waveform-playing");
        });

        ws.on("finish", () => {
          if (!isCancelled) {
            setIsPlaying(false);
            setCurrentTime(0);
              setActiveAudio(null);
              waveformRef.current?.classList.remove("waveform-playing");
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
        waveformRef.current?.classList.remove("waveform-playing");
    }
  }, [activeAudio, audioId]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;

    if (activeAudio === audioId) {
      wavesurferRef.current.playPause();

      setIsPlaying((prev) => {
        const next = !prev;
        if (!next) setActiveAudio(null);
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
      {/* waveform */}
      <div
        ref={waveformRef}
        className="flex-1 min-w-[200px] transition-transform duration-200"
      />

      {/* time */}
      <div className="text-xs text-gray-500 whitespace-nowrap">
        {formatTime(currentTime)} : {formatTime(duration)}
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
        {isPlaying && (
          <button
            onClick={toggleSpeed}
            className="text-xs font-semibold px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            {playbackRate}x
          </button>
        )}

        {/* button */}
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
    </div>
  );
};

export default WaveformPlayer;
