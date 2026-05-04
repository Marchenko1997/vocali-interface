import { Music, Users, Tag as TagIcon, TrendingUp } from "lucide-react";
import type { TopArtist, TopTrack, Tag } from "../../types/insights";

interface StatsRowProps {
  topArtists: TopArtist[];
  topTracks: TopTrack[];
  tags: Tag[];
  selectedArtist: string | null;
  isDark: boolean;
}

const StatsRow = ({
  topArtists,
  topTracks,
  tags,
  selectedArtist,
  isDark,
}: StatsRowProps) => {
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";

  const stats: {
    icon: typeof Music;
    label: string;
    value: number | string;
    color: string;
  }[] = [
    { icon: Users, label: "Top Artists", value: topArtists.length, color: "#a855f7" },
    { icon: Music, label: "Top Tracks", value: topTracks.length, color: "#38bdf8" },
    { icon: TagIcon, label: "Genres", value: tags.length || "—", color: "#ec4899" },
    {
      icon: TrendingUp,
      label: "Selected",
      value: selectedArtist ?? "None",
      color: "#34d399",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="insights-stat-card">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4" style={{ color }} />
            <span className="text-xs" style={{ color: textMuted }}>
              {label}
            </span>
          </div>
          <p
            className="text-lg font-bold truncate"
            style={{ color: textPrimary }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
