import encodeMp3 from "./encodeMp3";
import encodeWav from "./encodeWav";
import { EncodeType } from "@/lib/encoders/encoders.types";

const VALID_MP3_BITRATES = [32, 40, 48, 56, 64, 96, 128, 192, 256, 320];

export default function audioEncoder({
  audioBuffer,
  encoding,
  onProgress,
}: EncodeType): Promise<Blob> {
  if (!encoding || encoding === "WAV") {
    return encodeWav(audioBuffer);
  }

  encoding = ~~encoding;
  if (VALID_MP3_BITRATES.indexOf(encoding) === -1) {
    throw new Error("Invalid encoding");
  }

  return encodeMp3({ audioBuffer, encoding, onProgress });
}
