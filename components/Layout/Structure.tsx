"use client";

import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import { Header } from "@/components/Layout/Header";

export const Structure = ({ children }: PropsWithChildren) => {
  return (
    <Box
      component="main"
      sx={(theme) => ({
        height: "100vh",
        display: "flex",
        width: "100vw",
        boxSizing: "border-box",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        background: "transparent",
        ...theme.applyStyles("dark", {
          background: "#121212",
        }),
      })}
    >
      <Header />

      {children}
    </Box>
  );
};
