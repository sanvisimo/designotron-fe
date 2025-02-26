"use client";

import { Button, ButtonProps } from "@mui/material";
import { PropsWithChildren } from "react";

export type ExportButtonProps = PropsWithChildren &
  ButtonProps & {
    onClick: () => void;
  };

export const ExportButton = ({
  children,
  onClick,
  type = "button",
  ...props
}: ExportButtonProps) => {
  return (
    <Button onClick={onClick} type={type} variant="contained" {...props}>
      {children}
    </Button>
  );
};
