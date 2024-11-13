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
import { animations, palettes } from "@/lib/defaults";
import { colorEdit, LottieState } from "@/lib/types";

// Define the initial state using that type
const initialState: LottieState = {
  currentAnimation: 0,
  currentPalette: 0,
  animationData: null,
  frameRate: 25,
  time: "0.00 s",
  colors: [],
  imageAssets: [],
  texts: {},
};

export const lottieSlice = createSlice({
  name: "lottie",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAnimationData: (state, action: PayloadAction<number>) => {
      if (action.payload === null || action.payload === undefined) return;
      const colors: colorEdit[] = [];

      const animationData = animations[action.payload].animation;
      state.currentAnimation = action.payload;

      state.frameRate = animationData.fr ?? 25;

      state.time = `${(animationData.op - animationData.ip) / state.frameRate} s`;

      const assets = animationData.assets;
      localStorage.setItem("assets", JSON.stringify(animationData.assets));
      localStorage.setItem("layers", JSON.stringify(animationData.layers));

      const precomps = animationData.layers?.filter((layer) => layer.ty === 0);
      localStorage.setItem("precomps", JSON.stringify(precomps));
      if (precomps && precomps.length > 0) {
        precomps?.forEach((precomp) => {
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
      const solids = animationData.layers?.filter((layer) => layer.ty === 1);
      localStorage.setItem("solids", JSON.stringify(solids));

      const images = animationData.layers?.filter((layer) => layer.ty === 2);
      localStorage.setItem("images", JSON.stringify(images));
      state.imageAssets = [];
      if (images && images.length) {
        const i = new Set(images?.map((i) => i.refId));
        state.imageAssets = assets?.filter((asset) =>
          i.has(asset.id),
        ) as Asset.Image[];
      }

      const nullLayers = animationData.layers?.filter(
        (layer) => layer.ty === 3,
      );
      localStorage.setItem("nullLayers", JSON.stringify(nullLayers));

      const shapes = animationData.layers?.filter((layer) => layer.ty === 4);
      localStorage.setItem("shapes", JSON.stringify(shapes));

      if (shapes && shapes.length) {
        shapes.forEach((layer) => {
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

      const textLayers = animationData.layers?.filter(
        (layer) => layer.ty === 5,
      );

      if (textLayers && textLayers.length) {
        state.texts = {};
        textLayers.forEach((layer) => {
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
      state.currentPalette = palettes.findIndex(
        (x) => JSON.stringify(x.colors) === JSON.stringify(hexes),
      );
      const audios = animationData.layers?.filter((layer) => layer.ty === 6);
      localStorage.setItem("audios", JSON.stringify(audios));
      const videos = animationData.layers?.filter((layer) => layer.ty === 9);
      localStorage.setItem("videos", JSON.stringify(videos));

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
      state.animationData = null;
      const palette = { ...palettes[action.payload] };
      const current = { ...palettes[state.currentPalette] };

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
