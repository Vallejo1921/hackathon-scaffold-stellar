import React from "react";

interface ProgressCurveProps {
  progress: number; // 0-1
  color: string;
}

const ProgressCurve: React.FC<ProgressCurveProps> = ({ progress, color }) => {
  // Curva bezier de canto inferior esquerdo para superior direito
  // Ponto inicial: (0, 100%)
  // Ponto final: (100%, 0%)
  // Control points para curva suave
  
  const startX = 0;
  const startY = 100;
  const endX = 100;
  const endY = 0;
  
  // Control points da curva bezier (criando curva suave ascendente)
  const cp1X = 25;
  const cp1Y = 75;
  const cp2X = 65;
  const cp2Y = 15;

  // Calcular ponto atual na curva baseado no progress
  const getPointOnCurve = (t: number) => {
    const x = Math.pow(1 - t, 3) * startX +
              3 * Math.pow(1 - t, 2) * t * cp1X +
              3 * (1 - t) * Math.pow(t, 2) * cp2X +
              Math.pow(t, 3) * endX;
    
    const y = Math.pow(1 - t, 3) * startY +
              3 * Math.pow(1 - t, 2) * t * cp1Y +
              3 * (1 - t) * Math.pow(t, 2) * cp2Y +
              Math.pow(t, 3) * endY;
    
    return { x, y };
  };

  const currentPoint = getPointOnCurve(progress);

  // Criar path da curva até o ponto atual (preenchido)
  const pathData = `M ${startX} ${startY} 
                    C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${currentPoint.x} ${currentPoint.y}
                    L ${currentPoint.x} ${startY}
                    Z`;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none"
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
        <filter id="curveGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData}
        fill="url(#curveGradient)"
        filter="url(#curveGlow)"
      />
      {/* Linha da curva (borda) */}
      <path
        d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${currentPoint.x} ${currentPoint.y}`}
        fill="none"
        stroke={color}
        strokeWidth="0.3"
        strokeOpacity="0.8"
      />
    </svg>
  );
};

export default ProgressCurve;

