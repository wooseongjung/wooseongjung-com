import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate, useParams } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Lenis deferred — use native smooth scroll for now
import lottie from 'lottie-web';
import MusicPlayer from "./components/MusicPlayer";
import FYPDetail from "./components/FYPDetail";
import HackABot2025Detail from "./components/HackABot2025Detail";
import HackABot2026Detail from "./components/HackABot2026Detail";
import { AmbientLightChart, TCRT5000LSpreadChart, AllSensorsSpreadChart } from './components/buggy/SensorCharts';

import {
  Mail, Github, Linkedin, Disc, LogIn, LogOut,
  ArrowRight, ArrowUpRight, CircuitBoard, Wrench, Terminal,
  Sun, Moon, Menu, X
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   Smooth Scroll Utilities
   ═══════════════════════════════════════ */
const useLenis = () => {}; // placeholder — Lenis can be added later

/* Smooth scroll to a section by ID */
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top, behavior: 'smooth' });
};

/* ═══════════════════════════════════════
   Firebase
   ═══════════════════════════════════════ */
const firebaseConfig = {
  apiKey: "AIzaSyAFqfyOMjvVQrgITIUOA8ktYzghHbq3OvA",
  authDomain: "wooseongjung-5f089.firebaseapp.com",
  projectId: "wooseongjung-5f089",
  storageBucket: "wooseongjung-5f089.firebasestorage.app",
  messagingSenderId: "618389572385",
  appId: "1:618389572385:web:6d913485e87c455b4f0c60",
  measurementId: "G-FVYNF66XQ9"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();
try { getAnalytics(app); } catch (e) {}

/* ═══════════════════════════════════════
   Data
   ═══════════════════════════════════════ */
const PROJECTS = [
  {
    id: 'vfc-ns3', slug: 'VFC_Simulation', domain: 'signal',
    title: '5G Vehicular Fog Computing', tag: 'Final Year Project',
    category: 'Research · Networks', year: '2025–26',
    desc: 'Comparing bus-mounted vs roadside fog nodes over 5G NR at 28 GHz — full PHY/MAC simulation with ns-3.46 + 5G-LENA across Manchester city traffic.',
    accent: '#d4a843', hasDetail: true,
  },
  {
    id: 'hackabot-2026', slug: 'Hackabot_2026', domain: 'grid',
    title: 'GridBox — Smart Factory', tag: 'Hack-A-Bot 2026',
    category: 'Hackathon · IoT', year: '2026',
    desc: 'A £15 smart factory controller — dual Raspberry Pi Pico 2, wireless SCADA, autonomous fault detection. Built in 24 hours.',
    accent: '#e8734a', hasDetail: true,
  },
  {
    id: 'baby-spyder', slug: null, domain: 'circuit',
    title: 'Baby Spyder Robot',
    category: 'Robotics', year: '2025',
    desc: 'ROS 2 control stack for a 12-servo quadruped — torque-based joint stability with Gazebo simulation for physical validation.',
    accent: '#7c6df0', hasDetail: false,
  },
  {
    id: 'hackabot-2025', slug: 'Hackabot_2025', domain: 'camera',
    title: 'AI Classroom Camera', tag: '3rd Place',
    category: 'Hackathon · CV', year: '2025',
    desc: 'Real-time hand-raise detection and engagement monitoring via on-device PoseNet on a Raspberry Pi AI Camera.',
    accent: '#5b9cf5', hasDetail: true,
  },
  {
    id: 'vlsi-cell', slug: null, domain: 'signal',
    title: 'VLSI Logic Cell Optimization',
    category: 'VLSI Design', year: '2025',
    desc: 'Fast-switching CMOS logic cell — worst-case delay of 0.553 ns via transistor sizing optimization in Tanner EDA.',
    accent: '#d4a843', hasDetail: false,
  },
  {
    id: 'buggy', slug: 'Buggy', domain: 'track',
    title: 'Line-Following Buggy', tag: 'Best Looking',
    category: 'Embedded Systems', year: '2024',
    desc: 'STM32 PID control, BLE-tunable parameters, quadrature encoder feedback. Multi-layer acetyl chassis won "Best Looking" award.',
    accent: '#e8734a', hasDetail: true,
  },
];

const SKILLS = [
  { icon: CircuitBoard, label: 'Hardware & EDA', items: ['Altium', 'Solidworks', 'Tanner EDA', 'LT Spice', 'Xilinx', 'NI Multisim', 'STM32 Nucleo', 'Raspberry Pi'] },
  { icon: Terminal, label: 'Software & Control', items: ['C / C++', 'Python', 'Assembly', 'VHDL', 'ROS 2', 'Matlab / Simulink', 'JavaScript / React'] },
  { icon: Wrench, label: 'Frameworks & Tools', items: ['Gazebo', 'Docker', 'Git', 'Firebase', 'ns-3', 'SUMO', 'Linux / Ubuntu'] },
];

const TIMELINE = [
  { year: '2021', title: 'University of Manchester', desc: 'Started BEng Electronic Engineering — FPGA synthesis, analog IC layout, control systems.', color: '#7c6df0' },
  { year: '2022', title: 'Republic of Korea Air Force', desc: 'Avionics maintenance team. Led procedural optimizations, reduced troubleshooting time by 15%. Mentored 16 recruits.', color: '#d4a843' },
  { year: '2024', title: 'Return to Studies', desc: 'Back at Manchester for final year — specializing in robotics, VLSI, and 5G network simulation.', color: '#7c6df0' },
  { year: '2026', title: 'Graduation', desc: 'Expected First-Class Honours (80%). Six completed projects spanning hardware, software, and research.', color: '#d4a843' },
];

const projectIdBySlug = { vfc_simulation: 'vfc-ns3', buggy: 'buggy', hackabot_2025: 'hackabot-2025', hackabot_2026: 'hackabot-2026' };

const PROJECT_BG_CONFIG = {
  'vfc-ns3': { type: 'svg-network' },
  'hackabot-2026': { type: 'image-kenburns', src: '/images/hackabot-2026/hero.jpeg' },
  'hackabot-2025': { type: 'image-viewfinder', src: '/images/hackabot-2025/hero.jpeg' },
  'baby-spyder': { type: 'svg-quadruped' },
  'vlsi-cell': { type: 'css-silicon' },
  'buggy': { type: 'image-kenburns', src: '/images/buggy/hero.jpg' },
};

/* ═══════════════════════════════════════
   Shared Components
   ═══════════════════════════════════════ */
const GoldDot = ({ className = '' }) => <div className={`w-2 h-2 rounded-full bg-gold ${className}`} />;

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-4 mb-10">
    <GoldDot />
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-midnight-400 dark:text-midnight-500 font-medium">{children}</span>
    <div className="flex-1 h-px bg-midnight-200 dark:bg-midnight-800" />
  </div>
);

