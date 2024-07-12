import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { StatusPlayerGame } from "../StatusPlayer";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import { useTranslation } from "react-i18next";
import { COLORDUEL1, COLORDUEL2 } from "src/pages/play/DuelPage";
import { CountryBlock } from "../CountryBlock";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { LoadingDot } from "../Loading";
import { LabelRankBlock } from "../RankBlock";
import { StatusGameDuel } from "src/models/enum";

interface Props {
  game: DuelGame;
  players: Array<string>;
}
export const WaitPlayerDuelGameBlock = ({ game, players }: Props) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        width: percent(100),
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundColor: COLORDUEL1,
          height: percent(50),
          width: percent(100),
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "flex-start",
          p: 2,
          borderBottom: "5px solid white",
        }}
      >
        <AvatarAccountBadge
          profile={game.player1}
          size={100}
          color={Colors.white}
        />
        <Box>
          <Typography variant="h2" color="text.secondary">
            {game.player1.username}
          </Typography>
          {game.player1.title && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              value={game.player1.title.name}
            />
          )}
          <LabelRankBlock player={game.player1.id} theme={game.theme.id} />
          {game.player1.country && (
            <CountryBlock id={game.player1.country} color="text.secondary" />
          )}
          <StatusPlayerGame
            ready={
              game.status === StatusGameDuel.START ||
              players.includes(game.player1.id)
            }
          />
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: percent(50),
          left: percent(50),
          translate: "-50% -50%",
          m: 1,
          animation: "blinker 2s infinite",
          p: px(8),
          borderRadius: px(10),
        }}
      >
        <Box
          sx={{
            borderRadius: px(10),
            bgcolor: game.theme.color,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
          }}
        >
          <ImageThemeBlock theme={game.theme} size={90} />
          <JsonLanguageBlock
            variant="h4"
            sx={{ textAlign: "center" }}
            value={game.theme.name}
            color="text.secondary"
          />
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: COLORDUEL2,
          height: percent(50),
          width: percent(100),
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "flex-end",
          p: 5,
          borderTop: "5px solid white",
        }}
      >
        {game.player2 !== null ? (
          <>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="h2" color="text.secondary">
                {game.player2.username}
              </Typography>
              {game.player2.title && (
                <JsonLanguageBlock
                  variant="caption"
                  color="text.secondary"
                  value={game.player2.title.name}
                />
              )}
              <LabelRankBlock player={game.player2.id} theme={game.theme.id} />
              {game.player2.country && (
                <CountryBlock
                  id={game.player2.country}
                  color="text.secondary"
                />
              )}
              <StatusPlayerGame
                ready={
                  game.status === StatusGameDuel.START ||
                  players.includes(game.player2.id)
                }
              />
            </Box>
            <AvatarAccountBadge
              profile={game.player2}
              size={100}
              color={Colors.white}
            />
          </>
        ) : (
          <>
            <LoadingDot />
            <Typography variant="h6" color="text.secondary">
              {t("commun.searchplayer")}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};
