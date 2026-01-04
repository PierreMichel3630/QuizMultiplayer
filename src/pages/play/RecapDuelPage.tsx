import { Box, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { selectDuelGameById } from "src/api/game";
import { CircularLoading } from "src/component/Loading";
import { CancelDuelGameBlock } from "src/component/play/CancelDuelGameBlock";
import { EndDuelGameBlock } from "src/component/play/EndDuelGameBlock";
import { DuelGame } from "src/models/DuelGame";

export default function RecapDuelPage() {
  const { t } = useTranslation();
  const { uuidGame } = useParams();

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
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
      className="page"
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
                <EndDuelGameBlock game={game} />
              ) : (
                <CancelDuelGameBlock game={game} />
              )}
            </>
          )
        )}
      </Box>
    </Container>
  );
}
