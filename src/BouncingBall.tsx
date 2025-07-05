import React, { useRef, useEffect } from 'react';

const BouncingBall = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ball state
  const ball = useRef({
    x: 100,
    y: 100,
    dx: 4,
    dy: 3,
    size: 30,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const { width, height } = canvas;
      const b = ball.current;

      // Move
      b.x += b.dx;
      b.y += b.dy;

      // Bounce
      if (b.x < 0 || b.x + b.size > width) b.dx = -b.dx;
      if (b.y < 0 || b.y + b.size > height) b.dy = -b.dy;

      // Clear and draw
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(b.x + b.size / 2, b.y + b.size / 2, b.size / 2, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default BouncingBall;

