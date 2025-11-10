import React from "react";

interface HistoryItem {
  roundId: bigint;
  multiplier: number;
  timestamp: bigint;
}

interface HistoryModalProps {
  history: HistoryItem[];
  onClose: () => void;
  onRoundClick?: (roundId: bigint) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose, onRoundClick }) => {
  const getMultiplierColor = (mult: number) => {
    if (mult < 2.0) return { bg: "rgba(59, 130, 246, 0.2)", text: "#3B82F6" };
    if (mult < 10.0) return { bg: "rgba(168, 85, 247, 0.2)", text: "#A855F7" };
    return { bg: "rgba(239, 68, 68, 0.2)", text: "#EF4444" };
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 1100,
          backdropFilter: "blur(4px)"
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "80vh",
          background: "#1e2130",
          borderRadius: "12px",
          border: "1px solid #2a2d3e",
          zIndex: 1101,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #2a2d3e",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: 700 }}>
            Round History
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#8b8fa3",
              cursor: "pointer",
              fontSize: "24px",
              padding: "0",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#8b8fa3";
            }}
          >
            ×
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px"
        }}>
          {history.length === 0 ? (
            <div style={{
              width: "100%",
              textAlign: "center",
              color: "#8b8fa3",
              padding: "40px 0"
            }}>
              No round history available
            </div>
          ) : (
            history.map((item, idx) => {
              const styles = getMultiplierColor(item.multiplier);
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onRoundClick?.(item.roundId);
                    onClose();
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: styles.bg,
                    color: styles.text,
                    border: item.multiplier >= 10 ? "2px solid #EF4444" : "none"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {item.multiplier.toFixed(2)}x
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryModal;

