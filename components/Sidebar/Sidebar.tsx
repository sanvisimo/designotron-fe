import { Card, CardContent, Stack } from "@mui/material";

export const Sidebar = () => {
  return (
    <div className="px-2">
      <Card
        sx={{ width: 175, maxHeight: "calc(100vh - 220px)", overflow: "auto" }}
      >
        <CardContent>
          <Stack spacing={4} sx={{ p: 2.5 }}>
            utilities
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};
