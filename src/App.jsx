import { useState, useEffect, useRef } from 'react';
import { Mail, Code2, Play, Camera, ExternalLink } from 'lucide-react';

const albums = [
  { id: 1, title: "Nayaab - Seedhe Maut", cover: "/albums/nayaab.jpg" },
  { id: 2, title: "Bayaan - Seedhe Maut", cover: "/albums/bayaan.jpg" },
  { id: 3, title: "Lunch Break - Seedhe Maut", cover: "/albums/lunchbreak.jpg" },
  { id: 4, title: "Punya Paap - DIVINE", cover: "/albums/punyapaap.jpg" },
  { id: 5, title: "Still Here - KR$NA", cover: "/albums/stillhere.jpg" },
  { id: 6, title: "Hard Drive - Raftaar", cover: "/albums/harddrive.jpg" }
];

const marqueeAlbums = [...albums, ...albums, ...albums, ...albums];
const instagramReels = [
  'DdlspV-yfNj',
  'DdbZ7y9yOvz',
  'DdOw8EgI8KM',
  'Dc0ixWLIuBk',
  'DcbDnSgIShC',
  'Db0WlDiNIFN',
  'DbfitrGyNOc',
  'DdM1f7QsAvf',
  'DcvuAiKRYTc',
];
const galleryPhotos = [
  'img_1186',
  'img_1254',
  'img_1283',
  'img_1541',
  'img_1637',
  'img_1656',
  'img_1789',
  'img_1851',
  'img_1954',
  'img_2219',
  'img_2332',
  'img_4103',
  'img_4716',
  'img_5339',
  'img_5614',
  'img_6991',
];
const backgroundVideoPlaylists = [
  ['img_2384', 'img_2785', 'img_2850', 'img_3202', 'img_5165', 'img_5175', 'img_5539', 'img_5603', 'img_6606', 'video_20251018_153942'],
  ['img_2756', 'img_2839', 'img_2854', 'img_4565', 'img_5330', 'img_5540', 'img_5666', 'img_8468', 'vid-20250919-wa0000'],
  ['img_2780', 'img_2847', 'img_2988', 'img_4630', 'img_5369', 'img_5575', 'img_8498', 'img_9162', 'pxl_20251011_103637114', 'vid-20260923-wa0032'],
];
const backgroundLanePositions = ['', 'translate-y-12', '-translate-y-12'];