const ScrollProgress = () => {
  const barRef = useRef(null);
  useEffect(() => {
    const h = () => { if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1)})`; };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return <div ref={barRef} className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-gold origin-left" style={{ transform: 'scaleX(0)' }} />;
};

/* ═══════════════════════════════════════
   Animated Counter — counts up on scroll
   ═══════════════════════════════════════ */
const AnimatedCounter = ({ value, accent }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        // Parse value — extract numeric part and suffix
        const match = value.match(/^([0-9,.]+)(.*)/);
        if (!match) { setDisplay(value); return; }
        const numStr = match[1].replace(/,/g, '');
        const suffix = match[2] || '';
        const prefix = value.match(/^([^0-9]*)/)?.[1] || '';
        const target = parseFloat(numStr);
        if (isNaN(target)) { setDisplay(value); return; }
        const hasComma = match[1].includes(',');
        const hasDecimal = numStr.includes('.');
        const decimals = hasDecimal ? numStr.split('.')[1].length : 0;
        const duration = 1200;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          let formatted;
          if (hasDecimal) {
            formatted = current.toFixed(decimals);
          } else {
            const rounded = Math.round(current);
            formatted = hasComma ? rounded.toLocaleString() : String(rounded);
          }
          setDisplay(prefix + formatted + suffix);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="font-display text-3xl font-black tracking-tight mb-1 block" style={{ color: accent }}>
      {display}
    </span>
  );
};

/* ═══════════════════════════════════════
   Cursor Glow — subtle gold radial that follows mouse (desktop dark mode)
   ═══════════════════════════════════════ */
const CursorGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    // Use GSAP quickTo for smooth lag
    const xTo = gsap.quickTo(el, 'left', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'top', { duration: 0.4, ease: 'power3.out' });

    const handleMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <div ref={glowRef} className="cursor-glow" />;
};

/* ═══════════════════════════════════════
   Magnetic Button — pulls toward cursor on hover
   ═══════════════════════════════════════ */
const MagneticButton = ({ children, className = '', onClick, style }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || window.innerWidth < 1024) return;

    const handleMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power3.out' });
    };
    const handleLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };
    btn.addEventListener('mousemove', handleMove);
    btn.addEventListener('mouseleave', handleLeave);
    return () => {
      btn.removeEventListener('mousemove', handleMove);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <button ref={btnRef} className={className} onClick={onClick} style={style}>
      {children}
    </button>
  );
};

/* ═══════════════════════════════════════
   Signal Cards — rotating fact cards
   ═══════════════════════════════════════ */
const CREDENTIALS = [
  { label: 'Education', period: '2021–2026', title: 'BEng Electronic Engineering', org: 'University of Manchester', detail: 'FPGA synthesis, analog IC layout, VLSI design, control systems, 5G network simulation.', accent: '#d4a843' },
  { label: 'Military', period: '2022–2024', title: 'Avionics Maintenance', org: 'Republic of Korea Air Force', detail: 'Led procedural optimizations, reduced troubleshooting time by 15%. Mentored 16 recruits.', accent: '#7c6df0' },
  { label: 'Achievement', period: '2025', title: '3rd Place · AI Classroom Camera', org: 'Hack-A-Bot 2025', detail: 'Real-time hand-raise detection via on-device PoseNet on Raspberry Pi AI Camera. 24-hour build.', accent: '#5b9cf5' },
  { label: 'Research', period: '2025–26', title: '5G Vehicular Fog Computing', org: 'Supervised by Dr. Khairi Hamdi', detail: 'ns-3.46 + 5G-LENA simulation comparing bus-mounted vs roadside fog nodes at 28 GHz.', accent: '#e8734a' },
  { label: 'Competition', period: '2026', title: 'GridBox — Smart Factory Controller', org: 'Hack-A-Bot 2026', detail: 'Dual Raspberry Pi Pico 2, wireless SCADA, autonomous fault detection. Built in 24 hours.', accent: '#d4a843' },
  { label: 'Project', period: '2024–25', title: 'Line-Following Buggy', org: 'Embedded Systems Project', detail: 'STM32 PID control, BLE-tunable parameters, multi-layer acetyl chassis. Won "Best Looking" award.', accent: '#7c6df0' },
];

const CredentialCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {CREDENTIALS.map((cred, i) => (
      <div key={i} className="group relative p-5 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 hover:border-opacity-60 transition-all duration-400 hover:-translate-y-1 overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: cred.accent }} />
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: cred.accent }}>{cred.label}</span>
          <span className="font-mono text-[10px] tracking-wider text-midnight-400 dark:text-midnight-500">{cred.period}</span>
        </div>
        <h4 className="font-display text-sm font-bold text-midnight-900 dark:text-white leading-snug mb-1">{cred.title}</h4>
        <p className="font-mono text-[11px] text-midnight-500 dark:text-midnight-400 mb-2">{cred.org}</p>
        <p className="text-xs text-midnight-500 dark:text-midnight-400 leading-relaxed font-medium">{cred.detail}</p>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════
   Eye Diagram — Interactive Canvas
   ═══════════════════════════════════════ */
const OscilloscopeWaveform = () => {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const targetRef = useRef({ x: -9999, y: -9999 });
  const activeRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let t = 0;

    const N = 500;
    // Each wave layer gets its own displacement array
    const WAVES = [
      { freq: 2, amp: 0.25, speed: 2, color: [212, 168, 67], width: 2.5 },   // gold — primary
      { freq: 3, amp: 0.15, speed: 2.5, color: [212, 168, 67], width: 1.5 },  // gold — secondary
      { freq: 1.5, amp: 0.12, speed: 1.5, color: [212, 168, 67], width: 1 },  // gold — tertiary
    ];
    const displacements = WAVES.map(() => new Float32Array(N));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      targetRef.current.x = e.clientX - r.left;
      targetRef.current.y = e.clientY - r.top;
      activeRef.current = true;
    };
    const onLeave = () => { activeRef.current = false; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const draw = () => {
      if (!pausedRef.current) t += 0.002;
      const r = canvas.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      const isDark = document.documentElement.classList.contains('dark');

      // Smooth cursor with momentum
      const c = cursorRef.current;
      const tgt = targetRef.current;
      if (activeRef.current) {
        c.x += (tgt.x - c.x) * 0.08;
        c.y += (tgt.y - c.y) * 0.08;
      }

      ctx.clearRect(0, 0, w, h);

      // ── Grid ──
      const ga = isDark ? 0.04 : 0.05;
      ctx.strokeStyle = `rgba(212,168,67,${ga})`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 10; i++) { const x = (w / 10) * i; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let i = 0; i <= 8; i++) { const y = (h / 8) * i; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = `rgba(212,168,67,${isDark ? 0.06 : 0.08})`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      ctx.setLineDash([]);

      const yMid = h * 0.5;
      const R = 200;  // influence radius in px

      // ── Cursor influence indicator ──
      if (activeRef.current && c.x > -9000) {
        // Outer glow ring
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, R);
        grad.addColorStop(0, isDark ? 'rgba(212,168,67,0.06)' : 'rgba(212,168,67,0.04)');
        grad.addColorStop(0.5, isDark ? 'rgba(212,168,67,0.02)' : 'rgba(212,168,67,0.015)');
        grad.addColorStop(1, 'rgba(212,168,67,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
        ctx.fill();
        // Ring outline
        ctx.strokeStyle = isDark ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        // Center dot
        ctx.fillStyle = isDark ? 'rgba(212,168,67,0.15)' : 'rgba(212,168,67,0.12)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Update & draw each wave layer ──
      WAVES.forEach((wave, wi) => {
        const dy = displacements[wi];
        const waveAmp = h * wave.amp;
        // Offset each wave vertically so they don't stack on same line
        const yOffset = yMid + (wi - 1) * h * 0.06;

        // Update displacement for this wave
        for (let i = 0; i < N; i++) {
          const px = (i / N) * w;
          const phase = (i / N) * Math.PI * 2 * wave.freq + t * wave.speed;
          const waveY = yOffset + Math.sin(phase) * waveAmp;

          if (activeRef.current) {
            const dxPx = px - c.x;
            const dyPx = waveY + dy[i] - c.y;
            const dist = Math.sqrt(dxPx * dxPx + dyPx * dyPx);

            if (dist < R) {
              // Distance-based influence with smooth Gaussian falloff
              const influence = 1 - dist / R;
              const strength = influence * influence;

              // Angle from cursor to this point — used for directional flow
              const angle = Math.atan2(dyPx, dxPx);

              // Push away from cursor along the angle
              const push = strength * 100;

              // Vortex: swirling flow around cursor (like water around obstacle)
              const vortex = Math.sin(angle * 3 + t * 3) * strength * 25;

              // Swell: compression wave propagating outward
              const swell = Math.cos(dist * 0.02 - t * 4) * strength * 15;

              // Vertical component of push + vortex tangent + swell
              const forceY = Math.sin(angle) * push
                           + Math.cos(angle) * vortex
                           + swell;

              dy[i] += (forceY - dy[i]) * 0.12;
            } else {
              dy[i] *= 0.94;
            }
          } else {
            dy[i] *= 0.94;
          }
        }

        // Draw this wave
        const baseAlpha = isDark
          ? [0.22, 0.12, 0.08][wi]
          : [0.18, 0.10, 0.06][wi];
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${wave.color.join(',')},${baseAlpha})`;
        ctx.lineWidth = wave.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 0; i < N; i++) {
          const px = (i / N) * w;
          const phase = (i / N) * Math.PI * 2 * wave.freq + t * wave.speed;
          const y = yOffset + Math.sin(phase) * waveAmp + dy[i];
          if (i === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
        }
        ctx.stroke();

        // Glow for primary wave only
        if (wi === 0) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212,168,67,${isDark ? 0.05 : 0.03})`;
          ctx.lineWidth = 14;
          for (let i = 0; i < N; i += 2) {
            const px = (i / N) * w;
            const phase = (i / N) * Math.PI * 2 * wave.freq + t * wave.speed;
            const y = yOffset + Math.sin(phase) * waveAmp + dy[i];
            if (i === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
          }
          ctx.stroke();
        }
      });

      // Label
      ctx.fillStyle = isDark ? 'rgba(212,168,67,0.1)' : 'rgba(212,168,67,0.13)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('CH1 SINE', 8, yMid - h * 0.25 - 10);

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />
      <button
        onClick={() => setPaused(p => !p)}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase tracking-widest border backdrop-blur-sm transition-all duration-300 hover:scale-105"
        style={{
          color: paused ? '#d4a843' : 'rgba(212,168,67,0.4)',
          borderColor: paused ? 'rgba(212,168,67,0.5)' : 'rgba(212,168,67,0.15)',
          backgroundColor: paused ? 'rgba(212,168,67,0.1)' : 'rgba(255,255,255,0.03)',
        }}
      >
        {paused ? '▶ Resume' : '▌▌ Pause'}
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════
   Domain Transition — Lottie Animation
   Plays in the empty space beside the project title.
   Each project domain has a unique thematic animation.
   ═══════════════════════════════════════ */
const LOTTIE_PATHS = {
  signal: '/animations/signal.json',
  grid: '/animations/grid.json',
  aperture: '/animations/aperture.json',
  circuit: '/animations/circuit.json',
  track: '/animations/track.json',
  camera: '/animations/camera.json',
};

const DomainTransition = ({ domain }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const path = LOTTIE_PATHS[domain] || LOTTIE_PATHS.circuit;
    const anim = lottie.loadAnimation({
      container: el,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: path,
    });

    return () => anim.destroy();
  }, [domain]);

  return (
    <div className="absolute top-0 right-0 w-[45%] md:w-[40%] h-[300px] md:h-[360px] pointer-events-none overflow-hidden opacity-80" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, transparent 95%)' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};


/* ═══════════════════════════════════════
   Project Card Background Visuals
   ═══════════════════════════════════════ */
const cardBgMask = {
  maskImage: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 40%, transparent 75%)',
  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 40%, transparent 75%)',
};

const NetworkTopologySVG = ({ accent }) => (
  <div className="absolute inset-0 pointer-events-none hidden md:block opacity-[0.12] dark:opacity-[0.18]" style={cardBgMask}>
    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMaxYMid slice">
      {/* Connection lines */}
      {[[200,60,300,100],[300,100,350,50],[300,100,360,160],[200,60,140,130],[140,130,250,170],[250,170,360,160],[200,60,100,40]].map(([x1,y1,x2,y2], i) => (
        <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="20" to="0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </line>
      ))}
      {/* Nodes */}
      {[[200,60],[300,100],[350,50],[360,160],[140,130],[250,170],[100,40]].map(([cx,cy], i) => (
        <circle key={`n${i}`} cx={cx} cy={cy} r="4" fill={accent} opacity="0.6" className="animate-pulse-node" style={{ animationDelay: `${i * 0.3}s` }}>
          <animate attributeName="r" values="3;5;3" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  </div>
);

const KenBurnsImage = ({ src }) => (
  <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden opacity-[0.12] dark:opacity-[0.18]" style={cardBgMask}>
    <div className="w-full h-full bg-cover bg-center animate-kenburns" style={{ backgroundImage: `url(${src})` }} />
  </div>
);

const ViewfinderImage = ({ src, accent }) => (
  <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden opacity-[0.12] dark:opacity-[0.18]" style={cardBgMask}>
    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
    {/* Crosshair overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative" style={{ width: '60%', height: '70%' }}>
        {/* Crosshairs */}
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: `${accent}40` }} />
        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: `${accent}40` }} />
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: `${accent}60` }} />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: `${accent}60` }} />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: `${accent}60` }} />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: `${accent}60` }} />
        {/* Center ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border animate-pulse" style={{ borderColor: `${accent}50` }} />
      </div>
    </div>
  </div>
);

const QuadrupedSVG = ({ accent }) => (
  <div className="absolute inset-0 pointer-events-none hidden md:block opacity-[0.10] dark:opacity-[0.15]" style={cardBgMask}>
    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMaxYMid slice">
      <g stroke={accent} strokeWidth="1.5" fill="none" className="animate-breathe" style={{ transformOrigin: 'center' }}>
        {/* Body */}
        <rect x="160" y="80" width="80" height="40" rx="4" />
        {/* Head */}
        <rect x="240" y="85" width="25" height="25" rx="8" />
        {/* Front-left leg */}
        <line x1="175" y1="120" x2="170" y2="150" /><line x1="170" y1="150" x2="160" y2="170" />
        {/* Front-right leg */}
        <line x1="225" y1="120" x2="230" y2="150" /><line x1="230" y1="150" x2="240" y2="170" />
        {/* Back-left leg */}
        <line x1="175" y1="120" x2="165" y2="145" /><line x1="165" y1="145" x2="155" y2="170" />
        {/* Back-right leg */}
        <line x1="225" y1="120" x2="235" y2="145" /><line x1="235" y1="145" x2="245" y2="170" />
        {/* Eyes */}
        <circle cx="250" cy="94" r="2" fill={accent} /><circle cx="258" cy="94" r="2" fill={accent} />
      </g>
    </svg>
  </div>
);

const SiliconDie = ({ accent }) => (
  <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden opacity-[0.08] dark:opacity-[0.12]" style={cardBgMask}>
    <div className="w-full h-full" style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, ${accent}15 0px, ${accent}15 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(90deg, ${accent}15 0px, ${accent}15 1px, transparent 1px, transparent 20px)
      `,
    }}>
      <div className="absolute inset-0 animate-scanline" style={{ background: `linear-gradient(to bottom, transparent, ${accent}30, transparent)`, height: '10%' }} />
    </div>
  </div>
);

