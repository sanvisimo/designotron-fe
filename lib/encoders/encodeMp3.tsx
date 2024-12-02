import * as lamejs from "@breezystack/lamejs";
import { EncodeType } from "@/lib/encoders/encoders.types";

const MAX_AMPLITUDE = 0x7fff;

export default function encodeMp3({
  audioBuffer,
  encoding,
  onProgress,
}: EncodeType): Promise<Blob> {
  return new Promise((res) => {
    // if (audioBuffer.sampleRate !== 44100) {
    //   // TODO: generalize encoder for different sample rates
    //   throw new Error("Expecting 44100 Hz sample rate");
    // }

    let nChannels = audioBuffer.numberOfChannels;

    if (nChannels !== 1 && nChannels !== 2) {
      throw new Error("Expecting mono or stereo audioBuffer");
    }

    const bitrate = (encoding as number) || 128;
    if (bitrate < 96) {
      // lame fails to encode stereo audio if bitrate is lower than 96.
      // in which case, we force sound to be mono (use only channel 0)
      nChannels = 1;
    }

    const bufferLength = audioBuffer.length;

    // convert audioBuffer to sample buffers
    const buffers: Int16Array[] = [];

    for (let channel = 0; channel < nChannels; channel++) {
      const buffer = audioBuffer.getChannelData(channel);
      const samples = new Int16Array(bufferLength);

      for (let i = 0; i < bufferLength; ++i) {
        let sample = buffer[i];

        // clamp and convert to 16bit number
        sample = Math.min(1, Math.max(-1, sample));
        sample = Math.round(sample * MAX_AMPLITUDE);

        samples[i] = sample;
      }

      buffers.push(samples);
    }

    // can be anything but make it a multiple of 576 to make encoders life easier
    const BLOCK_SIZE = 1152;
    const mp3encoder = new lamejs.Mp3Encoder(
      nChannels,
      audioBuffer.sampleRate,
      bitrate,
    );
    const mp3Data: Uint8Array[] = [];

    let blockIndex = 0;

    function encodeChunk() {
      let mp3buf;
      if (nChannels === 1) {
        const chunk = buffers[0].subarray(blockIndex, blockIndex + BLOCK_SIZE);
        mp3buf = mp3encoder.encodeBuffer(chunk);
      } else {
        const chunkL = buffers[0].subarray(blockIndex, blockIndex + BLOCK_SIZE);
        const chunkR = buffers[1].subarray(blockIndex, blockIndex + BLOCK_SIZE);
        mp3buf = mp3encoder.encodeBuffer(chunkL, chunkR);
      }

      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }

      blockIndex += BLOCK_SIZE;
    }

    function update() {
      if (blockIndex >= bufferLength) {
        // finish writing mp3
        const mp3buf = mp3encoder.flush();

        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        res(new Blob(mp3Data, { type: "audio/mp3" }));
        return;
      }
      const start = performance.now();

      while (blockIndex < bufferLength && performance.now() - start < 15) {
        encodeChunk();
      }

      if (onProgress) onProgress(blockIndex / bufferLength);
      setTimeout(update, 16.7);
    }

    update();
  });
}
