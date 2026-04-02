import { Loader2, Music, Search } from "lucide-react";
import TrackItem from "./TrackItem";

interface SpotifyPanelProps {
  spotifyQuery: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  loadingSpotify: boolean;
  spotifyResults: any[];
  hasSearched: boolean;
  selectedTrack: any | null;
  playerSrc: string;
  isPlayerLoading: boolean;
  onPlayerLoad: () => void;
  onSelectTrack: (track: any) => void;
  isFavorite: (trackId: string) => boolean;
  onToggleFavorite: (track: any) => void;
}

const SpotifyPanel = ({
  spotifyQuery,
  onQueryChange,
  onSearch,
  loadingSpotify,
  spotifyResults,
  hasSearched,
  selectedTrack,
  playerSrc,
  isPlayerLoading,
  onPlayerLoad,
  onSelectTrack,
  isFavorite,
  onToggleFavorite,
}: SpotifyPanelProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <input
              value={spotifyQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search music..."
              className="
                w-full pl-11 pr-4 py-3
                rounded-xl border border-gray-200
                bg-gray-50
                focus:bg-white focus:border-green-400
                focus:ring-2 focus:ring-green-100
                outline-none
                text-sm text-gray-700
                placeholder:text-gray-400
                transition-all duration-200
              "
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Music className="w-4 h-4" />
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={onSearch}
            className="
              w-full
              bg-gradient-to-r from-green-500 to-emerald-600
              text-white font-semibold
              py-3 rounded-xl
              shadow-md
              hover:shadow-lg
              hover:scale-[1.01]
              active:scale-[0.99]
              transition-all duration-200
              flex items-center justify-center gap-2
            "
          >
            <Search className="w-4 h-4" />
            Search Music
          </button>
        </div>

        {/* Results */}
        {loadingSpotify ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : spotifyResults.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1.5  mt-4 custom-scroll">
            {spotifyResults.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                isActive={selectedTrack?.id === track.id}
                activeColor="green"
                onSelect={() => onSelectTrack(track)}
                isFavorite={isFavorite(track.id)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(track);
                }}
              />
            ))}
          </div>
        ) : hasSearched && spotifyResults.length === 0 ? (
          <p className="text-center text-sm text-gray-400 pt-4">
            No tracks found
          </p>
        ) : null}

        {/* Player */}
        <div
          className={`
            transition-all duration-300 overflow-hidden
            ${playerSrc ? "mt-4 max-h-[152px]" : "max-h-0"}
          `}
        >
          <div className="relative h-[152px]">
            {isPlayerLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg z-10">
                <Loader2 className="animate-spin text-gray-400" />
              </div>
            )}
            {playerSrc && (
              <iframe
                src={playerSrc}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen"
                loading="lazy"
                className="rounded-lg shadow-md"
                onLoad={onPlayerLoad}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPanel;
