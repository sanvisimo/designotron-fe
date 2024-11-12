import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { Palette } from "@/lib/types";

export type PaletteProps = {
  palette: Palette;
  onClick?: (palette: Palette) => void;
};

export const PaletteComponent = ({ onClick, palette }: PaletteProps) => {
  return (
    <Box sx={{ cursor: "pointer" }} onClick={() => onClick?.(palette)}>
      <Stack direction="row" spacing={1.5}>
        <span>{palette.name}</span>
        <Stack direction="row" spacing={1}>
          {palette.colors.map((col) => (
            <Box key={col} sx={{ width: 24, height: 24, background: col }} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};
