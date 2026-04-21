import { useState } from "react";
import {
  LogOut,
  User,
  Mail,
  Menu,
  X,
  Mic,
  MicOff,
  Sun,
  Moon,
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

const Header = ({
  user,
  onLogout,
  voiceActive,
  onVoiceToggle,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="shadow-sm border-b transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Logo size="md" />
            <h1
              className="text-xl sm:text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Vocali
            </h1>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md focus:outline-none transition-colors flex items-center justify-center"
            style={{ color: "var(--text-muted)" }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <div className="hidden lg:flex items-center space-x-4">
            {/* Voice toggle */}
            <button
              onClick={onVoiceToggle}
              title={
                voiceActive ? "Disable voice commands" : "Enable voice commands"
              }
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg border font-medium text-sm
                transition-all duration-200
                ${
                  voiceActive
                    ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    : "border-gray-200 hover:bg-gray-100"
                }
              `}
              style={
                !voiceActive
                  ? {
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-muted)",
                      borderColor: "var(--border-color)",
                    }
                  : {}
              }
            >
              {voiceActive ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Mic className="h-4 w-4" />
                  <span>Voice On</span>
                </>
              ) : (
                <>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--border-color)" }}
                  />
                  <MicOff className="h-4 w-4" />
                  <span>Voice Off</span>
                </>
              )}
            </button>

            {/* Studio button */}
            <button
              onClick={() =>
                navigate("/studio", { state: { showSplash: true } })
              }
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium text-sm transition-all duration-200 focus:outline-none"
            >
              <Sparkles className="h-4 w-4" />
              <span>Studio</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
              className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 hover:scale-105 focus:outline-none"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            {/* User info */}
            {user && (
              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center space-x-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div
                  className="flex items-center space-x-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center justify-center space-x-2 transition-colors focus:outline-none"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t py-4 space-y-4"
            style={{ borderColor: "var(--border-color)" }}
          >
            {/* Voice toggle mobile */}
            <button
              onClick={onVoiceToggle}
              className={`
                w-full flex items-center space-x-2 px-3 py-2 rounded-lg border font-medium text-sm
                transition-all duration-200
                ${voiceActive ? "bg-green-50 border-green-300 text-green-700" : ""}
              `}
              style={
                !voiceActive
                  ? {
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }
                  : {}
              }
            >
              {voiceActive ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <Mic className="h-4 w-4" />
                  <span>Voice Commands: On</span>
                </>
              ) : (
                <>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--border-color)" }}
                  />
                  <MicOff className="h-4 w-4" />
                  <span>Voice Commands: Off</span>
                </>
              )}
            </button>

            {/* Studio mobile */}
            <button
              onClick={() => {
                 navigate("/studio", { state: { showSplash: true } });
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 font-medium text-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>Studio</span>
            </button>

            {/* Theme toggle mobile */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg border font-medium text-sm transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            {/* User info mobile */}
            {user && (
              <div className="space-y-2">
                <div
                  className="flex items-center space-x-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <div
                  className="flex items-center space-x-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
            )}

            {/* Logout mobile */}
            <button
              onClick={onLogout}
              className="flex items-center justify-center space-x-2 transition-colors w-full p-2 rounded-lg"
              style={{ color: "var(--text-muted)" }}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
