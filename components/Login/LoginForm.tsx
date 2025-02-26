"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  TextField,
} from "@mui/material";
import { useActionState } from "react";
import { signin } from "@/app/actions/auth";

export const LoginForm = () => {
  const [state, action, pending] = useActionState(signin, undefined);

  return (
    <form action={action} style={{ width: "33%" }}>
      <Card>
        <CardContent>
          <div style={{ textAlign: "center" }}>
            <h1>Login</h1>
          </div>
          <Stack spacing={2}>
            <TextField
              error={!!state?.errors?.email}
              id="email"
              label="Email"
              name="email"
              placeholder="anthony@tjs.com"
              helperText={state?.errors?.email}
            />

            <TextField
              error={!!state?.errors?.password}
              id="password"
              label="Password"
              type="password"
              name="password"
              helperText={
                state?.errors?.password?.length && state.errors.password[0]
              }
            />
          </Stack>
        </CardContent>
        <CardActions>
          <Button
            disabled={pending}
            loading={pending}
            loadingPosition="end"
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ selfAlign: "center" }}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
