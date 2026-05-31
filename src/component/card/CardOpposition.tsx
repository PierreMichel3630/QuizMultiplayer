import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { BarVictory } from "../chart/BarVictory";

interface Props {
  opposition: { games: number; victory: number; draw: number; defeat: number };
}

export const CardOpposition = ({ opposition }: Props) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        overflow: "hidden",
        height: percent(100),
        backgroundColor: Colors.grey,
      }}
    >
      <Grid container sx={{ flex: 1 }}>
        <Grid
          sx={{
            backgroundColor: Colors.colorApp,
            p: px(5),
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          size={12}
        >
          <Typography variant="h2" color="text.secondary">
            {t("commun.opposition")}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              p: 1,
              width: percent(100)
            }}
          >
            <Grid container spacing={1} sx={{ width: percent(100) }}>
              <Grid sx={{ textAlign: "center" }} size={12}>
                <Typography variant="body1" component="span">
                  {t("commun.games")} {" : "}
                </Typography>
                <Typography variant="h4" component="span">
                  {opposition.games}
                </Typography>
              </Grid>
              <Grid size={12}>
                <BarVictory
                  victory={opposition.victory}
                  draw={opposition.draw}
                  defeat={opposition.defeat}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
