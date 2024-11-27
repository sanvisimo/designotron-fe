import { Card, CardContent, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animations, palettes } from "@/lib/defaults";
import { setAnimationData } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export const Sidebar = () => {
  const dispatch = useDispatch();

  const { currentAnimation, currentPalette } = useSelector(
    (state: RootState) => state.lottie,
  );

  const defaultColor = useMemo(
    () => palettes?.[currentPalette]?.color,
    [currentPalette],
  );

  return (
    <div className="px-2">
      <Card sx={{ width: 175 }}>
        <CardContent>
          <Stack spacing={4} sx={{ p: 2.5 }}>
            {animations.map((animation, index) => {
              return (
                <Box
                  key={animation.id}
                  onClick={() => dispatch(setAnimationData(index))}
                  sx={{
                    width: 1,
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={`/thumbnails/${animation.screenshot}`}
                    sizes="100vw"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 5,
                      border:
                        index === currentAnimation
                          ? `0.125rem solid ${defaultColor}`
                          : "none",
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
        </CardContent>
      </Card>
    </div>
  );
};
