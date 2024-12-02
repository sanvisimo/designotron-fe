import { Asset } from "@lottie-animation-community/lottie-types";
import FileUpload from "@mui/icons-material/FileUpload";
import { Box, Stack } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import Image from "next/image";
import { useState } from "react";

export type FileInputProps = {
  asset: Asset.Image | Asset.Sound;
  onChange: (id: string, file: File) => void;
  type?: "image" | "audio";
};

export const FileInput = ({
  asset,
  onChange,
  type = "image",
}: FileInputProps) => {
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
        key={asset.id}
        value={file}
        placeholder={`Upload ${type}`}
        onChange={(newFile: File | null) => handleChange(newFile, asset.id)}
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
            accept: type === "image" ? "image/*" : "audio/mp3",
          },
          startAdornment: <FileUpload />,
        }}
      />
      {type === "image" && (
        <Box sx={{ width: "56px", flex: "1 0 auto" }}>
          <Image
            src={asset.p}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 5,
            }}
            alt={asset.id}
            title={asset.id}
            width={56}
            height={56}
          />
        </Box>
      )}
    </Stack>
  );
};
