import { Heart } from "lucide-react";
import TrackItem from "./TrackItem";
import { useTheme } from "../context/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div
        className="rounded-xl p-4 sm:p-6 transition-all duration-300 relative overflow-hidden"
        style={
          isDark
            ? {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(236,72,153,0.2)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.3), 0 0 40px rgba(236,72,153,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
              }
            : {
                backgroundColor: "var(--bg-card)",
                boxShadow: "var(--shadow-card)",
                border: "1px solid rgba(236,72,153,0.1)",
              }
        }
      >
        {isDark && (
          <div
            className="absolute top-0 left-6 right-6 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.5), rgba(168,85,247,0.4), transparent)",
            }}
          />
        )}
        {isDark && (
          <div
            className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
            style={{
              background: "radial-gradient(circle at top right, rgba(236,72,153,0.1) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={
                isDark
                  ? { background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.3)", boxShadow: "0 0 14px rgba(236,72,153,0.15)" }
                  : { background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)" }
              }
            >
              <Heart
                className="w-4 h-4"
                style={{
                  color: isDark ? "rgba(249,168,212,0.95)" : "rgb(219,39,119)",
                  fill: isDark ? "rgba(249,168,212,0.95)" : "rgb(219,39,119)",
                }}
              />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Your Favorites
            </h3>
          </div>

          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={
              isDark
                ? { background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", color: "rgba(249,168,212,0.8)" }
                : { background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.15)", color: "rgb(157,23,77)" }
            }
          >
            {favorites.length} tracks
          </span>
        </div>

        {/* Empty state */}
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-3"
              style={
                isDark
                  ? { background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)", boxShadow: "0 0 20px rgba(236,72,153,0.08)" }
                  : { background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.15)" }
              }
            >
              <Heart className="w-5 h-5" style={{ color: isDark ? "rgba(249,168,212,0.4)" : "rgba(219,39,119,0.35)" }} />
            </div>
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              You don't have any favorite tracks yet
            </p>
          </div>
        ) : (
          <div
            className="space-y-2 max-h-64 overflow-y-auto pr-1.5"
            style={isDark ? { scrollbarWidth: "thin", scrollbarColor: "rgba(236,72,153,0.3) transparent" } : {}}
          >
            {favorites.map((track) => {
              if (!track || !track.id) return null;
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