export default function CinematicPortfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navBg, setNavBg] = useState('bg-transparent');
  const [introActive, setIntroActive] = useState(true);
  const [flash, setFlash] = useState(false);
  const [soundtrackStarted, setSoundtrackStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, dist: 0 });
  const [backgroundVideoPlayback, setBackgroundVideoPlayback] = useState(
    backgroundVideoPlaylists.map(() => ({ index: 0, activeSlot: 0 })),
  );
  const backgroundVideoRefs = useRef([]);
  const avatarRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);

      if (window.scrollY > 80) {
        setNavBg('bg-black/95 backdrop-blur-md border-b border-zinc-900');
      } else {
        setNavBg('bg-transparent border-b border-transparent');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-16');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });
    
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [introActive]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (introActive) return;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorRef.current.style.opacity = '0.4';
      }

      if (avatarRef.current) {
        const rect = avatarRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        const maxPupilMove = 8; 
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 12, maxPupilMove);
        const angle = Math.atan2(dy, dx);
        
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        setMousePos({ x: pupilX, y: pupilY, dist: distance });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [introActive]);

  const handlePlay = () => {
    setSoundtrackStarted(true);
    setFlash(true);
    setTimeout(() => {
      setIntroActive(false);
      setTimeout(() => setFlash(false), 800); 
    }, 150); 
  };

  const avatarOpacity = Math.max(1 - scrollY / 350, 0);
  const avatarScale = Math.max(1 - scrollY / 600, 0.5);

  return (
    <div className="min-h-screen bg-black text-gray-200 selection:bg-[#E50914] selection:text-white overflow-x-hidden relative" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-[3px] bg-[#E50914] z-[1000] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(229,9,20,0.8)]" style={{ width: `${scrollProgress}%` }}></div>

      {/* Cinematic REC Indicator */}
      {!introActive && (
        <div className="fixed top-24 md:top-6 right-6 z-[900] flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-zinc-800 shadow-lg animate-[fade-in_1s_ease-out_forwards]">
          <div className="w-2.5 h-2.5 bg-[#E50914] rounded-full animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_8px_rgba(229,9,20,0.8)]"></div>
          <span className="text-[#E50914] text-[0.6rem] font-bold tracking-[0.2em]">REC</span>
        </div>
      )}

      {/* Custom Cursor Glow */}
      <div 
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 w-64 h-64 -mt-32 -ml-32 rounded-full bg-[#E50914] mix-blend-screen filter blur-[100px] opacity-0 transition-opacity duration-700 z-[9999]"
        style={{ willChange: 'transform' }}
      ></div>

      {/* DIAGONAL BLURRED BACKGROUND VIDEOS */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden flex gap-1 transform -rotate-12 scale-125 opacity-40">
        {backgroundVideoPlaylists.map((playlist, lane) => {
          const { index, activeSlot } = backgroundVideoPlayback[lane];

          return (
            <div key={lane} className={`relative h-full w-1/3 shrink-0 overflow-hidden ${backgroundLanePositions[lane]}`}>
              {[0, 1].map((slot) => {
                const isActive = slot === activeSlot;
                const videoId = playlist[(index + (isActive ? 0 : 1)) % playlist.length];

                return (
                  <video
                    key={`${lane}-${slot}`}
                    ref={(video) => {
                      if (!backgroundVideoRefs.current[lane]) backgroundVideoRefs.current[lane] = [];
                      backgroundVideoRefs.current[lane][slot] = video;
                    }}
                    src={`/videos/${videoId}.mp4`}
                    autoPlay={isActive}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={isActive ? () => {
                      const nextSlot = 1 - activeSlot;
                      backgroundVideoRefs.current[lane][nextSlot]?.play();
                      setBackgroundVideoPlayback((playback) => playback.map(
                        (current, currentLane) => currentLane === lane
                          ? { index: (index + 1) % playlist.length, activeSlot: nextSlot }
                          : current,
                      ));
                    } : undefined}
                    className={`absolute inset-0 h-full w-full object-cover blur-[1px] transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {introActive && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#E50914] rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-green-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-pink-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>
          
          <button 
            onClick={handlePlay}
            aria-label="Enter portfolio and start the soundtrack"
            className="z-10 group flex items-center justify-center w-28 h-28 rounded-full border border-white/30 bg-black/50 backdrop-blur-md hover:border-[#E50914] hover:scale-110 transition-all duration-300 shadow-[0_0_50px_rgba(229,9,20,0.4)]"
          >
            <Play size={48} className="text-white group-hover:text-[#E50914] ml-2 transition-colors" />
          </button>
          <p className="absolute top-[calc(50%+5rem)] text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/60">
            Enter with soundtrack
          </p>
        </div>
      )}

      <div className={`fixed inset-0 z-[150] bg-white pointer-events-none transition-opacity duration-[800ms] ease-out ${flash ? 'opacity-100' : 'opacity-0'}`}></div>

      <style dangerouslySetInnerHTML={{__html: `
        .reveal { transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1); }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #E50914; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-250px * 9 - 1.5rem * 9)); }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: scroll 30s linear infinite;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />

      <header id="home" className="relative h-[85vh] flex flex-col items-center pt-24 md:pt-32 gap-4 overflow-hidden bg-transparent z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-[0.5em] uppercase z-10 mb-4">
          MOGU
        </h1>

        <div className="relative w-full max-w-4xl flex items-center justify-center z-10">
          {/* Radiating Pill-Box Badges */}
          <div className="absolute left-[5%] md:left-[14%] top-[8%] text-[#E50914] text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] uppercase -rotate-[15deg] z-30 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-[#E50914]/30 shadow-xl hover:border-[#E50914] transition-all">
            <span className="hidden md:inline-block mr-2">~~~</span> Actor
          </div>
          <div className="absolute left-[0%] md:left-[8%] top-[42%] text-blue-400 text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] uppercase -rotate-[8deg] z-30 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-blue-500/30 shadow-xl hover:border-blue-400 transition-all">
            <span className="hidden md:inline-block mr-2">~~~</span> Poet
          </div>
          <div className="absolute left-[4%] md:left-[16%] bottom-[12%] text-gray-300 text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] uppercase rotate-[12deg] z-30 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-700/50 shadow-xl hover:border-white transition-all">
            <span className="hidden md:inline-block mr-2">~~~</span> Editor
          </div>
          <div className="absolute right-[5%] md:right-[14%] top-[8%] text-white text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] uppercase rotate-[15deg] z-30 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-zinc-700/50 shadow-xl hover:border-white transition-all">
            Director <span className="hidden md:inline-block ml-2">~~~</span>
          </div>
          <div className="absolute right-[0%] md:right-[8%] top-[42%] text-yellow-400 text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] uppercase rotate-[8deg] z-30 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-yellow-500/30 shadow-xl hover:border-yellow-400 transition-all">
            Cinephile <span className="hidden md:inline-block ml-2">~~~</span>
          </div>
          <div className="absolute right-[4%] md:right-[14%] bottom-[12%] text-green-400 text-[0.55rem] md:text-[0.65rem] font-bold tracking-[0.3em] uppercase -rotate-[10deg] z-30 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-green-500/30 shadow-xl hover:border-green-400 transition-all">
            Data Scientist <span className="hidden md:inline-block ml-2">~~~</span>
          </div>

          <div 
            className="origin-center transition-transform duration-100 ease-out relative z-20 mt-4"
            style={{ 
              opacity: avatarOpacity, 
              transform: `scale(${avatarScale}) perspective(1000px) rotateX(${-mousePos.y * 1.5}deg) rotateY(${mousePos.x * 1.5}deg)`,
              pointerEvents: avatarOpacity === 0 ? 'none' : 'auto'
            }}
            ref={avatarRef}
          >
            <div className="relative w-60 h-72 md:w-72 md:h-80 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(229,9,20,0.25)] group bg-zinc-950">
              <img 
                src="/mogu-avatar.png" 
                alt="Mrigank Gupta Avatar" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div 
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${50 + (mousePos.x || 0) * 4}% ${50 + (mousePos.y || 0) * 4}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </header>

      <nav className={`sticky top-0 w-full z-50 transition-all duration-500 ${navBg} shadow-2xl`}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex justify-center items-center overflow-x-auto no-scrollbar">
          <div className="flex space-x-6 md:space-x-12 text-[0.65rem] font-bold tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#reel" className="hover:text-white transition-colors text-[#E50914]">The Reel</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="#vibe" className="hover:text-white transition-colors">Vibe</a>
            <a href="#music" className="hover:text-white transition-colors">Music</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* About Section - TEXT ONLY AS REQUESTED */}
        <section id="about" className="py-32 px-6 bg-transparent">
          <div className="max-w-4xl mx-auto reveal opacity-0 translate-y-16">
            <h3 className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-6">
              ABOUT
            </h3>
            
            <div className="border border-zinc-800 p-8 md:p-12 relative bg-zinc-950/60 backdrop-blur-md rounded-3xl shadow-2xl group hover:border-[#E50914]/40 hover:shadow-[0_0_40px_rgba(229,9,20,0.08)] transition-all duration-500">
              <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight text-white mb-6">About Me.</h2>
              <div className="text-sm md:text-base font-light leading-relaxed text-gray-300 space-y-6 tracking-wide">
                <p>
                  Hey, I'm <span className="text-white font-bold">Mrigank Gupta</span>, though most people just call me Mogu. By day, I'm navigating the world of algorithms and models as a Data Science student at NMIMS. But honestly, my true vibe is out there with a camera in hand. 
                </p>
                <p>
                  Whether I'm directing a short film, chopping up an edit for social media, or writing down verses, I'm all about telling stories that hit hard. I blend that analytical mindset with raw creativity to make things that actually make people feel something. For me, it's all about connection, capturing moments, and spreading a little love along the way.
                </p>
                <div className="pt-6 mt-6 border-t border-zinc-800/50 flex flex-wrap gap-4 items-center">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#E50914]">Creative Toolkit:</span>
                  <span className="text-xs text-gray-300 font-bold uppercase bg-black/50 px-3 py-1 rounded-full border border-zinc-800">Adobe Photoshop</span>
                  <span className="text-xs text-gray-300 font-bold uppercase bg-black/50 px-3 py-1 rounded-full border border-zinc-800">CapCut</span>
                  <span className="text-xs text-gray-300 font-bold uppercase bg-black/50 px-3 py-1 rounded-full border border-zinc-800">DaVinci Resolve</span>
                  <span className="text-xs text-gray-300 font-bold uppercase bg-black/50 px-3 py-1 rounded-full border border-zinc-800">Lightroom</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Reel Section */}
        <section id="reel" className="py-32 px-6 bg-transparent border-t border-zinc-900/50">
          <div className="max-w-5xl mx-auto reveal opacity-0 translate-y-16">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase mb-5 flex items-center gap-6">
                  <span className="w-16 h-[1px] bg-[#E50914]"></span> WORKS
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-gray-400">
                  A selection of films and reels I have made. Open any project to watch it on Instagram.
                </p>
              </div>
              <a
                href="https://www.instagram.com/mogu_captures/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-300 transition-colors hover:border-[#E50914] hover:text-white"
              >
                More on @mogu_captures <ExternalLink size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {instagramReels.map((shortcode, index) => (
                <a
                  key={shortcode}
                  href={`https://www.instagram.com/reel/${shortcode}/`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Watch Instagram film or reel ${index + 1}`}
                  className="group flex min-h-32 items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#E50914]/70 hover:bg-zinc-900/80"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-[#E50914]">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                        Film / Reel {String(index + 1).padStart(2, '0')}
                      </h4>
                      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.15em] text-gray-500">Watch on Instagram</p>
                    </div>
                  </div>
                  <Play size={20} className="shrink-0 text-gray-500 transition-colors group-hover:text-[#E50914]" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Vertical Gallery Section */}
        <section id="gallery" className="py-32 bg-transparent border-t border-zinc-900/50">
          <div className="max-w-6xl mx-auto reveal opacity-0 translate-y-16">
            <h3 className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase mb-12 px-6 flex items-center gap-6">
              GALLERY
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-12">
               {galleryPhotos.map((photo) => (
                 <div key={photo} className="w-full aspect-[4/5] relative group overflow-hidden bg-zinc-950/60 backdrop-blur-sm rounded-3xl border border-zinc-800/50 shadow-2xl hover:border-gray-500 transition-colors">
                   <img 
                     src={`/photos/${photo}.jpg`} 
                     alt={`Portfolio photography ${photo.replace('img_', 'IMG ')}`} 
                     className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out bg-zinc-800" 
                   />
                   <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
                     <Camera size={48} strokeWidth={1} className="text-white drop-shadow-2xl" />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Hobbies & Vibe */}
        <section id="vibe" className="py-32 px-6 bg-transparent border-t border-zinc-900/50">
          <div className="max-w-7xl mx-auto reveal opacity-0 translate-y-16">
            <h3 className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase mb-16 flex items-center gap-6">
              <span className="w-16 h-[1px] bg-[#E50914]"></span> HOBBIES & VIBE
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Verses & Poetry", desc: "Translating raw emotions into words. A curated collection of thoughts, prose, and spoken word pieces that reflect my worldview.", tags: ["Writing", "Art"] },
                { title: "The Pitch", desc: "A profound passion for cricket. I appreciate the strategic nuances, the statistical depth, and the raw, unyielding emotion of the sport.", tags: ["Cricket", "Sports"] },
                { title: "Politics & Defence", desc: "An avid follower of global geopolitics and the defense sector, constantly analyzing strategic military developments and international relations.", tags: ["Strategy", "Research"] },
                { title: "Digital Arenas", desc: "An avid mobile gamer, constantly testing reflexes, devising tactical strategies, and competing in high-stakes digital environments.", tags: ["Gaming", "Esports"] },
                { title: "Fact Collector", desc: "Driven by an insatiable curiosity, I am a relentless collector of obscure facts, continually expanding my knowledge about the world.", tags: ["Knowledge", "Curiosity"] },
                { title: "Spreading Love", desc: "Beyond the realms of art and data, my greatest driving force is empathy—striving to ensure that the people around me feel truly valued, heard, and cherished.", tags: ["Empathy", "Connection"] }
              ].map((proj, idx) => (
                <div key={idx} className="group border border-zinc-800/50 p-10 hover:border-[#E50914] transition-colors duration-300 bg-zinc-950/60 backdrop-blur-sm rounded-3xl flex flex-col justify-between shadow-xl">
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight uppercase mb-4">{proj.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed mb-8">{proj.desc}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {proj.tags.map((tag, i) => (
                      <span key={i} className="text-[0.6rem] font-bold text-[#E50914] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-[#E50914]/30 bg-black/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Music Section (Text Overlay only, No Modal) */}
        <section id="music" className="py-32 bg-transparent border-t border-zinc-900/50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 reveal opacity-0 translate-y-16 mb-16">
            <h3 className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-6">
              <span className="w-16 h-[1px] bg-[#E50914]"></span> THE INDIAN DHH SCENE
            </h3>
          </div>

          <div className="max-w-7xl mx-auto px-6 mb-16">
            <div className="grid gap-8 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] md:items-center md:p-10">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#E50914]">Portfolio soundtrack</p>
                <h4 className="mt-4 text-2xl font-bold uppercase tracking-tight text-white">Now playing</h4>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-400">
                  Starts when you enter the portfolio. Use the YouTube player controls to pause or adjust playback.
                </p>
                {!soundtrackStarted && (
                  <p className="mt-4 text-xs text-gray-500">
                    Press the intro play button to start the song.
                  </p>
                )}
              </div>
              <div className="aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                {soundtrackStarted ? (
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube-nocookie.com/embed/eLpS42vIli4?autoplay=1&loop=1&playlist=eLpS42vIli4&playsinline=1"
                    title="Portfolio soundtrack on YouTube"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <a
                    href="https://music.youtube.com/watch?v=eLpS42vIli4"
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:text-white"
                  >
                    <Play size={20} className="text-[#E50914]" />
                    Soundtrack loads after entering
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full marquee-container overflow-hidden">
            <div className="animate-marquee gap-6 px-6">
              {marqueeAlbums.map((album, idx) => (
                <div 
                  key={`${album.id}-${idx}`} 
                  className="w-[250px] h-[250px] shrink-0 relative group rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border-2 border-zinc-800 hover:border-[#E50914] transition-colors duration-300"
                >
                  <img 
                    src={album.cover} 
                    alt={album.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <span className="text-white text-xs font-bold tracking-widest uppercase text-center px-4">
                      {album.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="py-24 px-6 bg-transparent border-t border-zinc-900/50 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 reveal opacity-0 translate-y-16">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              MOGU<span className="text-[#E50914]">.</span>
            </h2>
            <p className="text-[0.65rem] font-bold text-gray-600 uppercase tracking-[0.2em]">
              Mumbai, India &nbsp;&middot;&nbsp; 2026
            </p>
          </div>
          
          <div className="flex gap-8">
            <a href="mailto:mrigank8073@outlook.com" className="group flex flex-col items-center gap-4">
              <div className="text-gray-500 group-hover:text-[#E50914] group-hover:-translate-y-1 transition-all duration-300">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <span className="text-[0.55rem] font-bold tracking-[0.2em] text-gray-600 group-hover:text-white uppercase">Email</span>
            </a>
            
            <a href="https://github.com/mogumogu27" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-4">
              <div className="text-gray-500 group-hover:text-[#E50914] group-hover:-translate-y-1 transition-all duration-300">
                <Code2 size={24} strokeWidth={1.5} />
              </div>
              <span className="text-[0.55rem] font-bold tracking-[0.2em] text-gray-600 group-hover:text-white uppercase">GitHub</span>
            </a>
            
            <a href="https://www.instagram.com/mrigank_27/" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-4">
              <div className="text-gray-500 group-hover:text-[#E50914] group-hover:-translate-y-1 transition-all duration-300">
                <Camera size={24} strokeWidth={1.5} />
              </div>
              <span className="text-[0.55rem] font-bold tracking-[0.2em] text-gray-600 group-hover:text-white uppercase">Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}