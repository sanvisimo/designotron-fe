"use client";

import { CircularProgress, Stack } from "@mui/material";
import { Howl } from "howler";
import lottie, {
  AnimationConfigWithData,
  AnimationItem,
  BMEnterFrameEvent,
} from "lottie-web";
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
  const animationInstanceRef = useRef<AnimationItem>(null);
  const animationContainer = useRef<HTMLDivElement>(null);

  const { status, jump, loop, loaded } = useSelector(
    (state: RootState) => state.player,
  );
  const { animationData, audioAssets } = useSelector(
    (state: RootState) => state.lottie,
  );

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
    const config: AnimationConfigWithData<"svg"> = {
      animationData: JSON.parse(JSON.stringify(animationData)),
      loop,
      autoplay: loop,
      ...forcedConfigs,
      container: animationContainer.current,
    };

    if (audioAssets.length) {
      // @ts-expect-error params not found
      config.audioFactory = () =>
        new Howl({
          src: audioAssets.map((a) => a.p),
        });
    }

    // Save the animation instance
    animationInstanceRef.current = lottie.loadAnimation(config);

    dispatch(setPlay(loop ? "play" : "stop"));

    dispatch(setLoaded(!!animationInstanceRef.current));
    dispatch(setDuration(animationInstanceRef.current.getDuration(true)));

    // Return a function that will clean up
    return () => {
      animationInstanceRef.current?.destroy();
      animationInstanceRef.current = null;
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
    <Stack
      direction="row"
      className="group"
      sx={{
        height: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
      }}
    >
      {!loaded && (
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
          <CircularProgress />
        </div>
      )}
      <div ref={animationContainer} style={{ height: "calc(100vh - 280px)" }} />
    </Stack>
  );
};
