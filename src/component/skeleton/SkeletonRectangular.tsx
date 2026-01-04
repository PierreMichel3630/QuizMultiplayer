import { Grid, Skeleton } from "@mui/material";

interface Props {
  number: number;
  height?: number | string;
  width?: number | string;
}
export const SkeletonRectangulars = ({
  number,
  width = "100%",
  height = 200,
}: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid key={index} size={12}>
      <SkeletonRectangular height={height} width={width} />
    </Grid>
  ));
};

interface PropsRectangular {
  height?: number | string;
  width?: number | string;
}
export const SkeletonRectangular = ({
  width = "100%",
  height = 200,
}: PropsRectangular) => (
  <Skeleton variant="rectangular" width={width} height={height} />
);
