
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Music, Users, Tag, TrendingUp, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useInsights } from "../hooks/useInsights";
import { useTheme } from "../context/ThemeContext";
import { Loader2 } from "lucide-react";

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#38bdf8",
  "#34d399",
  "#f59e0b",
  "#f87171",
];

const fmt = (n: string) => {
  const num = parseInt(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
};

const Insights = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    topArtists,
    topTracks,
    tags,
    selectedArtist,
    setSelectedArtist,
    searchQuery,
    setSearchQuery,
    handleSearch,
    loading,
    error,
  } = useInsights();

  const barData = topArtists.slice(0, 8).map((a) => ({
    name: a.name.length > 14 ? a.name.slice(0, 14) + "…" : a.name,
    listeners: parseInt(a.listeners),
    fullName: a.name,
  }));

  const pieData = tags.map((t) => ({ name: t.name, value: t.count }));

  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#f9fafb";

  return (
    <div
      className="min-h-screen"
      style={{ background: isDark ? "#060611" : "#f5f3ff" }}
    >
      {/* ── Header ── */}
      <div
        className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between gap-4"
        style={{
          borderBottom: `1px solid ${cardBorder}`,
          background: isDark ? "rgba(6,6,17,0.85)" : "rgba(245,243,255,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Навигация — Home + Studio */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.04)",
              border: `1px solid ${cardBorder}`,
              color: textMuted,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = textPrimary;
              e.currentTarget.style.borderColor = isDark
                ? "rgba(168,85,247,0.3)"
                : "rgba(147,51,234,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = textMuted;
              e.currentTarget.style.borderColor = cardBorder;
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>

          <button
            onClick={() => navigate("/studio", { state: { showSplash: true } })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
            style={
              isDark
                ? {
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "rgba(165,180,252,0.85)",
                  }
                : {
                    background: "#eef2ff",
                    border: "1px solid #c7d2fe",
                    color: "#4f46e5",
                  }
            }
            onMouseEnter={(e) => {
              if (isDark) {
                e.currentTarget.style.background = "rgba(99,102,241,0.15)";
                e.currentTarget.style.boxShadow =
                  "0 0 14px rgba(99,102,241,0.2)";
              } else {
                e.currentTarget.style.background = "#e0e7ff";
              }
            }}
            onMouseLeave={(e) => {
              if (isDark) {
                e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                e.currentTarget.style.boxShadow = "none";
              } else {
                e.currentTarget.style.background = "#eef2ff";
              }
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Studio
          </button>
        </div>

        {/* Заголовок по центру */}
        <h1
          className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2"
          style={{
            background:
              "linear-gradient(90deg, #c084fc, #e879f9, #38bdf8, #c084fc)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradient-shift 6s linear infinite",
            filter: "drop-shadow(0 0 14px rgba(192,132,252,0.5))",
            letterSpacing: "0.18em",
          }}
        >
          Music Insights
        </h1>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div
            className="relative flex items-center gap-1"
            style={{
              background: isDark
                ? "rgba(168,85,247,0.06)"
                : "rgba(255,255,255,0.8)",
              border: `1px solid ${isDark ? "rgba(168,85,247,0.2)" : "rgba(147,51,234,0.15)"}`,
              borderRadius: 12,
              backdropFilter: "blur(12px)",
              padding: "4px 4px 4px 0",
              boxShadow: isDark
                ? "0 0 16px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 2px 8px rgba(147,51,234,0.06)",
              transition: "all 0.2s ease",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = isDark
                ? "rgba(168,85,247,0.5)"
                : "rgba(147,51,234,0.4)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = isDark
                ? "0 0 20px rgba(168,85,247,0.2)"
                : "0 0 12px rgba(147,51,234,0.12)";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = isDark
                ? "rgba(168,85,247,0.2)"
                : "rgba(147,51,234,0.15)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = isDark
                ? "0 0 16px rgba(168,85,247,0.08)"
                : "0 2px 8px rgba(147,51,234,0.06)";
            }}
          >
            <Search
              className="w-3.5 h-3.5 absolute left-3 pointer-events-none"
              style={{
                color: isDark
                  ? "rgba(168,85,247,0.55)"
                  : "rgba(147,51,234,0.45)",
              }}
            />
            <input
              type="text"
              placeholder="Search artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="search-input text-sm py-1.5 pl-8 pr-2 bg-transparent outline-none w-44"
              style={{
                color: isDark ? "rgba(245,240,255,0.95)" : "#1a1a2e",
                caretColor: "#c084fc",
              }}
            />

            {/* Кнопка поиска — внутри враппера с отступом */}
            {searchQuery && (
              <button
                onClick={handleSearch}
                className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 focus:outline-none transition-all duration-200"
                style={{
                  background: isDark
                    ? "rgba(168,85,247,0.2)"
                    : "rgba(147,51,234,0.1)",
                  color: isDark ? "rgba(216,180,254,0.9)" : "#7c3aed",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark
                    ? "rgba(168,85,247,0.35)"
                    : "rgba(147,51,234,0.18)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 0 10px rgba(168,85,247,0.3)"
                    : "none";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark
                    ? "rgba(168,85,247,0.2)"
                    : "rgba(147,51,234,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Search className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        )}

        {error && (
          <div
            className="text-center py-12 text-sm rounded-xl"
            style={{
              color: "#f87171",
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: Users,
                  label: "Top Artists",
                  value: topArtists.length,
                  color: "#a855f7",
                },
                {
                  icon: Music,
                  label: "Top Tracks",
                  value: topTracks.length,
                  color: "#38bdf8",
                },
                {
                  icon: Tag,
                  label: "Genres",
                  value: tags.length || "—",
                  color: "#ec4899",
                },
                {
                  icon: TrendingUp,
                  label: "Selected",
                  value: selectedArtist ?? "None",
                  color: "#34d399",
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                  }}
                >
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

            {/* ── Bar Chart — Top Artists ── */}
            <div
              className="rounded-2xl p-6"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <h2
                className="text-base font-semibold mb-6"
                style={{ color: textPrimary }}
              >
                🎤 Top Artists by Listeners
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barCategoryGap="30%">
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
                    onClick={(data: any) => {
                      setSelectedArtist(data?.payload?.fullName);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p
                className="text-xs mt-3 text-center"
                style={{ color: textMuted }}
              >
                Click a bar to load genres for that artist
              </p>
            </div>

            {/* ── PieChart + Tracks ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Genres Pie */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                }}
              >
                <h2
                  className="text-base font-semibold mb-4"
                  style={{ color: textPrimary }}
                >
                  🎸 Genres{" "}
                  {selectedArtist
                    ? `— ${selectedArtist}`
                    : "(select an artist)"}
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

              {/* Top Tracks */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                }}
              >
                <h2
                  className="text-base font-semibold mb-4"
                  style={{ color: textPrimary }}
                >
                  🔥 Top Tracks Global
                </h2>

                <div className="relative">
                  {/* Список */}
                  <div
                    className="space-y-1.5 overflow-y-auto pr-1"
                    style={{ maxHeight: 320 }}
                  >
                    {topTracks.map((track, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                        style={{
                          background: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "#f9fafb",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDark
                            ? "rgba(168,85,247,0.07)"
                            : "#f3e8ff";
                          e.currentTarget.style.borderColor =
                            "rgba(168,85,247,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isDark
                            ? "rgba(255,255,255,0.02)"
                            : "#f9fafb";
                          e.currentTarget.style.borderColor = isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.05)";
                        }}
                      >
                        {/* Номер */}
                        <span
                          className="text-xs font-bold w-5 text-center flex-shrink-0 tabular-nums"
                          style={{ color: COLORS[i % COLORS.length] }}
                        >
                          {i + 1}
                        </span>

                        {/* Обложка */}
                        <div
                          className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                          style={{
                            background: `${COLORS[i % COLORS.length]}22`,
                          }}
                        >
                          {track.image?.[1]?.["#text"] ? (
                            <img
                              src={track.image[1]["#text"]}
                              alt={track.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs">🎵</span>
                          )}
                        </div>

                        {/* Название + артист */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: textPrimary }}
                          >
                            {track.name}
                          </p>
                          <p
                            className="text-xs truncate"
                            style={{ color: textMuted }}
                          >
                            {track.artist.name}
                          </p>
                        </div>

                        {/* Listeners */}
                        <span
                          className="text-xs tabular-nums flex-shrink-0"
                          style={{ color: textMuted }}
                        >
                          {fmt(track.listeners)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fade снизу */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                    style={{
                      background: isDark
                        ? "linear-gradient(to bottom, transparent, rgba(6,6,17,0.9))"
                        : "linear-gradient(to bottom, transparent, #ffffff)",
                      borderRadius: "0 0 12px 12px",
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Insights;
