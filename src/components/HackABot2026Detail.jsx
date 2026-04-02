import React from 'react';
import { ArrowRight } from 'lucide-react';

const HackABot2026Detail = ({ backToList }) => {
  return (
    <div className="space-y-10 animate-fade-up max-w-4xl pb-12">
      <button onClick={backToList} className="flex items-center gap-2 text-midnight-400 hover:text-gold transition-colors mb-4 group font-semibold text-sm">
        <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
        Back to Projects
      </button>

      <div className="border-b border-midnight-200 dark:border-midnight-700 pb-8">
        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-midnight-900 dark:text-white mb-4">GridBox — Smart Factory Controller</h2>
        <p className="text-base text-midnight-500 dark:text-midnight-400 font-medium">Hack-A-Bot 2026 • Robosoc • University of Manchester</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
            24-Hour Hackathon
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300 text-sm font-bold">
            Sustainability + Autonomy
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://github.com/doyun-gu/hack-a-bot-2026" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-midnight-100 dark:bg-midnight-800 border border-midnight-200 dark:border-midnight-700 text-midnight-700 dark:text-midnight-300 text-sm font-bold hover:border-midnight-400 dark:hover:border-midnight-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Source Code
          </a>
        </div>
      </div>

      {/* Hero image */}
      <div className="overflow-hidden border border-midnight-200 dark:border-midnight-700">
        <img src="/images/hackabot-2026/hero.jpeg" alt="GridBox smart factory — workbench with dual Pico controllers, power electronics, conveyor, and wiring" className="w-full h-auto max-h-[480px] object-cover" />
        <p className="text-xs text-midnight-400 dark:text-midnight-500 px-4 py-2 bg-midnight-50 dark:bg-midnight-900">The GridBox build — dual Pico controllers, power electronics, IMU sensor, conveyor line, and SCADA display on the workbench during the 24-hour hackathon.</p>
      </div>

      {/* Sponsors & Organisations */}
      <div className="border border-midnight-200 dark:border-midnight-700 overflow-hidden">
        <div className="px-5 py-3 bg-midnight-50 dark:bg-midnight-900/80 border-b border-midnight-200 dark:border-midnight-700 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-midnight-400">Organised &amp; Sponsored by</p>
          <span className="font-mono text-[10px] text-midnight-300 dark:text-midnight-600">14 partners</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-[1px] bg-midnight-100 dark:bg-midnight-800">
          {[
            { src: '/images/logos/robosoc.svg', alt: 'Robosoc' },
            { src: '/images/logos/eeesoc.svg', alt: 'EEESoc', invert: true },
            { src: '/images/logos/makerspace.png', alt: 'Makerspace', lightBg: true },
            { src: '/images/logos/uom_black.png', alt: 'University of Manchester', invert: true },
            { src: '/images/logos/ARM.svg', alt: 'ARM', invert: true, highlight: true },
            { src: '/images/logos/quanser.svg', alt: 'Quanser', invert: true },
            { src: '/images/logos/cradle.png', alt: 'Cradle', invertLight: true },
            { src: '/images/logos/Amentum.svg', alt: 'Amentum', invert: true },
            { src: '/images/logos/icenine.svg', alt: 'Ice Nine', invert: true },
            { src: '/images/logos/gdg.png', alt: 'Google Developer Groups', lightBg: true },
            { src: '/images/logos/ukri.png', alt: 'UKRI', lightBg: true },
            { src: '/images/logos/raico.png', alt: 'RAICo', lightBg: true },
            { src: '/images/logos/Dominos.svg', alt: "Domino's", invert: true },
            { src: '/images/logos/redbull.png', alt: 'Red Bull', invertLight: true },
          ].map((logo, i) => (
            <div key={i} className={`relative group flex items-center justify-center h-16 md:h-[72px] transition-all duration-300 ${logo.lightBg ? 'bg-white dark:bg-midnight-200' : 'bg-white dark:bg-midnight-900'} ${logo.highlight ? 'ring-1 ring-inset ring-[#e8734a]/30' : 'hover:bg-midnight-50 dark:hover:bg-midnight-800/60'}`}>
              <img src={logo.src} alt={logo.alt} className={`max-h-8 md:max-h-10 max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105 ${logo.invert ? 'dark:invert' : ''} ${logo.invertLight ? 'invert dark:invert-0' : ''}`} title={logo.alt} />
              {logo.highlight && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8734a]/50" />}
            </div>
          ))}
        </div>
        <div className="px-5 py-2.5 bg-midnight-50 dark:bg-midnight-900/80 border-t border-midnight-200 dark:border-midnight-700">
          <p className="text-[11px] text-midnight-400 font-medium">Our project was directly sponsored by <strong className="font-semibold text-[#e8734a]">ARM</strong></p>
        </div>
      </div>

      <div className="max-w-none text-[15px] text-midnight-600 dark:text-midnight-400 space-y-8 leading-relaxed">

        {/* ── 1. Overview ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 1. Overview
          </h3>
          <p className="text-base font-medium">A <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">£15 smart factory controller</strong> — a miniature water bottling / sorting plant powered by recycled energy. Two <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">Raspberry Pi Pico 2</strong> boards work together wirelessly: one controls the factory floor, the other is a remote SCADA monitoring station. The energy recycling system achieved <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">69% energy savings</strong> compared to conventional operation, replacing £162,000 worth of industrial systems with £15 of hardware.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-midnight-200 dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-700 mt-4">
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-2xl font-display font-black text-[#e8734a]">£15</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Total BOM</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-2xl font-display font-black text-[#e8734a]">44k<span className="text-sm text-midnight-400">+</span></span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Lines of Code</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-2xl font-display font-black text-[#e8734a]">259</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Source Files</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-2xl font-display font-black text-[#e8734a]">4</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Firmware Versions</span>
            </div>
          </div>
        </section>

        {/* ── 2. System Architecture ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 2. System Architecture
          </h3>

          <div className="bg-midnight-50 dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-6 mb-6">
            <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3">Data Flow</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {['SENSE (ADC + IMU)', '→', 'DECIDE (Power balance)', '→', 'ACT (PWM + GPIO)', '→', 'REPORT (nRF → SCADA)'].map((step, i) => (
                step === '→' ? <span key={i} className="text-midnight-300 dark:text-midnight-600 text-base">→</span> : (
                  <span key={i} className="px-2.5 py-1 border border-midnight-200 dark:border-midnight-700 bg-white dark:bg-midnight-800 text-midnight-700 dark:text-midnight-300">{step}</span>
                )
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">PICO A</span>
                Grid Controller
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">RP2350 dual-core</strong> — Core 0: control loop (100 Hz), Core 1: fault detection</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>ADC voltage + current sensing (3 channels)</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>PCA9685 PWM for motor + servo control</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>GPIO MOSFET power switching</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>nRF24L01+ wireless TX to SCADA</span></li>
              </ul>
            </div>
            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">PICO B</span>
                SCADA Station
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">OLED dashboard</strong> — 4-view live telemetry</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>MAX7219 7-segment display — live status</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>nRF24L01+ wireless RX + command TX</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Remote monitoring without physical connection</span></li>
              </ul>
            </div>
            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">POWER</span>
                Power System
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>12V PSU → LM2596S buck → 5V regulated</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>300W Buck-boost for 6–12V motor power</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>1Ω sense resistors for current measurement</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Autonomous power rerouting + capacitor bank</span></li>
              </ul>
            </div>
            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">FACTORY</span>
                Production Line
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Motor 1: pump — fills bottles from water source</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Servo 1: valve — controls fill volume</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Motor 2: conveyor — transports bottles</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Servo 2: sort gate — pass/reject quality check</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 3. Key Features ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 3. Key Features
          </h3>

          <h4 className="font-display font-bold text-midnight-800 dark:text-white mb-2 text-sm">Energy Recycling</h4>
          <p className="text-base font-medium text-midnight-600 dark:text-midnight-400 mb-3">The system senses where power is wasted, autonomously reroutes excess to where it's needed, and stores surplus in a capacitor bank. Utilisation improved from <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">72% → 95%</strong> in smart mode vs dumb mode, delivering <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">69% energy savings</strong> validated end-to-end during the live demo.</p>

          <h4 className="font-display font-bold text-midnight-800 dark:text-white mt-5 mb-2 text-sm">IMU Fault Detection (ISO 10816)</h4>
          <p className="text-base font-medium text-midnight-600 dark:text-midnight-400 mb-3">Vibration signatures from the BMI160 IMU are processed in real time on Core 1 — faults are detected and acted upon within <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">100ms</strong> of onset using ISO 10816 RMS acceleration thresholds.</p>
          <div className="bg-midnight-50 dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5 mb-4">
            <div className="space-y-2 text-sm text-midnight-600 dark:text-midnight-400">
              <div className="flex gap-3 items-start">
                <span className="font-mono text-xs font-semibold text-green-600 dark:text-green-400 w-20 shrink-0 pt-0.5">HEALTHY</span>
                <p>a<sub>rms</sub> &lt; 1g — normal operation, green LED</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-mono text-xs font-semibold text-yellow-600 dark:text-yellow-400 w-20 shrink-0 pt-0.5">WARNING</span>
                <p>1g ≤ a<sub>rms</sub> &lt; 2g — alert sent, monitor closely</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="font-mono text-xs font-semibold text-red-600 dark:text-red-400 w-20 shrink-0 pt-0.5">FAULT</span>
                <p>a<sub>rms</sub> ≥ 2g for 3s — GPIO disconnects motor, reroutes power</p>
              </div>
            </div>
          </div>

          <h4 className="font-display font-bold text-midnight-800 dark:text-white mt-5 mb-2 text-sm">Autonomous Load Shedding</h4>
          <p className="text-base font-medium text-midnight-600 dark:text-midnight-400">When total power exceeds budget, the system autonomously sheds lowest-priority loads (LEDs first), and when excess becomes available, reroutes it to under-powered motors or the capacitor bank. The entire process operates with <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">zero human input</strong> — fully autonomous from detection through to recovery.</p>
        </section>

        {/* ── 4. Method — Wireless Protocol & Sensing ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 4. Method — Wireless Protocol &amp; Sensing
          </h3>

          <div className="space-y-3">
            <div className="pl-5 border-l-2 border-[#e8734a]/40">
              <p className="text-base font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">nRF24L01+ Protocol</strong> — Custom binary packets transmitted at 50Hz refresh rate between the Grid Controller (Pico A) and the SCADA Station (Pico B). Zero packet errors recorded over 200+ test packets. The protocol carries live sensor telemetry — voltage, current, power, IMU state, and system health — wirelessly to the monitoring dashboard.</p>
            </div>
            <div className="pl-5 border-l-2 border-[#e8734a]/40">
              <p className="text-base font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">Current-Based Weight Sorting</strong> — The system uses motor current fluctuations to categorise items by weight. Heavier items draw more current during conveyor transport, which the ADC senses in real time. The firmware classifies each item based on the current signature and actuates the sort gate accordingly — no dedicated load cell required.</p>
            </div>
            <div className="pl-5 border-l-2 border-[#e8734a]/40">
              <p className="text-base font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">Power Measurement</strong> — ADC reads voltage through 10kΩ + 10kΩ voltage dividers (halving the input for safe 3.3V ADC range). Current is measured via 1Ω sense resistors (V = IR, so voltage across the resistor equals current directly). Power is calculated in firmware at the 100Hz control loop rate, enabling real-time energy accounting across all subsystems.</p>
            </div>
          </div>
        </section>

        {/* ── 5. My Contribution ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 5. My Contribution
          </h3>
          <div className="space-y-3">
            <div className="pl-5 border-l-2 border-[#e8734a]/40">
              <p className="text-base font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">Electronics design &amp; wiring</strong> — Designed the full circuit: voltage dividers for safe ADC sensing, MOSFET switching circuits with sense resistors, I2C bus layout for BMI160 IMU + PCA9685 servo driver, and nRF24L01+ wireless integration.</p>
            </div>
            <div className="pl-5 border-l-2 border-[#e8734a]/40">
              <p className="text-base font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">Circuit schematics &amp; test logs</strong> — Produced complete wiring documentation, pin mapping tables, and hardware test procedures used during the 24-hour build.</p>
            </div>
            <div className="pl-5 border-l-2 border-[#e8734a]/40">
              <p className="text-base font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#e8734a]/40 decoration-2 underline-offset-4">Power system</strong> — Buck converter and buck-boost converter wiring, current sensing via 1Ω shunt resistors, and voltage divider (10kΩ + 10kΩ) for safe ADC measurement.</p>
            </div>
          </div>
        </section>

        {/* ── 6. Result & Demo ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 6. Result &amp; Demo
          </h3>

          <div className="grid grid-cols-3 gap-px bg-midnight-200 dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-700 mb-6">
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-2xl font-display font-black text-[#e8734a]">69<span className="text-sm text-midnight-400">%</span></span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Energy Saved</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-2xl font-display font-black text-[#e8734a]">100<span className="text-sm text-midnight-400">ms</span></span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Fault Detection</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-2xl font-display font-black text-[#e8734a]">0</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Packet Errors</span>
            </div>
          </div>

          <p className="text-base font-medium text-midnight-600 dark:text-midnight-400 mb-6">The live demo showcased the full factory operating autonomously — conveyor transporting and sorting items by weight, pump filling bottles, and the energy recycling system rerouting power in real time. Fault injection was demonstrated live: shaking the IMU triggered the fault detection pipeline, which disconnected the affected motor and redistributed its power within 100ms. The wireless SCADA station displayed all telemetry from across the room with zero packet loss.</p>

          <div className="border border-[#e8734a]/30 bg-[#e8734a]/5 dark:bg-[#e8734a]/5 p-6 rounded-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚡</span>
              <div>
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-1">Hack-A-Bot 2026</h4>
                <p className="text-base font-medium text-midnight-600 dark:text-midnight-400">Presented at the Robosoc 24-hour hackathon, University of Manchester. The judges highlighted the sophisticated power management system, wireless SCADA architecture, and the level of engineering theory applied to a hackathon project.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Engineering Theory Applied ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 7. Engineering Theory Applied
          </h3>
          <div className="bg-midnight-50 dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-midnight-600 dark:text-midnight-400">
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white">KCL</strong> — Power bus current balance</div>
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white">KVL</strong> — Voltage drop analysis</div>
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white">Affinity Laws</strong> — P ∝ n³ (20% slower = 49% less power)</div>
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white">PWM Control</strong> — V<sub>eff</sub> = D × V<sub>supply</sub></div>
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white">RMS Vibration</strong> — ISO 10816 fault thresholds</div>
              <div className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white">Voltage Divider</strong> — Safe ADC measurement</div>
            </div>
          </div>
        </section>

        {/* ── Build Gallery ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> Build Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="border border-midnight-200 dark:border-midnight-700 overflow-hidden group">
              <img src="/images/hackabot-2026/chassis_assembled.jpeg" alt="Chassis assembled" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <p className="text-[11px] text-midnight-400 px-2 py-1 bg-midnight-50 dark:bg-midnight-900">Chassis — conveyor &amp; sort gate</p>
            </div>
            <div className="border border-midnight-200 dark:border-midnight-700 overflow-hidden group">
              <img src="/images/hackabot-2026/workbench.jpeg" alt="Workbench during build" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <p className="text-[11px] text-midnight-400 px-2 py-1 bg-midnight-50 dark:bg-midnight-900">Workbench — Pico &amp; power electronics</p>
            </div>
            <div className="border border-midnight-200 dark:border-midnight-700 overflow-hidden group">
              <img src="/images/hackabot-2026/oled_live.jpeg" alt="OLED SCADA display showing live telemetry" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <p className="text-[11px] text-midnight-400 px-2 py-1 bg-midnight-50 dark:bg-midnight-900">OLED — live SCADA telemetry</p>
            </div>
            <div className="border border-midnight-200 dark:border-midnight-700 overflow-hidden group">
              <img src="/images/hackabot-2026/conveyor_closeup.jpeg" alt="Conveyor belt closeup with items" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <p className="text-[11px] text-midnight-400 px-2 py-1 bg-midnight-50 dark:bg-midnight-900">Conveyor — weight sorting</p>
            </div>
          </div>
        </section>

        {/* ── 8. Key Takeaways ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e8734a]" /> 8. Key Takeaways
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-800 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 text-sm">What Worked</h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-2">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Dual-core architecture allowed 100Hz control + parallel fault monitoring</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Wireless SCADA eliminated physical connection dependency — could monitor from across the room</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>ISO 10816 vibration thresholds provided industry-standard fault detection</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Energy recycling system worked end-to-end — 69% savings validated in demo</span></li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-800 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 text-sm">Areas for Improvement</h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-2">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Single ADC channel multiplexing limited simultaneous sensing resolution</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>nRF24L01+ range was tested only at short distance — scalability to full factory floor untested</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>Weight-based sorting accuracy depends on consistent conveyor speed</span></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8734a] mt-1.5 shrink-0" /> <span>No persistent data logging — SCADA displays live data only</span></li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HackABot2026Detail;
