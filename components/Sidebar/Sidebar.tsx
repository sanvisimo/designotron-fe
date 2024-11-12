import { Card, CardContent, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RadiusContainer } from "@/components/Layout/RadiusContainer";
import { setAnimationData } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export const Sidebar = () => {
  const dispatch = useDispatch();

  const { animations, currentAnimation, currentPalette, palettes } =
    useSelector((state: RootState) => state.lottie);

  const defaultColor = useMemo(
    () =>
      palettes[currentPalette].colors[1] ?? palettes[currentPalette].colors[0],
    [currentPalette, palettes],
  );

  return (
    <div className="px-2">
      <RadiusContainer>
        <Card sx={{ minWidth: 275 }}>
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
                      src={`/${animation.screenshot}`}
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
      </RadiusContainer>
    </div>
  );
};