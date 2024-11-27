import { AccountCircle } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { DarkModeToggle } from "@/components/Layout/DarkModeToggle";
import { RadiusContainer } from "@/components/Layout/RadiusContainer";

export const Header = () => {
  return (
    <Box component="header" sx={{ p: 2.5, position: "static" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div />
        <RadiusContainer>
          <div className="flex items-center justify-between h-10">
            <div></div>
            <span>Undamento</span>
            <AccountCircle />
          </div>
        </RadiusContainer>
        <div>
          <DarkModeToggle />
        </div>
      </Stack>
    </Box>
  );
};
