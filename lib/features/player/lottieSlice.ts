import {
  AnimatedProperty,
  Animation,
  Asset,
  Helpers,
  Shape,
} from "@lottie-animation-community/lottie-types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HEXToRGB, RGBAToHexA } from "@/lib/canvasUtils";
import album_release from "@/lib/features/player/album_release.json";
import concert from "@/lib/features/player/concert.json";
import { colorEdit, LottieState } from "@/lib/types";

// Define the initial state using that type
const initialState: LottieState = {
  currentAnimation: 0,
  animations: [
    {
      id: 1,
      animation: album_release as Animation,
      title: "Album Release",
      screenshot: "Album_release.png",
    },
    {
      id: 2,
      animation: concert as Animation,
      title: "Concert",
      screenshot: "Event.png",
    },
  ],
  palettes: [
    {
      name: "Dark / Yellow",
      colors: ["#1c1c1c", "#f7ad57", "#f5ab57"],
    },
    {
      name: "Light / Green",
      colors: ["#3f8b3e", "#3e8a3d", "#f2ede5"],
    },
    {
      name: "Pink / Yellow",
      colors: ["#f63", "#dad", "#1c1c1c"],
    },
  ],
  currentPalette: 0,
  animationData: null,
  frameRate: 25,
  time: "0.00 s",
  assets: [],
  layers: [],
  colors: [],
  hexes: [],
  precomps: [],
  solids: [],
  images: [],
  imageAssets: [],
  nullLayers: [],
  shapes: [],
  texts: {},
  textLayers: [],
  audios: [],
  videos: [],
};

