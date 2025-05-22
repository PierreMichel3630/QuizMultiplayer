import { Box, Grid, Paper, Skeleton } from "@mui/material";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  number: number;
}
export const SkeletonThemes = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonTheme key={index} />
  ));
};

export const SkeletonThemesGrid = ({ number }: Props) => {
  return (
    <Grid container spacing={1} justifyContent="center">
      {Array.from(new Array(number)).map((_, index) => (
        <Grid item key={index}>
          <SkeletonTheme />
        </Grid>
      ))}
    </Grid>
  );
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

export const SkeletonProfilThemes = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonProfilTheme key={index} />
  ));
};

export const SkeletonProfilTheme = () => {
  return (
    <Paper
      sx={{
        overflow: "hidden",
        backgroundColor: Colors.lightgrey,
        height: percent(100),
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 1,
            backgroundColor: Colors.colorApp,
            p: px(5),
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={60}
            height={60}
          />
          <Box>
            <Skeleton width={80} height={35} />
            <Skeleton width={120} height={20} />
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ p: 1 }}>
          <Skeleton width={80} height={35} />
          <Skeleton width="100%" height={20} />
          <Skeleton width={80} height={35} />
          <Skeleton width="100%" height={20} />
        </Grid>
      </Grid>
    </Paper>
  );
};
