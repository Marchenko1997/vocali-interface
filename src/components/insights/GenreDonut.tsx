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

interface GenreDonutProps {
  tags: Tag[];
  selectedArtist: string | null;
  isDark: boolean;
}

const GenreDonut = ({ tags, selectedArtist, isDark }: GenreDonutProps) => {
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const pieData = tags.map((t) => ({ name: t.name, value: t.count }));

  return (
    <div className="insights-card">
      <h2 className="insights-heading mb-4">
        🎸 Genres{" "}
        {selectedArtist ? `— ${selectedArtist}` : "(select an artist)"}
      </h2>
      {pieData.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: isDark ? "#1a1a2e" : "#fff",
                border: `1px solid ${cardBorder}`,
                borderRadius: 8,
                color: textPrimary,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: textMuted }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="flex items-center justify-center h-52 text-sm rounded-xl"
          style={{
            color: textMuted,
            background: isDark ? "rgba(255,255,255,0.02)" : "#f9fafb",
          }}
        >
          Click an artist bar to see genres
        </div>
      )}
    </div>
  );
};

export default GenreDonut;
