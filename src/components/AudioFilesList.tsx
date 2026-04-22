import { FileAudio, FileText, Download, Loader2, Trash2 } from "lucide-react";
import type { AudioFile, PaginationInfo } from "../types/main_interfaces";
import WaveformPlayer from "./WaveformPlayer";
import Pagination from "./Pagination";
import { useTheme } from "../context/ThemeContext";

interface AudioFilesListProps {
  audioFiles: AudioFile[];
  loadingFiles: boolean;
  deletingFiles: Record<string, boolean>;
  activeAudio: string | null;
  setActiveAudio: (id: string | null) => void;
  pagination: PaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete: (fileKey: string, fileName: string) => void;
  onDownloadText: (fileName: string, text: string) => void;
}

const AudioFilesList = ({
  audioFiles,
  loadingFiles,
  deletingFiles,
  activeAudio,
  setActiveAudio,
  pagination,
  currentPage,
  onPageChange,
  onDelete,
  onDownloadText,
}: AudioFilesListProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const statusStyle = (status: string) => {
    if (isDark) {
      if (status === "completed") return { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", color: "rgba(134,239,172,0.95)" };
      if (status === "processing") return { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", color: "rgba(253,230,138,0.95)" };
      if (status === "failed") return { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", color: "rgba(252,165,165,0.95)" };
      return { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", color: "rgba(200,180,255,0.7)" };
    } else {
      if (status === "completed") return { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", color: "rgb(21,128,61)" };
      if (status === "processing") return { bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.3)", color: "rgb(133,100,4)" };
      if (status === "failed") return { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", color: "rgb(185,28,28)" };
      return { bg: "var(--bg-card-hover)", border: "var(--border-color)", color: "var(--text-muted)" };
    }
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden"
      style={
        isDark
          ? {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(168,85,247,0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            }
          : {
              backgroundColor: "var(--bg-card)",
              boxShadow: "var(--shadow-card)",
            }
      }
    >
      {/* Dark: top accent line */}
      {isDark && (
        <div
          className="absolute top-0 left-8 right-8 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.4), rgba(59,130,246,0.4), transparent)",
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={
              isDark
                ? {
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    boxShadow: "0 0 14px rgba(59,130,246,0.15)",
                  }
                : { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }
            }
          >
            <FileAudio
              className="h-5 w-5"
              style={{ color: isDark ? "rgb(96,165,250)" : "rgb(37,99,235)" }}
            />
          </div>
          <h2
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Your Audio Files
          </h2>
        </div>

        {loadingFiles && (
          <div
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm"
            style={
              isDark
                ? { background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: "rgba(200,180,255,0.7)" }
                : { background: "var(--bg-card-hover)", color: "var(--text-muted)" }
            }
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {(!audioFiles || audioFiles.length === 0) && !loadingFiles ? (
        <div className="text-center py-12 sm:py-16">
          <div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-5"
            style={
              isDark
                ? {
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    boxShadow: "0 0 24px rgba(59,130,246,0.1)",
                  }
                : { background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }
            }
          >
            <FileAudio
              className="h-8 w-8 sm:h-10 sm:w-10"
              style={{ color: isDark ? "rgba(96,165,250,0.6)" : "rgba(37,99,235,0.4)" }}
            />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            No audio files yet
          </h3>
          <p className="text-sm sm:text-base" style={{ color: "var(--text-faint)" }}>
            Upload your first audio file to get started
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {audioFiles.map((file) => (
              <div
                key={file.fileKey}
                className="rounded-xl p-3 sm:p-4 transition-all duration-300 group relative overflow-hidden"
                style={
                  isDark
                    ? {
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(168,85,247,0.1)",
                        backdropFilter: "blur(8px)",
                      }
                    : {
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--bg-card)",
                      }
                }
                onMouseEnter={(e) => {
                  if (isDark) {
                    e.currentTarget.style.border = "1px solid rgba(59,130,246,0.3)";
                    e.currentTarget.style.background = "rgba(59,130,246,0.05)";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.1)";
                  } else {
                    e.currentTarget.style.backgroundColor = "var(--bg-card-hover)";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isDark) {
                    e.currentTarget.style.border = "1px solid rgba(168,85,247,0.1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                    e.currentTarget.style.boxShadow = "none";
                  } else {
                    e.currentTarget.style.backgroundColor = "var(--bg-card)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {/* Dark: corner glow on hover */}
                {isDark && (
                  <div
                    className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "radial-gradient(circle at top right, rgba(59,130,246,0.12) 0%, transparent 70%)",
                    }}
                  />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">

                    {/* Icon */}
                    <div
                      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0"
                      style={
                        isDark
                          ? {
                              background: "rgba(59,130,246,0.1)",
                              border: "1px solid rgba(59,130,246,0.22)",
                              boxShadow: "0 0 12px rgba(59,130,246,0.12)",
                            }
                          : { background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }
                      }
                    >
                      <FileAudio
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        style={{ color: isDark ? "rgb(96,165,250)" : "rgb(37,99,235)" }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* File name */}
                      <h3
                        className="font-semibold text-sm sm:text-base truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {file.metadata.originalName}
                      </h3>

                      {/* File meta */}
                      <div
                        className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-medium"
                          style={
                            isDark
                              ? { background: "rgba(168,85,247,0.08)", color: "rgba(200,180,255,0.6)", border: "1px solid rgba(168,85,247,0.15)" }
                              : { background: "var(--bg-card-hover)", color: "var(--text-muted)" }
                          }
                        >
                          {file.metadata.format}
                        </span>
                        <span>{Math.round(file.fileSize / 1024)} KB</span>
                        <span style={{ color: isDark ? "rgba(168,85,247,0.3)" : "var(--border-color)" }}>•</span>
                        <span>{file.duration}s</span>

                        {file.metadata.transcription?.status && (() => {
                          const s = statusStyle(file.metadata.transcription.status);
                          return (
                            <>
                              <span style={{ color: isDark ? "rgba(168,85,247,0.3)" : "var(--border-color)" }}>•</span>
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                              >
                                {file.metadata.transcription.status}
                              </span>
                            </>
                          );
                        })()}
                      </div>

                      {/* Transcription block */}
                      {file.metadata.transcription?.text &&
                        file.metadata.transcription.text.trim() !== "" && (
                          <div
                            className="mt-3 p-2.5 sm:p-3 rounded-lg relative"
                            style={
                              isDark
                                ? {
                                    background: "rgba(59,130,246,0.07)",
                                    border: "1px solid rgba(59,130,246,0.2)",
                                    backdropFilter: "blur(6px)",
                                  }
                                : {
                                    backgroundColor: "rgba(59,130,246,0.06)",
                                    border: "1px solid rgba(59,130,246,0.18)",
                                  }
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FileText
                                  className="h-3.5 w-3.5"
                                  style={{ color: isDark ? "rgba(96,165,250,0.9)" : "rgb(37,99,235)" }}
                                />
                                <span
                                  className="text-xs sm:text-sm font-medium"
                                  style={{ color: isDark ? "rgba(96,165,250,0.9)" : "rgb(37,99,235)" }}
                                >
                                  Transcription
                                </span>
                                {file.metadata.transcription?.status !== "completed" && (
                                  <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={(() => {
                                      const s = statusStyle(file.metadata.transcription.status);
                                      return { backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color };
                                    })()}
                                  >
                                    {file.metadata.transcription?.status}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => onDownloadText(file.metadata.originalName, file.metadata.transcription.text)}
                                className="p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none"
                                style={{ backgroundColor: "transparent", color: isDark ? "rgba(96,165,250,0.8)" : "rgb(37,99,235)" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)";
                                  if (isDark) e.currentTarget.style.boxShadow = "0 0 10px rgba(59,130,246,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                                title="Download transcription"
                              >
                                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                            <p
                              className="text-xs sm:text-sm leading-relaxed line-clamp-3 italic"
                              style={{ color: "var(--text-muted)" }}
                            >
                              "{file.metadata.transcription.text}"
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-1 sm:space-x-3 sm:ml-4">
                    <WaveformPlayer
                      audioUrl={file.downloadUrl}
                      audioId={file.fileKey}
                      activeAudio={activeAudio}
                      setActiveAudio={setActiveAudio}
                    />

                    <button
                      onClick={() => onDelete(file.fileKey, file.metadata.originalName)}
                      disabled={deletingFiles[file.fileKey]}
                      className="p-2 sm:p-2.5 transition-all duration-200 rounded-lg flex items-center justify-center focus:outline-none"
                      style={
                        deletingFiles[file.fileKey]
                          ? { color: "var(--text-faint)", cursor: "not-allowed", opacity: 0.5 }
                          : { color: "var(--text-muted)", backgroundColor: "transparent" }
                      }
                      onMouseEnter={(e) => {
                        if (!deletingFiles[file.fileKey]) {
                          e.currentTarget.style.color = isDark ? "rgba(252,165,165,1)" : "#ef4444";
                          e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
                          if (isDark) e.currentTarget.style.boxShadow = "0 0 12px rgba(239,68,68,0.2)";
                          e.currentTarget.style.border = "1px solid rgba(239,68,68,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!deletingFiles[file.fileKey]) {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.border = "1px solid transparent";
                        }
                      }}
                      title="Delete audio file"
                    >
                      {deletingFiles[file.fileKey] ? (
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={onPageChange}
              showItemCount={true}
              itemLabel="files"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AudioFilesList;