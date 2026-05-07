import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { lastfm } from "../../services/lastfmApi";
import type { TagArtist } from "../../types/insights";

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

interface TagArtistsModalProps {
  tag: string | null;
  isDark: boolean;
  onClose: () => void;
}

const TagArtistsModal = ({ tag, isDark, onClose }: TagArtistsModalProps) => {
  const [artists, setArtists] = useState<TagArtist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tag) return;
    setLoading(true);
    setArtists([]);
    lastfm
      .getTagTopArtists(tag, 12)
      .then(async (data) => {
        const list: TagArtist[] = data.topartists?.artist ?? [];
        const enriched = await Promise.all(
          list.slice(0, 12).map(async (a) => {
            try {
              const info = await lastfm.getArtistInfo(a.name);
              const img = info?.artist?.image ?? [];
              return { ...a, image: img.length ? img : a.image };
            } catch {
              return a;
            }
          }),
        );
        setArtists(enriched);
      })
      .finally(() => setLoading(false));
  }, [tag]);

  if (!tag) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(22,10,45,0.96) 0%, rgba(10,8,28,0.98) 100%)"
            : "linear-gradient(135deg, rgba(250,245,255,0.97) 0%, rgba(237,233,254,0.95) 100%)",
          border: `1px solid ${isDark ? "rgba(168,85,247,0.3)" : "rgba(147,51,234,0.2)"}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "0 0 80px rgba(168,85,247,0.2), 0 0 40px rgba(236,72,153,0.1), 0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 24px 64px rgba(147,51,234,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
          maxHeight: "65vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top neon line */}
        {isDark && (
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.6) 30%, rgba(236,72,153,0.6) 60%, transparent 100%)",
            }}
          />
        )}

        {/* Glow orbs */}
        {isDark && (
          <>
            <div
              className="absolute pointer-events-none"
              style={{
                top: -30,
                right: -30,
                width: 180,
                height: 180,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: -30,
                left: -30,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </>
        )}

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-1 h-5 rounded-full"
              style={{
                background: "linear-gradient(180deg, #c084fc, #e879f9)",
                boxShadow: "0 0 10px rgba(192,132,252,0.7)",
              }}
            />
            <h2
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                backgroundImage:
                  "linear-gradient(90deg, #c084fc, #e879f9, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px rgba(192,132,252,0.5))",
              }}
            >
              Top Artists — {tag}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200"
            style={{
              background: isDark ? "rgba(168,85,247,0.08)" : "rgba(0,0,0,0.05)",
              border: `1px solid ${isDark ? "rgba(168,85,247,0.25)" : "rgba(0,0,0,0.08)"}`,
              color: isDark ? "rgba(200,180,255,0.7)" : "#6b7280",
            }}
            onMouseEnter={(e) => {
              if (isDark) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(168,85,247,0.18)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(168,85,247,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (isDark) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(168,85,247,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(168,85,247,0.25)";
              }
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(168,85,247,0.25), rgba(236,72,153,0.15), transparent)"
              : "rgba(147,51,234,0.1)",
            margin: "0 20px",
          }}
        />

        {/* Content */}
     <div
  className="overflow-y-auto px-5 pb-5"
  style={{ scrollbarWidth: "none" }}
>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-36 gap-3">
              <div
                className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{
                  borderColor: "rgba(168,85,247,0.25)",
                  borderTopColor: "#c084fc",
                }}
              />
              <p
                className="text-xs"
                style={{ color: isDark ? "rgba(168,85,247,0.5)" : "#9ca3af" }}
              >
                Loading artists...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pr-1">
              {artists.map((artist, i) => {
                const img =
                  artist.image?.[3]?.["#text"] ||
                  artist.image?.[2]?.["#text"] ||
                  artist.image?.[1]?.["#text"];
                const hasImg = !!img;
                return (
                  <a
                    key={i}
                    href={artist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all duration-200"
                    style={{
                      background: isDark
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(255,255,255,0.7)",
                      border: `1px solid ${isDark ? "rgba(168,85,247,0.1)" : "rgba(147,51,234,0.08)"}`,
                      textDecoration: "none",
                      backdropFilter: isDark ? "blur(8px)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = isDark
                        ? `${COLORS[i % COLORS.length]}14`
                        : `${COLORS[i % COLORS.length]}12`;
                      el.style.borderColor = `${COLORS[i % COLORS.length]}40`;
                      if (isDark)
                        el.style.boxShadow = `0 0 16px ${GLOW_COLORS[i % GLOW_COLORS.length]}`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.background = isDark
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(255,255,255,0.7)";
                      el.style.borderColor = isDark
                        ? "rgba(168,85,247,0.1)"
                        : "rgba(147,51,234,0.08)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0"
                      style={{
                        background: hasImg
                          ? "transparent"
                          : `${COLORS[i % COLORS.length]}20`,
                        border: `1.5px solid ${COLORS[i % COLORS.length]}45`,
                        boxShadow: isDark
                          ? `0 0 14px ${GLOW_COLORS[i % GLOW_COLORS.length]}`
                          : "none",
                      }}
                    >
                      {hasImg ? (
                        <img
                          src={img}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ fontSize: 22 }}
                        >
                          🎤
                        </div>
                      )}
                    </div>
                    <p
                      className="text-xs font-medium text-center leading-tight"
                      style={{
                        color: isDark ? "rgba(220,200,255,0.85)" : "#1a1a2e",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={artist.name}
                    >
                      {artist.name}
                    </p>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagArtistsModal;
