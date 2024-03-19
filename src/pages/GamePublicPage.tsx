import { Button, Grid, InputBase, Typography } from "@mui/material";
import { px } from "csx";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { selectGames } from "src/api/game";
import { RuleBlock } from "src/component/RuleBlock";
import { useUser } from "src/context/UserProvider";
import { Game } from "src/models/Game";
import { Colors } from "src/style/Colors";

import LockIcon from "@mui/icons-material/Lock";
import { CardGame } from "src/component/card/CardGame";

export const GamePublicPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { username, setUsername } = useUser();

  const [games, setGames] = useState<Array<Game>>([]);

  const getGames = () => {
    selectGames().then((res) => {
      if (res.data) setGames(res.data as Array<Game>);
    });
  };

  useEffect(() => {
    getGames();
  }, []);

  const createPrivateGame = () => {
    const idGame = Math.random().toString(36).slice(2, 9);
    navigate(`/privategame/${idGame}`);
  };

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
      <Grid item>
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
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<LockIcon />}
          sx={{ borderRadius: px(50), p: 1 }}
          onClick={() => createPrivateGame()}
        >
          <Typography variant="h4">{t("commun.createprivategame")}</Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="stretch">
          {games.map((game) => (
            <Grid item xs={4} key={game.id}>
              <CardGame game={game} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
