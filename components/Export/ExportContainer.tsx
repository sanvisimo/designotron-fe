"use client";

import { SaveAs } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useRef, useState } from "react";
import { ExportToImg } from "@/components/Export/ExportToImg";
import { ExportToVideo } from "@/components/Export/ExportToVideo";

export const ExportContainer = () => {
  const exportRef = useRef(null);
  const [selected, setSelected] = useState<"img" | "video" | null>(null);
  const [clicked, setClicked] = useState<"img" | "video" | null>(null);

  return (
    <Stack
      ref={exportRef}
      spacing={2}
      direction="row"
      sx={{
        width: 313,
        flex: "1 0 auto",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ExportToImg
        anchor={exportRef}
        selected={clicked ? clicked === "img" : selected === "img"}
        onSelect={setClicked}
        onMouseEnter={() => setSelected("img")}
        onMouseLeave={() => setSelected("video")}
      />
      <ExportToVideo
        anchor={exportRef}
        selected={clicked ? clicked === "video" : selected === "video"}
        onSelect={setClicked}
        onMouseEnter={() => setSelected("video")}
        onMouseLeave={() => setSelected("video")}
      />
      <Button
        aria-label="draft"
        color="primary"
        variant="contained"
        sx={{ borderRadius: 20 }}
      >
        <SaveAs />
      </Button>
    </Stack>
  );
};
