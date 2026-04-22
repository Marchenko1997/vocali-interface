import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { forgotPassword, clearError } from "../redux/slices/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import Logo from "../components/Logo";

const PARTICLES = [
  { top: "20%", left: "15%", color: "rgba(168,85,247,0.7)",  size: 6, delay: "0s"   },
  { top: "72%", left: "82%", color: "rgba(236,72,153,0.6)",  size: 4, delay: "1.2s" },
  { top: "48%", left: "7%",  color: "rgba(96,165,250,0.6)",  size: 5, delay: "0.6s" },
  { top: "18%", left: "72%", color: "rgba(192,132,252,0.5)", size: 3, delay: "1.8s" },
  { top: "82%", left: "28%", color: "rgba(59,130,246,0.5)",  size: 4, delay: "0.3s" },
  { top: "38%", left: "91%", color: "rgba(244,114,182,0.5)", size: 3, delay: "2.1s" },
];

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent] = useState(false);
  const [focused, setFocused] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) {
      navigate("/auth#reset");
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* ── Ambient background ── */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-orb-purple" />
        <div className="ambient-orb-pink" />
        <div className="ambient-orb-blue" />
        <div className="ambient-diagonal-tint" />
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="ambient-particle"
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <div className="glass-card relative z-10">
        <div className="top-accent-line" />
        <div className="corner-glow" />

        {/* ── Header ── */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center mb-5">
            <div className="logo-ring">
              <Logo size="lg" animated />
            </div>
          </div>
          <h1 className="neon-title text-3xl font-bold mb-2">Forgot Password</h1>
          <p style={{ color: "rgba(200,180,255,0.55)", fontSize: "14px" }}>
            Enter your email to receive a reset code
          </p>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="error-card mb-5">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="error-card__text h-4 w-4 flex-shrink-0" />
              <p className="error-card__text text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* ── Success state ── */}
        {sent ? (
          <div
            className="rounded-xl p-4 mb-5 flex items-center gap-2.5"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.25)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
            <p className="text-sm" style={{ color: "rgba(110,231,183,0.9)" }}>
              Reset code sent to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Email field ── */}
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                  style={{
                    color: focused
                      ? "rgba(192,132,252,0.8)"
                      : "rgba(180,160,255,0.35)",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Enter your email"
                  className="glass-input"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <button type="submit" disabled={loading} className="neon-btn">
              <span className="glass-glare" />
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                  <span className="relative z-10 text-sm">Sending...</span>
                </>
              ) : (
                <span className="relative z-10">Send Reset Code</span>
              )}
            </button>
          </form>
        )}

        {/* ── Footer ── */}
        <div className="mt-7 text-center">
          <div className="form-divider" />
          <button
            onClick={() => navigate("/auth")}
            className="neon-link neon-link--muted flex items-center justify-center gap-2 mx-auto text-xs focus:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
