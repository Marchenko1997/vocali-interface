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
  isDark: boolean;
}

const TopTracksList = ({ topTracks, isDark }: TopTracksListProps) => {
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.38)" : "#6b7280";

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(20,10,40,0.85) 0%, rgba(10,8,25,0.9) 100%)"
          : "linear-gradient(135deg, rgba(250,245,255,0.9) 0%, rgba(237,233,254,0.8) 100%)",
        border: `1px solid ${isDark ? "rgba(168,85,247,0.18)" : "rgba(147,51,234,0.15)"}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: isDark
          ? "0 0 40px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(147,51,234,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        padding: "24px",
      }}
    >
      {/* Glow orb */}
      {isDark && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: -30,
            left: -30,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Header */}
      <div className="relative flex items-center gap-2 mb-5">
        <div
          className="w-1 h-5 rounded-full"
          style={{
            background: "linear-gradient(180deg, #f87171, #f59e0b)",
            boxShadow: "0 0 8px rgba(248,113,113,0.6)",
          }}
        />
        <h2
          className="text-sm font-bold tracking-wider uppercase"
          style={{
            background: "linear-gradient(90deg, #f87171, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 8px rgba(248,113,113,0.4))",
          }}
        >
          Top Tracks Global
        </h2>
      </div>

      {/* List */}
      <div className="relative">
        <div className="insights-scroll-list overflow-y-auto">
          {topTracks.map((track, i) => (
            <div
              key={i}
              className="insights-track-row group transition-all duration-200"
              style={{
                borderRadius: 10,
                padding: "6px 8px",
                margin: "2px 0",
                transition: "background 0.18s ease",
              }}
              onMouseEnter={(e) => {
                if (isDark) {
                  (e.currentTarget as HTMLDivElement).style.background =
                    `${COLORS[i % COLORS.length]}11`;
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "transparent";
              }}
            >
              {/* Number */}
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

              {/* Cover */}
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

              {/* Title + Artist */}
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

              {/* Listeners */}
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

        <div className="insights-scroll-fade" />
      </div>
    </div>
  );
};

export default TopTracksList;
