import { Grid, InputBase, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectGames } from "src/api/game";
import { selectThemes } from "src/api/theme";
import { RuleBlock } from "src/component/RuleBlock";
import { CardTheme } from "src/component/card/CardTheme";
import { useUser } from "src/context/UserProvider";
import { Game } from "src/models/Game";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";

export const ThemePage = () => {
  const { t } = useTranslation();
  const { username, setUsername } = useUser();

  const [games, setGames] = useState<Array<Game>>([]);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  const getThemes = () => {
    selectThemes().then((res) => {
      if (res.data) setThemes(res.data as Array<Theme>);
    });
  };

  const getGames = () => {
    selectGames().then((res) => {
      if (res.data) setGames(res.data as Array<Game>);
    });
  };

  useEffect(() => {
    getThemes();
    getGames();
  }, []);

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      alignContent="flex-start"
    >
      <Helmet>
        <title>{`${t("pages.home.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h1">{t("appname")}</Typography>
        <Typography variant="h4">{t("description")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <InputBase
          fullWidth
          value={username}
          placeholder={t("commun.chooseusername")}
          onChange={(event) => setUsername(event.target.value)}
          inputProps={{
            style: {
              textAlign: "center",
              fontFamily: ["Montserrat", "sans-serif"].join(","),
              fontSize: 25,
              fontWeight: 700,
            },
          }}
          sx={{
            border: `3px solid ${Colors.lightgrey}`,
            backgroundColor: Colors.white,
            height: px(50),
            borderRadius: px(15),
            textAlign: "center",
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RuleBlock />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="stretch">
          {themes.map((theme) => {
            const game = games.find((el) => el.theme === theme.id);
            return (
              <Grid item xs={4} key={theme.id}>
                <CardTheme theme={theme} game={game} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );
};
