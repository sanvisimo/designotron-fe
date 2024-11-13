"use client";

import { Stack, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColorEditor } from "@/components/Editor/ColorEditor";
import { TextEditor } from "@/components/Editor/TextEditor";
import { UploadImage } from "@/components/Editor/UploadImage";
import { Header } from "@/components/Layout/Header";
import { Controls } from "@/components/Player/Controls";
import { Player } from "@/components/Player/Player";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { setAnimationData } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";
import { theme } from "@/lib/theme";

export default function Home() {
  const dispatch = useDispatch();

  const { imageAssets, animationData } = useSelector(
    (state: RootState) => state.lottie,
  );
  useEffect(() => {
    dispatch(setAnimationData(1));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="main"
        className="h-screen flex align-center justify-between flex-col"
        sx={(theme) => ({
          background: "transparent",
          ...theme.applyStyles("dark", {
            background: "#121212",
          }),
        })}
      >
        <Header />
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Sidebar />
          <div>
            {animationData && <Player key={animationData?.nm?.trim()} />}
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
          sx={(theme) => ({
            alignItems: "center",
            justifyContent: "center",
            my: 4,
            background: "#fff",
            ...theme.applyStyles("dark", {
              background: "#121212",
            }),
          })}
        >
          <Controls />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
