import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { usePrompt } from "@/hooks/PromptContext";
import { Marquee } from "@/components/Marquee";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  const [prompt, setLocalPrompt] = useState("");
  const { setPrompt } = usePrompt();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const firstRowExamples = [
    "Companies that benefit from Gen-Z consumer habits",
    "Invest in top 20 dividend-paying companies",
    "Companies pioneering the future of space exploration",
    "Disruptive biotech companies",
    "The next generation of gaming and esports",
    "Top robotics and automation companies",
  ];

  const secondRowExamples = [
    "Companies with lots of users, but low ARPU",
    "B2B companies with less than 10% consulting revenues",
    "Companies that Andreessen Horowitz invested in",
    "Invest in self-driving automation",
    "Leaders in the plant-based food industry",
    "E-commerce giants outside of the US",
    "Firms specializing in quantum computing",
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
    <div className="relative flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-80 right-1/4 w-1 h-1 bg-pink-400/60 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-yellow-400/60 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-32 right-1/2 w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-float" style={{ animationDelay: '5s' }}></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-1/3 left-1/6 w-16 h-16 border border-blue-300/30 rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute top-2/3 right-1/6 w-12 h-12 border border-purple-300/30 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-3/4 w-20 h-20 border border-green-300/30 rounded-lg rotate-45 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <header className="relative px-4 lg:px-6 h-14 flex items-center z-10">
        <div className="flex items-center justify-center ">
          {/* Assuming an SVG or similar for logo */}
          <span className="text-lg font-semibold">Generated Assets</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Top list
          </a>
          {/* <Button asChild variant="outline"> */}
            <Link href="/auth" className='bg-gray-800 text-white px-4 py-2 text-sm rounded-full'>Login</Link>
          {/* </Button> */}
          {/* <ThemeToggle /> */}
        </nav>
      </header>
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="w-full max-w-4xl mx-auto">
          {!isLoading && (
            <>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 animate-fade-in-up">
                Turn any idea into an investable index
              </h1>
              <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Use AI to create, refine, and share your custom index
              </p>
            </>
          )}
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Input
              type="text"
              placeholder="What would you like to invest in?"
              className="w-full rounded-2xl p-8 ps-4 text-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-800/50 shadow-xl"
              value={prompt}
              style={{
                // padding: '1rem 2rem',
                background: 'linear-gradient(180deg, #212124 5.7%, #161719)',
                backdropFilter: 'blur(10px)',
              }}
              onChange={(e) => setLocalPrompt(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full backdrop-blur-sm bg-gray-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </form>
          <div className="mt-8 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Marquee items={firstRowExamples} onItemClick={handleExampleClick} speed={60} />
            <Marquee items={secondRowExamples} onItemClick={handleExampleClick} speed={70} direction="right" />
          </div>
        </div>
      </main>
      <footer className="relative flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t z-10">
        <p className="text-xs text-muted-foreground">
          © 2024 Generated Assets. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            User Agreement
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Acceptable Use Policy
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Disclosures
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
        </nav>
      </footer>
    </div>
  );
} 