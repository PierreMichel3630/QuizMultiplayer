import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { RegisterForm } from "src/form/authentification/RegisterForm";

import { px } from "csx";
import { Helmet } from "react-helmet-async";
import logo from "src/assets/logo.svg";
import { QuitHomeButton } from "src/component/navigation/GoBackButton";
import { Colors } from "src/style/Colors";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
      className="page"
    >
      <Helmet>
        <title>{`${t("pages.register.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 0",
          flexDirection: "column",
          justifyContent: "center",
          p: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            border: `2px solid ${Colors.grey3}`,
            borderRadius: px(15),
            p: 2,
            position: "relative",
          }}
        >
          <Box sx={{ position: "absolute", top: 0, right: 0 }}>
            <QuitHomeButton />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <img alt="logo" src={logo} width={45} height={45} loading="lazy" />
            <Typography variant="h2">{t("appname")}</Typography>
          </Box>
          <Box>
            <RegisterForm />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
