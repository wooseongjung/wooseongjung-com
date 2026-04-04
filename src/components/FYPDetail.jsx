import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import PreRunResults from './PreRunResults';
import SimulationLab from './SimulationLab';

const FYPDetail = ({ backToList }) => {
  const [simPanelOpen, setSimPanelOpen] = useState(false);

  return (
    <>
      {/* ── Left-edge tab to open simulation panel ── */}
      <button
        onClick={() => setSimPanelOpen(true)}
        className="sim-panel-tab bg-gold/10 dark:bg-gold/10 text-gold dark:text-gold-bright border-gold/30 dark:border-gold/30 hover:bg-gold/20 dark:hover:bg-gold/20"
        style={{ display: simPanelOpen ? 'none' : undefined }}
      >
        ▶ Run Simulation
      </button>

      {/* ── Slide-in simulation panel ── */}
      <div className={`sim-panel-backdrop ${simPanelOpen ? 'open' : ''}`} onClick={() => setSimPanelOpen(false)} />
      <div className={`sim-panel bg-white dark:bg-zinc-950 border-r border-midnight-200 dark:border-midnight-800 ${simPanelOpen ? 'open' : ''}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-midnight-200 dark:border-midnight-800">
          <h3 className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-900 dark:text-white">Interactive Simulation</h3>
          <button onClick={() => setSimPanelOpen(false)} className="p-1 text-midnight-400 hover:text-gold transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-6">
          <SimulationLab />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className={`fyp-content-wrapper space-y-10 max-w-4xl mx-auto pb-12 ${simPanelOpen ? 'shifted' : ''}`}>
        <button onClick={backToList} className="flex items-center gap-2 text-midnight-400 hover:text-gold transition-colors mb-4 group font-medium text-sm">
          <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </button>

        <div className="border-b border-midnight-200 dark:border-midnight-800 pb-8">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-midnight-900 dark:text-white mb-4">5G Vehicular Fog Computing<br /><span className="text-2xl md:text-4xl">— VFN vs CFN</span></h2>
          <p className="text-base text-midnight-900 dark:text-white font-medium">Final Year Project • NS-3.46 &amp; 5G-LENA Simulation • University of Manchester</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <a href="https://github.com/wooseongjung/v2x-5g-fog-dissertation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-midnight-200 dark:border-midnight-800 text-midnight-900 dark:text-white text-sm font-bold hover:border-gold transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Source Code
            </a>
          </div>
        </div>

        {/* University affiliation */}
        <div className="border border-midnight-200 dark:border-midnight-800 overflow-hidden">
          <div className="px-5 py-3 bg-midnight-50 dark:bg-midnight-900/80 border-b border-midnight-200 dark:border-midnight-800">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-midnight-400">Submitted to</p>
          </div>
          <div className="px-5 py-4 bg-white dark:bg-midnight-900 flex flex-wrap items-center gap-5 border-b border-midnight-200 dark:border-midnight-800">
            <img src="/images/logos/uom_black.png" alt="University of Manchester" className="h-8 object-contain dark:invert" />
            <span className="text-xs text-midnight-900 dark:text-white font-medium">School of Engineering • BEng Advanced Control &amp; Systems Engineering</span>
          </div>
          <div className="px-5 py-3 bg-midnight-50 dark:bg-midnight-900/80 border-b border-midnight-200 dark:border-midnight-800">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-midnight-400">Supervised by</p>
          </div>
          <div className="px-5 py-4 bg-white dark:bg-midnight-900">
            <a href="https://research.manchester.ac.uk/en/persons/k.hamdi" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-midnight-900 dark:text-white hover:text-[#d4a843] transition-colors">Dr. Khairi Hamdi</a>
            <p className="text-xs text-midnight-500 dark:text-midnight-400 font-medium mt-0.5">Senior Lecturer • Department of Electrical &amp; Electronic Engineering</p>
          </div>
        </div>

        <div className="max-w-none text-base text-midnight-900 dark:text-white font-medium space-y-8 leading-relaxed">

          {/* ── 1. Overview ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 1. Overview
            </h3>

            {/* Stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-midnight-200 dark:bg-midnight-800 border border-midnight-200 dark:border-midnight-800 mb-6">
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">2,555</span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Lines C++</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">6</span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Scenarios</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">28<span className="text-xs text-midnight-400"> GHz</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">mmWave</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">6,075</span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Word Count</span>
              </div>
            </div>

            <p><strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">Vehicular Fog Computing (VFC)</strong> extends edge computing into the vehicular domain by using nearby vehicles — particularly public transit buses — as fog nodes for latency-sensitive computations like cooperative perception and collision avoidance.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 mb-6">
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
                  CFN — Cellular Fog Node
                </h4>
                <p>Fixed roadside units (RSUs) co-located with infrastructure. <strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Stable, wide-area coverage</strong> but requires expensive physical deployment.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500" />
                  VFN — Vehicular Fog Node
                </h4>
                <p>Mobile fog servers mounted on buses. <strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Physical proximity &amp; zero infrastructure cost</strong> but mobility-induced radio challenges.</p>
              </div>
            </div>

            <p>Existing platforms like VFogSim <strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">abstract the radio layer entirely</strong> — relying on pre-computed SINR maps that bypass PHY/MAC-layer scheduling, HARQ, and beamforming. This project fills that gap with a full discrete-event simulation coupling <strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">ns-3.46</strong>, the <strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">5G-LENA NR module</strong>, and <strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">SUMO</strong> realistic vehicular traffic.</p>
          </section>

          {/* ── 2. Setup & Environment ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 2. Setup &amp; Environment
            </h3>

            {/* Pipeline */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-6 mb-6">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3">Simulation Pipeline</h4>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {['OpenStreetMap Road Network', '→', 'SUMO Traffic Sim', '→', 'ns-3.46 + 5G-LENA NR', '→', 'CSV Logs + Analysis'].map((step, i) => (
                  step === '→' ? <span key={i} className="text-zinc-300 dark:text-zinc-600 text-base">→</span> : (
                    <span key={i} className="px-2.5 py-1 border border-midnight-200 dark:border-midnight-800 bg-white dark:bg-zinc-800 text-midnight-900 dark:text-white">{step}</span>
                  )
                ))}
              </div>
            </div>

            {/* Network params */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-midnight-200 dark:bg-midnight-800 border border-midnight-200 dark:border-midnight-800 mb-6">
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">28<span className="text-xs text-midnight-400"> GHz</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Carrier (mmWave)</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">100<span className="text-xs text-midnight-400"> MHz</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Bandwidth</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">µ=2<span className="text-xs text-midnight-400"> (60 kHz)</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Numerology / SCS</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-3 text-center">
                <span className="block text-lg font-display font-black text-midnight-900 dark:text-white">23<span className="text-xs text-midnight-400"> dBm</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">TX Power (equal)</span>
              </div>
            </div>

            {/* Experimental design */}
            <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 text-[15px]">Experimental Design</h4>
            <ul className="text-sm text-midnight-900 dark:text-white font-medium space-y-1.5">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">6 scenarios</strong> — 3 density levels (50, 100, 150 vehicles) × 2 architectures (VFN vs CFN)</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Task model</strong> — 2 tasks/s per vehicle (800-byte UDP), 100 ms deadline, M/D/1 queue with 5 ms service time</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Equalised conditions</strong> — identical TX power (23 dBm), same SUMO trace, same network params. Only variable: fog node mobility</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">All traffic cellular-routed</strong> — Car → gNB → Core → gNB → Fog (no direct V2V sidelink)</li>
            </ul>
          </section>

          {/* ── 3. Method & Implementation ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 3. Method &amp; Implementation
            </h3>
            <p>The core simulation is a single <strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">2,555-line C++17 file</strong> (<span className="font-mono text-xs text-midnight-800 dark:text-white">v2x-5g-sumo.cc</span>) implementing three custom ns-3 applications:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-6">
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <p className="font-mono text-sm text-blue-600 dark:text-blue-400 mb-2">VehicleApp</p>
                <p className="text-midnight-900 dark:text-white font-medium text-sm">Each car UE generates <strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">2 tasks/s</strong> (800-byte UDP), sends to nearest fog node by SNR, handles reassociation.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <p className="font-mono text-sm text-blue-600 dark:text-blue-400 mb-2">FogServerApp</p>
                <p className="text-midnight-900 dark:text-white font-medium text-sm"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">M/D/1 queue</strong> with 5 ms deterministic service time. Returns 36-byte response to originating vehicle.</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <p className="font-mono text-sm text-blue-600 dark:text-blue-400 mb-2">BroadcastSenderApp</p>
                <p className="text-midnight-900 dark:text-white font-medium text-sm">Periodic beacon packets for fog discovery. Vehicles measure SNR for association decisions.</p>
              </div>
            </div>

            {/* Reliability pipeline */}
            <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 text-[15px]">End-to-End Reliability Pipeline</h4>
            <p className="text-sm text-midnight-900 dark:text-white font-medium mb-3">Each task is tagged with a unique ID. A post-simulation Python script classifies every task's fate into exactly one of three failure categories:</p>
            <div className="flex flex-wrap items-center gap-2 text-xs my-4">
              {[
                { label: 'Car sends task', color: 'border-green-300 dark:border-green-700 text-green-800 dark:text-green-300' },
                { label: '→' },
                { label: '① Pre-Fog Loss', color: 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10' },
                { label: 'Fog receives', color: 'border-midnight-200 dark:border-midnight-800' },
                { label: '→' },
                { label: '② Deadline Miss', color: 'border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-500/10' },
                { label: 'Fog replies', color: 'border-midnight-200 dark:border-midnight-800' },
                { label: '→' },
                { label: '③ Return-Path Loss', color: 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10' },
                { label: 'Car receives ✓', color: 'border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-500/10' },
              ].map((step, i) => (
                step.label === '→' ? <span key={i} className="text-zinc-300 dark:text-zinc-600 text-base">→</span> : (
                  <span key={i} className={`px-2 py-1 border ${step.color || 'border-midnight-200 dark:border-midnight-800 text-midnight-900 dark:text-white'}`}>{step.label}</span>
                )
              ))}
            </div>

            {/* Technical challenges */}
            <h4 className="font-display font-bold text-midnight-900 dark:text-white mt-5 mb-2 text-[15px]">Technical Challenges Solved</h4>
            <div className="space-y-3">
              <div className="pl-5 border-l-2 border-orange-300 dark:border-orange-700">
                <p className="text-sm"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">NR Attach Crash</strong> — 5G-LENA crashed when SUMO-spawned vehicles started outside gNB coverage. Built custom <code className="font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">SafeAttach</code> with distance-based SNR checks.</p>
              </div>
              <div className="pl-5 border-l-2 border-orange-300 dark:border-orange-700">
                <p className="text-sm"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">TX Power Equalisation</strong> — Initial results showed massive CFN advantage (40 dBm vs 23 dBm). Re-equalised both to 23 dBm and re-ran all 6 scenarios.</p>
              </div>
              <div className="pl-5 border-l-2 border-orange-300 dark:border-orange-700">
                <p className="text-sm"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">RLC Trace Connection</strong> — NR module's downlink RLC trace wasn't firing callbacks. Debugged 5G-LENA source to find correct trace path.</p>
              </div>
            </div>
          </section>

          {/* ── 4. Data Collection ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 4. Data Collection
            </h3>
            <ul className="text-sm text-midnight-900 dark:text-white font-medium space-y-1.5">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">6 scenarios run</strong> — 3 vehicle densities (50, 100, 150) × 2 architectures (VFN vs CFN)</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Each scenario</strong> — 60-second simulation using SUMO realistic traffic on Manchester road network</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Per-task unique ID tracking</strong> — every task tagged at creation and traced through the full send → fog → return pipeline</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">CSV logs collected</strong> — per-task send/receive timestamps, fog queue events, and failure classification for post-simulation Python analysis</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Metrics</strong> — E2E reliability, completion delay, fog queue delay, throughput, and failure classification (pre-fog loss, deadline miss, return-path loss)</li>
            </ul>
          </section>

          {/* ── 5. Results & Analysis ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 5. Results &amp; Analysis
            </h3>

            {/* Key results stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-midnight-200 dark:bg-midnight-800 border border-midnight-200 dark:border-midnight-800 mb-6">
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-display font-black text-midnight-900 dark:text-white">95.4<span className="text-sm text-midnight-400">%</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">E2E @ 50 veh</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-display font-black text-midnight-900 dark:text-white">85<span className="text-sm text-midnight-400">%</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">E2E @ 100 veh</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-display font-black text-red-600 dark:text-red-400">&lt;52<span className="text-sm">%</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">E2E @ 150 veh</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 text-center">
                <span className="block text-2xl font-display font-black text-midnight-900 dark:text-white">4.4<span className="text-sm text-midnight-400">pp</span></span>
                <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">VFN–CFN gap</span>
              </div>
            </div>

            <p className="text-midnight-900 dark:text-white font-medium text-sm mb-4">Use the <strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Cross-Density Comparison</strong> view for aggregate VFN vs CFN trends, or drill into <strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">Single Scenario Detail</strong> for delay distributions, velocity-failure curves, and Manchester map animation.</p>
            <PreRunResults />
          </section>

          {/* ── 6. Key Findings ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 6. Key Findings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 text-sm">① Radio is the Bottleneck</h4>
                <ul className="text-sm text-midnight-900 dark:text-white font-medium space-y-1">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />Fog queue delays stay below <span className="font-mono text-midnight-800 dark:text-white">0.21 ms</span></li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />Fog success rates exceed <span className="font-mono text-midnight-800 dark:text-white">99%</span> even at 150 vehicles</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">&gt;95% of all failures</strong> are pre-fog uplink losses</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 text-sm">② Scalability Cliff at ~50 veh/gNB</h4>
                <ul className="text-sm text-midnight-900 dark:text-white font-medium space-y-1">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />Super-linear degradation: 95% → 85% → &lt;52%</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />150 vehicles = ~50 veh/gNB = <span className="font-mono text-midnight-800 dark:text-white">100 UL tx/s per cell</span></li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />Near practical uplink capacity of 100 MHz mmWave</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 text-sm">③ Velocity-Dependent VFN Degradation</h4>
                <ul className="text-sm text-midnight-900 dark:text-white font-medium space-y-1">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />VFN failure: <span className="font-mono text-midnight-800 dark:text-white">3.5%</span> at 0–10 km/h → <span className="font-mono text-midnight-800 dark:text-white">11.5%</span> at 50–60 km/h</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />CFN stays flat at 3.4–4.6% regardless of speed</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />Caused by Doppler spread at 28 GHz mmWave</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-5">
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 text-sm">④ Coverage vs Proximity Trade-off</h4>
                <ul className="text-sm text-midnight-900 dark:text-white font-medium space-y-1">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />CFN achieves <span className="font-mono text-midnight-800 dark:text-white">~40%</span> higher absolute throughput at 150 veh</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />At 50 vehicles both achieve identical <span className="font-mono text-midnight-800 dark:text-white">99.5%</span> success</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" />VFN matches CFN at low density with zero infrastructure cost</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── 7. Development Timeline ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 7. Development Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[11px] text-midnight-400 whitespace-nowrap pt-0.5 w-24 shrink-0">SEM 1 W1-12</span>
                <div className="pl-5 border-l-2 border-blue-400 dark:border-blue-600">
                  <p className="text-sm text-midnight-900 dark:text-white font-medium">Literature review, ns-3/5G-LENA setup, SUMO trace generation, system modelling, prototype scaffold</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[11px] text-midnight-400 whitespace-nowrap pt-0.5 w-24 shrink-0">SEM 2 W13-18</span>
                <div className="pl-5 border-l-2 border-orange-400 dark:border-orange-600">
                  <p className="text-sm text-midnight-900 dark:text-white font-medium">Full simulation implementation (<span className="font-mono text-midnight-800 dark:text-white">v2x-5g-sumo.cc</span>), debugging NR attach crash &amp; RLC trace issues</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[11px] text-midnight-400 whitespace-nowrap pt-0.5 w-24 shrink-0">SEM 2 W19-20</span>
                <div className="pl-5 border-l-2 border-purple-400 dark:border-purple-600">
                  <p className="text-sm text-midnight-900 dark:text-white font-medium">Parameter equalisation (TX power 23 dBm), re-ran all 6 scenarios</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[11px] text-midnight-400 whitespace-nowrap pt-0.5 w-24 shrink-0">SEM 2 W21-24</span>
                <div className="pl-5 border-l-2 border-green-400 dark:border-green-600">
                  <p className="text-sm text-midnight-900 dark:text-white font-medium">Python analysis scripts, result plotting, dissertation writing &amp; submission</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 8. Conclusion & Future Work ── */}
          <section>
            <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d4a843]" /> 8. Conclusion &amp; Future Work
            </h3>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-midnight-200 dark:border-midnight-800 p-6 rounded-sm">
              <p className="mb-4">VFN on public transport is a <strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">cost-effective alternative</strong> to fixed RSUs under moderate traffic. The 4.4pp gap at 150 vehicles is entirely from mobility-induced reassociation — at 50 and 100 vehicles, the two architectures are statistically indistinguishable.</p>
              <p className="mb-4">The dominant bottleneck is the <strong className="font-bold text-midnight-800 dark:text-white underline decoration-violet/40 decoration-2 underline-offset-4">shared 5G NR uplink spectrum</strong>, not fog compute capacity. Future VFC designs should prioritise radio resource management over fog-layer enhancements.</p>
              <div className="border-t border-midnight-200 dark:border-midnight-800 pt-3 mt-3">
                <h5 className="font-display font-bold text-midnight-900 dark:text-white mb-3 text-sm">Recommended Future Work</h5>
                <ul className="text-sm text-midnight-900 dark:text-white font-medium space-y-2">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">Multi-connectivity</strong> — dual-link to multiple gNBs to spread uplink load</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">Direct V2V Sidelink (PC5)</strong> — bypass the gNB to eliminate the double-hop penalty</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">Energy analysis</strong> — power consumption of fog servers on battery-powered buses</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] shrink-0 mt-1.5" /><strong className="font-bold text-midnight-800 dark:text-white underline decoration-gold/40 decoration-2 underline-offset-4">Hybrid VFN+CFN</strong> — velocity-aware dynamic routing between VFN and CFN</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default FYPDetail;
