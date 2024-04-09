import { Box, CircularProgress, Grid } from "@mui/material";
import { percent, px } from "csx";

export const CircularLoading = () => (
  <Grid container>
    <Grid
      item
      xs={12}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <CircularProgress size={100} color="secondary" />
    </Grid>
  </Grid>
);

export const Loading = () => (
  <Box
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: percent(100),
    }}
  >
    <CircularProgress color="inherit" size={60} />
  </Box>
);

export const LoadingDot = () => (
  <Box
    sx={{
      width: px(60),
      aspectRatio: 2,
      background:
        "no-repeat radial-gradient(circle closest-side,#fff 90%,transparent) 0% 50%, no-repeat radial-gradient(circle closest-side,#fff 90%,transparent) 50% 50%, no-repeat radial-gradient(circle closest-side,#fff 90%,transparent) 100% 50%",
      backgroundSize: "calc(100%/3) 50%",
      animation: "l3 1s infinite linear",
    }}
  />
);
