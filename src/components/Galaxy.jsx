import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Galaxy = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 500;
    const height = canvas.height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    let rotation = 0;
    const particles = [];
    const numParticles = 2000;
    const numArms = 5;
    const armSpread = 0.5;
    const galaxyRadius = 200;

    for (let i = 0; i < numParticles; i++) {
      const armIndex = i % numArms;
      const angle = (i / numParticles) * Math.PI * 2 * numArms;
      const distance = Math.random() * galaxyRadius;
      
      const armAngle = (armIndex / numArms) * Math.PI * 2;
      const spiralAngle = distance * armSpread / 50;

      const x = centerX + Math.cos(angle + armAngle + spiralAngle) * distance + (Math.random() - 0.5) * 30;
      const y = centerY + Math.sin(angle + armAngle + spiralAngle) * distance + (Math.random() - 0.5) * 30;
      
      const size = Math.random() * 1.5 + 0.5;
      const opacity = Math.random() * 0.5 + 0.2;
      
      particles.push({ x, y, size, opacity });
    }

    const drawGalaxy = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.translate(-centerX, -centerY);

      // Core glow
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      coreGradient.addColorStop(0.2, 'rgba(126, 75, 162, 0.5)');
      coreGradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 255, ${p.opacity})`;
        ctx.fill();
      });

      ctx.restore();

      rotation += 0.001;
      requestAnimationFrame(drawGalaxy);
    };

    drawGalaxy();
  }, []);

  return (
    <motion.div
      className="relative"
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 8,
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

export default Galaxy;