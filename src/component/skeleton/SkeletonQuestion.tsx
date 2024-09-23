import { Box, Grid, Skeleton } from "@mui/material";
import { percent } from "csx";

export const SkeletonQuestion = () => {
  return (
    <Box
      sx={{
        p: 1,
        height: percent(100),
        position: "relative",
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={25}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Skeleton
            variant="rectangular"
            width="80%"
            height={200}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
