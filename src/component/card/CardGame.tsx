import { Box, Button, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { Game } from "src/models/Game";
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
  game: Game;
}

export const CardGame = ({ game }: Props) => {
  const { t } = useTranslation();
  const { language, username, setUsername } = useUser();
  const navigate = useNavigate();

  const name = game.name[language.iso];

  const joinRoom = () => {
    const newUsername = username !== "" ? username : "Player 1";
    setUsername(newUsername);
    navigate(`/play/${game.channel}`, { state: { username: newUsername } });
  };

  return (
    <Paper
      sx={{
        borderRadius: px(10),
        overflow: "hidden",
        position: "relative",
        height: px(250),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.greyLightMode,
      }}
    >
      {game.image && <img src={game.image} className={imageCss} />}
      <Box sx={{ zIndex: 1, textAlign: "center" }}>
        <Typography
          variant="h1"
          sx={{ color: "white", fontSize: 50, textShadow: "2px 2px 4px black" }}
        >
          {name}
        </Typography>
        {/*<Typography
          variant="h2"
          sx={{ color: "white", textShadow: "2px 2px 4px black" }}
        >
          {`${theme.questions} ${t("commun.questions")}`}
    </Typography>*/}
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
            {game && game.question !== null
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
