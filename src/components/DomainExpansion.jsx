import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════
   Ryoiki Tenkai — Domain Expansion
   Project-specific full-screen takeover transitions
   ═══════════════════════════════════════ */

// FYP: Signal wave rings expanding outward
const SignalWaveTheme = ({ progress }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <motion.circle
        key={i}
        cx="500" cy="500"
        r={60 + i * 70}
        fill="none"
        stroke="#c9a84c"
        strokeWidth={1.5 - i * 0.15}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.6, 0.3] }}
        transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      />
    ))}
    {/* Radial pulse lines */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30) * Math.PI / 180;
      return (
        <motion.line
          key={`ray-${i}`}
          x1="500" y1="500"
          x2={500 + Math.cos(angle) * 480}
          y2={500 + Math.sin(angle) * 480}
          stroke="#c9a84c"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
        />
      );
    })}
    {/* Center pulse */}
    <motion.circle
      cx="500" cy="500" r="8"
      fill="#c9a84c"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    />
  </svg>
);

// HackABot 2026: Factory grid assembly
const FactoryGridTheme = ({ progress }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
    {/* Horizontal lines */}
    {Array.from({ length: 11 }).map((_, i) => (
      <motion.line
        key={`h-${i}`}
        x1="0" y1={i * 100}
        x2="1000" y2={i * 100}
        stroke="#c9a84c"
        strokeWidth="0.8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.35 }}
        transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      />
    ))}
    {/* Vertical lines */}
    {Array.from({ length: 11 }).map((_, i) => (
      <motion.line
        key={`v-${i}`}
        x1={i * 100} y1="0"
        x2={i * 100} y2="1000"
        stroke="#c9a84c"
        strokeWidth="0.8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.35 }}
        transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      />
    ))}
    {/* Intersection nodes lighting up */}
    {Array.from({ length: 11 }).flatMap((_, i) =>
      Array.from({ length: 11 }).map((_, j) => (
        <motion.circle
          key={`node-${i}-${j}`}
          cx={i * 100} cy={j * 100} r="3"
          fill="#c9a84c"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: (i + j) % 3 === 0 ? 0.8 : 0.2 }}
          transition={{ duration: 0.3, delay: 0.6 + (i + j) * 0.02, ease: 'easeOut' }}
        />
      ))
    )}
  </svg>
);

