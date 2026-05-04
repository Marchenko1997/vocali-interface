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

const TopArtistsChart = ({ data, isDark, onBarClick }: TopArtistsChartProps) => {
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <div className="insights-card">
      <h2 className="insights-heading mb-6">🎤 Top Artists by Listeners</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap="30%">
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
          />
          <Tooltip
            formatter={(v) => [fmt(String(v ?? 0)), "Listeners"]}
            labelFormatter={(l, p) => p[0]?.payload?.fullName ?? l}
            contentStyle={{
              background: isDark ? "#1a1a2e" : "#fff",
              border: `1px solid ${cardBorder}`,
              borderRadius: 8,
              color: textPrimary,
            }}
          />
          <Bar
            dataKey="listeners"
            radius={[6, 6, 0, 0]}
            onClick={(d: { payload?: { fullName?: string } }) => {
              if (d?.payload?.fullName) onBarClick(d.payload.fullName);
            }}
            style={{ cursor: "pointer" }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs mt-3 text-center" style={{ color: textMuted }}>
        Click a bar to load genres for that artist
      </p>
    </div>
  );
};

export default TopArtistsChart;
