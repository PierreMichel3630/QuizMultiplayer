import { Box, Skeleton } from "@mui/material";
import { px } from "csx";

interface Props {
  number: number;
}
export const SkeletonTitles = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonTitle key={index} />
  ));
};

export const SkeletonTitle = () => (
  <Box sx={{ width: px(140) }}>
    <Skeleton variant="rectangular" animation="wave" width={150} height={45} />
  </Box>
);

export const SkeletonBanners = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonBanner key={index} />
  ));
};

export const SkeletonBanner = () => (
  <Box sx={{ maxWidth: px(140) }}>
    <Skeleton variant="rectangular" animation="wave" width={140} height={80} />
    <Skeleton />
  </Box>
);

export const SkeletonAvatars = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonAvatar key={index} />
  ));
};

export const SkeletonAvatar = () => (
  <Box sx={{ maxWidth: px(80) }}>
    <Skeleton variant="circular" animation="wave" width={60} height={60} />
    <Skeleton />
  </Box>
);

export const SkeletonBadges = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <SkeletonAvatar key={index} />
  ));
};

export const SkeletonBadge = () => (
  <Box sx={{ maxWidth: px(80) }}>
    <Skeleton variant="circular" animation="wave" width={60} height={60} />
    <Skeleton />
  </Box>
);
