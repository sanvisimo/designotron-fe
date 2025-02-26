"use client";

import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { animations } from "@/lib/defaults";
import { setAnimationData } from "@/lib/features/player/lottieSlice";
import { Template } from "@/lib/types";

export type ProjectsProps = {
  elements?: number;
  title?: string;
};

const shuffle = (start: Template[]) => {
  const array = [...start];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const Projects = ({
  title = "TEMPLATES",
  elements = 0,
}: ProjectsProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const displayAnimation = useMemo(
    () =>
      elements > 0
        ? shuffle(animations).toSpliced(0, animations.length - elements)
        : animations,
    [elements],
  );

  const handleSelect = (id: number) => {
    dispatch(setAnimationData(id));
    router.push("/");
  };

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={(theme) => ({ ...theme.applyStyles("dark", { color: "white" }) })}
      >
        {title}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ flexWrap: "wrap", mt: 3 }}
      >
        {displayAnimation.map((animation) => {
          return (
            <Box
              key={animation.id}
              onClick={() => handleSelect(animation.id)}
              sx={{
                width: 190,
                borderRadius: 5,
                cursor: "pointer",
              }}
              title={animation.title}
            >
              <Image
                src={`/thumbnails/${animation.screenshot}`}
                sizes="100vw"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 5,
                }}
                alt={animation.title}
                title={animation.title}
                width={82}
                height={146}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};
