import React, { useRef, useEffect, useCallback } from 'react';

const CircuitBackground = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const pulsesRef = useRef([]);

  const initNodes = useCallback((w, h) => {
    const nodes = [];
    const count = Math.min(35, Math.floor((w * h) / 30000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        connections: [],
        size: Math.random() * 2 + 1,
      });
    }
    // Create connections (each node connects to 1-3 nearest)
    for (let i = 0; i < nodes.length; i++) {
      const distances = nodes
        .map((n, j) => ({ idx: j, dist: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
        .filter(d => d.idx !== i)
        .sort((a, b) => a.dist - b.dist);
      const connectCount = Math.floor(Math.random() * 2) + 1;
      nodes[i].connections = distances.slice(0, connectCount).map(d => d.idx);
    }
    return nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Check mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      nodesRef.current = initNodes(window.innerWidth, window.innerHeight);
    };
    resize();
    window.addEventListener('resize', resize);

    const GOLD = { r: 201, g: 168, b: 76 };
    const VIOLET = { r: 124, g: 109, b: 240 };

    let frame = 0;
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      frame++;

      // Move nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        // Soft bounce
        if (node.x < -50) node.vx = Math.abs(node.vx);
        if (node.x > w + 50) node.vx = -Math.abs(node.vx);
        if (node.y < -50) node.vy = Math.abs(node.vy);
        if (node.y > h + 50) node.vy = -Math.abs(node.vy);
      }

      // Draw connections as circuit traces
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        for (const j of node.connections) {
          const target = nodes[j];
          const dist = Math.hypot(target.x - node.x, target.y - node.y);
          if (dist > 300) continue;

          const alpha = Math.max(0, 0.08 * (1 - dist / 300));

          // Determine color: mostly gold, occasional violet
          const isViolet = (i + j) % 7 === 0;
          const color = isViolet ? VIOLET : GOLD;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
          ctx.lineWidth = 0.5;

          // Draw right-angle circuit traces
          const midX = node.x + (target.x - node.x) * 0.5;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(midX, node.y);
          ctx.lineTo(midX, target.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }

      // Draw nodes as small dots
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(frame * 0.02 + i) * 0.5 + 0.5;
        const isViolet = i % 5 === 0;
        const color = isViolet ? VIOLET : GOLD;
        const alpha = 0.1 + pulse * 0.08;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fill();
      }

      // Occasional pulse traveling along a connection
      if (frame % 120 === 0 && pulsesRef.current.length < 5) {
        const startNode = Math.floor(Math.random() * nodes.length);
        if (nodes[startNode].connections.length > 0) {
          const endNode = nodes[startNode].connections[0];
          pulsesRef.current.push({
            from: startNode,
            to: endNode,
            progress: 0,
            speed: 0.008 + Math.random() * 0.005,
            isViolet: Math.random() > 0.7,
          });
        }
      }

      // Animate pulses
      pulsesRef.current = pulsesRef.current.filter(pulse => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) return false;

        const from = nodes[pulse.from];
        const to = nodes[pulse.to];
        if (!from || !to) return false;

        const midX = from.x + (to.x - from.x) * 0.5;
        const t = pulse.progress;
        let px, py;

        if (t < 0.33) {
          const lt = t / 0.33;
          px = from.x + (midX - from.x) * lt;
          py = from.y;
        } else if (t < 0.66) {
          const lt = (t - 0.33) / 0.33;
          px = midX;
          py = from.y + (to.y - from.y) * lt;
        } else {
          const lt = (t - 0.66) / 0.34;
          px = midX + (to.x - midX) * lt;
          py = to.y;
        }

        const color = pulse.isViolet ? VIOLET : GOLD;
        const alpha = Math.sin(pulse.progress * Math.PI) * 0.4;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.fill();

        // Glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, 12);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default CircuitBackground;
