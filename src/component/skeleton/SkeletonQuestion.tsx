import { Box, Grid, Paper, Skeleton } from "@mui/material";
import { percent } from "csx";
import { Colors } from "src/style/Colors";

interface SkeletonProposeQuestionsProps {
  number: number;
}
export const SkeletonProposeQuestions = ({
  number,
}: SkeletonProposeQuestionsProps) => {
  return Array.from(new Array(number)).map((_, index) => (
    <Grid item xs={12} key={index}>
      <Paper
        sx={{
          p: 1,
          position: "relative",
          backgroundColor: Colors.black,
          color: Colors.white,
        }}
        elevation={24}
      >
        <SkeletonQuestion image={false} />
      </Paper>
    </Grid>
  ));
};

interface SkeletonQuestionProps {
  image?: boolean;
}

export const SkeletonQuestion = ({ image = true }: SkeletonQuestionProps) => {
  return (
    <Box
      sx={{
        p: 1,
        height: percent(100),
        position: "relative",
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={50}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        {image && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Skeleton
              variant="rectangular"
              width="80%"
              height={200}
              sx={{ bgcolor: "grey.800" }}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            sx={{ bgcolor: "grey.800" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
