import { Asset } from "@lottie-animation-community/lottie-types";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { App as AudioCutter } from "@/lib/audio-editor";
import { updateAudio } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export const AudioEditor = () => {
  const dispatch = useDispatch();

  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const { audioAssets } = useSelector((state: RootState) => state.lottie);

  const handleOpen = (audio: Asset.Sound) => {
    setId(audio.id);
    setOpen(true);
  };

  if (!audioAssets || !audioAssets.length) return null;

  const handleClose = () => {
    setId("");
    setOpen(false);
  };

  const handleChange = (path: string) => {
    dispatch(updateAudio({ id, path }));
    handleClose();
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <EditorLabel>AUDIO</EditorLabel>
        {audioAssets.map((audio) => (
          <Button
            key={audio.id}
            onClick={() => handleOpen(audio)}
            color="secondary"
            variant="contained"
          >
            Upload Audio
          </Button>
        ))}
        <Dialog onClose={handleClose} open={open} fullWidth maxWidth="md">
          <DialogTitle>Select Audio</DialogTitle>
          <DialogContent>
            <AudioCutter onClose={handleChange} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
