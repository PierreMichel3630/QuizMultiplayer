import { Box, Skeleton } from "@mui/material";
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
