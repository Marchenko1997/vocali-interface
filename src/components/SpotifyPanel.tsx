import { Loader2, Music, Search } from "lucide-react";
import TrackItem from "./TrackItem";
import { useRef, useState } from "react";

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
  loadMore: () => void;
  hasMore: boolean;
  aiQueue?: any[];
  isGenerating?: boolean;
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
  loadMore,
  hasMore,
  aiQueue = [],
}: SpotifyPanelProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const handleScroll = () => {
    if (!listRef.current || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (!loadingSpotify) loadMore();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-xl p-4 sm:p-6 transition-colors duration-300"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <input
              value={spotifyQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Search music..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-card-hover)",
                border: inputFocused
                  ? "1px solid rgba(74,222,128,0.6)"
                  : "1px solid var(--border-color)",
                boxShadow: inputFocused
                  ? "0 0 0 3px rgba(74,222,128,0.12)"
                  : "none",
                color: "var(--text-primary)",
              }}
            />
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-faint)" }}
            >
              <Music className="w-4 h-4" />
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={onSearch}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold
              py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]
              transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Music
          </button>
        </div>

        {/* AI Queue OR Search Results */}
        {aiQueue.length > 0 ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-faint)" }}
              >
                AI Playlist · {aiQueue.length} tracks
              </p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1.5 custom-scroll">
              {aiQueue.map((track, index) => (
                <TrackItem
                  key={`${track.id}-${index}`}
                  track={{
                    ...track,
                    artists: track.artists ?? [
                      { name: track.artist ?? "Unknown" },
                    ],
                  }}
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
          </div>
        ) : loadingSpotify ? (
          <div className="flex justify-center py-4">
            <Loader2
              className="animate-spin"
              style={{ color: "var(--text-faint)" }}
            />
          </div>
        ) : spotifyResults.length > 0 ? (
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="space-y-2 max-h-64 overflow-y-auto pr-1.5 mt-4 custom-scroll"
          >
            {spotifyResults.map((track) => (
              <TrackItem
                key={track.id}
                track={{
                  ...track,
                  artists: track.artists ?? [
                    { name: track.artist ?? "Unknown" },
                  ],
                }}
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
            {!hasMore && spotifyResults.length > 0 && (
              <p
                className="text-center text-xs py-2"
                style={{ color: "var(--text-faint)" }}
              >
                No more results
              </p>
            )}
          </div>
        ) : hasSearched && spotifyResults.length === 0 ? (
          <p
            className="text-center text-sm pt-4"
            style={{ color: "var(--text-faint)" }}
          >
            No tracks found
          </p>
        ) : null}

        {/* Player */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            playerSrc ? "mt-4 max-h-[152px]" : "max-h-0"
          }`}
        >
          <div className="relative h-[152px]">
            {isPlayerLoading && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
                style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
              >
                <Loader2
                  className="animate-spin"
                  style={{ color: "var(--text-faint)" }}
                />
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
