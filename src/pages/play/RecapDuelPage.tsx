import { Box, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

import { viewHeight } from "csx";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";
import { selectDuelGameById } from "src/api/game";
import { CancelDuelGameBlock } from "src/component/play/CancelDuelGameBlock";
import { EndDuelGameBlock } from "src/component/play/EndDuelGameBlock";
import { DuelGame } from "src/models/DuelGame";
import { Colors } from "src/style/Colors";
import { CircularLoading } from "src/component/Loading";

export default function RecapDuelPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { uuidGame } = useParams();

  const extra = location.state ? location.state.extra : undefined;

  const [game, setGame] = useState<null | DuelGame>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGame = () => {
      setLoading(true);
      if (uuidGame) {
        selectDuelGameById(uuidGame).then(({ data }) => {
          setGame(data as DuelGame);
          setLoading(false);
        });
      }
    };
    getGame();
  }, [uuidGame]);

  return (
    <Box
      sx={{
        backgroundColor: Colors.black,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: viewHeight(100),
          p: 0,
        }}
      >
        <Helmet>
          <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
        </Helmet>

        <Box
          sx={{
            p: 1,
          }}
        >
          {loading ? (
            <CircularLoading />
          ) : (
            game && (
              <>
                {game.status === "END" ? (
                  <EndDuelGameBlock game={game} extra={extra} />
                ) : (
                  <CancelDuelGameBlock game={game} />
                )}
              </>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
}
