import { Paper, Grid, Skeleton } from "@mui/material";

export const SkeletonCardReport = () => {
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={50}
            height={50}
          />
        </Grid>
        <Grid
          item
          xs
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={35}
            height={20}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={"50%"}
            height={15}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
