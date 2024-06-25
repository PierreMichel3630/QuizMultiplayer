import { Grid, Paper, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { useTranslation } from "react-i18next";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { BadgeTitle } from "../Badge";
import { useMemo } from "react";
import { sortByTitle } from "src/utils/sort";
import { useUser } from "src/context/UserProvider";

interface Props {
  titles: Array<Title>;
}

export const CardTitle = ({ titles }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const titleOrder = useMemo(
    () => titles.sort((a, b) => sortByTitle(language, a, b)),
    [titles, language]
  );

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
            {t("commun.titles")}
          </Typography>
          <Typography variant="h4" color="text.secondary">
            ({titles.length})
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
            {titleOrder.map((title) => (
              <Grid item key={title.id}>
                <BadgeTitle label={title.name} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
