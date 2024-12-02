import {
  Animation,
  Asset,
  Helpers,
} from "@lottie-animation-community/lottie-types";
import ColorRgba = Helpers.ColorRgba;

export type textEdit = {
  layers: number[];
  text: string;
};

export type colorEdit = {
  // id: number;
  indexes: Array<string | number>;
  nm?: string;
  color: Helpers.ColorRgba;
  hex: string;
  primary: number;
};

export type Palette = {
  id: number;
  name: string;
  color: string;
  exclude: number[];
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
  currentPalette: number[];
  frameRate: number;
  time: string;
  colors: colorEdit[];
  hexes?: string[];
  imageAssets: Asset.Image[];
  audioAssets: Asset.Sound[];
  texts: Record<string, textEdit>;
  logo: number[];
  hasLogo: boolean;
  lottieColors: ColorRgba[];
}
