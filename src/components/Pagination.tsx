import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { PaginationProps } from "../types/pagination";
import { useTheme } from "../context/ThemeContext";

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  currentPage,
  onPageChange,
  showItemCount = true,
  itemLabel = "files",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { totalPages, totalItems, page, limit } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const navBtnStyle = (disabled: boolean) =>
    isDark
      ? {
          backgroundColor: disabled ? "transparent" : "rgba(255,255,255,0.04)",
          border: `1px solid ${disabled ? "rgba(255,255,255,0.04)" : "rgba(168,85,247,0.15)"}`,
          color: disabled ? "rgba(200,180,255,0.2)" : "rgba(200,180,255,0.6)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
        }
      : {
          color: disabled ? "#d1d5db" : "#6b7280",
          cursor: disabled ? "not-allowed" : "pointer",
        };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Item count */}
      {showItemCount && (
        <div
          className="text-sm tabular-nums"
          style={
            isDark
              ? {
                  color: "rgba(200,180,255,0.5)",
                  background: "rgba(168,85,247,0.07)",
                  border: "1px solid rgba(168,85,247,0.15)",
                  borderRadius: "9999px",
                  padding: "4px 12px",
                }
              : { color: "#6b7280" }
          }
        >
          Showing {startItem}–{endItem} of {totalItems} {itemLabel}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none"
          style={navBtnStyle(currentPage === 1)}
          onMouseEnter={(e) => {
            if (isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.12)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              e.currentTarget.style.color = "rgba(200,180,255,0.9)";
            } else if (!isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.color = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
              e.currentTarget.style.color = "rgba(200,180,255,0.6)";
            } else if (!isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }
          }}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none"
          style={navBtnStyle(currentPage === 1)}
          onMouseEnter={(e) => {
            if (isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.12)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              e.currentTarget.style.color = "rgba(200,180,255,0.9)";
            } else if (!isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.color = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
              e.currentTarget.style.color = "rgba(200,180,255,0.6)";
            } else if (!isDark && currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }
          }}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {pageNumbers.map((pageNum) => {
            const isActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className="min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none"
                style={
                  isActive
                    ? isDark
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(99,102,241,0.25))",
                          border: "1px solid rgba(168,85,247,0.5)",
                          color: "rgba(216,180,254,0.95)",
                          boxShadow:
                            "0 0 16px rgba(168,85,247,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
                        }
                      : {
                          background:
                            "linear-gradient(135deg, #6366f1, #4f46e5)",
                          border: "none",
                          color: "white",
                          boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                        }
                    : isDark
                      ? {
                          backgroundColor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          color: "rgba(200,180,255,0.55)",
                        }
                      : {
                          backgroundColor: "transparent",
                          border: "1px solid transparent",
                          color: "#6b7280",
                        }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    if (isDark) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(168,85,247,0.1)";
                      e.currentTarget.style.borderColor =
                        "rgba(168,85,247,0.25)";
                      e.currentTarget.style.color = "rgba(200,180,255,0.9)";
                    } else {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                      e.currentTarget.style.color = "#374151";
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    if (isDark) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "rgba(200,180,255,0.55)";
                    } else {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#6b7280";
                    }
                  }
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none"
          style={navBtnStyle(currentPage === totalPages)}
          onMouseEnter={(e) => {
            if (isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.12)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              e.currentTarget.style.color = "rgba(200,180,255,0.9)";
            } else if (!isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.color = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
              e.currentTarget.style.color = "rgba(200,180,255,0.6)";
            } else if (!isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }
          }}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none"
          style={navBtnStyle(currentPage === totalPages)}
          onMouseEnter={(e) => {
            if (isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "rgba(168,85,247,0.12)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              e.currentTarget.style.color = "rgba(200,180,255,0.9)";
            } else if (!isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.color = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)";
              e.currentTarget.style.color = "rgba(200,180,255,0.6)";
            } else if (!isDark && currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }
          }}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
