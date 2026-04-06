import { useEffect, useState, useRef, useCallback } from "react";
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

  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

 
  const offsetRef = useRef(0);

  const searchIdRef = useRef(0);

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


  const handleSpotifySearch = useCallback(
    async (newSearch = false) => {
      if (!spotifyQuery.trim()) return;


      const currentSearchId = ++searchIdRef.current;

      if (newSearch) {
        offsetRef.current = 0;
        setSpotifyResults([]);
        setHasMore(true);
      }

      const currentOffset = offsetRef.current;

      setHasSearched(true);
      setLoadingSpotify(true);

      try {
        const res = await searchSpotify(spotifyQuery, currentOffset);

    
        if (currentSearchId !== searchIdRef.current) return;

        const newItems: any[] = res?.tracks?.items ?? [];

        setSpotifyResults((prev) =>
          newSearch ? newItems : [...prev, ...newItems],
        );

       
        offsetRef.current = currentOffset + newItems.length;

        setHasMore(newItems.length >= LIMIT);
      } catch (e) {
        console.error(e);
      } finally {
     
        if (currentSearchId === searchIdRef.current) {
          setLoadingSpotify(false);
        }
      }
    },
    [spotifyQuery],
  );

 
  useEffect(() => {
    if (!spotifyQuery.trim()) {
      setSpotifyResults([]);
      offsetRef.current = 0;
      setHasMore(true);
      return;
    }

    const timeout = setTimeout(() => {
      handleSpotifySearch(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [spotifyQuery, handleSpotifySearch]);

  const loadMore = useCallback(() => {
    if (!loadingSpotify && hasMore) {
      handleSpotifySearch(false);
    }
  }, [loadingSpotify, hasMore, handleSpotifySearch]);

  const selectTrack = useCallback((track: any) => {
    setIsPlayerLoading(true);
    setSelectedTrack(track);
  }, []);

  const toggleFavorite = useCallback((track: any) => {
    setFavorites((prev) =>
      prev.find((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track],
    );
  }, []);

  const removeFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  const isFavorite = useCallback(
    (trackId: string) => favorites.some((t) => t.id === trackId),
    [favorites],
  );

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
    loadMore,
    hasMore,
  };
}
