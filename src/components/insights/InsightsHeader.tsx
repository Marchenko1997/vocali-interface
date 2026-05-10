import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Sparkles, BarChart2, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import BackButton from "../../shared/BackButton";

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
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const textPrimary = isDark ? "rgba(255,255,255,0.9)" : "#1a1a2e";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const mobileItemStyle = isDark
    ? {
        background: "rgba(168,85,247,0.06)",
        border: "1px solid rgba(168,85,247,0.2)",
        color: "rgba(200,180,255,0.8)",
      }
    : {
        background: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.08)",
        color: "#6b7280",
      };

  return (
    <div
      className="sticky top-0 z-20"
      style={{
        borderBottom: `1px solid ${cardBorder}`,
        background: isDark ? "rgba(6,6,17,0.88)" : "rgba(245,243,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: isDark
          ? "0 1px 0 rgba(168,85,247,0.1), 0 4px 24px rgba(0,0,0,0.3)"
          : "0 1px 0 rgba(147,51,234,0.06), 0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {isDark && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.4) 30%, rgba(236,72,153,0.4) 60%, transparent 100%)",
          }}
        />
      )}

      {/* ── Main bar ── */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2">
          <BackButton
            isDark={isDark}
            cardBorder={cardBorder}
            textMuted={textMuted}
            textPrimary={textPrimary}
          />

          <button
            onClick={() => navigate("/studio", { state: { showSplash: true } })}
            className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
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
              } else e.currentTarget.style.background = "#e0e7ff";
            }}
            onMouseLeave={(e) => {
              if (isDark) {
                e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                e.currentTarget.style.boxShadow = "none";
              } else e.currentTarget.style.background = "#eef2ff";
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Studio
          </button>
        </div>

        {/* Center — Title */}
        <h1
          className="text-lg sm:text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 pointer-events-none"
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

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search desktop */}
          <div
            className="hidden sm:flex relative items-center gap-1"
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
              className="text-sm py-1.5 pl-8 pr-2 bg-transparent outline-none w-44"
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark
                    ? "rgba(168,85,247,0.2)"
                    : "rgba(147,51,234,0.1)";
                }}
              >
                <Search className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg focus:outline-none transition-all duration-200"
            style={
              isDark
                ? {
                    background: "rgba(168,85,247,0.06)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    color: "rgba(200,180,255,0.7)",
                  }
                : {
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    color: "#6b7280",
                  }
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = isDark
                ? "rgba(168,85,247,0.4)"
                : "rgba(147,51,234,0.3)";
              e.currentTarget.style.color = isDark
                ? "rgba(216,180,254,0.9)"
                : "#7c3aed";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark
                ? "rgba(168,85,247,0.2)"
                : "rgba(0,0,0,0.08)";
              e.currentTarget.style.color = isDark
                ? "rgba(200,180,255,0.7)"
                : "#6b7280";
            }}
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Burger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 flex items-center justify-center rounded-lg focus:outline-none transition-all duration-200"
            style={
              isDark
                ? {
                    color: "rgba(200,180,255,0.7)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    backgroundColor: "rgba(168,85,247,0.06)",
                  }
                : {
                    color: "#7c3aed",
                    border: "1px solid #e9d5ff",
                    backgroundColor: "#faf5ff",
                  }
            }
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden border-t"
          style={{
            borderColor: isDark
              ? "rgba(168,85,247,0.15)"
              : "rgba(147,51,234,0.1)",
          }}
        >
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Search */}
            <div
              className={`flex items-center justify-center gap-2 w-full rounded-xl  ${
                isDark
                  ? "bg-[rgba(168,85,247,0.06)] border border-[rgba(168,85,247,0.2)] text-[rgba(200,180,255,0.8)]"
                  : "bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.08)] text-[#6b7280]"
              }`}
            >
              <span
                role="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    handleSearch();
                    setMobileMenuOpen(false);
                  }
                }}
                className="px-3 cursor-pointer inline-flex items-center"
              >
                <Search
                  className="w-4 h-4"
                  style={{
                    color: isDark
                      ? "rgba(168,85,247,0.55)"
                      : "rgba(147,51,234,0.45)",
                  }}
                />
              </span>
              <input
                type="text"
                placeholder="Search artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    handleSearch();
                    setMobileMenuOpen(false);
                  }
                }}
                className="bg-transparent outline-none text-sm min-w-0 flex-1"
                style={{
                  color: isDark ? "rgba(245,240,255,0.95)" : "#1a1a2e",
                  caretColor: "#c084fc",
                }}
              />
            </div>

            {/* Studio */}
            <button
              onClick={() => {
                navigate("/studio", { state: { showSplash: true } });
                setMobileMenuOpen(false);
              }}
              className="rounded-xl text-sm font-medium"
              style={{
                ...(isDark
                  ? {
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "rgba(165,180,252,0.95)",
                    }
                  : {
                      background: "#eef2ff",
                      border: "1px solid #c7d2fe",
                      color: "#4f46e5",
                    }),
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
              }}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              Studio
            </button>

            {/* Insights current */}
            <div
              className="rounded-xl text-sm font-medium"
              style={{
                ...(isDark
                  ? {
                      background: "rgba(168,85,247,0.12)",
                      border: "1px solid rgba(168,85,247,0.35)",
                      color: "rgba(192,132,252,0.95)",
                      boxShadow: "0 0 14px rgba(168,85,247,0.15)",
                    }
                  : {
                      background: "#ede9fe",
                      border: "1px solid #d8b4fe",
                      color: "#7c3aed",
                    }),
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
              }}
            >
              <BarChart2 className="w-4 h-4 flex-shrink-0" />
              Insights
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: isDark
                    ? "rgba(168,85,247,0.2)"
                    : "rgba(124,58,237,0.1)",
                  color: isDark ? "rgba(216,180,254,0.8)" : "#7c3aed",
                }}
              >
                current
              </span>
            </div>

            {/* Theme */}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="rounded-xl text-sm font-medium"
              style={{
                ...mobileItemStyle,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
              }}
            >
              {theme === "light" ? (
                <>
                  <span>🌙</span>Dark Mode
                </>
              ) : (
                <>
                  <span>☀️</span>Light Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsHeader;
