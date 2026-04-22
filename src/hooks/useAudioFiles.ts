import { useEffect, useRef, useState } from "react";
import { Notify, Confirm } from "notiflix";
import api from "../services/api";
import type {
  AudioFile,
  PaginationInfo,
  AudioFilesResponse,
} from "../types/main_interfaces";

const getNotifyOptions = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  return {
    position: "center-top" as const,
    timeout: 3000,
    clickToClose: true,
    pauseOnHover: true,
    borderRadius: "12px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "14px",

    ...(isDark
      ? {
          
           backgroundColor: "rgba(15, 10, 28, 0.95)",
          textColor: "rgba(220, 210, 255, 0.92)",
        }
      : {
          background: "#ffffff",
          textColor: "#1e1b2e",
        }),
  };
};
const getConfirmOptions = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  return {
    titleColor: isDark ? "rgba(252, 165, 165, 0.95)" : "#ef4444",
    okButtonBackground: isDark ? "rgba(239, 68, 68, 0.2)" : "#ef4444",
    okButtonColor: isDark ? "rgba(252, 165, 165, 0.95)" : "#ffffff",
    cancelButtonBackground: isDark ? "rgba(255, 255, 255, 0.07)" : "#6b7280",
    cancelButtonColor: isDark ? "rgba(200, 180, 255, 0.8)" : "#ffffff",
    borderRadius: "14px",
    fontFamily: "Inter, system-ui, sans-serif",
    titleFontSize: "18px",
    messageFontSize: "14px",
    buttonsFontSize: "14px",
    width: "400px",

    ...(isDark
      ? {
          backgroundColor: "rgba(15, 10, 28, 0.95)",
          messageColor: "rgba(200, 185, 255, 0.8)",
        
        }
      : {
          backgroundColor: "#ffffff",
          messageColor: "#374151",
        
        }),
  };
};

export function useAudioFiles(isAuthenticated: boolean, token: string | null) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState<Record<string, boolean>>(
    {},
  );
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAudioFiles = async (page: number = currentPage) => {
    setLoadingFiles(true);
    try {
      const response = await api.get("/audio/files", {
        params: { page, limit: pagination.limit },
      });
      const data: AudioFilesResponse = response.data;
      setAudioFiles(data.items);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error: any) {
      console.error("Failed to fetch audio files:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size exceeds 20MB limit");
      return;
    }
    if (!file.type.startsWith("audio/")) {
      setUploadError("Please select an audio file");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      await api.post("/audio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchAudioFiles(1);
      Notify.success("Audio file uploaded successfully!", getNotifyOptions());
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Upload failed. Please try again.";
      setUploadError(errorMessage);
      Notify.failure(errorMessage, { ...getNotifyOptions(), timeout: 5000 });
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadText = (fileName: string, transcriptionText: string) => {
    const blob = new Blob([transcriptionText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, "")}_transcription.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleDeleteAudio = async (fileKey: string, fileName: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Confirm.show(
        "Delete Audio File",
        `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
        "Delete",
        "Cancel",
        () => resolve(true),
        () => resolve(false),
        getConfirmOptions(),
      );
    });

    if (!confirmed) return;

    setDeletingFiles((prev) => ({ ...prev, [fileKey]: true }));

    try {
      await api.delete(`/audio/files?fileKey=${encodeURIComponent(fileKey)}`);

      if (currentPage > 1 && audioFiles.length === 1) {
        await fetchAudioFiles(currentPage - 1);
      } else {
        await fetchAudioFiles(currentPage);
      }

      console.log("Audio file deleted successfully:", fileKey);
      Notify.success("Audio file deleted successfully!", getNotifyOptions());
    } catch (error: any) {
      console.error("Failed to delete audio file:", error);
      Notify.failure(
        "Failed to delete file: " +
          (error.response?.data?.message || error.message),
        { ...getNotifyOptions(), timeout: 5000 },
      );
    } finally {
      setDeletingFiles((prev) => {
        const newState = { ...prev };
        delete newState[fileKey];
        return newState;
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAudioFiles(newPage);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAudioFiles();
    }
  }, [isAuthenticated, token]);

  return {
    uploading,
    uploadError,
    audioFiles,
    loadingFiles,
    deletingFiles,
    activeAudio,
    setActiveAudio,
    currentPage,
    pagination,
    fileInputRef,
    fetchAudioFiles,
    handleFileUpload,
    handleUploadClick,
    handleDownloadText,
    handleDeleteAudio,
    handlePageChange,
  };
}
