import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Upload,
  AlertCircle,
  Mic,
  Headphones,
  Heart,
} from "lucide-react";
import { Notify } from "notiflix";
import { logout, getProfile } from "../redux/slices/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import api from "../services/api";

import Header from "../components/Header";
import RealTimeRecording from "../components/RealTimeRecording";
import SpotifyPanel from "../components/SpotifyPanel";
import FavoritesPanel from "../components/FavoritesPanel";
import AudioFilesList from "../components/AudioFilesList";

import { useAudioFiles } from "../hooks/useAudioFiles";
import { useSpotify } from "../hooks/useSpotify";
import { useVoiceCommands } from "../hooks/useVoiceCommands";
import { useAIPlaylist } from "../hooks/useAIPlaylist";
import { useTheme } from "../context/ThemeContext";
import SplashScreen from "../components/SplashScreen";
import { useVoiceLog } from "../hooks/useVoiceLog";
import VoiceCommandToast from "../components/VoiceCommandToast";
import { useMood, type MoodId } from "../context/MoodContext";

/* ─── card config ─────────────────────────────────────────── */
const CARDS = [
  {
    id: "upload",
    title: "Upload Audio",
    desc: "Upload your audio file for voice processing and analysis. Maximum file size: 20 MB.",
    icon: Upload,
    lightIcon: "bg-blue-100",
    lightIconColor: "text-blue-600",
    darkAccent: "rgba(59,130,246,",
    darkBorder: "rgba(59,130,246,0.35)",
    darkGlow: "rgba(59,130,246,0.18)",
    btnLight:
      "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
  },
  {
    id: "recording",
    title: "Real-Time Recording",
    desc: "Record audio directly from your microphone with live transcription.",
    icon: Mic,
    lightIcon: "bg-purple-100",
    lightIconColor: "text-purple-600",
    darkAccent: "rgba(168,85,247,",
    darkBorder: "rgba(168,85,247,0.35)",
    darkGlow: "rgba(168,85,247,0.18)",
    btnLight:
      "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
  },
  {
    id: "spotify",
    title: "Music Control",
    desc: "Control Spotify with your voice",
    icon: Headphones,
    lightIcon: "bg-green-100",
    lightIconColor: "text-green-600",
    darkAccent: "rgba(52,211,153,",
    darkBorder: "rgba(52,211,153,0.35)",
    darkGlow: "rgba(52,211,153,0.18)",
    btnLight:
      "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
  },
  {
    id: "favorites",
    title: "Favorites",
    desc: "Your saved tracks",
    icon: Heart,
    lightIcon: "bg-pink-100",
    lightIconColor: "text-pink-600",
    darkAccent: "rgba(236,72,153,",
    darkBorder: "rgba(236,72,153,0.35)",
    darkGlow: "rgba(236,72,153,0.18)",
    btnLight: "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
  },
];

const Main = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { user, isAuthenticated, token, loading } = useSelector(
    (state: RootState) => state.auth,
  );
  const hasFetchedProfile = useRef(false);

  const [showRealTimeRecording, setShowRealTimeRecording] = useState(false);
  const [savingRealTimeRecording, setSavingRealTimeRecording] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const audioFiles = useAudioFiles(isAuthenticated, token);
  const spotify = useSpotify();
  const [voiceActive, setVoiceActive] = useState(false);
  const voiceActiveRef = useRef(false);
