import { SaveAs } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "calc(100vh - 88px)",
      }}
      direction="row"
    >
      <Box sx={{ px: 2 }}>
        <Card
          sx={{
            minWidth: 175,
            height: "calc(100vh - 220px)",
            overflow: "auto",
          }}
        >
          <CardContent>
            <Typography variant="h6" component="div">
              Menu
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <SaveAs />
                  </ListItemIcon>
                  <ListItemText primary="Drafts" />
                </ListItemButton>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ width: "100%", pl: 2, pr: 6 }}>{children}</Box>
    </Stack>
  );
}
