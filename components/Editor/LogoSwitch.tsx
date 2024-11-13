import { Box, FormControlLabel, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { toggleLogo } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export const LogoSwitch = () => {
  const dispatch = useDispatch();
  const { logo, hasLogo } = useSelector((state: RootState) => state.lottie);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleLogo(event.target.checked));
  };

  if (!logo.length) return null;

  return (
    <div>
      <EditorLabel>BOTTOM LOGO</EditorLabel>

      <FormControlLabel
        control={
          <Switch
            color="secondary"
            checked={hasLogo}
            onChange={handleChange}
            inputProps={{ "aria-label": "Enable/disable Logo" }}
          />
        }
        label={
          <>
            <Box
              component="span"
              sx={(theme) => ({
                color: hasLogo ? "auto" : theme.palette.grey[500],
              })}
            >
              On
            </Box>{" "}
            /{" "}
            <Box
              component="span"
              sx={(theme) => ({
                color: !hasLogo ? "auto" : theme.palette.grey[500],
              })}
            >
              Off
            </Box>
          </>
        }
      />
    </div>
  );
};