// HackABot 2025: Camera iris aperture
const CameraIrisTheme = ({ progress }) => {
  const blades = 8;
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      {/* Outer ring */}
      <motion.circle
        cx="500" cy="500" r="400"
        fill="none" stroke="#7c6df0"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Iris blades */}
      {Array.from({ length: blades }).map((_, i) => {
        const angle = (i * 360 / blades) * Math.PI / 180;
        const innerR = 80;
        const outerR = 380;
        const spread = (360 / blades / 2) * Math.PI / 180;
        const x1 = 500 + Math.cos(angle - spread) * innerR;
        const y1 = 500 + Math.sin(angle - spread) * innerR;
        const x2 = 500 + Math.cos(angle) * outerR;
        const y2 = 500 + Math.sin(angle) * outerR;
        const x3 = 500 + Math.cos(angle + spread) * innerR;
        const y3 = 500 + Math.sin(angle + spread) * innerR;

        return (
          <motion.path
            key={`blade-${i}`}
            d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`}
            fill="none"
            stroke="#7c6df0"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0, rotate: -30 }}
            animate={{ pathLength: 1, opacity: 0.6, rotate: 0 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '500px 500px' }}
          />
        );
      })}
      {/* Center lens */}
      <motion.circle
        cx="500" cy="500" r="60"
        fill="none" stroke="#7c6df0" strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0.6] }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      {/* Inner crosshair */}
      <motion.line x1="500" y1="430" x2="500" y2="570" stroke="#7c6df0" strokeWidth="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.7 }} />
      <motion.line x1="430" y1="500" x2="570" y2="500" stroke="#7c6df0" strokeWidth="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.7 }} />
    </svg>
  );
};

// Buggy: Circuit board traces
const CircuitTraceTheme = ({ progress }) => {
  const traces = [
    'M 500 500 L 500 200 L 700 200',
    'M 500 500 L 800 500 L 800 300',
    'M 500 500 L 500 800 L 300 800',
    'M 500 500 L 200 500 L 200 700',
    'M 500 500 L 650 350 L 850 350',
    'M 500 500 L 350 650 L 150 650',
    'M 500 500 L 350 350 L 150 200',
    'M 500 500 L 650 650 L 850 800',
  ];

  const components = [
    { x: 700, y: 200, type: 'rect' },
    { x: 800, y: 300, type: 'circle' },
    { x: 300, y: 800, type: 'rect' },
    { x: 200, y: 700, type: 'circle' },
    { x: 850, y: 350, type: 'rect' },
    { x: 150, y: 650, type: 'circle' },
    { x: 150, y: 200, type: 'rect' },
    { x: 850, y: 800, type: 'circle' },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      {traces.map((d, i) => (
        <motion.path
          key={`trace-${i}`}
          d={d}
          fill="none"
          stroke="#c9a84c"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {components.map((comp, i) => (
        comp.type === 'rect' ? (
          <motion.rect
            key={`comp-${i}`}
            x={comp.x - 12} y={comp.y - 8}
            width="24" height="16"
            fill="none" stroke="#c9a84c" strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
            style={{ transformOrigin: `${comp.x}px ${comp.y}px` }}
          />
        ) : (
          <motion.circle
            key={`comp-${i}`}
            cx={comp.x} cy={comp.y} r="6"
            fill="none" stroke="#7c6df0" strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
          />
        )
      ))}
      {/* Center chip */}
      <motion.rect
        x="470" y="470" width="60" height="60"
        fill="none" stroke="#c9a84c" strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ transformOrigin: '500px 500px' }}
      />
      <motion.text
        x="500" y="505" textAnchor="middle" fill="#c9a84c" fontSize="12" fontFamily="monospace"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.8 }}
      >
        MCU
      </motion.text>
    </svg>
  );
};

// Default / generic theme
const DefaultTheme = ({ progress }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
    <motion.circle
      cx="500" cy="500" r="400"
      fill="none" stroke="#c9a84c" strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.4 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    />
  </svg>
);

const THEMES = {
  'vfc-ns3': SignalWaveTheme,
  'hackabot-2026': FactoryGridTheme,
  'hackabot-2025': CameraIrisTheme,
  buggy: CircuitTraceTheme,
  default: DefaultTheme,
};

const DomainExpansion = ({ projectId, isActive, onComplete, cardRect }) => {
  const [phase, setPhase] = useState('idle'); // idle → expand → pattern → reveal → done
  const ThemeComponent = THEMES[projectId] || THEMES.default;

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    setPhase('expand');
    const t1 = setTimeout(() => setPhase('pattern'), 300);
    const t2 = setTimeout(() => setPhase('reveal'), 1600);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isActive, onComplete]);

  if (phase === 'idle' || phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark backdrop */}
        <motion.div
          className="absolute inset-0 bg-[#08080c]"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'reveal' ? 0.3 : 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* SVG Pattern */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: phase === 'reveal' ? 1.1 : 1,
            opacity: phase === 'reveal' ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ThemeComponent progress={phase === 'pattern' ? 1 : 0} />
        </motion.div>

        {/* Title flash */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'pattern' ? 1 : 0 }}
          transition={{ duration: 0.3, delay: phase === 'pattern' ? 0.5 : 0 }}
        >
          <motion.span
            className="font-display text-2xl md:text-4xl font-bold tracking-tight"
            style={{ color: projectId === 'hackabot-2025' ? '#7c6df0' : '#c9a84c' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: phase === 'reveal' ? 0 : 0.8 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {projectId === 'vfc-ns3' && '5G VFC Architecture'}
            {projectId === 'hackabot-2026' && 'GridBox — Smart Factory'}
            {projectId === 'hackabot-2025' && 'AI Classroom Camera'}
            {projectId === 'buggy' && 'Autonomous Buggy'}
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DomainExpansion;
