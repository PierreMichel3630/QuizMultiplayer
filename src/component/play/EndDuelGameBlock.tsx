import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "../avatar/AvatarAccount";

import BoltIcon from "@mui/icons-material/Bolt";
import HomeIcon from "@mui/icons-material/Home";
import { px } from "csx";
import { useNavigate } from "react-router-dom";
import { ButtonColor } from "../Button";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { COLORDUEL1, COLORDUEL2 } from "src/pages/play/DuelPage";
import { Elo } from "src/models/Elo";
import { launchDuelGame } from "src/api/game";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import AutorenewIcon from "@mui/icons-material/Autorenew";
interface Props {
  game: DuelGame;
  elo?: Elo;
}

export const EndDuelGameBlock = ({ game, elo }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uuid } = useUser();

  const isPlayer1 = game.player1.id === uuid;
  const hasWin = isPlayer1
    ? game.ptsplayer1 > game.ptsplayer2
    : game.ptsplayer2 > game.ptsplayer1;
  const equality = game.ptsplayer2 === game.ptsplayer1;

  const revenge = () => {
    const player1 = isPlayer1 ? game.player1.id : game.player2.id;
    const player2 = isPlayer1 ? game.player2.id : game.player1.id;
    launchDuelGame(player1, player2, game.theme.id).then(({ data }) => {
      if (data) {
        navigate(`/duel/${data.uuid}`, {});
      }
    });
  };

  return (
    <Box sx={{ pt: 3, pr: 1, pl: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Box sx={{ width: px(70) }}>
            <ImageThemeBlock theme={game.theme} />
          </Box>
          <JsonLanguageBlock
            variant="h2"
            color="text.secondary"
            sx={{ wordBreak: "break-all" }}
            value={game.theme.name}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1" color="text.secondary">
            {equality
              ? t("commun.equality")
              : hasWin
              ? t("commun.win")
              : t("commun.loose")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h2" sx={{ color: COLORDUEL1, fontSize: 35 }}>
              {game.ptsplayer1}
            </Typography>
            <AvatarAccount
              avatar={game.player1.avatar}
              size={80}
              color={COLORDUEL1}
            />
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Typography variant="h4" sx={{ color: COLORDUEL1 }}>
              {game.player1.username}
            </Typography>
            {elo && (
              <>
                <Typography
                  variant="h6"
                  component="span"
                  color="text.secondary"
                >
                  {elo.eloPlayer1} {t("commun.points")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color:
                      elo.delta === 0
                        ? Colors.white
                        : elo.delta > 0
                        ? Colors.green
                        : Colors.red,
                  }}
                  component="span"
                >
                  {` (${elo.delta > 0 ? "+" : ""}${elo.delta})`}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BoltIcon sx={{ fontSize: 50, color: Colors.white }} />
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <AvatarAccount
              avatar={game.player2.avatar}
              size={80}
              color={COLORDUEL2}
            />
            <Typography variant="h2" sx={{ color: COLORDUEL2, fontSize: 35 }}>
              {game.ptsplayer2}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: COLORDUEL2 }}>
              {game.player2.username}
            </Typography>
            {elo && (
              <>
                <Typography
                  variant="h6"
                  component="span"
                  color="text.secondary"
                >
                  {elo.eloPlayer2} {t("commun.points")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color:
                      elo.delta === 0
                        ? Colors.white
                        : -elo.delta > 0
                        ? Colors.green
                        : Colors.red,
                  }}
                  component="span"
                >
                  {` (${-elo.delta > 0 ? "+" : ""}${-elo.delta})`}
                </Typography>
              </>
            )}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.red}
            label={t("commun.revenge")}
            icon={OfflineBoltIcon}
            onClick={() => revenge()}
            variant="contained"
          />
        </Grid>
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.blue}
            label={t("commun.changetheme")}
            icon={AutorenewIcon}
            onClick={() =>
              navigate("/play", {
                state: {
                  opponent: isPlayer1 ? game.player2 : game.player1,
                  theme: game.theme,
                },
              })
            }
            variant="contained"
          />
        </Grid>
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.green}
            label={t("commun.returnhome")}
            icon={HomeIcon}
            onClick={() => navigate("/")}
            variant="contained"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
