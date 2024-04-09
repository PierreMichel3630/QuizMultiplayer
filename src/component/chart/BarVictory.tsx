import { Box, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Props {
  victory: number;
  draw: number;
  defeat: number;
  color?: string;
}
export const BarVictory = ({ victory, draw, defeat, color }: Props) => {
  const { t } = useTranslation();

  const games = victory + draw + defeat;
  const percentVictory = (100 * victory) / games;
  const percentDraw = (100 * draw) / games;
  const percentDefeat = (100 * defeat) / games;

  const colorVictory = Colors.green2;
  const colorDraw = Colors.orange;
  const colorDefeat = Colors.red2;
  return (
    <Grid container spacing={1} sx={{ textAlign: "center" }}>
      {games > 0 && (
        <Grid item xs={12}>
          <Box
            sx={{
              width: percent(100),
              height: px(15),
              borderRadius: px(15),
              display: "flex",
              overflow: "hidden",
              backgroundColor: Colors.white,
            }}
          >
            <Box
              sx={{
                backgroundColor: colorVictory,
                width: percent(percentVictory),
                height: percent(100),
              }}
            />
            <Box
              sx={{
                backgroundColor: colorDraw,
                width: percent(percentDraw),
                height: percent(100),
              }}
            />
            <Box
              sx={{
                backgroundColor: colorDefeat,
                width: percent(percentDefeat),
                height: percent(100),
              }}
            />
          </Box>
        </Grid>
      )}
      <Grid item xs={4}>
        <Typography
          variant="h4"
          component="span"
          sx={{ color: color ? color : "initial" }}
        >
          {victory}{" "}
        </Typography>
        <Typography
          variant="body1"
          component="span"
          sx={{ color: color ? color : "initial" }}
        >
          {t("commun.victory", { count: victory })}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h4"
          component="span"
          sx={{ color: color ? color : "initial" }}
        >
          {draw}{" "}
        </Typography>
        <Typography
          variant="body1"
          component="span"
          sx={{ color: color ? color : "initial" }}
        >
          {t("commun.draw", { count: draw })}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h4"
          component="span"
          sx={{ color: color ? color : "initial" }}
        >
          {defeat}{" "}
        </Typography>
        <Typography
          variant="body1"
          component="span"
          sx={{ color: color ? color : "initial" }}
        >
          {t("commun.defeat", { count: defeat })}
        </Typography>
      </Grid>
    </Grid>
  );
};
