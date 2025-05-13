import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { StatusPlayerGame } from "../StatusPlayer";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";

import { useEffect, useMemo, useState } from "react";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { selectScoreByThemeAndPlayer } from "src/api/score";
import { StatAccomplishment } from "src/models/Accomplishment";
import { Score } from "src/models/Score";
import { StatusGameDuel } from "src/models/enum/StatusGame";
import { getLevel } from "src/utils/calcul";
import { CountryBlock } from "../CountryBlock";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { LabelRankBlock } from "../RankBlock";
import { SearchPlayerBlock } from "./SearchPlayerBlock";

interface Props {
  game: DuelGame;
  players: Array<string>;
}
export const WaitPlayerDuelGameBlock = ({ game, players }: Props) => {
  const [loadingP2, setLoadingP2] = useState(true);
  const [scoreP2, setScoreP2] = useState<Score | null>(null);
  const [statP2, setStatP2] = useState<StatAccomplishment | undefined>(
    undefined
  );
  const [loadingP1, setLoadingP1] = useState(true);
  const [scoreP1, setScoreP1] = useState<Score | null>(null);
  const [statP1, setStatP1] = useState<StatAccomplishment | undefined>(
    undefined
  );

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
    const getLevel = () => {
      selectStatAccomplishmentByProfile(game.player1.id).then(({ data }) => {
        setStatP1(data as StatAccomplishment);
      });
    };
    getLevel();
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
    const getLevel = () => {
      if (game.player2 !== null) {
        selectStatAccomplishmentByProfile(game.player2.id).then(({ data }) => {
          setStatP2(data as StatAccomplishment);
        });
      }
    };
    getLevel();
    getRank();
  }, [game.player2, game.theme]);

  const lvlP1 = useMemo(
    () => (statP1 ? getLevel(statP1.xp) : undefined),
    [statP1]
  );
  const lvlP2 = useMemo(
    () => (statP2 ? getLevel(statP2.xp) : undefined),
    [statP2]
  );

  return (
    <Box
      sx={{
        width: percent(100),
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundColor: Colors.colorDuel1,
          backgroundImage: game.player1?.banner
            ? `url("${game.player1.banner.src}")`
            : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.colorApp} 46%, ${Colors.blue} 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
          level={lvlP1}
        />
        <Box>
          <Typography
            variant="h2"
            color="text.secondary"
            sx={{
              textShadow: "1px 1px 2px black",
            }}
          >
            {game.player1.username}
          </Typography>
          {game.player1.title && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              value={game.player1.title.name}
              sx={{
                textShadow: "1px 1px 2px black",
              }}
            />
          )}
          <LabelRankBlock loading={loadingP1} score={scoreP1} />
          {game.player1.country && (
            <CountryBlock
              country={game.player1.country}
              color="text.secondary"
            />
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
          backgroundColor: Colors.colorDuel2,
          backgroundImage: game.player2?.banner
            ? `url("${game.player2.banner.src}")`
            : `linear-gradient(43deg, ${Colors.blue} 0%, ${Colors.colorApp} 46%, ${Colors.blue} 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: percent(50),
          width: percent(100),
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          borderTop: "5px solid white",
        }}
      >
        {game.player2 !== null ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 5,
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="h2"
                color="text.secondary"
                sx={{
                  textShadow: "1px 1px 2px black",
                }}
              >
                {game.player2.username}
              </Typography>
              {game.player2.title && (
                <JsonLanguageBlock
                  variant="caption"
                  color="text.secondary"
                  value={game.player2.title.name}
                  sx={{
                    textShadow: "1px 1px 2px black",
                  }}
                />
              )}
              <LabelRankBlock loading={loadingP2} score={scoreP2} />
              {game.player2.country && (
                <CountryBlock
                  country={game.player2.country}
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
              level={lvlP2}
            />
          </Box>
        ) : (
          <Box>
            <SearchPlayerBlock />
          </Box>
        )}
      </Box>
    </Box>
  );
};
