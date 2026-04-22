import { Loader2, Music, Search } from "lucide-react";
import TrackItem from "./TrackItem";
import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        className="rounded-xl p-4 sm:p-6 transition-all duration-300 relative overflow-hidden"
        style={
          isDark
            ? {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(52,211,153,0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.3), 0 0 40px rgba(52,211,153,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
              }
            : {
                backgroundColor: "var(--bg-card)",
                boxShadow: "var(--shadow-card)",
                border: "1px solid rgba(52,211,153,0.1)",
              }
        }
      >
        {/* Top accent line */}
        {isDark && (
          <div
            className="absolute top-0 left-6 right-6 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), rgba(16,185,129,0.4), transparent)",
            }}
          />
        )}

        {/* Corner glow */}
        {isDark && (
          <div
            className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
            style={{
              background: "radial-gradient(circle at top right, rgba(52,211,153,0.08) 0%, transparent 70%)",
            }}
          />
        )}

        <div className="space-y-3 relative">
          {/* Search input */}
          <div className="relative">
            <input
              value={spotifyQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Search music..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={
                isDark
                  ? {
                      backgroundColor: inputFocused
                        ? "rgba(52,211,153,0.06)"
                        : "rgba(255,255,255,0.05)",
                      border: inputFocused
                        ? "1px solid rgba(52,211,153,0.5)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: inputFocused
                        ? "0 0 0 3px rgba(52,211,153,0.1), 0 0 20px rgba(52,211,153,0.08)"
                        : "none",
                      color: "var(--text-primary)",
                      backdropFilter: "blur(6px)",
                    }
                  : {
                      backgroundColor: "var(--bg-card-hover)",
                      border: inputFocused
                        ? "1px solid rgba(52,211,153,0.5)"
                        : "1px solid var(--border-color)",
                      boxShadow: inputFocused
                        ? "0 0 0 3px rgba(52,211,153,0.1)"
                        : "none",
                      color: "var(--text-primary)",
                    }
              }
            />
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
              style={{
                color: inputFocused
                  ? isDark ? "rgba(52,211,153,0.8)" : "rgb(16,185,129)"
                  : "var(--text-faint)",
              }}
            >
              <Music className="w-4 h-4" />
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={onSearch}
            className="w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 relative overflow-hidden group"
            style={
              isDark
                ? {
                    background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.15))",
                    border: "1px solid rgba(52,211,153,0.35)",
                    color: "rgba(110,231,183,0.95)",
                    boxShadow: "0 0 20px rgba(52,211,153,0.12)",
                  }
                : {
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
                  }
            }
            onMouseEnter={(e) => {
              if (isDark) {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(52,211,153,0.28), rgba(16,185,129,0.22))";
                e.currentTarget.style.boxShadow = "0 0 28px rgba(52,211,153,0.2)";
                e.currentTarget.style.borderColor = "rgba(52,211,153,0.5)";
              } else {
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.4)";
                e.currentTarget.style.transform = "scale(1.01)";
              }
            }}
            onMouseLeave={(e) => {
              if (isDark) {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.15))";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(52,211,153,0.12)";
                e.currentTarget.style.borderColor = "rgba(52,211,153,0.35)";
              } else {
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(16,185,129,0.3)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {/* Button glow sweep */}
            {isDark && (
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.08) 50%, transparent 100%)",
                }}
              />
            )}
            <Search className="w-4 h-4" />
            Search Music
          </button>
        </div>

        {/* AI Queue */}
        {aiQueue.length > 0 ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: isDark ? "rgba(52,211,153,0.8)" : "rgb(16,185,129)",
                    boxShadow: isDark ? "0 0 6px rgba(52,211,153,0.6)" : "none",
                  }}
                />
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: isDark ? "rgba(110,231,183,0.7)" : "rgb(6,95,70)",
                  }}
                >
                  AI Playlist · {aiQueue.length} tracks
                </p>
              </div>
            </div>
            <div
              className="space-y-2 max-h-64 overflow-y-auto pr-1.5"
              style={isDark ? { scrollbarWidth: "thin", scrollbarColor: "rgba(52,211,153,0.3) transparent" } : {}}
            >
              {aiQueue.map((track, index) => (
                <TrackItem
                  key={`${track.id}-${index}`}
                  track={{ ...track, artists: track.artists ?? [{ name: track.artist ?? "Unknown" }] }}
                  isActive={selectedTrack?.id === track.id}
                  activeColor="green"
                  onSelect={() => onSelectTrack(track)}
                  isFavorite={isFavorite(track.id)}
                  onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(track); }}
                />
              ))}
            </div>
          </div>

        ) : loadingSpotify ? (
          <div className="flex justify-center py-6">
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: isDark ? "rgba(110,231,183,0.6)" : "var(--text-muted)" }}
            >
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Searching...</span>
            </div>
          </div>

        ) : spotifyResults.length > 0 ? (
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="space-y-2 max-h-64 overflow-y-auto pr-1.5 mt-4"
            style={isDark ? { scrollbarWidth: "thin", scrollbarColor: "rgba(52,211,153,0.3) transparent" } : {}}
          >
            {spotifyResults.map((track) => (
              <TrackItem
                key={track.id}
                track={{ ...track, artists: track.artists ?? [{ name: track.artist ?? "Unknown" }] }}
                isActive={selectedTrack?.id === track.id}
                activeColor="green"
                onSelect={() => onSelectTrack(track)}
                isFavorite={isFavorite(track.id)}
                onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(track); }}
              />
            ))}
            {!hasMore && spotifyResults.length > 0 && (
              <p
                className="text-center text-xs py-2"
                style={{ color: "var(--text-faint)" }}
              >
                · No more results ·
              </p>
            )}
          </div>

        ) : hasSearched && spotifyResults.length === 0 ? (
          <div className="text-center py-8">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-3"
              style={
                isDark
                  ? { background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)" }
                  : { background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }
              }
            >
              <Music className="w-5 h-5" style={{ color: isDark ? "rgba(110,231,183,0.4)" : "rgba(16,185,129,0.4)" }} />
            </div>
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              No tracks found
            </p>
          </div>
        ) : null}

        {/* Spotify Player */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            playerSrc ? "mt-4 max-h-[160px]" : "max-h-0"
          }`}
        >
          <div
            className="relative h-[152px] rounded-xl overflow-hidden"
            style={
              isDark
                ? {
                    border: "1px solid rgba(52,211,153,0.2)",
                    boxShadow: "0 0 24px rgba(52,211,153,0.08)",
                  }
                : {}
            }
          >
            {isPlayerLoading && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl z-10"
                style={{
                  backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.1)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Loader2
                  className="animate-spin w-5 h-5"
                  style={{ color: isDark ? "rgba(110,231,183,0.7)" : "var(--text-muted)" }}
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
                className="rounded-xl"
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