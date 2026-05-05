import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Tag } from "../../types/insights";

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#38bdf8",
  "#34d399",
  "#f59e0b",
  "#f87171",
];

const GLOW_COLORS = [
  "rgba(168,85,247,0.6)",
  "rgba(236,72,153,0.6)",
  "rgba(56,189,248,0.6)",
  "rgba(52,211,153,0.6)",
  "rgba(245,158,11,0.6)",
  "rgba(248,113,113,0.6)",
];

interface GenreDonutProps {
  tags: Tag[];
  selectedArtist: string | null;
  isDark: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  isDark,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { name: string } }>;
  isDark: boolean;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: isDark ? "rgba(15,10,30,0.92)" : "rgba(255,255,255,0.92)",
        border: "1px solid rgba(168,85,247,0.35)",
        borderRadius: 10,
        padding: "8px 12px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(168,85,247,0.2), 0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      <p
        className="text-xs font-semibold"
        style={{ color: isDark ? "rgba(216,180,254,0.95)" : "#7c3aed" }}
      >
        {payload[0]?.payload?.name}
      </p>
      <p
        className="text-xs mt-0.5"
        style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#6b7280" }}
      >
        <span
          style={{ color: isDark ? "#c084fc" : "#9333ea", fontWeight: 600 }}
        >
          {payload[0]?.value}
        </span>{" "}
        plays
      </p>
    </div>
  );
};

const GenreDonut = ({ tags, selectedArtist, isDark }: GenreDonutProps) => {
  const textMuted = isDark ? "rgba(255,255,255,0.35)" : "#9ca3af";
  const pieData = tags.map((t) => ({ name: t.name, value: t.count }));

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(20,10,40,0.85) 0%, rgba(10,8,25,0.9) 100%)"
          : "linear-gradient(135deg, rgba(250,245,255,0.9) 0%, rgba(237,233,254,0.8) 100%)",
        border: `1px solid ${isDark ? "rgba(168,85,247,0.18)" : "rgba(147,51,234,0.15)"}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: isDark
          ? "0 0 40px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(147,51,234,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
        padding: "24px",
      }}
    >
      {/* Glow orb */}
      {isDark && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Header */}
      <div className="relative flex items-center gap-2 mb-5">
        <div
          className="w-1 h-5 rounded-full"
          style={{
            background: "linear-gradient(180deg, #e879f9, #38bdf8)",
            boxShadow: "0 0 8px rgba(232,121,249,0.6)",
          }}
        />
        <h2
          className="text-sm font-bold tracking-wider uppercase"
          style={{
            background: "linear-gradient(90deg, #e879f9, #38bdf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 8px rgba(232,121,249,0.4))",
          }}
        >
          Genres{" "}
          <span
            style={{
              WebkitTextFillColor: isDark ? "rgba(255,255,255,0.4)" : "#9ca3af",
              filter: "none",
              fontSize: "0.7rem",
              fontWeight: 400,
              letterSpacing: "0.05em",
              textTransform: "none",
            }}
          >
            {selectedArtist ? `— ${selectedArtist}` : "(select an artist)"}
          </span>
        </h2>
      </div>

      {/* Chart or empty */}
      {pieData.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              style={{
                filter: isDark
                  ? "drop-shadow(0 0 10px rgba(168,85,247,0.25))"
                  : "none",
              }}
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  style={{
                    filter: isDark
                      ? `drop-shadow(0 0 6px ${GLOW_COLORS[i % GLOW_COLORS.length]})`
                      : "none",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  active={props.active}
                  payload={
                    props.payload as unknown as Array<{
                      name: string;
                      value: number;
                      payload: { name: string };
                    }>
                  }
                  isDark={isDark}
                />
              )}
            />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: 11, color: textMuted }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 h-52 rounded-xl"
          style={{
            background: isDark
              ? "rgba(168,85,247,0.04)"
              : "rgba(147,51,234,0.03)",
            border: `1px dashed ${isDark ? "rgba(168,85,247,0.2)" : "rgba(147,51,234,0.15)"}`,
          }}
        >
          <span
            style={{
              fontSize: 28,
              filter: isDark
                ? "drop-shadow(0 0 8px rgba(168,85,247,0.4))"
                : "none",
            }}
          >
            🎸
          </span>
          <p className="text-xs" style={{ color: textMuted }}>
            Click an artist bar to see genres
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreDonut;
