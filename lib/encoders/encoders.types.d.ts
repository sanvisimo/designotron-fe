export type EncodeType = {
  audioBuffer: AudioBuffer;
  encoding: "WAV" | number | null;
  onProgress?: (index: number) => void;
  onComplete?: (blob: Blob) => void;
};
