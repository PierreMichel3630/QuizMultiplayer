import { Box, Grid, Skeleton } from "@mui/material";

interface Props {
  number: number;
}
export const SkeletonPlayers = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid item key={index}>
      <SkeletonPlayer />
    </Grid>
  ));
};

export const SkeletonPlayer = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Skeleton variant="circular" width={70} height={70} />
    <Skeleton variant="rectangular" width={75} height={15} />
  </Box>
);
