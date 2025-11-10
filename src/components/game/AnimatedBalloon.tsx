import React from "react";

interface AnimatedBalloonProps {
  progress: number; // 0-1
  color: string;
  isFlying: boolean;
  isExploding: boolean;
}

const AnimatedBalloon: React.FC<AnimatedBalloonProps> = ({ 
  progress, 
  color, 
  isFlying,
  isExploding 
}) => {
  // Calcular posição na curva (mesma lógica da ProgressCurve)
  const getPositionOnCurve = (t: number) => {
    const startX = 0;
    const startY = 100;
    const endX = 100;
    const endY = 0;
    const cp1X = 25;
    const cp1Y = 75;
    const cp2X = 65;
    const cp2Y = 15;

    const x = Math.pow(1 - t, 3) * startX +
              3 * Math.pow(1 - t, 2) * t * cp1X +
              3 * (1 - t) * Math.pow(t, 2) * cp2X +
              Math.pow(t, 3) * endX;
    
    const y = Math.pow(1 - t, 3) * startY +
              3 * Math.pow(1 - t, 2) * t * cp1Y +
              3 * (1 - t) * Math.pow(t, 2) * cp2Y +
              Math.pow(t, 3) * endY;
    
    // Calcular rotação baseada na direção da curva (tangente)
    const dx = 3 * Math.pow(1 - t, 2) * (cp1X - startX) +
               6 * (1 - t) * t * (cp2X - cp1X) +
               3 * Math.pow(t, 2) * (endX - cp2X);
    const dy = 3 * Math.pow(1 - t, 2) * (cp1Y - startY) +
               6 * (1 - t) * t * (cp2Y - cp1Y) +
               3 * Math.pow(t, 2) * (endY - cp2Y);
    const angle = Math.atan2(-dy, dx) * (180 / Math.PI);

    return { x, y, angle };
  };

  const position = getPositionOnCurve(progress);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) rotate(${position.angle}deg) ${
            isExploding ? "scale(2)" : "scale(1)"
          }`,
          transition: isExploding 
            ? "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
            : "left 0.1s linear, top 0.1s linear, transform 0.1s ease-out",
          opacity: isExploding ? 0 : (isFlying ? 1 : 0.3),
          zIndex: 15,
          pointerEvents: "none"
        }}
      >
        {/* SVG do Balão/Aviador customizado */}
        <svg width="100" height="120" viewBox="0 0 100 120">
          <defs>
            <filter id="balloonGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="balloonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="50%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="balloonShine" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>
          </defs>
          
          {/* Balão principal */}
          <ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="45"
            fill="url(#balloonGradient)"
            filter="url(#balloonGlow)"
          />
          
          {/* Brilho no balão */}
          <ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="45"
            fill="url(#balloonShine)"
            opacity="0.6"
          />
          
          {/* Fio do balão */}
          <line
            x1="50"
            y1="95"
            x2="50"
            y2="120"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
        </svg>
      </div>

      {/* Partículas de explosão */}
      {isExploding && (
        <div style={{
          position: "absolute",
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: "200px",
          height: "200px",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 16
        }}>
          {Array.from({length: 20}).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 60;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: color,
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) rotate(${angle * 180 / Math.PI}deg) translateY(-${distance}px)`,
                  animation: `explode 0.8s ease-out forwards`,
                  animationDelay: `${i * 0.03}s`,
                  boxShadow: `0 0 10px ${color}`
                }}
              />
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes explode {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(-60px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateY(-120px) scale(0);
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedBalloon;

