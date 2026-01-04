import { Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useUser } from "src/context/UserProvider";
import { ResponseSolo, ResponseTraining } from "src/models/Response";
import { Colors } from "src/style/Colors";

import { useTranslation } from "react-i18next";

interface ResponseSoloProps {
  response: ResponseSolo;
}

export const ResponseSoloBlock = ({ response }: ResponseSoloProps) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const value = language
    ? typeof response.response === "number"
      ? response.response
      : response.response[language.iso]
      ? response.response[language.iso]
      : response.response["fr-FR"]
    : "";

  const label = Array.isArray(value) ? value[0] ?? "" : value;

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: response.result ? Colors.green : Colors.red,
        borderRadius: px(5),
        textAlign: "center",
        width: percent(100),
        userSelect: "none",
      }}
    >
      <Typography variant="h2" color="text.secondary">
        {response.answer}
      </Typography>
      <Typography variant="h4" color="text.secondary" component="span">
        {t("commun.goodresponse")} :{" "}
      </Typography>
      <Typography variant="h2" color="text.secondary" component="span">
        {label}
      </Typography>
    </Paper>
  );
};

interface ResponseTrainingProps {
  response: ResponseTraining;
}

export const ResponseTrainingBlock = ({ response }: ResponseTrainingProps) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const value = language
    ? typeof response.response === "number"
      ? response.response
      : response.response[language.iso]
      ? response.response[language.iso]
      : response.response["fr-FR"]
    : "";

  const label = Array.isArray(value) ? value[0] ?? "" : value;

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: response.result ? Colors.green : Colors.red,
        borderRadius: px(5),
        textAlign: "center",
        width: percent(100),
        userSelect: "none",
      }}
    >
      <Typography variant="h2" color="text.secondary">
        {response.answer}
      </Typography>
      <Typography variant="h4" color="text.secondary" component="span">
        {t("commun.goodresponse")} :{" "}
      </Typography>
      <Typography variant="h2" color="text.secondary" component="span">
        {label}
      </Typography>
    </Paper>
  );
};
