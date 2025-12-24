import { useState, useEffect } from "react";
import { 
  ChevronRight, 
  Award, 
  ArrowUpRight, 
  FileCode, 
  Zap, 
  GitBranch  
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NovaPro = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Smoother mouse tracking
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRequestDemo = () => navigate("/request-demo");
  const handleLearnMore = () => navigate("/learn-more");

  const metrics = [
    { label: "Code Bases Analyzed", value: "100k+" },
    { label: "Tests Generated", value: "5M+" },
    { label: "Active Developers", value: "200k+" },
    { label: "Languages Supported", value: "25+" },
  ];

  const techStack = [
    "Python", "TypeScript", "React", "Rust", "Go", "Docker", "Kubernetes", "AWS", "Azure", "GraphQL"
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-hidden font-sans">
      {/* --- BACKGROUND EFFECTS --- */}
      {/* 1. Matrix Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 2. Mouse Spotlight (Radial Gradient) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.07), transparent 40%)`,
        }}
      />

      {/* --- HERO SECTION (BENTO STYLE) --- */}
      <div className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT COLUMN: Typography & CTA */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                <span className="text-xs font-medium tracking-widest text-violet-300 uppercase">
                  v2.0 Now Available
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]">
                Transform Code <br />
                <span className="font-medium bg-gradient-to-r from-purple-400  to-yellow-300 bg-clip-text text-transparent">
                  Into Intelligence
                </span>
              </h1>

              <p className="text-lg text-gray-400 font-light leading-relaxed mb-10 max-w-lg">
                PaperBrain uses advanced AI to automatically generate
                comprehensive documentation and unit tests. Stop writing
                boilerplate. Start shipping.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRequestDemo}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-400 to-yellow-300 text-black text-sm font-semibold tracking-wide rounded-lg overflow-hidden transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Start Free Trial
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </button>

                <button
                  onClick={handleLearnMore}
                  className="px-8 py-4 border border-white/10 text-sm font-medium tracking-wide rounded-lg hover:bg-white/5 transition-colors backdrop-blur-sm"
                >
                  View Documentation
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Bento Grid Visuals */}
            <div className="hidden lg:grid grid-cols-2 gap-4 h-full min-h-[500px]">
              {/* Card 1: Main Terminal (Spans 2 cols) */}
              <div className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <FileCode className="w-32 h-32 text-violet-500" />
                </div>
                <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono ml-2">
                    analysis_engine.py
                  </span>
                </div>
                <div className="space-y-3 font-mono text-xs text-gray-400">
                  <div className="flex gap-2">
                    <span className="text-violet-400">➜</span>
                    <span>Scanning repository...</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-violet-400">➜</span>
                    <span className="text-white">
                      Found 124 undocumented functions
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-violet-400">➜</span>
                    <span className="text-green-400">
                      Generating docs via GPT-4o...
                    </span>
                  </div>
                  <div className="mt-4 p-3 rounded bg-black/40 border border-white/5 text-gray-500">
                    /**
                    <br />
                    &nbsp;* Automatically handles retry logic for
                    <br />
                    &nbsp;* failed API requests with exp backoff.
                    <br />
                    &nbsp;*/
                  </div>
                </div>
              </div>

              {/* Card 2: Stats */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-black p-6 backdrop-blur-md">
                <Zap className="w-8 h-8 text-yellow-300 mb-4" />
                <div className="text-3xl font-light text-white mb-1">10x</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  Faster Dev Cycle
                </div>
              </div>

              {/* Card 3: Integration */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md flex flex-col justify-between">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border border-black bg-gray-800 flex items-center justify-center text-[10px] text-gray-400"
                    >
                      <GitBranch className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-400 uppercase tracking-wider">
                  Seamless Git Sync
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RUNNING TEXT (MARQUEE) --- */}
      <div className="relative z-10 border-y border-white/5 bg-black/20 backdrop-blur-sm py-6 overflow-hidden">
        <div className="flex w-full">
          <div className="animate-marquee whitespace-nowrap flex gap-16 min-w-full">
            {[...techStack, ...techStack, ...techStack].map((tech, i) => (
              <span
                key={i}
                className="text-lg font-light text-gray-600 uppercase tracking-widest flex items-center gap-2 "
              >
                
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- METRICS SECTION --- */}
      <div className="relative z-10 py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {metrics.map((metric, index) => (
              <div key={index} className="group cursor-default">
                <div className="text-4xl md:text-5xl font-thin bg-gradient-to-r from-purple-400 to-yellow-300 bg-clip-text text-transparent mb-2 group-hover:text-violet-300 transition-colors">
                  {metric.value}
                </div>
                <div className="text-xs tracking-[0.2em] text-gray-500 uppercase">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TESTIMONIAL --- */}
      <div className="relative z-10 py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-10 flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-tr from-violet-500/10 to-transparent border border-white/10">
              <Award className="w-8 h-8 text-violet-400" />
            </div>
          </div>
          <h3 className="text-2xl md:text-4xl font-light italic leading-relaxed text-gray-200 mb-10">
            "We reduced our technical debt by 40% in the first month. PaperBrain
            doesn't just write docs—it understands the intent behind our complex
            microservices architecture."
          </h3>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-bold tracking-widest text-white">
              DAVID PARK
            </span>
            <span className="text-xs font-medium tracking-widest text-violet-400">
              LEAD DEVELOPER @ TECH UNICORN
            </span>
          </div>
        </div>
      </div>

      {/* --- CTA FOOTER --- */}
      <div className="relative z-10 py-32 bg-gradient-to-b from-transparent to-violet-900/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light tracking-tight mb-8">
            Ready to modernize your workflow?
          </h2>
          <p className="text-gray-400 mb-10 font-light text-lg">
            Join 200,000+ developers shipping better code, faster.
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-purple-400 to-yellow-300 text-black rounded-full text-sm font-semibold tracking-wide hover:scale-105 transition-transform inline-flex items-center gap-2">
            Get Started Now
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- CSS FOR ANIMATION --- */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NovaPro;