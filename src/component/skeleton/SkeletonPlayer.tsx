import { Grid, Paper, Skeleton } from "@mui/material";
import { px } from "csx";

interface Props {
  number: number;
}
export const SkeletonPlayers = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid item key={index} xs={12}>
      <SkeletonPlayer key={index} />
    </Grid>
  ));
};

export const SkeletonPlayer = () => (
  <Paper
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "pointer",
      p: px(5),
    }}
  >
    <Skeleton variant="circular" width={50} height={50} />
    <Skeleton variant="rectangular" width={75} height={15} />
    <Skeleton variant="rectangular" width={100} height={25} />
  </Paper>
);
