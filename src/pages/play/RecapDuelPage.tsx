import { Box, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

import { viewHeight } from "csx";
import { Helmet } from "react-helmet-async";
import { Navigate, useLocation } from "react-router-dom";
import { EndDuelGameBlock } from "src/component/play/EndDuelGameBlock";
import { Colors } from "src/style/Colors";
import { CancelDuelGameBlock } from "src/component/play/CancelDuelGameBlock";

export const RecapDuelPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const game = location.state ? location.state.game : undefined;
  const elo = location.state ? location.state.elo : undefined;
  const questions = location.state ? location.state.questions : [];

  console.log(location.state);

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
        {location.state && game && elo && game.start ? (
          <EndDuelGameBlock game={game} elo={elo} questions={questions} />
        ) : location.state && game && !game.start ? (
          <CancelDuelGameBlock game={game} />
        ) : (
          <Navigate to="/" replace />
        )}
      </Box>
    </Container>
  );
};
