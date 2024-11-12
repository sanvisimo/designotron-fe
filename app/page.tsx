"use client";

import { Animation } from "@lottie-animation-community/lottie-types";
import { Button, Stack } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColorEditor } from "@/components/Editor/ColorEditor";
import { TextEditor } from "@/components/Editor/TextEditor";
import { UploadImage } from "@/components/Editor/UploadImage";
import { Header } from "@/components/Layout/Header";
import { Controls } from "@/components/Player/Controls";
import { Player } from "@/components/Player/Player";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { setAnimationData, setColors } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    primary: {
      main: "#fff",
      light: "#fff",
      dark: "#fff",
      contrastText: " #fff",
    },
  },
});

export default function Home() {
  const dispatch = useDispatch();

  const { imageAssets } = useSelector((state: RootState) => state.lottie);
  useEffect(() => {
    dispatch(setAnimationData(1));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="h-screen flex align-center justify-between flex-col">
        <Header />
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Sidebar />
          <div>
            <Player />
          </div>
          <Stack spacing={2}>
            <ColorEditor />
            <TextEditor />
            {!!imageAssets &&
              imageAssets.map((image) => (
                <UploadImage key={image.id} id={image.id} />
              ))}
          </Stack>
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "center", justifyContent: "center", my: 4 }}
        >
          <Controls />
        </Stack>
      </main>
    </ThemeProvider>
  );
}
