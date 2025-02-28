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
  currentPalette: [0, 1],
  animationData: null,
  frameRate: 25,
  time: "0.00 s",
  colors: [],
  imageAssets: [],
  audioAssets: [],
  texts: {},
  logo: [],
  hasLogo: false,
  hexes: [],
  lottieColors: [],
};

export const lottieSlice = createSlice({
  name: "lottie",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAnimationData: (state, action: PayloadAction<number>) => {
      if (action.payload === null || action.payload === undefined) return;
      const colors: colorEdit[] = [];

      console.log("animations", animations, action.payload);

      const animationIndex = animations?.findIndex(
        (a) => a.id === action.payload,
      );

      if (animationIndex === -1) return;
      const animationData = animations[animationIndex].animation;

      state.currentAnimation = animationIndex;

      state.frameRate = animationData.fr ?? 25;

      state.time = `${(animationData.op - animationData.ip) / state.frameRate} s`;

      const i = new Set();
      state.texts = {};
      state.logo = [];

      const hexes: string[] = [];
      const audioAssets: Asset.Sound[] = [];

      if (animationData.assets && animationData.assets.length) {
        animationData.assets.forEach((asset, index) => {
          if ("layers" in asset) {
            asset.layers.forEach((layer, layerInd) => {
              if (layer.ty === 4) {
                layer.shapes.forEach((shape, sIndex: number) => {
                  if (shape.ty === "gr" && !!shape.it) {
                    const itIndex = shape.it.findIndex(
                      (i) => i.ty === "st" || i.ty === "fl",
                    );
                    if (itIndex > -1 && layer.ind) {
                      const color = shape.it[itIndex] as
                        | Shape.Stroke
                        | Shape.Fill;
                      if ("c" in color) {
                        const c = color.c as AnimatedProperty.Color;

                        const hex = RGBAToHexA(c.k as Helpers.ColorRgba);

                        if (!hexes.includes(hex)) {
                          hexes.push(hex);
                        }

                        colors.push(<colorEdit>{
                          indexes: [
                            "assets",
                            index,
                            "layers",
                            layerInd,
                            "shapes",
                            sIndex,
                            "it",
                            itIndex,
                            "c",
                            "k",
                          ],
                          color: c.k as Helpers.ColorRgba,
                          hex: hex,
                          primary: hexes.findIndex((h) => h === hex),
                        });
                      }
                    }
                  }
                });
              }
            });
          }

          if ("p" in asset && asset.p.includes("audio")) {
            audioAssets.push(asset);
          }
        });
      }

      state.audioAssets = audioAssets;

      animationData.layers.forEach((layer, index) => {
        if (!layer.ind || !layer.nm) return;

        if (layer.nm.toLowerCase().includes("logo")) {
          state.logo.push(layer.ind);
          state.hasLogo = true;
        }

        if (layer.ty === 0) {
          /** TYPE Precomps **/
          // const color = layer?.ks?.a as AnimatedProperty.Color;
          //
          // colors.push(<colorEdit>{
          //   id: layer.ind,
          //   index,
          //   indexes: ["layers", index, "ks", "a", "k"],
          //   color: color.k as Helpers.ColorRgba,
          //   hex: RGBAToHexA(color.k as Helpers.ColorRgba),
          // });
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
                  const hex = RGBAToHexA(c.k as Helpers.ColorRgba);
                  if (!hexes.includes(hex)) {
                    hexes.push(hex);
                  }

                  colors.push(<colorEdit>{
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
                    hex: hex,
                    primary: hexes.findIndex((h) => h === hex),
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
              const hex = RGBAToHexA(layer.t.d.k[0].s.fc);
              if (!hexes.includes(hex)) {
                hexes.push(hex);
              }

              colors.push(<colorEdit>{
                indexes: ["layers", index, "t", "d", "k", "0", "s", "fc"],
                color: layer.t.d.k[0].s.fc,
                hex: hex,
                primary: hexes.findIndex((h) => h === hex),
              });
            }
            if (layer.t.d.k[0].s.sc) {
              const hex = RGBAToHexA(layer.t.d.k[0].s.sc);
              if (!hexes.includes(hex)) {
                hexes.push(hex);
              }

              colors.push(<colorEdit>{
                indexes: ["layers", index, "t", "d", "k", "0", "s", "sc"],
                color: layer.t.d.k[0].s.sc,
                hex: hex,
                primary: hexes.findIndex((h) => h === hex),
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
      state.hexes = hexes;

      state.currentPalette = hexes.map((hex) =>
        palettes.findIndex((p) => p.color === hex),
      );

      // state.currentPalette = palettes.findIndex(
      //   (x) =>
      //     JSON.stringify(x.colors.toSorted((a, b) => (a < b ? -1 : 1))) ===
      //     JSON.stringify(state.hexes),
      // );

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
    updateAudio: (state, action) => {
      const animationData = { ...state.animationData } as Animation;
      if (animationData.assets && state.audioAssets.length > 0) {
        const index = animationData.assets.findIndex(
          (a) => a.id === action.payload.id,
        );
        if ("p" in animationData.assets[index]) {
          animationData.assets[index].p = action.payload.path;
          const i = state.audioAssets.findIndex(
            (a) => a.id === action.payload.id,
          );
          state.audioAssets[i].p = action.payload.path;
          state.animationData = animationData;
        }
      }
    },
    setColor: (state, action) => {
      const animationData = JSON.parse(
        JSON.stringify(state.animationData),
      ) as Animation;
      state.animationData = null;
      const colors = JSON.parse(
        JSON.stringify(
          state.colors.filter((c) => c.primary === action.payload.index),
        ),
      );
      const palette = { ...palettes[action.payload.paletteId] };

      console.log("colors", colors);
      console.log("palette", palette);

      state.colors
        .filter((c) => c.primary === action.payload.index)
        .forEach((c) => {
          c.indexes.reduce((acc, key, i) => {
            // @ts-expect-error: Key not valid
            if (acc[key] === undefined) {
              // @ts-expect-error: Key not valid
              acc[key] = {};
            }
            if (i === c.indexes.length - 1) {
              // @ts-expect-error: Key not valid
              acc[key] = HEXToRGB(palette.color);
            }
            // @ts-expect-error: Key not valid
            return acc[key];
          }, animationData);
        });

      const current = [...state.currentPalette];
      current[action.payload.index] = palette.id;
      state.currentPalette = current;
      state.animationData = animationData;

      //
      // console.log("current", current, palette);
      //
      // current.colors.forEach((color, index) => {
      //   state.colors.forEach((c, cIndex) => {
      //     console.log(
      //       "index",
      //       color,
      //       palette.colors[index],
      //       HEXToRGB(palette.colors[index]),
      //       JSON.parse(JSON.stringify(c)),
      //     );
      //
      //     if (c.hex === color) {
      //       c.indexes.reduce((acc, key, i) => {
      //         // @ts-expect-error: Key not valid
      //         if (acc[key] === undefined) {
      //           // @ts-expect-error: Key not valid
      //           acc[key] = {};
      //         }
      //         if (i === c.indexes.length - 1) {
      //           // @ts-expect-error: Key not valid
      //           acc[key] = HEXToRGB(palette.colors[index]);
      //         }
      //         // @ts-expect-error: Key not valid
      //         return acc[key];
      //       }, animationData);
      //
      //       colors[cIndex] = {
      //         ...JSON.parse(JSON.stringify(c)),
      //         color: HEXToRGB(palette.colors[index]),
      //         hex: palette.colors[index],
      //       };
      //     }
      //   });
      // });
      //
      // state.colors = colors;
      // state.currentPalette = action.payload;
      // state.animationData = animationData;
    },
    toggleLogo: (state, action) => {
      const animationData = JSON.parse(
        JSON.stringify(state.animationData),
      ) as Animation;
      state.animationData = null;
      let layers;
      // let assets = animationData.assets;
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
        // assets = [...(state.imageAssets ?? [])];
      }
      state.animationData = {
        ...animationData,
        // assets,
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
  updateAudio,
  setColor,
  toggleLogo,
} = lottieSlice.actions;

export default lottieSlice.reducer;
