import { Alert, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const ConnectAlert = () => {
  const { t } = useTranslation();

  return (
    <Alert severity="warning">
      <Typography variant="body1">
        <Trans
          i18nKey={t("alert.notconnect")}
          values={{
            link: t("commun.createaccount"),
            link2: t("commun.login"),
          }}
          components={{
            anchor1: <Link to="/register" />,
            anchor2: <Link to="/login" />,
          }}
          style={{ color: "white" }}
        />
      </Typography>
    </Alert>
  );
};

export const NeedConnectAlert = () => {
  const { t } = useTranslation();

  return (
    <Alert severity="warning">
      <Typography variant="body1">
        <Trans
          i18nKey={t("alert.notconnect2")}
          values={{
            link: t("commun.createaccount"),
            link2: t("commun.login"),
          }}
          components={{
            anchor1: <Link to="/register" />,
            anchor2: <Link to="/login" />,
          }}
          style={{ color: "white" }}
        />
      </Typography>
    </Alert>
  );
};
