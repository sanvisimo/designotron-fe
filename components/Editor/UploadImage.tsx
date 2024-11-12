import { Button, Slider, Typography } from "@mui/material";
import { Orientation } from "get-orientation/base";
import { getOrientation } from "get-orientation/browser";
import { ChangeEvent, useState } from "react";
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
};

export const UploadImage = ({ id }: UploadImageProps) => {
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
    } catch (e) {
      console.error(e);
    }
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
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

  return (
    <div>
      {imageSrc ? (
        <>
          <div>
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={770 / 770}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div>
            <div>
              <Typography variant="overline">Zoom</Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(zoom as number)}
              />
            </div>
            <div>
              <Typography variant="overline">Rotation</Typography>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e, rotation) => setRotation(rotation as number)}
              />
            </div>
            <Button
              onClick={showCroppedImage}
              variant="contained"
              color="primary"
            >
              Show Result
            </Button>
          </div>
        </>
      ) : (
        <input type="file" onChange={onFileChange} accept="image/*" />
      )}
    </div>
  );
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
