import { Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { percent, px } from "csx";

interface Props {
  number: number;
}
export const SkeletonSearchs = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonSearch key={index} />
  ));
};

export const SkeletonSearch = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={40}
        height={40}
        sx={{ borderRadius: px(10) }}
      />
      <Box sx={{ width: percent(100) }}>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
        <Typography variant="caption">
          <Skeleton width={percent(40)} />
        </Typography>
      </Box>
    </Box>
  );
};
