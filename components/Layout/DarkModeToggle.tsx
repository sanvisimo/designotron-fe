"use client";

import { LightMode, DarkMode } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";

export const DarkModeToggle = () => {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const handleToggle = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.primary",
      }}
    >
      <IconButton onClick={handleToggle}>
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Box>
  );
};
