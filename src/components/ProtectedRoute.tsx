import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const PARTICLES = [
  { top: "18%", left: "10%", color: "rgba(168,85,247,0.7)",  size: 5, delay: "0s"   },
  { top: "75%", left: "88%", color: "rgba(236,72,153,0.6)",  size: 4, delay: "1.1s" },
  { top: "50%", left: "5%",  color: "rgba(96,165,250,0.6)",  size: 4, delay: "0.5s" },
  { top: "22%", left: "80%", color: "rgba(192,132,252,0.5)", size: 3, delay: "1.7s" },
  { top: "80%", left: "20%", color: "rgba(59,130,246,0.5)",  size: 3, delay: "0.3s" },
];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "#0d0b14" }}
      >
        {/* ── Ambient background ── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.02,
              backgroundImage: `
                linear-gradient(rgba(168,85,247,0) 59px, rgba(168,85,247,1) 60px),
                linear-gradient(90deg, rgba(168,85,247,0) 59px, rgba(168,85,247,1) 60px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Purple orb */}
          <div
            className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
              filter: "blur(65px)",
              animation: "orb-float-lg 18s ease-in-out infinite",
            }}
          />
          {/* Pink orb */}
          <div
            className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.13) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "orb-float-lg-r 14s ease-in-out infinite",
            }}
          />
          <div className="ambient-diagonal-tint" />
          {/* Particles */}
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
          style={{ animation: "fade-up 0.6s ease-out both" }}
        >
          {/* Spinner rings */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 72, height: 72 }}
          >
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1.5px solid transparent",
                borderTopColor: "rgba(168,85,247,0.8)",
                borderRightColor: "rgba(236,72,153,0.4)",
                animation: "ring-spin 1.8s linear infinite",
                boxShadow: "0 0 14px rgba(168,85,247,0.2)",
              }}
            />
            {/* Inner ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: 10,
                border: "1px solid transparent",
                borderTopColor: "rgba(236,72,153,0.6)",
                borderLeftColor: "rgba(168,85,247,0.35)",
                animation: "ring-spin-r 1.2s linear infinite",
              }}
            />
            {/* Glass center */}
            <div
              className="absolute rounded-full"
              style={{
                inset: 6,
                background: "rgba(168,85,247,0.08)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: "1px solid rgba(168,85,247,0.15)",
              }}
            />
          </div>

          {/* Text + dots */}
          <div
            className="mt-6 text-center"
            style={{ animation: "fade-up 0.6s 0.15s ease-out both" }}
          >
            <p
              className="text-base font-semibold mb-4"
              style={{ color: "rgba(192,132,252,0.85)" }}
            >
              Checking authentication...
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background: "rgba(168,85,247,0.7)",
                    boxShadow: "0 0 6px rgba(168,85,247,0.5)",
                    animation: `dot-bounce 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !token || token === "undefined" || token === "null") {
    console.log("ProtectedRoute: Redirecting to login - not authenticated");
    return <Navigate to="/auth#login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
