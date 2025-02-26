"use client";

import { Stack, Card, CardContent, Divider, Box } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AudioEditor } from "@/components/Editor/AudioEditor";
import { ColorEditor } from "@/components/Editor/ColorEditor";
import { ImageEditor } from "@/components/Editor/ImageEditor";
import { LogoSwitch } from "@/components/Editor/LogoSwitch";
import { TextEditor } from "@/components/Editor/TextEditor";
import { ExportContainer } from "@/components/Export/ExportContainer";
import { Controls } from "@/components/Player/Controls";
import { Player } from "@/components/Player/Player";
import { setAnimationData } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export default function Home() {
  const dispatch = useDispatch();
  const cardRef = useRef<HTMLDivElement>(null);

  const { animationData, logo, audioAssets, imageAssets } = useSelector(
    (state: RootState) => state.lottie,
  );
  useLayoutEffect(() => {
    dispatch(setAnimationData(0));
  }, []);

  return (
    <>
      <Stack
        spacing={2}
        direction="row"
        sx={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          height: "calc(100vh - 220px)",
          width: "100%",
          boxSizing: "border-box",
          px: 4,
        }}
      >
        <div>{animationData && <Player key={animationData?.nm?.trim()} />}</div>
        <Stack spacing={2} sx={{ width: "313px" }}>
          <Card
            sx={{
              minWidth: 275,
              visibility: logo.length ? "visible" : "hidden",
            }}
            ref={cardRef}
          >
            <CardContent>
              <Stack
                spacing={2}
                divider={<Divider flexItem />}
                style={{ justifyContent: "center" }}
              >
                <ColorEditor anchor={cardRef} />
                <LogoSwitch />
              </Stack>
            </CardContent>
          </Card>

          <TextEditor />
          {!!imageAssets.length && (
            <ImageEditor key={animationData?.nm ?? "1"} />
          )}
          {!!audioAssets.length && <AudioEditor />}
        </Stack>
      </Stack>
      <Box sx={{ px: 2, width: "100%", boxSizing: "border-box" }}>
        <Stack
          spacing={4}
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            boxSizing: "border-box",
            my: 4,
          }}
        >
          <Controls />
          <ExportContainer />
        </Stack>
      </Box>
    </>
  );
}
