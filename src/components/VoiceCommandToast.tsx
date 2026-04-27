import { useEffect, useState } from "react";
import { Mic, CheckCircle, XCircle } from "lucide-react";
import type { VoiceLogEntry } from "../hooks/useVoiceLog";

interface Props {
  entry: VoiceLogEntry | null;
}

const VoiceCommandToast = ({ entry }: Props) => {
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

  return (
    <div
      className={`fixed top-[72px] left-1/2 -translate-x-1/2 z-50 pointer-events-none ${
        visible ? "voice-toast--in" : "voice-toast--out"
      }`}
    >
      <div className={`voice-toast voice-toast--${currentEntry.type}`}>
        {icon}
        <span className="max-w-[260px] truncate">
          {currentEntry.type === "command" ? "you said: " : ""}
          <strong>{currentEntry.text}</strong>
        </span>
      </div>
    </div>
  );
};

export default VoiceCommandToast;
