import {
  Animation,
  Asset,
  Helpers,
  Layer,
} from "@lottie-animation-community/lottie-types";

export type textEdit = {
  layers: number[];
  text: string;
};

export type colorEdit = {
  id: number;
  indexes: Array<string | number>;
  nm?: string;
  type: "precomps" | "shape" | "text";
  color: Helpers.ColorRgba;
  hex: string;
};

export type Palette = {
  name: string;
  colors: string[];
};

export type Template = {
  id: number;
  animation: Animation;
  title: string;
  screenshot: string;
};

// Define a type for the slice state
export interface LottieState {
  currentAnimation: number;
  animationData: Animation | null;
  currentPalette: number;
  frameRate: number;
  time: string;
  assets?: Asset.Value[];
  layers?: Layer.Value[];
  colors: colorEdit[];
  hexes?: string[];
  precomps?: Layer.Precomposition[];
  solids?: Layer.SolidColor[];
  images?: Layer.Image[];
  nullLayers?: Layer.Null[];
  imageAssets?: Asset.Image[];
  shapes?: Layer.Shape[];
  texts: Record<string, textEdit>;
  textLayers?: Layer.Text[];
  audios?: Layer.Audio[];
  videos?: Layer.Video[];
}
