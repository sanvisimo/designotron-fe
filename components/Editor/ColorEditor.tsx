import { MenuItem } from "@mui/material";
import { RefObject, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { PaletteComponent } from "@/components/Editor/Palette";
import { MenuOver } from "@/components/Layout/MenuOver";
import { palettes } from "@/lib/defaults";
import { setColors } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export type ColorEditorProps = {
  anchor: RefObject<HTMLDivElement | null>;
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

  if (!anchor.current) return null;

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
        <MenuOver anchorEl={anchor.current} open={open} onClose={handleClose}>
          {palettes.map((palette, index) => (
            <MenuItem
              key={palette.name.trim()}
              onClick={() => handleChoose(index)}
              sx={{ p: 2, background: "none" }}
            >
              <PaletteComponent palette={palette} />
            </MenuItem>
          ))}
        </MenuOver>
      </div>
    </div>
  );
};
