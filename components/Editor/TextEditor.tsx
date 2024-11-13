import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorLabel } from "@/components/Editor/EditorLabel";
import { updateText } from "@/lib/features/player/lottieSlice";
import { RootState } from "@/lib/store";

export const TextEditor = () => {
  const dispatch = useDispatch();
  const { texts } = useSelector((state: RootState) => state.lottie);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (texts) {
      const v: Record<string, string> = {};
      Object.entries(texts).forEach(([key, value]) => {
        v[key] = value.text;
      });

      setValues(v);
    }
  }, [texts]);

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
            Object.entries(values).map(([key, value]) => {
              return (
                <div key={key}>
                  <TextField
                    id="outlined-basic"
                    label={key}
                    value={value}
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
