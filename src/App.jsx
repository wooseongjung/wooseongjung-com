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
  <div className="space-y-12 animate-fade-up">
    <div className="relative">
      <h2 className="text-3xl font-light tracking-tight text-zinc-900 mb-6">
        Bridging the gap between <span className="font-semibold">logic</span> and <span className="font-semibold">lifestyle</span>.
      </h2>

      <div className="space-y-6 text-zinc-600 leading-relaxed font-light text-lg max-w-2xl">
        <p>
          I am a developer and designer who believes that good code should be as clean and well-structured as a beautifully tailored suit.
        </p>
        <p>
          While my professional foundation is built on circuits, servers, and software architecture, my real-world inspiration is drawn from the culture around me. I don't just stare at screens—I explore the world through gastronomy, curated playlists, and modern fashion.
        </p>
        <p>
          This space is a log of my technical endeavors, alongside the aesthetics and experiences that keep me balanced.
        </p>
      </div>

      <div className="absolute -left-12 top-2 h-full hidden md:flex flex-col items-center">
        <Power size={14} className="text-zinc-300 mb-2" />
        <Trace vertical className="flex-1 max-h-[100px]" />
        <Node className="border-zinc-300 my-2" />
        <Trace vertical className="flex-1 max-h-[60px]" />
        <Node className="border-zinc-300 my-2" />
        <Trace vertical className="flex-1 max-h-[40px]" />
        <GroundSymbol className="mt-2" />
      </div>
    </div>
  </div>
);

