import type { ArtistAlbum } from "../../types/insights";

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#38bdf8",
  "#34d399",
  "#f59e0b",
  "#f87171",
];

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

interface TopAlbumsGridProps {
  albums: ArtistAlbum[];
  selectedArtist: string;
  loading: boolean;
  isDark: boolean;
}

const TopAlbumsGrid = ({
  albums,
  selectedArtist,
  loading,
  isDark,
}: TopAlbumsGridProps) => {
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";

  return (
    <div className="insights-glass-card">
      {isDark && (
        <div
          className="insights-glow-orb"
          style={{
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            background:
              "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="insights-section-header mb-6">
        <div
          className="insights-section-bar"
          style={{
            background: "linear-gradient(180deg, #34d399, #38bdf8)",
            boxShadow: "0 0 8px rgba(52,211,153,0.6)",
          }}
        />
        <h2
          className="insights-section-title"
          style={{
            backgroundImage: "linear-gradient(90deg, #34d399, #38bdf8)",
            filter: "drop-shadow(0 0 8px rgba(52,211,153,0.4))",
          }}
        >
          Top Albums — {selectedArtist}
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div
            className="w-5 h-5 rounded-full border-2 animate-spin"
            style={{
              borderColor: "rgba(52,211,153,0.3)",
              borderTopColor: "#34d399",
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {albums.map((album, i) => {
            const cover =
              album.image?.[2]?.["#text"] || album.image?.[1]?.["#text"];
            return (
              <div
                key={i}
                className="flex flex-col gap-1.5 group cursor-pointer"
                onClick={() => window.open(album.url, "_blank", "noopener")}
              >
                {/* Cover */}
                <div
                  className="relative aspect-square rounded-xl overflow-hidden"
                  style={{
                    background: `${COLORS[i % COLORS.length]}18`,
                    border: isDark
                      ? `1px solid ${COLORS[i % COLORS.length]}30`
                      : "1px solid rgba(0,0,0,0.06)",
                    boxShadow: isDark
                      ? `0 0 12px ${COLORS[i % COLORS.length]}25`
                      : "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "scale(1.04)";
                    if (isDark)
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        `0 0 20px ${COLORS[i % COLORS.length]}45`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "scale(1)";
                    if (isDark)
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        `0 0 12px ${COLORS[i % COLORS.length]}25`;
                  }}
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span style={{ fontSize: 24 }}>💿</span>
                    </div>
                  )}
                  {/* Playcount overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-1.5 py-1"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                      borderRadius: "0 0 10px 10px",
                    }}
                  >
                    <span
                      className="text-xs tabular-nums font-medium"
                      style={{
                        color: isDark ? COLORS[i % COLORS.length] : "#fff",
                        textShadow: isDark
                          ? `0 0 6px ${COLORS[i % COLORS.length]}`
                          : "none",
                      }}
                    >
                      {fmt(album.playcount)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <p
                  className="text-xs font-medium truncate leading-tight"
                  style={{ color: textPrimary }}
                  title={album.name}
                >
                  {album.name}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <p
        className="text-xs text-center mt-4 tracking-wide"
        style={{
          color: isDark ? "rgba(52,211,153,0.4)" : "rgba(52,211,153,0.6)",
        }}
      >
        ✦ Click an album to open on Last.fm
      </p>
    </div>
  );
};

export default TopAlbumsGrid;
