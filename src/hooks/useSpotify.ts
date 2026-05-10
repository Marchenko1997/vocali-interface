import { useEffect, useState, useRef, useCallback } from "react";
import { searchSpotify } from "../services/spotify";

const LIMIT = 10;

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

  const offsetRef = useRef(0);
  const searchIdRef = useRef(0);
  const isFetchingRef = useRef(false);
  const skipDebounceRef = useRef(false);

  // Clean invalid favorites on mount
  useEffect(() => {
    const cleaned = favorites.filter((t) => t && t.id && t.name && t.artists);
    if (cleaned.length !== favorites.length) setFavorites(cleaned);
  }, []);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Debounce player src update
useEffect(() => {
  if (!selectedTrack) return;
  const timeout = setTimeout(() => {
    setPlayerSrc(
      `https://open.spotify.com/embed/track/${selectedTrack.id}?autoplay=1`, 
    );
  }, 150);
  return () => clearTimeout(timeout);
}, [selectedTrack]);

  // Reset hasSearched when query changes
  useEffect(() => {
    setHasSearched(false);
  }, [spotifyQuery]);

  const handleSpotifySearch = useCallback(
  
    async (newSearch = false) => {
      console.log("handleSpotifySearch CALLED");
      if (!spotifyQuery.trim()) return;
      if (isFetchingRef.current) return;

      const currentSearchId = ++searchIdRef.current;
      isFetchingRef.current = true;

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

      console.log("Spotify raw items:", res?.tracks?.items);

      const newItems: any[] =
        res?.tracks?.items?.map((track: any) => ({
          ...track,

          artists: track.artists.map((artist: any) => {
            console.log("Artist before mapping:", artist);

            return {
              id: artist.id,
              name: artist.name,
              url: artist.external_urls.spotify,
            };
          }),
        })) ?? [];

        setSpotifyResults((prev) => {
          if (newSearch) return newItems;
          const existingIds = new Set(prev.map((t) => t.id));
          const unique = newItems.filter((t) => !existingIds.has(t.id));
          return [...prev, ...unique];
        });

        offsetRef.current = currentOffset + newItems.length;
        setHasMore(newItems.length >= LIMIT);
      } catch (e) {
        console.error(e);
      } finally {
        if (currentSearchId === searchIdRef.current) {
          setLoadingSpotify(false);
          isFetchingRef.current = false;
        }
      }
    },
    [spotifyQuery],
  );

  // Debounce поиска при вводе
  useEffect(() => {
    if (!spotifyQuery.trim()) {
      setSpotifyResults([]);
      offsetRef.current = 0;
      setHasMore(true);
      return;
    }

    // Пропускаем если запрос пришёл из playByVoice
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      handleSpotifySearch(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [spotifyQuery, handleSpotifySearch]);

  const loadMore = useCallback(() => {
    if (!loadingSpotify && hasMore) handleSpotifySearch(false);
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

  const playNext = useCallback(() => {
    if (!selectedTrack || spotifyResults.length === 0) return;
    const idx = spotifyResults.findIndex((t) => t.id === selectedTrack.id);
    const next = spotifyResults[idx + 1];
    if (next) selectTrack(next);
  }, [selectedTrack, spotifyResults, selectTrack]);

  const playPrevious = useCallback(() => {
    if (!selectedTrack || spotifyResults.length === 0) return;
    const idx = spotifyResults.findIndex((t) => t.id === selectedTrack.id);
    const prev = spotifyResults[idx - 1];
    if (prev) selectTrack(prev);
  }, [selectedTrack, spotifyResults, selectTrack]);

  const pauseTrack = useCallback(() => {
    setPlayerSrc("");
    setSelectedTrack(null);
  }, []);

  const playByVoice = useCallback(
    async (query: string) => {
      try {
        const res = await searchSpotify(query, 0);
        const items: any[] =
          res?.tracks?.items?.map((track: any) => ({
            ...track,
            artists: track.artists.map((artist: any) => ({
              id: artist.id,
              name: artist.name,
              url: artist.external_urls.spotify,
            })),
          })) ?? [];

        if (items.length > 0) {
          // Блокируем дебаунс перед setSpotifyQuery
          skipDebounceRef.current = true;
          // Отменяем любой pending запрос
          searchIdRef.current++;
          // Сбрасываем isFetching на случай если висел
          isFetchingRef.current = false;

          setSpotifyQuery(query);
          setSpotifyResults(items);
          offsetRef.current = items.length;
          setHasMore(items.length >= LIMIT);
          setHasSearched(true);
          selectTrack(items[0]);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [selectTrack],
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
    playNext,
    playPrevious,
    pauseTrack,
    playByVoice,
  };
}
