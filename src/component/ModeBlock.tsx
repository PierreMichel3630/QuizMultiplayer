import { Box, Grid, Typography } from "@mui/material";
import { important, percent, px } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  mode: {
    title: string;
    goal: string;
    explain: string;
  };
}

export const ModeBlock = ({ mode }: Props) => {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: percent(100),
        borderRadius: 2,
        height: percent(100),
        backgroundColor: Colors.blue3,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography
            variant="h1"
            color="text.secondary"
            sx={{ fontSize: important(px(25)) }}
          >
            {mode.title}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            color="text.secondary"
            sx={{ fontSize: important(px(12)) }}
          >
            {mode.goal}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondary">
            {mode.explain}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
