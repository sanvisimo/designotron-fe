import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#fff",
          contrastText: "#404040",
        },
        secondary: {
          main: "#3B7AE8",
          contrastText: "#fff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#000",
          contrastText: " #fff",
        },
        secondary: {
          main: "#3B7AE8",
          contrastText: "#fff",
        },
      },
    },
  },
});
