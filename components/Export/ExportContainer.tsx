import { Stack } from "@mui/material";
import { useRef, useState } from "react";
import { ExportToImg } from "@/components/Export/ExportToImg";
import { ExportToVideo } from "@/components/Export/ExportToVideo";

export const ExportContainer = () => {
  const exportRef = useRef(null);
  const [selected, setSelected] = useState<"img" | "video">("video");
  const [clicked, setClicked] = useState<"img" | "video" | null>(null);

  return (
    <Stack
      ref={exportRef}
      spacing={2}
      direction="row"
      sx={{
        width: 313,
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
    </Stack>
  );
};
