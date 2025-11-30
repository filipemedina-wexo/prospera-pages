import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Globe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 500;
    const height = canvas.height = 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 180;

    let rotation = 0;

    const drawGlobe = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = '#667eea';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#667eea';

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;

      const numDots = 800;
      for (let i = 0; i < numDots; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta + rotation);
        const y = radius * Math.sin(phi) * Math.sin(theta + rotation);
        const z = radius * Math.cos(phi);

        if (z > 0) {
          const scale = (z + radius) / (2 * radius);
          const dotX = centerX + x;
          const dotY = centerY + y;
          const dotSize = 1 + scale * 1.5;
          const opacity = 0.3 + scale * 0.7;

          ctx.fillStyle = `rgba(102, 126, 234, ${opacity})`;
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rotation += 0.003;
      requestAnimationFrame(drawGlobe);
    };

    drawGlobe();
  }, []);

  return (
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full h-auto"
      />
    </motion.div>
  );
};

export default Globe;