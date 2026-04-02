import type { Dispatch, SetStateAction } from "react";

export interface RealTimeRecordingProps {
  onTranscriptionComplete: (text: string, audioBlob?: Blob) => Promise<void>;
  onError: (error: string) => void;
  isSaving?: boolean;
}

export interface RecordingInterfaceProps {
  isRecording: boolean;
  isConnecting: boolean;
  transcription: string;
  finalTranscription: string;
  error: string | null;
  audioLevel: number;
  connectionStatus: string;
  showPlayback: boolean;
  isPlaying: boolean;
  audioUrl: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onTranscriptionComplete: (text: string, audioBlob?: Blob) => Promise<void>;
  onError: (error: string) => void;
  onPlayPause: () => void;
  onSave: () => Promise<void>;
  onRerecord: () => void;
  setFinalTranscription: Dispatch<SetStateAction<string>>;
  setIsPlaying: (playing: boolean) => void;
  accumulatedTranscript: string;
  setAccumulatedTranscript: Dispatch<SetStateAction<string>>;

  websocketRef: React.MutableRefObject<WebSocket | null>;
  recognitionStartedRef: React.MutableRefObject<boolean>;
  audioChunkCountRef: React.MutableRefObject<number>;
  setTranscription: (text: string) => void;
  setConnectionStatus: (status: string) => void;
  audioElementRef: React.MutableRefObject<HTMLAudioElement | null>;
  isSaving?: boolean;
}
