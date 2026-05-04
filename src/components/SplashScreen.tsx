import logoAnimated from "../assets/logo-vocali-animated.mp4";

interface SplashScreenProps {
  userName?: string;
  title?: string;
  onFinish?: () => void;
}

const PARTICLES = [
  { top: "15%", left: "12%", color: "rgba(168,85,247,0.8)", size: 5, delay: "0s" },
  { top: "78%", left: "85%", color: "rgba(236,72,153,0.7)", size: 4, delay: "1.1s" },
  { top: "45%", left: "6%",  color: "rgba(96,165,250,0.7)", size: 5, delay: "0.5s" },
  { top: "20%", left: "78%", color: "rgba(192,132,252,0.6)", size: 3, delay: "1.7s" },
  { top: "85%", left: "22%", color: "rgba(59,130,246,0.6)",  size: 4, delay: "0.3s" },
  { top: "60%", left: "92%", color: "rgba(244,114,182,0.6)", size: 3, delay: "2s" },
  { top: "35%", left: "50%", color: "rgba(168,85,247,0.4)",  size: 2, delay: "0.8s" },
];

const SplashScreen = ({
  userName,
  title = "Welcome to Vocali",
}: SplashScreenProps) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0d0b14" }}
    >
      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.025,
            backgroundImage: `
              linear-gradient(rgba(168,85,247,0) 59px, rgba(168,85,247,1) 60px),
              linear-gradient(90deg, rgba(168,85,247,0) 59px, rgba(168,85,247,1) 60px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute -top-56 -left-56 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%)",
            filter: "blur(70px)",
            animation: "orb-float-lg 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)",
            filter: "blur(65px)",
            animation: "orb-float-lg-r 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-32 left-1/4 w-[550px] h-56 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)",
            filter: "blur(55px)",
            animation: "orb-float-soft 22s ease-in-out infinite",
          }}
        />
        <div className="ambient-diagonal-tint" style={{ opacity: 1.33 }} />
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              animation: `particle-float ${2.5 + i * 0.3}s ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Center content ── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ animation: "fade-up 0.8s ease-out both" }}
      >
        {/* Rings + video */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 240, height: 240 }}
        >
          <div
            className="absolute rounded-full"
            style={{
              inset: -16,
              border: "1px solid rgba(168,85,247,0.12)",
              animation: "ring-pulse 3s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: -4,
              border: "1.5px solid transparent",
              borderTopColor: "rgba(168,85,247,0.7)",
              borderRightColor: "rgba(236,72,153,0.4)",
              animation: "ring-spin 3s linear infinite",
              boxShadow: "0 0 16px rgba(168,85,247,0.25)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: 8,
              border: "1px solid transparent",
              borderTopColor: "rgba(236,72,153,0.5)",
              borderLeftColor: "rgba(168,85,247,0.3)",
              animation: "ring-spin-r 2s linear infinite",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(168,85,247,0.15)",
              boxShadow:
                "0 0 60px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
              borderRadius: "50%",
            }}
          />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="relative z-10 rounded-full"
            style={{ width: 180, height: 180, objectFit: "cover" }}
          >
            <source src={logoAnimated} type="video/mp4" />
          </video>
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: 160,
              height: 20,
              background:
                "radial-gradient(ellipse, rgba(168,85,247,0.35) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
        </div>

        {/* Text */}
        <div
          className="mt-10 text-center"
          style={{ animation: "fade-up 0.8s 0.25s ease-out both" }}
        >
          <p
            className="text-2xl font-bold mb-1"
            style={{
              color: "#c084fc",
              animation: "neon-text-pulse 2.5s ease-in-out infinite",
            }}
          >
            {title}
          </p>
          <p
            className="text-sm mb-6"
            style={{ color: "rgba(200,180,255,0.45)" }}
          >
            {userName ? `Hey, ${userName} 👋` : "Loading your workspace..."}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: "rgba(168,85,247,0.7)",
                  boxShadow: "0 0 8px rgba(168,85,247,0.5)",
                  animation: "dot-bounce 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
