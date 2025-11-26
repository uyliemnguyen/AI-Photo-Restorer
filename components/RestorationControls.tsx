import React from 'react';
import { RestorationOptions } from '../types';

interface RestorationControlsProps {
  options: RestorationOptions;
  setOptions: (options: RestorationOptions) => void;
  disabled: boolean;
}

export const RestorationControls: React.FC<RestorationControlsProps> = ({ options, setOptions, disabled }) => {
  const toggleOption = (key: keyof RestorationOptions) => {
    if (disabled) return;
    setOptions({ ...options, [key]: !options[key] });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      {/* Colorization */}
      <div 
        onClick={() => toggleOption('colorize')}
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group
          ${options.colorize 
            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
            : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg transition-colors ${options.colorize ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-slate-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold ${options.colorize ? 'text-white' : 'text-slate-200'}`}>Color Restoration</h4>
            <p className="text-xs text-slate-400 mt-0.5">Realistic AI colorization for B&W photos</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${options.colorize ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
           {options.colorize && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>

      {/* Fix Scratches */}
      <div 
        onClick={() => toggleOption('fixScratches')}
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group
          ${options.fixScratches
            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
            : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg transition-colors ${options.fixScratches ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-slate-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold ${options.fixScratches ? 'text-white' : 'text-slate-200'}`}>Physical Repair</h4>
            <p className="text-xs text-slate-400 mt-0.5">Remove scratches, creases, and tears</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${options.fixScratches ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
           {options.fixScratches && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>

      {/* Denoise */}
      <div 
        onClick={() => toggleOption('denoise')}
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group
          ${options.denoise 
            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
            : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
         <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg transition-colors ${options.denoise ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-slate-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold ${options.denoise ? 'text-white' : 'text-slate-200'}`}>Denoise & Smooth</h4>
            <p className="text-xs text-slate-400 mt-0.5">Remove grain and noise, enhance clarity</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${options.denoise ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
           {options.denoise && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>

      {/* Face Enhancement */}
      <div 
        onClick={() => toggleOption('sharpenFace')}
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group
          ${options.sharpenFace 
            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
            : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
         <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg transition-colors ${options.sharpenFace ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-slate-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold ${options.sharpenFace ? 'text-white' : 'text-slate-200'}`}>Face Enhancement</h4>
            <p className="text-xs text-slate-400 mt-0.5">Restore facial details (Super-Resolution)</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${options.sharpenFace ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
           {options.sharpenFace && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>

      {/* 2x Upscaling */}
      <div 
        onClick={() => toggleOption('upscale')}
        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between group md:col-span-2
          ${options.upscale 
            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
            : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
         <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg transition-colors ${options.upscale ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-slate-200'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          <div>
            <h4 className={`font-semibold ${options.upscale ? 'text-white' : 'text-slate-200'}`}>2x Upscaling</h4>
            <p className="text-xs text-slate-400 mt-0.5">Increase resolution and detail density</p>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${options.upscale ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 group-hover:border-slate-400'}`}>
           {options.upscale && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
      </div>
    </div>
  );
};