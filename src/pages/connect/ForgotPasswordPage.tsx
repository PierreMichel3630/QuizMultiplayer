import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordForm } from "src/form/authentification/ForgotPasswordForm";
import { HeadTitle } from "src/component/HeadTitle";
import { useState } from "react";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "src/component/Button";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSend, setIsSend] = useState(false);

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.forgotpassword.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("form.forgotpassword.forgotpassword")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
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
                    sx={{ fontSize: 100, color: Colors.blue3 }}
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
      </Grid>
    </Grid>
  );
}
