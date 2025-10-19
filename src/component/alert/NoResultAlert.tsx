import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

export const NoResultAlert = () => {
  const { t } = useTranslation();

  return <Alert severity="warning">{t("alert.noresult")}</Alert>;
};
