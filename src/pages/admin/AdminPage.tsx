import { Box, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}
