import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import ReplayIcon from "@mui/icons-material/Replay";
import { CircularProgress, LinearProgress } from "@mui/material";
import React from "react";
import { decodeAudioBuffer, sliceAudioBuffer } from "./audio-helper";
import FilePicker from "./file";
import { useClassicState } from "./hooks";
import "./index.scss";
import Player from "./player";
import { encode, isAudio, returnBlobData } from "./utils";

type AppProps = {
  onClose: (path: string) => void;
};

export function App({ onClose }: AppProps) {
  const [state, setState] = useClassicState<{
    file: File | null;
    decoding: boolean;
    audioBuffer: AudioBuffer | null;
    paused: boolean;
    startTime: number;
    endTime: number;
    currentTime: number;
    processing: boolean;
    progress: number;
  }>({
    file: null,
    decoding: false,
    audioBuffer: null,
    paused: true,
    startTime: 0,
    endTime: Infinity,
    currentTime: 0,
    processing: false,
    progress: 0,
  });

  const handleFileChange = async (file: File) => {
    if (!isAudio(file)) {
      alert("Carica un file Audio");
      return;
    }

    setState({
      file,
      paused: true,
      decoding: true,
      audioBuffer: null,
    });

    const audioBuffer = await decodeAudioBuffer(file);

    setState({
      paused: false,
      decoding: false,
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      endTime: 5,
    });
  };

  const handleStartTimeChange = (time: number) => {
    setState({
      startTime: time,
    });
    setState({
      endTime: time + 5,
    });
  };

  const handleEndTimeChange = (time: number) => {
    setState({
      endTime: time,
    });
    setState({
      startTime: time - 5,
    });
  };

  const handleCurrentTimeChange = (time: number) => {
    setState({
      currentTime: time,
    });
  };

  const handleEnd = () => {
    setState({
      currentTime: state.startTime,
      paused: false,
    });
  };

  const handlePlayPauseClick = () => {
    setState({
      paused: !state.paused,
    });
  };

  const handleReplayClick = () => {
    setState({
      currentTime: state.startTime,
      paused: false,
    });
  };

  const handleClose = (path: string) => {
    setState({
      file: null,
      decoding: false,
      audioBuffer: null,
      paused: true,
      startTime: 0,
      endTime: Infinity,
      currentTime: 0,
      processing: false,
    });
    onClose(path);
  };

  const handleProgress = (id: number) => {
    setState({
      progress: id * 100,
    });
  };

  const handleEncode = () => {
    const { startTime, endTime, audioBuffer, file } = state;
    if (!audioBuffer || !file) return;

    const { length, duration } = audioBuffer;

    const audioSliced = sliceAudioBuffer(
      audioBuffer,
      Math.floor((length * startTime) / duration),
      Math.floor((length * endTime) / duration),
    );
    console.log("sliced", audioSliced);

    setState({
      processing: true,
    });

    encode(audioBuffer, handleProgress)
      .then(returnBlobData)
      .then((path) => {
        handleClose(path);
      })
      .catch((e) => console.error(e))
      .then(() => {
        setState({
          processing: false,
        });
      });
  };

  const displaySeconds = (seconds: number) => `${seconds.toFixed(2)}s`;

  return (
    <div className="container">
      {state.audioBuffer || state.decoding ? (
        <div>
          <h2 className="app-title">Audio Cutter</h2>

          {state.decoding ? (
            <div className="player player-landing">DECODING...</div>
          ) : (
            <Player
              audioBuffer={state.audioBuffer!}
              blob={state.file!}
              paused={state.paused}
              startTime={state.startTime}
              endTime={state.endTime}
              currentTime={state.currentTime}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              onCurrentTimeChange={handleCurrentTimeChange}
              onEnd={handleEnd}
            />
          )}

          <div className="controllers">
            <FilePicker className="ctrl-item" onPick={handleFileChange}>
              <QueueMusicIcon fontSize="small" />
            </FilePicker>

            <button
              type="button"
              className="ctrl-item"
              title="Play/Pause"
              onClick={handlePlayPauseClick}
            >
              {state.paused ? (
                <PlayCircleOutlineIcon fontSize="small" />
              ) : (
                <PauseCircleOutlineIcon fontSize="small" />
              )}
            </button>

            <button
              type="button"
              className="ctrl-item"
              title="Replay"
              onClick={handleReplayClick}
            >
              <ReplayIcon fontSize="small" />
            </button>

            <button
              type="button"
              className="ctrl-item"
              onClick={() => handleEncode()}
            >
              {state.processing ? (
                <CircularProgress size={24} />
              ) : (
                <FileDownloadIcon fontSize="small" />
              )}
            </button>

            {Number.isFinite(state.endTime) && (
              <span className="seconds">
                Select{" "}
                <span className="seconds-range">
                  {displaySeconds(state.endTime - state.startTime)}
                </span>{" "}
                of{" "}
                <span className="seconds-total">
                  {displaySeconds(state.audioBuffer?.duration ?? 0)}
                </span>{" "}
                (from{" "}
                <span className="seconds-start">
                  {displaySeconds(state.startTime)}
                </span>{" "}
                to{" "}
                <span className="seconds-end">
                  {displaySeconds(state.endTime)}
                </span>
                )
              </span>
            )}
          </div>
          {state.processing && (
            <div style={{ width: "100%" }}>
              <LinearProgress
                color="secondary"
                variant="determinate"
                value={state.progress}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="landing">
          <h2>Audio Cutter</h2>
          <FilePicker onPick={handleFileChange}>
            <div className="file-main">
              <QueueMusicIcon fontSize="small" />
              Select music file
            </div>
          </FilePicker>
        </div>
      )}
    </div>
  );
}
