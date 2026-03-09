import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import MusicPlayer from "./components/MusicPlayer";
import SimulationLab from "./components/SimulationLab";
import { AmbientLightChart, TCRT5000LSpreadChart, AllSensorsSpreadChart } from './components/buggy/SensorCharts';

import {
  User,
  Briefcase,
  Compass,
  Mail,
  Github,
  Linkedin,
  Coffee,
  Shirt,
  Disc,
  Zap,
  Power,
  Cpu,
  LogIn,
  LogOut,
  ArrowRight,
  Loader2,
  Plug
} from 'lucide-react';

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

const injectedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  body {
    background-color: #fafafa;
    color: #18181b;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
    transition: background-color 0.4s ease, color 0.4s ease;
  }

  .bg-minimal-circuit {
    background-image:
      linear-gradient(rgba(228, 228, 231, 0.55) 1px, transparent 1px),
      linear-gradient(90deg, rgba(228, 228, 231, 0.55) 1px, transparent 1px);
    background-size: 60px 60px;
    background-position: center center;
  }

  /* ════════════════════════════════════
     DARK MODE — single source of truth
     ════════════════════════════════════ */

  html.dark body {
    background-color: #0d0d0d;
    color: #e4e4e7;
  }

  /* Page background */
  html.dark .min-h-screen { background-color: #0d0d0d !important; }

  /* Header */
  html.dark header { background-color: rgba(13,13,13,0.92) !important; border-bottom-color: #27272a !important; }

  /* Grid background */
  html.dark .bg-minimal-circuit {
    background-image:
      linear-gradient(rgba(52, 52, 52, 0.5) 1px, transparent 1px),
      linear-gradient(90deg, rgba(52, 52, 52, 0.5) 1px, transparent 1px);
  }

  /* ── Surfaces ── */
  html.dark .bg-white    { background-color: #171717 !important; }
  html.dark .bg-zinc-50  { background-color: #111111 !important; }
  html.dark .bg-zinc-100 { background-color: #1c1c1c !important; }
  html.dark .bg-zinc-200 { background-color: #222222 !important; }

  /* ── Text ── */
  html.dark .text-zinc-900 { color: #f4f4f5 !important; }
  html.dark .text-zinc-800 { color: #e4e4e7 !important; }
  html.dark .text-zinc-700 { color: #d4d4d8 !important; }
  html.dark .text-zinc-600 { color: #a1a1aa !important; }
  html.dark .text-zinc-500 { color: #71717a !important; }
  html.dark .text-zinc-400 { color: #52525b !important; }

  /* ── Borders ── */
  html.dark .border-zinc-200 { border-color: #3f3f46 !important; }
  html.dark .border-zinc-100 { border-color: #27272a !important; }
  html.dark .border-zinc-900 { border-color: #e4e4e7 !important; }

  /* ── Hover overrides ── */
  html.dark .hover\\:bg-zinc-200:hover  { background-color: #27272a !important; }
  html.dark .hover\\:bg-zinc-100:hover  { background-color: #1c1c1c !important; }
  html.dark .hover\\:bg-zinc-800:hover  { background-color: #27272a !important; }
  html.dark .hover\\:border-zinc-900:hover { border-color: #a1a1aa !important; }
  html.dark .hover\\:text-zinc-900:hover   { color: #f4f4f5 !important; }
  html.dark .group:hover .group-hover\\:text-zinc-900  { color: #f4f4f5 !important; }
  html.dark .group:hover .group-hover\\:border-zinc-900 { border-color: #a1a1aa !important; }
  html.dark .group:hover .group-hover\\:text-black     { color: #ffffff !important; }

  /* ── Button fill (Sign In / Generate) ── */
  html.dark .bg-zinc-900 { background-color: #f4f4f5 !important; color: #0d0d0d !important; }
  html.dark .hover\\:bg-zinc-800:hover { background-color: #e4e4e7 !important; }

  /* ── Shadows ── */
  html.dark .shadow-sm   { box-shadow: 0 1px 3px rgba(0,0,0,0.6) !important; }
  html.dark .hover\\:shadow-md:hover  { box-shadow: 0 4px 20px rgba(0,0,0,0.7) !important; }
  html.dark .hover\\:shadow-lg:hover  { box-shadow: 0 8px 30px rgba(0,0,0,0.8) !important; }
  html.dark .hover\\:shadow-xl:hover  { box-shadow: 0 12px 40px rgba(0,0,0,0.9) !important; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #fafafa; }
  ::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
  html.dark ::-webkit-scrollbar-track { background: #0d0d0d; }
  html.dark ::-webkit-scrollbar-thumb { background: #3f3f46; }
  html.dark ::-webkit-scrollbar-thumb:hover { background: #52525b; }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up { animation: fade-up 0.6s ease-out forwards; }
`;

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
      if (i === delays.length) throw new Error("Connection interrupted. The mainframe is currently unreachable.");
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
};

const Node = ({ className = "" }) => (
  <div className={`w-2 h-2 rounded-full border-[1.5px] border-zinc-900 bg-white z-10 ${className}`}></div>
);

const Trace = ({ vertical = false, className = "" }) => (
  <div className={`${vertical ? 'w-[1px] h-full' : 'h-[1px] w-full'} bg-zinc-200 ${className}`}></div>
);

const GroundSymbol = ({ className = "" }) => (
  <div className={`flex flex-col items-center gap-[3px] ${className}`}>
    <div className="w-4 h-[1.5px] bg-zinc-400 dark:bg-zinc-600 transition-colors"></div>
    <div className="w-2.5 h-[1.5px] bg-zinc-400 dark:bg-zinc-600 transition-colors"></div>
    <div className="w-1 h-[1.5px] bg-zinc-400 dark:bg-zinc-600 transition-colors"></div>
  </div>
);

const LightSwitch = ({ isOpen, onToggle, className = "" }) => (
  <button
    onClick={onToggle}
    className={`relative w-[24px] h-[36px] border-[1.5px] border-zinc-900 dark:border-zinc-500 rounded-sm bg-[#fafafa] dark:bg-[#121212] flex flex-col items-center justify-between py-[2px] focus:outline-none transition-colors ${className}`}
    aria-label="Toggle Dark Mode"
  >
    <span className="text-[5px] font-bold text-zinc-900 dark:text-zinc-500 tracking-wider">ON</span>

    <div className="w-[12px] h-[16px] bg-zinc-200 dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-600 relative overflow-hidden my-0.5">
      <div className={`absolute left-0 w-full h-[10px] bg-white dark:bg-zinc-400 border border-zinc-300 dark:border-zinc-500 shadow-sm transition-all duration-300 ${isOpen ? 'top-0' : 'top-1.5'}`}></div>
    </div>

    <span className="text-[5px] font-bold text-zinc-900 dark:text-zinc-500 tracking-wider">OFF</span>
  </button>
);

const AboutView = () => (
  <div className="animate-fade-up">

    {/* ═══ Bio Section with spine ═══ */}
    <div className="relative max-w-3xl mb-16">
      {/* Left spine trace */}
      <div className="absolute left-0 top-1 bottom-0 flex flex-col items-center" style={{ width: '20px' }}>
        <div className="w-2 h-2 rounded-full border-[1.5px] border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-950 shrink-0" />
        <div className="w-[1.5px] bg-zinc-200 dark:bg-zinc-700 flex-1" />
        <div className="w-2 h-2 rounded-full border-[1.5px] border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-950 shrink-0 my-0.5" />
        <div className="w-[1.5px] bg-zinc-200 dark:bg-zinc-700 flex-1" />
        {/* Ground symbol */}
        <div className="flex flex-col items-center gap-[2px] shrink-0 mt-1">
          <div className="w-[10px] h-[1.5px] bg-zinc-300 dark:bg-zinc-600" />
          <div className="w-[6px] h-[1.5px] bg-zinc-300 dark:bg-zinc-600" />
          <div className="w-[3px] h-[1.5px] bg-zinc-300 dark:bg-zinc-600" />
        </div>
      </div>

      {/* Bio content */}
      <div className="pl-10">
        <h2 className="text-[32px] md:text-[38px] font-light tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.15] mb-6">
          Bridging the gap between{' '}
          <span className="font-bold">hardware architecture</span> and{' '}
          <span className="font-bold">software logic</span>.
        </h2>

        <div className="space-y-4 text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] max-w-2xl">
          <p>
            I am a final-year Electronic Engineering student at the University of Manchester, expecting a First-Class (80%) degree.
          </p>
          <p>
            My engineering philosophy is rooted in full-stack physical systems. Whether it is minimizing nanosecond propagation delays in CMOS logic, or orchestrating 12-servo robotic kinematics via ROS 2, I build systems that are robust from the silicon to the high-level control software.
          </p>
        </div>
      </div>
    </div>

    {/* ═══ Two-Column: Skills | Operational History ═══ */}
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16">

      {/* ── Left Column: Skills / Tech Stack ── */}
      <div className="space-y-8">

        {/* Hardware & EDA */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{'// '}hardware_&_eda</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Altium', 'Solidworks', 'Tanner EDA', 'LT Spice', 'Xilinx', 'NI Multisim', 'STM32 Nucleo', 'Raspberry Pi'].map(s => (
              <span key={s} className="px-3 py-1 text-[12px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-default">{s}</span>
            ))}
          </div>
        </div>

        {/* Software & Control */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-zinc-400 dark:text-zinc-500 text-[13px]">{'>'}_</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{'// '}software_&_control</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['C / C++', 'Python', 'Assembly', 'VHDL', 'ROS 2', 'Matlab / Simulink', 'JavaScript / React'].map(s => (
              <span key={s} className="px-3 py-1 text-[12px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-default">{s}</span>
            ))}
          </div>
        </div>

        {/* Frameworks & Tools */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Plug size={13} className="text-zinc-400 dark:text-zinc-500" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{'// '}frameworks_&_tools</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Gazebo', 'Docker', 'Git', 'Firebase', 'ns-3', 'SUMO', 'Linux / Ubuntu'].map(s => (
              <span key={s} className="px-3 py-1 text-[12px] font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-default">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Column: Operational History ── */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Briefcase size={13} className="text-zinc-400 dark:text-zinc-500" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{'// '}operational_history</span>
          <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800 ml-2" />
        </div>

        {/* Timeline */}
        <div className="relative ml-3">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-0 w-[1.5px] bg-gradient-to-b from-orange-300 via-blue-300 to-green-300 dark:from-orange-600 dark:via-blue-600 dark:to-green-500" />

          {/* ── Republic of Korea Air Force ── */}
          <div className="relative pl-8 pb-10 group">
            <div className="absolute left-[-4.5px] top-2 w-[10px] h-[10px] rounded-full border-[1.5px] border-orange-500 bg-white dark:bg-zinc-950 group-hover:bg-orange-500 transition-all" />

            <h4 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">Republic of Korea Airforce</h4>
            <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 mb-3">Avionics Maintenance Team | Sep 2022 - Jun 2024</p>

            <ul className="space-y-2 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                <span>Supported avionics maintenance in a 35-person unit; coordinated tasks and standardized fault checklists and ESD handling at benches.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                <span>Led procedural optimizations that <span className="text-orange-700 dark:text-orange-300 font-medium">reduced average troubleshooting time by 15%</span>.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                <span>Mentored 16 recruits over 6 months with weekly on-the-job training sessions.</span>
              </li>
            </ul>
          </div>

          {/* ── University of Manchester ── */}
          <div className="relative pl-8 pb-10 group">
            <div className="absolute left-[-4.5px] top-2 w-[10px] h-[10px] rounded-full border-[1.5px] border-blue-500 bg-white dark:bg-zinc-950 group-hover:bg-blue-500 transition-all" />

            <h4 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">The University of Manchester</h4>
            <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 mb-3">BEng Electronic Engineering | 2021 - Present</p>

            <ul className="space-y-2 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                <span>First-Class (80%) expected. Key modules: <span className="text-blue-700 dark:text-blue-300 font-medium">Microcontroller Engineering</span>, <span className="text-blue-700 dark:text-blue-300 font-medium">VLSI Design</span>, Control Systems.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                <span>Specializing in the intersection of Robotics and VLSI Design with hands-on lab experience in FPGA synthesis, analog IC layout, and embedded firmware.</span>
              </li>
            </ul>
          </div>

          {/* ── Hack-A-Bot 2025 ── */}
          <div className="relative pl-8 pb-2 group">
            <div className="absolute left-[-4.5px] top-2 w-[10px] h-[10px] rounded-full border-[1.5px] border-green-500 bg-white dark:bg-zinc-950 group-hover:bg-green-500 transition-all" />

            <h4 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
              Hack-A-Bot 2025
              <span className="ml-2 text-[10px] font-mono font-normal px-1.5 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">3RD PLACE</span>
            </h4>
            <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 mb-3">Robosoc, University of Manchester | Mar 2025</p>

            <ul className="space-y-2 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                <span>Developed a <span className="text-green-700 dark:text-green-300 font-medium">real-time hand-raise detection system</span> using a Raspberry Pi 5 with a Sony AI camera.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0 mt-0.5">•</span>
                <span>Designed a custom CAD mount and integrated computer vision pipeline to gauge student classroom engagement.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);



const ProjectsView = () => {
  const [activeProjectId, setActiveProjectId] = useState(null);

  const projects = [
    {
      id: 'vfc-ns3',
      title: '5G VFC Architecture Simulation (FYP)',
      category: 'Research / Networks',
      desc: 'Evaluating 5G Cellular-Routed Vehicular Fog Computing with NS-3. Introducing a Velocity-Aware Hybrid Algorithm to dynamically balance compute loads and prevent macro-cell congestion.',
      year: 'FYP'
    },
    {
      id: 'baby-spyder',
      title: 'Baby Spyder Robot',
      category: 'Robotics',
      desc: 'Developing a ROS 2 control stack for a 12-servo quadruped robot, utilizing torque calculations for joint stability and Gazebo simulation for physical validation.',
      year: '2025'
    },
    {
      id: 'vlsi-cell',
      title: 'VLSI Logic Cell Optimization',
      category: 'VLSI Design',
      desc: 'Designed a fast-switching CMOS logic cell securing a worst-case delay of 0.553 ns via transistor optimization and Tanner EDA LT spice simulations.',
      year: '2025'
    },
    {
      id: 'buggy',
      title: 'Autonomous Line-Following Buggy',
      category: 'Embedded Systems',
      desc: 'Engineered an STM32-based feedback control system via C++, increasing line detection accuracy to 76% and optimizing motor response for high-speed track navigation.',
      year: '2024'
    },
  ];

  if (activeProjectId === 'vfc-ns3') {
    return (
      <div className="space-y-10 animate-fade-up max-w-4xl pb-12">
        <button onClick={() => setActiveProjectId(null)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-4 group font-medium text-sm">
          <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
          Back to List
        </button>

        <div className="border-b border-zinc-200 pb-8">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-4">Cellular-Routed Vehicular Fog Computing</h2>
          <p className="text-lg text-zinc-500 font-light">Final Year Project • NS-3 & 5G-LENA Simulation</p>
        </div>

        <div className="prose prose-zinc max-w-none text-zinc-700 font-light space-y-8 leading-relaxed">
          <section>
            <h3 className="text-xl font-medium text-zinc-900 mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-900"></div> 1. Purpose & The Core Problem</h3>
            <p>Vehicular Fog Computing (VFC) aims to reduce latency by offloading computing tasks from vehicles to nearby edge nodes (like buses) instead of the distant Cloud. However, existing literature relies on idealized assumptions—specifically that vehicles can communicate directly using frictionless, out-of-band Sidelink connections.</p>
            <p>In reality, near-term deployments rely on existing 5G infrastructure, meaning all V2V traffic must route through the macro-cell base station (gNB). This project evaluated the real-world physical limits of this <strong className="font-semibold text-zinc-900">Cellular-Routed VFC architecture</strong> in a dense urban environment to ultimately introduce a <strong className="font-semibold text-zinc-900">Velocity-Aware Hybrid Algorithm</strong>.</p>
          </section>

          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white"></div> 2. Methodology</h3>
            <ul className="list-none space-y-4 pl-0">
              <li className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"><strong className="font-semibold text-zinc-900 dark:text-zinc-100 block">Simulation Environment</strong> Platform: NS-3 (v3.46) with 5G-LENA module representing realistic 3GPP mmWave physics. Mobility relies on SUMO over a 1km slice of Manchester City Center.</li>
              <li className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"><strong className="font-semibold text-zinc-900 dark:text-zinc-100 block">Double-Hop Architecture</strong> Both client cars and fog-node buses are configured as standard User Equipment (UE). The data path operates strictly as: Car → gNB → Core Network → gNB → Bus.</li>
              <li className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"><strong className="font-semibold text-zinc-900 dark:text-zinc-100 block">Experimental Scenarios</strong> Tested against a 40-vehicle high-speed (Off-Peak) run and a 200-vehicle congested (Peak) run, utilizing a 15 dB Cell Range Extension (CRE) bias.</li>
            </ul>
          </section>



          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white"></div> 2.5 Interactive Lab</h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              Run the NS-3 VFC scenario directly from this page by tuning the number of Cars, gNBs, VFCs, and CFNs.
              The backend executes runs in Docker, queues public requests, and streams results back as charts and map animation.
            </p>
            <SimulationLab />
          </section>


          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white"></div> 3. Key Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Macro-Cell Congestion Collapse</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-400">In the 200-vehicle scenario, routing all traffic double-hop via the cell tower caused extreme mmWave co-channel interference, blinding receivers and causing a catastrophic <strong className="text-red-500 font-medium">97.5% uplink packet loss</strong>.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">The Compute Bottleneck</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-400">Applying CRE bias effectively offloaded traffic from the gNB, but blindly forcing 99% of tasks onto a few buses overwhelmed their CPUs (capped at 200 tasks/s), resulting in <strong className="text-red-500 font-medium">multi-minute queuing delays</strong>.</p>
              </div>
            </div>
          </section>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 mt-8 rounded-sm">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Conclusion</h4>
            <p className="text-sm text-zinc-700 dark:text-zinc-400">Neither pure gNB offloading nor pure VFN offloading functions alone in a dense 5G network. The data validates the absolute necessity of the proposed Velocity-Aware Hybrid Algorithm to monitor vehicle speeds and CPU queues to intelligently route load.</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeProjectId === 'buggy') {
    return (
      <div className="space-y-10 animate-fade-up max-w-4xl pb-12">
        <button onClick={() => setActiveProjectId(null)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors mb-4 group font-medium text-sm">
          <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
          Back to List
        </button>

        <div className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">Autonomous Line-Following Buggy</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-light">Embedded Systems Project • University of Manchester • Group 23</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-medium">
              <span className="text-amber-500">★</span> Best Looking Buggy Award
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 text-xs font-medium">
              84% — First Class Honours
            </span>
          </div>
        </div>

        {/* Hero image */}
        <div className="overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <img src="/images/buggy/hero.jpg" alt="Autonomous line-following buggy at the final race" className="w-full h-auto object-cover" />
          <p className="text-xs text-zinc-400 dark:text-zinc-500 px-4 py-2 bg-zinc-50 dark:bg-zinc-900">The completed buggy at the final race — acetyl chassis with front sensor array, rear drive wheels, and STM32 controller on top.</p>
        </div>

        <div className="prose prose-zinc max-w-none text-zinc-700 dark:text-zinc-300 font-light space-y-8 leading-relaxed">

          {/* ── 1. Overview ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 1. Overview
            </h3>
            <p>An autonomous, high-speed line-following robot designed for warehouse logistics — engineered to prioritise <strong className="font-semibold text-zinc-900 dark:text-zinc-100">speed and stability</strong> over raw torque. The buggy uses a custom multi-layer acetyl chassis, BLE-tunable PID control, and a front-mounted infrared sensor array to navigate a complex racetrack with straights, curves, and an 18° incline.</p>
            <p>The project spanned two semesters of full-cycle development: motor characterisation, gearbox selection, sensor PCB design, chassis CAD, control algorithm implementation, and final race competition. The buggy was awarded <strong className="font-semibold text-zinc-900 dark:text-zinc-100">"Best Looking Buggy"</strong> by Dr Mike O'Toole & Dr Liam Marsh, recognising its exceptionally clean acetyl chassis, internal wiring routing, and professional manufacturing quality.</p>

            {/* Labeled diagram + CAD render side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <img src="/images/buggy/labeled-diagram.jpg" alt="Labeled component diagram of the buggy" className="w-full h-auto object-cover" />
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900">Component layout — microcontroller, motor drive board, batteries, sensor array PCB, and gearbox module.</p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <img src="/images/buggy/cad-render.png" alt="Solidworks CAD render of the buggy" className="w-full h-auto object-cover" />
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900">Solidworks CAD render — 3-layer acetyl chassis with visible gearbox, sensor mount, and internal wiring channels.</p>
              </div>
            </div>
          </section>

          {/* ── 2. System Architecture ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 2. System Architecture
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Mechanical */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">MECH</span>
                  Chassis & Drive
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">3-layer acetyl chassis</strong> — compact, low CG, internally routed wiring</li>
                  <li>• 2-stage gearbox (ratio <span className="font-mono text-zinc-800 dark:text-zinc-200">1:11.50</span>, 72.25% efficiency)</li>
                  <li>• Max flat speed: <span className="font-mono text-zinc-800 dark:text-zinc-200">3.34 m/s</span> | Incline: <span className="font-mono text-zinc-800 dark:text-zinc-200">2.66 m/s</span></li>
                  <li>• Front ball castor + 2× rear drive wheels (80.4 mm Ø)</li>
                </ul>
              </div>

              {/* Electrical */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">ELEC</span>
                  Sensors & PCB
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  <li>• 5× <strong className="font-medium text-zinc-800 dark:text-zinc-200">TCRT5000L</strong> IR reflective sensors — inline array on custom PCB</li>
                  <li>• Sensor height: 5 mm | Resistor: 5 kΩ | ΔV white/black: 3.74 V</li>
                  <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">AEAT-601B-F06</strong> quadrature encoder for speed feedback</li>
                  <li>• Dallas DS2781 IC for battery monitoring</li>
                </ul>
              </div>

              {/* Control */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">CTRL</span>
                  Control System
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">PID controller</strong> with limited integral history for turn stability</li>
                  <li>• Bang-Bang fallback for robust line-break recovery</li>
                  <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">BLE interface</strong> for real-time PID gain tuning mid-run</li>
                  <li>• Spin-towards-last-line recovery strategy</li>
                </ul>
              </div>

              {/* Software */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">SW</span>
                  Software Stack
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">STM32 microcontroller</strong> programmed in C++</li>
                  <li>• Modular firmware: motor PWM, sensor ADC, PID loop, BLE comms</li>
                  <li>• GitHub version control for iterative algorithm testing</li>
                  <li>• Chassis CAD in Solidworks, PCB layout in KiCad</li>
                </ul>
              </div>
            </div>

            {/* PCB Layout + Wiring Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <img src="/images/buggy/pcb-layout.png" alt="KiCad PCB layout for sensor board" className="w-full h-auto object-cover" />
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900">KiCad sensor PCB layout — Group 23 custom design with TCRT5000L sensor array routing.</p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <img src="/images/buggy/wiring-diagram.jpg" alt="System wiring diagram" className="w-full h-auto object-cover" />
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900">Wiring diagram — Nucleo F401RE to motor drive board, sensor array, and motor connections.</p>
              </div>
            </div>
          </section>

          {/* ── Deep Dive: Motor & Gearbox Selection ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> Motor & Gearbox Selection
            </h3>
            <p>Before any mechanical design, the motor parameters were experimentally determined to mathematically select the optimal gear combination. The key motor constants were measured as:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 mt-4 mb-4">
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-mono font-light text-zinc-900 dark:text-zinc-100">7.3<span className="text-xs text-zinc-400"> mNm/A</span></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">K<sub>T</sub> (Torque)</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-mono font-light text-zinc-900 dark:text-zinc-100">7.4<span className="text-xs text-zinc-400"> mV/rad·s⁻¹</span></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">K<sub>E</sub> (EMF)</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-mono font-light text-zinc-900 dark:text-zinc-100">2.182<span className="text-xs text-zinc-400"> Ω</span></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">R<sub>a</sub> (Armature)</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-mono font-light text-zinc-900 dark:text-zinc-100">0.120<span className="text-xs text-zinc-400"> V</span></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">V<sub>brush</sub></span>
              </div>
            </div>
            <p>Using a test chassis weighing <span className="font-mono text-zinc-800 dark:text-zinc-200">1.09 kg</span> with friction coefficient <span className="font-mono text-zinc-800 dark:text-zinc-200">µ = 0.073</span>, the maximum opposing force on an 18° slope was calculated as <span className="font-mono text-zinc-800 dark:text-zinc-200">4.051 N</span>, requiring <span className="font-mono text-zinc-800 dark:text-zinc-200">81.43 mNm</span> of torque at each wheel shaft.</p>
            <p className="mt-3">Three gear combinations were then evaluated against torque, speed, and current requirements:</p>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 mt-3">
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <span className="font-mono text-xs text-zinc-400 w-10 shrink-0 pt-0.5">GC1</span>
                  <p className="text-zinc-500 dark:text-zinc-400">Rejected — required torque near motor maximum (<span className="font-mono text-zinc-800 dark:text-zinc-200">9.8 mNm</span>), unfeasible for slope conditions.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400 w-10 shrink-0 pt-0.5">GC2 ✓</span>
                  <p className="text-zinc-600 dark:text-zinc-300"><strong className="font-medium text-zinc-800 dark:text-zinc-200">Selected</strong> — achieved <span className="font-mono text-zinc-800 dark:text-zinc-200">85.58 rad/s</span> flat and <span className="font-mono text-zinc-800 dark:text-zinc-200">68.77 rad/s</span> on incline, meeting all torque demands efficiently.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="font-mono text-xs text-zinc-400 w-10 shrink-0 pt-0.5">GC3</span>
                  <p className="text-zinc-500 dark:text-zinc-400">Satisfied torque requirements but inferior speed performance compared to GC2.</p>
                </div>
              </div>
            </div>
            <p className="mt-3">The ideal gear ratio was calculated as <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">1:11.50</span> (two stages, 85% efficiency each → 72.25% combined). With wheel diameter <span className="font-mono text-zinc-800 dark:text-zinc-200">80.4 mm</span>, this yields a theoretical max flat speed of <span className="font-mono text-zinc-800 dark:text-zinc-200">3.34 m/s</span> and incline speed of <span className="font-mono text-zinc-800 dark:text-zinc-200">2.66 m/s</span>. The intermediate shaft was positioned at <span className="font-mono text-zinc-800 dark:text-zinc-200">(16.55, 1.245)</span> relative to the input shaft origin using pitch circle diameter calculations.</p>
          </section>

          {/* ── Deep Dive: Sensor Characterisation & PCB ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> Sensor Characterisation & PCB Design
            </h3>
            <p>The line sensor selection involved a rigorous experimental process comparing <strong className="font-semibold text-zinc-900 dark:text-zinc-100">7 sensor–LED combinations</strong> across multiple performance criteria to find the optimal configuration.</p>

            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mt-5 mb-2 text-sm">Sensor–LED Evaluation Process</h4>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p><strong className="font-medium text-zinc-800 dark:text-zinc-200">Sensors tested:</strong> SFH203P photodiode, 5 MΩ LDR, BPW17N phototransistor, TEKT5400S phototransistor, TCRT5000L (integrated)</p>
                <p><strong className="font-medium text-zinc-800 dark:text-zinc-200">LEDs tested:</strong> TSHG6400 IR, TSHA4401 IR, OVL5521 white LED</p>
                <p className="mt-2">Each combination was evaluated through four phases:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li><strong className="font-medium text-zinc-700 dark:text-zinc-300">Working distance optimisation</strong> — best tracking at <span className="font-mono">5 mm</span> gap confirmed via test stand</li>
                  <li><strong className="font-medium text-zinc-700 dark:text-zinc-300">Black/white track ΔV</strong> — voltage difference measured across R<sub>sensor</sub> on each surface</li>
                  <li><strong className="font-medium text-zinc-700 dark:text-zinc-300">Dark current measurement</strong> — error baseline with LED off and sensor covered</li>
                  <li><strong className="font-medium text-zinc-700 dark:text-zinc-300">Ambient light immunity</strong> — flashlight simulation testing to measure reading drift</li>
                </ol>
              </div>
            </div>

            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mt-5 mb-2 text-sm">TCRT5000L Selection Rationale</h4>
            <p>The <strong className="font-semibold text-zinc-900 dark:text-zinc-100">TCRT5000L</strong> was selected for its integrated emitter-detector design, which produces the largest voltage differential — <span className="font-mono text-zinc-800 dark:text-zinc-200">ΔV = 3.74 V</span> between white line and black track with <span className="font-mono text-zinc-800 dark:text-zinc-200">R<sub>sensor</sub> = 5 kΩ</span> and <span className="font-mono text-zinc-800 dark:text-zinc-200">R<sub>LED</sub> = 62 Ω</span>. Its line spread function showed the sharpest transition at the white-black boundary, and it demonstrated the best ambient light immunity among the top three candidates. A <span className="font-mono text-zinc-800 dark:text-zinc-200">2 ms</span> sampling interval was chosen to filter out noise while ensuring no line-break (≤ 6 mm gap) goes undetected.</p>

            {/* ── Sensor Behaviour Graphs (from DR2 report) ── */}
            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mt-6 mb-2 text-sm">Ambient Light Immunity Test</h4>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 space-y-2">
              <p>To ensure the buggy wouldn't be derailed by direct sunlight or shadows during a race, we subjected the sensors to a simulated high-glare environment using a direct flashlight. The graph below plots the voltage outputs on the white line (top cluster) vs the black track (bottom cluster) with ambient light toggled on and off.</p>
              <p>The <strong className="font-semibold text-zinc-700 dark:text-zinc-300">BPW17N</strong> (red dashed line) failed this test — its voltage readings on the black track spiked significantly under ambient light, which would cause false-positive line detections. The <strong className="font-semibold text-zinc-700 dark:text-zinc-300">TCRT5000L</strong>, however, maintained a massive, reliable voltage gap between the white and black surfaces regardless of external illumination, proving its extreme stability.</p>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-xl p-5 mb-8 shadow-sm">
              <AmbientLightChart />
            </div>

            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mt-8 mb-2 text-sm">Line Spread Function (LSF) Analysis</h4>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 space-y-2">
              <p>To evaluate edge-detection sensitivity, we swept each sensor across the white-black boundary (located at <span className="font-mono text-xs">-1 cm</span> and <span className="font-mono text-xs">+1 cm</span> from the centre) at 5, 10, and 15 mm working heights. The resulting Line Spread Function reveals how sharply the sensor reacts to visual blurs at the track edge.</p>
              <p>Looking at the 5 mm comparison array (right graph), the <strong className="font-semibold text-zinc-700 dark:text-zinc-300">TCRT5000L</strong> (blue line) exhibits the tallest peak and the steepest drop-off slope. This high sensitivity is crucial — it means the sensor detects the exact edge of the white line instantly, allowing the PID controller to execute micro-corrections faster to keep the buggy perfectly parallel to the track, even through fragmented line breaks.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-xl p-4 shadow-sm">
                <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3 text-center">TCRT5000L LSF at Various Heights</h5>
                <TCRT5000LSpreadChart />
              </div>
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-xl p-4 shadow-sm">
                <h5 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3 text-center">All Sensors LSF Comparison at 5mm</h5>
                <AllSensorsSpreadChart />
              </div>
            </div>

            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mt-5 mb-2 text-sm">5-Sensor Array Layout</h4>
            <p>The sensor PCB uses a strategic 5-sensor inline configuration designed around the minimum white line width of <span className="font-mono text-zinc-800 dark:text-zinc-200">14 mm</span>:</p>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5 mt-3">
              <div className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <p>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">1 centre sensor</strong> — always on the white line during straight-line tracking</p>
                <p>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">2 side sensors</strong> — gap to centre ≤ 14 mm ensures continuous line coverage; triggers differential motor control when activated</p>
                <p>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">2 outer sensors</strong> — safety failsafe that triggers aggressive one-wheel-forward-one-wheel-reverse turning if the line drifts to the edge</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">The PCB went through 6 manufacturing iterations during build phase due to tolerance issues and short-circuit defects, adding £36.54 in additional component costs.</p>
          </section>

          {/* ── Deep Dive: Control & Software Architecture ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> Control & Software Architecture
            </h3>

            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mb-2 text-sm">Dual Controller Strategy</h4>
            <p>Two control systems were developed in parallel to balance robustness against performance:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 text-sm">Bang-Bang Controller</h5>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  <li>• Logical-statement-based — full-speed correction on sensor trigger</li>
                  <li>• <span className="font-mono text-zinc-800 dark:text-zinc-200">270+</span> iterations tested via visual evaluation</li>
                  <li>• Fast response; constant direction changes on straights</li>
                  <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">Used in final race</strong> — proven reliable at competition speed</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 text-sm">PID Controller</h5>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  <li>• Proportional + Integral (limited history) + Derivative gains</li>
                  <li>• <span className="font-mono text-zinc-800 dark:text-zinc-200">2,000+</span> iterations — mostly &lt;5s test runs</li>
                  <li>• BLE real-time gain tuning (K<sub>p</sub>, K<sub>i</sub>, K<sub>d</sub>) without re-flash</li>
                  <li>• Smoother straights but hampered by narrow sensor spacing</li>
                </ul>
              </div>
            </div>

            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mt-5 mb-2 text-sm">Software Development Flow</h4>
            <p>The firmware was built incrementally using the following staged approach, with each stage merged and tested before advancing:</p>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              {['Speed Control', 'Line-Following', 'Speed + Line', 'Line-Break / Stop', 'BLE Turnaround', 'All Integrated', 'Improved Line-Break', 'Final Tuned'].map((stage, i) => (
                <React.Fragment key={i}>
                  <span className={`px-2.5 py-1 border ${i === 7 ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 font-medium' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}>{stage}</span>
                  {i < 7 && <span className="text-zinc-300 dark:text-zinc-600">→</span>}
                </React.Fragment>
              ))}
            </div>

            <h4 className="font-medium text-zinc-800 dark:text-zinc-200 mt-5 mb-2 text-sm">Firmware Modules</h4>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">motor_pwm</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">H-bridge PWM control with current sensing via shunt resistor</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">sensor_adc</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">5-channel ADC readings at 2 ms ticker interval with noise filtering</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">control_isr</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">Ticker-driven ISR for both bang-bang and PID motor adjustments</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">ble_comms</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">BLE UART for live PID gain tuning and telemetry output</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">encoder</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">Quadrature decoder for speed feedback and distance tracking</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">battery_mon</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">DS2781 I²C battery voltage and capacity monitoring</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. Race Performance ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 3. Race Performance
            </h3>
            <p>The buggy completed the final racetrack using the Bang-Bang controller while the PID controller was still being refined. Despite running conservatively, it provided critical performance data.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 mt-4">
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">21.8<span className="text-sm text-zinc-400">s</span></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">TD4 Time</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">2:27<span className="text-sm text-zinc-400">*</span></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Race Lap</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">5</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">IR Sensors</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">3.34<span className="text-sm text-zinc-400">m/s</span></span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Max Flat Speed</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">* Penalty applied for assist during race heat. TD4 = Technical Demonstration 4 (straight-line time trial).</p>
          </section>

          {/* ── 4. Development Timeline ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 4. Development Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 w-20 shrink-0 pt-0.5">SEM 1</span>
                <div className="flex-1 border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400"><strong className="font-medium text-zinc-800 dark:text-zinc-200">DR1:</strong> Motor characterisation (K<sub>T</sub>, K<sub>E</sub>), load measurements (friction µ = 0.073), gearbox selection (1:11.50), intermediate shaft positioning.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 w-20 shrink-0 pt-0.5">SEM 1</span>
                <div className="flex-1 border-l-2 border-orange-200 dark:border-orange-800 pl-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400"><strong className="font-medium text-zinc-800 dark:text-zinc-200">DR2:</strong> Sensor PCB layout (5× TCRT5000L), chassis CAD in Solidworks (8-piece acetyl design), PID + bang-bang control architecture, material analysis.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 w-20 shrink-0 pt-0.5">SEM 2</span>
                <div className="flex-1 border-l-2 border-green-200 dark:border-green-800 pl-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400"><strong className="font-medium text-zinc-800 dark:text-zinc-200">Build & Race:</strong> PCB manufacture (6 iterations), firmware development, BLE integration for live PID tuning, 4 technical demonstrations, final race completion in 21.8s.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Photo Gallery ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> Build Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden group">
                <img src="/images/buggy/front-view.jpg" alt="Front view of buggy" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <p className="text-[10px] text-zinc-400 px-2 py-1 bg-zinc-50 dark:bg-zinc-900">Front — sensor PCB & castor</p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden group">
                <img src="/images/buggy/internals.jpg" alt="Internal wiring of buggy" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <p className="text-[10px] text-zinc-400 px-2 py-1 bg-zinc-50 dark:bg-zinc-900">Internal wiring</p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden group">
                <img src="/images/buggy/pcb-iterations.jpg" alt="All PCB iterations" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <p className="text-[10px] text-zinc-400 px-2 py-1 bg-zinc-50 dark:bg-zinc-900">6 PCB iterations</p>
              </div>
              <div className="border border-zinc-200 dark:border-zinc-700 overflow-hidden group">
                <img src="/images/buggy/motor-drive.jpg" alt="Motor drive board closeup" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <p className="text-[10px] text-zinc-400 px-2 py-1 bg-zinc-50 dark:bg-zinc-900">Motor drive board</p>
              </div>
            </div>
          </section>

          {/* ── 5. Lessons & Takeaways ── */}
          <section>
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 5. Key Takeaways
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-800 p-5">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 text-sm">What Worked</h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Multi-layer chassis with internally routed wiring minimised connection faults</li>
                  <li>• Spin-towards-last-line code made line-following robust at speed</li>
                  <li>• BLE real-time tuning enabled rapid PID iteration without re-flashing</li>
                  <li>• Parallel task execution recovered schedule after team member resignation</li>
                </ul>
              </div>
              <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-800 p-5">
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 text-sm">Areas for Improvement</h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Sensor spacing too tight — limited the control window at high speeds</li>
                  <li>• 6 PCB reprints due to tolerance and short-circuit issues</li>
                  <li>• PID tuning incomplete before race — bang-bang used as fallback</li>
                  <li>• Redundant edge sensors were never utilised in final code</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── Commercial Viability ── */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 mt-8 rounded-sm">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Commercial Analysis</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Unit production cost <strong className="font-mono text-zinc-800 dark:text-zinc-200">£226</strong> vs. proposed market price <strong className="font-mono text-zinc-800 dark:text-zinc-200">£600</strong> — a 165% project margin. The modular chassis and BLE-tunable firmware offer a strong foundation for warehouse logistics automation at a fraction of the cost of industrial alternatives like Amazon Kiva (£15k/unit). Nearly 32.7% of warehouse buggies on the market are below 10 kg, indicating growing demand for the low-torque, high-speed segment this buggy targets.</p>
          </div>

          {/* ── Achievement Banner ── */}
          <div className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-500/5 p-6 mt-4 rounded-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🏆</span>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Best Looking Buggy Award</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Awarded by Dr Mike O'Toole & Dr Liam Marsh for the exceptionally clean chassis design, internal wiring routing, and professional build quality. The module was completed with a grade of <strong className="font-mono text-zinc-800 dark:text-zinc-200">84%</strong> (First Class Honours), reflecting excellence across hardware, software, mechanical design, and report writing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-up max-w-4xl">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Engineering Projects</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-light">A selection of research and hardware projects executed during my degree, spanning VLSI logic, embedded firmware, and network simulations.</p>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="relative group cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 transition-all duration-300 overflow-hidden"
            onClick={() => setActiveProjectId(proj.id)}
          >
            {/* Accent left border */}
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${proj.id === 'vfc-ns3' ? 'bg-indigo-500' :
              proj.id === 'buggy' ? 'bg-blue-500' :
                proj.id === 'baby-spyder' ? 'bg-emerald-500 opacity-0 group-hover:opacity-100' :
                  proj.id === 'vlsi-cell' ? 'bg-amber-500 opacity-0 group-hover:opacity-100' :
                    'bg-zinc-400 opacity-0 group-hover:opacity-100'
              }`} />

            <div className="flex items-stretch">
              {/* Year column */}
              <div className="flex flex-col items-center justify-center w-20 md:w-28 shrink-0 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 transition-colors">
                <span className="text-2xl md:text-3xl font-extralight text-zinc-300 dark:text-zinc-700 font-mono tracking-tighter select-none group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors">
                  {proj.year}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-2">
                    {proj.title}
                    {proj.id === 'vfc-ns3' && <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] uppercase tracking-wider font-semibold">Research</span>}
                  </h3>
                  <span className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium shrink-0">{proj.category}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed text-sm max-w-2xl">{proj.desc}</p>

                {(proj.id === 'vfc-ns3' || proj.id === 'buggy') && (
                  <div className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-300 flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {proj.id === 'vfc-ns3' ? 'View full research abstract' : 'View full project'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LifeView = ({ user }) => {
  const [curation, setCuration] = useState('');
  const [isCurating, setIsCurating] = useState(false);
  const [error, setError] = useState('');

  const interests = [
    { icon: Shirt, title: 'Fashion & Aesthetic', desc: 'Appreciating the architecture of clothing. Favoring minimalist, functional, and well-constructed garments over fast trends.' },
    { icon: Coffee, title: 'Gastronomy', desc: 'Exploring culinary arts. Whether it is finding the perfect espresso pull or experimenting with global recipes in my own kitchen.' },
  ];

  const handleCurate = async () => {
    setIsCurating(true);
    setError('');
    try {
      const prompt = "Act as an elegant, minimalist curator. Based on a blend of modern fashion, ambient/indie music, and specialty coffee, generate a 3-sentence 'vibe' for today. Structure it loosely as 'Listen to X. Wear Y. Drink Z.' Keep it sophisticated, clean, and inspiring. Do not use asterisks or markdown formatting.";
      const result = await generateGeminiContent(prompt);
      setCuration(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCurating(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-up w-full">

      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Life Beyond the Screen</h2>
        <p className="text-zinc-600 dark:text-zinc-400 font-light max-w-2xl mb-8">
          The inputs that fuel my outputs. A collection of offline pursuits that influence my digital work.
        </p>

        <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="max-w-xl">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                <Zap size={18} className="text-zinc-400" /> Daily Curation
              </h3>
              {isCurating ? (
                <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <Loader2 size={16} className="animate-spin" /> Fetching today's aesthetic...
                </div>
              ) : curation ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">{curation}</p>
              ) : error ? (
                <p className="text-sm text-red-500 font-light">{error}</p>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">Generate a unique blend of music, fashion, and coffee recommendations for today's focus session.</p>
              )}
            </div>
            <button
              onClick={handleCurate}
              disabled={isCurating}
              className="shrink-0 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {curation ? "Recurate ✨" : "Generate ✨"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-16">
          {interests.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 hover:border-zinc-200 dark:hover:border-zinc-600 transition-all duration-300 cursor-default">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-200 dark:border-zinc-700 transition-colors duration-500 group-hover:border-zinc-900 dark:group-hover:border-zinc-400 group-hover:w-full group-hover:h-full group-hover:opacity-10"></div>
              <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon size={18} className="text-zinc-900 dark:text-zinc-200" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-black dark:group-hover:text-white transition-colors">{item.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Portal to WSJ Record */}
        <div className="mt-16 w-full group relative overflow-hidden bg-black text-white p-8 sm:p-12 mb-16 cursor-pointer" onClick={() => window.location.href = '/record'}>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-black z-0 pointer-events-none"></div>
          <div className="absolute -right-12 -bottom-12 z-0 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700 pointer-events-none">
            <Disc size={250} />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex flex-col max-w-lg">
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] mb-3">Interactive Experience</span>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4 flex items-center gap-3">
                WSJ Record <Disc className="text-green-500 animate-spin-slow" size={28} style={{ animationDuration: '4s' }} />
              </h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Dive into my highly curated sonic landscape. A deeply personalized, edge-to-edge playback experience designed for deep work and aesthetic flow.
              </p>
            </div>
            <div className="shrink-0">
              <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 hover:scale-105 transition-all text-sm">
                Open Player <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

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
    } catch (err) {
      setDraft("System error: Unable to connect to the drafting module.");
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-up max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3 mb-4">
          <Plug className="text-zinc-400" size={28} />
          Establishing Connection
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 font-light text-lg">
          Whether you want to discuss a new software architecture, share a Spotify playlist, or debate the best local coffee roaster, my inbox is open.
        </p>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 relative shadow-sm hover:shadow-md transition-shadow">
        <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 flex items-center">
          <Node className="bg-zinc-100" />
        </div>
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Cpu size={18} className="text-zinc-400" /> AI Icebreaker Drafter
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2 text-sm text-zinc-700 dark:text-zinc-200 outline-none focus:border-zinc-400 transition-colors"
          >
            <option value="collaboration">Discuss a project collaboration</option>
            <option value="hiring">Discuss a hiring opportunity</option>
            <option value="coffee/music">Share a music or coffee recommendation</option>
          </select>
          <button
            onClick={handleDraft}
            disabled={isDrafting}
            className="px-5 py-2 bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isDrafting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Draft Email ✨"}
          </button>
        </div>

        {draft && (
          <div className="mt-4 p-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-300 font-light leading-relaxed relative group shadow-sm">
            {draft}
            <button
              onClick={() => {
                const el = document.createElement('textarea');
                el.value = draft;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs font-medium bg-zinc-100 dark:bg-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300 transition-opacity hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-sm"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <a href="mailto:wooseongjung12@gmail.com" className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <Mail size={24} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          <div className="mt-2">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Email</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-light break-words">wooseongjung12@gmail.com</span>
          </div>
          <ArrowRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transform group-hover:translate-x-1 transition-all mt-auto" />
        </a>

        <a href="https://linkedin.com/in/wooseong-jung-0bb5b121b" target="_blank" rel="noreferrer" className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <Linkedin size={24} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          <div className="mt-2">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">LinkedIn</h3>
            <span className="text-xs text-zinc-500 font-light">Network & resume</span>
          </div>
          <ArrowRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transform group-hover:-rotate-45 transition-all mt-auto" />
        </a>

        <a href="https://github.com/wooseongjung" target="_blank" rel="noreferrer" className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <Github size={24} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
          <div className="mt-2">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">GitHub</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-light">Code repositories</span>
          </div>
          <ArrowRight size={16} className="text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transform group-hover:-rotate-45 transition-all mt-auto" />
        </a>
      </div>
    </div>
  );
};

const StandardLayout = ({ user }) => (
  <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16 relative z-10 flex flex-col gap-24">
    <main className="min-h-[40vh]">
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/project" element={<ProjectsView />} />
        <Route path="/life" element={<LifeView user={user} />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="*" element={<Navigate to="/about" replace />} />
      </Routes>
    </main>

    <Trace className="w-1/3 opacity-50" />

    <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 font-light pb-12 gap-4 relative">
      <div className="flex items-center gap-3">
        <GroundSymbol />
        <span>SYSTEM.ONLINE</span>
      </div>

      <Link to="/contact" className="absolute left-1/2 -translate-x-1/2 flex justify-center items-center group bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 hover:border-zinc-900 dark:hover:border-zinc-400 hover:shadow-sm transition-all shadow-sm z-30">
        <span className="text-zinc-900 dark:text-white font-medium">Get in touch</span>
        <ArrowRight size={12} className="ml-2 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-1 transition-transform" />
      </Link>

      <span className="hidden md:inline">© {new Date().getFullYear()} Wooseong Jung</span>
    </div>
  </div>
);

export default function App() {
  const location = useLocation();
  const activePath = location.pathname.split('/')[1] || 'about';
  const activeTab = activePath === 'project' ? 'project' : (activePath === 'contact' ? 'contact' : ((activePath === 'life' || activePath === 'record') ? 'life' : 'about'));
  const [wireLength, setWireLength] = useState(0);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (user) {
      await signOut(auth);
    } else {
      await signInWithPopup(auth, provider);
    }
  };

  const navItems = [
    { id: 'about', label: 'About', icon: User, path: '/about' },
    { id: 'project', label: 'Projects', icon: Cpu, path: '/project' },
    { id: 'life', label: 'Life', icon: Compass, path: '/life' },
    { id: 'contact', label: 'Contact', icon: Mail, path: '/contact' },
  ];

  useEffect(() => {
    const updatePos = () => {
      const activeBtn = document.getElementById(`nav-${activeTab}`);
      if (activeBtn) {
        setWireLength(activeBtn.offsetLeft + (activeBtn.offsetWidth / 2));
      }
    };

    setTimeout(updatePos, 50);
    window.addEventListener('resize', updatePos);
    return () => window.removeEventListener('resize', updatePos);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0e0e0e] relative selection:bg-zinc-200 dark:selection:bg-zinc-700 selection:text-zinc-900 dark:selection:text-zinc-100">
      <style>{injectedStyles}</style>

      {activePath !== 'record' && (
        <div className="bg-minimal-circuit absolute inset-0 pointer-events-none fixed"></div>
      )}

      <header className={`sticky top-0 z-50 backdrop-blur-md overflow-hidden ${activePath === 'record' ? 'bg-black text-white border-b border-[#282828]' : 'bg-[#fafafa]/90 dark:bg-[#0e0e0e]/90 border-b border-transparent dark:border-zinc-800'}`}>
        <div className={`absolute bottom-0 left-0 w-full h-[1.5px] z-0 pointer-events-none ${activePath === 'record' ? 'bg-[#282828]' : 'bg-zinc-200'}`}></div>

        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-6">

          {/* LEFT: Logo */}
          <Link to="/about" className="flex flex-col cursor-pointer shrink-0">
            <h1 className={`text-lg font-bold tracking-tight leading-none flex items-center gap-2 ${activePath === 'record' ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
              <Zap size={16} fill="currentColor" />
              Wooseong Jung
            </h1>
            <p className={`text-[10px] font-light mt-1 ml-6 ${activePath === 'record' ? 'text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>Software Engineer &amp; Creative</p>
          </Link>

          {/* CENTER: Nav tabs */}
          <nav id="nav-container" className="flex items-center justify-center h-full relative">
            <div
              className={`absolute bottom-0 left-[-2000px] h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 pointer-events-none ${activePath === 'record' ? 'bg-white' : 'bg-zinc-900 dark:bg-white'}`}
              style={{ width: `calc(2000px + ${wireLength}px)` }}
            ></div>

            {navItems.map((item) => (
              <Link
                key={item.id}
                id={`nav-${item.id}`}
                to={item.path}
                className={`flex items-center text-sm transition-colors relative h-full px-6 z-20 group ${activeTab === item.id
                  ? (activePath === 'record' ? 'text-white font-medium' : 'text-zinc-900 dark:text-white font-medium')
                  : (activePath === 'record' ? 'text-zinc-500 hover:text-white font-light' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-light')
                  }`}
              >
                {item.label}
                {/* Active indicator node on the wire */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none"
                  style={{ bottom: '-4.25px' }}
                >
                  <div className={`w-2.5 h-2.5 rounded-full border-[1.5px] flex items-center justify-center transition-colors duration-300 ${activeTab === item.id
                    ? (activePath === 'record' ? 'border-white bg-black' : 'border-zinc-900 dark:border-white bg-[#fafafa] dark:bg-zinc-950')
                    : (activePath === 'record' ? 'border-[#282828] bg-black group-hover:border-zinc-600' : 'border-zinc-200 dark:border-zinc-700 bg-[#fafafa] dark:bg-zinc-950 group-hover:border-zinc-400 dark:group-hover:border-zinc-500')
                    }`}>
                    <div className={`w-[3px] h-[3px] rounded-full transition-colors duration-300 ${activeTab === item.id ? (activePath === 'record' ? 'bg-white' : 'bg-zinc-900 dark:bg-white') : 'bg-transparent'}`}></div>
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* RIGHT: Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <button onClick={handleLogin} className={`hidden lg:flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded border transition-colors ${activePath === 'record' ? 'text-zinc-400 hover:text-red-400 bg-zinc-900 border-zinc-700' : 'text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'}`} title="Sign Out">
                <span className="max-w-[110px] truncate">{user.email}</span>
                <LogOut size={11} />
              </button>
            ) : (
              <button onClick={handleLogin} className={`hidden lg:flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded border transition-colors ${activePath === 'record' ? 'text-white bg-zinc-800 border-zinc-700 hover:bg-zinc-700' : 'text-zinc-700 dark:text-white bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`} title="Sign In with Google">
                <span>Sign In</span>
                <LogIn size={11} />
              </button>
            )}

            <div className="hidden lg:block h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700"></div>

            <LightSwitch
              isOpen={isDarkMode}
              onToggle={() => setIsDarkMode(!isDarkMode)}
              className={activePath === 'record' ? 'opacity-40 pointer-events-none' : ''}
            />

            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700"></div>

            <div className="flex items-center gap-3">
              <a href="mailto:hello@yourdomain.com" className={`transition-colors ${activePath === 'record' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
                <Mail size={15} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`transition-colors ${activePath === 'record' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
                <Linkedin size={15} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={`transition-colors ${activePath === 'record' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-white'}`}>
                <Github size={15} />
              </a>
            </div>
          </div>
        </div>

      </header>

      <Routes>
        <Route path="/record" element={<MusicPlayer user={user} />} />
        <Route path="*" element={<StandardLayout user={user} />} />
      </Routes>
    </div >
  );
}
