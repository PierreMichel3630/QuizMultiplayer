import { Grid, Paper, Skeleton } from "@mui/material";

interface Props {
  number: number;
}

export const SkeletonGames = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid item xs={12} key={index}>
      <SkeletonGame />
    </Grid>
  ));
};

export const SkeletonGame = () => {
  return (
    <Paper sx={{ p: 1 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2}>
          <Skeleton variant="rectangular" width="100%" height={60} />
        </Grid>
        <Grid
          item
          xs={7}
          sx={{ display: "flex", gap: 1, flexDirection: "column" }}
        >
          <Skeleton variant="rectangular" width="70%" height={25} />
          <Skeleton variant="rectangular" width="30%" height={15} />
        </Grid>
        <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Skeleton variant="rectangular" width="50%" height={20} />
        </Grid>
      </Grid>
    </Paper>
  );
};
