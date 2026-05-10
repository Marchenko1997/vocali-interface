import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  isDark: boolean;
  cardBorder: string;
  textMuted: string;
  textPrimary: string;
  label?: string;
  onClick?: () => void;
}

const BackButton = ({
  isDark,
  cardBorder,
  textMuted,
  textPrimary,
  label = "Home",
  onClick,
}: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate("/");
        onClick?.();
      }}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none"
      style={{
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${cardBorder}`,
        color: textMuted,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = textPrimary;
        e.currentTarget.style.borderColor = isDark
          ? "rgba(168,85,247,0.3)"
          : "rgba(147,51,234,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = textMuted;
        e.currentTarget.style.borderColor = cardBorder;
      }}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
