"use client";

import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setCurrentTime,
  setDuration,
  setLoop,
  setPlay,
} from "@/lib/features/player/playerSlice";
import { RootState } from "@/lib/store";

export const PlayerWrap = () => {
  const lottieRef = useRef<HTMLDivElement>(null);
  const [lottieLoader, setLottieLoader] = useState(false);

  const { animationData, status, jump, loop } = useSelector(
    (state: RootState) => state.player,
  );
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (lottieRef.current) {
  //     lottieRef.current.play();
  //   }
  // }, [status, lottieRef]);

  return (
    <Box
      className="flex justify-start items-center relative group"
      sx={{ height: 620 }}
    >
      {lottieLoader && (
        <div className="absolute w-100 h-100">
          <CircularProgress />
        </div>
      )}
      <Lottie
        ref={lottieRef}
        style={{ height: 620 }}
        animationData={animationData}
        loop={loop}
        autoplay
        onEnterFrame={(event) => {
          console.log("vente", event);
          // dispatch(setCurrentTime(event.elapsedTime));
        }}
      />
    </Box>
  );
};
