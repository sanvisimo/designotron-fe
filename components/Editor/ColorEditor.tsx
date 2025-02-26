"use client";

import { MenuItem } from "@mui/material";
import { RefObject, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { PaletteComponent } from "@/components/Editor/Palette";
import { MenuOver } from "@/components/Layout/MenuOver";
import { palettes } from "@/lib/defaults";
import { setColor } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export type ColorEditorProps = {
  anchor: RefObject<HTMLDivElement | null>;
};

export const ColorEditor = ({ anchor }: ColorEditorProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState<number | null>(null);
  const handleClick = (num: number) => {
    setOpen(num);
  };
  const handleClose = () => {
    setOpen(null);
  };

  const { currentPalette } = useSelector((state: RootState) => state.lottie);
  const handleChoose = (index: number, paletteId: number) => {
    dispatch(setColor({ index, paletteId }));
    setOpen(null);
  };

  if (!anchor.current) return null;

  return currentPalette.map(
    (id, index) =>
      palettes[id] && (
        <div key={palettes[id]?.name}>
          <EditorLabel>COLOR {index + 1}</EditorLabel>
          <div>
            <PaletteComponent
              palette={palettes[id]}
              onClick={() => handleClick(id)}
              key={palettes[id]?.name?.trim()}
            />
            <MenuOver
              anchorEl={anchor.current}
              open={open === id}
              onClose={handleClose}
            >
              {palettes.map((palette) => {
                const indice =
                  index === 0 ? currentPalette[1] : currentPalette[0];

                return (
                  !palettes[indice]?.exclude.includes(palette.id) &&
                  !currentPalette.includes(palette.id) && (
                    <MenuItem
                      key={palette.name.trim()}
                      onClick={() => handleChoose(index, palette.id)}
                      sx={{ p: 2, background: "none" }}
                    >
                      <PaletteComponent palette={palette} justify />
                    </MenuItem>
                  )
                );
              })}
            </MenuOver>
          </div>
        </div>
      ),
  );
};
