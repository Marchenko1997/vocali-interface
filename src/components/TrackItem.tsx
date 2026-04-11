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
  const activeBg =
    activeColor === "green"
      ? "bg-green-50 border border-green-300"
      : "bg-pink-50 border border-pink-300";

  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center gap-3 p-3 rounded-xl h-20 cursor-pointer transition-all duration-200
        ${isActive ? activeBg : "bg-gray-50 hover:bg-gray-100 border border-transparent"}
      `}
    >
      <img
        src={
          track.album?.images?.[2]?.url ||
          track.album?.images?.[1]?.url ||
          track.album?.images?.[0]?.url ||
          track.image ||
          "/placeholder.png"
        }
        alt={track.name}
        className="w-12 h-12 rounded-md object-cover bg-gray-200"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{track.name}</p>
        <p className="text-sm text-gray-500 truncate">
          {track.artists
            ? track.artists.map((a: any) => a.name).join(", ")
            : (track.artist ?? "")}
        </p>
      </div>

      <div className="text-xs text-gray-400">
        {Math.floor(track.duration_ms / 60000)}:
        {Math.floor((track.duration_ms % 60000) / 1000)
          .toString()
          .padStart(2, "0")}
      </div>

      <button
        onClick={onToggleFavorite}
        className="p-2 rounded-full hover:bg-red-50 transition-all focus:outline-none"
      >
        <Heart
          className={`w-4 h-4 ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
          }`}
        />
      </button>
    </div>
  );
};

export default TrackItem;
