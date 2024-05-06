import { Paper, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Badge } from "src/models/Badge";
import { Colors } from "src/style/Colors";

interface Props {
  badges: Array<Badge>;
}

export const CardBadge = ({ badges }: Props) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        overflow: "hidden",
        backgroundColor: Colors.lightgrey,
        height: percent(100),
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.red,
            p: px(10),
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: 18,
            }}
            color="text.secondary"
          >
            {t("commun.badges")}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", p: 1 }}>
          <Grid container spacing={1}>
            {badges.map((badge) => (
              <Grid item>
                <img src={badge.icon} width={40} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
