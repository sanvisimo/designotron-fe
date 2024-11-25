import ImageIcon from "@mui/icons-material/Image";
import { CircularProgress } from "@mui/material";
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
        "https://4qfw82mps9.execute-api.eu-west-1.amazonaws.com/prod/lottie",
        {
          method: "POST",
          body: JSON.stringify(animationData),
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "k3dc9lEUYN1ec9xl64e923RujZYqiashaxzjvsmE",
          },
        },
      );
      const posts = await data.json();
      console.log("return", posts);
      const link = document.createElement("a");
      link.href = posts.url;
      link.download = `video.mp4`;
      link.click();
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  if (!anchor.current) return null;

  return (
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
  );
};