const CircuitOverlayImage = ({ src, accent }) => (
  <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden opacity-[0.12] dark:opacity-[0.18]" style={cardBgMask}>
    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
    <div className="absolute inset-0" style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, ${accent}10 0px, ${accent}10 1px, transparent 1px, transparent 30px),
        repeating-linear-gradient(90deg, ${accent}10 0px, ${accent}10 1px, transparent 1px, transparent 30px)
      `,
    }} />
  </div>
);

const CardBackground = ({ projectId, accent }) => {
  const config = PROJECT_BG_CONFIG[projectId];
  if (!config) return null;
  switch (config.type) {
    case 'svg-network': return <NetworkTopologySVG accent={accent} />;
    case 'image-kenburns': return <KenBurnsImage src={config.src} />;
    case 'image-viewfinder': return <ViewfinderImage src={config.src} accent={accent} />;
    case 'svg-quadruped': return <QuadrupedSVG accent={accent} />;
    case 'css-silicon': return <SiliconDie accent={accent} />;
    case 'image-circuit': return <CircuitOverlayImage src={config.src} accent={accent} />;
    default: return null;
  }
};

/* ═══════════════════════════════════════
   Project Showcase Card
   ═══════════════════════════════════════ */
const ProjectShowcaseCard = ({ proj, index, onClick }) => {
  const cardRef = useRef(null);
  const numberRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !numberRef.current) return;
    const st = ScrollTrigger.create({
      trigger: cardRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5,
      animation: gsap.to(numberRef.current, { yPercent: -30, ease: 'none' }),
    });
    return () => st.kill();
  }, []);

  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      className={`project-card group relative overflow-hidden border-b-2 border-midnight-100 dark:border-midnight-800 ${proj.hasDetail ? 'cursor-pointer' : ''}`}
      onClick={() => proj.hasDetail && onClick(proj)}
    >
      <CardBackground projectId={proj.id} accent={proj.accent} />
      <div className="relative py-10 md:py-14 px-2 md:px-4 flex items-start gap-6 md:gap-10">
        <div ref={numberRef} className="shrink-0 select-none pointer-events-none">
          <span
            className="ghost-num font-display text-[80px] md:text-[120px] lg:text-[150px] font-bold leading-none tracking-tighter"
            style={{ color: `${proj.accent}55` }}
          >
            {num}
          </span>
        </div>
        <div className="flex-1 pt-2 md:pt-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs tracking-[0.15em] uppercase font-medium" style={{ color: proj.accent }}>{proj.category}</span>
            <span className="w-6 h-px bg-midnight-300 dark:bg-midnight-600" />
            <span className="font-mono text-xs tracking-wider text-midnight-400 dark:text-midnight-500">{proj.year}</span>
          </div>
          <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-midnight-900 dark:text-white mb-4 group-hover:translate-x-2 transition-transform duration-500">
            {proj.title}
            {proj.tag && (
              <span className="ml-4 inline-block text-sm md:text-base font-mono font-semibold px-3 py-1 align-middle" style={{ backgroundColor: `${proj.accent}15`, color: proj.accent, border: `1px solid ${proj.accent}30` }}>
                {proj.tag}
              </span>
            )}
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-midnight-600 dark:text-midnight-300 max-w-2xl mb-5 font-medium">{proj.desc}</p>
          <div className="flex items-center gap-4">
            <div className="h-[3px] w-12 group-hover:w-24 transition-all duration-500 rounded-full" style={{ backgroundColor: proj.accent }} />
            {proj.hasDetail && (
              <span className="text-sm font-semibold tracking-wide opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex items-center gap-2" style={{ color: proj.accent }}>
                Enter Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 50%, ${proj.accent}08, transparent 70%)` }} />
    </div>
  );
};

