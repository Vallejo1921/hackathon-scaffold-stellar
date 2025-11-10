import React, { useState } from "react";

interface GameFooterCardProps {
  totalLikes?: number;
  onExpandGame?: () => void;
  isGameExpanded?: boolean;
}

const GameFooterCard: React.FC<GameFooterCardProps> = ({
  totalLikes = 3009,
  onExpandGame,
  isGameExpanded = false
}) => {
  const [showMarginTooltip, setShowMarginTooltip] = useState(false);
  const [showLikesTooltip, setShowLikesTooltip] = useState(false);

  const handleExpandGame = () => {
    onExpandGame?.();
  };

  const HOUSE_MARGIN = "3%";

  return (
    <div style={{
      background: "#1e2130",
      borderRadius: "12px",
      padding: "16px 20px",
      border: "1px solid #2a2d3e",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
    }}>
      {/* Left: DeegaLabs */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <a
          href="https://www.deegalabs.com.br"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#8b5cf6",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            transition: "all 0.2s",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ec4899";
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#8b5cf6";
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          DeegaLabs
        </a>
      </div>

      {/* Right: Icons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        position: "relative"
      }}>
        {/* Margin Icon */}
        <div
          style={{
            position: "relative"
          }}
          onMouseEnter={() => setShowMarginTooltip(true)}
          onMouseLeave={() => setShowMarginTooltip(false)}
        >
          <button
            style={{
              background: "transparent",
              border: "1px solid #2a2d3e",
              borderRadius: "6px",
              padding: "8px",
              color: "#8b8fa3",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              width: "36px",
              height: "36px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              e.currentTarget.style.borderColor = "#8b5cf6";
              e.currentTarget.style.color = "#8b5cf6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#2a2d3e";
              e.currentTarget.style.color = "#8b8fa3";
            }}
          >
            📊
          </button>
          
          {/* Tooltip */}
          {showMarginTooltip && (
            <div style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              marginBottom: "8px",
              background: "#252837",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #2a2d3e",
              fontSize: "12px",
              color: "#fff",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              zIndex: 1000
            }}>
              House Margin: {HOUSE_MARGIN}
            </div>
          )}
        </div>

        {/* Likes Icon */}
        <div
          style={{
            position: "relative"
          }}
          onMouseEnter={() => setShowLikesTooltip(true)}
          onMouseLeave={() => setShowLikesTooltip(false)}
        >
          <button
            style={{
              background: "transparent",
              border: "1px solid #2a2d3e",
              borderRadius: "6px",
              padding: "8px",
              color: "#8b8fa3",
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              width: "36px",
              height: "36px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              e.currentTarget.style.borderColor = "#8b5cf6";
              e.currentTarget.style.color = "#8b5cf6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#2a2d3e";
              e.currentTarget.style.color = "#8b8fa3";
            }}
          >
            👍
          </button>
          
          {/* Tooltip */}
          {showLikesTooltip && (
            <div style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              marginBottom: "8px",
              background: "#252837",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #2a2d3e",
              fontSize: "12px",
              color: "#fff",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              zIndex: 1000
            }}>
              Total Likes: {totalLikes.toLocaleString()}
            </div>
          )}
        </div>

        {/* Expand Game Icon */}
        <button
          onClick={handleExpandGame}
          style={{
            background: isGameExpanded ? "rgba(239, 68, 68, 0.2)" : "transparent",
            border: `1px solid ${isGameExpanded ? "#EF4444" : "#2a2d3e"}`,
            borderRadius: "6px",
            padding: "8px",
            color: isGameExpanded ? "#EF4444" : "#8b8fa3",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            width: "36px",
            height: "36px"
          }}
          onMouseEnter={(e) => {
            if (!isGameExpanded) {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
              e.currentTarget.style.borderColor = "#8b5cf6";
              e.currentTarget.style.color = "#8b5cf6";
            }
          }}
          onMouseLeave={(e) => {
            if (!isGameExpanded) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#2a2d3e";
              e.currentTarget.style.color = "#8b8fa3";
            }
          }}
        >
          {isGameExpanded ? "⤓" : "⤢"}
        </button>
      </div>
    </div>
  );
};

export default GameFooterCard;

