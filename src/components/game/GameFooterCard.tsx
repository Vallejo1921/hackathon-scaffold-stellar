import React, { useState, useEffect } from "react";

interface GameFooterCardProps {
  totalLikes?: number;
}

const GameFooterCard: React.FC<GameFooterCardProps> = ({
  totalLikes = 3009
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMarginTooltip, setShowMarginTooltip] = useState(false);
  const [showLikesTooltip, setShowLikesTooltip] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
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
        <span style={{
          color: "#8b8fa3",
          fontSize: "13px"
        }}>
          Powered by
        </span>
        <strong style={{
          color: "#8b5cf6",
          fontSize: "14px",
          fontWeight: 700
        }}>
          DeegaLabs
        </strong>
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

        {/* Fullscreen Icon */}
        <button
          onClick={handleFullscreen}
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
          {isFullscreen ? "⤓" : "⤢"}
        </button>
      </div>
    </div>
  );
};

export default GameFooterCard;

