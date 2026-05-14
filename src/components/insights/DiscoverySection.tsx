import SimilarArtistsChart from "./SimilarArtistsChart";
import SimilarTracksList from "./SimilarTracksList";
import TagDiscoveryGrid from "./TagDiscoveryGrid";

interface DiscoverySectionProps {
  isDark: boolean;
  selectedArtist: string | null;
  similarArtists: any[];
  similarTracks: any[];
  tagArtists: any[];
  setSelectedArtist: (artist: string) => void;
  handleGenreSelect: (genre: string) => void;
}

const DiscoverySection = ({
  isDark,
  selectedArtist,
  similarArtists,
  similarTracks,
  tagArtists,
  setSelectedArtist,
  handleGenreSelect,
}: DiscoverySectionProps) => {
  if (!selectedArtist) return null;

  const similarArtistsData = similarArtists.map((a) => ({
    name: a.name.length > 14 ? a.name.slice(0, 14) + "…" : a.name,
    match: Math.round(parseFloat(a.match || "0") * 100),
    fullName: a.name,
  }));

  const similarTracksData = similarTracks.map((t) => ({
    name: t.name,
    artist: t.artist,
    match: Math.round(parseFloat(t.match || "0") * 100),
  }));

  const tagArtistsData = tagArtists.map((a) => ({
    name: a.name,
    listeners: parseInt(a.listeners || "0"),
  }));

  return (
    <section className="space-y-6">
      <SimilarArtistsChart
        data={similarArtistsData}
        isDark={isDark}
        onBarClick={setSelectedArtist}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="self-start">
          <SimilarTracksList data={similarTracksData} isDark={isDark} />
        </div>

        <div className="self-start">
          <TagDiscoveryGrid
            data={tagArtistsData}
            isDark={isDark}
            onTagClick={handleGenreSelect}
          />
        </div>
      </div>
    </section>
  );
};

export default DiscoverySection;
