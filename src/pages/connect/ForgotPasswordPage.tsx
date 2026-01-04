import { Box, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { px } from "csx";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import logo from "src/assets/logo.svg";
import { ButtonColor } from "src/component/Button";
import { QuitHomeButton } from "src/component/navigation/GoBackButton";
import { ForgotPasswordForm } from "src/form/authentification/ForgotPasswordForm";
import { Colors } from "src/style/Colors";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSend, setIsSend] = useState(false);

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
        <title>{`${t("pages.forgotpassword.title")} - ${t("appname")}`}</title>
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
            <Grid
              container
              spacing={1}
              justifyContent="center"
              sx={{ textAlign: "center" }}
            >
              {isSend ? (
                <>
                  <Grid item>
                    <MarkEmailReadIcon
                      sx={{ fontSize: 100, color: Colors.colorApp }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4">
                      {t("form.forgotpassword.sendemail")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">
                      {t("form.forgotpassword.sendemailinfo")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ButtonColor
                      value={Colors.blue}
                      label={t("commun.return")}
                      icon={KeyboardReturnIcon}
                      onClick={() => {
                        navigate(`/`);
                      }}
                      variant="contained"
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h4">
                      {t("form.forgotpassword.forgotpassword")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      {t("form.forgotpassword.modality")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ForgotPasswordForm send={() => setIsSend(true)} />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ justifyContent: "center", display: "flex", gap: 1 }}
                  >
                    <Typography variant="body1">
                      {t("form.forgotpassword.notforget")}
                    </Typography>
                    <Link to="/login">
                      <Typography
                        variant="body1"
                        sx={{ textDecoration: "underline" }}
                      >
                        {t("form.forgotpassword.connection")}
                      </Typography>
                    </Link>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
