import { Box, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

import { viewHeight } from "csx";
import { Helmet } from "react-helmet-async";
import { Navigate, useLocation } from "react-router-dom";
import { EndDuelGameBlock } from "src/component/play/EndDuelGameBlock";
import { Colors } from "src/style/Colors";

export const RecapDuelPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const game = location.state ? location.state.game : undefined;
  const elo = location.state ? location.state.elo : undefined;

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewHeight(100),
        backgroundColor: Colors.black,
        p: 0,
      }}
    >
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>

      <Box
        sx={{
          display: "flex",
          flex: "1 1 0%",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {location.state && game && elo ? (
          <EndDuelGameBlock game={game} elo={elo} />
        ) : (
          <Navigate to="/" replace />
        )}
      </Box>
    </Container>
  );
};
