import ImageIcon from "@mui/icons-material/Image";
import { CircularProgress, LinearProgress, Popover } from "@mui/material";
import { MouseEvent, RefObject, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ExportButton } from "@/components/Export/ExportButton";
import { RootState } from "@/lib/store";

export type ExportToProps = {
  selected: boolean;
  anchor: RefObject<HTMLDivElement | null>;
  onMouseEnter: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave: (e: MouseEvent) => void;
  onSelect: (type: "img" | "video" | null) => void;
};

export const ExportToVideo = ({
  selected,
  anchor,
  onMouseEnter,
  onMouseLeave,
  onSelect,
}: ExportToProps) => {
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(selected);

  useEffect(() => {
    if (selected) {
      setTimeout(() => {
        setShow(true);
      }, 500);
    } else {
      setShow(false);
    }
  }, [selected]);

  const { animationData } = useSelector((state: RootState) => state.lottie);

  const handleClick = async () => {
    setLoading(true);
    onSelect("video");
    try {
      const data = await fetch(
        "https://designotron-api.azurewebsites.net/video",
        {
          method: "POST",
          body: JSON.stringify({
            type: "mp4",
            animationData,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      console.log("data", data);
      const posts = await data.blob();
      console.log("return", posts);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(posts);
      link.download = `video.mp4`;
      link.click();
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 5;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [loading]);

  if (!anchor.current) return null;

  return (
    <>
      <ExportButton
        color="success"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        startIcon={
          loading ? (
            <CircularProgress size={24} color="secondary" />
          ) : (
            <ImageIcon />
          )
        }
        onClick={handleClick}
        sx={{
          width: selected ? 300 : 100,
          transition: "width 1s",
          borderRadius: 20,
          "& .MuiButton-startIcon": selected
            ? {}
            : {
                margin: 0,
              },
        }}
      >
        {show ? <span>Export VIDEO</span> : <span style={{ minHeight: 24 }} />}
      </ExportButton>
      <Popover
        open={loading}
        anchorEl={anchor.current}
        sx={{ width: 350 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: -20,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div
          style={{ width: 300, height: 50 }}
          className="flex justify-center items-center"
        >
          <div style={{ width: 200 }}>
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={progress}
            />
          </div>
        </div>
      </Popover>
    </>
  );
};
