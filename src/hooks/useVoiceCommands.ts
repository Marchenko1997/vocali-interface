import { useEffect, useRef, useCallback } from "react";
import { PLAY_REGEX, PLAYLIST_REGEX, VOICE_COMMANDS } from "../constants/voiceCommands";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface VoiceCommandHandlers {
  onPlay: (query?: string) => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onFavorite: () => void;
  onRecord: () => void;
  onGeneratePlaylist: (prompt: string) => void;
}

export function useVoiceCommands(handlers: VoiceCommandHandlers) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const lastCommandRef = useRef<{ text: string; time: number }>({ text: "", time: 0 });

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const parseCommand = useCallback((text: string) => {
    const now = Date.now();
    
    if (text === lastCommandRef.current.text && now - lastCommandRef.current.time < 2000) return;
    lastCommandRef.current = { text, time: now };

    const t = text.toLowerCase().trim();
    console.log("🎤 Voice input:", t);

    const playMatch = t.match(PLAY_REGEX);
    if (playMatch) {
      console.log("▶ play:", playMatch[1]);
      handlersRef.current.onPlay(playMatch[1]);
      return;
    }

    if (PLAYLIST_REGEX.test(t)) {
      console.log("🎵 generate playlist:", t);
      handlersRef.current.onGeneratePlaylist(t);
      return;
    }

    if (VOICE_COMMANDS.record.some((w) => t.includes(w))) {
      console.log("🎙 record toggle");
      handlersRef.current.onRecord();
      return;
    }

    if (VOICE_COMMANDS.favorite.some((w) => t.includes(w))) {
      console.log("♥ favorite");
      handlersRef.current.onFavorite();
      return;
    }

    if (VOICE_COMMANDS.next.some((w) => t.includes(w))) {
      console.log("⏭ next");
      handlersRef.current.onNext();
      return;
    }

    if (VOICE_COMMANDS.previous.some((w) => t.includes(w))) {
      console.log("⏮ previous");
      handlersRef.current.onPrevious();
      return;
    }

    if (VOICE_COMMANDS.pause.some((w) => t.includes(w))) {
      console.log("⏸ pause");
      handlersRef.current.onPause();
      return;
    }

    console.log("✗ no match:", t);
  }, []);

  const sendChunkToWhisper = useCallback(async (blob: Blob) => {
    if (blob.size < 1000) return; // тишина — пропускаем

    try {
      const formData = new FormData();
      formData.append("audio", blob, "chunk.webm");

      const res = await fetch(`${API_URL}/voice/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) return;
      const data = await res.json();
      if (data.text?.trim()) parseCommand(data.text);
    } catch (err) {
      console.warn("Whisper request failed:", err);
    }
  }, [parseCommand]);

  const startListening = useCallback(async () => {
    if (isListeningRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      isListeningRef.current = true;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg",
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) sendChunkToWhisper(e.data);
      };

      mediaRecorder.start(3000); // чанк каждые 3 секунды
      mediaRecorderRef.current = mediaRecorder;

      console.log("🎤 Voice listening started (Whisper multilingual)");
    } catch (err) {
      console.warn("Microphone access denied:", err);
      isListeningRef.current = false;
    }
  }, [sendChunkToWhisper]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;

    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    console.log("🔇 Voice listening stopped");
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return { startListening, stopListening };
}