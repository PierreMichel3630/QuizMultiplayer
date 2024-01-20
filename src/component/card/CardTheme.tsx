import { Box, Button, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { Game } from "src/models/Game";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { style } from "typestyle";

const imageCss = style({
  position: "absolute",
  width: percent(100),
  objectFit: "cover",
  opacity: 0.8,
  height: px(300),
  top: 0,
});

interface Props {
  theme: Theme;
  game?: Game;
}

export const CardTheme = ({ theme, game }: Props) => {
  const { t } = useTranslation();
  const { language, username } = useUser();
  const navigate = useNavigate();

  const name = theme.name[language.iso];

  const joinRoom = () => {
    navigate(`/play/${theme.id}`, { state: { username } });
  };

  return (
    <Paper
      sx={{
        borderRadius: px(10),
        overflow: "hidden",
        position: "relative",
        height: px(300),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.greyLightMode,
      }}
    >
      {theme.image && <img src={theme.image} className={imageCss} />}
      <Box sx={{ zIndex: 1, textAlign: "center" }}>
        <Typography
          variant="h1"
          sx={{ color: "white", fontSize: 50, textShadow: "2px 2px 4px black" }}
        >
          {name}
        </Typography>
        <Typography
          variant="h4"
          sx={{ color: "white", textShadow: "2px 2px 4px black" }}
        >
          {game && game.players > 0
            ? t("commun.player", { count: game.players })
            : t("commun.noplayer")}
        </Typography>
        {game && game.in_progress && (
          <Typography
            variant="h4"
            sx={{ color: "white", textShadow: "2px 2px 4px black" }}
          >
            {game && game.players > 0 && game.question !== null
              ? `${game.question} ${t("commun.questions")}`
              : t("commun.wait")}
          </Typography>
        )}
        <Typography
          variant="body1"
          sx={{ color: "white", textShadow: "2px 2px 4px black" }}
        ></Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: px(50), p: 2 }}
          onClick={() => joinRoom()}
        >
          <Typography variant="h1" sx={{ fontSize: 30 }}>
            {t("commun.play")}
          </Typography>
        </Button>
      </Box>
    </Paper>
  );
};
