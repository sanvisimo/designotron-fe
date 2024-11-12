import { AppBar, Stack } from "@mui/material";
import { DarkModeToggle } from "@/components/Layout/DarkModeToggle";
import { RadiusContainer } from "@/components/Layout/RadiusContainer";

export const Header = () => {
  return (
    <AppBar position="static" sx={{ p: 2.5 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div></div>
        <RadiusContainer>Design-O-Tron</RadiusContainer>
        <div>
          <DarkModeToggle />
        </div>
      </Stack>
    </AppBar>
  );
};
