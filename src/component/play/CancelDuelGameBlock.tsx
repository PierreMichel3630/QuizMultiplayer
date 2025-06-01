import { Box, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import BoltIcon from "@mui/icons-material/Bolt";
import HomeIcon from "@mui/icons-material/Home";
import { ButtonColor } from "../Button";
import { LabelRankBlock } from "../RankBlock";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useEffect, useMemo, useState } from "react";
import { selectScoreByThemeAndPlayer } from "src/api/score";
import { Score } from "src/models/Score";

interface Props {
  game: DuelGame;
}

export const CancelDuelGameBlock = ({ game }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const gamebattle = useMemo(() => game.battlegame, [game]);

  const [loadingP2, setLoadingP2] = useState(true);
  const [scoreP2, setScoreP2] = useState<Score | null>(null);
  const [loadingP1, setLoadingP1] = useState(true);
  const [scoreP1, setScoreP1] = useState<Score | null>(null);

  useEffect(() => {
    const getRank = () => {
      selectScoreByThemeAndPlayer(game.player1.id, game.theme.id).then(
        ({ data }) => {
          const res = data as Score;
          setScoreP1(res);
          setLoadingP1(false);
        }
      );
    };
    getRank();
  }, [game.player1, game.theme]);

  useEffect(() => {
    const getRank = () => {
      if (game.player2 !== null) {
        selectScoreByThemeAndPlayer(game.player2.id, game.theme.id).then(
          ({ data }) => {
            const res = data as Score;
            setScoreP2(res);
            setLoadingP2(false);
          }
        );
      }
    };
    getRank();
  }, [game.player2, game.theme]);

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
          <Typography variant="h2" sx={{ wordBreak: "break-all" }}>
            {game.theme.title}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h1">{t("commun.cancelgame")}</Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="body1">
            {t("commun.opponentdontjoin")}
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
          <AvatarAccountBadge
            profile={game.player1}
            size={80}
            color={Colors.colorDuel1}
          />
          <Typography variant="h4" sx={{ color: Colors.colorDuel1 }}>
            {game.player1.username}
          </Typography>
          {game.player1.title && (
            <JsonLanguageBlock
              variant="caption"
              value={game.player1.title.name}
            />
          )}
          <LabelRankBlock loading={loadingP1} score={scoreP1} />
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
          <AvatarAccountBadge
            profile={game.player2}
            size={80}
            color={Colors.colorDuel2}
          />
          <Typography variant="h4" sx={{ color: Colors.colorDuel2 }}>
            {game.player2.username}
          </Typography>
          {game.player2.title && (
            <JsonLanguageBlock
              variant="caption"
              value={game.player2.title.name}
            />
          )}
          <LabelRankBlock loading={loadingP2} score={scoreP2} />
        </Grid>
        <Grid item xs={12}>
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
                onClick={() => navigate(`/battle/${gamebattle}`)}
                variant="contained"
              />
            ) : (
              <>
                <ButtonColor
                  value={Colors.green}
                  label={t("commun.returnhome")}
                  icon={HomeIcon}
                  onClick={() => navigate("/")}
                  variant="contained"
                />
                <ButtonColor
                  value={Colors.blue}
                  label={t("commun.return")}
                  icon={KeyboardReturnIcon}
                  onClick={() => {
                    navigate(`/theme/${game.theme.id}`);
                  }}
                  variant="contained"
                />
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
