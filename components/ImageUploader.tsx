import React, { useRef, useState } from 'react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../constants';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcess = (file: File) => {
    setError(null);
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, or WEBP formats are accepted.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image size too large. Please select an image under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    onImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-slate-700 hover:border-indigo-400 hover:bg-slate-800/50 bg-slate-900/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={ALLOWED_FILE_TYPES.join(',')}
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full bg-slate-800 transition-colors ${isDragging ? 'bg-indigo-500 text-white' : 'text-indigo-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Upload image or drag & drop here</h3>
            <p className="text-slate-400 text-sm">Supports JPG, PNG, WEBP (Max {MAX_FILE_SIZE_MB}MB)</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};