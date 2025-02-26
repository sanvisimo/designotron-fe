"use client";

import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export const EditorLabel = ({ children }: PropsWithChildren) => {
  return (
    <Typography
      variant="subtitle1"
      sx={(theme) => ({ color: theme.palette.grey[500] })}
    >
      {children}
    </Typography>
  );
};
