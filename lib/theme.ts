"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "var(--font-dm_sans)", //`'DM Sans', 'DM Sans Fallback', sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  shape: {
    borderRadius: 10,
  },
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
        grey: {
          500: "#918C8C",
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
