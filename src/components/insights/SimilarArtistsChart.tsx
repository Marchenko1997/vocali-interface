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

export interface SimilarArtistDatum {
  name: string;
  match: number;
  fullName: string;
}

interface SimilarArtistsChartProps {
  data: SimilarArtistDatum[];
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
      className="insights-tooltip"
      style={{
        borderRadius: 12,
        padding: "10px 14px",
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
        match
      </p>
    </div>
  );
};

const SimilarArtistsChart = ({
  data,
  isDark,
  onBarClick,
}: SimilarArtistsChartProps) => {
  const textMuted = isDark ? "rgba(255,255,255,0.35)" : "#9ca3af";

  return (
    <div className="insights-glass-card">
      {isDark && (
        <div
          className="insights-glow-orb"
          style={{
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            background:
              "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="insights-section-header mb-6">
        <div
          className="insights-section-bar"
          style={{
            background: "linear-gradient(180deg, #c084fc, #e879f9)",
            boxShadow: "0 0 8px rgba(192,132,252,0.6)",
          }}
        />
        <h2
          className="insights-section-title"
          style={{
            backgroundImage: "linear-gradient(90deg, #c084fc, #e879f9)",
            filter: "drop-shadow(0 0 8px rgba(192,132,252,0.4))",
          }}
        >
          Similar Artists
        </h2>
      </div>

      <div className="relative">
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
              dataKey="match"
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

      <p
        className="text-xs text-center mt-3 tracking-wide"
        style={{
          color: isDark ? "rgba(168,85,247,0.45)" : "rgba(147,51,234,0.4)",
        }}
      >
        ✦ Click a bar to explore the artist
      </p>
    </div>
  );
};

export default SimilarArtistsChart;
