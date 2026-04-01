import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import MusicPlayer from "./components/MusicPlayer";
import PreRunResults from "./components/PreRunResults";
import SimulationLab from "./components/SimulationLab";
import FYPDetail from "./components/FYPDetail";
import HackABot2025Detail from "./components/HackABot2025Detail";
import HackABot2026Detail from "./components/HackABot2026Detail";
import CircuitBackground from "./components/CircuitBackground";
import DomainExpansion from "./components/DomainExpansion";
import { AmbientLightChart, TCRT5000LSpreadChart, AllSensorsSpreadChart } from './components/buggy/SensorCharts';

import {
  User, Briefcase, Compass, Mail, Github, Linkedin,
  Coffee, Shirt, Disc, Zap, Power, Cpu, LogIn, LogOut,
  ArrowRight, ArrowUpRight, Loader2, Plug, ChevronDown,
  Terminal, CircuitBoard, Wrench, ExternalLink, Sun, Moon, Menu, X
} from 'lucide-react';

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
try { getAnalytics(app); } catch (e) { }

/* ═══════════════════════════════════════
   Gemini API
   ═══════════════════════════════════════ */
const generateGeminiContent = async (prompt) => {
  const apiKey = "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i <= delays.length; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      if (i === delays.length) throw new Error("Connection interrupted.");
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
};

/* ═══════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════ */
const smoothEase = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: smoothEase } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEase } },
};

const fadeLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: smoothEase } },
};

const fadeRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: smoothEase } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: smoothEase } },
};

/* ═══════════════════════════════════════
   Hooks
   ═══════════════════════════════════════ */
function useInView(ref, { once = true, margin = '0px' } = {}) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Immediately visible check
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      setIsInView(true);
      if (once) return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin]);
  return isInView;
}

function useCardGlow(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, [ref]);
}

/* ═══════════════════════════════════════
   Animated Components
   ═══════════════════════════════════════ */
const MotionReveal = ({ children, className = '', variants = fadeUp, delay = 0, once = true }) => {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once, margin: '-50px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={isVisible ? 'animate' : 'initial'}
      variants={{
        ...variants,
        animate: {
          ...variants.animate,
          transition: { ...variants.animate.transition, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const StaggerReveal = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-30px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={isVisible ? 'animate' : 'initial'}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
};

// Wrapper that replaces framer-motion's whileInView with our custom useInView
const InViewMotion = ({ children, as = 'div', initial, inView, transition, style, className, ...rest }) => {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: true, margin: '-30px 0px' });
  const Component = motion[as] || motion.div;
  return (
    <Component ref={ref} className={className} style={style} initial={initial} animate={isVisible ? inView : initial} transition={transition} {...rest}>
      {children}
    </Component>
  );
};

const GoldDot = ({ className = '' }) => (
  <div className={`w-1.5 h-1.5 rounded-full ${className}`} style={{ backgroundColor: '#c9a84c' }} />
);

const SectionLabel = ({ children, className = '' }) => (
  <div className={`flex items-center gap-3 mb-8 ${className}`}>
    <GoldDot />
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-midnight-400 dark:text-midnight-500">
      {children}
    </span>
    <InViewMotion
      className="flex-1 h-px bg-midnight-200 dark:bg-midnight-800"
      initial={{ scaleX: 0 }}
      inView={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
      style={{ transformOrigin: 'left' }}
    />
  </div>
);

/* ═══════════════════════════════════════
   Scroll Progress Bar
   ═══════════════════════════════════════ */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[60]"
      style={{ width: `${progress * 100}%`, backgroundColor: '#c9a84c', transition: 'width 0.1s linear' }}
    />
  );
};

/* ═══════════════════════════════════════
   3D Tilt Card
   ═══════════════════════════════════════ */
const TiltCard = ({ children, className = '', ...props }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -8, rotateY: x * 8 });
  }, []);

  const resetMouse = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  useCardGlow(ref);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   About View
   ═══════════════════════════════════════ */
