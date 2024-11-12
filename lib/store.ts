import { configureStore } from "@reduxjs/toolkit";
import lottieReducer from "./features/player/lottieSlice";
import playerReducer from "./features/player/playerSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      player: playerReducer,
      lottie: lottieReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
