import React, { useState } from "react";
import HistoryModal from "./HistoryModal";

interface HistoryItem {
  roundId: bigint;
  multiplier: number;
  timestamp: bigint;
}

interface HistoryBarProps {
  history?: HistoryItem[];
  onRoundClick?: (roundId: bigint) => void;
}

const HistoryBar: React.FC<HistoryBarProps> = ({
  history = [],
  onRoundClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Limit of visible multipliers when collapsed
  const VISIBLE_LIMIT = 15;
  const visibleHistory = isExpanded ? history : history.slice(0, VISIBLE_LIMIT);
  const hasMore = history.length > VISIBLE_LIMIT;

  const getMultiplierColor = (mult: number) => {
    if (mult < 2.0)
      return { bg: "rgba(59, 130, 246, 0.2)", text: "#3B82F6", border: "none" };
    if (mult < 10.0)
      return { bg: "rgba(168, 85, 247, 0.2)", text: "#A855F7", border: "none" };
    return {
      bg: "rgba(239, 68, 68, 0.2)",
      text: "#EF4444",
      border: "2px solid #EF4444",
    };
  };

  return (
    <>
      <div
        style={{
          padding: "12px 16px",
          background: "#1e2130",
          borderBottom: "1px solid #2a2d3e",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            overflowX: "auto",
            paddingRight: hasMore && !isExpanded ? "40px" : "0",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(139, 92, 246, 0.4) rgba(30, 33, 48, 0.2)",
          }}
        >
          {visibleHistory.length === 0 ? (
            <div
              style={{
                color: "#8b8fa3",
                fontSize: "13px",
                fontStyle: "italic",
              }}
            >
              No history available
            </div>
          ) : (
            visibleHistory.map((item, idx) => {
              const styles = getMultiplierColor(item.multiplier);
              return (
                <div
                  key={idx}
                  onClick={() => onRoundClick?.(item.roundId)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: styles.bg,
                    color: styles.text,
                    border: styles.border,
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
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

          {/* 3 dots button */}
          {hasMore && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(139, 92, 246, 0.2)",
                border: "1px solid #8b5cf6",
                borderRadius: "6px",
                padding: "6px 12px",
                color: "#8b5cf6",
                cursor: "pointer",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                minWidth: "36px",
                height: "32px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.3)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
                e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              }}
            >
              ⋯
            </button>
          )}
        </div>
      </div>

      {/* Expanded History Modal */}
      {isExpanded && (
        <HistoryModal
          history={history}
          onClose={() => setIsExpanded(false)}
          onRoundClick={onRoundClick}
        />
      )}
    </>
  );
};

export default HistoryBar;
