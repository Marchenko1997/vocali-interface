import { Heart } from "lucide-react";
import TrackItem from "./TrackItem";

interface FavoritesPanelProps {
  favorites: any[];
  selectedTrack: any | null;
  onSelectTrack: (track: any) => void;
  onRemoveFavorite: (trackId: string) => void;
}

const FavoritesPanel = ({
  favorites,
  selectedTrack,
  onSelectTrack,
  onRemoveFavorite,
}: FavoritesPanelProps) => {
  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div
        className="rounded-xl p-4 sm:p-6 transition-colors duration-300"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
       
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Your Favorites
            </h3>
          </div>

          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
            {favorites.length} tracks
          </span>
        </div>

       
        {favorites.length === 0 ? (
          <p
            className="text-center py-6 text-sm"
            style={{ color: "var(--text-faint)" }}
          >
            You don't have any favorite tracks yet
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1.5 custom-scroll">
            {favorites.map((track) => {
              if (!track) return null;
              return (
                <TrackItem
                  key={track.id}
                  track={track}
                  isActive={selectedTrack?.id === track.id}
                  activeColor="pink"
                  onSelect={() => onSelectTrack(track)}
                  isFavorite={true}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(track.id);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPanel;
