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

export default function RecapDuelPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { uuidGame } = useParams();

  const extra = location.state ? location.state.extra : undefined;

  const [game, setGame] = useState<undefined | DuelGame>(undefined);

  useEffect(() => {
    const getGame = () => {
      if (uuidGame) {
        selectDuelGameById(uuidGame).then(({ data }) => {
          setGame(data as DuelGame);
        });
      }
    };
    getGame();
  }, [uuidGame]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: viewHeight(100),
        backgroundColor: Colors.black,
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
        {game && (
          <>
            {game.status === "END" ? (
              <EndDuelGameBlock game={game} extra={extra} />
            ) : (
              <CancelDuelGameBlock game={game} />
            )}
          </>
        )}
      </Box>
    </Container>
  );
}
