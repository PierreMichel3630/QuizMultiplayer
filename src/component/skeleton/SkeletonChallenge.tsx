import { Paper, Skeleton, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";

interface Props {
  number: number;
}

export const SkeletonChallenges = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid key={index} size={12}>
      <SkeletonChallenge />
    </Grid>
  ));
};

export const SkeletonChallenge = () => {
  return (
    <Paper
      sx={{
        p: 1,
      }}
      elevation={8}
    >
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ textAlign: "center" }}
      >
        <Grid size={3}>
          <Typography variant="h6">
            <Skeleton />
          </Typography>
        </Grid>
        <Grid size={3}>
          <Typography variant="h2">
            <Skeleton />
          </Typography>
        </Grid>
        <Grid size={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="h6">
              <Skeleton />
            </Typography>
            <Typography variant="h6">
              <Skeleton />
            </Typography>
          </Box>
        </Grid>
        <Grid size={2} sx={{display: "flex", justifyContent: "center"}}>
          <Skeleton variant="rectangular" width="70%" height={20} />
        </Grid>
      </Grid>
    </Paper>
  );
};
