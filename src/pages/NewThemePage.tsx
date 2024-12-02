import { Box, Grid, Typography } from "@mui/material";
import { uniqBy } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CardTheme } from "src/component/card/CardTheme";
import { RankingBlock } from "src/component/RankingBlock";
import { useApp } from "src/context/AppProvider";
import { sortByCreatedAt } from "src/utils/sort";

export default function NewThemePage() {
  const { t } = useTranslation();
  const { themes } = useApp();

  const themesNew = useMemo(() => {
    return uniqBy(
      themes
        .filter((el) => moment().diff(el.created_at, "days") < 7)
        .sort(sortByCreatedAt),
      (el) => el.id
    );
  }, [themes]);

  const idthemes = useMemo(() => themesNew.map((el) => el.id), [themesNew]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.new.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            {idthemes.length > 0 && (
              <Grid item xs={12}>
                <RankingBlock themes={idthemes} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h2">{t("commun.themes")}</Typography>
            </Grid>
            {themesNew.map((theme) => (
              <Grid item key={theme.id}>
                <CardTheme theme={theme} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
