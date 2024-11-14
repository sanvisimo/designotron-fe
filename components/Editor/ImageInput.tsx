import { Asset } from "@lottie-animation-community/lottie-types";
import FileUpload from "@mui/icons-material/FileUpload";
import { Box, Stack } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import Image from "next/image";
import { useState } from "react";

export type ImageInputProps = {
  image: Asset.Image;
  onChange: (id: string, file: File) => void;
};

export const ImageInput = ({ image, onChange }: ImageInputProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (newFile: File | null, id: string) => {
    if (newFile) {
      setFile(newFile);
      onChange(id, newFile);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <MuiFileInput
        key={image.id}
        value={file}
        placeholder="Upload image"
        onChange={(newFile: File | null) => handleChange(newFile, image.id)}
        InputProps={{
          color: "secondary",
          sx: (theme) => ({
            background: theme.palette.secondary.main,
            border: "none",
          }),
          inputProps: {
            accept: "image/*",
          },
          startAdornment: <FileUpload />,
        }}
      />
      <Box sx={{ width: "56px", flex: "1 0 auto" }}>
        <Image
          src={image.p}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: 5,
          }}
          alt={image.id}
          title={image.id}
          width={56}
          height={56}
        />
      </Box>
    </Stack>
  );
};