/* ═══════════════════════════════════════
   Main Page — Hero + About + Skills
   ═══════════════════════════════════════ */
const MainPage = ({ introComplete }) => {
  const heroRef = useRef(null);
  const bioRef = useRef(null);
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);
  const heroTl = useRef(null);

  /* ── Hero animations ── */
  useEffect(() => {
    if (!introComplete || !heroRef.current) return;
    const scope = heroRef.current;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo(scope.querySelectorAll('.hero-label'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, clearProps: 'all' })
      .fromTo(scope.querySelectorAll('.hero-name-line'), { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, clearProps: 'all' }, '-=0.3')
      .fromTo(scope.querySelectorAll('.hero-highlight'), { backgroundSize: '0% 40%' }, { backgroundSize: '100% 40%', duration: 0.8, stagger: 0.15 }, '-=0.5')
      .fromTo(scope.querySelectorAll('.hero-bio'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, clearProps: 'all' }, '-=0.5')
      .fromTo(scope.querySelectorAll('.hero-cta'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, clearProps: 'all' }, '-=0.3');
    return () => tl.kill();
  }, [introComplete]);

  /* ── Bio, Skills, Journey scroll animations ── */
  useEffect(() => {
    if (!introComplete) return;
    const triggers = [];
    const tweens = [];
    // Bio
    if (bioRef.current) {
      bioRef.current.querySelectorAll('.bio-reveal').forEach((el, i) => {
        const tw = gsap.fromTo(el,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: bioRef.current, start: 'top 75%' } }
        );
        tweens.push(tw);
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });
    }
    // Skills
    if (skillsRef.current) {
      skillsRef.current.querySelectorAll('.skill-card').forEach((card, i) => {
        const tw = gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: i * 0.15, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: card, start: 'top 95%' } }
        );
        tweens.push(tw);
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });
    }
    // Journey
    if (timelineRef.current) {
      const line = timelineRef.current.querySelector('.timeline-line');
      if (line) {
        const tw = gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: timelineRef.current, start: 'top 65%', end: 'bottom 50%', scrub: 1 } });
        tweens.push(tw);
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      }
      timelineRef.current.querySelectorAll('.timeline-item').forEach((item, i) => {
        const tw = gsap.fromTo(item,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: item, start: 'top 80%' } }
        );
        tweens.push(tw);
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });
    }
    return () => {
      triggers.forEach(st => st.kill());
      tweens.forEach(tw => tw.kill());
    };
  }, [introComplete]);


  return (
    <div>
      {/* ════════ HERO ════════ */}
      <section id="hero" ref={heroRef} className="relative min-h-[85vh] flex items-center py-20 md:py-28 overflow-hidden">
        <OscilloscopeWaveform />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pointer-events-none">
          <p className="hero-label font-mono text-sm tracking-[0.25em] uppercase mb-6 text-gold font-semibold">
            Electronic Engineer · Manchester, UK
          </p>
          <h1 className="hero-name-line font-display text-[clamp(3rem,8vw,6rem)] font-black leading-[1] tracking-tight text-midnight-900 dark:text-white mb-3">
            Wooseong Jung
          </h1>
          <p className="hero-name-line font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-[1.3] tracking-tight text-midnight-600 dark:text-midnight-300 mb-8">
            I build systems from{' '}
            <span className="hero-highlight" style={{ backgroundImage: 'linear-gradient(120deg, #d4a84340 0%, #d4a84340 100%)', backgroundRepeat: 'no-repeat', backgroundPosition: '0 88%', backgroundSize: '100% 40%' }}>silicon</span>
            {' '}to{' '}
            <span className="hero-highlight" style={{ backgroundImage: 'linear-gradient(120deg, #7c6df040 0%, #7c6df040 100%)', backgroundRepeat: 'no-repeat', backgroundPosition: '0 88%', backgroundSize: '100% 40%' }}>software</span>.
          </p>
          <div className="hero-bio max-w-2xl text-lg md:text-xl leading-relaxed text-midnight-600 dark:text-midnight-300 mb-12 font-medium">
            <p>Final-year BEng Electronic Engineering at the <span className="underline decoration-gold/50 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">University of Manchester</span>. Expecting <span className="underline decoration-violet/50 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">First-Class (80%)</span>. From nanosecond CMOS delays to 12-servo robotic kinematics.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 pointer-events-auto">
            <Link to="/projects" className="hero-cta group inline-flex items-center gap-3 px-8 py-4 bg-gold text-midnight-950 font-display font-bold text-base hover:bg-gold-bright hover:scale-[1.03] active:scale-[0.97] transition-all duration-300">
              Explore My Work <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <Link to="/contact" className="hero-cta group inline-flex items-center gap-3 px-8 py-4 border-2 border-midnight-300 dark:border-midnight-600 text-midnight-700 dark:text-midnight-300 font-display font-bold text-base hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold hover:scale-[1.03] active:scale-[0.97] transition-all duration-300">
              Get in Touch <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ BIO + CREDENTIALS ════════ */}
      <section ref={bioRef} className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <div className="bio-reveal"><SectionLabel>About</SectionLabel></div>
        {/* Intro paragraph — full width */}
        <div className="bio-reveal max-w-3xl space-y-5 text-lg leading-[1.8] text-midnight-600 dark:text-midnight-300 font-medium mb-16">
          <p>I'm <span className="font-semibold text-midnight-800 dark:text-white">Wooseong Jung</span>, an electronic engineer who loves building things that work in the real world — from transistor-level IC layouts to full-stack web applications.</p>
          <p>My journey started in <span className="underline decoration-violet/40 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">Manchester in 2021</span> studying Electronic Engineering. After two years of <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">military service as an avionics technician</span> in the Republic of Korea Air Force, I returned to Manchester to finish my degree with a focus on <span className="font-semibold text-midnight-800 dark:text-white">embedded systems</span>, <span className="font-semibold text-midnight-800 dark:text-white">5G network simulation</span>, and <span className="font-semibold text-midnight-800 dark:text-white">robotics</span>.</p>
          <p>I'm drawn to problems that sit at the intersection of hardware and software — where you need to understand both the physics and the code. Whether it's tuning PID gains over Bluetooth on a line-following buggy, simulating millimetre-wave fog computing in ns-3, or building a real-time AI camera in a 24-hour hackathon, I care most about making things that actually run.</p>
        </div>
        {/* Credential cards — 3-column grid, full width */}
        <div className="bio-reveal">
          <CredentialCards />
        </div>
      </section>

      {/* ════════ SKILLS ════════ */}
      <section ref={skillsRef} className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <SectionLabel>Technical Arsenal</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SKILLS.map((group, gi) => (
            <div key={gi} className="skill-card p-7 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 hover:border-gold/40 dark:hover:border-gold/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-6">
                <group.icon size={18} className="text-gold" />
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-midnight-500 dark:text-midnight-400 font-semibold">{group.label}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((s) => (
                  <span key={s} className="skill-tag px-3 py-1.5 text-sm font-mono font-medium text-midnight-700 dark:text-midnight-300 border border-midnight-200 dark:border-midnight-700 bg-midnight-50 dark:bg-midnight-800/50 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold hover:scale-[1.08] transition-all duration-300 cursor-default">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ JOURNEY ════════ */}
      <div className="gold-line w-full" />
      <section ref={timelineRef} className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <SectionLabel>Journey</SectionLabel>
        <div className="relative ml-6 md:ml-12">
          <div className="timeline-line absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-gold via-violet to-gold/20" />
          {TIMELINE.map((entry, i) => (
            <div key={i} className="timeline-item relative pl-12 pb-16 group">
              <div className="timeline-dot absolute left-[-7px] top-2 w-[17px] h-[17px] rounded-full border-[3px] bg-white dark:bg-midnight-950 transition-all duration-300 group-hover:scale-125" style={{ borderColor: entry.color }} />
              <span className="font-mono text-sm font-bold tracking-wider" style={{ color: entry.color }}>{entry.year}</span>
              <h4 className="text-xl md:text-2xl font-display font-bold text-midnight-900 dark:text-white mt-2 mb-2 group-hover:translate-x-1 transition-transform duration-300">{entry.title}</h4>
              <p className="text-base text-midnight-500 dark:text-midnight-400 leading-relaxed font-medium max-w-lg">{entry.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

/* ═══════════════════════════════════════
   Projects Page
   ═══════════════════════════════════════ */
const ProjectsPage = () => {
  const projectsRef = useRef(null);
  const navigate = useNavigate();

  const openProject = useCallback((proj) => {
    if (!proj.hasDetail || !proj.slug) return;
    navigate(`/project/${proj.slug}`);
  }, [navigate]);

  useEffect(() => {
    if (!projectsRef.current) return;
    const tweens = [];
    const triggers = [];
    const title = projectsRef.current.querySelector('.page-title');
    if (title) tweens.push(gsap.fromTo(title, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'all' }));
    projectsRef.current.querySelectorAll('.project-card').forEach((card, i) => {
      const tw = gsap.fromTo(card,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.1 + i * 0.08, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: card, start: 'top 95%' } }
      );
      tweens.push(tw);
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });
    return () => {
      triggers.forEach(st => st.kill());
      tweens.forEach(tw => tw.kill());
    };
  }, []);

  return (
    <div>
      <section ref={projectsRef} className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <div className="page-title mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-midnight-900 dark:text-white mb-4">Projects</h2>
          <p className="text-lg md:text-xl text-midnight-600 dark:text-midnight-300 max-w-3xl font-medium leading-relaxed">
            From <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">5G network simulation</span> to <span className="underline decoration-violet/40 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">competitive robotics</span> — research, hackathons, and hands-on builds.
          </p>
        </div>
        <div>
          {PROJECTS.map((proj, idx) => (
            <ProjectShowcaseCard key={proj.id} proj={proj} index={idx} onClick={openProject} />
          ))}
        </div>
      </section>
    </div>
  );
};

/* ═══════════════════════════════════════
   Life Page
   ═══════════════════════════════════════ */
const LifePage = () => {
  const lifeRef = useRef(null);

  return (
    <div ref={lifeRef}>
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <div className="life-reveal"><SectionLabel>Beyond Engineering</SectionLabel></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {[
            { emoji: '🎵', title: 'Music', desc: 'Beenzino, Jazzyfact — Korean hip-hop and jazz-infused beats for the soul.', accent: '#d4a843' },
            { emoji: '🍜', title: 'Gastronomy', desc: 'From Korean street food to Manchester curry mile — cooking as engineering with tastebuds.', accent: '#e8734a' },
            { emoji: '👔', title: 'Fashion', desc: 'Clean silhouettes, functional fabrics. The INTJ wardrobe — minimal, intentional, sharp.', accent: '#d4a843' },
          ].map((card) => (
            <div key={card.title} className="life-reveal group p-6 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 hover:border-gold/40 dark:hover:border-gold/30 transition-all duration-500 hover:-translate-y-1">
              <div className="text-3xl mb-4">{card.emoji}</div>
              <h4 className="font-display text-lg font-bold text-midnight-900 dark:text-white mb-2 group-hover:translate-x-0.5 transition-transform duration-300">{card.title}</h4>
              <p className="text-sm text-midnight-500 dark:text-midnight-400 leading-relaxed font-medium">{card.desc}</p>
              <div className="mt-4 h-[2px] w-8 group-hover:w-16 transition-all duration-500 rounded-full" style={{ backgroundColor: card.accent }} />
            </div>
          ))}
        </div>

        <Link to="/record" className="life-reveal group relative overflow-hidden bg-midnight-950 text-white p-10 sm:p-14 border border-midnight-800 hover:border-gold/40 transition-all duration-500 block hover:scale-[1.005]">
          <div className="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-black z-0" />
          <div className="absolute -right-16 -bottom-16 z-0 opacity-[0.04]">
            <Disc size={300} className="animate-[spin_20s_linear_infinite]" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
            <div className="max-w-xl">
              <span className="font-mono text-gold text-xs uppercase tracking-[0.2em] mb-4 block font-semibold">Music · Interactive</span>
              <h3 className="font-display text-3xl sm:text-5xl font-black tracking-tight mb-4 flex items-center gap-4">
                WSJ Record <Disc className="text-gold animate-[spin_4s_linear_infinite]" size={32} />
              </h3>
              <p className="text-midnight-400 leading-relaxed text-lg font-medium">My curated sonic landscape — a personalized playback experience for deep work and aesthetic flow.</p>
            </div>
            <span className="shrink-0 flex items-center gap-2 bg-gold text-midnight-950 px-7 py-4 font-display font-bold text-base group-hover:bg-gold-bright transition-all">
              Open Player <ArrowRight size={18} />
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
};

/* ═══════════════════════════════════════
   Contact Page
   ═══════════════════════════════════════ */
const ContactPage = () => {
  const contactRef = useRef(null);

  useEffect(() => {
    if (!contactRef.current) return;
    const els = contactRef.current.querySelectorAll('.contact-reveal');
    gsap.set(els, { y: 0, opacity: 1 }); // Show immediately, no animation delay
    const tl = gsap.fromTo(els,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
    );
    return () => tl.kill();
  }, []);

  return (
    <div ref={contactRef}>
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-24">
        <div className="contact-reveal"><SectionLabel>Contact</SectionLabel></div>
        <div className="contact-reveal mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-midnight-900 dark:text-white mb-4">Let's build something.</h2>
          <p className="text-lg text-midnight-600 dark:text-midnight-300 max-w-2xl leading-relaxed font-medium">
            Whether it's a <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">hardware collaboration</span>, a <span className="underline decoration-violet/40 decoration-2 underline-offset-4 font-semibold text-midnight-800 dark:text-white">job opportunity</span>, or just a good coffee recommendation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Mail, title: 'Email', sub: 'wooseongjung12@gmail.com', href: 'mailto:wooseongjung12@gmail.com', external: false, accent: '#d4a843' },
            { icon: Linkedin, title: 'LinkedIn', sub: 'Professional network', href: 'https://www.linkedin.com/in/wooseong-jung-21b143223/', external: true, accent: '#5b9cf5' },
            { icon: Github, title: 'GitHub', sub: 'Code & repositories', href: 'https://github.com/wooseongjung', external: true, accent: '#7c6df0' },
          ].map((card, i) => (
            <a key={i} href={card.href} target={card.external ? '_blank' : undefined} rel={card.external ? 'noreferrer' : undefined}
              className="contact-reveal flex flex-col gap-5 p-7 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 hover:border-gold/50 dark:hover:border-gold/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${card.accent}12` }}>
                <card.icon size={22} style={{ color: card.accent }} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-midnight-900 dark:text-white">{card.title}</h3>
                <span className="text-sm text-midnight-400 font-medium">{card.sub}</span>
              </div>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all mt-auto" style={{ color: card.accent }} />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ═══════════════════════════════════════
   Buggy Detail
   ═══════════════════════════════════════ */
const BuggyDetail = ({ backToList }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const tweens = [];
    const triggers = [];
    containerRef.current.querySelectorAll('.reveal').forEach((s, i) => {
      const tw = gsap.fromTo(s,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: i * 0.06, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: s, start: 'top 85%' } }
      );
      tweens.push(tw);
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });
    return () => { triggers.forEach(st => st.kill()); tweens.forEach(tw => tw.kill()); };
  }, []);

  return (
    <div ref={containerRef} className="space-y-10 max-w-4xl pb-12">
      <div className="reveal">
        <button onClick={backToList} className="flex items-center gap-2 text-midnight-400 hover:text-gold transition-colors mb-6 group font-semibold text-sm">
          <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" /> Back to Projects
        </button>
      </div>
      <div className="reveal border-b-2 border-midnight-200 dark:border-midnight-800 pb-8">
        <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight text-midnight-900 dark:text-white mb-4">Autonomous Line-Following Buggy</h2>
        <p className="text-lg text-midnight-500 dark:text-midnight-400 font-medium">EEEN21000 Embedded Systems Project · University of Manchester · Group 23</p>
        <p className="text-sm text-midnight-400 dark:text-midnight-500 mt-2 font-medium">Tutor: Wuqiang Yang · 2024–25</p>
        <div className="flex flex-wrap gap-3 mt-5">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold/10 border border-gold/25 text-gold text-sm font-bold">★ Best Looking Buggy Award</span>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet/10 border border-violet/25 text-violet text-sm font-bold">84% — First Class Honours</span>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight-100 dark:bg-midnight-800 border border-midnight-200 dark:border-midnight-700 text-midnight-600 dark:text-midnight-300 text-sm font-bold">Race Qualifier — Heat 1</span>
        </div>
      </div>
      <div className="reveal overflow-hidden border border-midnight-200 dark:border-midnight-800">
        <img src="/images/buggy/hero.jpg" alt="Autonomous line-following buggy" className="w-full h-auto object-cover" />
        <p className="text-sm text-midnight-400 dark:text-midnight-500 px-5 py-3 bg-midnight-50 dark:bg-midnight-900 font-medium">The completed buggy — multi-layer acetyl chassis, front sensor bar, rear drive wheels, and STM32 Nucleo controller.</p>
      </div>
      <div className="text-base text-midnight-600 dark:text-midnight-300 space-y-12 leading-relaxed font-medium">
        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Overview</h3>
          <p>An autonomous line-following robot engineered to prioritise <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-bold text-midnight-800 dark:text-white">high speed and stability</span> for rapid warehouse product handling. The buggy follows a white line on a black track using a hybrid PID + bang-bang control system, with real-time BLE parameter tuning.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[['21.8s', 'Heat Lap Time', '#d4a843'], ['5', 'IR Sensors', '#7c6df0'], ['15:1', 'Gear Ratio', '#e8734a'], ['12.4', 'km/h Top Speed', '#5b9cf5']].map(([val, label, color]) => (
              <div key={label} className="p-4 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 text-center">
                <div className="font-display font-black text-2xl tracking-tight mb-1" style={{ color }}>{val}</div>
                <div className="font-mono text-xs uppercase tracking-widest text-midnight-400 dark:text-midnight-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Team & My Role</h3>
          <p>Group 23 started with five members — our software engineer resigned mid-project, requiring urgent task redistribution across the remaining four.</p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Ethan Yu', role: 'Team Leader' },
              { name: 'Arlan Rossin', role: 'Hardware / Mechanical' },
              { name: 'Wooseong Jung', role: 'Hardware Engineer', highlight: true },
              { name: 'Taoyong Wang', role: 'CAD / Bluetooth' },
            ].map((m) => (
              <div key={m.name} className={`flex items-center gap-3 p-3 border ${m.highlight ? 'border-gold/40 bg-gold/5' : 'border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50'}`}>
                <div className={`w-2 h-2 rounded-full ${m.highlight ? 'bg-gold' : 'bg-midnight-300 dark:bg-midnight-600'}`} />
                <div>
                  <span className={`text-sm font-bold ${m.highlight ? 'text-gold' : 'text-midnight-800 dark:text-white'}`}>{m.name}</span>
                  <span className="text-xs text-midnight-400 dark:text-midnight-500 ml-2">{m.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Hardware Architecture</h3>
          <p>Built around the <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-bold text-midnight-800 dark:text-white">STM32 Nucleo-F401RE</span> microcontroller with bipolar H-bridge motor driver, quadrature encoders, and HM-10 BLE module.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50">
              <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-3 font-bold">Drive System</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-gold" />Two brushed DC motors, PWM at 10 kHz</li>
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-gold" />Two-stage gearbox (15:1), 72.25% efficiency</li>
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-gold" />Max torque: 9.8 mNm, armature resistance: 2.18 Ω</li>
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-gold" />AEAT-601B quadrature encoder, 1024 CPR</li>
              </ul>
            </div>
            <div className="p-5 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50">
              <h4 className="font-mono text-xs uppercase tracking-widest text-violet mb-3 font-bold">Sensing & Comms</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-violet" />5× TCRT5000L reflective IR sensors (3.89V Δ)</li>
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-violet" />Sensor covers to block ambient light crosstalk</li>
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-violet" />HM-10 BLE for real-time PID tuning</li>
                <li className="flex gap-2"><span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-violet" />PCB redesigned from 5V→3.3V (6 reprints needed)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Chassis Design</h3>
          <p>A <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-bold text-midnight-800 dark:text-white">multi-layer sandwich architecture</span> laser-cut from 3 mm acetyl (POM) sheets — chosen over aluminium, steel, and glass-reinforced laminate for the best balance of weight (1.8 g/cm³), cost (£83.75/m²), and flexural strength (91 MPa).</p>
          <ul className="mt-5 space-y-3">
            {[
              'Eight interlocking components: 3 main layers + motor plate + 2 side pieces + 2 support brackets.',
              'Bottom layer: ball castor, sensor PCB, battery pack, rounded front bumper.',
              'Middle layer: wire routing channels, motor mount (top), joins all structural parts.',
              'Top layer: MCU mount with pin access holes from underneath for cable management.',
              'Low centre of gravity — batteries positioned on the bottom layer for stability.',
              'All wiring routed internally for protection. Approximate weight: 1.09 kg.',
              'Designed in SolidWorks. Won "Best Looking Buggy" for the layered aesthetic.',
            ].map((txt, i) => (
              <li key={i} className="flex gap-3"><span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-gold" /><span>{txt}</span></li>
            ))}
          </ul>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Sensor Selection & Data</h3>
          <p>Five <span className="underline decoration-violet/40 decoration-2 underline-offset-4 font-bold text-midnight-800 dark:text-white">TCRT5000L IR sensors</span> selected after comparing against SFH203P photodiode, 5MΩ LDR, BPW17N phototransistor, and TEK5400S — the TCRT5000L delivered the highest voltage differential (3.89V) between white and black surfaces with minimal ambient light sensitivity.</p>
          <div className="mt-4 p-4 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50">
            <h4 className="font-mono text-xs uppercase tracking-widest text-midnight-400 dark:text-midnight-500 mb-2 font-semibold">Sensor Configuration</h4>
            <p className="text-sm">Optimal working distance: <span className="font-bold text-midnight-800 dark:text-white">5 mm</span> from ground · R_LED = 62 Ω · R_Sensor = 5 kΩ · Spacing: &lt;14 mm (min line width) · Powered at 3.3V from MCU</p>
          </div>
          <div className="mt-6 space-y-6">
            {[['Ambient Light Sensitivity', <AmbientLightChart key="a" />], ['Sensor Spread (TCRT5000L)', <TCRT5000LSpreadChart key="b" />], ['All Sensors — Comparative Spread', <AllSensorsSpreadChart key="c" />]].map(([title, chart]) => (
              <div key={title} className="border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 p-5">
                <h4 className="font-mono text-xs uppercase tracking-widest text-midnight-400 dark:text-midnight-500 mb-4 font-semibold">{title}</h4>
                {chart}
              </div>
            ))}
          </div>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Control System</h3>
          <p>A <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-bold text-midnight-800 dark:text-white">hybrid PID + bang-bang controller</span> — PID for smooth straight-line following, bang-bang for sharp turns when the middle sensor reads black for &gt;2 ms.</p>
          <div className="mt-5 p-5 border-2 border-gold/25 bg-gold/5">
            <p className="font-mono text-base text-midnight-700 dark:text-midnight-300"><span className="text-gold font-bold">PID</span> = Kp·e(t) + Ki·∫e(τ)dτ + Kd·de/dt</p>
            <p className="mt-2">Error calculated from voltage difference between side sensors. Integral term considers only the <span className="font-bold text-midnight-800 dark:text-white">last 10 error values</span> to prevent accumulated drift from consecutive turns.</p>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 text-center">
              <div className="font-display font-black text-2xl tracking-tight mb-1 text-gold">2 ms</div>
              <div className="font-mono text-xs uppercase tracking-widest text-midnight-400 dark:text-midnight-500 font-medium">Reaction Time</div>
            </div>
            <div className="p-4 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 text-center">
              <div className="font-display font-black text-2xl tracking-tight mb-1 text-violet">2000+</div>
              <div className="font-mono text-xs uppercase tracking-widest text-midnight-400 dark:text-midnight-500 font-medium">PID Iterations</div>
            </div>
            <div className="p-4 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50 text-center">
              <div className="font-display font-black text-2xl tracking-tight mb-1" style={{ color: '#e8734a' }}>270+</div>
              <div className="font-mono text-xs uppercase tracking-widest text-midnight-400 dark:text-midnight-500 font-medium">Bang-Bang Tests</div>
            </div>
          </div>
          <p className="mt-4">Tuned live via <span className="underline decoration-gold/40 decoration-2 underline-offset-4 font-bold text-midnight-800 dark:text-white">HM-10 Bluetooth Low Energy</span> — PID gains adjusted in real-time from a laptop without reflashing. BLE also served as a speed controller during the final race.</p>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Race Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 border-2 border-gold/25 bg-gold/5">
              <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-3 font-bold">Heat 1 — Qualified ✓</h4>
              <p className="text-sm">Completed successfully using bang-bang controller at conservative speed. <span className="font-bold text-midnight-800 dark:text-white">Time: 21.8 seconds.</span> Qualified for the final race.</p>
            </div>
            <div className="p-5 border-2 border-midnight-200 dark:border-midnight-700 bg-midnight-50 dark:bg-midnight-900/50">
              <h4 className="font-mono text-xs uppercase tracking-widest text-midnight-500 mb-3 font-bold">Heat 2 — Failed ✗</h4>
              <p className="text-sm">Sensor threshold set too low — buggy couldn't differentiate white line from black track and drove straight off at the first bend.</p>
            </div>
          </div>
          <div className="mt-5 p-5 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50">
            <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-2 font-bold">Final Race</h4>
            <p className="text-sm">Buggy successfully completed the full racetrack. PID controller was still under development, so the proven bang-bang controller was used for reliability.</p>
          </div>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Key Engineering Decisions</h3>
          <div className="space-y-4">
            {[
              ['TCRT5000L over BPW17N/TEK5400S', 'Highest contrast (3.89V Δ), most consistent readings, integrated LED, best ambient light resilience.'],
              ['Acetyl over Aluminium/Steel', 'Lightest option (1.8 g/cm³), sufficient flexural strength (91 MPa), 4.9 μm deflection under load. Cost-effective.'],
              ['Gear combo 2 (15:1) over 1 (12:1) and 3 (18.75:1)', 'Best balance of speed (12.4 km/h flat) and torque. Gear 1 had insufficient torque for inclines; Gear 3 was too slow.'],
              ['Limited integral history (10 values)', 'Prevents accumulated error from consecutive turns. Compensates for motor drive board PWM asymmetry on right motor.'],
              ['3.3V sensor PCB redesign', 'Original 5V signal exceeded MCU ADC range. Required 6 PCB reprints (£36.54 total) to resolve tolerance and voltage issues.'],
            ].map(([title, desc], i) => (
              <div key={i} className="flex gap-4 p-4 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/50" style={{ borderLeftWidth: 3, borderLeftColor: i % 2 === 0 ? '#d4a843' : '#7c6df0' }}>
                <div>
                  <h4 className="text-sm font-bold text-midnight-800 dark:text-white mb-1">{title}</h4>
                  <p className="text-sm text-midnight-500 dark:text-midnight-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal">
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-3"><GoldDot /> Reflections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 border-2 border-gold/25 bg-gold/5">
              <h4 className="font-mono text-xs uppercase tracking-widest text-gold mb-3 font-bold">What went well</h4>
              <ul className="space-y-2 text-sm">
                <li>• Low centre of gravity — batteries on bottom layer improved cornering stability</li>
                <li>• Covered sensors eliminated ambient light interference and LED crosstalk</li>
                <li>• Rigid multi-part chassis with standoff cross-bracing reduced vibrations</li>
                <li>• All wiring routed internally — zero connection issues post-assembly</li>
                <li>• BLE real-time tuning enabled rapid PID iteration without reflashing</li>
                <li>• Line-break recovery: spin toward last detected line direction</li>
              </ul>
            </div>
            <div className="p-5 border-2 border-violet/25 bg-violet/5">
              <h4 className="font-mono text-xs uppercase tracking-widest text-violet mb-3 font-bold">Lessons & Improvements</h4>
              <ul className="space-y-2 text-sm">
                <li>• Sensor spacing too narrow — biggest limitation for high-speed operation</li>
                <li>• Two outer sensors proved redundant (removed, partly PCB fault)</li>
                <li>• Motor drive board had persistent PWM error on right motor — compensated in software but never fully resolved</li>
                <li>• 6 PCB reprints — better upfront validation needed</li>
                <li>• Add IMU (gyro/accelerometer) for incline and drift detection</li>
                <li>• Encoder-based closed-loop speed control for tighter cornering</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   Detail Wrapper with Domain Mount Animation
   ═══════════════════════════════════════ */
const DetailWrapper = ({ children, domain, accent }) => {
  return (
    <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 min-h-screen">
      {/* Domain animation — positioned in the empty space beside the title */}
      <DomainTransition domain={domain} accent={accent} />
      <div className="animate-fade-up">{children}</div>
    </div>
  );
};

/* ═══════════════════════════════════════
   Project Detail Router
   ═══════════════════════════════════════ */
const ProjectDetail = () => {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  const projectId = projectSlug ? projectIdBySlug[projectSlug.toLowerCase()] ?? null : null;
  const proj = PROJECTS.find(p => p.id === projectId);
  const backToList = () => navigate('/projects');

  useEffect(() => { window.scrollTo(0, 0); }, [projectSlug]);
  if (!projectId) return <Navigate to="/projects" replace />;

  return (
    <DetailWrapper domain={proj?.domain} accent={proj?.accent}>
      {projectId === 'vfc-ns3' && <FYPDetail backToList={backToList} />}
      {projectId === 'hackabot-2026' && <HackABot2026Detail backToList={backToList} />}
      {projectId === 'hackabot-2025' && <HackABot2025Detail backToList={backToList} />}
      {projectId === 'buggy' && <BuggyDetail backToList={backToList} />}
    </DetailWrapper>
  );
};

/* ═══════════════════════════════════════
   Header
   ═══════════════════════════════════════ */
const Header = ({ isDarkMode, setIsDarkMode, user, handleLogin, logoRef, introComplete }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  // Header entrance: animate in when intro completes
  useEffect(() => {
    if (introComplete && headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -64, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power4.out', delay: 0.1, clearProps: 'opacity,transform' }
      );
    }
  }, [introComplete]);

  const navItems = [
    { id: 'about', label: 'About', path: '/' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'life', label: 'Life', path: '/life' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const isDetailPage = location.pathname.startsWith('/project');

  const activeId = (() => {
    if (isDetailPage) return 'projects';
    if (location.pathname === '/record') return null;
    const match = navItems.find(n => n.path === location.pathname);
    return match ? match.id : 'about';
  })();

  return (
    <header ref={headerRef} style={!introComplete ? { opacity: 0 } : undefined} className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-[#f7f6f3]/85 dark:bg-[#050507]/85 border-b border-midnight-200 dark:border-midnight-800 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div ref={logoRef} className="w-9 h-9 flex items-center justify-center border-2 border-gold/60 group-hover:border-gold group-hover:rotate-[6deg] transition-all duration-300">
            <span className="font-display text-sm font-black text-gold tracking-tight">WJ</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="font-display text-base font-bold tracking-tight text-midnight-900 dark:text-white leading-none">Wooseong Jung</h1>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-midnight-400 dark:text-midnight-500 mt-0.5 font-medium">Electronic Engineer</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.id} to={item.path}
              className={`relative px-4 py-2 text-sm font-display font-semibold transition-all duration-300 ${
                activeId === item.id ? 'text-midnight-900 dark:text-white' : 'text-midnight-400 dark:text-midnight-500 hover:text-midnight-700 dark:hover:text-midnight-300'
              }`}
            >
              {item.label}
              {activeId === item.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-gold rounded-full" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            {[
              { href: 'mailto:wooseongjung12@gmail.com', Icon: Mail, ext: false },
              { href: 'https://www.linkedin.com/in/wooseong-jung-21b143223/', Icon: Linkedin, ext: true },
              { href: 'https://github.com/wooseongjung', Icon: Github, ext: true },
            ].map(({ href, Icon, ext }, i) => (
              <a key={i} href={href} target={ext ? '_blank' : undefined} rel={ext ? 'noreferrer' : undefined} className="text-midnight-400 dark:text-midnight-500 hover:text-gold dark:hover:text-gold transition-all duration-300 hover:scale-125"><Icon size={16} /></a>
            ))}
          </div>
          <div className="hidden lg:block w-px h-5 bg-midnight-200 dark:bg-midnight-800" />
          {user ? (
            <button onClick={handleLogin} className="hidden lg:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 border border-midnight-200 dark:border-midnight-700 text-midnight-400 hover:border-gold hover:text-gold transition-colors font-medium">
              <span className="max-w-[100px] truncate">{user.email}</span><LogOut size={12} />
            </button>
          ) : (
            <button onClick={handleLogin} className="hidden lg:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 border border-midnight-200 dark:border-midnight-700 text-midnight-500 hover:border-gold hover:text-gold transition-colors font-medium">Sign In <LogIn size={12} /></button>
          )}
          <div className="hidden lg:block w-px h-5 bg-midnight-200 dark:bg-midnight-800" />
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-9 h-9 flex items-center justify-center text-midnight-400 dark:text-midnight-500 hover:text-gold dark:hover:text-gold transition-all duration-300 active:scale-90 hover:rotate-12" aria-label="Toggle theme">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center text-midnight-600 dark:text-midnight-400 active:scale-90">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-midnight-200 dark:border-midnight-800 bg-[#f7f6f3] dark:bg-[#050507] px-6 py-5 space-y-1">
          {navItems.map((item) => (
            <Link key={item.id} to={item.path} onClick={() => setMobileMenuOpen(false)}
              className={`block w-full text-left px-3 py-3 text-base font-display font-semibold transition-colors ${activeId === item.id ? 'text-gold' : 'text-midnight-600 dark:text-midnight-300 hover:text-gold'}`}
            >{item.label}</Link>
          ))}
          <div className="flex items-center gap-5 pt-4 border-t border-midnight-200 dark:border-midnight-800 mt-3">
            <a href="mailto:wooseongjung12@gmail.com" className="text-midnight-400 hover:text-gold transition-colors"><Mail size={18} /></a>
            <a href="https://www.linkedin.com/in/wooseong-jung-21b143223/" target="_blank" rel="noreferrer" className="text-midnight-400 hover:text-gold transition-colors"><Linkedin size={18} /></a>
            <a href="https://github.com/wooseongjung" target="_blank" rel="noreferrer" className="text-midnight-400 hover:text-gold transition-colors"><Github size={18} /></a>
          </div>
        </div>
      )}
    </header>
  );
};

/* ═══════════════════════════════════════
   Footer
   ═══════════════════════════════════════ */
const Footer = () => (
  <footer className="max-w-6xl mx-auto px-6 md:px-12 pt-10 pb-16 border-t border-midnight-200 dark:border-midnight-800">
    <div className="flex flex-col md:flex-row items-center justify-between text-midnight-400 dark:text-midnight-500 gap-4">
      <div className="flex items-center gap-3">
        <GoldDot className="animate-pulse" />
        <span className="font-mono text-xs tracking-widest uppercase font-medium">System.Online</span>
      </div>
      <span className="font-mono text-xs font-medium">&copy; {new Date().getFullYear()} Wooseong Jung</span>
    </div>
  </footer>
);

/* ═══════════════════════════════════════
   Intro Sequence — Loading Animation
   Black → gold line → "W" morph → header logo → content reveals
   ═══════════════════════════════════════ */
const IntroSequence = ({ onComplete, logoTargetRef }) => {
  const overlayRef = useRef(null);
  const wGroupRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!overlayRef.current || !wGroupRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        sessionStorage.setItem('introPlayed', 'true');
        onComplete();
      },
    });

    // Phase 1 (0–0.8s): Horizontal gold line draws from center
    tl.fromTo('.intro-line-h',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }
    );

    // Phase 2 (0.8–1.4s): Line fades, "W" strokes appear
    tl.to('.intro-line-h', { opacity: 0, duration: 0.15 })
      .fromTo(['.intro-stroke-1', '.intro-stroke-2', '.intro-stroke-3', '.intro-stroke-4'],
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' },
        '-=0.05'
      );

    // Phase 3 (1.4–2.0s): "W" scales down + moves to header logo position
    tl.to(wGroupRef.current, {
      duration: 0.6,
      ease: 'power3.inOut',
      onStart: () => {
        if (!logoTargetRef?.current) return;
        const logoRect = logoTargetRef.current.getBoundingClientRect();
        const groupRect = wGroupRef.current.getBoundingClientRect();
        const dx = (logoRect.left + logoRect.width / 2) - (groupRect.left + groupRect.width / 2);
        const dy = (logoRect.top + logoRect.height / 2) - (groupRect.top + groupRect.height / 2);
        const targetScale = logoRect.width / groupRect.width;
        gsap.to(wGroupRef.current, {
          x: dx, y: dy, scale: targetScale,
          duration: 0.6, ease: 'power3.inOut',
        });
      },
    });

    // Phase 4 (2.0–2.5s): Overlay fades out
    tl.to(overlayRef.current, {
      opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        if (overlayRef.current) overlayRef.current.style.display = 'none';
      },
    });

    return () => tl.kill();
  }, []);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[999] bg-[#050507] flex items-center justify-center">
      <div ref={wGroupRef} className="relative" style={{ width: 100, height: 70 }}>
        {/* Horizontal draw line */}
        <div className="intro-line-h absolute top-1/2 left-0 right-0 h-[2px] bg-gold" style={{ transformOrigin: 'center' }} />
        {/* W strokes: 4 angled lines forming a "W" */}
        <div className="intro-stroke-1 absolute h-[2px] bg-gold" style={{ width: 28, top: '15%', left: '2%', transform: 'rotate(68deg)', transformOrigin: 'top left' }} />
        <div className="intro-stroke-2 absolute h-[2px] bg-gold" style={{ width: 28, top: '85%', left: '26%', transform: 'rotate(-68deg)', transformOrigin: 'bottom left' }} />
        <div className="intro-stroke-3 absolute h-[2px] bg-gold" style={{ width: 28, top: '15%', left: '48%', transform: 'rotate(68deg)', transformOrigin: 'top left' }} />
        <div className="intro-stroke-4 absolute h-[2px] bg-gold" style={{ width: 28, top: '85%', left: '72%', transform: 'rotate(-68deg)', transformOrigin: 'bottom left' }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   Page Transition Wrapper
   ═══════════════════════════════════════ */
const PageWrapper = ({ children }) => {
  return <main>{children}</main>;
};

/* ═══════════════════════════════════════
   App Root
   ═══════════════════════════════════════ */
export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [introComplete, setIntroComplete] = useState(() => sessionStorage.getItem('introPlayed') === 'true');
  const logoRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'dark';
    return false;
  });

  // Initialize Lenis smooth scroll
  useLenis();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    if (user) await signOut(auth); else await signInWithPopup(auth, provider);
  };

  // Scroll to top + kill stale ScrollTriggers on route change (not initial mount)
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      // Kill ScrollTrigger instances from previous page to prevent stale DOM refs
      ScrollTrigger.getAll().forEach(st => st.kill());
      ScrollTrigger.clearMatchMedia();
      window.scrollTo(0, 0);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  const isRecord = location.pathname === '/record';

  return (
    <div className="min-h-screen relative noise-overlay">
      {!introComplete && !isRecord && location.pathname === '/' && (
        <IntroSequence onComplete={() => setIntroComplete(true)} logoTargetRef={logoRef} />
      )}
      {isDarkMode && !isRecord && <CursorGlow />}
      {!isRecord && <ScrollProgress />}
      {!isRecord && <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} user={user} handleLogin={handleLogin} logoRef={logoRef} introComplete={introComplete || isRecord || location.pathname !== '/'} />}
      <PageWrapper>
        <Routes location={location}>
          <Route path="/" element={<MainPage introComplete={introComplete} />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/life" element={<LifePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/project/:projectSlug" element={<ProjectDetail />} />
          <Route path="/record" element={<MusicPlayer user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageWrapper>
      {!isRecord && <Footer />}
    </div>
  );
}
