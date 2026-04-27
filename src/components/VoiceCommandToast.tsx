import { useEffect, useState } from "react";
import { Mic, CheckCircle, XCircle } from "lucide-react";
import type { VoiceLogEntry } from "../hooks/useVoiceLog";
import { useTheme } from "../context/ThemeContext";

interface Props {
  entry: VoiceLogEntry | null;
}

const VoiceCommandToast = ({ entry }: Props) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<VoiceLogEntry | null>(null);

  useEffect(() => {
    if (!entry) return;
    setCurrentEntry(entry);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [entry]);

  if (!currentEntry) return null;

  const icon =
    currentEntry.type === "result" ? (
      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
    ) : currentEntry.type === "error" ? (
      <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
    ) : (
      <Mic className="h-3.5 w-3.5 flex-shrink-0" />
    );

  const colors = isDark
    ? {
        command: {
          bg: "rgba(168,85,247,0.12)",
          border: "rgba(168,85,247,0.3)",
          color: "rgba(216,180,254,0.95)",
          glow: "rgba(168,85,247,0.15)",
        },
        result: {
          bg: "rgba(52,211,153,0.1)",
          border: "rgba(52,211,153,0.3)",
          color: "rgba(110,231,183,0.95)",
          glow: "rgba(52,211,153,0.12)",
        },
        error: {
          bg: "rgba(239,68,68,0.1)",
          border: "rgba(239,68,68,0.3)",
          color: "rgba(252,165,165,0.95)",
          glow: "rgba(239,68,68,0.12)",
        },
      }
    : {
        command: {
          bg: "rgba(147,51,234,0.08)",
          border: "rgba(147,51,234,0.2)",
          color: "#7c3aed",
          glow: "none",
        },
        result: {
          bg: "rgba(22,163,74,0.08)",
          border: "rgba(22,163,74,0.2)",
          color: "#15803d",
          glow: "none",
        },
        error: {
          bg: "rgba(239,68,68,0.08)",
          border: "rgba(239,68,68,0.2)",
          color: "#dc2626",
          glow: "none",
        },
      };

  const c = colors[currentEntry.type];

  return (
    <>
      <style>{`
        @keyframes vctoast-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vctoast-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-6px) scale(0.97); }
        }
      `}</style>
      <div
        className="fixed top-[72px] left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        style={{
          animation: visible
            ? "vctoast-in 0.25s cubic-bezier(0.16,1,0.3,1) both"
            : "vctoast-out 0.3s ease-in both",
        }}
      >
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap"
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
            color: c.color,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: isDark
              ? `0 4px 20px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.04) inset`
              : "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          {icon}
          <span className="max-w-[260px] truncate">
            {currentEntry.type === "command" ? "you said: " : ""}
            <strong>{currentEntry.text}</strong>
          </span>
        </div>
      </div>
    </>
  );
};

export default VoiceCommandToast;
