import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import MusicPlayer from "./components/MusicPlayer";

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
  }

  .bg-minimal-circuit {
    background-image: 
      linear-gradient(rgba(228, 228, 231, 0.5) 1px, transparent 1px),
      linear-gradient(90deg, rgba(228, 228, 231, 0.5) 1px, transparent 1px);
    background-size: 60px 60px;
    background-position: center center;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #fafafa; }
  ::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up {
    animation: fade-up 0.6s ease-out forwards;
  }
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
    <div className="w-4 h-[1.5px] bg-zinc-400"></div>
    <div className="w-2.5 h-[1.5px] bg-zinc-400"></div>
    <div className="w-1 h-[1.5px] bg-zinc-400"></div>
  </div>
);

const AboutView = () => (
  <div className="space-y-16 animate-fade-up max-w-4xl">
    <div className="relative">
      <h2 className="text-3xl font-light tracking-tight text-zinc-900 mb-6">
        Architecting intelligence in <span className="font-semibold">silicon</span> and <span className="font-semibold">motion</span>.
      </h2>

      <div className="space-y-6 text-zinc-600 leading-relaxed font-light text-lg">
        <p>
          I am an Electronic Engineering undergrad at the University of Manchester, specializing in the intersection of <strong className="font-semibold text-zinc-900">Robotics</strong> and <strong className="font-semibold text-zinc-900">VLSI Design</strong>.
        </p>
        <p>
          My technical footprint spans from low-level hardware design (VHDL, Altium, Tanner EDA) and C++ microcontroller firmware, right up to high-level robotics frameworks like ROS 2 and Gazebo. I build systems that move precisely and calculate efficiently.
        </p>
      </div>

      <div className="absolute -left-12 top-2 h-[120%] hidden md:flex flex-col items-center">
        <Power size={14} className="text-zinc-300 mb-2" />
        <Trace vertical className="flex-1 max-h-[80px]" />
        <Node className="border-zinc-300 my-2" />
        <Trace vertical className="flex-1 max-h-[80px]" />
        <Node className="border-zinc-300 my-2" />
        <Trace vertical className="flex-1 max-h-[80px]" />
        <GroundSymbol className="mt-2" />
      </div>
    </div>

    {/* Timeline Section */}
    <div className="pt-8 border-t border-zinc-200">
      <h3 className="text-xl font-medium text-zinc-900 mb-8 flex items-center gap-2">
        <Cpu size={20} className="text-zinc-400" /> Professional Footprint
      </h3>

      <div className="relative border-l border-zinc-200 pl-8 space-y-12 ml-2">

        {/* Present */}
        <div className="relative group">
          <div className="absolute -left-[32px] top-[7px] w-8 h-[1px] bg-zinc-200 group-hover:bg-zinc-900 transition-colors"></div>
          <Node className="absolute -left-[36px] top-[4px] transition-colors group-hover:bg-zinc-900" />
          <div className="mb-2">
            <h4 className="text-lg font-medium text-zinc-900">University of Manchester</h4>
            <span className="text-sm text-zinc-400 font-light block mt-1">Sep 2021 — Present • BEng (Hons) in Electronic Engineering</span>
          </div>
          <p className="text-zinc-600 font-light leading-relaxed">
            First-Class (80%) expected. Key modules include Microcontroller Engineering, Analog and Digital Communication, Control Systems, and VLSI Design.
          </p>
        </div>

        {/* Hackabot */}
        <div className="relative group">
          <div className="absolute -left-[32px] top-[7px] w-8 h-[1px] bg-zinc-200 group-hover:bg-zinc-900 transition-colors"></div>
          <Node className="absolute -left-[36px] top-[4px] transition-colors group-hover:bg-zinc-900" />
          <div className="mb-2">
            <h4 className="text-lg font-medium text-zinc-900">Hack-A-Bot 2025 (3rd Place)</h4>
            <span className="text-sm text-zinc-400 font-light block mt-1">Mar 2025 • Robosoc, UoM</span>
          </div>
          <p className="text-zinc-600 font-light leading-relaxed">
            Developed a real-time hand-raise detection system using a Raspberry Pi 5. Designed a custom CAD mount for a Sony AI camera to gauge student classroom engagement.
          </p>
        </div>

        {/* Airforce */}
        <div className="relative group">
          <div className="absolute -left-[32px] top-[7px] w-8 h-[1px] bg-zinc-200 group-hover:bg-zinc-900 transition-colors"></div>
          <Node className="absolute -left-[36px] top-[4px] transition-colors group-hover:bg-zinc-900" />
          <div className="mb-2">
            <h4 className="text-lg font-medium text-zinc-900">Republic of Korea Airforce</h4>
            <span className="text-sm text-zinc-400 font-light block mt-1">Sep 2022 — Jun 2024 • Flight Control Maintenance</span>
          </div>
          <p className="text-zinc-600 font-light leading-relaxed">
            Supported avionics maintenance in a 35-person unit. Standardized fault checklists and ESD handling tools, notably reducing average troubleshooting times by 15%. Mentored 16 recruits during on-the-job training.
          </p>
        </div>

      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-zinc-200">
      <div className="text-sm text-zinc-500"><span className="font-medium text-zinc-900 block mb-1">Languages</span> C/C++, Python, Assembly, VHDL, JavaScript</div>
      <div className="text-sm text-zinc-500"><span className="font-medium text-zinc-900 block mb-1">Hardware</span> STM32, Raspberry Pi, ROS 2</div>
      <div className="text-sm text-zinc-500"><span className="font-medium text-zinc-900 block mb-1">Software</span> Matlab, Simulink, Solidworks, Altium</div>
      <div className="text-sm text-zinc-500"><span className="font-medium text-zinc-900 block mb-1">EDA</span> Tanner EDA, NI Multisim, Xilinx</div>
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
            <h3 className="text-xl font-medium text-zinc-900 mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-900"></div> 2. Methodology</h3>
            <ul className="list-none space-y-4 pl-0">
              <li className="pl-4 border-l-2 border-zinc-200"><strong className="font-semibold text-zinc-900 block">Simulation Environment</strong> Platform: NS-3 (v3.46) with 5G-LENA module representing realistic 3GPP mmWave physics. Mobility relies on SUMO over a 1km slice of Manchester City Center.</li>
              <li className="pl-4 border-l-2 border-zinc-200"><strong className="font-semibold text-zinc-900 block">Double-Hop Architecture</strong> Both client cars and fog-node buses are configured as standard User Equipment (UE). The data path operates strictly as: Car → gNB → Core Network → gNB → Bus.</li>
              <li className="pl-4 border-l-2 border-zinc-200"><strong className="font-semibold text-zinc-900 block">Experimental Scenarios</strong> Tested against a 40-vehicle high-speed (Off-Peak) run and a 200-vehicle congested (Peak) run, utilizing a 15 dB Cell Range Extension (CRE) bias.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-medium text-zinc-900 mb-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-900"></div> 3. Key Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                <h4 className="font-semibold text-zinc-900 mb-2">Macro-Cell Congestion Collapse</h4>
                <p className="text-sm">In the 200-vehicle scenario, routing all traffic double-hop via the cell tower caused extreme mmWave co-channel interference, blinding receivers and causing a catastrophic <strong className="text-red-500 font-medium">97.5% uplink packet loss</strong>.</p>
              </div>
              <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                <h4 className="font-semibold text-zinc-900 mb-2">The Compute Bottleneck</h4>
                <p className="text-sm">Applying CRE bias effectively offloaded traffic from the gNB, but blindly forcing 99% of tasks onto a few buses overwhelmed their CPUs (capped at 200 tasks/s), resulting in <strong className="text-red-500 font-medium">multi-minute queuing delays</strong>.</p>
              </div>
            </div>
          </section>

          <div className="bg-zinc-50 border border-zinc-200 p-6 mt-8 rounded-sm">
            <h4 className="font-semibold text-zinc-900 mb-2">Conclusion</h4>
            <p className="text-sm text-zinc-700">Neither pure gNB offloading nor pure VFN offloading functions alone in a dense 5G network. The data validates the absolute necessity of the proposed Velocity-Aware Hybrid Algorithm to monitor vehicle speeds and CPU queues to intelligently route load.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-up max-w-4xl">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-4">Engineering Projects</h2>
        <p className="text-zinc-500 font-light">A selection of research and hardware projects executed during my degree, spanning VLSI logic, embedded firmware, and network simulations.</p>
      </div>

      <div className="relative border-l border-zinc-200 pl-8 space-y-12 ml-2">
        {projects.map((proj) => (
          <div key={proj.id} className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 p-6 -ml-6 -mt-6 rounded-lg hover:bg-white hover:shadow-md border border-transparent hover:border-zinc-200" onClick={() => setActiveProjectId(proj.id)}>
            <div className={`absolute -left-[24px] top-[31px] w-6 h-[1px] ${proj.id === 'vfc-ns3' ? 'bg-zinc-900' : 'bg-zinc-200 group-hover:bg-zinc-900'} transition-colors duration-500`}></div>
            <Node className={`absolute -left-[28px] top-[28px] transition-all duration-500 ${proj.id === 'vfc-ns3' ? 'bg-zinc-900' : 'group-hover:bg-zinc-900 group-hover:scale-125'}`} />

            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-xl font-medium text-zinc-900 group-hover:text-black transition-colors flex items-center gap-2">
                {proj.title}
                {proj.id === 'vfc-ns3' && <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-wider font-semibold rounded-sm">Research</span>}
              </h3>
              <span className="text-sm text-zinc-400 font-light mt-1 md:mt-0">{proj.year} • {proj.category}</span>
            </div>
            <p className="text-zinc-600 font-light leading-relaxed max-w-2xl">{proj.desc}</p>

            {proj.id === 'vfc-ns3' && (
              <div className="mt-4 text-sm font-medium text-zinc-900 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                View full research abstract <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
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
        <h2 className="text-2xl font-semibold text-zinc-900">Life Beyond the Screen</h2>
        <p className="text-zinc-600 font-light max-w-2xl mb-8">
          The inputs that fuel my outputs. A collection of offline pursuits that influence my digital work.
        </p>

        <div className="bg-white p-8 border border-zinc-200 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="max-w-xl">
              <h3 className="text-lg font-medium text-zinc-900 mb-2 flex items-center gap-2">
                <Zap size={18} className="text-zinc-400" /> Daily Curation
              </h3>
              {isCurating ? (
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <Loader2 size={16} className="animate-spin" /> Fetching today's aesthetic...
                </div>
              ) : curation ? (
                <p className="text-sm text-zinc-600 font-light leading-relaxed">{curation}</p>
              ) : error ? (
                <p className="text-sm text-red-500 font-light">{error}</p>
              ) : (
                <p className="text-sm text-zinc-500 font-light">Generate a unique blend of music, fashion, and coffee recommendations for today's focus session.</p>
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
            <div key={idx} className="bg-white p-8 border border-zinc-100 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 hover:border-zinc-200 transition-all duration-300 cursor-default">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-200 transition-colors duration-500 group-hover:border-zinc-900 group-hover:w-full group-hover:h-full group-hover:opacity-10"></div>
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon size={18} className="text-zinc-900" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 mb-3 group-hover:text-black transition-colors">{item.title}</h3>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">{item.desc}</p>
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
        <h2 className="text-3xl font-light tracking-tight text-zinc-900 flex items-center gap-3 mb-4">
          <Plug className="text-zinc-400" size={28} />
          Establishing Connection
        </h2>
        <p className="text-zinc-600 font-light text-lg">
          Whether you want to discuss a new software architecture, share a Spotify playlist, or debate the best local coffee roaster, my inbox is open.
        </p>
      </div>

      <div className="bg-zinc-50 border border-zinc-200 p-6 relative shadow-sm hover:shadow-md transition-shadow">
        <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 flex items-center">
          <Node className="bg-zinc-100" />
        </div>
        <h3 className="font-medium text-zinc-900 mb-4 flex items-center gap-2">
          <Cpu size={18} className="text-zinc-400" /> AI Icebreaker Drafter
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="flex-1 bg-white border border-zinc-200 p-2 text-sm text-zinc-700 outline-none focus:border-zinc-400 transition-colors"
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
          <div className="mt-4 p-4 bg-white border border-zinc-100 text-sm text-zinc-600 font-light leading-relaxed relative group shadow-sm">
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
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs font-medium bg-zinc-100 px-3 py-1 text-zinc-600 transition-opacity hover:bg-zinc-200 rounded-sm"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <a href="mailto:wooseongjung12@gmail.com" className="flex flex-col gap-4 p-6 bg-white border border-zinc-200 hover:border-zinc-900 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <Mail size={24} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          <div className="mt-2">
            <h3 className="font-medium text-zinc-900">Email</h3>
            <span className="text-xs text-zinc-500 font-light break-words">wooseongjung12@gmail.com</span>
          </div>
          <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transform group-hover:translate-x-1 transition-all mt-auto" />
        </a>

        <a href="https://linkedin.com/in/wooseong-jung-0bb5b121b" target="_blank" rel="noreferrer" className="flex flex-col gap-4 p-6 bg-white border border-zinc-200 hover:border-zinc-900 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <Linkedin size={24} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          <div className="mt-2">
            <h3 className="font-medium text-zinc-900">LinkedIn</h3>
            <span className="text-xs text-zinc-500 font-light">Network & resume</span>
          </div>
          <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transform group-hover:-rotate-45 transition-all mt-auto" />
        </a>

        <a href="https://github.com/wooseongjung" target="_blank" rel="noreferrer" className="flex flex-col gap-4 p-6 bg-white border border-zinc-200 hover:border-zinc-900 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
          <Github size={24} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          <div className="mt-2">
            <h3 className="font-medium text-zinc-900">GitHub</h3>
            <span className="text-xs text-zinc-500 font-light">Code repositories</span>
          </div>
          <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transform group-hover:-rotate-45 transition-all mt-auto" />
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

    <section className="flex flex-col md:flex-row items-center justify-between pt-4 pb-8 border-b border-zinc-200 gap-6">
      <p className="text-zinc-600 font-light text-sm max-w-sm text-center md:text-left">Interested in discussing robotics, hardware integration, or just grabbing a coffee?</p>
      <Link to="/contact" className="group flex items-center gap-3 px-6 py-3 bg-white border border-zinc-200 rounded-full hover:border-zinc-900 hover:shadow-md transition-all duration-300">
        <span className="text-sm font-medium text-zinc-900">Get in touch</span>
        <ArrowRight size={16} className="text-zinc-500 group-hover:text-black group-hover:translate-x-1 transition-transform" />
      </Link>
    </section>

    <div className="pt-4 flex items-center justify-between text-xs text-zinc-400 font-light pb-12">
      <div className="flex items-center gap-3">
        <GroundSymbol />
        <span>SYSTEM.ONLINE</span>
      </div>
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
    <div className="min-h-screen bg-[#fafafa] relative selection:bg-zinc-200 selection:text-zinc-900">
      <style>{injectedStyles}</style>

      {activePath !== 'record' && (
        <div className="bg-minimal-circuit absolute inset-0 pointer-events-none fixed"></div>
      )}

      <header className={`sticky top-0 z-50 backdrop-blur-md overflow-hidden ${activePath === 'record' ? 'bg-black text-white border-b border-[#282828]' : 'bg-[#fafafa]/90'}`}>
        <div className={`absolute bottom-0 left-0 w-full h-[1.5px] z-0 pointer-events-none ${activePath === 'record' ? 'bg-[#282828]' : 'bg-zinc-200'}`}></div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">

          <Link to="/about" className="flex flex-col relative group cursor-pointer">
            <h1 className={`text-lg font-bold tracking-tight leading-none flex items-center gap-2 ${activePath === 'record' ? 'text-white' : 'text-zinc-900'}`}>
              <Zap size={16} fill="currentColor" />
              Wooseong Jung
            </h1>
            <p className={`text-[10px] font-light mt-1 ml-6 ${activePath === 'record' ? 'text-zinc-500' : 'text-zinc-500'}`}>Software Engineer & Creative</p>
          </Link>

          <div className="flex items-center gap-8 h-full">
            <nav id="nav-container" className="hidden md:flex items-center gap-2 h-full relative pl-2">
              <div
                className={`absolute bottom-0 left-[-2000px] h-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 pointer-events-none ${activePath === 'record' ? 'bg-white' : 'bg-zinc-900'}`}
                style={{ width: `calc(2000px + ${wireLength}px)` }}
              ></div>

              {navItems.map((item) => (
                <Link
                  key={item.id}
                  id={`nav-${item.id}`}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm transition-colors relative h-full px-5 z-20 group ${activeTab === item.id
                    ? (activePath === 'record' ? 'text-white font-medium' : 'text-zinc-900 font-medium')
                    : (activePath === 'record' ? 'text-zinc-500 hover:text-white font-light' : 'text-zinc-500 hover:text-zinc-900 font-light')
                    }`}
                >
                  {item.label}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none"
                    style={{ bottom: '-4.25px' }}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full border-[1.5px] flex items-center justify-center transition-colors duration-300 ${activeTab === item.id
                      ? (activePath === 'record' ? 'border-white bg-black' : 'border-zinc-900 bg-[#fafafa]')
                      : (activePath === 'record' ? 'border-[#282828] bg-black group-hover:border-zinc-600' : 'border-zinc-200 bg-[#fafafa] group-hover:border-zinc-400')
                      }`}>
                      <div className={`w-[3px] h-[3px] rounded-full transition-colors duration-300 ${activeTab === item.id ? (activePath === 'record' ? 'bg-white' : 'bg-zinc-900') : 'bg-transparent'
                        }`}></div>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

            <div className={`flex items-center gap-4 pl-8 border-l hidden md:flex h-5 relative z-10 ${activePath === 'record' ? 'border-[#282828]' : 'border-zinc-200'}`}>

              <div className="flex items-center gap-2 mr-4">
                {user ? (
                  <button onClick={handleLogin} className={`flex items-center gap-2 text-xs font-medium transition-colors px-2 py-1 rounded ${activePath === 'record' ? 'text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-neutral-800' : 'text-zinc-500 hover:text-red-500 bg-zinc-100 hover:bg-red-50'}`} title="Sign Out">
                    <span className="max-w-[100px] truncate">{user.email}</span>
                    <LogOut size={14} />
                  </button>
                ) : (
                  <button onClick={handleLogin} className={`flex items-center gap-2 text-xs font-medium transition-colors px-3 py-1 rounded ${activePath === 'record' ? 'text-white bg-zinc-800 hover:bg-zinc-700' : 'text-zinc-900 bg-zinc-100 hover:bg-zinc-200'}`} title="Sign In with Google">
                    <span>Sign In</span>
                    <LogIn size={14} />
                  </button>
                )}
              </div>

              <a href="mailto:hello@yourdomain.com" className={`transition-colors ${activePath === 'record' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                <Mail size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`transition-colors ${activePath === 'record' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                <Linkedin size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={`transition-colors ${activePath === 'record' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                <Github size={16} />
              </a>
            </div>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/record" element={<MusicPlayer user={user} />} />
        <Route path="*" element={<StandardLayout user={user} />} />
      </Routes>
    </div>
  );
}
