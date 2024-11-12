"use client";

import { Pause, PlayArrow, Repeat, Stop } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { ChangeEvent, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./player.scss";
import { RadiusContainer } from "@/components/Layout/RadiusContainer";
import { goTo, setLoop, setPlay } from "@/lib/features/player/playerSlice";
import { RootState } from "@/lib/store";

export const Controls = () => {
  const dispatch = useDispatch();

  const { currentTime, duration, status, loop } = useSelector(
    (state: RootState) => state.player,
  );

  const { time, frameRate } = useSelector((state: RootState) => state.lottie);

  const handlePlay = () => {
    dispatch(setPlay(status === "play" ? "pause" : "play"));
  };

  const handleStop = () => {
    dispatch(setPlay("stop"));
  };

  const handleLoop = () => {
    dispatch(setLoop(!loop));
  };

  const progress = useMemo(
    () => (status !== "stop" ? (currentTime / (duration ?? 1)) * 100 : 0),
    [currentTime, duration],
  );

  const seekerStyle = {
    width: "100%",
    background: `linear-gradient(to right, #f50 ${progress}%, blue ${progress}%)`,
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const frame = Math.floor((value / 100) * (duration ?? 1));
    dispatch(goTo(frame));
  };

  const currentSeconds = useMemo(
    () => (currentTime / frameRate).toFixed(2),
    [currentTime, frameRate],
  );

  return (
    <RadiusContainer>
      <div id="controls" style={{ width: 600 }}>
        <div className="flex items-center justify-between">
          <IconButton aria-label="play/pause" onClick={handlePlay}>
            {status === "play" ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton aria-label="play/pause" onClick={handleStop}>
            <Stop />
          </IconButton>
          <div style={{ flex: "1 0 auto" }}>
            {currentSeconds} / {time}
          </div>
          <div className="range">
            <input
              id="range1"
              name="progress"
              aria-label="progress"
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleChange}
              onInput={handleChange}
              style={seekerStyle}
            />
          </div>

          <IconButton
            aria-label="loop"
            onClick={handleLoop}
            color={loop ? "primary" : "secondary"}
          >
            <Repeat />
          </IconButton>
        </div>
      </div>
    </RadiusContainer>
  );
};
