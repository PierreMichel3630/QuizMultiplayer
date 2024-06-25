import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import BoltIcon from "@mui/icons-material/Bolt";
import HomeIcon from "@mui/icons-material/Home";
import { px } from "csx";
import { useNavigate } from "react-router-dom";
import { launchDuelGame, matchmakingDuelGame } from "src/api/game";
import { Elo } from "src/models/Elo";
import { COLORDUEL1, COLORDUEL2 } from "src/pages/play/DuelPage";
import { ButtonColor } from "../Button";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import ReplayIcon from "@mui/icons-material/Replay";
import { Fragment, useMemo, useState } from "react";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Question } from "src/models/Question";
import { CardSignalQuestion } from "../card/CardQuestion";
import { ReportModal } from "../modal/ReportModal";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

interface Props {
  game: DuelGame;
  elo?: Elo;
  questions: Array<Question>;
}

export const EndDuelGameBlock = ({ game, elo, questions }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uuid } = useUser();
  const { user } = useAuth();

  const [question, setQuestion] = useState<Question | undefined>(undefined);

  const gamebattle = useMemo(() => game.battlegame, [game]);

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

  const playDuel = async () => {
    if (user) {
      if (uuid) {
        const { data } = await matchmakingDuelGame(uuid, game.theme.id);
        navigate(`/duel/${data.uuid}`);
      }
    } else {
      navigate(`/login`);
    }
  };

  return (
    <Box sx={{ mb: gamebattle !== null ? px(50) : px(180) }}>
      <Grid container spacing={1}>
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
            <AvatarAccountBadge
              profile={game.player1}
              size={60}
              color={COLORDUEL1}
            />
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Typography variant="h4" sx={{ color: COLORDUEL1 }}>
              {game.player1.username}
            </Typography>
            {game.player1.title && (
              <JsonLanguageBlock
                variant="caption"
                color="text.secondary"
                value={game.player1.title.name}
              />
            )}
            <Box>
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
            <AvatarAccountBadge
              profile={game.player2}
              size={60}
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
            {game.player2.title && (
              <JsonLanguageBlock
                variant="caption"
                color="text.secondary"
                value={game.player2.title.name}
              />
            )}
            <Box>
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
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider
            sx={{
              borderBottomWidth: 5,
              borderColor: Colors.white,
              borderRadius: px(5),
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1" color="text.secondary">
            {t("commun.questions")}
          </Typography>
        </Grid>
        {questions.map((el) => (
          <Fragment key={el.id}>
            <Grid item xs={12}>
              <CardSignalQuestion
                question={el}
                report={() => setQuestion(el)}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider
                sx={{
                  borderBottomWidth: 3,
                  borderColor: Colors.white,
                  borderRadius: px(5),
                }}
              />
            </Grid>
          </Fragment>
        ))}
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            backgroundColor: Colors.black,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              flexDirection: "column",
            }}
          >
            {gamebattle !== null ? (
              <ButtonColor
                value={Colors.blue}
                label={t("commun.return")}
                icon={KeyboardReturnIcon}
                onClick={() => navigate(`/battle/${gamebattle.uuid}`)}
                variant="contained"
              />
            ) : (
              <>
                <ButtonColor
                  value={Colors.red}
                  label={t("commun.replay")}
                  icon={ReplayIcon}
                  onClick={() => playDuel()}
                  variant="contained"
                />
                <ButtonColor
                  value={Colors.blue}
                  label={t("commun.revenge")}
                  icon={OfflineBoltIcon}
                  onClick={() => revenge()}
                  variant="contained"
                />
                <ButtonColor
                  value={Colors.green}
                  label={t("commun.returnhome")}
                  icon={HomeIcon}
                  onClick={() => navigate("/")}
                  variant="contained"
                />
              </>
            )}
          </Box>
        </Container>
      </Box>
      <ReportModal
        open={question !== undefined}
        close={() => setQuestion(undefined)}
        question={question}
      />
    </Box>
  );
};
