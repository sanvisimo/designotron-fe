import audioEncoder from "@/lib/encoders";

/**
 * detect if a file is an audio.
 */
export const isAudio = (file: File) => file.type.indexOf("audio") > -1;

/**
 * create range [min .. max]
 */
export const range = (min: number, max: number) =>
  Array.from(new Array(max - min + 1), (v, i) => i + min);

interface FileReadAsType {
  ArrayBuffer: ArrayBuffer;
  DataURL: string;
}

/**
 * FileReader in promise
 */
export const readFile = <Type extends keyof FileReadAsType>(
  file: Blob,
  dataType: Type,
) =>
  new Promise<FileReadAsType[Type]>((resolve, reject) => {
    const reader = new FileReader();
    reader[`readAs${dataType}`](file);
    reader.onload = () => resolve(reader.result as FileReadAsType[Type]);
    reader.onerror = (err) => reject(err);
  });

/**
 * Read File/Blob to ArrayBuffer
 */
export const readArrayBuffer = (file: Blob) => readFile(file, "ArrayBuffer");

/**
 * Read File/Blob to Base64
 */
export const readDataURL = (file: Blob) => readFile(file, "DataURL");

export const readBlobURL = (file: Blob) => URL.createObjectURL(file);

export const download = (url: string, name: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
};

export const returnBlobData = (file: Blob) =>
  new Promise<string>((res, rej) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        if (reader.result && typeof reader.result === "string") {
          const base64data = reader.result;
          res(base64data);
        }
      };
    } else rej(new Error("Failed to create blob"));
  });

export const rename = (filename: string, ext: string, stamp?: string) =>
  `${filename.replace(/\.\w+$/, "")}${stamp || ""}.${ext}`;

/**
 * format seconds to [minutes, integer, decimal(2)]
 */
export const formatSeconds = (seconds: number) => [
  Math.floor(seconds / 60),
  Math.floor(seconds % 60),
  Math.round((seconds % 1) * 100),
];

export const encode = (
  audioBuffer: AudioBuffer,
  onProgress: (id: number) => void,
): Promise<Blob> => {
  return audioEncoder({
    audioBuffer,
    encoding: 192,
    onProgress,
  });
};
