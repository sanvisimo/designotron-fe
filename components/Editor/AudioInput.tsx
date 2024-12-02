import { Asset } from "@lottie-animation-community/lottie-types";
import FileUpload from "@mui/icons-material/FileUpload";
import { Stack } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";

export type AudioInputProps = {
  image: Asset.Sound;
  onChange: (id: string, file: File) => void;
};

export const AudioInput = ({ image, onChange }: AudioInputProps) => {
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
        placeholder="Upload Audio"
        onChange={(newFile: File | null) => handleChange(newFile, image.id)}
        InputProps={{
          color: "secondary",
          sx: (theme) => ({
            background: theme.palette.secondary.main,
            border: "none",
            "& .MuiFileInput-placeholder": {
              color: "white !important",
            },
          }),
          inputProps: {
            accept: "image/*",
          },
          startAdornment: <FileUpload />,
        }}
      />
    </Stack>
  );
};