export const lottieSlice = createSlice({
  name: "lottie",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAnimationData: (state, action: PayloadAction<number>) => {
      if (action.payload === null || action.payload === undefined) return;
      const colors: colorEdit[] = [];

      const animationData = state.animations[action.payload].animation;
      state.currentAnimation = action.payload;

      state.frameRate = animationData.fr ?? 25;

      state.time = `${(animationData.op - animationData.ip) / state.frameRate} s`;

      state.assets = animationData.assets;

      state.layers = animationData.layers;
      state.precomps = animationData.layers?.filter((layer) => layer.ty === 0);
      if (state.precomps && state.precomps.length > 0) {
        state.precomps?.forEach((precomp) => {
          if (precomp.ef && !!precomp.ef.length) {
            const fill = precomp?.ef?.findIndex((e) => e.nm === "Fill");
            if (fill > -1) {
              const kIndex = precomp.ef[fill].ef.findIndex((e) => e.ty === 2);

              if (
                kIndex > -1 &&
                precomp.ind &&
                precomp?.ef?.[fill]?.ef?.[kIndex].ty === 2
              ) {
                const color = precomp.ef[fill].ef[kIndex]
                  .v as AnimatedProperty.Color;

                colors.push(<colorEdit>{
                  id: precomp.ind,
                  indexes: [
                    "layers",
                    precomp.ind - 1,
                    "ef",
                    fill,
                    "ef",
                    kIndex,
                    "v",
                    "k",
                  ],
                  type: "precomps",
                  color: color.k as Helpers.ColorRgba,
                  hex: RGBAToHexA(color.k as Helpers.ColorRgba),
                });
              }
            }
          }
        });
      }
      state.solids = animationData.layers?.filter((layer) => layer.ty === 1);
      state.images = animationData.layers?.filter((layer) => layer.ty === 2);
      if (state.images && state.images.length) {
        const i = new Set(state.images?.map((i) => i.refId));
        state.imageAssets = state.assets?.filter((asset) =>
          i.has(asset.id),
        ) as Asset.Image[];
      }

      state.nullLayers = animationData.layers?.filter(
        (layer) => layer.ty === 3,
      );
      state.shapes = animationData.layers?.filter((layer) => layer.ty === 4);

      if (state.shapes && state.shapes.length) {
        state.shapes.forEach((layer) => {
          layer.shapes.forEach((shape, index: number) => {
            if (shape.ty === "gr" && !!shape.it) {
              const itIndex = shape.it.findIndex(
                (i) => i.ty === "st" || i.ty === "fl",
              );
              if (itIndex > -1 && layer.ind) {
                const color = shape.it[itIndex] as Shape.Stroke | Shape.Fill;
                if ("c" in color) {
                  const c = color.c as AnimatedProperty.Color;
                  colors.push(<colorEdit>{
                    id: layer.ind,
                    indexes: [
                      "layers",
                      layer.ind - 1,
                      "shapes",
                      index,
                      "it",
                      itIndex,
                      "c",
                      "k",
                    ],
                    type: "shape",
                    color: c.k as Helpers.ColorRgba,
                    hex: RGBAToHexA(c.k as Helpers.ColorRgba),
                  });
                }
              }
            }
          });
        });
      }

      state.textLayers = animationData.layers?.filter(
        (layer) => layer.ty === 5,
      );

      if (state.textLayers && state.textLayers.length) {
        state.texts = {};
        state.textLayers.forEach((layer) => {
          if (layer.nm && layer.ind) {
            if (!state.texts[layer.nm]) {
              state.texts[layer.nm] = {
                layers: [],
                text: layer.t.d.k[0].s.t,
              };
            }

            const index = layer.t.d.k[0].s.fc ? "fc" : "sc";

            colors.push(<colorEdit>{
              id: layer.ind,
              indexes: [
                "layers",
                layer.ind - 1,
                "t",
                "d",
                "k",
                "0",
                "s",
                index,
              ],
              type: "text",
              color: layer.t.d.k[0].s.fc ?? layer.t.d.k[0].s.sc,
              hex: RGBAToHexA(layer.t.d.k[0].s.fc ?? layer.t.d.k[0].s.sc),
            });
            state.texts[layer.nm].layers.push(layer.ind);
          }
        });
      }
      state.colors = colors;
      const hexes = [...new Set(colors.map((c) => c.hex))];
      state.currentPalette = state.palettes.findIndex(
        (x) => JSON.stringify(x.colors) === JSON.stringify(hexes),
      );
      state.audios = animationData.layers?.filter((layer) => layer.ty === 6);
      state.videos = animationData.layers?.filter((layer) => layer.ty === 9);

      state.animationData = animationData;
    },
    updateText: (
      state,
      action: PayloadAction<{ key: string; text: string }>,
    ) => {
      state.texts[action.payload.key].text = action.payload.text;
      const animationData = { ...state.animationData } as Animation;
      animationData.layers?.map((layer) => {
        if (layer.ind) {
          if (
            layer.ty === 5 &&
            state.texts[action.payload.key]?.layers.includes(layer.ind)
          ) {
            layer.t.d.k[0].s.t = action.payload.text;
          }
        }
        return layer;
      });

      state.animationData = animationData;
    },
    updateImage: (state, action) => {
      const animationData = { ...state.animationData } as Animation;
      if (animationData.assets) {
        const index = animationData.assets.findIndex(
          (a) => a.id === action.payload.id,
        );
        if ("p" in animationData.assets[index]) {
          animationData.assets[index].p = action.payload.croppedImage;
          state.animationData = animationData;
        }
      }
    },
    setColors: (state, action) => {
      const animationData = JSON.parse(
        JSON.stringify(state.animationData),
      ) as Animation;
      const palette = { ...state.palettes[action.payload] };
      const current = { ...state.palettes[state.currentPalette] };

      current.colors.forEach((color, index) => {
        state.colors.forEach((c, cIndex) => {
          if (c.hex === color) {
            c.indexes.reduce((acc, key, i) => {
              // @ts-expect-error: Key not valid
              if (acc[key] === undefined) {
                // @ts-expect-error: Key not valid
                acc[key] = {};
              }
              if (i === c.indexes.length - 1) {
                // @ts-expect-error: Key not valid
                acc[key] = HEXToRGB(palette.colors[index]);
              }
              // @ts-expect-error: Key not valid
              return acc[key];
            }, animationData);

            state.colors[cIndex] = {
              ...c,
              color: HEXToRGB(palette.colors[index]),
              hex: palette.colors[index],
            };
          }
        });
      });

      state.currentPalette = action.payload;
      state.animationData = animationData;
    },
  },
});

export const { setAnimationData, updateText, updateImage, setColors } =
  lottieSlice.actions;

export default lottieSlice.reducer;
