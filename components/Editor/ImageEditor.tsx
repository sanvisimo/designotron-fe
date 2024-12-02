import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { FileInput } from "@/components/Editor/FileInput";
import { UploadImage } from "@/components/Editor/UploadImage";
import { RootState } from "@/lib/store";

export const ImageEditor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const { imageAssets } = useSelector((state: RootState) => state.lottie);

  const handleChange = (value: string, newFile: File) => {
    setFile(newFile);
    setId(value);
    setOpen(true);
  };

  if (!imageAssets || !imageAssets.length) return null;

  const handleClose = () => {
    setId("");
    setOpen(false);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <EditorLabel>IMAGE</EditorLabel>
        {imageAssets.map((image) => (
          <FileInput key={image.id} asset={image} onChange={handleChange} />
        ))}
        <Dialog onClose={handleClose} open={open} fullWidth>
          <DialogTitle>Select Image</DialogTitle>
          <DialogContent>
            <UploadImage file={file} onClose={handleClose} id={id} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
