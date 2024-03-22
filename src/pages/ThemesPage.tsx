import { Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { selectThemes } from "src/api/theme";
import { RuleBlock } from "src/component/RuleBlock";
import { CardTheme } from "src/component/card/CardTheme";
import { Theme } from "src/models/Theme";

export const ThemesPage = () => {
  const { t } = useTranslation();

  const [themes, setThemes] = useState<Array<Theme>>([]);

  const getThemes = () => {
    selectThemes().then((res) => {
      if (res.data) setThemes(res.data as Array<Theme>);
    });
  };

  useEffect(() => {
    getThemes();
  }, []);

  /*const createPrivateGame = () => {
    const idGame = Math.random().toString(36).slice(2, 9);
    navigate(`/privategame/${idGame}`);
  };*/

  return (
    <Box sx={{ display: "flex", width: percent(100) }}>
      <Grid container spacing={1} justifyContent="center" sx={{ mb: 2 }}>
        <Helmet>
          <title>{`${t("pages.home.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1">{t("appname")}</Typography>
          <Typography variant="h4">{t("description")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <RuleBlock />
        </Grid>
        {/*<Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LockIcon />}
            sx={{ borderRadius: px(50), p: 1 }}
            onClick={() => createPrivateGame()}
          >
            <Typography variant="h4">
              {t("commun.createprivategame")}
            </Typography>
          </Button>
  </Grid>*/}
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {themes.map((theme) => (
              <Grid item xs={4} sm={2} md={2} key={theme.id}>
                <CardTheme theme={theme} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
