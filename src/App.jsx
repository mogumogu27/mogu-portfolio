import { useState, useEffect, useRef } from 'react';
import { Mail, Play, ExternalLink } from 'lucide-react';

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

function BackgroundVideos() {
  const [playback, setPlayback] = useState(
    backgroundVideoPlaylists.map(() => ({ index: 0, activeSlot: 0 })),
  );
  const [mediaReady, setMediaReady] = useState(false);
  const videoRefs = useRef([]);
  const preloadedIndices = useRef([]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMediaReady(true), 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden flex gap-1 transform -rotate-12 scale-125 opacity-40">
      {backgroundVideoPlaylists.map((playlist, lane) => {
        const { index, activeSlot } = playback[lane];

        return (
          <div key={lane} className={`relative h-full w-1/3 shrink-0 overflow-hidden ${backgroundLanePositions[lane]}`}>
            {[0, 1].map((slot) => {
              const isActive = slot === activeSlot;
              const videoId = playlist[(index + (isActive ? 0 : 1)) % playlist.length];

              return (
                <video
                  key={`${lane}-${slot}`}
                  ref={(video) => {
                    if (!videoRefs.current[lane]) videoRefs.current[lane] = [];
                    videoRefs.current[lane][slot] = video;
                  }}
                  src={mediaReady ? `${import.meta.env.BASE_URL}videos/${videoId}.mp4` : undefined}
                  autoPlay={mediaReady && isActive}
                  muted
                  playsInline
                  preload={isActive ? 'auto' : 'metadata'}
                  onTimeUpdate={isActive ? (event) => {
                    const video = event.currentTarget;
                    if (video.duration - video.currentTime <= 3 && preloadedIndices.current[lane] !== index) {
                      preloadedIndices.current[lane] = index;
                      const nextVideo = videoRefs.current[lane][1 - activeSlot];
                      if (nextVideo) {
                        nextVideo.preload = 'auto';
                        nextVideo.load();
                      }
                    }
                  } : undefined}
                  onEnded={isActive ? () => {
                    const nextSlot = 1 - activeSlot;
                    videoRefs.current[lane][nextSlot]?.play();
                    setPlayback((currentPlayback) => currentPlayback.map(
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
  );
}

export default function CinematicPortfolio() {
  const avatarRef = useRef(null);
  const cursorRef = useRef(null);
  const progressRef = useRef(null);
  const navRef = useRef(null);

  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse' || !cursorRef.current) return;
    cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    cursorRef.current.style.opacity = '0.4';
  };

  useEffect(() => {
    let animationFrame = 0;
    const updateScrollEffects = () => {
      animationFrame = 0;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;

      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
      if (navRef.current) {
        const isScrolled = scrollY > 80;
        navRef.current.style.backgroundColor = isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent';
        navRef.current.style.backdropFilter = isScrolled ? 'blur(12px)' : 'none';
        navRef.current.style.borderColor = isScrolled ? '#18181b' : 'transparent';
      }
      if (avatarRef.current && window.scrollY < 350) {
        avatarRef.current.style.opacity = `${Math.max(1 - scrollY / 350, 0)}`;
        avatarRef.current.style.transform = `scale(${Math.max(1 - scrollY / 600, 0.5)})`;
        avatarRef.current.style.pointerEvents = scrollY >= 350 ? 'none' : 'auto';
      }
    };
    const handleScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateScrollEffects);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollEffects();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      onPointerMove={handlePointerMove}
      className="min-h-screen bg-black text-gray-200 selection:bg-[#E50914] selection:text-white overflow-x-hidden relative"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      
      {/* Scroll Progress Bar */}
      <div ref={progressRef} className="fixed top-0 left-0 h-[3px] bg-[#E50914] z-[1000] shadow-[0_0_10px_rgba(229,9,20,0.8)]"></div>

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="cursor-glow pointer-events-none fixed top-0 left-0 z-[9999] h-40 w-40 -mt-20 -ml-20 rounded-full bg-[#E50914] opacity-0 mix-blend-screen blur-[60px] transition-opacity duration-300 will-change-transform"
      ></div>

      <BackgroundVideos />

      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #E50914; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      `}} />

      <header id="home" className="relative h-[85svh] min-h-[34rem] flex flex-col items-center pt-24 md:pt-32 gap-4 overflow-hidden bg-transparent z-10">
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
            className="origin-center relative z-20 mt-4"
            style={{ opacity: 1, transform: 'scale(1)', pointerEvents: 'auto' }}
            ref={avatarRef}
          >
            <div className="relative w-60 h-72 md:w-72 md:h-80 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(229,9,20,0.25)] group bg-zinc-950">
              <img 
                src={`${import.meta.env.BASE_URL}mogu-avatar.webp`}
                alt="Mrigank Gupta Avatar" 
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </header>

      <nav ref={navRef} className="sticky top-0 w-full z-50 transition-all duration-300 border-b border-transparent shadow-2xl">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-5 flex justify-center items-center overflow-x-auto no-scrollbar">
          <div className="flex space-x-3 sm:space-x-6 md:space-x-12 text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.2em] uppercase text-gray-400 whitespace-nowrap">
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
          <div className="max-w-4xl mx-auto">
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
          <div className="max-w-5xl mx-auto">
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
          <div className="max-w-6xl mx-auto">
            <h3 className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase mb-12 px-6 flex items-center gap-6">
              GALLERY
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 px-4 sm:px-6 pb-12">
               {galleryPhotos.map((photo) => (
                 <div key={photo} className="gallery-card group w-full aspect-[4/5] relative overflow-hidden bg-zinc-950 rounded-3xl border border-zinc-800/50">
                   <img 
                     src={`${import.meta.env.BASE_URL}photos/${photo}.webp`}
                     alt={`Portfolio photography ${photo.replace('img_', 'IMG ')}`} 
                     loading="eager"
                     decoding="async"
                     width="900"
                     height="1200"
                     className="gallery-image w-full h-full object-cover bg-zinc-800 transition-transform duration-500 ease-out group-hover:scale-105"
                   />
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Hobbies & Vibe */}
        <section id="vibe" className="py-32 px-6 bg-transparent border-t border-zinc-900/50">
          <div className="max-w-7xl mx-auto">
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
                <div key={idx} className="group border border-zinc-800/50 p-6 md:p-10 hover:border-[#E50914] transition-colors duration-300 bg-zinc-950/60 backdrop-blur-sm rounded-3xl flex flex-col justify-between shadow-xl">
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
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <h3 className="text-[#E50914] text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-6">
              <span className="w-16 h-[1px] bg-[#E50914]"></span> MUSIC
            </h3>
          </div>

          <div className="max-w-7xl mx-auto px-6 mb-16">
            <div className="grid gap-8 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] md:items-center md:p-10">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#E50914]">Portfolio soundtrack</p>
                <h4 className="mt-4 text-2xl font-bold uppercase tracking-tight text-white">Portfolio soundtrack</h4>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-400">
                  Start playback with the YouTube player controls.
                </p>
              </div>
              <div className="aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/eLpS42vIli4?autoplay=0&loop=1&playlist=eLpS42vIli4&playsinline=1"
                  title="Portfolio soundtrack on YouTube"
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-24 px-6 bg-transparent border-t border-zinc-900/50 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
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
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.3 9.4 7.88 10.93.58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </div>
              <span className="text-[0.55rem] font-bold tracking-[0.2em] text-gray-600 group-hover:text-white uppercase">GitHub</span>
            </a>
            
            <a href="https://www.instagram.com/mrigank_27/" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-4">
              <div className="text-gray-500 group-hover:text-[#E50914] group-hover:-translate-y-1 transition-all duration-300">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <span className="text-[0.55rem] font-bold tracking-[0.2em] text-gray-600 group-hover:text-white uppercase">Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}