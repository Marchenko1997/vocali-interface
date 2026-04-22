import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { signup, clearError } from "../redux/slices/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import Logo from "../components/Logo";

const PARTICLES = [
  { top: "22%", left: "18%", color: "rgba(168,85,247,0.7)",  size: 6, delay: "0s"   },
  { top: "70%", left: "80%", color: "rgba(236,72,153,0.6)",  size: 4, delay: "1.2s" },
  { top: "45%", left: "8%",  color: "rgba(96,165,250,0.6)",  size: 5, delay: "0.6s" },
  { top: "15%", left: "70%", color: "rgba(192,132,252,0.5)", size: 3, delay: "1.8s" },
  { top: "80%", left: "25%", color: "rgba(59,130,246,0.5)",  size: 4, delay: "0.3s" },
  { top: "35%", left: "92%", color: "rgba(244,114,182,0.5)", size: 3, delay: "2.1s" },
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated && token && token !== "undefined" && token !== "null") {
      navigate("/");
    }
  }, [isAuthenticated, token, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signup(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const iconColor = (field: string) =>
    focusedField === field ? "rgba(192,132,252,0.8)" : "rgba(180,160,255,0.35)";

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
          <h1 className="neon-title text-3xl font-bold mb-2">Join Vocali</h1>
          <p style={{ color: "rgba(200,180,255,0.55)", fontSize: "14px" }}>
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Error ── */}
          {error && (
            <div className="error-card">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="error-card__text h-4 w-4 flex-shrink-0" />
                <p className="error-card__text text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* ── Name row ── */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "firstName", label: "First Name", placeholder: "First name" },
              { id: "lastName",  label: "Last Name",  placeholder: "Last name"  },
            ].map(({ id, label, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="form-label">
                  {label}
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                    style={{ color: iconColor(id) }}
                  />
                  <input
                    type="text"
                    id={id}
                    name={id}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(id)}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder={placeholder}
                    className="glass-input"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Email ── */}
          <div>
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{ color: iconColor("email") }}
              />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Enter your email address"
                className="glass-input"
              />
            </div>
          </div>

          {/* ── Password ── */}
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{ color: iconColor("password") }}
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                placeholder="Create a password"
                className="glass-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="icon-toggle absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* ── Submit ── */}
          <button type="submit" disabled={loading} className="neon-btn">
            <span className="glass-glare" />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                <span className="relative z-10 text-sm">Creating account...</span>
              </>
            ) : (
              <span className="relative z-10">Create Account</span>
            )}
          </button>
        </form>

        {/* ── Footer ── */}
        <div className="mt-7 text-center">
          <div className="form-divider" />
          <p style={{ color: "rgba(200,180,255,0.5)", fontSize: "13px" }}>
            Already have an account?{" "}
            <a href="#login" className="neon-link focus:outline-none">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
