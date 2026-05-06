import type { TopTrack } from "../../types/insights";

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#38bdf8",
  "#34d399",
  "#f59e0b",
  "#f87171",
];
const GLOW_COLORS = [
  "rgba(168,85,247,0.5)",
  "rgba(236,72,153,0.5)",
  "rgba(56,189,248,0.5)",
  "rgba(52,211,153,0.5)",
  "rgba(245,158,11,0.5)",
  "rgba(248,113,113,0.5)",
];

const fmt = (n: string) => {
  const num = parseInt(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
};

interface TopTracksListProps {
  topTracks: TopTrack[];
  artistTopTracks: TopTrack[];
  selectedArtist: string | null;
  artistTracksLoading: boolean;
  isDark: boolean;
}

const TopTracksList = ({
  topTracks,
  artistTopTracks,
  selectedArtist,
  artistTracksLoading,
  isDark,
}: TopTracksListProps) => {
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.38)" : "#6b7280";

  const isArtistMode = !!selectedArtist;
  const tracksToShow = isArtistMode ? artistTopTracks : topTracks;
  const titleText = isArtistMode
    ? `Top Tracks — ${selectedArtist}`
    : "Top Tracks Global";
  const titleGradient = isArtistMode
    ? "linear-gradient(90deg, #38bdf8, #34d399)"
    : "linear-gradient(90deg, #f87171, #f59e0b)";
  const titleGlow = isArtistMode
    ? "drop-shadow(0 0 8px rgba(56,189,248,0.4))"
    : "drop-shadow(0 0 8px rgba(248,113,113,0.4))";
  const barGradient = isArtistMode
    ? "linear-gradient(180deg, #38bdf8, #34d399)"
    : "linear-gradient(180deg, #f87171, #f59e0b)";
  const barGlow = isArtistMode
    ? "0 0 8px rgba(56,189,248,0.6)"
    : "0 0 8px rgba(248,113,113,0.6)";

  return (
    <div className="insights-glass-card">
      {isDark && (
        <div
          className="insights-glow-orb"
          style={{
            top: -30,
            left: -30,
            width: 160,
            height: 160,
            background:
              "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Header */}
      <div className="insights-section-header mb-5">
        <div
          className="insights-section-bar"
          style={{ background: barGradient, boxShadow: barGlow }}
        />
        <h2
          className="insights-section-title"
          style={{ backgroundImage: titleGradient, filter: titleGlow }}
        >
          {titleText}
        </h2>
      </div>

      {/* List */}
      <div className="relative">
        {artistTracksLoading ? (
          <div className="flex items-center justify-center h-52">
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(168,85,247,0.3)",
                borderTopColor: "#c084fc",
              }}
            />
          </div>
        ) : (
          <div className="insights-scroll-list overflow-y-auto">
            {tracksToShow.map((track, i) => (
              <div
                key={i}
                className="insights-track-row"
                style={{
                  borderRadius: 10,
                  padding: "6px 8px",
                  margin: "2px 0",
                  transition: "background 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  if (isDark)
                    (e.currentTarget as HTMLDivElement).style.background =
                      `${COLORS[i % COLORS.length]}11`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "transparent";
                }}
              >
                <span
                  className="text-xs font-bold w-5 text-center flex-shrink-0 tabular-nums"
                  style={{
                    color: COLORS[i % COLORS.length],
                    textShadow: isDark
                      ? `0 0 8px ${GLOW_COLORS[i % GLOW_COLORS.length]}`
                      : "none",
                  }}
                >
                  {i + 1}
                </span>

                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                  style={{
                    background: `${COLORS[i % COLORS.length]}18`,
                    border: isDark
                      ? `1px solid ${COLORS[i % COLORS.length]}30`
                      : "none",
                    boxShadow: isDark
                      ? `0 0 10px ${GLOW_COLORS[i % GLOW_COLORS.length]}`
                      : "none",
                  }}
                >
                  {track.image?.[1]?.["#text"] ? (
                    <img
                      src={track.image[1]["#text"]}
                      alt={track.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs">🎵</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: textPrimary }}
                  >
                    {track.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: textMuted }}>
                    {track.artist.name}
                  </p>
                </div>

                <span
                  className="text-xs tabular-nums flex-shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    color: isDark ? COLORS[i % COLORS.length] : textMuted,
                    background: isDark
                      ? `${COLORS[i % COLORS.length]}15`
                      : "transparent",
                    border: isDark
                      ? `1px solid ${COLORS[i % COLORS.length]}25`
                      : "none",
                    textShadow: isDark
                      ? `0 0 6px ${GLOW_COLORS[i % GLOW_COLORS.length]}`
                      : "none",
                  }}
                >
                  {fmt(track.listeners)}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="insights-scroll-fade" />
      </div>
    </div>
  );
};

export default TopTracksList;
