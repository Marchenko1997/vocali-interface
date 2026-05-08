import { useInsights } from "../hooks/useInsights";
import { useTheme } from "../context/ThemeContext";
import InsightsHeader from "../components/insights/InsightsHeader";
import InsightsEmpty from "../components/insights/InsightsEmpty";
import StatsRow from "../components/insights/StatsRow";
import TopArtistsChart from "../components/insights/TopArtistsChart";
import GenreDonut from "../components/insights/GenreDonut";
import TopTracksList from "../components/insights/TopTracksList";
import SplashScreen from "../components/SplashScreen";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TopAlbumsGrid from "../components/insights/TopAlbumsGrid";
import { lastfm } from "../services/lastfmApi";
import GenreArtistsModal from "../components/insights/GenreArtistsModal";


const Insights = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(
    () => location.state?.showSplash === true,
  );
  const [genreModalOpen, setGenreModalOpen] = useState(false);
  const [genreArtists, setGenreArtists] = useState<any[]>([]);
  const [genreName, setGenreName] = useState("");


  const handleGenreSelect = async (genre: string) => {
    try {
      const data = await lastfm.getTagTopArtists(genre, 12);

      const artists = (data.topartists?.artist ?? []).map((a: any) => ({
        ...a,
        spotifyImg: "",
      }));

      setGenreName(genre);
      setGenreArtists(artists);
      setGenreModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const {
    topArtists,
    topTracks,
    tags,
    selectedArtist,
    setSelectedArtist,
    searchQuery,
    setSearchQuery,
    handleSearch,
    artistTopTracks,
    artistTracksLoading,
    artistAlbums,
    artistAlbumsLoading,
    loading,
    error,
  } = useInsights();

  const barData = topArtists.slice(0, 8).map((a) => ({
    name: a.name.length > 14 ? a.name.slice(0, 14) + "…" : a.name,
    listeners: parseInt(a.listeners),
    fullName: a.name,
  }));

  if (showSplash) {
    return <SplashScreen title="Welcome to Vocali Insights" />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: isDark ? "#060611" : "#f5f3ff" }}
    >
      <InsightsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isDark={isDark}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <InsightsEmpty error={error} isDark={isDark} />

        {!loading && !error && (
          <>
            <StatsRow
              topArtists={topArtists}
              topTracks={topTracks}
              tags={tags}
              selectedArtist={selectedArtist}
              isDark={isDark}
            />

            <TopArtistsChart
              data={barData}
              isDark={isDark}
              onBarClick={setSelectedArtist}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <GenreDonut
                  tags={tags}
                  selectedArtist={selectedArtist}
                  isDark={isDark}
                  onGenreClick={handleGenreSelect}
                />
                <GenreArtistsModal
                  isOpen={genreModalOpen}
                  onClose={() => setGenreModalOpen(false)}
                  genreName={genreName}
                  artists={genreArtists}
                  isDark={isDark}
                />
              </div>
              <TopTracksList
                topTracks={topTracks}
                artistTopTracks={artistTopTracks}
                selectedArtist={selectedArtist}
                artistTracksLoading={artistTracksLoading}
                isDark={isDark}
              />
            </div>
            {selectedArtist && (
              <TopAlbumsGrid
                albums={artistAlbums}
                selectedArtist={selectedArtist}
                loading={artistAlbumsLoading}
                isDark={isDark}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Insights;
