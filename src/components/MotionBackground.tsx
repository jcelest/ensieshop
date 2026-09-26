"use client";

import { useEffect, useRef } from "react";
import { getCurrentTheme } from "@/lib/theme";

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export default function MotionBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = getCurrentTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const primary = hexToRgb(theme.primary);
    const accent = hexToRgb(theme.primaryGlow);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let animationId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.96)");
      gradient.addColorStop(0.5, `rgba(${accent.r}, ${accent.g}, ${accent.b}, 0.16)`);
      gradient.addColorStop(1, "rgba(244,185,95,0.18)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1;
      for (let row = -1; row < 8; row += 1) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 18) {
          const y =
            height * (0.18 + row * 0.12) +
            Math.sin(x * 0.012 + frame * 0.018 + row) * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${primary.r}, ${primary.g}, ${primary.b}, ${0.08 + row * 0.006})`;
        ctx.stroke();
      }

      if (!reducedMotion) frame += 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [theme.primary, theme.primaryGlow]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
