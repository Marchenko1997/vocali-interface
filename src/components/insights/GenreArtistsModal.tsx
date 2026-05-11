import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getArtistImage, searchSpotifyArtist } from "../../services/spotify";

interface Artist {
  name: string;
  url: string;
  spotifyImg?: string;
}

interface GenreArtistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  genreName: string;
  artists: Artist[];
  isDark: boolean;
}

const COLORS = [
  "#a855f7",
  "#ec4899",
  "#38bdf8",
  "#34d399",
  "#f59e0b",
  "#f87171",
];

const GLOW_COLORS = [
  "rgba(168,85,247,0.6)",
  "rgba(236,72,153,0.6)",
  "rgba(56,189,248,0.6)",
  "rgba(52,211,153,0.6)",
  "rgba(245,158,11,0.6)",
  "rgba(248,113,113,0.6)",
];

const GenreArtistsModal = ({
  isOpen,
  onClose,
  genreName,
  artists,
  isDark,
}: GenreArtistsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [artistsWithImages, setArtistsWithImages] = useState(artists);

useEffect(() => {
  if (!isOpen) return;

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const clickedInsideModal =
      modalRef.current?.contains(target);

    const clickedGenreDonut =
      target.closest(".genre-donut-wrapper");

    if (!clickedInsideModal && !clickedGenreDonut) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleMouseDown);

  return () => {
    document.removeEventListener("mousedown", handleMouseDown);
  };
}, [isOpen, onClose]);


useEffect(() => {
  if (!artists.length) {
    setArtistsWithImages([]);
    return;
  }

  let cancelled = false;

  setArtistsWithImages(
    artists.map((artist) => ({
      ...artist,
      spotifyImg: "",
    })),
  );

  artists.forEach(async (artist: any) => {
    try {
      if (!artist.name) return;

      const spotifySearch = await searchSpotifyArtist(artist.name);

      if (cancelled) return;

      const spotifyArtist = spotifySearch?.tracks?.items?.[0]?.artists?.[0];

      if (!spotifyArtist?.id) return;

      const data = await getArtistImage(spotifyArtist.id);

      if (cancelled) return;

      setArtistsWithImages((prev) =>
        prev.map((a) =>
          a.name === artist.name
            ? {
                ...a,
                spotifyImg: data.image,
              }
            : a,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  });

  return () => {
    cancelled = true;
  };
}, [artists]);

  if (!isOpen) return null;

 

  return (
    <div
      ref={modalRef}
      className="
  relative
  mt-4
  w-full
  flex
  justify-center
  z-50
  animate-in fade-in slide-in-from-left-2 duration-300

  lg:absolute
  lg:top-0
  lg:left-full
  lg:ml-4
  lg:mt-0
  lg:w-auto
  lg:block
"
    >
      <div
        style={{
          position: "relative",
          width: window.innerWidth < 1024 ? "100%" : 320,
          borderRadius: 24,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          background: isDark
            ? "linear-gradient(135deg, rgba(22,10,45,0.98), rgba(10,8,28,0.99))"
            : "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(245,243,255,0.96))",
          border: isDark
            ? "1px solid rgba(168,85,247,0.25)"
            : "1px solid rgba(168,85,247,0.12)",
          boxShadow: isDark
            ? "0 0 60px rgba(168,85,247,0.18), 0 18px 60px rgba(0,0,0,0.7)"
            : "0 18px 60px rgba(168,85,247,0.12)",
        }}
      >
        {/* top neon line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(168,85,247,0.7), rgba(236,72,153,0.7), transparent)",
          }}
        />

        {/* header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 4,
                height: 16,
                borderRadius: 999,
                background: "linear-gradient(180deg, #c084fc, #e879f9)",
                boxShadow: "0 0 10px rgba(192,132,252,0.7)",
              }}
            />

            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: "linear-gradient(90deg, #c084fc, #e879f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {genreName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: 26,
              height: 26,
              background: isDark
                ? "rgba(168,85,247,0.08)"
                : "rgba(168,85,247,0.06)",
              border: isDark
                ? "1px solid rgba(168,85,247,0.2)"
                : "1px solid rgba(168,85,247,0.12)",
            }}
          >
            <X size={14} color={isDark ? "rgba(220,200,255,0.7)" : "#7c3aed"} />
          </button>
        </div>

        {/* artists grid */}
        <div className="grid grid-cols-4 gap-2 p-4 pt-0 max-h-[420px] overflow-y-auto">
          {artistsWithImages.map((artist, i) => (
            <a
              key={artist.name}
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all duration-200"
              style={{
                textDecoration: "none",
                background: isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(124,58,237,0.03)",
                border: `1px solid ${COLORS[i % COLORS.length]}25`,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: artist.spotifyImg
                    ? "transparent"
                    : `${COLORS[i % COLORS.length]}20`,
                  border: `1.5px solid ${COLORS[i % COLORS.length]}40`,
                  boxShadow: `0 0 12px ${GLOW_COLORS[i % GLOW_COLORS.length]}`,
                }}
              >
                {artist.spotifyImg ? (
                  <img
                    src={artist.spotifyImg}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">
                    🎤
                  </div>
                )}
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  textAlign: "center",
                  color: isDark ? "rgba(255,255,255,0.82)" : "#4b5563",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                {artist.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreArtistsModal;
