"use client";

import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { Palette } from "@/lib/types";

export type PaletteProps = {
  palette: Palette;
  justify?: boolean;
  onClick?: (palette: Palette) => void;
};

export const PaletteComponent = ({
  onClick,
  palette,
  justify,
}: PaletteProps) => {
  return (
    <Box
      sx={{ cursor: "pointer", width: justify ? "100%" : 125 }}
      onClick={() => onClick?.(palette)}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{palette.name}</span>
        <Box
          sx={(theme) => ({
            width: 24,
            height: 24,
            background: palette.color,
            border: "1px solid black",
            ...theme.applyStyles("dark", { border: "1px solid white" }),
          })}
        />
      </Stack>
    </Box>
  );
};
