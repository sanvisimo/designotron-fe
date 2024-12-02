import ImageIcon from "@mui/icons-material/Image";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
} from "@mui/material";
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

export const ExportToImg = ({
  selected,
  anchor,
  onMouseEnter,
  onMouseLeave,
  onSelect,
}: ExportToProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
  const { currentTime } = useSelector((state: RootState) => state.player);

  const handleOpen = () => {
    onSelect("img");
    setOpen(true);
  };

  const handleClose = () => {
    onSelect(null);
    setOpen(false);
  };

  const handleImage = async () => {
    setLoading(true);
    try {
      const data = await fetch("http://localhost:3000/video", {
        method: "POST",
        body: JSON.stringify({
          type: "png",
          animationData,
          frameNumber: Math.round(currentTime),
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const posts = await data.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(posts);
      link.download = `screen.png`;
      link.click();
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  if (!anchor.current) return null;

  return (
    <>
      <ExportButton
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        startIcon={
          loading ? (
            <CircularProgress size={24} color="secondary" />
          ) : (
            <ImageIcon />
          )
        }
        onClick={handleOpen}
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
        {show ? <span>Export PNG</span> : <span style={{ minHeight: 24 }} />}
      </ExportButton>
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchor.current}
        sx={{ maxWidth: 350 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: -20,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <DialogTitle>Export PNG</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will export the current frame to image
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="secondary" onClick={handleImage}>
            Export
          </Button>
        </DialogActions>
      </Popover>
    </>
  );
};
