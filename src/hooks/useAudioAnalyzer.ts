import { useRef, useCallback, useEffect } from "react";

export interface AudioAnalyzerData {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
}

export type AudioSource = "microphone" | "system";

export function useAudioAnalyzer() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>(0);
  const isActiveRef = useRef(false);

  const getAnalyzerData = useCallback((): AudioAnalyzerData => {
    const analyser = analyserRef.current;

    if (!analyser) {
      return {
        frequencyData: new Uint8Array(0),
        timeData: new Uint8Array(0),
        volume: 0,
        bass: 0,
        mid: 0,
        treble: 0,
      };
    }

    const bufferLength = analyser.frequencyBinCount;

    const frequencyData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(timeData);

    const volume =
      frequencyData.reduce((sum, val) => sum + val, 0) / (bufferLength * 255);

    const bassEnd = Math.floor((250 / 24000) * bufferLength);
    const midEnd = Math.floor((4000 / 24000) * bufferLength);

    const avg = (arr: Uint8Array, from: number, to: number) => {
      let sum = 0;
      for (let i = from; i < to; i++) sum += arr[i];
      return sum / ((to - from) * 255);
    };

    return {
      frequencyData,
      timeData,
      volume,
      bass: avg(frequencyData, 0, bassEnd),
      mid: avg(frequencyData, bassEnd, midEnd),
      treble: avg(frequencyData, midEnd, bufferLength),
    };
  }, []);

 const start = useCallback(async (source: AudioSource = "microphone") => {
   try {
     let stream: MediaStream;

     if (source === "microphone") {
       stream = await navigator.mediaDevices.getUserMedia({
         audio: {
           echoCancellation: false,
           noiseSuppression: false,
           autoGainControl: false,
         },
       });
     } else {
      
       stream = await navigator.mediaDevices.getDisplayMedia({
         audio: true,
         video: true,
       });
      
       stream.getVideoTracks().forEach((t) => t.stop());

 
       if (stream.getAudioTracks().length === 0) {
         console.warn("⚠️ No audio track — user didn't check 'Share audio'");
         return;
       }
     }

     streamRef.current = stream;
     const audioCtx = new AudioContext();
     audioCtxRef.current = audioCtx;

     const analyser = audioCtx.createAnalyser();
     analyser.fftSize = 2048;
     analyser.smoothingTimeConstant = 0.8;
     analyserRef.current = analyser;

     const source_node = audioCtx.createMediaStreamSource(stream);
     source_node.connect(analyser);
    
     sourceRef.current = source_node;

     isActiveRef.current = true;
     console.log(`🎵 Audio analyzer started (${source})`);
   } catch (error) {
     console.error("Audio access denied:", error);
   }
 }, []);

  const stop = useCallback(() => {
    isActiveRef.current = false;
    cancelAnimationFrame(frameRef.current);

    sourceRef.current?.disconnect();
    audioCtxRef.current?.close();

    streamRef.current?.getTracks().forEach((t) => t.stop());

    sourceRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;

    console.log("🔇 Audio analyzer stopped");
  }, []);

  useEffect(() => {
    return () => stop();
  }, []);

  return {
    start,
    stop,
    getAnalyzerData,
    isActive: isActiveRef,
  };
}
