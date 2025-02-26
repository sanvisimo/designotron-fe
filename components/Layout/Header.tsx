"use client";

import { AccountCircle } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { DarkModeToggle } from "@/components/Layout/DarkModeToggle";
import { RadiusContainer } from "@/components/Layout/RadiusContainer";

export const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        p: 2.5,
        position: "static",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div />
        <RadiusContainer>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              height: "2.5rem",
            }}
          >
            <div></div>
            <span>Undamento</span>
            <AccountCircle />
          </Stack>
        </RadiusContainer>
        <div>
          <DarkModeToggle />
        </div>
      </Stack>
    </Box>
  );
};
