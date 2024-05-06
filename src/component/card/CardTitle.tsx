import { Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { BadgeTitle } from "../Badge";

interface Props {
  titles: Array<Title>;
}

export const CardTitle = ({ titles }: Props) => {
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
            {t("commun.titles")}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", p: 1 }}>
          <Grid container spacing={1}>
            {titles.map((title) => (
              <Grid item>
                <BadgeTitle label={title.name} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
