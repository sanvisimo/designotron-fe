import { Stack } from "@mui/material";
import { LoginForm } from "@/components/Login/LoginForm";

export default function Login() {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "calc(100vh - 88px)",
      }}
    >
      <LoginForm />
    </Stack>
  );
}
