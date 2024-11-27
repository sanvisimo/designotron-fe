"use client";

import { CircularProgress, Box } from "@mui/material";
import lottie, { AnimationItem, BMEnterFrameEvent } from "lottie-web";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setCurrentTime,
  setDuration,
  setLoaded,
  setPlay,
} from "@/lib/features/player/playerSlice";
import { RootState } from "@/lib/store";

export const Player = () => {
  const animationInstanceRef = useRef<AnimationItem>();
  const animationContainer = useRef<HTMLDivElement>(null);

  const { status, jump, loop, loaded } = useSelector(
    (state: RootState) => state.player,
  );
  const { animationData } = useSelector((state: RootState) => state.lottie);

  const dispatch = useDispatch();

  /**
   * Load a new animation, and if it's the case, destroy the previous one
   * @param {Object} forcedConfigs
   */
  const loadAnimation = (forcedConfigs = {}) => {
    dispatch(setLoaded(false));

    // Return if the container ref is null
    if (!animationContainer.current || !animationData) {
      return;
    }

    // Destroy any previous instance
    animationInstanceRef.current?.destroy();

    // Build the animation configuration
    const config = {
      animationData: JSON.parse(JSON.stringify(animationData)),
      loop,
      autoplay: loop,
      ...forcedConfigs,
      container: animationContainer.current,
    };

    // Save the animation instance
    animationInstanceRef.current = lottie.loadAnimation(config);

    dispatch(setPlay(loop ? "play" : "stop"));

    dispatch(setLoaded(!!animationInstanceRef.current));
    dispatch(setDuration(animationInstanceRef.current.getDuration(true)));

    // Return a function that will clean up
    return () => {
      animationInstanceRef.current?.destroy();
      animationInstanceRef.current = undefined;
      dispatch(setPlay("stop"));
    };
  };

  useEffect(() => {
    const onUnmount = loadAnimation();

    // Clean up on unmount
    return () => onUnmount?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationData, loop]);

  useEffect(() => {
    animationInstanceRef?.current?.[status]();
  }, [status, loop, animationInstanceRef]);

  useEffect(() => {
    if (loaded && !!jump) {
      animationInstanceRef?.current?.goToAndStop(jump, true);
      animationInstanceRef?.current?.pause();
      dispatch(setPlay("pause"));
    }
  }, [jump, animationInstanceRef, loaded]);

  useEffect(() => {
    function manageFrame(frame: BMEnterFrameEvent) {
      dispatch(setCurrentTime(frame.currentTime));
    }

    const onComplete = () => {
      animationInstanceRef?.current?.goToAndStop(0, true);
      dispatch(setPlay("stop"));
    };

    if (animationInstanceRef?.current && animationData) {
      animationInstanceRef?.current?.addEventListener(
        "enterFrame",
        manageFrame,
      );
      animationInstanceRef?.current?.addEventListener("complete", onComplete);
    }

    return () => {
      if (animationInstanceRef?.current && animationData) {
        animationInstanceRef?.current?.removeEventListener(
          "enterFrame",
          manageFrame,
        );
        animationInstanceRef?.current?.removeEventListener(
          "complete",
          onComplete,
        );
      }
    };
  }, [animationInstanceRef, loop, loaded, animationData]);

  return (
    <Box
      className="flex justify-start items-center relative group"
      sx={{ height: "100%" }}
    >
      {!loaded && (
        <div className="absolute w-100 h-100">
          <CircularProgress />
        </div>
      )}
      <div ref={animationContainer} style={{ height: "calc(100vh - 280px)" }} />
    </Box>
  );
};
