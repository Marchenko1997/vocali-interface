interface TagDiscoveryGridProps {
  data: any[];
  isDark: boolean;
  onTagClick?: (tagName: string) => void;
}

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#38bdf8",
  "#34d399",
  "#f59e0b",
  "#f87171",
];

const TagDiscoveryGrid = ({
  data,
  isDark,
  onTagClick,
}: TagDiscoveryGridProps) => {
  return (
    <div className="insights-glass-card relative overflow-hidden">
      {isDark && (
        <div
          className="insights-glow-orb"
          style={{
            top: -50,
            right: -30,
            width: 160,
            height: 160,
            background:
              "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="insights-section-header mb-5">
        <div
          className="insights-section-bar"
          style={{
            background: "linear-gradient(180deg, #f59e0b, #ec4899)",
            boxShadow: "0 0 8px rgba(245,158,11,0.55)",
          }}
        />
        <div className="flex flex-col gap-1">
          <h2
            className="insights-section-title"
            style={{
              backgroundImage: "linear-gradient(90deg, #f59e0b, #ec4899)",
              filter: "drop-shadow(0 0 8px rgba(245,158,11,0.35))",
            }}
          >
            Genre Discovery
          </h2>
          <p
            className="text-xs tracking-wide"
            style={{ color: isDark ? "rgba(255,255,255,0.42)" : "#6b7280" }}
          >
            Explore artists by tags
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            onClick={() => onTagClick?.(item.name)}
            className="rounded-2xl border px-4 py-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.75)",
              borderColor: isDark
                ? "rgba(245,158,11,0.14)"
                : "rgba(245,158,11,0.12)",
              boxShadow: isDark
                ? "0 0 0 1px rgba(245,158,11,0.03)"
                : "0 0 0 1px rgba(245,158,11,0.04)",
            }}
          >
            <div
              className="w-3 h-3 rounded-full mb-3"
              style={{
                background: COLORS[index % COLORS.length],
                boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}88`,
              }}
            />
            <p
              className="font-semibold mb-1 capitalize"
              style={{ color: isDark ? "rgba(255,255,255,0.92)" : "#111827" }}
            >
              {item.name}
            </p>
            <p
              className="text-xs"
              style={{ color: isDark ? "rgba(255,255,255,0.45)" : "#6b7280" }}
            >
              {item.count ?? item.playcount ?? item.listeners ?? "—"} items
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagDiscoveryGrid;
