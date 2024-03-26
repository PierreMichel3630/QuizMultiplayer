import { Grid, Paper } from "@mui/material";
import { useUser } from "src/context/UserProvider";
import {
  Response,
  ResponseDuel,
  ResponseLanguageString,
  ResponseSolo,
} from "src/models/Response";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { percent } from "csx";

interface Props {
  responses: Array<ResponseLanguageString>;
  onSubmit: (value: string) => void;
}

export const QcmBlock = ({ responses, onSubmit }: Props) => {
  const { language } = useUser();
  return (
    <Grid container spacing={1}>
      {responses.map((response, index) => (
        <Grid item xs={12} key={index}>
          <Paper
            sx={{
              pt: 2,
              pb: 2,
              pl: 1,
              pr: 1,
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => onSubmit(response[language.iso])}
          >
            <JsonLanguageBlock variant="h2" value={response} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsResponse {
  responses: Array<ResponseLanguageString>;
  response: ResponseSolo;
}

export const QcmResponseBlock = ({ responses, response }: PropsResponse) => {
  const { language } = useUser();
  const value = response.response[language.iso]
    ? response.response[language.iso]
    : response.response["fr-FR"];

  return (
    <Grid container spacing={1}>
      {responses.map((r, index) => {
        const isCorrectResponse = Array.isArray(value)
          ? value.includes(r[language.iso])
          : value === r[language.iso];
        const isMyAnswer = response.answer === r[language.iso];
        return (
          <Grid item xs={12} key={index}>
            <Paper
              sx={{
                pt: 2,
                pb: 2,
                pl: 1,
                pr: 1,
                textAlign: "center",
                backgroundColor: isCorrectResponse
                  ? Colors.green
                  : isMyAnswer
                  ? Colors.red
                  : "primary.main",
              }}
            >
              <JsonLanguageBlock variant="h2" value={r} />
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

interface PropsQcmBlockDuel {
  responses: Array<ResponseLanguageString>;
  onSubmit: (value: string) => void;
  responsePlayer1: undefined | ResponseDuel;
  responsePlayer2: undefined | ResponseDuel;
  response?: Response;
}

export const QcmBlockDuelBlock = ({
  responses,
  onSubmit,
  responsePlayer1,
  responsePlayer2,
  response,
}: PropsQcmBlockDuel) => {
  const { uuid, language } = useUser();
  const value = response
    ? response.response[language.iso]
      ? response.response[language.iso]
      : response.response["fr-FR"]
    : undefined;
  const isPlayer1 = responsePlayer1 && uuid === responsePlayer1.uuid;
  const isPlayer2 = responsePlayer2 && uuid === responsePlayer2.uuid;
  const hasAnswer =
    (responsePlayer1 && responsePlayer1.uuid === uuid) ||
    (responsePlayer2 && responsePlayer2.uuid === uuid);

  return (
    <Grid container spacing={1}>
      {responses.map((res, index) => {
        const isCorrectResponse = Array.isArray(value)
          ? value.includes(res[language.iso])
          : value === res[language.iso];

        const isResponsePlayer1 =
          responsePlayer1 && responsePlayer1.answer === res[language.iso];
        const isResponsePlayer2 =
          responsePlayer2 && responsePlayer2.answer === res[language.iso];

        return (
          <Grid item xs={12} key={index}>
            <Paper
              sx={{
                pt: 2,
                pb: 2,
                pl: 1,
                pr: 1,
                position: "relative",
                cursor: hasAnswer ? "default" : "pointer",
                textAlign: "center",
                backgroundColor: isCorrectResponse
                  ? Colors.green
                  : value && (isResponsePlayer1 || isResponsePlayer2)
                  ? Colors.red
                  : "primary.main",
              }}
              onClick={() => {
                if (!hasAnswer) {
                  onSubmit(res[language.iso]);
                }
              }}
            >
              {isResponsePlayer1 && (response || isPlayer1) && (
                <ArrowRightIcon
                  sx={{
                    fontSize: 50,
                    position: "absolute",
                    top: percent(50),
                    translate: "0 -50%",
                    left: 0,
                  }}
                />
              )}
              <JsonLanguageBlock variant="h2" value={res} />
              {isResponsePlayer2 && (response || isPlayer2) && (
                <ArrowLeftIcon
                  sx={{
                    fontSize: 50,
                    position: "absolute",
                    top: percent(50),
                    translate: "0 -50%",
                    right: 0,
                  }}
                />
              )}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};
