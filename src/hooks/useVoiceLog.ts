import { useState, useCallback } from "react";

export interface VoiceLogEntry {
  id: number;
  text: string;
  type: "command" | "result" | "error";
  timestamp: Date;
}

let _id = 0;

export const useVoiceLog = () => {
    const [log, setLog] = useState<VoiceLogEntry[]>([]);

  const addEntry = useCallback(
    (text: string, type: VoiceLogEntry["type"] = "command") => {
      const entry: VoiceLogEntry = {
        id: ++_id,
        text,
        type,
        timestamp: new Date(),
      };
      setLog((prev) => [entry, ...prev].slice(0, 10)); 
    },
    [],
    );
    
    const clearLog = useCallback(() => setLog([]), []);
    
    return { log, addEntry, clearLog };

}