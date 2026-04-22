import { useState } from "react";
import { Heart } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface TrackItemProps {
  track: any;
  isActive: boolean;
  activeColor: "green" | "pink";
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const TrackItem = ({
  track,
  isActive,
  activeColor,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: TrackItemProps) => {
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Защита — если трек невалидный, не рендерим
  if (!track) return null;

  const accent =
    activeColor === "green"
      ? { rgb: "52,211,153", light: "34,197,94" }
      : { rgb: "236,72,153", light: "219,39,119" };

  // Безопасное получение обложки из любого формата трека
  const albumArt =
    track.album?.images?.[2]?.url ||
    track.album?.images?.[1]?.url ||
    track.album?.images?.[0]?.url ||
    track.image ||
    track.cover ||
    null;

  // Безопасное получение артистов
  const artistNames = track.artists
    ? track.artists.map((a: any) => a?.name ?? "").filter(Boolean).join(", ")
    : (track.artist ?? "");

  // Безопасная длительность
  const durationMs = track.duration_ms ?? 0;
  const durationStr = `${Math.floor(durationMs / 60000)}:${Math.floor((durationMs % 60000) / 1000).toString().padStart(2, "0")}`;

  const activeStyleDark = {
    background: `rgba(${accent.rgb},0.08)`,
    border: `1px solid rgba(${accent.rgb},0.35)`,
    boxShadow: `0 0 20px rgba(${accent.rgb},0.12)`,
    backdropFilter: "blur(8px)",
  };

  const activeStyleLight = {
    backgroundColor: `rgba(${accent.light},0.08)`,
    border: `1px solid rgba(${accent.light},0.3)`,
  };

  const idleStyleDark = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(6px)",
  };

  const hoverStyleDark = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(168,85,247,0.25)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25), 0 0 12px rgba(168,85,247,0.08)",
  };

  const getStyle = () => {
    if (isActive) return isDark ? activeStyleDark : activeStyleLight;
    if (isDark) return hovered ? hoverStyleDark : idleStyleDark;
    return {
      backgroundColor: hovered ? "var(--bg-card-hover)" : "rgba(0,0,0,0.02)",
      border: hovered ? "1px solid var(--border-color)" : "1px solid transparent",
    };
  };

  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3 p-3 rounded-xl h-20 cursor-pointer transition-all duration-200 relative overflow-hidden"
      style={getStyle()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Active left bar */}
      {isActive && isDark && (
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{
            background: `linear-gradient(180deg, rgba(${accent.rgb},0.9), rgba(${accent.rgb},0.3))`,
            boxShadow: `0 0 8px rgba(${accent.rgb},0.7)`,
          }}
        />
      )}

      {/* Hover glow */}
      {hovered && !isActive && isDark && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: "radial-gradient(ellipse at right center, rgba(168,85,247,0.06) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Album art */}
      <div className="relative flex-shrink-0">
        {albumArt ? (
          <img
            src={albumArt}
            alt={track.name ?? "Track"}
            className="w-12 h-12 rounded-lg object-cover"
            style={{
              boxShadow: isActive && isDark
                ? `0 0 16px rgba(${accent.rgb},0.35)`
                : isDark
                ? "0 2px 8px rgba(0,0,0,0.5)"
                : "0 1px 4px rgba(0,0,0,0.1)",
            }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: isDark ? "rgba(168,85,247,0.1)" : "var(--border-color)",
              border: isDark ? "1px solid rgba(168,85,247,0.2)" : "none",
            }}
          >
            <span style={{ color: "var(--text-faint)", fontSize: 20 }}>♪</span>
          </div>
        )}
        {isActive && isDark && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 1px rgba(${accent.rgb},0.45)` }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold truncate text-sm transition-all duration-200"
          style={{
            color: isActive && isDark ? `rgba(${accent.rgb},0.95)` : "var(--text-primary)",
            textShadow: isActive && isDark ? `0 0 14px rgba(${accent.rgb},0.45)` : "none",
          }}
        >
          {track.name ?? "Unknown track"}
        </p>
        <p
          className="text-sm truncate mt-0.5"
          style={{ color: isActive && isDark ? `rgba(${accent.rgb},0.55)` : "var(--text-muted)" }}
        >
          {artistNames || "Unknown artist"}
        </p>
      </div>

      {/* Duration */}
      {durationMs > 0 && (
        <div
          className="text-xs flex-shrink-0 tabular-nums"
          style={{ color: isActive && isDark ? `rgba(${accent.rgb},0.5)` : "var(--text-faint)" }}
        >
          {durationStr}
        </div>
      )}

      {/* Favorite */}
      <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} isDark={isDark} />
    </div>
  );
};

const FavoriteButton = ({
  isFavorite,
  onToggle,
  isDark,
}: {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isDark: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none flex-shrink-0"
      style={
        isFavorite
          ? isDark
            ? {
                backgroundColor: "rgba(236,72,153,0.12)",
                border: "1px solid rgba(236,72,153,0.3)",
                boxShadow: hovered ? "0 0 16px rgba(236,72,153,0.3)" : "0 0 8px rgba(236,72,153,0.14)",
              }
            : { backgroundColor: "rgba(236,72,153,0.07)", border: "1px solid rgba(236,72,153,0.2)" }
          : isDark
          ? {
              backgroundColor: hovered ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.04)",
              border: hovered ? "1px solid rgba(168,85,247,0.25)" : "1px solid rgba(255,255,255,0.06)",
              boxShadow: hovered ? "0 0 10px rgba(168,85,247,0.12)" : "none",
            }
          : {
              backgroundColor: hovered ? "rgba(236,72,153,0.06)" : "transparent",
              border: "1px solid transparent",
            }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Heart
        className="w-4 h-4 transition-all duration-200"
        style={
          isFavorite
            ? {
                color: isDark ? "rgba(249,168,212,0.95)" : "rgb(219,39,119)",
                fill: isDark ? "rgba(249,168,212,0.95)" : "rgb(219,39,119)",
                filter: isDark
                  ? hovered ? "drop-shadow(0 0 6px rgba(236,72,153,0.65))" : "drop-shadow(0 0 3px rgba(236,72,153,0.3))"
                  : "none",
              }
            : {
                color: isDark
                  ? hovered ? "rgba(249,168,212,0.7)" : "rgba(200,180,255,0.3)"
                  : hovered ? "rgb(219,39,119)" : "var(--text-faint)",
              }
        }
      />
    </button>
  );
};

export default TrackItem;