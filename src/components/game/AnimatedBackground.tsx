import React, { useRef, useEffect } from "react";

interface AnimatedBackgroundProps {
  progress: number; // 0-1 (baseado no multiplicador)
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const animationTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Limpar canvas
      ctx.fillStyle = "#0a0e1a";
      ctx.fillRect(0, 0, width, height);

      // Gradiente de fundo (do canto inferior esquerdo para superior direito)
      const gradient = ctx.createLinearGradient(0, height, width, 0);
      gradient.addColorStop(0, "#0a0e1a");
      gradient.addColorStop(0.3, "#1a0d2e");
      gradient.addColorStop(0.6, "#2d1b4e");
      gradient.addColorStop(1, "#0a0e1a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Origem das linhas radiais (canto inferior esquerdo)
      const centerX = 0;
      const centerY = height;
      const numLines = 80;
      const maxDistance = Math.sqrt(width * width + height * height);

      // Desenhar linhas radiais
      ctx.strokeStyle = "#1a1d29";
      ctx.lineWidth = 1.5;

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 0.75; // 135 graus (do inferior esquerdo)
        const distance = maxDistance * (1.2 + progress * 0.3);
        
        // Offset baseado no tempo para criar movimento parallax
        const offset = animationTimeRef.current * 30;
        const currentDistance = distance + offset;

        const endX = centerX + Math.cos(angle) * currentDistance;
        const endY = centerY - Math.sin(angle) * currentDistance;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Linhas alternadas mais escuras (padrão)
      ctx.strokeStyle = "#0f1117";
      ctx.lineWidth = 1;
      for (let i = 0; i < numLines; i += 2) {
        const angle = (i / numLines) * Math.PI * 0.75;
        const distance = maxDistance * (1.2 + progress * 0.3);
        const offset = animationTimeRef.current * 30;
        const currentDistance = distance + offset;

        const endX = centerX + Math.cos(angle) * currentDistance;
        const endY = centerY - Math.sin(angle) * currentDistance;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Incrementar tempo de animação
      animationTimeRef.current += 0.01;
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1
      }}
    />
  );
};

export default AnimatedBackground;

