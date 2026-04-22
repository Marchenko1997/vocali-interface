import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, ArrowLeft, Key, AlertCircle } from "lucide-react";
import { confirmForgotPassword, clearError } from "../redux/slices/authSlice";
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

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    confirmationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { resetEmail } = useSelector((state: RootState) => state.auth);

  const passwordsMatch =
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    if (!resetEmail) return;
    const result = await dispatch(
      confirmForgotPassword({
        email: resetEmail,
        confirmationCode: formData.confirmationCode,
        newPassword: formData.newPassword,
      }),
    );
    if (confirmForgotPassword.fulfilled.match(result)) {
      navigate("/auth#login");
    }
  };

  const confirmError = !!(formData.confirmPassword && !passwordsMatch);

  const iconColor = (field: string, hasError = false) =>
    hasError
      ? "rgba(252,165,165,0.7)"
      : focusedField === field
        ? "rgba(192,132,252,0.8)"
        : "rgba(180,160,255,0.35)";

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
          <h1 className="neon-title text-3xl font-bold mb-2">Reset Password</h1>
          <p style={{ color: "rgba(200,180,255,0.55)", fontSize: "14px" }}>
            Enter the reset code and create a new password
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Reset Code ── */}
          <div>
            <label className="form-label">Reset Code</label>
            <div className="relative">
              <Key
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{ color: iconColor("code") }}
              />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={formData.confirmationCode}
                onChange={(e) =>
                  setFormData({ ...formData, confirmationCode: e.target.value })
                }
                onFocus={() => setFocusedField("code")}
                onBlur={() => setFocusedField(null)}
                className="glass-input"
              />
            </div>
          </div>

          {/* ── New Password ── */}
          <div>
            <label className="form-label">New Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{ color: iconColor("newPassword") }}
              />
              <input
                type="password"
                required
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                onFocus={() => setFocusedField("newPassword")}
                onBlur={() => setFocusedField(null)}
                className="glass-input"
              />
            </div>
          </div>

          {/* ── Confirm Password ── */}
          <div>
            <label className="form-label">Confirm New Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{ color: iconColor("confirmPassword", confirmError) }}
              />
              <input
                type="password"
                required
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                className={`glass-input ${confirmError ? "is-error" : ""}`}
              />
            </div>
            {/* Passwords mismatch hint */}
            {confirmError && (
              <p
                className="text-xs mt-1.5 flex items-center gap-1.5"
                style={{ color: "rgba(252,165,165,0.85)" }}
              >
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                Passwords do not match
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="neon-btn mt-2"
          >
            <span className="glass-glare" />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                <span className="relative z-10 text-sm">Resetting...</span>
              </>
            ) : (
              <span className="relative z-10">Reset Password</span>
            )}
          </button>
        </form>

        {/* ── Footer ── */}
        <div className="mt-7 text-center">
          <div className="form-divider" />
          <button
            onClick={() => navigate("/auth#login")}
            className="neon-link neon-link--muted flex items-center justify-center gap-2 mx-auto text-xs focus:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
