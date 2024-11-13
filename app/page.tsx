"use client";

import { Stack, Box, Card, CardContent, Divider } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColorEditor } from "@/components/Editor/ColorEditor";
import { ImageEditor } from "@/components/Editor/ImageEditor";
import { LogoSwitch } from "@/components/Editor/LogoSwitch";
import { TextEditor } from "@/components/Editor/TextEditor";
import { Header } from "@/components/Layout/Header";
import { Controls } from "@/components/Player/Controls";
import { Player } from "@/components/Player/Player";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { setAnimationData } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";
import { theme } from "@/lib/theme";

export default function Home() {
  const dispatch = useDispatch();
  const cardRef = useRef<HTMLDivElement>(null);

  const { animationData } = useSelector((state: RootState) => state.lottie);
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
        <div className="px-2 mx-2">
          <Stack
            spacing={2}
            direction="row"
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Sidebar />
            <div>
              {animationData && <Player key={animationData?.nm?.trim()} />}
            </div>
            <Stack spacing={2} sx={{ width: "313px" }}>
              <Card sx={{ minWidth: 275 }} ref={cardRef}>
                <CardContent>
                  <Stack
                    spacing={2}
                    divider={<Divider flexItem />}
                    style={{ justifyContent: "center" }}
                  >
                    <ColorEditor anchor={cardRef.current} />
                    <LogoSwitch />
                  </Stack>
                </CardContent>
              </Card>
              <TextEditor />
              <ImageEditor />
            </Stack>
          </Stack>
        </div>
        <div className="px-2 mx-2">
          <Stack
            spacing={2}
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              my: 4,
            }}
          >
            <div style={{ width: 175 }} />
            <Controls />
            <div style={{ width: 313 }} />
          </Stack>
        </div>
      </Box>
    </ThemeProvider>
  );
}
