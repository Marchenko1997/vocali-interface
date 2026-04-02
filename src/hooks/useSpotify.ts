import { useEffect, useState } from "react";
import { searchSpotify } from "../services/spotify";

export function useSpotify() {
  const [spotifyQuery, setSpotifyQuery] = useState("");
  const [spotifyResults, setSpotifyResults] = useState<any[]>([]);
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedTrack, setSelectedTrack] = useState<any | null>(null);
  const [playerSrc, setPlayerSrc] = useState("");
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);

  const [favorites, setFavorites] = useState<any[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Clean invalid favorites on mount
  useEffect(() => {
    const cleaned = favorites.filter((t) => t && t.id && t.name && t.artists);
    if (cleaned.length !== favorites.length) {
      setFavorites(cleaned);
    }
  }, []);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Debounce player src update
  useEffect(() => {
    if (!selectedTrack) return;
    const timeout = setTimeout(() => {
      setPlayerSrc(`https://open.spotify.com/embed/track/${selectedTrack.id}`);
    }, 150);
    return () => clearTimeout(timeout);
  }, [selectedTrack]);

  // Reset hasSearched when query changes
  useEffect(() => {
    setHasSearched(false);
  }, [spotifyQuery]);

  const handleSpotifySearch = async () => {
    if (!spotifyQuery) return;
    setHasSearched(true);
    setLoadingSpotify(true);
    try {
      const res = await searchSpotify(spotifyQuery);
      setSpotifyResults(res.tracks.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSpotify(false);
    }
  };

  const selectTrack = (track: any) => {
    setIsPlayerLoading(true);
    setSelectedTrack(track);
  };

  const toggleFavorite = (track: any) => {
    setFavorites((prev) =>
      prev.find((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track],
    );
  };

  const removeFavorite = (trackId: string) => {
    setFavorites((prev) => prev.filter((t) => t.id !== trackId));
  };

  const isFavorite = (trackId: string) =>
    favorites.some((t) => t.id === trackId);

  return {
    spotifyQuery,
    setSpotifyQuery,
    spotifyResults,
    loadingSpotify,
    hasSearched,
    selectedTrack,
    playerSrc,
    isPlayerLoading,
    setIsPlayerLoading,
    favorites,
    handleSpotifySearch,
    selectTrack,
    toggleFavorite,
    removeFavorite,
    isFavorite,
  };
}
