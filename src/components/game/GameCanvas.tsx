import React, { useState, useEffect } from "react";
import { useBalloonFlyContext } from "../../contexts/BalloonFlyContext";
import AnimatedBackground from "./AnimatedBackground";
import ProgressCurve from "./ProgressCurve";
import AnimatedBalloon from "./AnimatedBalloon";

const GameCanvas: React.FC = () => {
  const { currentMultiplier, isFlying, currentRound } = useBalloonFlyContext();
  const [isExploding, setIsExploding] = useState(false);
  const [lastFlyingState, setLastFlyingState] = useState(false);

  // Calcular progresso baseado no multiplicador (0-1)
  // Multiplicador mínimo: 1.0, máximo esperado: 100.0
  const maxMultiplier = 100;
  const minMultiplier = 1.0;
  const progress = Math.max(0, Math.min((currentMultiplier - minMultiplier) / (maxMultiplier - minMultiplier), 1));

  // Detectar crash (quando isFlying muda de true para false)
  useEffect(() => {
    if (lastFlyingState && !isFlying && currentMultiplier > 1.0) {
      setIsExploding(true);
      setTimeout(() => {
        setIsExploding(false);
      }, 1000);
    }
    setLastFlyingState(isFlying);
  }, [isFlying, lastFlyingState, currentMultiplier]);

  const getMultiplierColor = (mult: number) => {
    if (mult < 2.0) return "#3B82F6";
    if (mult < 10.0) return "#A855F7";
    return "#EF4444";
  };

  const statusMessage = !isFlying && currentRound?.status === "Waiting" 
    ? "🎈 Waiting for bets..." 
    : "";

  return (
    <div style={{
      flex: 1,
      position: "relative",
      background: "#0a0e1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      {/* Fundo Animado - Linhas Radiais */}
      <AnimatedBackground progress={progress} />

      {/* Curva de Progresso - Aparece apenas quando está voando */}
      {isFlying && currentMultiplier > 1.0 && (
        <ProgressCurve 
          progress={progress} 
          color={getMultiplierColor(currentMultiplier)} 
        />
      )}

      {/* Balão/Aviador Animado */}
      <AnimatedBalloon
        progress={progress}
        color={getMultiplierColor(currentMultiplier)}
        isFlying={isFlying}
        isExploding={isExploding}
      />

      {/* Multiplier Display - Centralizado na curva */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "140px",
        fontWeight: 900,
        color: getMultiplierColor(currentMultiplier),
        textShadow: `0 0 40px ${getMultiplierColor(currentMultiplier)}, 0 0 80px ${getMultiplierColor(currentMultiplier)}`,
        zIndex: 10,
        transition: "all 0.1s",
        pointerEvents: "none",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        {currentMultiplier.toFixed(2)}x
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div style={{
          position: "absolute",
          top: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(139, 92, 246, 0.2)",
          backdropFilter: "blur(10px)",
          padding: "16px 32px",
          borderRadius: "12px",
          border: "2px solid #8b5cf6",
          fontSize: "24px",
          fontWeight: 700,
          color: "#8b5cf6",
          animation: "bounce 2s ease-in-out infinite",
          zIndex: 20
        }}>
          {statusMessage}
        </div>
      )}

      {/* Active Players Widget */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "rgba(30, 33, 48, 0.9)",
        padding: "12px 16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backdropFilter: "blur(10px)",
        zIndex: 20
      }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {["🎈", "🎯", "⭐"].map((emoji, i) => (
            <div key={i} style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "2px solid #1e2130",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              marginLeft: i > 0 ? "-8px" : "0"
            }}>
              {emoji}
            </div>
          ))}
        </div>
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
          {currentRound?.bet_count || 0}
        </span>
      </div>

      {/* Round Info */}
      {currentRound && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          background: "rgba(30, 33, 48, 0.9)",
          padding: "8px 12px",
          borderRadius: "8px",
          backdropFilter: "blur(10px)",
          fontSize: "12px",
          color: "#8b8fa3",
          zIndex: 20
        }}>
          Round #{currentRound.id.toString()}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default GameCanvas;
