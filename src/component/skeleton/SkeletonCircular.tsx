import { Grid, Skeleton } from "@mui/material";

interface Props {
  number: number;
  size?: number;
}
export const SkeletonCirculars = ({ number, size = 50 }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid key={index}>
      <SkeletonCircular size={size} />
    </Grid>
  ));
};

interface PropsCircular {
  size?: number;
}
export const SkeletonCircular = ({ size = 50 }: PropsCircular) => (
  <Skeleton variant="circular" width={size} height={size} />
);
