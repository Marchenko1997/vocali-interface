import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Sparkles } from "lucide-react";

interface InsightsHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearch: () => void;
  isDark: boolean;
}

const InsightsHeader = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isDark,
}: InsightsHeaderProps) => {
  const navigate = useNavigate();

  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <div
      className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between gap-4"
      style={{
        borderBottom: `1px solid ${cardBorder}`,
        background: isDark ? "rgba(6,6,17,0.85)" : "rgba(245,243,255,0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
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
  );
};

export default InsightsHeader;
