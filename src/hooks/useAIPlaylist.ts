import { useState } from "react";
import api from "../services/api";

interface AITrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration_ms: number;
  preview_url: string | null;
  image: string | null;
  uri: string;
}

interface AIPlaylistResult {
  ai_params: {
    search_query: string;
    genre: string;
    bpm_hint: string;
    duration_minutes: number;
    tracks_needed: number;
  };
  tracks: AITrack[];
}

export function useAIPlaylist() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [queue, setQueue] = useState<AITrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aiParams, setAiParams] = useState<
    AIPlaylistResult["ai_params"] | null
  >(null);

  const generatePlaylist = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token"); 
      const { data } = await api.post<AIPlaylistResult>(
        `/ai/playlist?token=${token}`, 
        { prompt },
      );
      setQueue(data.tracks ?? []);
      setAiParams(data.ai_params ?? null);
      setCurrentIndex(0);
      return data.tracks ?? [];
    } catch (error) {
      console.error("Failed to generate playlist:", error);
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const nextTrack = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, queue.length - 1));

  const prevTrack = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const currentTrack = queue.length > 0 ? queue[currentIndex] : null;

  return {
    generatePlaylist,
    isGenerating,
    queue,
    currentTrack,
    currentIndex,
    nextTrack,
    prevTrack,
    aiParams,
  };
}