const AboutView = () => {
  return (
    <motion.div className="space-y-24" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ── Hero ── */}
      <section className="relative pt-8 md:pt-16 pb-8">
        {/* Faded Korean name background element */}
        <motion.div
          className="absolute top-0 right-0 select-none pointer-events-none text-[140px] md:text-[200px] font-display font-extrabold leading-none tracking-tighter text-midnight-900 dark:text-white"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 0.03, x: 0 }}
          transition={{ duration: 1.2, ease: smoothEase }}
        >
          정우성
        </motion.div>

        <StaggerReveal>
          <motion.p variants={fadeUp} className="font-mono text-[12px] tracking-[0.25em] uppercase mb-6" style={{ color: '#c9a84c' }}>
            Electronic Engineer  · Manchester, UK
          </motion.p>

          <motion.h1 variants={fadeUp} className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-midnight-900 dark:text-white mb-8">
            Bridging{' '}
            <motion.span
              style={{ color: '#c9a84c' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >hardware</motion.span>
            <br className="hidden sm:block" />
            {' '}architecture &{' '}
            <motion.span
              style={{ color: '#7c6df0' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >software</motion.span> logic.
          </motion.h1>

          <motion.div variants={fadeUp} className="max-w-2xl space-y-5 text-[16px] leading-relaxed text-midnight-500 dark:text-midnight-400">
            <p>
              I am a final-year Electronic Engineering student at the University of Manchester, expecting a First-Class (80%) degree.
            </p>
            <p>
              My engineering philosophy is rooted in full-stack physical systems. Whether it is minimizing nanosecond propagation delays in CMOS logic, or orchestrating 12-servo robotic kinematics via ROS 2, I build systems that are robust from the silicon to the high-level control software.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-10">
            <Link to="/project">
              <motion.span
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#08080c] font-body font-semibold text-sm transition-all duration-300"
                whileHover={{ scale: 1.03, backgroundColor: '#e4c76a' }}
                whileTap={{ scale: 0.97 }}
              >
                View Projects
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Link>
            <Link to="/contact">
              <motion.span
                className="group inline-flex items-center gap-2 px-6 py-3 border border-midnight-200 dark:border-midnight-700 text-midnight-600 dark:text-midnight-400 font-body text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] dark:hover:border-[#c9a84c] dark:hover:text-[#c9a84c] transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get in Touch
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.span>
            </Link>
          </motion.div>
        </StaggerReveal>
      </section>

      {/* ── Gold divider ── */}
      <InViewMotion
        className="gold-line w-full"
        initial={{ scaleX: 0 }}
        inView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: smoothEase }}
        style={{ transformOrigin: 'center' }}
      />

      {/* ── Skills ── */}
      <section>
        <MotionReveal>
          <SectionLabel>Technical Stack</SectionLabel>
        </MotionReveal>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: CircuitBoard,
              label: 'hardware & eda',
              items: ['Altium', 'Solidworks', 'Tanner EDA', 'LT Spice', 'Xilinx', 'NI Multisim', 'STM32 Nucleo', 'Raspberry Pi']
            },
            {
              icon: Terminal,
              label: 'software & control',
              items: ['C / C++', 'Python', 'Assembly', 'VHDL', 'ROS 2', 'Matlab / Simulink', 'JavaScript / React']
            },
            {
              icon: Wrench,
              label: 'frameworks & tools',
              items: ['Gazebo', 'Docker', 'Git', 'Firebase', 'ns-3', 'SUMO', 'Linux / Ubuntu']
            },
          ].map((group, gi) => (
            <motion.div key={gi} variants={fadeUp}>
              <TiltCard className="p-6 border border-midnight-200 dark:border-midnight-800 bg-white/50 dark:bg-midnight-900/50 hover:border-gold/40 dark:hover:border-gold/30 transition-colors duration-500 card-hover">
                <div className="flex items-center gap-2.5 mb-5">
                  <group.icon size={14} style={{ color: '#c9a84c' }} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-midnight-400 dark:text-midnight-500">
                    {group.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((s, si) => (
                    <motion.span
                      key={s}
                      className="px-2.5 py-1 text-[12px] font-mono text-midnight-600 dark:text-midnight-400 border border-midnight-100 dark:border-midnight-800 bg-midnight-50 dark:bg-midnight-800/50 hover:border-gold/50 hover:text-gold dark:hover:border-gold/40 dark:hover:text-gold transition-all duration-300 cursor-default"
                      variants={{
                        initial: { opacity: 0, scale: 0.8 },
                        animate: { opacity: 1, scale: 1, transition: { delay: gi * 0.15 + si * 0.04, duration: 0.3 } },
                      }}
                      whileHover={{ scale: 1.08, y: -2 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </StaggerReveal>
      </section>

      {/* ── Operational History ── */}
      <section>
        <MotionReveal>
          <SectionLabel>Operational History</SectionLabel>
        </MotionReveal>

        <div className="relative ml-4 md:ml-8">
          {/* Vertical timeline line */}
          <InViewMotion
            className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-violet to-gold/20"
            initial={{ scaleY: 0 }}
            inView={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: smoothEase }}
            style={{ transformOrigin: 'top' }}
          />

          {[
            {
              color: 'gold',
              title: 'Republic of Korea Airforce',
              sub: 'Avionics Maintenance Team · Sep 2022 – Jun 2024',
              items: [
                <>Supported avionics maintenance in a 35-person unit; coordinated tasks and standardized fault checklists and ESD handling at benches.</>,
                <>Led procedural optimizations that <span className="text-gold font-medium">reduced average troubleshooting time by 15%</span>.</>,
                <>Mentored 16 recruits over 6 months with weekly on-the-job training sessions.</>
              ]
            },
            {
              color: 'violet',
              title: 'The University of Manchester',
              sub: 'BEng Electronic Engineering · 2021 – Present',
              items: [
                <>First-Class (80%) expected. Key modules: <span className="text-violet dark:text-violet-bright font-medium">Microcontroller Engineering</span>, <span className="text-violet dark:text-violet-bright font-medium">VLSI Design</span>, Control Systems.</>,
                <>Specializing in the intersection of Robotics and VLSI Design with hands-on lab experience in FPGA synthesis, analog IC layout, and embedded firmware.</>
              ]
            },
            {
              color: 'gold',
              title: 'Hack-A-Bot 2025',
              badge: '3RD PLACE',
              sub: 'Robosoc, University of Manchester · Mar 2025',
              items: [
                <>Developed a <span className="text-gold font-medium">real-time hand-raise detection system</span> using a Raspberry Pi 5 with a Sony AI camera.</>,
                <>Designed a custom CAD mount and integrated computer vision pipeline to gauge student classroom engagement.</>
              ]
            }
          ].map((entry, i) => (
            <MotionReveal key={i} variants={i % 2 === 0 ? fadeLeft : fadeRight} delay={i * 0.15}>
              <div className="relative pl-10 pb-12 group">
                {/* Dot on timeline */}
                <motion.div
                  className={`absolute left-[-5px] top-1.5 w-[10px] h-[10px] rounded-full border-2 transition-all duration-300 ${
                    entry.color === 'gold'
                      ? 'border-gold bg-white dark:bg-midnight-950 group-hover:bg-gold'
                      : 'border-violet bg-white dark:bg-midnight-950 group-hover:bg-violet'
                  }`}
                  variants={{
                    initial: { scale: 0 },
                    animate: { scale: 1, transition: { delay: 0.3 + i * 0.15, type: 'spring', stiffness: 300 } },
                  }}
                />

                <h4 className="text-[16px] font-display font-semibold text-midnight-900 dark:text-white mb-1 group-hover:text-gold dark:group-hover:text-gold transition-colors duration-300">
                  {entry.title}
                  {entry.badge && (
                    <span className="ml-2.5 text-[10px] font-mono font-medium px-2 py-0.5 bg-gold/10 text-gold border border-gold/30">
                      {entry.badge}
                    </span>
                  )}
                </h4>
                <p className="font-mono text-[11px] text-midnight-400 dark:text-midnight-500 mb-4">{entry.sub}</p>

                <ul className="space-y-2.5">
                  {entry.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-[14px] leading-relaxed text-midnight-500 dark:text-midnight-400">
                      <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-midnight-300 dark:bg-midnight-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   Projects View
   ═══════════════════════════════════════ */
const ProjectsView = ({ onDomainExpansion }) => {
  const navigate = useNavigate();
  const { projectSlug } = useParams();
  const projectIdBySlug = {
    vfc_simulation: 'vfc-ns3',
    buggy: 'buggy',
    hackabot_2025: 'hackabot-2025',
    hackabot_2026: 'hackabot-2026',
  };
  const slugByProjectId = {
    'vfc-ns3': 'VFC_Simulation',
    buggy: 'Buggy',
    'hackabot-2025': 'Hackabot_2025',
    'hackabot-2026': 'Hackabot_2026',
  };
  const routeProjectId = projectSlug ? projectIdBySlug[projectSlug.toLowerCase()] ?? null : null;
  const [activeProjectId, setActiveProjectId] = useState(routeProjectId);

  useEffect(() => {
    setActiveProjectId(routeProjectId);
  }, [routeProjectId]);

  const openProject = (projectId) => {
    const slug = slugByProjectId[projectId];
    if (slug) {
      // Trigger Domain Expansion for projects with detail pages
      if (onDomainExpansion) {
        onDomainExpansion(projectId, () => {
          navigate(`/project/${slug}`);
        });
      } else {
        navigate(`/project/${slug}`);
      }
      return;
    }
    setActiveProjectId(projectId);
  };

  const backToList = () => navigate('/project');

  const projects = [
    {
      id: 'vfc-ns3',
      title: '5G VFC Architecture Simulation',
      tag: 'FYP',
      category: 'Research / Networks',
      accent: 'violet',
      desc: 'Comparing VFN (bus-mounted) vs CFN (roadside) fog computing over 5G NR at 28 GHz using ns-3.46 + 5G-LENA. Full PHY/MAC simulation across 50–150 vehicle densities in Manchester city traffic.',
      year: 'FYP'
    },
    {
      id: 'hackabot-2026',
      title: 'GridBox — Smart Factory Controller',
      category: 'Hackathon / IoT',
      accent: 'gold',
      desc: 'A £15 smart factory controller with dual Raspberry Pi Pico 2, wireless SCADA, and autonomous fault detection — built in 24 hours at Hack-A-Bot 2026.',
      year: '2026'
    },
    {
      id: 'baby-spyder',
      title: 'Baby Spyder Robot',
      category: 'Robotics',
      accent: 'violet',
      desc: 'Developing a ROS 2 control stack for a 12-servo quadruped robot, utilizing torque calculations for joint stability and Gazebo simulation for physical validation.',
      year: '2025'
    },
    {
      id: 'hackabot-2025',
      title: 'AI Classroom Camera',
      tag: '3rd Place',
      category: 'Hackathon / CV',
      accent: 'gold',
      desc: 'Real-time attendance tracking and engagement monitoring via on-device PoseNet inference on a Raspberry Pi AI Camera — 3rd place at Hack-A-Bot 2025.',
      year: '2025'
    },
    {
      id: 'vlsi-cell',
      title: 'VLSI Logic Cell Optimization',
      category: 'VLSI Design',
      accent: 'violet',
      desc: 'Designed a fast-switching CMOS logic cell securing a worst-case delay of 0.553 ns via transistor optimization and Tanner EDA LT spice simulations.',
      year: '2025'
    },
    {
      id: 'buggy',
      title: 'Autonomous Line-Following Buggy',
      tag: 'Best Looking',
      category: 'Embedded Systems',
      accent: 'gold',
      desc: 'Engineered an STM32-based feedback control system via C++, increasing line detection accuracy to 76% and optimizing motor response for high-speed track navigation.',
      year: '2024'
    },
  ];

  /* Detail page renders */
  if (activeProjectId === 'vfc-ns3') return <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><FYPDetail backToList={backToList} /></motion.div>;
  if (activeProjectId === 'hackabot-2026') return <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><HackABot2026Detail backToList={backToList} /></motion.div>;
  if (activeProjectId === 'hackabot-2025') return <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><HackABot2025Detail backToList={backToList} /></motion.div>;
  if (activeProjectId === 'buggy') return <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><BuggyDetail backToList={backToList} /></motion.div>;

  /* Project list */
  return (
    <motion.div className="space-y-12" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <MotionReveal>
        <div className="mb-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-midnight-900 dark:text-white mb-3">
            Projects
          </h2>
          <p className="text-midnight-500 dark:text-midnight-400 text-[15px] max-w-2xl">
            A selection of research and hardware projects executed during my degree, spanning VLSI logic, embedded firmware, and network simulations.
          </p>
        </div>
      </MotionReveal>

      <StaggerReveal className="space-y-3">
        {projects.map((proj, idx) => (
          <motion.div key={proj.id} variants={fadeUp}>
            <ProjectCard project={proj} onClick={() => openProject(proj.id)} index={idx} />
          </motion.div>
        ))}
      </StaggerReveal>
    </motion.div>
  );
};

const ProjectCard = ({ project: proj, onClick, index }) => {
  const cardRef = useRef(null);
  const hasDetail = ['vfc-ns3', 'buggy', 'hackabot-2026', 'hackabot-2025'].includes(proj.id);
  const accentBorder = proj.accent === 'gold' ? 'group-hover:border-l-gold' : 'group-hover:border-l-violet';

  return (
    <TiltCard
      className={`group cursor-pointer border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/60 hover:border-midnight-300 dark:hover:border-midnight-700 transition-all duration-400 card-hover border-l-2 border-l-transparent ${accentBorder}`}
      onClick={onClick}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-stretch">
        {/* Year */}
        <div className="flex flex-col items-center justify-center w-20 md:w-24 shrink-0 border-r border-midnight-100 dark:border-midnight-800">
          <span className="text-2xl md:text-3xl font-display font-light text-midnight-300 dark:text-midnight-700 tracking-tighter select-none group-hover:text-gold dark:group-hover:text-gold transition-colors duration-300">
            {proj.year}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
            <h3 className="text-[16px] font-display font-semibold text-midnight-900 dark:text-white group-hover:text-gold dark:group-hover:text-gold transition-colors duration-300 flex items-center gap-2.5">
              {proj.title}
              {proj.tag && (
                <span className={`text-[10px] font-mono font-medium px-2 py-0.5 ${
                  proj.accent === 'gold'
                    ? 'bg-gold/10 text-gold border border-gold/25'
                    : 'bg-violet/10 text-violet border border-violet/25'
                }`}>
                  {proj.tag}
                </span>
              )}
            </h3>
            <span className="text-[11px] uppercase tracking-[0.15em] text-midnight-400 dark:text-midnight-500 font-mono shrink-0">
              {proj.category}
            </span>
          </div>
          <p className="text-midnight-500 dark:text-midnight-400 leading-relaxed text-[14px] max-w-2xl">
            {proj.desc}
          </p>

          {hasDetail && (
            <motion.div
              className="mt-4 text-[13px] font-medium text-midnight-900 dark:text-midnight-300 flex items-center gap-2"
              variants={{
                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0, transition: { delay: 0.2 } },
              }}
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                View details
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </TiltCard>
  );
};

/* ═══════════════════════════════════════
   Buggy Detail (inline — preserved from ver1 with new styling)
   ═══════════════════════════════════════ */
const BuggyDetail = ({ backToList }) => (
  <div className="space-y-10 max-w-4xl pb-12">
    <MotionReveal>
      <button onClick={backToList} className="flex items-center gap-2 text-midnight-400 hover:text-gold transition-colors mb-4 group font-medium text-sm">
        <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
        Back to List
      </button>
    </MotionReveal>

    <MotionReveal delay={0.1}>
      <div className="border-b border-midnight-200 dark:border-midnight-800 pb-8">
        <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-midnight-900 dark:text-white mb-4">
          Autonomous Line-Following Buggy
        </h2>
        <p className="text-[15px] text-midnight-500 dark:text-midnight-400">
          Embedded Systems Project · University of Manchester · Group 23
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 border border-gold/25 text-gold text-xs font-medium">
            <span>★</span> Best Looking Buggy Award
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet/10 border border-violet/25 text-violet text-xs font-medium">
            84% — First Class Honours
          </span>
        </div>
      </div>
    </MotionReveal>

    <MotionReveal delay={0.2}>
      <div className="overflow-hidden border border-midnight-200 dark:border-midnight-800">
        <img src="/images/buggy/hero.jpg" alt="Autonomous line-following buggy" className="w-full h-auto object-cover" />
        <p className="text-[12px] text-midnight-400 dark:text-midnight-500 px-4 py-2.5 bg-midnight-50 dark:bg-midnight-900">
          The completed buggy at the final race — acetyl chassis with front sensor array, rear drive wheels, and STM32 controller on top.
        </p>
      </div>
    </MotionReveal>

    <div className="text-[15px] text-midnight-600 dark:text-midnight-400 space-y-10 leading-relaxed">

      {/* 1. Overview */}
      <MotionReveal>
        <section>
          <h3 className="text-lg font-display font-semibold text-midnight-900 dark:text-white mb-4 flex items-center gap-2.5">
            <GoldDot /> 1. Overview
          </h3>
          <p>An autonomous, high-speed line-following robot designed for warehouse logistics — engineered to prioritise <strong className="font-semibold text-midnight-900 dark:text-white">speed and stability</strong> over raw torque. The buggy uses a custom multi-layer acetyl chassis, BLE-tunable PID control, and a front-mounted infrared sensor array to navigate a complex racetrack with straights, curves, and an 18° incline.</p>

          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              ['2,555', 'Lines of C++'],
              ['5', 'IR Sensors'],
              ['48 MHz', 'STM32 Clock'],
              ['84%', 'First Class'],
            ].map(([val, label], i) => (
              <motion.div key={label} variants={scaleIn} className="p-3 border border-midnight-200 dark:border-midnight-800 bg-midnight-50 dark:bg-midnight-900/50 text-center">
                <div className="font-display font-bold text-lg text-midnight-900 dark:text-white">{val}</div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-midnight-400 dark:text-midnight-500 mt-1">{label}</div>
              </motion.div>
            ))}
          </StaggerReveal>
        </section>
      </MotionReveal>

      {/* 2. Chassis Design */}
      <MotionReveal>
        <section>
          <h3 className="text-lg font-display font-semibold text-midnight-900 dark:text-white mb-4 flex items-center gap-2.5">
            <GoldDot /> 2. Chassis Design
          </h3>
          <p>A <strong className="font-semibold text-midnight-900 dark:text-white">multi-layer sandwich architecture</strong> was laser-cut from 3 mm acetyl sheets. The narrow-wheelbase layout minimises moment of inertia during tight turns while keeping the centre of mass directly above the rear driven axle.</p>
          <ul className="mt-4 space-y-2">
            {[
              'Three stacked layers: base (motors + battery), mid (STM32 + H-bridge), top (sensor breakout + BLE module).',
              'Front-mounted sensor bar extends 45 mm beyond chassis to improve curve look-ahead.',
              'Awarded "Best Looking Buggy" for the layered clear-acetyl aesthetic.',
            ].map((txt, i) => (
              <li key={i} className="flex gap-3 text-[14px]">
                <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-midnight-300 dark:bg-midnight-600" />
                <span>{txt}</span>
              </li>
            ))}
          </ul>
        </section>
      </MotionReveal>

      {/* 3. Sensor Array */}
      <MotionReveal>
        <section>
          <h3 className="text-lg font-display font-semibold text-midnight-900 dark:text-white mb-4 flex items-center gap-2.5">
            <GoldDot /> 3. Sensor Array & Data Collection
          </h3>
          <p>Five <strong className="font-semibold text-midnight-900 dark:text-white">TCRT5000L IR sensors</strong> spaced at 10 mm intervals form the detection bar. Each sensor outputs a 0–3.3 V analogue signal proportional to reflectivity — high on white track, low on black tape.</p>
          <div className="mt-6 space-y-6">
            <div className="border border-midnight-200 dark:border-midnight-800 bg-midnight-50 dark:bg-midnight-900/50 p-4">
              <h4 className="font-mono text-[12px] uppercase tracking-widest text-midnight-400 dark:text-midnight-500 mb-4">Ambient Light Sensitivity</h4>
              <AmbientLightChart />
            </div>
            <div className="border border-midnight-200 dark:border-midnight-800 bg-midnight-50 dark:bg-midnight-900/50 p-4">
              <h4 className="font-mono text-[12px] uppercase tracking-widest text-midnight-400 dark:text-midnight-500 mb-4">Sensor Spread (TCRT5000L)</h4>
              <TCRT5000LSpreadChart />
            </div>
            <div className="border border-midnight-200 dark:border-midnight-800 bg-midnight-50 dark:bg-midnight-900/50 p-4">
              <h4 className="font-mono text-[12px] uppercase tracking-widest text-midnight-400 dark:text-midnight-500 mb-4">All Sensors — Comparative Spread</h4>
              <AllSensorsSpreadChart />
            </div>
          </div>
        </section>
      </MotionReveal>

      {/* 4. PID Control */}
      <MotionReveal>
        <section>
          <h3 className="text-lg font-display font-semibold text-midnight-900 dark:text-white mb-4 flex items-center gap-2.5">
            <GoldDot /> 4. PID Control System
          </h3>
          <p>A <strong className="font-semibold text-midnight-900 dark:text-white">weighted-average algorithm</strong> converts the five sensor readings into a single error value (–2 to +2). A PID loop then maps this error to differential motor duty cycles via two PWM channels on the STM32 Timer 1 peripheral.</p>
          <div className="mt-4 p-4 border border-gold/20 bg-gold/5 dark:bg-gold/5">
            <p className="font-mono text-[13px] text-midnight-600 dark:text-midnight-400">
              <span className="text-gold font-medium">PID output</span> = Kp·e(t) + Ki·∫e(τ)dτ + Kd·de/dt
            </p>
            <p className="mt-2 text-[13px]">Tuned via Bluetooth Low Energy — coefficients adjustable in real time without reflashing.</p>
          </div>
        </section>
      </MotionReveal>

      {/* 5. Results */}
      <MotionReveal>
        <section>
          <h3 className="text-lg font-display font-semibold text-midnight-900 dark:text-white mb-4 flex items-center gap-2.5">
            <GoldDot /> 5. Results & Performance
          </h3>
          <p>The buggy achieved a <strong className="font-semibold text-midnight-900 dark:text-white">76% line-detection accuracy</strong> across varying ambient light conditions. Race-day performance was strong on flat sections; the 18° incline caused minor oscillation due to reduced rear traction.</p>
          <ul className="mt-4 space-y-2">
            {[
              'Flat-surface lap time: consistent within ±0.3 s over 10 trials.',
              'BLE tuning reduced PID convergence time by ~40% vs manual reflash.',
              'Overall grade: 84% (First Class), "Best Looking Buggy" award.',
            ].map((txt, i) => (
              <li key={i} className="flex gap-3 text-[14px]">
                <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-midnight-300 dark:bg-midnight-600" />
                <span>{txt}</span>
              </li>
            ))}
          </ul>
        </section>
      </MotionReveal>

      {/* 6. Reflections */}
      <MotionReveal>
        <section>
          <h3 className="text-lg font-display font-semibold text-midnight-900 dark:text-white mb-4 flex items-center gap-2.5">
            <GoldDot /> 6. Reflections & Future Work
          </h3>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={fadeUp} className="p-4 border border-gold/20 bg-gold/5">
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">What went well</h4>
              <ul className="space-y-1.5 text-[13px]">
                <li>• BLE real-time tuning workflow saved hours of iteration</li>
                <li>• Multi-layer chassis gave clean cable routing and modularity</li>
                <li>• Weighted-average sensor fusion was robust to partial occlusion</li>
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="p-4 border border-violet/20 bg-violet/5">
              <h4 className="font-mono text-[11px] uppercase tracking-widest text-violet mb-2">Improvements</h4>
              <ul className="space-y-1.5 text-[13px]">
                <li>• Add gyroscope/accelerometer for incline detection</li>
                <li>• Implement predictive steering using sensor history buffer</li>
                <li>• Switch to encoder-based speed control for tighter loops</li>
              </ul>
            </motion.div>
          </StaggerReveal>
        </section>
      </MotionReveal>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Life View
   ═══════════════════════════════════════ */
const LifeView = ({ user }) => {
  const [curation, setCuration] = useState('');
  const [isCurating, setIsCurating] = useState(false);
  const [error, setError] = useState('');

  const interests = [
    { icon: Shirt, title: 'Fashion & Aesthetic', desc: 'Appreciating the architecture of clothing. Favoring minimalist, functional, and well-constructed garments over fast trends.' },
    { icon: Coffee, title: 'Gastronomy', desc: 'Exploring culinary arts. Whether it is finding the perfect espresso pull or experimenting with global recipes in my own kitchen.' },
  ];

  const handleCurate = async () => {
    setIsCurating(true); setError('');
    try {
      const prompt = "Act as an elegant, minimalist curator. Based on a blend of modern fashion, ambient/indie music, and specialty coffee, generate a 3-sentence 'vibe' for today. Structure it loosely as 'Listen to X. Wear Y. Drink Z.' Keep it sophisticated, clean, and inspiring. Do not use asterisks or markdown formatting.";
      const result = await generateGeminiContent(prompt);
      setCuration(result);
    } catch (err) { setError(err.message); }
    finally { setIsCurating(false); }
  };

  return (
    <motion.div className="space-y-16" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <MotionReveal>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-midnight-900 dark:text-white mb-3">
          Life Beyond the Screen
        </h2>
        <p className="text-midnight-500 dark:text-midnight-400 text-[15px] max-w-2xl">
          The inputs that fuel my outputs. A collection of offline pursuits that influence my digital work.
        </p>
      </MotionReveal>

      {/* Daily Curation */}
      <MotionReveal>
        <TiltCard className="p-8 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/60 card-hover relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px gold-line" />
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="max-w-xl">
              <h3 className="text-lg font-display font-semibold text-midnight-900 dark:text-white mb-2 flex items-center gap-2">
                <Zap size={16} className="text-gold" /> Daily Curation
              </h3>
              {isCurating ? (
                <div className="flex items-center gap-3 text-sm text-midnight-400"><Loader2 size={16} className="animate-spin" /> Fetching today's aesthetic...</div>
              ) : curation ? (
                <p className="text-[14px] text-midnight-600 dark:text-midnight-300 leading-relaxed">{curation}</p>
              ) : error ? (
                <p className="text-[14px] text-red-500">{error}</p>
              ) : (
                <p className="text-[14px] text-midnight-400">Generate a unique blend of music, fashion, and coffee recommendations for today's focus session.</p>
              )}
            </div>
            <motion.button
              onClick={handleCurate} disabled={isCurating}
              className="shrink-0 px-5 py-2.5 bg-[#0f0f15] dark:bg-[#e8e6e3] text-white dark:text-[#08080c] text-sm font-medium hover:bg-gold dark:hover:bg-gold dark:hover:text-midnight-950 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {curation ? "Recurate" : "Generate"}
            </motion.button>
          </div>
        </TiltCard>
      </MotionReveal>

      {/* Interest cards */}
      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interests.map((item, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <TiltCard className="p-8 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/60 group hover:border-gold/40 dark:hover:border-gold/30 transition-all duration-500 card-hover">
              <motion.div
                className="w-10 h-10 rounded-full bg-midnight-50 dark:bg-midnight-800 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors duration-300"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <item.icon size={18} className="text-midnight-600 dark:text-midnight-300 group-hover:text-gold transition-colors duration-300" />
              </motion.div>
              <h3 className="font-display text-lg font-semibold text-midnight-900 dark:text-white mb-3 group-hover:text-gold transition-colors duration-300">{item.title}</h3>
              <p className="text-[14px] text-midnight-500 dark:text-midnight-400 leading-relaxed">{item.desc}</p>
            </TiltCard>
          </motion.div>
        ))}
      </StaggerReveal>

      {/* WSJ Record Portal */}
      <MotionReveal>
        <motion.div
          className="group relative overflow-hidden bg-midnight-950 text-white p-8 sm:p-12 cursor-pointer border border-midnight-800 hover:border-gold/30 transition-all duration-500"
          onClick={() => window.location.href = '/record'}
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-midnight-900 via-midnight-950 to-black z-0" />
          <motion.div
            className="absolute -right-12 -bottom-12 z-0 opacity-5"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Disc size={250} />
          </motion.div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="max-w-lg">
              <span className="font-mono text-gold text-[11px] uppercase tracking-[0.2em] mb-3 block">Interactive Experience</span>
              <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                WSJ Record <Disc className="text-gold animate-spin-slow" size={28} />
              </h3>
              <p className="text-midnight-400 leading-relaxed text-[15px]">
                Dive into my highly curated sonic landscape. A deeply personalized playback experience designed for deep work and aesthetic flow.
              </p>
            </div>
            <motion.button
              className="shrink-0 flex items-center gap-2 bg-gold text-midnight-950 px-6 py-3 font-display font-semibold hover:bg-gold-bright transition-all text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open Player <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </MotionReveal>
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   Contact View
   ═══════════════════════════════════════ */
const ContactView = () => {
  const [intent, setIntent] = useState('collaboration');
  const [draft, setDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const handleDraft = async () => {
    setIsDrafting(true);
    try {
      const prompt = `Write a short, professional, and slightly witty email draft to 'First Last' from a visitor of their minimalist portfolio website. The visitor's intent is: ${intent}. Keep it concise (under 4 sentences), modern, and clean. Do not include a subject line. Do not include placeholders for my name, just write the body. Do not use asterisks or markdown formatting.`;
      const result = await generateGeminiContent(prompt);
      setDraft(result);
    } catch (err) { setDraft("System error: Unable to connect to the drafting module."); }
    finally { setIsDrafting(false); }
  };

  return (
    <motion.div className="space-y-16 max-w-3xl" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <MotionReveal>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-midnight-900 dark:text-white mb-4">
          Let's Connect
        </h2>
        <p className="text-midnight-500 dark:text-midnight-400 text-[16px] max-w-2xl leading-relaxed">
          Whether you want to discuss a new software architecture, share a Spotify playlist, or debate the best local coffee roaster — my inbox is open.
        </p>
      </MotionReveal>

      {/* AI Drafter */}
      <MotionReveal>
        <TiltCard className="p-6 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/60 card-hover">
          <h3 className="font-display font-semibold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <Terminal size={16} className="text-gold" /> AI Icebreaker Drafter
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select value={intent} onChange={(e) => setIntent(e.target.value)}
              className="flex-1 bg-midnight-50 dark:bg-midnight-800 border border-midnight-200 dark:border-midnight-700 p-2.5 text-sm text-midnight-700 dark:text-midnight-200 font-body outline-none focus:border-gold transition-colors">
              <option value="collaboration">Discuss a project collaboration</option>
              <option value="hiring">Discuss a hiring opportunity</option>
              <option value="coffee/music">Share a music or coffee recommendation</option>
            </select>
            <motion.button
              onClick={handleDraft} disabled={isDrafting}
              className="px-5 py-2.5 bg-[#0f0f15] dark:bg-[#e8e6e3] text-white dark:text-[#08080c] text-sm font-medium hover:bg-gold dark:hover:bg-gold dark:hover:text-midnight-950 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDrafting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Draft Email"}
            </motion.button>
          </div>
          <AnimatePresence>
            {draft && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="mt-4 p-4 bg-midnight-50 dark:bg-midnight-800 border border-midnight-100 dark:border-midnight-700 text-[14px] text-midnight-600 dark:text-midnight-300 leading-relaxed relative group overflow-hidden"
              >
                {draft}
                <button onClick={() => navigator.clipboard.writeText(draft)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[11px] font-mono bg-midnight-200 dark:bg-midnight-700 px-3 py-1 text-midnight-600 dark:text-midnight-300 transition-opacity hover:bg-gold/20 hover:text-gold">
                  Copy
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </TiltCard>
      </MotionReveal>

      {/* Contact cards */}
      <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Mail, title: 'Email', sub: 'wooseongjung12@gmail.com', href: 'mailto:wooseongjung12@gmail.com', external: false },
          { icon: Linkedin, title: 'LinkedIn', sub: 'Network & resume', href: 'https://www.linkedin.com/in/wooseong-jung-21b143223/', external: true },
          { icon: Github, title: 'GitHub', sub: 'Code repositories', href: 'https://github.com/wooseongjung', external: true },
        ].map((card, i) => (
          <motion.div key={i} variants={fadeUp}>
            <motion.a
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noreferrer' : undefined}
              className="flex flex-col gap-4 p-6 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-midnight-900/60 hover:border-gold/50 dark:hover:border-gold/40 transition-all duration-300 group card-hover"
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <motion.div whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}>
                <card.icon size={22} className="text-midnight-400 group-hover:text-gold transition-colors duration-300" />
              </motion.div>
              <div className="mt-2">
                <h3 className="font-display font-semibold text-midnight-900 dark:text-white">{card.title}</h3>
                <span className="text-[12px] text-midnight-400 break-words">{card.sub}</span>
              </div>
              <ArrowUpRight size={14} className="text-midnight-300 dark:text-midnight-600 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-auto" />
            </motion.a>
          </motion.div>
        ))}
      </StaggerReveal>
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   Animated Page Wrapper
   ═══════════════════════════════════════ */
const AnimatedPage = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: smoothEase }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════
   Layout Shell
   ═══════════════════════════════════════ */
const StandardLayout = ({ user, onDomainExpansion }) => {
  const location = useLocation();

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16 relative z-10">
      <main className="min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: smoothEase }}
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/about" replace />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/project" element={<ProjectsView onDomainExpansion={onDomainExpansion} />} />
              <Route path="/project/:projectSlug" element={<ProjectsView onDomainExpansion={onDomainExpansion} />} />
              <Route path="/life" element={<LifeView user={user} />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="*" element={<Navigate to="/about" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <MotionReveal>
        <footer className="mt-24 pt-8 border-t border-midnight-200 dark:border-midnight-800">
          <div className="flex flex-col md:flex-row items-center justify-between text-midnight-400 dark:text-midnight-500 gap-4 pb-12">
            <div className="flex items-center gap-3">
              <GoldDot className="animate-pulse-gold" />
              <span className="font-mono text-[11px] tracking-widest uppercase">System.Online</span>
            </div>

            <Link to="/contact">
              <motion.span
                className="group inline-flex items-center gap-2 px-5 py-2 border border-midnight-200 dark:border-midnight-800 hover:border-gold dark:hover:border-gold text-midnight-600 dark:text-midnight-400 hover:text-gold dark:hover:text-gold transition-all duration-300 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in touch
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Link>

            <span className="font-mono text-[11px]">&copy; {new Date().getFullYear()} Wooseong Jung</span>
          </div>
        </footer>
      </MotionReveal>
    </div>
  );
};

/* ═══════════════════════════════════════
   Main App
   ═══════════════════════════════════════ */
export default function App() {
  const location = useLocation();
  const activePath = location.pathname.split('/')[1] || 'about';
  const activeTab = activePath === 'project' ? 'project' : (activePath === 'contact' ? 'contact' : ((activePath === 'life' || activePath === 'record') ? 'life' : 'about'));

  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true; // dark-first
  });

  // Domain Expansion state
  const [domainExpansion, setDomainExpansion] = useState({ active: false, projectId: null, callback: null });

  const handleDomainExpansion = useCallback((projectId, callback) => {
    setDomainExpansion({ active: true, projectId, callback });
  }, []);

  const handleDomainComplete = useCallback(() => {
    const cb = domainExpansion.callback;
    setDomainExpansion({ active: false, projectId: null, callback: null });
    if (cb) cb();
  }, [domainExpansion.callback]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (user) { await signOut(auth); } else { await signInWithPopup(auth, provider); }
  };

  const navItems = [
    { id: 'about', label: 'About', path: '/about' },
    { id: 'project', label: 'Projects', path: '/project' },
    { id: 'life', label: 'Life', path: '/life' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const isRecord = activePath === 'record';

  return (
    <div className="min-h-screen relative noise-overlay">
      {/* Scroll Progress Bar */}
      {!isRecord && <ScrollProgress />}

      {/* Circuit Background Animation */}
      {!isRecord && <CircuitBackground />}

      {/* Dot matrix background */}
      {!isRecord && <div className="bg-dots fixed inset-0 pointer-events-none z-0" />}

      {/* Domain Expansion Overlay */}
      <DomainExpansion
        projectId={domainExpansion.projectId}
        isActive={domainExpansion.active}
        onComplete={handleDomainComplete}
      />

      {/* ── Header ── */}
      {!isRecord && (
        <motion.header
          className="sticky top-0 z-50 backdrop-blur-xl bg-[#f5f4f0]/80 dark:bg-[#08080c]/80 border-b border-midnight-200 dark:border-midnight-800"
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: smoothEase }}
        >
          <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link to="/about" className="flex items-center gap-3 shrink-0 group">
              <motion.div
                className="w-7 h-7 flex items-center justify-center transition-colors duration-300"
                style={{ border: '1px solid rgba(201,168,76,0.5)' }}
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Zap size={13} style={{ color: '#c9a84c' }} />
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <h1 className="font-display text-[15px] font-bold tracking-tight text-midnight-900 dark:text-white leading-none">
                  Wooseong Jung
                </h1>
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-midnight-400 dark:text-midnight-500 mt-0.5">
                  Electronic Engineer
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 relative">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`relative px-4 py-2 text-[13px] font-body transition-all duration-300 ${
                    activeTab === item.id
                      ? 'text-midnight-900 dark:text-white font-medium'
                      : 'text-midnight-400 dark:text-midnight-500 hover:text-midnight-700 dark:hover:text-midnight-300'
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px"
                      style={{ backgroundColor: '#c9a84c' }}
                      layoutId="nav-underline"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Social icons */}
              <div className="hidden lg:flex items-center gap-3">
                {[
                  { href: 'mailto:wooseongjung12@gmail.com', Icon: Mail, external: false },
                  { href: 'https://www.linkedin.com/in/wooseong-jung-21b143223/', Icon: Linkedin, external: true },
                  { href: 'https://github.com/wooseongjung', Icon: Github, external: true },
                ].map(({ href, Icon, external }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    className="text-midnight-400 dark:text-midnight-500 hover:text-gold dark:hover:text-gold transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>

              <div className="hidden lg:block w-px h-4 bg-midnight-200 dark:bg-midnight-800" />

              {/* Auth */}
              {user ? (
                <button onClick={handleLogin} className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 border border-midnight-200 dark:border-midnight-700 text-midnight-400 hover:border-gold hover:text-gold transition-colors" title="Sign Out">
                  <span className="max-w-[100px] truncate">{user.email}</span>
                  <LogOut size={11} />
                </button>
              ) : (
                <button onClick={handleLogin} className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 border border-midnight-200 dark:border-midnight-700 text-midnight-500 hover:border-gold hover:text-gold transition-colors" title="Sign In">
                  Sign In <LogIn size={11} />
                </button>
              )}

              <div className="hidden lg:block w-px h-4 bg-midnight-200 dark:bg-midnight-800" />

              {/* Dark mode toggle */}
              <motion.button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-8 h-8 flex items-center justify-center text-midnight-400 dark:text-midnight-500 hover:text-gold dark:hover:text-gold transition-colors duration-300"
                aria-label="Toggle dark mode"
                whileTap={{ scale: 0.8, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDarkMode ? 'sun' : 'moon'}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Mobile menu */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-8 h-8 flex items-center justify-center text-midnight-600 dark:text-midnight-400"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileMenuOpen ? 'close' : 'menu'}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile nav dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden border-t border-midnight-200 dark:border-midnight-800 bg-[#f5f4f0] dark:bg-[#08080c] px-6 py-4 space-y-1 overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: smoothEase }}
              >
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link to={item.path}
                      className={`block px-3 py-2.5 text-[14px] font-body transition-colors ${
                        activeTab === item.id
                          ? 'text-gold font-medium'
                          : 'text-midnight-500 dark:text-midnight-400'
                      }`}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="flex items-center gap-4 pt-3 border-t border-midnight-200 dark:border-midnight-800 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <a href="mailto:wooseongjung12@gmail.com" className="text-midnight-400 hover:text-gold transition-colors"><Mail size={16} /></a>
                  <a href="https://www.linkedin.com/in/wooseong-jung-21b143223/" target="_blank" rel="noreferrer" className="text-midnight-400 hover:text-gold transition-colors"><Linkedin size={16} /></a>
                  <a href="https://github.com/wooseongjung" target="_blank" rel="noreferrer" className="text-midnight-400 hover:text-gold transition-colors"><Github size={16} /></a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}

      {/* ── Routes ── */}
      <Routes>
        <Route path="/record" element={<MusicPlayer user={user} />} />
        <Route path="*" element={<StandardLayout user={user} onDomainExpansion={handleDomainExpansion} />} />
      </Routes>
    </div>
  );
}
