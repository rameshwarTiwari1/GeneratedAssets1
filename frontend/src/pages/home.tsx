import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Loader2 } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { usePrompt } from "@/hooks/PromptContext";
import { Marquee } from "@/components/Marquee";
import { ThemeToggle } from "@/components/ThemeToggle";

interface FloatingItem {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
}

// Floating letters component
const FloatingLetters = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%$#@!&*()[]{}+=<>?/|\\~`';
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const items: FloatingItem[] = [];
    for (let i = 0; i < 150; i++) {
      items.push({
        id: i,
        char: letters[Math.floor(Math.random() * letters.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.3 + 0.1,
        animationDuration: Math.random() * 20 + 10,
        animationDelay: Math.random() * 10,
      });
    }
    setFloatingItems(items);
  }, [letters]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingItems.map((item) => (
        <div
          key={item.id}
          className="absolute text-gray-600 font-mono select-none animate-float-random"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            animationDuration: `${item.animationDuration}s`,
            animationDelay: `${item.animationDelay}s`,
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
};

export default function HomePage() {
  const [prompt, setLocalPrompt] = useState("");
  const { setPrompt } = usePrompt();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const firstRowExamples = [
    "Tariff-resistant companies",
    "Low churn consumer companies", 
    "Invest in travel to mars",
    "Invest in companies that run Superbowl ads",
    "Invest in GLP-1s"
  ];

  const secondRowExamples = [
    "Invest in fully-remote companies",
    "Invest in companies with a strong sustainability focus",
    "Companies with high R&D spending",
    "B2B companies with notably high revenue per employee"
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      startGeneration(prompt);
    }
  };

  const handleExampleClick = (example: string) => {
    setLocalPrompt(example);
    startGeneration(example);
  };

  const startGeneration = (promptToGenerate: string) => {
    setIsLoading(true);
    setPrompt(promptToGenerate);
    setLocation("/dashboard");
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white overflow-hidden">
      {/* Floating Letters Background */}
      <FloatingLetters />

      {/* Header */}
      <header className="relative px-4 lg:px-6 h-16 flex items-center z-10 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-black w-1.5 h-1.5 rounded-xs"></div>
              <div className="bg-black w-1.5 h-1.5 rounded-xs"></div>
              <div className="bg-black w-1.5 h-1.5 rounded-xs"></div>
              <div className="bg-black w-1.5 h-1.5 rounded-xs"></div>
            </div>
          </div>
          <div>
            <span className="text-lg font-semibold">Generated</span>
            <div className="text-xs text-gray-400">Assets</div>
          </div>
          <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">BETA</span>
        </div>
        <nav className="ml-auto flex gap-6 items-center">
          <a className="text-sm font-medium hover:text-gray-300 transition-colors" href="#">
            About
          </a>
          <a className="text-sm font-medium hover:text-gray-300 transition-colors" href="#">
            Top list
          </a>
          <Button 
            asChild 
            className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
          >
            <Link href="/auth">Login</Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="w-full max-w-4xl mx-auto">
          {!isLoading && (
            <>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up">
                Turn any idea into an investable index
              </h1>
              <p className="text-xl text-gray-400 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Use AI to create, refine, and share your custom index
              </p>
            </>
          )}
          
          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl mx-auto mb-12 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Input
              type="text"
              placeholder="What would you like to invest in?"
              className="w-full rounded-xl py-6 px-6 text-lg bg-gray-900/90 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              value={prompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-700 hover:bg-gray-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </Button>
          </form>

          {/* Marquee Examples */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Marquee items={firstRowExamples} onItemClick={handleExampleClick} speed={40} />
            <Marquee items={secondRowExamples} onItemClick={handleExampleClick} speed={50} direction="right" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative px-4 py-6 border-t border-gray-800 z-10">
        <div className="text-center text-sm text-gray-500 mb-4">
          <span>An AI product from </span>
          <span className="font-semibold text-white">public</span>
        </div>
        <p className="text-xs text-gray-600 text-center max-w-4xl mx-auto leading-relaxed mb-4">
          Generated Assets is an interactive analysis tool brought to you by Public Holdings, Inc. ("Public"). Using Generated Assets, 
          you can search for stocks and ETFs with the assistance of AI, create a portfolio, and compare key metrics for that portfolio 
          against the benchmark S&P 500. You cannot invest via this website. This information is provided for educational purposes 
          only. By using this tool, you agree to the Generated Assets{" "}
          <a href="#" className="text-blue-400 hover:underline">User Agreement</a> and{" "}
          <a href="#" className="text-blue-400 hover:underline">Acceptable Use Policy</a>.
        </p>
        <nav className="flex justify-center gap-6 flex-wrap">
          <a className="text-xs text-gray-500 hover:text-gray-400" href="#">User Agreement</a>
          <a className="text-xs text-gray-500 hover:text-gray-400" href="#">Acceptable Use Policy</a>
          <a className="text-xs text-gray-500 hover:text-gray-400" href="#">Disclosures</a>
          <a className="text-xs text-gray-500 hover:text-gray-400" href="#">Privacy Policy</a>
          <a className="text-xs text-gray-500 hover:text-gray-400" href="#">Terms of Service</a>
        </nav>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-random {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) rotate(270deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-float-random {
          animation: float-random linear infinite;
        }
      `}</style>
    </div>
  );
}