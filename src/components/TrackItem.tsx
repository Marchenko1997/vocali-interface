import { useState } from "react";
import { Heart } from "lucide-react";

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

  const activeStyle =
    activeColor === "green"
      ? {
          backgroundColor: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.4)",
        }
      : {
          backgroundColor: "rgba(236,72,153,0.1)",
          border: "1px solid rgba(236,72,153,0.4)",
        };

const idleStyle = {
  backgroundColor: hovered ? "var(--bg-track-item)" : "var(--bg-card-hover)",
  border: "1px solid transparent",
};

  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3 p-3 rounded-xl h-20 cursor-pointer transition-all duration-200"
      style={isActive ? activeStyle : idleStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Album art */}
      <img
        src={
          track.album?.images?.[2]?.url ||
          track.album?.images?.[1]?.url ||
          track.album?.images?.[0]?.url ||
          track.image ||
          "/placeholder.png"
        }
        alt={track.name}
        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
        style={{ backgroundColor: "var(--border-color)" }}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png";
        }}
      />

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold truncate text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {track.name}
        </p>
        <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
          {track.artists
            ? track.artists.map((a: any) => a.name).join(", ")
            : (track.artist ?? "")}
        </p>
      </div>

      {/* Duration */}
      <div
        className="text-xs flex-shrink-0"
        style={{ color: "var(--text-faint)" }}
      >
        {Math.floor(track.duration_ms / 60000)}:
        {Math.floor((track.duration_ms % 60000) / 1000)
          .toString()
          .padStart(2, "0")}
      </div>

      {/* Favorite button */}
      <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
    </div>
  );
};

const FavoriteButton = ({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
}) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full transition-all duration-200 focus:outline-none flex-shrink-0"
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isFavorite ? "text-red-500 fill-red-500" : ""
        }`}
        style={!isFavorite ? { color: "var(--text-faint)" } : {}}
      />
    </button>
  );
};

export default TrackItem;
