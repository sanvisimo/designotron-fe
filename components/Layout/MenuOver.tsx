"use client";

import { Popover, PopoverProps } from "@mui/material";

export const MenuOver = ({ children, ...props }: PopoverProps) => {
  return (
    <Popover
      anchorOrigin={{
        vertical: "top",
        horizontal: -20,
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: (theme) => ({
            marginRight: 2,
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.57) 47%, rgba(255,255,255,0.1) 100%)",
            boxShadow:
              "inset 0px -1px -1px 0px rgba(0,0,0, 0.10), inset 2px 2px 1.1px 0px rgba(255,255,255, 0.98)",
            // backdropFilter: "blur(30px)",
            ...theme.applyStyles("dark", {
              background:
                "linear-gradient(175deg, rgba(36,36,36,1) 0%, rgba(32,32,32,0) 100%)",
              boxShadow:
                "0px -1px 1px 0px rgba(43, 43, 43, 0.10) inset, 2px 2px 1.1px 0px rgba(43, 43, 43, 0.98) inset",
              backdropFilter: "blur(15px)",
            }),
          }),
        },
      }}
      {...props}
    >
      {children}
    </Popover>
  );
};
