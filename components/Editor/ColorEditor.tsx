import {
  Card,
  CardContent,
  Divider,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaletteComponent } from "@/components/Editor/Palette";
import { palettes } from "@/lib/defaults";
import { setColors } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export const ColorEditor = () => {
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { currentPalette } = useSelector((state: RootState) => state.lottie);
  const handleChoose = (index: number) => {
    dispatch(setColors(index));
    setOpen(false);
  };

  return (
    <Card sx={{ minWidth: 275 }} ref={cardRef}>
      <CardContent>
        <div>
          <Typography variant="subtitle1">COLOR PALETTE</Typography>
          <Stack
            spacing={2}
            divider={<Divider flexItem />}
            style={{ alignItems: "center" }}
          >
            <div>
              {palettes.map(
                (pal, index) =>
                  index === currentPalette && (
                    <PaletteComponent
                      palette={pal}
                      onClick={handleClick}
                      key={pal.name.trim()}
                    />
                  ),
              )}
              <Popover
                id="basic-menu"
                anchorEl={cardRef.current}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: -20,
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                slotProps={{
                  paper: {
                    sx: {
                      marginRight: 2,
                    },
                  },
                }}
              >
                {palettes.map((palette, index) => (
                  <MenuItem
                    key={palette.name.trim()}
                    onClick={() => handleChoose(index)}
                    sx={{ p: 2 }}
                  >
                    <PaletteComponent palette={palette} />
                  </MenuItem>
                ))}
              </Popover>
            </div>
            <div>
              <Typography variant="subtitle1">BOTTOM LOGO</Typography>
            </div>
          </Stack>
        </div>
      </CardContent>
    </Card>
  );
};
