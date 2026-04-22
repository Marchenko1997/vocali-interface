import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { confirmSignup, resendConfirmationCode } from "../redux/slices/authSlice";
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

const Confirmation = () => {
  const [formData, setFormData] = useState({ confirmationCode: "" });
  const [resending, setResending] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, confirmationEmail } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!confirmationEmail) {
      navigate("/auth#register");
    }
  }, [confirmationEmail, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationEmail) {
      dispatch(
        confirmSignup({
          email: confirmationEmail,
          confirmationCode: formData.confirmationCode,
        }),
      );
    }
  };

  const handleResendCode = async () => {
    if (confirmationEmail) {
      setResending(true);
      try {
        await dispatch(resendConfirmationCode(confirmationEmail));
      } finally {
        setResending(false);
      }
    }
  };

  const handleBackToSignup = () => navigate("/auth#register");

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
              <Logo size="lg" animated={true} />
            </div>
          </div>
          <h1 className="neon-title text-3xl font-bold mb-2">Verify Your Email</h1>
          <p style={{ color: "rgba(200,180,255,0.55)", fontSize: "14px" }}>
            Enter the confirmation code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Error ── */}
          {error && (
            <div className="error-card">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="error-card__text h-4 w-4 flex-shrink-0" />
                <p className="error-card__text text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* ── Email badge ── */}
          {confirmationEmail && (
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{
                background: "rgba(96,165,250,0.07)",
                border: "1px solid rgba(96,165,250,0.2)",
              }}
            >
              <Mail
                className="h-4 w-4 flex-shrink-0"
                style={{ color: "rgba(147,197,253,0.8)" }}
              />
              <span
                className="text-sm truncate"
                style={{ color: "rgba(186,220,254,0.85)" }}
              >
                {confirmationEmail}
              </span>
            </div>
          )}

          {/* ── Code input ── */}
          <div>
            <label htmlFor="confirmationCode" className="form-label">
              Confirmation Code
            </label>
            <input
              type="text"
              id="confirmationCode"
              name="confirmationCode"
              value={formData.confirmationCode}
              onChange={(e) =>
                setFormData({ ...formData, confirmationCode: e.target.value })
              }
              required
              maxLength={6}
              pattern="[A-Za-z0-9]{6}"
              placeholder="Enter 6-digit code"
              className="glass-input"
              style={{
                padding: "12px 16px",
                fontSize: "20px",
                letterSpacing: "0.35em",
                textAlign: "center",
              }}
            />
          </div>

          {/* ── Submit ── */}
          <button type="submit" disabled={loading} className="neon-btn">
            <span className="glass-glare" />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                <span className="relative z-10 text-sm">Verifying...</span>
              </>
            ) : (
              <span className="relative z-10">Verify Email</span>
            )}
          </button>
        </form>

        {/* ── Footer actions ── */}
        <div className="mt-7">
          <div className="form-divider" />

          <div className="space-y-3">
            {/* Resend */}
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="resend-btn w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Resending...</span>
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5" />
                  <span>Resend Code</span>
                </>
              )}
            </button>

            {/* Back */}
            <button
              onClick={handleBackToSignup}
              className="neon-link neon-link--muted w-full flex items-center justify-center gap-2 text-xs focus:outline-none py-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
