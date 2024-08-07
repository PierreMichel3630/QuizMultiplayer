import { Box, Grid, Paper, Skeleton } from "@mui/material";
import { px } from "csx";

interface Props {
  number: number;
}
export const SkeletonThemes = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonTheme key={index} />
  ));
};

export const SkeletonTheme = () => {
  return (
    <Box sx={{ maxWidth: px(100) }}>
      <Skeleton variant="rectangular" animation="wave" width={90} height={90} />
      <Skeleton />
    </Box>
  );
};

export const SkeletonCardTheme = () => {
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
