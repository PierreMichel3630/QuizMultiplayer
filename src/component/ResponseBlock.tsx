import { Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useUser } from "src/context/UserProvider";
import {
  Response,
  ResponseDuel,
  ResponseSolo,
  ResponseTraining,
} from "src/models/Response";
import { Colors } from "src/style/Colors";

import { useTranslation } from "react-i18next";
import { JsonLanguageArrayOrStringBlock } from "./JsonLanguageBlock";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { InputResponseBlock } from "./question/InputResponseBlock";

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

interface ResponseDuelProps {
  response?: Response;
  responsePlayer1?: ResponseDuel;
  responsePlayer2?: ResponseDuel;
  onSubmit: (value: string) => void;
}

export const ResponseDuelBlock = ({
  response,
  responsePlayer1,
  responsePlayer2,
  onSubmit,
}: ResponseDuelProps) => {
  const { uuid } = useUser();

  const isPlayer1 = responsePlayer1 && uuid === responsePlayer1.uuid;
  const isPlayer2 = responsePlayer2 && uuid === responsePlayer2.uuid;
  const hasAnswer =
    response ||
    (responsePlayer1 && responsePlayer1.uuid === uuid) ||
    (responsePlayer2 && responsePlayer2.uuid === uuid);

  return (
    <>
      {!hasAnswer ? (
        <InputResponseBlock
          onSubmit={(value) => onSubmit(value.value as string)}
        />
      ) : (
        <>
          {response && (
            <Paper
              sx={{
                p: 1,
                backgroundColor: Colors.green,
                borderRadius: px(10),
                textAlign: "center",
                width: percent(100),
                userSelect: "none",
              }}
            >
              <JsonLanguageArrayOrStringBlock
                variant="h2"
                color="text.secondary"
                value={response.response}
              />
            </Paper>
          )}
          {responsePlayer1 && (response || isPlayer1) && (
            <Paper
              sx={{
                p: 1,
                backgroundColor: responsePlayer1.result
                  ? Colors.green
                  : Colors.red,
                borderRadius: px(10),
                textAlign: "center",
                width: percent(100),
                position: "relative",
                userSelect: "none",
              }}
            >
              <ArrowRightIcon
                sx={{
                  fontSize: 50,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  left: 0,
                  color: Colors.white,
                }}
              />
              <Typography variant="h2" color="text.secondary">
                {responsePlayer1.answer}
              </Typography>
            </Paper>
          )}
          {responsePlayer2 && (response || isPlayer2) && (
            <Paper
              sx={{
                p: 1,
                backgroundColor: responsePlayer2.result
                  ? Colors.green
                  : Colors.red,
                borderRadius: px(10),
                textAlign: "center",
                width: percent(100),
                position: "relative",
                color: Colors.white,
              }}
            >
              <Typography variant="h2" color="text.secondary">
                {responsePlayer2.answer}
              </Typography>
              <ArrowLeftIcon
                sx={{
                  fontSize: 50,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  right: 0,
                }}
              />
            </Paper>
          )}
        </>
      )}
    </>
  );
};
