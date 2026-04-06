import { useEffect, useRef, useCallback } from "react";
import {
  PLAY_REGEX,
  VOICE_COMMANDS,

} from "../constants/voiceCommands";

interface VoiceCommandHandlers {
  onPlay: (query?: string) => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onFavorite: () => void;
  onRecord: () => void;
}

export function useVoiceCommands(handlers: VoiceCommandHandlers) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const isStartedRef = useRef(false);

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const parseCommand = useCallback((text: string) => {
    const t = text.toLowerCase().trim();
    console.log("Voice input:", t);

   
    const playMatch = t.match(PLAY_REGEX);
    if (playMatch) {
      console.log("▶ play:", playMatch[1]);
      handlersRef.current.onPlay(playMatch[1]);
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

    console.log("✗ no match");
  }, []);

  const startRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isStartedRef.current) return;
    try {
      isStartedRef.current = true;
      recognition.start();
    } catch {
      isStartedRef.current = false;
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    if (isListeningRef.current) return;
    isListeningRef.current = true;


    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
   

    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (!last.isFinal) return;
      parseCommand(last[0].transcript);
    };

    recognition.onerror = (e) => {
      console.warn("Voice error:", e.error);
      isStartedRef.current = false;
      if (e.error === "aborted" || e.error === "network") {
        setTimeout(() => {
          if (isListeningRef.current) startRecognition();
        }, 500);
      }
    };

    recognition.onend = () => {
      isStartedRef.current = false;
      if (isListeningRef.current) {
        setTimeout(() => startRecognition(), 100);
      }
    };

    recognitionRef.current = recognition;
    startRecognition();
  }, [parseCommand, startRecognition]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    isStartedRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
    
    }
    recognitionRef.current = null;
  }, []);

  useEffect(() => {
    return () => stopListening();
  }, [stopListening]);

  return { startListening, stopListening };
}
