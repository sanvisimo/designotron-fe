import { Card, CardContent, Stack, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { updateText } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export const TextEditor = () => {
  const dispatch = useDispatch();
  const { texts } = useSelector((state: RootState) => state.lottie);

  if (!texts) return;

  const handleChange = (key: string, text: string) => {
    dispatch(updateText({ key, text }));
  };

  return Object.entries(texts).length ? (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <EditorLabel>CONTENT TEXT</EditorLabel>
        <Stack spacing={2}>
          {texts &&
            Object.entries(texts).map(([key, value]) => {
              return (
                <div key={key}>
                  <TextField
                    autoComplete="off"
                    label={key}
                    type="text"
                    value={value.text}
                    autoFocus={false}
                    variant="standard"
                    onChange={(e) => {
                      handleChange(key, e.target.value);
                    }}
                  />
                </div>
              );
            })}
        </Stack>
      </CardContent>
    </Card>
  ) : null;
};
