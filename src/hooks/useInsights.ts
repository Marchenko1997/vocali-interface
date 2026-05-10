import { useState, useEffect, useCallback } from "react";
import { lastfm } from "../services/lastfmApi";
import type { TopArtist, TopTrack, Tag, ArtistAlbum } from "../types/insights";
import { searchSpotifyTrack } from "../services/spotify";

export const useInsights = () => {
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [artistTopTracks, setArtistTopTracks] = useState<TopTrack[]>([]);
  const [artistTracksLoading, setArtistTracksLoading] = useState(false);
  const [artistAlbums, setArtistAlbums] = useState<ArtistAlbum[]>([]);
  const [artistAlbumsLoading, setArtistAlbumsLoading] = useState(false);


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

       const tracksWithSpotifyImages = await Promise.all(
         (tracksRes.tracks?.track ?? []).map(async (track: any) => {
           try {
             const spotify = await searchSpotifyTrack(
               `${track.name} ${track.artist.name}`,
             );

             const spotifyTrack = spotify?.tracks?.items?.[0];

             return {
               ...track,
               spotifyImage: spotifyTrack?.album?.images?.[1]?.url || "",
             };
           } catch {
             return {
               ...track,
               spotifyImage: "",
             };
           }
         }),
       );

       setTopTracks(tracksWithSpotifyImages);
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
  
  useEffect(() => {
    if (!selectedArtist) return;
    setArtistAlbumsLoading(true);
    lastfm
      .getArtistTopAlbums(selectedArtist, 8)
      .then((data) => setArtistAlbums(data.topalbums?.album ?? []))
      .finally(() => setArtistAlbumsLoading(false));
  }, [selectedArtist]);
  


useEffect(() => {
  if (!selectedArtist) return;

  const loadArtistTracks = async () => {
    try {
      setArtistTracksLoading(true);

      const data = await lastfm.getArtistTopTracks(selectedArtist, 10);

      const tracksWithSpotifyImages = await Promise.all(
        (data.toptracks?.track ?? []).map(async (track: any) => {
          try {
            const spotify = await searchSpotifyTrack(
              `${track.name} ${track.artist.name}`,
            );

            const spotifyTrack = spotify?.tracks?.items?.[0];

            return {
              ...track,
              spotifyImage: spotifyTrack?.album?.images?.[1]?.url || "",
            };
          } catch {
            return {
              ...track,
              spotifyImage: "",
            };
          }
        }),
      );

      setArtistTopTracks(tracksWithSpotifyImages);
    } finally {
      setArtistTracksLoading(false);
    }
  };

  loadArtistTracks();
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
    artistAlbums,
    artistAlbumsLoading,
    artistTopTracks,
    artistTracksLoading,
    handleSearch,
    loading,
    error,
  };
};
