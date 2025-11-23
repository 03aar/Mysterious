import React, { useState, useCallback } from 'react';
import { generateLocationText, generateLocationImage } from './services/geminiService';
import { LocationData, GenerationStatus } from './types';
import LocationCard from './components/LocationCard';
import { Spinner } from './components/Spinner';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [themeInput, setThemeInput] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setStatus(GenerationStatus.GENERATING_TEXT);
    setError(null);
    setLocationData(null);
    setGeneratedImage(null);

    try {
      // 1. Generate Text
      const data = await generateLocationText(themeInput);
      setLocationData(data);
      
      // 2. Generate Image (Parallel or Sequential - Sequential allows UI update for text first)
      // Let's show text immediately while image loads
      setStatus(GenerationStatus.GENERATING_IMAGE);
      
      // Check if visual prompt exists, otherwise use name + atmosphere
      const prompt = data.visualPrompt || `A high quality digital painting of ${data.name}, ${data.visualAtmosphere}`;
      
      const imageBase64 = await generateLocationImage(prompt);
      setGeneratedImage(imageBase64);
      
      setStatus(GenerationStatus.COMPLETE);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to discover location.");
      setStatus(GenerationStatus.ERROR);
    }
  }, [themeInput]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && status !== GenerationStatus.GENERATING_TEXT && status !== GenerationStatus.GENERATING_IMAGE) {
        handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 selection:bg-indigo-500/30">
      
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl mix-blend-screen"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col min-h-screen">
        
        {/* Navbar / Brand */}
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="font-display text-2xl font-bold text-white">M</span>
             </div>
             <div>
                <h1 className="font-display text-xl font-bold tracking-widest text-slate-100">MYSTIC<span className="text-indigo-400">CARTOGRAPHER</span></h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Infinite World Generator</p>
             </div>
          </div>
          <div>
             <a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">Powered by Gemini 2.5</a>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center">
          
          {/* Input Section - Shows when IDLE or ERROR, or if we want to generate another */}
          {status === GenerationStatus.IDLE || status === GenerationStatus.ERROR || (status === GenerationStatus.COMPLETE && !locationData) ? (
            <div className="w-full max-w-2xl mt-12 animate-fade-in">
               <div className="text-center mb-10">
                 <h2 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-500 mb-6">
                   Where will you go?
                 </h2>
                 <p className="text-slate-400 text-lg max-w-lg mx-auto">
                   Enter a theme, keyword, or leave blank for serendipity. The Cartographer awaits your command.
                 </p>
               </div>

               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-slate-900 ring-1 ring-slate-900/5 rounded-lg leading-none flex items-center">
                    <input 
                      type="text" 
                      className="w-full bg-transparent text-slate-200 px-6 py-4 text-lg focus:outline-none placeholder-slate-600 font-light"
                      placeholder="e.g., 'Cyberpunk floating market' or 'Cursed underwater cathedral'"
                      value={themeInput}
                      onChange={(e) => setThemeInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <button 
                      onClick={handleGenerate}
                      className="mr-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium transition-colors flex items-center"
                    >
                      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                      Explore
                    </button>
                  </div>
               </div>

               {status === GenerationStatus.ERROR && (
                 <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-center">
                    <p>{error}</p>
                    <button onClick={() => setStatus(GenerationStatus.IDLE)} className="mt-2 text-sm underline hover:text-white">Try Again</button>
                 </div>
               )}

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                   {['Ancient Ruins', 'Space Station', 'Fey Wilds', 'Dystopian City'].map(preset => (
                       <button 
                          key={preset}
                          onClick={() => { setThemeInput(preset); }}
                          className="p-3 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-all text-sm text-slate-400 hover:text-indigo-300"
                       >
                          {preset}
                       </button>
                   ))}
                </div>
            </div>
          ) : null}

          {/* Loading State */}
          {(status === GenerationStatus.GENERATING_TEXT || status === GenerationStatus.GENERATING_IMAGE) && !locationData && (
             <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
                <Spinner />
                <p className="mt-6 text-indigo-300 font-display tracking-wider animate-pulse">
                    {status === GenerationStatus.GENERATING_TEXT ? 'Consulting the Archives...' : 'Manifesting Visuals...'}
                </p>
             </div>
          )}

          {/* Result State */}
          {locationData && (
             <div className="w-full">
                {status === GenerationStatus.GENERATING_IMAGE && (
                    <div className="fixed top-0 left-0 w-full h-1 bg-slate-900 z-50">
                        <div className="h-full bg-indigo-500 animate-progress-bar"></div>
                    </div>
                )}
                <LocationCard 
                  data={locationData} 
                  imageUrl={generatedImage} 
                  onGenerateNew={() => {
                    setStatus(GenerationStatus.IDLE);
                    setThemeInput('');
                    setLocationData(null);
                    setGeneratedImage(null);
                  }}
                />
             </div>
          )}

        </main>
      </div>
      
      {/* Custom styles for animations */}
      <style>{`
        @keyframes progress-bar {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 90%; }
        }
        .animate-progress-bar {
            animation: progress-bar 2s ease-in-out infinite;
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fade-in 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;