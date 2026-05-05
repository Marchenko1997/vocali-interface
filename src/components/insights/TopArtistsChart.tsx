import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

const fmt = (n: string | number) => {
  const num = typeof n === "number" ? n : parseInt(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
};

export interface BarDatum {
  name: string;
  listeners: number;
  fullName: string;
}

interface TopArtistsChartProps {
  data: BarDatum[];
  isDark: boolean;
  onBarClick: (fullName: string) => void;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  isDark,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { fullName: string } }>;
  label?: string;
  isDark: boolean;
}) => {
  if (!active || !payload?.length) return null;
 const fullName = payload[0]?.payload?.fullName ?? String(label ?? ""); 
  const value = payload[0]?.value;

  return (
    <div
      style={{
        background: isDark ? "rgba(15,10,30,0.92)" : "rgba(255,255,255,0.92)",
        border: "1px solid rgba(168,85,247,0.35)",
        borderRadius: 12,
        padding: "10px 14px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(168,85,247,0.2), 0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      <p
        className="text-sm font-semibold mb-1"
        style={{ color: isDark ? "rgba(216,180,254,0.95)" : "#7c3aed" }}
      >
        {fullName}
      </p>
      <p
        className="text-xs"
        style={{ color: isDark ? "rgba(255,255,255,0.55)" : "#6b7280" }}
      >
        <span
          style={{ color: isDark ? "#c084fc" : "#9333ea", fontWeight: 600 }}
        >
          {fmt(value ?? 0)}
        </span>{" "}
        listeners
      </p>
    </div>
  );
};

const TopArtistsChart = ({
  data,
  isDark,
  onBarClick,
}: TopArtistsChartProps) => {
  const textMuted = isDark ? "rgba(255,255,255,0.35)" : "#9ca3af";

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
      {/* Glow orb background */}
      {isDark && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Header */}
      <div className="relative flex items-center gap-2 mb-6">
        <div
          className="w-1 h-5 rounded-full"
          style={{
            background: "linear-gradient(180deg, #c084fc, #e879f9)",
            boxShadow: "0 0 8px rgba(192,132,252,0.6)",
          }}
        />
        <h2
          className="text-sm font-bold tracking-wider uppercase"
          style={{
            background: "linear-gradient(90deg, #c084fc, #e879f9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 8px rgba(192,132,252,0.4))",
          }}
        >
          Top Artists by Listeners
        </h2>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Grid lines glow */}
        {isDark && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent calc(260px/4 - 1px), rgba(168,85,247,0.04) calc(260px/4))",
            }}
          />
        )}

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barCategoryGap="32%">
            <XAxis
              dataKey="name"
              tick={{ fill: textMuted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: textMuted, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={38}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  active={props.active}
                  payload={
                    props.payload as unknown as Array<{
                      value: number;
                      payload: { fullName: string };
                    }>
                  }
                  label={
                    props.label !== undefined ? String(props.label) : undefined
                  }
                  isDark={isDark}
                />
              )}
              cursor={{
                fill: isDark
                  ? "rgba(168,85,247,0.06)"
                  : "rgba(147,51,234,0.04)",
                radius: 8,
              }}
            />
            <Bar
              dataKey="listeners"
              radius={[8, 8, 0, 0]}
              onClick={(d: { payload?: { fullName?: string } }) => {
                if (d?.payload?.fullName) onBarClick(d.payload.fullName);
              }}
              style={{
                cursor: "pointer",
                filter: "drop-shadow(0 0 6px rgba(168,85,247,0.3))",
              }}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  style={{
                    filter: `drop-shadow(0 0 8px ${GLOW_COLORS[i % GLOW_COLORS.length]})`,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer hint */}
      <p
        className="text-xs text-center mt-3 tracking-wide"
        style={{
          color: isDark ? "rgba(168,85,247,0.45)" : "rgba(147,51,234,0.4)",
        }}
      >
        ✦ Click a bar to explore genres
      </p>
    </div>
  );
};

export default TopArtistsChart;
