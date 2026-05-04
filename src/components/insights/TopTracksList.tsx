import type { TopTrack } from "../../types/insights";

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#38bdf8",
  "#34d399",
  "#f59e0b",
  "#f87171",
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
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";

  return (
    <div className="insights-card">
      <h2 className="insights-heading mb-4">🔥 Top Tracks Global</h2>

      <div className="relative">
        <div className="insights-scroll-list">
          {topTracks.map((track, i) => (
            <div key={i} className="insights-track-row">
              <span
                className="text-xs font-bold w-5 text-center flex-shrink-0 tabular-nums"
                style={{ color: COLORS[i % COLORS.length] }}
              >
                {i + 1}
              </span>

              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                style={{ background: `${COLORS[i % COLORS.length]}22` }}
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
                <p
                  className="text-xs truncate"
                  style={{ color: textMuted }}
                >
                  {track.artist.name}
                </p>
              </div>

              <span
                className="text-xs tabular-nums flex-shrink-0"
                style={{ color: textMuted }}
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
