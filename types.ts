export interface RestorationOptions {
  colorize: boolean;
  denoise: boolean;
  fixScratches: boolean;
  sharpenFace: boolean;
  upscale: boolean;
}

export interface RestorationResult {
  originalUrl: string;
  restoredUrl: string | null;
  loading: boolean;
  error: string | null;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
}