import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type MoodId = "chill" | "party" | "focus" | "dark";

export type MoodSource = "manual" | "auto-bpm" | "voice";

interface MoodContextValue {
  activeMood: MoodId | null;
  moodSource: MoodSource | null;
  setMood: (id: MoodId, source: MoodSource) => void;
}

const MoodContext = createContext<MoodContextValue | null>(null);

export const MoodProvider = ({ children }: { children: ReactNode }) => {
     const [activeMood, setActiveMood] = useState<MoodId | null>(null); 
      const [moodSource, setMoodSource] = useState<MoodSource | null>(null); 

    const setMood = useCallback((id: MoodId, source: MoodSource) => {
        setActiveMood(id);
        setMoodSource(source);
    }, []); 

    return (
      <MoodContext.Provider value={{ activeMood, moodSource, setMood }}>
        {children}
      </MoodContext.Provider>
    );
}

export const useMood = () => {
    const ctx = useContext(MoodContext);
    if (!ctx) throw new Error("useMood must be used inside MoodProvider");
    return ctx;
}