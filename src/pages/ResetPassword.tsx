import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Lock, Loader2, ArrowLeft, Key } from "lucide-react";
import { confirmForgotPassword, clearError } from "../redux/slices/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import Logo from "../components/Logo";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    confirmationCode: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Logo size="lg" animated />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Reset Password</h1>

          <p className="text-gray-300 text-sm">
            Enter the reset code and create a new password
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
         
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />

            <input
              type="text"
              required
              maxLength={6}
              placeholder="Reset Code"
              value={formData.confirmationCode}
              onChange={(e) =>
                setFormData({ ...formData, confirmationCode: e.target.value })
              }
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-600 rounded-xl bg-white/10 text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
            />
          </div>


          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              required
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-600 rounded-xl bg-white/10 text-white"
            />
          </div>

   
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              required
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/10 text-white
                ${
                  formData.confirmPassword && !passwordsMatch
                    ? "border-red-500"
                    : "border-gray-600"
                }`}
            />
          </div>

      
          {formData.confirmPassword && !passwordsMatch && (
            <div className="text-red-400 text-sm">Passwords do not match</div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/auth#login")}
            className="text-gray-400 hover:text-gray-300"
          >
            <ArrowLeft className="inline h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
