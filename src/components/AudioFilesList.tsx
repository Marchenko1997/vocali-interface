import { FileAudio, FileText, Download, Loader2, Trash2 } from "lucide-react";
import type { AudioFile, PaginationInfo } from "../types/main_interfaces";
import WaveformPlayer from "./WaveformPlayer";
import Pagination from "./Pagination";

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
  return (
    <div
      className="rounded-2xl shadow-lg p-4 sm:p-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <FileAudio className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
          <h2
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Your Audio Files
          </h2>
        </div>
        {loadingFiles && (
          <div
            className="flex items-center space-x-2"
            style={{ color: "var(--text-muted)" }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {(!audioFiles || audioFiles.length === 0) && !loadingFiles ? (
        <div className="text-center py-8 sm:py-12">
          <FileAudio
            className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4"
            style={{ color: "var(--text-faint)" }}
          />
          <h3
            className="text-lg sm:text-xl font-semibold mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            No audio files yet
          </h3>
          <p
            className="text-sm sm:text-base"
            style={{ color: "var(--text-faint)" }}
          >
            Upload your first audio file to get started
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {audioFiles.map((file) => (
              <div
                key={file.fileKey}
                className="rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200"
                style={{
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-card)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--bg-card-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--bg-card)")
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex-shrink-0">
                      <FileAudio className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
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
                        className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span>{file.metadata.format}</span>
                        <span
                          className="hidden sm:inline"
                          style={{ color: "var(--border-color)" }}
                        >
                          •
                        </span>
                        <span>{Math.round(file.fileSize / 1024)} KB</span>
                        <span
                          className="hidden sm:inline"
                          style={{ color: "var(--border-color)" }}
                        >
                          •
                        </span>
                        <span>{file.duration}s</span>

                        {file.metadata.transcription?.status && (
                          <>
                            <span
                              className="hidden sm:inline"
                              style={{ color: "var(--border-color)" }}
                            >
                              •
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                file.metadata.transcription.status ===
                                "completed"
                                  ? "bg-green-100 text-green-700"
                                  : file.metadata.transcription.status ===
                                      "processing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : file.metadata.transcription.status ===
                                        "failed"
                                      ? "bg-red-100 text-red-700"
                                      : ""
                              }`}
                              style={
                                !["completed", "processing", "failed"].includes(
                                  file.metadata.transcription.status,
                                )
                                  ? {
                                      backgroundColor: "var(--bg-card-hover)",
                                      color: "var(--text-muted)",
                                    }
                                  : {}
                              }
                            >
                              {file.metadata.transcription.status}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Transcription block */}
                      {file.metadata.transcription?.text &&
                        file.metadata.transcription.text.trim() !== "" && (
                          <div
                            className="mt-3 p-2 sm:p-3 rounded-lg"
                            style={{
                              backgroundColor: "rgba(59,130,246,0.08)",
                              border: "1px solid rgba(59,130,246,0.2)",
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                <span className="text-xs sm:text-sm font-medium text-blue-500">
                                  Transcription
                                </span>
                                {file.metadata.transcription?.status !==
                                  "completed" && (
                                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                    {file.metadata.transcription?.status}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  onDownloadText(
                                    file.metadata.originalName,
                                    file.metadata.transcription.text,
                                  )
                                }
                                className="p-1 text-blue-500 hover:text-blue-400 rounded transition-colors flex items-center justify-center"
                                style={{ backgroundColor: "transparent" }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "rgba(59,130,246,0.12)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "transparent")
                                }
                                title="Download transcription"
                              >
                                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                            <p
                              className="text-xs sm:text-sm leading-relaxed line-clamp-3"
                              style={{ color: "var(--text-muted)" }}
                            >
                              "{file.metadata.transcription.text}"
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-0 sm:space-x-3">
                    <WaveformPlayer
                      audioUrl={file.downloadUrl}
                      audioId={file.fileKey}
                      activeAudio={activeAudio}
                      setActiveAudio={setActiveAudio}
                    />

                    <button
                      onClick={() =>
                        onDelete(file.fileKey, file.metadata.originalName)
                      }
                      disabled={deletingFiles[file.fileKey]}
                      className="p-2 sm:p-3 transition-all duration-200 rounded-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      style={
                        deletingFiles[file.fileKey]
                          ? {
                              backgroundColor: "var(--border-color)",
                              color: "var(--text-faint)",
                              cursor: "not-allowed",
                            }
                          : { color: "var(--text-muted)" }
                      }
                      onMouseEnter={(e) => {
                        if (!deletingFiles[file.fileKey]) {
                          e.currentTarget.style.color = "#ef4444";
                          e.currentTarget.style.backgroundColor =
                            "rgba(239,68,68,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!deletingFiles[file.fileKey]) {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.backgroundColor = "transparent";
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
