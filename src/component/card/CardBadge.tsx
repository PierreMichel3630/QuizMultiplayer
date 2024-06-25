import { Paper, Grid, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
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
            backgroundColor: Colors.blue3,
            p: px(10),
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="h2" color="text.secondary">
            {t("commun.badges")}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            ({badges.length})
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            p: 1,
            maxHeight: viewHeight(15),
            overflowX: "scroll",
          }}
        >
          <Grid container spacing={1}>
            {badges.map((badge) => (
              <Grid item key={badge.id}>
                <img src={badge.icon} width={40} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