const ProjectsView = () => {
  const projects = [
    { title: 'E-Commerce Platform', category: 'Web Development', desc: 'A sleek, high-conversion storefront built with React and seamless payment integrations.', year: '2024' },
    { title: 'Inventory API', category: 'Backend Systems', desc: 'A robust, scalable REST API handling thousands of requests per minute with zero downtime.', year: '2023' },
    { title: 'Interactive Portfolio', category: 'UI/UX Design', desc: 'An award-winning digital experience focusing on micro-interactions and clean typography.', year: '2023' },
  ];

  return (
    <div className="space-y-10 animate-fade-up">
      <h2 className="text-2xl font-semibold text-zinc-900">Selected Works</h2>

      <div className="relative border-l border-zinc-200 pl-8 space-y-12 ml-2">
        {projects.map((proj, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-[32px] top-[7px] w-8 h-[1px] bg-zinc-200 group-hover:bg-zinc-900 transition-colors"></div>
            <Node className="absolute -left-[36px] top-[4px] transition-colors group-hover:bg-zinc-900" />

            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
              <h3 className="text-xl font-medium text-zinc-900">{proj.title}</h3>
              <span className="text-sm text-zinc-400 font-light mt-1 md:mt-0">{proj.year} • {proj.category}</span>
            </div>
            <p className="text-zinc-600 font-light leading-relaxed max-w-2xl">{proj.desc}</p>
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
    <div className="space-y-10 animate-fade-up">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {interests.map((item, idx) => (
          <div key={idx} className="bg-white p-8 border border-zinc-100 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-200 transition-colors group-hover:border-zinc-900"></div>
            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
              <item.icon size={18} className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-3">{item.title}</h3>
            <p className="text-sm text-zinc-500 font-light leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactSection = () => {
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
    <div className="space-y-10 animate-fade-up max-w-2xl">
      <h2 className="text-2xl font-semibold text-zinc-900 flex items-center gap-3">
        <Plug className="text-zinc-400" size={24} />
        Let's Connect
      </h2>
      <p className="text-zinc-600 font-light">
        Whether you want to discuss a new software project, share a playlist, or debate the best local coffee roaster, my inbox is open.
      </p>

      <div className="bg-zinc-50 border border-zinc-200 p-6 relative">
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

      <div className="space-y-6 pt-4">
        <a href="mailto:hello@yourdomain.com" className="flex items-center justify-between p-6 bg-white border border-zinc-200 hover:border-zinc-900 transition-colors group">
          <div className="flex items-center gap-4">
            <Mail size={20} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            <div>
              <h3 className="font-medium text-zinc-900">Email</h3>
              <span className="text-sm text-zinc-500 font-light">hello@yourdomain.com</span>
            </div>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transform group-hover:-rotate-45 transition-all" />
        </a>

        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-white border border-zinc-200 hover:border-zinc-900 transition-colors group">
          <div className="flex items-center gap-4">
            <Linkedin size={20} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            <div>
              <h3 className="font-medium text-zinc-900">LinkedIn</h3>
              <span className="text-sm text-zinc-500 font-light">Professional network & resume</span>
            </div>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transform group-hover:-rotate-45 transition-all" />
        </a>

        <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="flex items-center justify-between p-6 bg-white border border-zinc-200 hover:border-zinc-900 transition-colors group">
          <div className="flex items-center gap-4">
            <Github size={20} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            <div>
              <h3 className="font-medium text-zinc-900">GitHub</h3>
              <span className="text-sm text-zinc-500 font-light">Code repositories & contributions</span>
            </div>
          </div>
          <ArrowRight size={18} className="text-zinc-300 group-hover:text-zinc-900 transform group-hover:-rotate-45 transition-all" />
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
        <Route path="*" element={<Navigate to="/about" replace />} />
      </Routes>
    </main>

    <Trace className="w-1/3 opacity-50" />

    <section>
      <ContactSection />
    </section>

    <div className="pt-8 flex items-center justify-between text-xs text-zinc-400 font-light pb-12 border-t border-zinc-200">
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
  const activeTab = activePath === 'project' ? 'project' : (activePath === 'life' ? 'life' : 'about');
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
    { id: 'project', label: 'Work', icon: Cpu, path: '/project' },
    { id: 'life', label: 'Life', icon: Compass, path: '/life' },
    { id: 'record', label: 'WSJ Record', icon: Disc, path: '/record' },
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

      <div className="bg-minimal-circuit absolute inset-0 pointer-events-none fixed"></div>

      <header className="sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-zinc-200 z-0 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">

          <Link to="/about" className="flex flex-col relative group cursor-pointer">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 leading-none flex items-center gap-2">
              <Zap size={16} className="text-zinc-900" fill="currentColor" />
              Wooseong Jung
            </h1>
            <p className="text-[10px] text-zinc-500 font-light mt-1 ml-6">Software Engineer & Creative</p>
          </Link>

          <div className="flex items-center gap-8 h-full">
            <nav id="nav-container" className="hidden md:flex items-center gap-2 h-full relative pl-2">
              <div
                className="absolute bottom-0 left-[-2000px] h-[1.5px] bg-zinc-900 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 pointer-events-none"
                style={{ width: `calc(2000px + ${wireLength}px)` }}
              ></div>

              {navItems.map((item) => (
                <Link
                  key={item.id}
                  id={`nav-${item.id}`}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm transition-colors relative h-full px-5 z-20 group ${activeTab === item.id
                    ? 'text-zinc-900 font-medium'
                    : 'text-zinc-500 hover:text-zinc-900 font-light'
                    }`}
                >
                  {item.label}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none"
                    style={{ bottom: '-4.25px' }}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full border-[1.5px] flex items-center justify-center transition-colors duration-300 ${activeTab === item.id
                      ? 'border-zinc-900 bg-[#fafafa]'
                      : 'border-zinc-200 bg-[#fafafa] group-hover:border-zinc-400'
                      }`}>
                      <div className={`w-[3px] h-[3px] rounded-full transition-colors duration-300 ${activeTab === item.id ? 'bg-zinc-900' : 'bg-transparent'
                        }`}></div>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 pl-8 border-l border-zinc-200 hidden md:flex h-5 relative z-10">

              <div className="flex items-center gap-2 mr-4">
                {user ? (
                  <button onClick={handleLogin} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-500 font-medium transition-colors bg-zinc-100 hover:bg-red-50 px-2 py-1 rounded" title="Sign Out">
                    <span className="max-w-[100px] truncate">{user.email}</span>
                    <LogOut size={14} />
                  </button>
                ) : (
                  <button onClick={handleLogin} className="flex items-center gap-2 text-xs text-zinc-900 font-medium transition-colors bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded" title="Sign In with Google">
                    <span>Sign In</span>
                    <LogIn size={14} />
                  </button>
                )}
              </div>

              <a href="mailto:hello@yourdomain.com" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <Mail size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
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
