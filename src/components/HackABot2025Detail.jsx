import React from 'react';
import { ArrowRight } from 'lucide-react';

const HackABot2025Detail = ({ backToList }) => {
  return (
    <div className="space-y-10 animate-fade-up max-w-4xl pb-12">
      <button onClick={backToList} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors mb-4 group font-medium text-sm">
        <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" />
        Back to List
      </button>

      <div className="border-b border-zinc-200 dark:border-zinc-700 pb-8">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">AI Classroom Camera</h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 font-light">Hack-A-Bot 2025 • Robosoc • University of Manchester</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-medium">
            <span className="text-amber-500">🥉</span> 3rd Place
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 text-xs font-medium">
            24-Hour Hackathon
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://github.com/JBIS1104/HACK-A-BOT2025" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Source Code
          </a>
          <a href="https://youtube.com/shorts/Sxucuh2GTYQ" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-xs font-medium hover:border-red-400 dark:hover:border-red-500 transition-colors">
            ▶ Demo Video
          </a>
        </div>
      </div>

      {/* Hero image */}
      <div className="overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <img src="/images/hackabot-2025/hero.jpeg" alt="AI Classroom Camera — Raspberry Pi AI Camera in 3D-printed mount with Hack-A-Bot 2025 Group 21 dashboard on laptop" className="w-full h-auto max-h-[520px] object-cover" />
        <p className="text-[13px] text-zinc-400 dark:text-zinc-500 px-4 py-2 bg-zinc-50 dark:bg-zinc-900">The AI Camera system — Raspberry Pi with IMX500 sensor in a custom 3D-printed mount, with the Group 21 dashboard running on the laptop behind.</p>
      </div>

      {/* Sponsors & Organisations */}
      <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-4">
        <p className="text-[11px] uppercase tracking-widest text-zinc-400 mb-3">Organised &amp; Sponsored by</p>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-700">
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
            <div key={i} className={`${logo.lightBg ? 'bg-white dark:bg-zinc-200' : 'bg-white dark:bg-zinc-900'} p-4 flex items-center justify-center h-20`}>
              <img src={logo.src} alt={logo.alt} className={`max-h-12 max-w-full object-contain ${logo.invert ? 'dark:invert' : ''} ${logo.invertLight ? 'invert dark:invert-0' : ''}`} title={logo.alt} />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-none text-[15px] text-zinc-600 dark:text-zinc-400 space-y-8 leading-relaxed">

        {/* ── 1. Overview ── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 1. Overview
          </h3>
          <p>A unified AI camera system that automates <strong className="font-semibold text-zinc-900 dark:text-zinc-100">classroom attendance tracking</strong> and <strong className="font-semibold text-zinc-900 dark:text-zinc-100">attentiveness monitoring</strong> in real time. Traditional classrooms handle these as two separate manual tasks — this project merges both into a single on-device AI pipeline running on a <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Raspberry Pi AI Camera</strong> (IMX500 vision sensor).</p>
          <p>The system outputs three live metrics per frame, served as a JSON payload via a Flask HTTP endpoint consumable by any dashboard or display.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 mt-4">
            <div className="bg-white dark:bg-zinc-900 p-3 text-center">
              <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">17</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Keypoints / Person</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-3 text-center">
              <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">&gt;0.3</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Confidence Threshold</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-3 text-center">
              <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">3</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Live Metrics</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-3 text-center">
              <span className="block text-2xl font-mono font-light text-zinc-900 dark:text-zinc-100">24<span className="text-sm text-zinc-400">h</span></span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Build Time</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 mt-4">
            <div className="bg-white dark:bg-zinc-900 p-4 text-center">
              <span className="block text-lg font-mono font-light text-zinc-900 dark:text-zinc-100">attendance</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">% Present</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 text-center">
              <span className="block text-lg font-mono font-light text-zinc-900 dark:text-zinc-100">questions</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Hands raised</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 text-center">
              <span className="block text-lg font-mono font-light text-zinc-900 dark:text-zinc-100">understand</span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400">Present, not raising</span>
            </div>
          </div>
        </section>

        {/* ── 2. System Architecture ── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 2. System Architecture
          </h3>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Pipeline</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {['IMX500 Camera', '→', 'PoseNet (on-device)', '→', 'Confidence Filter (>0.3)', '→', 'Hand-Raise Check', '→', 'Metrics Calc', '→', 'Flask JSON API'].map((step, i) => (
                step === '→' ? <span key={i} className="text-zinc-300 dark:text-zinc-600 text-base">→</span> : (
                  <span key={i} className="px-2.5 py-1 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">{step}</span>
                )
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">CV</span>
                On-Device Pose Estimation
              </h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• PoseNet model deployed directly onto <strong className="font-medium text-zinc-800 dark:text-zinc-200">IMX500 sensor</strong> — zero cloud dependency</li>
                <li>• 17-point body keypoints per person (34-element flat array of x,y pairs)</li>
                <li>• Each keypoint carries a confidence score from <strong className="font-medium text-zinc-800 dark:text-zinc-200">0.0 to 1.0</strong></li>
                <li>• Skeleton lines drawn between connected joints via <code className="font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">cv2.line</code></li>
                <li>• Uses <code className="font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">modlib</code> SDK for IMX500 integration and frame capture</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">LOGIC</span>
                Hand-Raise Detection
              </h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• Compares wrist keypoints (9 &amp; 10) against shoulder keypoints (5 &amp; 6)</li>
                <li>• Only runs on keypoints with <strong className="font-medium text-zinc-800 dark:text-zinc-200">confidence &gt;0.3</strong> to suppress noise from occluded joints</li>
                <li>• If wrist y &lt; shoulder y → hand is raised (screen coords: y increases downward)</li>
                <li>• Green circle drawn above head for visual feedback on hands raised</li>
                <li>• Live annotated frame display via <code className="font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">frame.display()</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 3. Method — Hand-Raise Detection ── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 3. Method — Hand-Raise Detection
          </h3>

          <p>The core detection algorithm translates raw PoseNet output into three classroom metrics. Each frame produces N skeletons (one per detected person), and each skeleton is a flat 34-element array encoding 17 keypoint (x, y) pairs.</p>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 my-4">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Detection Pipeline</h4>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {['Raw Frame', '→', 'IMX500 PoseNet', '→', '17 Keypoints × N People', '→', 'Confidence Filter (>0.3)', '→', 'Wrist vs Shoulder Y-Check', '→', 'Metrics JSON'].map((step, i) => (
                step === '→' ? <span key={i} className="text-zinc-300 dark:text-zinc-600 text-base">→</span> : (
                  <span key={i} className="px-2.5 py-1 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">{step}</span>
                )
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">STEP 1</span>
                Keypoint Extraction
              </h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• PoseNet outputs <strong className="font-medium text-zinc-800 dark:text-zinc-200">17 body keypoints</strong> as a 34-element flat array — consecutive (x, y) pairs</li>
                <li>• Keypoint indices: 0 = nose, 5–6 = shoulders, 9–10 = wrists, 11–12 = hips, 15–16 = ankles</li>
                <li>• Each keypoint carries a <strong className="font-medium text-zinc-800 dark:text-zinc-200">confidence score</strong> ranging from 0.0 (no detection) to 1.0 (certain)</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">STEP 2</span>
                Confidence Filtering
              </h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• Only keypoints with confidence <strong className="font-medium text-zinc-800 dark:text-zinc-200">&gt;0.3</strong> are used for any downstream logic</li>
                <li>• This filters noise from occluded, off-frame, or partially visible body parts</li>
                <li>• The 0.3 threshold balances false positive suppression against detection sensitivity</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">STEP 3</span>
                Hand-Raise Logic
              </h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• Compare <strong className="font-medium text-zinc-800 dark:text-zinc-200">wrist y-position</strong> (index 9 or 10) against <strong className="font-medium text-zinc-800 dark:text-zinc-200">shoulder y-position</strong> (index 5 or 6)</li>
                <li>• If wrist y &lt; shoulder y → hand is raised (screen coordinates: y increases downward)</li>
                <li>• A <strong className="font-medium text-zinc-800 dark:text-zinc-200">green circle</strong> is drawn above the detected person's head for visual feedback</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">STEP 4</span>
                Metric Derivation
              </h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">Attendance</strong> = number of detected skeletons with &gt;0.3 confidence on key joints</li>
                <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">Questions</strong> = count of people with at least one hand raised</li>
                <li>• <strong className="font-medium text-zinc-800 dark:text-zinc-200">Understanding</strong> = present students NOT raising hands (attentive, not signalling confusion)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 4. My Contribution ── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 4. My Contribution
          </h3>
          <div className="space-y-3">
            <div className="pl-5 border-l-2 border-blue-300 dark:border-blue-700">
              <p className="text-sm"><strong className="font-medium text-zinc-800 dark:text-zinc-200">Custom CAD mount</strong> — Designed a 3D-printable camera mount for classroom deployment, positioning the AI Camera at optimal angle for full-room coverage.</p>
            </div>
            <div className="pl-5 border-l-2 border-blue-300 dark:border-blue-700">
              <p className="text-sm"><strong className="font-medium text-zinc-800 dark:text-zinc-200">Computer vision pipeline</strong> — Integrated the PoseNet model with the IMX500 sensor, implemented the keypoint extraction and hand-raise detection logic, and built the confidence filtering system.</p>
            </div>
            <div className="pl-5 border-l-2 border-blue-300 dark:border-blue-700">
              <p className="text-sm"><strong className="font-medium text-zinc-800 dark:text-zinc-200">Flask API endpoint</strong> — Built the HTTP JSON output layer that serves real-time metrics to any connected dashboard, enabling plug-and-play integration with classroom displays.</p>
            </div>
          </div>
        </section>

        {/* ── 5. Result & Demo ── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 5. Result &amp; Demo
          </h3>

          <a href="https://youtube.com/shorts/Sxucuh2GTYQ" target="_blank" rel="noopener noreferrer">
            <div className="border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-6 text-center hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
              <span className="text-4xl">▶</span>
              <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">Watch the demo (YouTube Short)</p>
            </div>
          </a>

          <p className="mt-4">The demo shows the full system running live — skeleton overlays drawn on each detected person, green circles appearing above heads when a hand-raise is detected, and real-time metric counters updating per frame. The annotated video feed and JSON output run simultaneously, demonstrating the end-to-end pipeline from raw camera input to actionable classroom data.</p>

          <div className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-500/5 p-6 mt-4 rounded-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🥉</span>
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">3rd Place — Hack-A-Bot 2025</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Awarded at the Robosoc 24-hour hackathon, University of Manchester. The project demonstrated a complete edge-AI pipeline — from on-device pose estimation to live classroom analytics — built and presented within a single day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Key Takeaways ── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 6. Key Takeaways
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-800 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm">What Worked</h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• On-device inference eliminated cloud latency — real-time response</li>
                <li>• PoseNet's 17-keypoint model was lightweight enough for IMX500 edge processing</li>
                <li>• Confidence threshold of 0.3 balanced false positive suppression vs detection sensitivity</li>
                <li>• Flask JSON endpoint made the system dashboard-agnostic</li>
              </ul>
            </div>
            <div className="bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-800 p-5">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm">Areas for Improvement</h4>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li>• Single-camera field of view limits coverage in large lecture halls</li>
                <li>• No persistent identity tracking — cannot distinguish individual students across frames</li>
                <li>• Hand-raise detection doesn't account for other arm gestures (stretching, scratching head)</li>
                <li>• No data logging — metrics are live-only with no historical analysis</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 7. Codebase ── */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" /> 7. Project Structure
          </h3>
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">final_code/</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">Final submission — Flask + JSON output</p>
              </div>
              <div>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">Group21_Works/</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">Development version of pose detection</p>
              </div>
              <div>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">modlib/</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">Application Module Library (IMX500 SDK)</p>
              </div>
              <div>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-0.5">tests/</p>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">Unit tests for modlib</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="px-2 py-1 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">Python 87.9%</span>
            <span className="px-2 py-1 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">C++ 10.7%</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HackABot2025Detail;
