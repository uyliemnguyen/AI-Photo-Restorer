import React, { useState, useRef, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { RestorationControls } from './components/RestorationControls';
import { ImageComparison } from './components/ImageComparison';
import { Button } from './components/Button';
import { AppState, RestorationOptions } from './types';
import { DEFAULT_OPTIONS } from './constants';
import { restoreImage } from './services/geminiService';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<RestorationOptions>(DEFAULT_OPTIONS);
  const [error, setError] = useState<string | null>(null);
  
  // Contact popover state
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  // Close contact popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageSelect = (selectedFile: File) => {
    const objectUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(objectUrl);
    setAppState(AppState.UPLOAD); // Ready to process
    setError(null);
  };

  const handleRestoration = async () => {
    if (!file) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const resultUrl = await restoreImage(file, options);
      setRestoredUrl(resultUrl);
      setAppState(AppState.RESULT);
    } catch (err: any) {
      setError(err.message || "An error occurred during restoration.");
      setAppState(AppState.UPLOAD);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setRestoredUrl(null);
    setAppState(AppState.UPLOAD);
    setError(null);
  };

  const handleAdjustSettings = () => {
    setRestoredUrl(null);
    setAppState(AppState.UPLOAD);
    setError(null);
  };

  const handleDownload = () => {
    if (!restoredUrl) return;
    const link = document.createElement('a');
    link.href = restoredUrl;
    link.download = `restored-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="font-bold text-xl tracking-tight text-white">PhotoRestorer</span>
          </div>
          <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hidden md:block hover:text-white transition-colors">Features</a>
            <a href="#" className="hidden md:block hover:text-white transition-colors">How it works</a>
            
            {/* Contact Dropdown */}
            <div className="relative" ref={contactRef}>
              <button 
                onClick={() => setIsContactOpen(!isContactOpen)} 
                className={`hover:text-white transition-colors focus:outline-none ${isContactOpen ? 'text-white' : ''}`}
              >
                Contact
              </button>
              
              {isContactOpen && (
                <div className="absolute right-0 top-full mt-4 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/10">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Developer</span>
                      <p className="text-white font-medium text-base">Liem Nguyen</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Email</span>
                      <a 
                        href="mailto:uyliemnguyen15@gmail.com" 
                        className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium break-all block"
                      >
                        uyliemnguyen15@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  {/* Decorative pointer arrow */}
                  <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-900 border-t border-l border-slate-700 rotate-45"></div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Hero Text */}
        <div className="text-center mb-12 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Restore Old Memories with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI Power</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Automatically colorize, sharpen, and remove scratches from old photos in seconds.
          </p>
        </div>

        {/* Main Workspace */}
        <div className="w-full flex flex-col items-center gap-8">
          
          {/* Stage 1: Upload & Preview */}
          {!previewUrl && (
            <ImageUploader onImageSelect={handleImageSelect} />
          )}

          {/* Stage 2: Processing / Result View */}
          {previewUrl && (
             <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
                
                {/* Preview Area */}
                {appState === AppState.RESULT && restoredUrl ? (
                   <div className="w-full flex flex-col items-center gap-4">
                      <ImageComparison beforeImage={previewUrl} afterImage={restoredUrl} />
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <Button onClick={handleDownload}>
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                           Download
                        </Button>
                        <Button variant="secondary" onClick={handleAdjustSettings}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                           Try Again
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                           New Image
                        </Button>
                      </div>
                   </div>
                ) : (
                  <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    {appState === AppState.PROCESSING && (
                       <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-white font-medium animate-pulse">Restoring image...</p>
                          <p className="text-slate-400 text-sm mt-2">This process may take 10-20 seconds</p>
                       </div>
                    )}
                    {/* Remove button when in preview mode */}
                    {appState === AppState.UPLOAD && (
                        <button 
                            onClick={handleReset}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                  </div>
                )}

                {/* Controls (Only visible if not yet processed or if user wants to retry) */}
                {appState !== AppState.RESULT && (
                  <div className="w-full flex flex-col items-center gap-6">
                    <RestorationControls 
                       options={options} 
                       setOptions={setOptions} 
                       disabled={appState === AppState.PROCESSING} 
                    />
                    
                    {error && (
                      <div className="text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20 text-sm text-center max-w-md">
                        {error}
                      </div>
                    )}

                    <Button 
                      onClick={handleRestoration} 
                      isLoading={appState === AppState.PROCESSING}
                      className="w-full max-w-xs text-lg py-4 shadow-xl shadow-indigo-500/20"
                    >
                      {appState === AppState.PROCESSING ? 'Processing...' : 'Start Restoration'}
                    </Button>
                  </div>
                )}
             </div>
          )}

        </div>
      </main>

      <footer className="border-t border-slate-800 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 AI PhotoRestorer. Powered by Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
}

export default App;