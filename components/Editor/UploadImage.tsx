"use client";

import {
  Button,
  Slider,
  Stack,
  Typography,
  Box,
  DialogActions,
} from "@mui/material";
import { Orientation } from "get-orientation/base";
import { getOrientation } from "get-orientation/browser";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useDispatch } from "react-redux";
import { getCroppedImg, getRotatedImage } from "@/lib/canvasUtils";
import { updateImage } from "@/lib/features/player/lottieSlice";

const ORIENTATION_TO_ANGLE: Record<Orientation, number> = {
  1: 0,
  2: 0,
  3: 180,
  4: 0,
  5: 0,
  6: 90,
  7: 0,
  8: -90,
};

export type UploadImageProps = {
  id: string;
  file: File | null;
  onClose: () => void;
  ratio: number;
};

export const UploadImage = ({ id, file, onClose, ratio }: UploadImageProps) => {
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );
      dispatch(updateImage({ croppedImage, id }));
      setImageSrc(null);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const orientFile = async () => {
      if (file) {
        let imageDataUrl = await readFile(file);
        if (!imageDataUrl) return;

        try {
          // apply rotation if needed
          const orientation = await getOrientation(file);
          console.log("orientation", orientation);
          const rotation = ORIENTATION_TO_ANGLE[orientation];
          if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
          }
        } catch (e) {
          console.warn("failed to detect the orientation", e);
        }

        setImageSrc(imageDataUrl);
      }
    };
    orientFile();
  }, [file]);

  return imageSrc ? (
    <>
      <Box
        sx={(theme) => ({
          position: "relative",
          width: "100%",
          height: 200,
          background: "#333",
          [theme.breakpoints.up("sm")]: {
            height: 400,
          },
        })}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={ratio}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Box>
      <Stack
        direction="row"
        spacing={3}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Box sx={{ width: 0.5 }}>
          <Typography variant="overline">Zoom</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            color="secondary"
            onChange={(e, zoom) => setZoom(zoom as number)}
          />
        </Box>
        <Box sx={{ width: 0.5 }}>
          <Typography variant="overline">Rotation</Typography>
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby="Rotation"
            color="secondary"
            onChange={(e, rotation) => setRotation(rotation as number)}
          />
        </Box>
      </Stack>
      <DialogActions>
        <Button
          onClick={showCroppedImage}
          variant="contained"
          color="secondary"
        >
          Show Result
        </Button>
      </DialogActions>
    </>
  ) : null;
};

function readFile(file: Blob): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (reader.result && typeof reader.result === "string")
          resolve(reader.result);
        else reject(null);
      },
      false,
    );
    reader.readAsDataURL(file);
  });
}
