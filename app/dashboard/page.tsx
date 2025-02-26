import { Divider, Stack } from "@mui/material";
import { Projects } from "@/components/Dashboard/Projects";

export default function Dashboard() {
  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <Projects elements={2} title="LAST TEMPLATES" />
      <Projects />
    </Stack>
  );
}
