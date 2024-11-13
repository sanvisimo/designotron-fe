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
  logo: [],
  hasLogo: false,
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

      const i = new Set();
      state.texts = {};
      state.logo = [];
      animationData.layers.forEach((layer, index) => {
        if (!layer.ind || !layer.nm) return;

        if (layer.nm.toLowerCase().includes("logo")) {
          state.logo.push(layer.ind);
          state.hasLogo = true;
        }

        if (layer.ty === 0 && layer.ef && !!layer.ef.length) {
          /** TYPE Precomps **/
          const fill = layer?.ef?.findIndex((e) => e.nm === "Fill");
          if (fill > -1) {
            const kIndex = layer.ef[fill].ef.findIndex((e) => e.ty === 2);

            if (
              kIndex > -1 &&
              layer.ind &&
              layer?.ef?.[fill]?.ef?.[kIndex].ty === 2
            ) {
              const color = layer.ef[fill].ef[kIndex]
                .v as AnimatedProperty.Color;

              colors.push(<colorEdit>{
                id: layer.ind,
                index,
                indexes: ["layers", index, "ef", fill, "ef", kIndex, "v", "k"],
                color: color.k as Helpers.ColorRgba,
                hex: RGBAToHexA(color.k as Helpers.ColorRgba),
              });
            }
          }
        }

        /** TYPE Images **/
        if (layer.ty === 2) {
          i.add(layer.refId);
        }
        /** TYPE SHAPE **/
        if (layer.ty === 4) {
          layer.shapes.forEach((shape, sIndex: number) => {
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
                    index,
                    indexes: [
                      "layers",
                      index,
                      "shapes",
                      sIndex,
                      "it",
                      itIndex,
                      "c",
                      "k",
                    ],
                    color: c.k as Helpers.ColorRgba,
                    hex: RGBAToHexA(c.k as Helpers.ColorRgba),
                  });
                }
              }
            }
          });
        }

        /** TYPE Texts **/
        if (layer.ty === 5) {
          if (layer.nm && layer.ind) {
            if (!state.texts[layer.nm]) {
              state.texts[layer.nm] = {
                layers: [],
                text: layer.t.d.k[0].s.t,
              };
            }

            if (layer.t.d.k[0].s.fc) {
              colors.push(<colorEdit>{
                id: layer.ind,
                index,
                indexes: ["layers", index, "t", "d", "k", "0", "s", "fc"],
                color: layer.t.d.k[0].s.fc,
                hex: RGBAToHexA(layer.t.d.k[0].s.fc),
              });
            }
            if (layer.t.d.k[0].s.sc) {
              colors.push(<colorEdit>{
                id: layer.ind,
                indexes: ["layers", index, "t", "d", "k", "0", "s", "sc"],
                index,
                color: layer.t.d.k[0].s.sc,
                hex: RGBAToHexA(layer.t.d.k[0].s.sc),
              });
            }
            state.texts[layer.nm].layers.push(layer.ind);
          }
        }
      });
      state.imageAssets = [];
      if (animationData.layers.some((layer) => layer.ty === 2)) {
        state.imageAssets = animationData.assets?.filter((asset) =>
          i.has(asset.id),
        ) as Asset.Image[];
      }
      state.colors = colors;
      const hexes = [...new Set(colors.map((c) => c.hex))].toSorted((a, b) =>
        a < b ? -1 : 1,
      );

      state.currentPalette = palettes.findIndex(
        (x) =>
          JSON.stringify(x.colors.toSorted((a, b) => (a < b ? -1 : 1))) ===
          JSON.stringify(hexes),
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
      if (animationData.assets && state.imageAssets) {
        const index = animationData.assets.findIndex(
          (a) => a.id === action.payload.id,
        );
        if ("p" in animationData.assets[index]) {
          animationData.assets[index].p = action.payload.croppedImage;
          const i = state.imageAssets.findIndex(
            (a) => a.id === action.payload.id,
          );
          state.imageAssets[i].p = action.payload.croppedImage;
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
    toggleLogo: (state, action) => {
      const animationData = JSON.parse(
        JSON.stringify(state.animationData),
      ) as Animation;
      state.animationData = null;
      let layers = animationData.layers;
      if (action.payload) {
        layers = [
          ...animationData.layers,
          ...animations[state.currentAnimation].animation.layers.filter(
            (layer) => layer.ind && state.logo.includes(layer.ind),
          ),
        ].sort((a, b) => Number(a.ind ?? 0) - Number(b.ind ?? 0));
      } else {
        layers = animationData.layers.filter(
          (layer) => layer.ind && !state.logo.includes(layer.ind),
        );
      }
      state.animationData = {
        ...animationData,
        layers,
      };

      state.hasLogo = action.payload;
    },
  },
});

export const {
  setAnimationData,
  updateText,
  updateImage,
  setColors,
  toggleLogo,
} = lottieSlice.actions;

export default lottieSlice.reducer;
