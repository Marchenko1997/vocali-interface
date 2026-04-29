import { useEffect, useRef, useCallback } from "react";
import {
  PLAY_REGEX,
  PLAY_TRIGGER_ONLY_REGEX,
  PLAYLIST_REGEX,
  NEXT_REGEX,
  PAUSE_REGEX,
  PREVIOUS_REGEX,
  FAVORITE_REGEX,
  UNFAVORITE_REGEX,
  RECORD_REGEX,
  VOICE_COMMANDS,
  normalizeText,
  cleanTranscript,
} from "../constants/voiceCommands";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const HAS_LETTERS = /[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ]/;

const log = (msg: string, ...args: unknown[]) => console.log("[Voice]", msg, ...args);

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      curr[j] =
        a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function fuzzyMaxDist(len: number): number {
  if (len <= 3) return 0;
  if (len <= 6) return 1;
  return 2;
}

function fuzzyIncludes(text: string, commands: string[]): boolean {
  if (commands.some((cmd) => text.includes(cmd))) return true;

  const textCompact = text.replace(/\s/g, "");
  for (const cmd of commands) {
    const cmdCompact = cmd.replace(/\s/g, "");
    const maxDist = fuzzyMaxDist(cmdCompact.length);
    if (maxDist === 0) continue;
    for (let wLen = cmdCompact.length - maxDist; wLen <= cmdCompact.length + maxDist; wLen++) {
      if (wLen < 1 || wLen > textCompact.length) continue;
      for (let i = 0; i <= textCompact.length - wLen; i++) {
        if (levenshtein(textCompact.slice(i, i + wLen), cmdCompact) <= maxDist) return true;
      }
    }
  }
  return false;
}

function extractAfterCommand(text: string, commands: string[]): string | null {
  const words = text.split(" ");
  const sorted = [...commands].sort((a, b) => b.length - a.length);
  for (const cmd of sorted) {
    const cmdWords = cmd.split(" ");
    if (cmdWords.length > words.length) continue;
    const prefix = words.slice(0, cmdWords.length).join(" ");
    if (levenshtein(prefix, cmd) <= fuzzyMaxDist(prefix.length)) {
      const rest = words.slice(cmdWords.length).join(" ").trim();
      if (rest) return rest;
    }
  }
  return null;
}

interface VoiceCommandHandlers {
  onPlay: (query?: string) => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onFavorite: () => void;
  onUnfavorite?: () => void;
  onRecord: () => void;
  onGeneratePlaylist: (prompt: string) => void;
  onTranscript?: (text: string) => void;
}

export function useVoiceCommands(handlers: VoiceCommandHandlers) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const lastCommandRef = useRef<{ text: string; time: number }>({ text: "", time: 0 });
  const pendingPlaylistRef = useRef<{ text: string; time: number } | null>(null);
  const pendingPlayRef = useRef<{ time: number } | null>(null);

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const parseCommand = useCallback((rawText: string) => {
    if (!isListeningRef.current) return;
    if (!HAS_LETTERS.test(rawText)) return;
    if (!cleanTranscript(rawText)) {
      log("noise filtered:", rawText);
      return;
    }

    handlersRef.current.onTranscript?.(rawText);

    const now = Date.now();
    const t = normalizeText(rawText);
    if (!t) return;

    if (pendingPlaylistRef.current) {
      const pending = pendingPlaylistRef.current;
      pendingPlaylistRef.current = null;
      if (now - pending.time <= 8000) {
        const combined = pending.text + " " + t;
        log("generate playlist (combined):", combined);
        handlersRef.current.onGeneratePlaylist(combined);
        return;
      }
      log("generate playlist (pending expired):", pending.text);
      handlersRef.current.onGeneratePlaylist(pending.text);
    }

    if (t === lastCommandRef.current.text && now - lastCommandRef.current.time < 2000) return;
    lastCommandRef.current = { text: t, time: now };

    log("input:", t);

    if (pendingPlayRef.current && now - pendingPlayRef.current.time <= 5000) {
      pendingPlayRef.current = null;
      const isOtherCommand =
        NEXT_REGEX.test(t) ||
        PAUSE_REGEX.test(t) ||
        PREVIOUS_REGEX.test(t) ||
        FAVORITE_REGEX.test(t) ||
        RECORD_REGEX.test(t) ||
        PLAY_TRIGGER_ONLY_REGEX.test(t) ||
        PLAYLIST_REGEX.test(t);
      if (!isOtherCommand) {
        log("play (buffered):", t);
        handlersRef.current.onPlay(t);
        return;
      }
    }
    pendingPlayRef.current = null;

    if (PLAY_TRIGGER_ONLY_REGEX.test(t)) {
      log("play trigger pending, waiting for query...");
      pendingPlayRef.current = { time: now };
      return;
    }

    const playMatch = t.match(PLAY_REGEX);
    if (playMatch?.[1]?.trim()) {
      log("play:", playMatch[1].trim());
      handlersRef.current.onPlay(playMatch[1].trim());
      return;
    }
    const playQuery = extractAfterCommand(t, VOICE_COMMANDS.play);
    if (playQuery) {
      log("play (fuzzy):", playQuery);
      handlersRef.current.onPlay(playQuery);
      return;
    }

    if (PLAYLIST_REGEX.test(t) || fuzzyIncludes(t, VOICE_COMMANDS.playlist)) {
      const desc = extractAfterCommand(t, VOICE_COMMANDS.playlist);
      const descWordCount = desc ? desc.split(" ").filter(Boolean).length : 0;
      if (descWordCount >= 2) {
        log("generate playlist:", t);
        handlersRef.current.onGeneratePlaylist(t);
      } else {
        log("playlist pending, waiting for description...");
        pendingPlaylistRef.current = { text: t, time: now };
      }
      return;
    }

    if (RECORD_REGEX.test(t)) {
      log("record toggle");
      handlersRef.current.onRecord();
      return;
    }

    if (FAVORITE_REGEX.test(t)) {
      log("favorite");
      handlersRef.current.onFavorite();
      return;
    }

    if (UNFAVORITE_REGEX.test(t)) {
      log("unfavorite");
      handlersRef.current.onUnfavorite?.();
      return;
    }

    if (NEXT_REGEX.test(t)) {
      log("next");
      handlersRef.current.onNext();
      return;
    }

    if (PREVIOUS_REGEX.test(t)) {
      log("previous");
      handlersRef.current.onPrevious();
      return;
    }

    if (PAUSE_REGEX.test(t)) {
      log("pause");
      handlersRef.current.onPause();
      return;
    }

    log("no match:", t);
  }, []);

  const sendChunkToWhisper = useCallback(async (blob: Blob) => {
    if (!isListeningRef.current) return;
    if (blob.size < 15000) return;

    try {
      const formData = new FormData();
      formData.append("audio", blob, "chunk.webm");

      const res = await fetch(`${API_URL}/voice/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) return;
      if (!isListeningRef.current) return;
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

      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";

      const startRecordingCycle = () => {
        if (!isListeningRef.current || !streamRef.current) return;

        const recorder = new MediaRecorder(streamRef.current, { mimeType });
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) sendChunkToWhisper(e.data);
        };

        recorder.onstop = () => {
          startRecordingCycle();
        };

        recorder.start();
        setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
        }, 3000);
      };

      startRecordingCycle();

      log("listening started (Whisper multilingual)");
    } catch (err) {
      console.warn("Microphone access denied:", err);
      isListeningRef.current = false;
    }
  }, [sendChunkToWhisper]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    log("listening stopped");
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, []);

  return { startListening, stopListening };
}