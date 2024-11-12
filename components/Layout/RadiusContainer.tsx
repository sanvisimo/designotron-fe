import { Box } from "@mui/system";
import { PropsWithChildren } from "react";

export type RadiusContainerProps = PropsWithChildren;

export const RadiusContainer = ({ children }: RadiusContainerProps) => {
  return (
    <Box
      sx={{
        borderRadius: 5,
        px: 2,
        py: 0.5,
        color: "#404040",
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 10%, rgba(255,255,255,1) 100%)",
      }}
    >
      {children}
    </Box>
  );
};
