

interface InsightsEmptyProps {
  
  error: string | null;
  isDark: boolean;
}

const InsightsEmpty = ({  error }: InsightsEmptyProps) => {
  

  if (error) {
    return (
      <div
        className="text-center py-12 text-sm rounded-xl"
        style={{
          color: "#f87171",
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        {error}
      </div>
    );
  }

  return null;
};

export default InsightsEmpty;
