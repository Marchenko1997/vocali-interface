import {
  FileAudio,
  FileText,
  Download,
  Loader2,
  Trash2,
} from "lucide-react";
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
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <FileAudio className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Your Audio Files
          </h2>
        </div>
        {loadingFiles && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}
      </div>

      {(!audioFiles || audioFiles.length === 0) && !loadingFiles ? (
        <div className="text-center py-8 sm:py-12">
          <FileAudio className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
            No audio files yet
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            Upload your first audio file to get started
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {audioFiles.map((file) => (
              <div
                key={file.fileKey}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex-shrink-0">
                      <FileAudio className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {file.metadata.originalName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                        <span>{file.metadata.format}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{Math.round(file.fileSize / 1024)} KB</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{file.duration}s</span>
                        {file.metadata.transcription?.status && (
                          <>
                            <span className="hidden sm:inline">•</span>
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
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {file.metadata.transcription.status}
                            </span>
                          </>
                        )}
                      </div>
                      {file.metadata.transcription?.text &&
                        file.metadata.transcription.text.trim() !== "" && (
                          <div className="mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                <span className="text-xs sm:text-sm font-medium text-blue-800">
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
                                className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors flex items-center justify-center"
                                title="Download transcription"
                              >
                                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3">
                              "{file.metadata.transcription.text}"
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex  items-center space-x-0 sm:space-x-3">
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
                      className={`
                        p-2 sm:p-3 transition-all duration-200 rounded-lg flex items-center justify-center
                        focus:outline-none md:focus:outline
                        focus:ring-0 md:focus:ring-2
                        ${
                          deletingFiles[file.fileKey]
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                        }
                      `}
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
