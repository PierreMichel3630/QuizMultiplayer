import { Box, Divider, Grid, Skeleton } from "@mui/material";
import { SkeletonThemes } from "./SkeletonTheme";
import { px } from "csx";

interface Props {
  number: number;
}
export const SkeletonCategories = ({ number }: Props) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid item xs={12} key={index}>
      <SkeletonCategory />
    </Grid>
  ));
};

export const SkeletonCategory = () => {
  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Skeleton variant="rectangular" width="35%" height={15} />
        <Skeleton variant="rectangular" width="25%" height={30} />
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: px(5),
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <SkeletonThemes number={4} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
