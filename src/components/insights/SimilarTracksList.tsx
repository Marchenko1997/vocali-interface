interface SimilarTracksListProps {
  data: any[];
  isDark: boolean;
  title?: string;
  subtitle?: string;
  onTrackClick?: (trackName: string) => void;
}

const fmt = (n: string | number) => {
  const num = typeof n === "number" ? n : parseInt(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
};

const SimilarTracksList = ({
  data,
  isDark,
  title = "Similar Tracks",
  subtitle = "Tracks that match your current taste",
  onTrackClick,
}: SimilarTracksListProps) => {
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.38)" : "#6b7280";

  return (
    <div className="insights-glass-card">
      {isDark && (
        <div
          className="insights-glow-orb"
          style={{
            top: -30,
            right: -30,
            width: 160,
            height: 160,
            background:
              "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="insights-section-header mb-5">
        <div
          className="insights-section-bar"
          style={{
            background: "linear-gradient(180deg, #38bdf8, #34d399)",
            boxShadow: "0 0 8px rgba(56,189,248,0.6)",
          }}
        />
        <div className="flex flex-col gap-1">
          <h2
            className="insights-section-title"
            style={{
              backgroundImage: "linear-gradient(90deg, #38bdf8, #34d399)",
              filter: "drop-shadow(0 0 8px rgba(56,189,248,0.35))",
            }}
          >
            {title}
          </h2>
          <p
            className="text-xs tracking-wide"
            style={{ color: isDark ? "rgba(255,255,255,0.42)" : "#6b7280" }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="insights-scroll-list max-h-[320px] overflow-y-auto pr-1">
          {data.map((track, index) => (
            <button
              key={`${track.name}-${index}`}
              onClick={() => onTrackClick?.(track.name)}
              className="insights-track-row w-full text-left rounded-2xl border transition-all duration-300 px-4 py-3 mb-3"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.7)",
                borderColor: isDark
                  ? "rgba(168,85,247,0.12)"
                  : "rgba(147,51,234,0.12)",
                boxShadow: isDark
                  ? "0 0 0 1px rgba(168,85,247,0.03)"
                  : "0 0 0 1px rgba(147,51,234,0.04)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="text-sm font-semibold shrink-0"
                    style={{ color: isDark ? "#38bdf8" : "#0ea5e9" }}
                  >
                    #{index + 1}
                  </span>

                  <div className="min-w-0">
                    <p
                      className="font-semibold truncate"
                      style={{
                        color: textPrimary,
                      }}
                    >
                      {track.name}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{
                        color: textMuted,
                      }}
                    >
                      {track.artist?.name || track.artist || "Unknown artist"}
                    </p>
                  </div>
                </div>

                <span
                  className="text-xs font-semibold rounded-full px-3 py-1 shrink-0"
                  style={{
                    color: isDark ? "#38bdf8" : "#0369a1",
                    background: isDark
                      ? "rgba(56,189,248,0.12)"
                      : "rgba(56,189,248,0.08)",
                  }}
                >
                  {fmt(track.match ?? track.listeners ?? track.playcount ?? 0)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {data.length > 0 && <div className="insights-scroll-fade" />}
      </div>
    </div>
  );
};

export default SimilarTracksList;