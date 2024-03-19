import { Grid, Skeleton } from "@mui/material";

export const BadgeAccountSkeleton = () => (
  <Grid container alignItems="center">
    <Grid item>
      <Skeleton variant="circular" width={30} height={30} />
    </Grid>
  </Grid>
);
