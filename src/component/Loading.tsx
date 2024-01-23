import { CircularProgress, Grid } from "@mui/material";

export const CircularLoading = () => (
  <Grid container>
    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress size={100} color="secondary" />
    </Grid>
  </Grid>
);
