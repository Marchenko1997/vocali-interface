import { useState, useEffect, useCallback } from "react";
import { lastfm } from "../services/lastfmApi";
import type { TopArtist, TopTrack, Tag } from "../types/insights";

export const useInsights = () => {
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [artistsRes, tracksRes] = await Promise.all([
          lastfm.getTopArtists(12),
          lastfm.getTopTracks(10),
        ]);
       setTopArtists(artistsRes.artists?.artist ?? []);
        setTopTracks(tracksRes.tracks?.track ?? []);
      } catch (error) {
        setError("Failed to load data from Last.fm");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
    
    useEffect(() => {
        if (!selectedArtist) return;
        
        lastfm.getArtistTopTags(selectedArtist).then(
          (res) => setTags(res.toptags?.tag?.slice(0, 6) ?? []),
          //          
        );


    }, [selectedArtist]);

    const handleSearch = useCallback(async() => {
        if (!searchQuery.trim()) return;
        try {
            setLoading(true);
            const res = await lastfm.searchArtist(searchQuery)
            setTopArtists(res.results?.artistmatches?.artist ?? []);
        } catch (error) {
             setError("Search failed");
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    
  return {
    topArtists,
    topTracks,
    tags,
    selectedArtist,
    setSelectedArtist,
    searchQuery,
    setSearchQuery,
    handleSearch,
    loading,
    error,
  };
};
