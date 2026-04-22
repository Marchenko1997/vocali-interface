import { useState } from "react";
import {
  LogOut,  Menu, X, Mic, MicOff, Sun, Moon,
} from "lucide-react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  voiceActive: boolean;
  onVoiceToggle: () => void;
}

const Header = ({ user, onLogout, voiceActive, onVoiceToggle }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className="border-b transition-colors duration-300 relative"
      style={
        isDark
          ? {
              backgroundColor: "rgba(15,14,20,0.75)",
              borderColor: "rgba(168,85,247,0.15)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 1px 0 rgba(168,85,247,0.1), 0 4px 24px rgba(0,0,0,0.3)",
            }
          : {
              backgroundColor: "rgba(255,255,255,0.85)",
              borderColor: "rgba(147,51,234,0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 1px 0 rgba(147,51,234,0.06), 0 2px 12px rgba(0,0,0,0.04)",
            }
      }
    >
      {/* Dark mode: subtle top accent line */}
      {isDark && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.4) 30%, rgba(236,72,153,0.4) 60%, transparent 100%)",
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo + Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Logo size="md" />
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={
                isDark
                  ? {
                      background: "linear-gradient(90deg, #c084fc, #e879f9)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 8px rgba(192,132,252,0.35))",
                    }
                  : { color: "var(--text-primary)" }
              }
            >
              Vocali
            </h1>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 flex items-center justify-center rounded-lg focus:outline-none transition-all duration-200"
            style={
              isDark
                ? {
                    color: "rgba(200,180,255,0.7)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    backgroundColor: "rgba(168,85,247,0.06)",
                  }
                : {
                    color: "var(--text-muted)",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "transparent",
                  }
            }
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-3">

            {/* Voice toggle */}
            <button
              onClick={onVoiceToggle}
              title={voiceActive ? "Disable voice commands" : "Enable voice commands"}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border font-medium text-sm transition-all duration-200 focus:outline-none"
              style={
                voiceActive
                  ? {
                      backgroundColor: "rgba(74,222,128,0.1)",
                      borderColor: "rgba(74,222,128,0.35)",
                      color: isDark ? "rgba(134,239,172,0.95)" : "rgb(21,128,61)",
                      boxShadow: isDark ? "0 0 12px rgba(74,222,128,0.12)" : "none",
                    }
                  : isDark
                  ? {
                      backgroundColor: "rgba(168,85,247,0.06)",
                      borderColor: "rgba(168,85,247,0.2)",
                      color: "rgba(200,180,255,0.7)",
                    }
                  : {
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }
              }
            >
              {voiceActive ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <Mic className="h-4 w-4" />
                  <span>Voice On</span>
                </>
              ) : (
                <>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isDark ? "rgba(168,85,247,0.4)" : "var(--border-color)",
                    }}
                  />
                  <MicOff className="h-4 w-4" />
                  <span>Voice Off</span>
                </>
              )}
            </button>

            {/* Studio button */}
            <button
              onClick={() => navigate("/studio", { state: { showSplash: true } })}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border font-medium text-sm transition-all duration-200 focus:outline-none"
              style={
                isDark
                  ? {
                      backgroundColor: "rgba(99,102,241,0.1)",
                      borderColor: "rgba(99,102,241,0.3)",
                      color: "rgba(165,180,252,0.95)",
                      boxShadow: "0 0 14px rgba(99,102,241,0.12)",
                    }
                  : {
                      backgroundColor: "#eef2ff",
                      borderColor: "#c7d2fe",
                      color: "#4f46e5",
                    }
              }
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.18)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.2)";
                } else {
                  e.currentTarget.style.backgroundColor = "#e0e7ff";
                }
              }}
              onMouseLeave={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.1)";
                  e.currentTarget.style.boxShadow = "0 0 14px rgba(99,102,241,0.12)";
                } else {
                  e.currentTarget.style.backgroundColor = "#eef2ff";
                }
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span>Studio</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 focus:outline-none"
              style={
                isDark
                  ? {
                      backgroundColor: "rgba(168,85,247,0.08)",
                      borderColor: "rgba(168,85,247,0.2)",
                      color: "rgba(200,180,255,0.8)",
                    }
                  : {
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }
              }
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.15)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(168,85,247,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Divider */}
            <div
              className="w-px h-6"
              style={{
                backgroundColor: isDark ? "rgba(168,85,247,0.2)" : "var(--border-color)",
              }}
            />

            {/* User info */}
            {user && (
              <div className="flex items-center space-x-3">
                {/* Avatar circle */}
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0"
                  style={
                    isDark
                      ? {
                          background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))",
                          border: "1px solid rgba(168,85,247,0.35)",
                          color: "rgba(200,180,255,0.95)",
                          boxShadow: "0 0 12px rgba(168,85,247,0.15)",
                        }
                      : {
                          background: "linear-gradient(135deg, #ede9fe, #fce7f3)",
                          border: "1px solid rgba(147,51,234,0.2)",
                          color: "#7c3aed",
                        }
                  }
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {user.name}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {user.email}
                  </span>
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg border transition-all duration-200 focus:outline-none text-sm"
              style={
                isDark
                  ? {
                      backgroundColor: "rgba(239,68,68,0.06)",
                      borderColor: "rgba(239,68,68,0.2)",
                      color: "rgba(252,165,165,0.8)",
                    }
                  : {
                      backgroundColor: "transparent",
                      borderColor: "transparent",
                      color: "var(--text-muted)",
                    }
              }
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.12)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
                  e.currentTarget.style.color = "rgba(252,165,165,1)";
                } else {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.06)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.06)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                  e.currentTarget.style.color = "rgba(252,165,165,0.8)";
                } else {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t py-4 space-y-3"
            style={{
              borderColor: isDark ? "rgba(168,85,247,0.15)" : "var(--border-color)",
            }}
          >
            {/* Voice toggle mobile */}
            <button
              onClick={onVoiceToggle}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200"
              style={
                voiceActive
                  ? {
                      backgroundColor: "rgba(74,222,128,0.1)",
                      borderColor: "rgba(74,222,128,0.35)",
                      color: isDark ? "rgba(134,239,172,0.95)" : "rgb(21,128,61)",
                    }
                  : isDark
                  ? {
                      backgroundColor: "rgba(168,85,247,0.06)",
                      borderColor: "rgba(168,85,247,0.2)",
                      color: "rgba(200,180,255,0.7)",
                    }
                  : {
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }
              }
            >
              {voiceActive ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <Mic className="h-4 w-4" />
                  <span>Voice Commands: On</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isDark ? "rgba(168,85,247,0.4)" : "var(--border-color)" }} />
                  <MicOff className="h-4 w-4" />
                  <span>Voice Commands: Off</span>
                </>
              )}
            </button>

            {/* Studio mobile */}
            <button
              onClick={() => { navigate("/studio", { state: { showSplash: true } }); setMobileMenuOpen(false); }}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg border font-medium text-sm"
              style={
                isDark
                  ? { backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)", color: "rgba(165,180,252,0.95)" }
                  : { backgroundColor: "#eef2ff", borderColor: "#c7d2fe", color: "#4f46e5" }
              }
            >
              <Sparkles className="h-4 w-4" />
              <span>Studio</span>
            </button>

            {/* Theme toggle mobile */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200"
              style={
                isDark
                  ? { backgroundColor: "rgba(168,85,247,0.08)", borderColor: "rgba(168,85,247,0.2)", color: "rgba(200,180,255,0.8)" }
                  : { backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-muted)" }
              }
            >
              {theme === "light" ? (
                <><Moon className="h-4 w-4" /><span>Dark Mode</span></>
              ) : (
                <><Sun className="h-4 w-4" /><span>Light Mode</span></>
              )}
            </button>

            {/* User info mobile */}
            {user && (
              <div
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg"
                style={
                  isDark
                    ? { backgroundColor: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.12)" }
                    : { backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }
                }
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0"
                  style={
                    isDark
                      ? { background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))", border: "1px solid rgba(168,85,247,0.35)", color: "rgba(200,180,255,0.95)" }
                      : { background: "linear-gradient(135deg, #ede9fe, #fce7f3)", border: "1px solid rgba(147,51,234,0.2)", color: "#7c3aed" }
                  }
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user.name}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</span>
                </div>
              </div>
            )}

            {/* Logout mobile */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg border font-medium text-sm transition-all duration-200"
              style={
                isDark
                  ? { backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)", color: "rgba(252,165,165,0.8)" }
                  : { backgroundColor: "transparent", borderColor: "var(--border-color)", color: "var(--text-muted)" }
              }
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;