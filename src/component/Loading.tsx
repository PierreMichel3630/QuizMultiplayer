import { CircularProgress, Grid } from "@mui/material";
import { percent } from "csx";

export const CircularLoading = () => (
  <Grid container>
    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress size={100} color="secondary" />
    </Grid>
  </Grid>
);

export const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: percent(100),
    }}
  >
    <CircularProgress color="inherit" size={60} />
  </div>
);
