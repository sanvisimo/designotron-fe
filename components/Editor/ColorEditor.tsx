import { MenuItem, Popover } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { PaletteComponent } from "@/components/Editor/Palette";
import { palettes } from "@/lib/defaults";
import { setColors } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export type ColorEditorProps = {
  anchor: HTMLDivElement | null;
};

export const ColorEditor = ({ anchor }: ColorEditorProps) => {
  const dispatch = useDispatch();
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

  if (!anchor) return null;

  return (
    <div>
      <EditorLabel>COLOR PALETTE</EditorLabel>
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
          anchorEl={anchor}
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
              sx: (theme) => ({
                marginRight: 2,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.57) 47%, rgba(255,255,255,0.1) 100%)",
                boxShadow:
                  "inset 0px -1px -1px 0px rgba(0,0,0, 0.10), inset 2px 2px 1.1px 0px rgba(255,255,255, 0.98)",
                // backdropFilter: "blur(30px)",
                ...theme.applyStyles("dark", {
                  background:
                    "linear-gradient(175deg, rgba(36,36,36,1) 0%, rgba(32,32,32,0) 100%)",
                  boxShadow:
                    "0px -1px 1px 0px rgba(43, 43, 43, 0.10) inset, 2px 2px 1.1px 0px rgba(43, 43, 43, 0.98) inset",
                  backdropFilter: "blur(15px)",
                }),
              }),
            },
          }}
        >
          {palettes.map((palette, index) => (
            <MenuItem
              key={palette.name.trim()}
              onClick={() => handleChoose(index)}
              sx={{ p: 2, background: "none" }}
            >
              <PaletteComponent palette={palette} />
            </MenuItem>
          ))}
        </Popover>
      </div>
    </div>
  );
};
