import React from 'react';
import { ArrowRight } from 'lucide-react';

const HackABot2025Detail = ({ backToList }) => {
  return (
    <div className="space-y-10 max-w-4xl pb-12">
      <button onClick={backToList} className="flex items-center gap-2 text-midnight-400 hover:text-gold transition-colors mb-4 group font-semibold text-sm">
        <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
        Back to Projects
      </button>

      <div className="border-b border-midnight-200 dark:border-midnight-700 pb-8">
        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-midnight-900 dark:text-white mb-4">AI Classroom Camera</h2>
        <p className="text-base text-midnight-500 dark:text-midnight-400 font-medium">Hack-A-Bot 2025 • Robosoc • University of Manchester</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-sm font-bold">
            <span className="text-amber-500">🥉</span> 3rd Place
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
            24-Hour Hackathon
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://github.com/JBIS1104/HACK-A-BOT2025" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-midnight-100 dark:bg-midnight-800 border border-midnight-200 dark:border-midnight-700 text-midnight-700 dark:text-midnight-300 text-sm font-bold hover:border-midnight-400 dark:hover:border-midnight-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Source Code
          </a>
          <a href="https://youtube.com/shorts/Sxucuh2GTYQ" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm font-bold hover:border-red-400 dark:hover:border-red-500 transition-colors">
            ▶ Demo Video
          </a>
        </div>
      </div>

      {/* Hero image */}
      <div className="overflow-hidden border border-midnight-200 dark:border-midnight-700">
        <img src="/images/hackabot-2025/hero.jpeg" alt="AI Classroom Camera — Raspberry Pi AI Camera in 3D-printed mount with Hack-A-Bot 2025 Group 21 dashboard on laptop" className="w-full h-auto max-h-[520px] object-cover" />
        <p className="text-[13px] text-midnight-400 dark:text-midnight-500 px-4 py-2 bg-midnight-50 dark:bg-midnight-900">The AI Camera system — Raspberry Pi with IMX500 sensor in a custom 3D-printed mount, with the Group 21 dashboard running on the laptop behind.</p>
      </div>

      {/* Sponsors & Organisations */}
      <div className="border border-midnight-200 dark:border-midnight-700 overflow-hidden">
        <div className="px-5 py-3 bg-midnight-50 dark:bg-midnight-900/80 border-b border-midnight-200 dark:border-midnight-700 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold text-midnight-400">Organised &amp; Sponsored by</p>
          <span className="font-mono text-[10px] text-midnight-300 dark:text-midnight-600">8 partners</span>
        </div>
        <div className="grid grid-cols-4 gap-[1px] bg-midnight-100 dark:bg-midnight-800">
          {[
            { src: '/images/logos/uom_black.png', alt: 'University of Manchester', invert: true },
            { src: '/images/logos/robosoc.svg', alt: 'Robosoc' },
            { src: '/images/logos/Amentum.svg', alt: 'Amentum', invert: true },
            { src: '/images/logos/cradle.png', alt: 'Cradle', invertLight: true },
            { src: '/images/logos/Dominos.svg', alt: "Domino's", invert: true },
            { src: '/images/logos/icenine.svg', alt: 'Ice Nine', invert: true },
            { src: '/images/logos/makerspace.png', alt: 'Makerspace', lightBg: true },
            { src: '/images/logos/redbull.png', alt: 'Red Bull', invertLight: true },
          ].map((logo, i) => (
            <div key={i} className={`group flex items-center justify-center h-16 md:h-[72px] transition-all duration-300 ${logo.lightBg ? 'bg-white dark:bg-midnight-200' : 'bg-white dark:bg-midnight-900'} hover:bg-midnight-50 dark:hover:bg-midnight-800/60`}>
              <img src={logo.src} alt={logo.alt} className={`max-h-8 md:max-h-10 max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105 ${logo.invert ? 'dark:invert' : ''} ${logo.invertLight ? 'invert dark:invert-0' : ''}`} title={logo.alt} />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-none text-[15px] text-midnight-600 dark:text-midnight-400 space-y-8 leading-relaxed">

        {/* ── 1. Overview ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5b9cf5]" /> 1. Overview
          </h3>
          <p className="text-base font-medium">A unified AI camera system that automates <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">classroom attendance tracking</strong> and <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">attentiveness monitoring</strong> in real time. Traditional classrooms handle these as two separate manual tasks — this project merges both into a single on-device AI pipeline running on a <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Raspberry Pi AI Camera</strong> (IMX500 vision sensor).</p>
          <p className="text-base font-medium">The system outputs three live metrics per frame, served as a JSON payload via a <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Flask HTTP endpoint</strong> consumable by any dashboard or display.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-midnight-200 dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-700 mt-4">
            <div className="bg-white dark:bg-midnight-900 p-3 text-center">
              <span className="block text-2xl font-display font-black text-[#5b9cf5]">17</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Keypoints / Person</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-3 text-center">
              <span className="block text-2xl font-display font-black text-[#5b9cf5]">&gt;0.3</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Confidence Threshold</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-3 text-center">
              <span className="block text-2xl font-display font-black text-[#5b9cf5]">3</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Live Metrics</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-3 text-center">
              <span className="block text-2xl font-display font-black text-[#5b9cf5]">24<span className="text-sm text-midnight-400">h</span></span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Build Time</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-midnight-200 dark:bg-midnight-700 border border-midnight-200 dark:border-midnight-700 mt-4">
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-lg font-mono font-medium text-midnight-900 dark:text-white">attendance</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">% Present</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-lg font-mono font-medium text-midnight-900 dark:text-white">questions</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Hands raised</span>
            </div>
            <div className="bg-white dark:bg-midnight-900 p-4 text-center">
              <span className="block text-lg font-mono font-medium text-midnight-900 dark:text-white">understand</span>
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-midnight-400">Present, not raising</span>
            </div>
          </div>
        </section>

        {/* ── 2. System Architecture ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5b9cf5]" /> 2. System Architecture
          </h3>

          <div className="bg-midnight-50 dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-6 mb-6">
            <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3">Pipeline</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {['IMX500 Camera', '→', 'PoseNet (on-device)', '→', 'Confidence Filter (>0.3)', '→', 'Hand-Raise Check', '→', 'Metrics Calc', '→', 'Flask JSON API'].map((step, i) => (
                step === '→' ? <span key={i} className="text-midnight-300 dark:text-midnight-600 text-base">→</span> : (
                  <span key={i} className="px-2.5 py-1 border border-midnight-200 dark:border-midnight-700 bg-white dark:bg-midnight-800 text-midnight-700 dark:text-midnight-300 font-medium">{step}</span>
                )
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">CV</span>
                On-Device Pose Estimation
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> PoseNet model deployed directly onto <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">IMX500 sensor</strong> — zero cloud dependency</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> 17-point body keypoints per person (34-element flat array of x,y pairs)</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Each keypoint carries a confidence score from <strong className="font-bold text-midnight-800 dark:text-white">0.0 to 1.0</strong></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Skeleton lines drawn between connected joints via <code className="font-mono text-[13px] bg-midnight-100 dark:bg-midnight-800 px-1 py-0.5 rounded">cv2.line</code></li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Uses <code className="font-mono text-[13px] bg-midnight-100 dark:bg-midnight-800 px-1 py-0.5 rounded">modlib</code> SDK for IMX500 integration and frame capture</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">LOGIC</span>
                Hand-Raise Detection
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Compares wrist keypoints (9 &amp; 10) against shoulder keypoints (5 &amp; 6)</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Only runs on keypoints with <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">confidence &gt;0.3</strong> to suppress noise from occluded joints</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> If wrist y &lt; shoulder y → hand is raised (screen coords: y increases downward)</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Green circle drawn above head for visual feedback on hands raised</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Live annotated frame display via <code className="font-mono text-[13px] bg-midnight-100 dark:bg-midnight-800 px-1 py-0.5 rounded">frame.display()</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 3. Method — Hand-Raise Detection ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5b9cf5]" /> 3. Method — Hand-Raise Detection
          </h3>

          <p className="text-base font-medium">The core detection algorithm translates raw <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">PoseNet</strong> output into three classroom metrics. Each frame produces N skeletons (one per detected person), and each skeleton is a flat 34-element array encoding 17 keypoint (x, y) pairs.</p>

          <div className="bg-midnight-50 dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-6 my-4">
            <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3">Detection Pipeline</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {['Raw Frame', '→', 'IMX500 PoseNet', '→', '17 Keypoints × N People', '→', 'Confidence Filter (>0.3)', '→', 'Wrist vs Shoulder Y-Check', '→', 'Metrics JSON'].map((step, i) => (
                step === '→' ? <span key={i} className="text-midnight-300 dark:text-midnight-600 text-base">→</span> : (
                  <span key={i} className="px-2.5 py-1 border border-midnight-200 dark:border-midnight-700 bg-white dark:bg-midnight-800 text-midnight-700 dark:text-midnight-300 font-medium">{step}</span>
                )
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-midnight-100 dark:bg-midnight-800 text-midnight-600 dark:text-midnight-400 border border-midnight-200 dark:border-midnight-700">STEP 1</span>
                Keypoint Extraction
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> PoseNet outputs <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">17 body keypoints</strong> as a 34-element flat array — consecutive (x, y) pairs</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Keypoint indices: 0 = nose, 5–6 = shoulders, 9–10 = wrists, 11–12 = hips, 15–16 = ankles</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Each keypoint carries a <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">confidence score</strong> ranging from 0.0 (no detection) to 1.0 (certain)</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-midnight-100 dark:bg-midnight-800 text-midnight-600 dark:text-midnight-400 border border-midnight-200 dark:border-midnight-700">STEP 2</span>
                Confidence Filtering
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Only keypoints with confidence <strong className="font-bold text-midnight-800 dark:text-white">&gt;0.3</strong> are used for any downstream logic</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> This filters noise from occluded, off-frame, or partially visible body parts</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> The 0.3 threshold balances false positive suppression against detection sensitivity</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-midnight-100 dark:bg-midnight-800 text-midnight-600 dark:text-midnight-400 border border-midnight-200 dark:border-midnight-700">STEP 3</span>
                Hand-Raise Logic
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Compare <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">wrist y-position</strong> (index 9 or 10) against <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">shoulder y-position</strong> (index 5 or 6)</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> If wrist y &lt; shoulder y → hand is raised (screen coordinates: y increases downward)</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> A <strong className="font-bold text-midnight-800 dark:text-white">green circle</strong> is drawn above the detected person's head for visual feedback</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-midnight-100 dark:bg-midnight-800 text-midnight-600 dark:text-midnight-400 border border-midnight-200 dark:border-midnight-700">STEP 4</span>
                Metric Derivation
              </h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Attendance</strong> = number of detected skeletons with &gt;0.3 confidence on key joints</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Questions</strong> = count of people with at least one hand raised</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Understanding</strong> = present students NOT raising hands (attentive, not signalling confusion)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 4. My Contribution ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5b9cf5]" /> 4. My Contribution
          </h3>
          <div className="space-y-3">
            <div className="pl-5 border-l-2 border-[#5b9cf5]/40">
              <p className="text-sm font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Custom CAD mount</strong> — Designed a 3D-printable camera mount for classroom deployment, positioning the AI Camera at optimal angle for full-room coverage.</p>
            </div>
            <div className="pl-5 border-l-2 border-[#5b9cf5]/40">
              <p className="text-sm font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Computer vision pipeline</strong> — Integrated the PoseNet model with the IMX500 sensor, implemented the keypoint extraction and hand-raise detection logic, and built the confidence filtering system.</p>
            </div>
            <div className="pl-5 border-l-2 border-[#5b9cf5]/40">
              <p className="text-sm font-medium"><strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">Flask API endpoint</strong> — Built the HTTP JSON output layer that serves real-time metrics to any connected dashboard, enabling plug-and-play integration with classroom displays.</p>
            </div>
          </div>
        </section>

        {/* ── 5. Result & Demo ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5b9cf5]" /> 5. Result &amp; Demo
          </h3>

          <a href="https://youtube.com/shorts/Sxucuh2GTYQ" target="_blank" rel="noopener noreferrer">
            <div className="border border-midnight-200 dark:border-midnight-700 bg-midnight-50 dark:bg-midnight-900 p-6 text-center hover:border-midnight-400 dark:hover:border-midnight-500 transition-colors">
              <span className="text-4xl">▶</span>
              <p className="text-sm mt-2 text-midnight-600 dark:text-midnight-400 font-medium">Watch the demo (YouTube Short)</p>
            </div>
          </a>

          <p className="mt-4 text-base font-medium">The demo shows the full system running live — skeleton overlays drawn on each detected person, green circles appearing above heads when a hand-raise is detected, and real-time metric counters updating per frame. The annotated video feed and JSON output run simultaneously, demonstrating the end-to-end pipeline from raw camera input to actionable classroom data.</p>

          <div className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-500/5 p-6 mt-4 rounded-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🥉</span>
              <div>
                <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-1">3rd Place — Hack-A-Bot 2025</h4>
                <p className="text-sm text-midnight-600 dark:text-midnight-400 font-medium">Awarded at the Robosoc 24-hour hackathon, University of Manchester. The project demonstrated a complete <strong className="font-bold text-midnight-800 dark:text-white underline decoration-[#5b9cf5]/40 decoration-2 underline-offset-4">edge-AI pipeline</strong> — from on-device pose estimation to live classroom analytics — built and presented within a single day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Key Takeaways ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5b9cf5]" /> 6. Key Takeaways
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-800 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 text-sm">What Worked</h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> On-device inference eliminated cloud latency — real-time response</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> PoseNet's 17-keypoint model was lightweight enough for IMX500 edge processing</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Confidence threshold of 0.3 balanced false positive suppression vs detection sensitivity</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Flask JSON endpoint made the system dashboard-agnostic</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-800 p-5">
              <h4 className="font-display font-bold text-midnight-900 dark:text-white mb-3 text-sm">Areas for Improvement</h4>
              <ul className="text-sm text-midnight-600 dark:text-midnight-400 space-y-1.5">
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Single-camera field of view limits coverage in large lecture halls</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> No persistent identity tracking — cannot distinguish individual students across frames</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> Hand-raise detection doesn't account for other arm gestures (stretching, scratching head)</li>
                <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#5b9cf5] mt-1.5 shrink-0" /> No data logging — metrics are live-only with no historical analysis</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 7. Codebase ── */}
        <section>
          <h3 className="text-xl font-display font-bold text-midnight-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#5b9cf5]" /> 7. Project Structure
          </h3>
          <div className="bg-midnight-50 dark:bg-midnight-900 border border-midnight-200 dark:border-midnight-700 p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-mono text-xs text-[#5b9cf5] mb-0.5">final_code/</p>
                <p className="text-midnight-500 dark:text-midnight-400 text-xs font-medium">Final submission — Flask + JSON output</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#5b9cf5] mb-0.5">Group21_Works/</p>
                <p className="text-midnight-500 dark:text-midnight-400 text-xs font-medium">Development version of pose detection</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#5b9cf5] mb-0.5">modlib/</p>
                <p className="text-midnight-500 dark:text-midnight-400 text-xs font-medium">Application Module Library (IMX500 SDK)</p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#5b9cf5] mb-0.5">tests/</p>
                <p className="text-midnight-500 dark:text-midnight-400 text-xs font-medium">Unit tests for modlib</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="px-2 py-1 border border-midnight-200 dark:border-midnight-700 text-midnight-600 dark:text-midnight-400 font-bold">Python 87.9%</span>
            <span className="px-2 py-1 border border-midnight-200 dark:border-midnight-700 text-midnight-600 dark:text-midnight-400 font-bold">C++ 10.7%</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HackABot2025Detail;
