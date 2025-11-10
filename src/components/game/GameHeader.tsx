import React from "react";
import { useBalloonFlyContext } from "../../contexts/BalloonFlyContext";

interface GameHeaderProps {
  onMenuClick?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onMenuClick }) => {
  const { pool, formatXLM, currentRound, isFlying } = useBalloonFlyContext();

  return (
    <div style={{
      background: "#1e2130",
      borderBottom: "1px solid #2a2d3e",
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "13px"
    }}>
      {/* Left: Game Name and Round Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span style={{
            fontSize: "18px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🎈 BalloonFly
          </span>
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingLeft: "16px",
          borderLeft: "1px solid #2a2d3e"
        }}>
          <span style={{ color: "#8b8fa3" }}>Round:</span>
          <span style={{ color: "#fff", fontWeight: 600 }}>
            #{currentRound?.id.toString() || "—"}
          </span>
          
          <div style={{
            padding: "4px 8px",
            borderRadius: "4px",
            background: isFlying 
              ? "rgba(16, 185, 129, 0.2)" 
              : "rgba(139, 92, 246, 0.2)",
            border: `1px solid ${isFlying ? "#10b981" : "#8b5cf6"}`,
            fontSize: "11px",
            fontWeight: 600,
            color: isFlying ? "#10b981" : "#8b5cf6",
            textTransform: "uppercase"
          }}>
            {isFlying ? "Flying" : currentRound?.status || "Waiting"}
          </div>
        </div>
      </div>

      {/* Right: Total Prize and Menu */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "16px" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#8b8fa3" }}>Total Prize:</span>
          <span style={{ color: "#fff", fontWeight: 600 }}>
            {pool ? formatXLM(pool.total_payouts) : "0.00"} XLM
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#8b8fa3" }}>
            <strong style={{ color: "#fff" }}>{currentRound?.bet_count || 0}</strong>
            {" / "}
            <strong style={{ color: "#fff" }}>{currentRound?.bet_count || 0}</strong>
          </span>
          <span style={{ color: "#8b8fa3" }}>Bets</span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          style={{
            background: "transparent",
            border: "1px solid #2a2d3e",
            borderRadius: "6px",
            padding: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
            e.currentTarget.style.borderColor = "#8b5cf6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#2a2d3e";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" stroke="#8b8fa3" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="#8b8fa3" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="#8b8fa3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GameHeader;

