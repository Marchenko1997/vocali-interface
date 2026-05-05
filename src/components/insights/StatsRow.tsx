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
  const textPrimary = isDark ? "rgba(255,255,255,0.92)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "#6b7280";

  const stats: {
    icon: typeof Music;
    label: string;
    value: number | string;
    color: string;
    glow: string;
    bg: string;
  }[] = [
    {
      icon: Users,
      label: "Top Artists",
      value: topArtists.length,
      color: "#a855f7",
      glow: "rgba(168,85,247,0.35)",
      bg: "rgba(168,85,247,0.08)",
    },
    {
      icon: Music,
      label: "Top Tracks",
      value: topTracks.length,
      color: "#38bdf8",
      glow: "rgba(56,189,248,0.35)",
      bg: "rgba(56,189,248,0.08)",
    },
    {
      icon: TagIcon,
      label: "Genres",
      value: tags.length || "—",
      color: "#ec4899",
      glow: "rgba(236,72,153,0.35)",
      bg: "rgba(236,72,153,0.08)",
    },
    {
      icon: TrendingUp,
      label: "Selected",
      value: selectedArtist ?? "None",
      color: "#34d399",
      glow: "rgba(52,211,153,0.35)",
      bg: "rgba(52,211,153,0.08)",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color, glow, bg }) => (
        <div
          key={label}
          className="relative rounded-2xl p-4 overflow-hidden transition-all duration-300"
          style={
            isDark
              ? {
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${color}28`,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: `0 0 20px ${glow}18, inset 0 1px 0 rgba(255,255,255,0.05)`,
                }
              : {
                  background: "#ffffff",
                  border: `1px solid ${color}22`,
                  boxShadow: `0 2px 12px ${glow}20`,
                }
          }
          onMouseEnter={(e) => {
            if (isDark) {
              e.currentTarget.style.boxShadow = `0 0 28px ${glow}35, inset 0 1px 0 rgba(255,255,255,0.07)`;
              e.currentTarget.style.borderColor = `${color}45`;
            }
          }}
          onMouseLeave={(e) => {
            if (isDark) {
              e.currentTarget.style.boxShadow = `0 0 20px ${glow}18, inset 0 1px 0 rgba(255,255,255,0.05)`;
              e.currentTarget.style.borderColor = `${color}28`;
            }
          }}
        >
        
          {isDark && (
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
                filter: "blur(8px)",
              }}
            />
          )}

    
          <div
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3"
            style={{
              background: isDark ? bg : `${color}12`,
              border: isDark ? `1px solid ${color}30` : `1px solid ${color}20`,
              boxShadow: isDark ? `0 0 10px ${glow}25` : "none",
            }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>

       
          <p
            className="text-xs mb-0.5 tracking-wide uppercase"
            style={{ color: textMuted }}
          >
            {label}
          </p>

   
          <p
            className="text-xl font-bold truncate"
            style={{
              color: isDark ? color : textPrimary,
              textShadow: isDark ? `0 0 16px ${glow}` : "none",
            }}
          >
            {value}
          </p>

        
          {isDark && (
            <div
              className="absolute bottom-0 left-4 right-4 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