const { log, addEntry } = useVoiceLog();

  useEffect(() => {
    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      isAuthenticated &&
      !user &&
      !hasFetchedProfile.current
    ) {
      hasFetchedProfile.current = true;
      dispatch(getProfile());
    }
  }, [token, isAuthenticated, dispatch]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !token ||
      token === "undefined" ||
      token === "null"
    ) {
      hasFetchedProfile.current = false;
      navigate("/auth#login");
    }
  }, [isAuthenticated, token, navigate]);

  useEffect(() => {
    if (isAuthenticated && token && user) {
      const timer = setTimeout(() => setShowSplash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, token, user]);

  const handleLogout = () => {
    hasFetchedProfile.current = false;
    dispatch(logout());
    navigate("/auth#login");
  };

  const handleRealTimeTranscriptionComplete = async (
    transcriptionText: string,
    audioBlob?: Blob,
  ) => {
    try {
      if (!audioBlob) return;
      setSavingRealTimeRecording(true);
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");
      formData.append("transcription", transcriptionText);
      formData.append("recordingType", "real-time");
      const response = await api.post("/audio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Real-time recording saved successfully:", response.data);
      await audioFiles.fetchAudioFiles(1);
      Notify.success("Recording saved successfully!", {
        position: "center-top",
        timeout: 3000,
        clickToClose: true,
        pauseOnHover: true,
        borderRadius: "12px",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "14px",
      });
    } catch (error: any) {
      Notify.failure(
        "Failed to save recording: " +
          (error.response?.data?.message || error.message),
        {
          position: "center-top",
          timeout: 5000,
          clickToClose: true,
          pauseOnHover: true,
          borderRadius: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "14px",
        },
      );
    } finally {
      setSavingRealTimeRecording(false);
    }
  };

  const handleRealTimeError = (error: string) =>
    console.error("Real-time recording error:", error);

  const {
    playByVoice,
    pauseTrack,
    playNext,
    playPrevious,
    toggleFavorite,
    removeFavorite,
    selectedTrack,
  } = spotify;
  const { generatePlaylist, isGenerating, queue, clearQueue } = useAIPlaylist();
 const { activeMood, moodSource, setMood } = useMood();

  const { startListening, stopListening } = useVoiceCommands({
    onTranscript: (text) => addEntry(text, "command"),
    onPlay: (query) => {
      if (!query) return;
      clearQueue();
      setTimeout(() => setShowSpotify(true), 0);
      playByVoice(query);
    },
    onPause: () => {
      pauseTrack();
      setTimeout(() => setShowSpotify(false), 0);
    },
    onNext: () => {
      playNext();
    },
    onPrevious: () => {
      playPrevious();
    },
    onFavorite: () => {
      if (!selectedTrack) return;
      addEntry(`saved: ${selectedTrack.name}`, "result");
      toggleFavorite(selectedTrack);
      setTimeout(() => setShowFavorites(true), 0);
    },
    onUnfavorite: () => {
      if (!selectedTrack) return;
      removeFavorite(selectedTrack.id);
    },
    onRecord: () => {
      setShowRealTimeRecording((prev) => !prev);
    },
    onGeneratePlaylist: (prompt) => {
      generatePlaylist(prompt);
      setTimeout(() => setShowSpotify(true), 0);
    },
    onMoodChange: (moodId) => {
      setMood(moodId as MoodId, "voice");
      addEntry(`mood: ${moodId}`, "result");
    },
  });

  const handleVoiceToggle = () => {
    if (voiceActiveRef.current) {
      voiceActiveRef.current = false;
      setVoiceActive(false);
      stopListening();
    } else {
      voiceActiveRef.current = true;
      setVoiceActive(true);
      startListening();
    }
  };

  const getCardAction = (id: string) => {
    switch (id) {
      case "upload":
        return {
          label: audioFiles.uploading ? "Uploading..." : "Upload Audio",
          active: false,
          onClick: audioFiles.handleUploadClick,
        };
      case "recording":
        return {
          label: showRealTimeRecording ? "Hide Recorder" : "Start Recording",
          active: showRealTimeRecording,
          onClick: () => setShowRealTimeRecording(!showRealTimeRecording),
        };
      case "spotify":
        return {
          label: showSpotify ? "Stop Spotify Music" : "Start Spotify Music",
          active: showSpotify,
          onClick: () => {
            if (!showSpotify && activeMood) {
             
              generatePlaylist(`${activeMood} mood music playlist`);
            }
            setShowSpotify(!showSpotify);
          },
        };
      case "favorites":
        return {
          label: showFavorites ? "Hide Favorites" : "View Favorites",
          active: showFavorites,
          onClick: () => setShowFavorites(!showFavorites),
        };
      default:
        return { label: "", active: false, onClick: () => {} };
    }
  };

  /* ── loading / auth guards ── */
  if (
    loading &&
    !user &&
    isAuthenticated &&
    token &&
    token !== "undefined" &&
    token !== "null"
  ) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p style={{ color: "var(--text-muted)" }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !token || token === "undefined" || token === "null") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p style={{ color: "var(--text-muted)" }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (showSplash && isAuthenticated && token && user) {
    return <SplashScreen userName={user?.name?.split(" ")[0]} />;
  }

  /* ── main render ── */
  return (
    <div
      className="min-h-screen transition-colors duration-300 relative overflow-x-hidden"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      {/* ── Dark mode ambient background ── */}
      {isDark && (
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.025,
              backgroundImage: `
              linear-gradient(rgba(168,85,247,0) 0px,rgba(168,85,247,0) 59px,rgba(168,85,247,1) 59px,rgba(168,85,247,1) 60px),
              linear-gradient(90deg,rgba(168,85,247,0) 0px,rgba(168,85,247,0) 59px,rgba(168,85,247,1) 59px,rgba(168,85,247,1) 60px)
            `,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Top-left purple */}
          <div
            className="absolute -top-48 -left-48 w-[550px] h-[550px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.16) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "orb-float 20s ease-in-out infinite",
            }}
          />
          {/* Top-right pink */}
          <div
            className="absolute -top-36 -right-36 w-[450px] h-[450px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%)",
              filter: "blur(55px)",
              animation: "orb-float-r 16s ease-in-out infinite",
            }}
          />
          {/* Bottom blue */}
          <div
            className="absolute -bottom-24 left-1/3 w-[500px] h-48 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)",
              filter: "blur(50px)",
              animation: "orb-float 24s ease-in-out infinite reverse",
            }}
          />
          {/* Diagonal tint */}
          <div className="ambient-diagonal-tint" />
        </div>
      )}
      {/* ── Voice Command Toast ── */}
      {voiceActive && <VoiceCommandToast entry={log[0] ?? null} />}
      {/* ── Header ── */}
      <div className="relative z-10">
        <Header
          user={user}
          onLogout={handleLogout}
          voiceActive={voiceActive}
          onVoiceToggle={handleVoiceToggle}
        />
      </div>
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* ── Welcome hero ── */}
          <div
            className="rounded-2xl px-6 py-5 sm:px-8 sm:py-6 max-w-4xl mx-auto relative"
            style={
              isDark
                ? {
                    background:
                      "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.07) 50%, rgba(59,130,246,0.06) 100%)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    backdropFilter: "blur(12px)",
                    boxShadow:
                      "0 0 40px rgba(168,85,247,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }
                : {
                    background:
                      "linear-gradient(135deg, #eff6ff 0%, #faf5ff 50%, #fdf2f8 100%)",
                    border: "1px solid rgba(147,51,234,0.12)",
                    boxShadow: "0 2px 16px rgba(147,51,234,0.06)",
                  }
            }
          >
            {/* Glass glare — dark only */}
            {isDark && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
                }}
              />
            )}

            {/* Voice Active badge */}
            {voiceActive && (
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold w-fit"
                  style={
                    isDark
                      ? {
                          background: "rgba(74,222,128,0.1)",
                          border: "1px solid rgba(74,222,128,0.3)",
                          color: "rgba(134,239,172,0.95)",
                        }
                      : {
                          background: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          color: "rgb(21,128,61)",
                        }
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Voice Active
                </div>
              </div>
            )}

            {/* Heading — solid color + text-shadow (no background-clip: text) */}
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 leading-tight">
              <span
                style={{
                  color: isDark ? "#c084fc" : "#7c3aed",
                  textShadow: isDark
                    ? "0 0 20px rgba(192,132,252,0.5)"
                    : "none",
                }}
              >
                Hey, {user?.name?.split(" ")[0]} 👋
              </span>
            </h2>

            <p
              className="text-sm mt-1"
              style={{
                color: isDark
                  ? "rgba(200,180,255,0.65)"
                  : "rgba(107,33,168,0.65)",
              }}
            >
              Voice-controlled music &amp; transcription
            </p>
          </div>

          {/* ── Feature cards ── */}
          <div className="cards grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {CARDS.map((card) => {
              const Icon = card.icon;
              const action = getCardAction(card.id);

              return (
                <div
                  key={card.id}
                  className="relative rounded-xl p-4 sm:p-6 transition-all duration-300 overflow-hidden group"
                  style={
                    isDark
                      ? {
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${card.darkBorder.replace("0.35", "0.15")}`,
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
                          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                        }
                      : {
                          backgroundColor: "var(--bg-card)",
                          boxShadow: "var(--shadow-card)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (isDark) {
                      e.currentTarget.style.border = `1px solid ${card.darkBorder}`;
                      e.currentTarget.style.boxShadow = `0 0 30px ${card.darkGlow}, 0 4px 24px rgba(0,0,0,0.4)`;
                      e.currentTarget.style.background = `${card.darkAccent}0.06)`;
                    } else {
                      e.currentTarget.style.boxShadow =
                        "var(--shadow-card-hover)";
                      e.currentTarget.style.backgroundColor =
                        "var(--bg-card-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isDark) {
                      e.currentTarget.style.border = `1px solid ${card.darkBorder.replace("0.35", "0.15")}`;
                      e.currentTarget.style.boxShadow =
                        "0 4px 24px rgba(0,0,0,0.3)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)";
                    } else {
                      e.currentTarget.style.boxShadow = "var(--shadow-card)";
                      e.currentTarget.style.backgroundColor = "var(--bg-card)";
                    }
                  }}
                >
                  {/* Dark mode: corner glow accent */}
                  {isDark && (
                    <div
                      className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at top right, ${card.darkAccent}0.15) 0%, transparent 70%)`,
                      }}
                    />
                  )}
                  {/* Dark mode: top edge line */}
                  {isDark && (
                    <div
                      className="absolute top-0 left-6 right-6 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${card.darkBorder}, transparent)`,
                      }}
                    />
                  )}

                  <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 ${isDark ? "" : card.lightIcon}`}
                      style={
                        isDark
                          ? {
                              background: `${card.darkAccent}0.12)`,
                              border: `1px solid ${card.darkAccent}0.25)`,
                              boxShadow: `0 0 16px ${card.darkAccent}0.15)`,
                            }
                          : {}
                      }
                    >
                      <Icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? "" : card.lightIconColor}`}
                        style={
                          isDark
                            ? {
                                color: `${card.darkAccent}0.95)`
                                  .replace("rgba(", "rgb(")
                                  .replace(",0.95)", ")"),
                              }
                            : {}
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base sm:text-lg font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  {/* Upload file input */}
                  {card.id === "upload" && (
                    <input
                      ref={audioFiles.fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={audioFiles.handleFileUpload}
                      className="hidden"
                    />
                  )}

                  {/* Action button */}
                  <div className="relative group/btn">
                    <button
                      onClick={action.onClick}
                      disabled={card.id === "upload" && audioFiles.uploading}
                      className={`w-full text-white font-semibold py-2 sm:py-3 px-4 rounded-lg
                        transition-all duration-200 flex items-center justify-center space-x-2
                        text-sm sm:text-base min-h-[44px] focus:outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden
                        ${isDark ? "" : `bg-gradient-to-r ${card.btnLight} hover:scale-[1.01] active:scale-[0.99] shadow-lg`}
                      `}
                      style={
                        isDark
                          ? {
                              background: `${card.darkAccent}0.15)`,
                              border: `1px solid ${card.darkBorder}`,
                              color: "rgba(255,255,255,0.9)",
                              backdropFilter: "blur(8px)",
                              boxShadow: `0 0 20px ${card.darkGlow.replace("0.18", "0.12")}`,
                              transition:
                                "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                            }
                          : {}
                      }
                      onMouseEnter={(e) => {
                        if (isDark) {
                          e.currentTarget.style.background = `${card.darkAccent}0.25)`;
                          e.currentTarget.style.boxShadow = `0 0 28px ${card.darkGlow}`;
                          e.currentTarget.style.transform = "scale(1.01)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isDark) {
                          e.currentTarget.style.background = `${card.darkAccent}0.15)`;
                          e.currentTarget.style.boxShadow = `0 0 20px ${card.darkGlow.replace("0.18", "0.12")}`;
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      {isDark && (
                        <span
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)",
                          }}
                        />
                      )}
                      {card.id === "upload" && audioFiles.uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                          <span className="relative z-10">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Icon className="h-4 w-4 relative z-10" />
                          <span className="relative z-10">{action.label}</span>
                        </>
                      )}
                    </button>

                    {/* Upload tooltip */}
                    {card.id === "upload" && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>Maximum 20 MB audio files</span>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                      </div>
                    )}
                  </div>

                  {/* Upload error */}
                  {card.id === "upload" && audioFiles.uploadError && (
                    <div
                      className="mt-3 p-2 rounded-lg border"
                      style={{
                        backgroundColor: "rgba(239,68,68,0.08)",
                        borderColor: "rgba(239,68,68,0.3)",
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                        <span className="text-xs text-red-500">
                          {audioFiles.uploadError}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Favorites Panel ── */}
          <div
            className={`transition-all duration-300 overflow-hidden will-change-transform ${
              showFavorites
                ? "opacity-100 translate-y-0 max-h-[500px]"
                : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
            }`}
          >
            <FavoritesPanel
              favorites={spotify.favorites}
              selectedTrack={spotify.selectedTrack}
              onSelectTrack={spotify.selectTrack}
              onRemoveFavorite={spotify.removeFavorite}
            />
          </div>

          {/* ── AI Playlist generating indicator ── */}
          {isGenerating && (
            <div
              className="fixed bottom-6 right-6 rounded-xl shadow-lg p-4 flex items-center gap-3 z-50"
              style={
                isDark
                  ? {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(52,211,153,0.3)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 0 24px rgba(52,211,153,0.15)",
                      color: "rgba(255,255,255,0.9)",
                    }
                  : {
                      backgroundColor: "var(--bg-card)",
                      boxShadow: "var(--shadow-card-hover)",
                    }
              }
            >
              <Loader2 className="h-5 w-5 text-green-500 animate-spin" />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Generating playlist...
              </span>
            </div>
          )}

          {/* ── Spotify Panel ── */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              showSpotify
                ? "opacity-100 translate-y-0 max-h-[700px]"
                : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
            }`}
          >
            <SpotifyPanel
              spotifyQuery={spotify.spotifyQuery}
              onQueryChange={spotify.setSpotifyQuery}
              onSearch={spotify.handleSpotifySearch}
              loadingSpotify={spotify.loadingSpotify}
              spotifyResults={spotify.spotifyResults}
              hasSearched={spotify.hasSearched}
              selectedTrack={spotify.selectedTrack}
              playerSrc={spotify.playerSrc}
              isPlayerLoading={spotify.isPlayerLoading}
              onPlayerLoad={() => spotify.setIsPlayerLoading(false)}
              onSelectTrack={spotify.selectTrack}
              isFavorite={spotify.isFavorite}
              onToggleFavorite={spotify.toggleFavorite}
              loadMore={spotify.loadMore}
              hasMore={spotify.hasMore}
              aiQueue={queue}
              isGenerating={isGenerating}
              activeMood={activeMood}
              moodSource={moodSource}
              onClearQueue={clearQueue}
            />
          </div>

          {/* ── Real-Time Recording ── */}
          <div
            className={`transition-all duration-300 overflow-hidden will-change-transform ${
              showRealTimeRecording
                ? "opacity-100 translate-y-0 max-h-[900px]"
                : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"
            }`}
          >
            <div className="max-w-2xl mx-auto">
              <RealTimeRecording
                onTranscriptionComplete={handleRealTimeTranscriptionComplete}
                onError={handleRealTimeError}
                isSaving={savingRealTimeRecording}
              />
            </div>
          </div>

          {/* ── Audio Files List ── */}
          <AudioFilesList
            audioFiles={audioFiles.audioFiles}
            loadingFiles={audioFiles.loadingFiles}
            deletingFiles={audioFiles.deletingFiles}
            activeAudio={audioFiles.activeAudio}
            setActiveAudio={audioFiles.setActiveAudio}
            pagination={audioFiles.pagination}
            currentPage={audioFiles.currentPage}
            onPageChange={audioFiles.handlePageChange}
            onDelete={audioFiles.handleDeleteAudio}
            onDownloadText={audioFiles.handleDownloadText}
          />
        </div>
      </main>
    </div>
  );
};

export default Main;
