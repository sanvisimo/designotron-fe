import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface PlayerState {
  status: "stop" | "play" | "pause";
  currentTime: number;
  jump: number;
  duration?: number;
  loop: boolean;
  loaded: boolean;
}

// Define the initial state using that type
const initialState: PlayerState = {
  loaded: false,
  status: "play",
  currentTime: 0,
  jump: 0,
  duration: 100,
  loop: false,
};

export const playerSlice = createSlice({
  name: "player",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    setPlay: (state, action: PayloadAction<"stop" | "play" | "pause">) => {
      state.status = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    goTo: (state, action: PayloadAction<number>) => {
      state.jump = action.payload;
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number | undefined>) => {
      state.duration = action.payload;
    },
    setLoop: (state, action: PayloadAction<boolean>) => {
      state.loop = action.payload;
    },
  },
});

export const {
  setPlay,
  goTo,
  setDuration,
  setCurrentTime,
  setLoop,
  setLoaded,
} = playerSlice.actions;

export default playerSlice.reducer;
