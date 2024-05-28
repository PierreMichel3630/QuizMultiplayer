import { Grid, Paper } from "@mui/material";
import { useUser } from "src/context/UserProvider";
import { Response, ResponseDuel, ResponseSolo } from "src/models/Response";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

import { percent } from "csx";
import { QuestionDuel, QuestionSolo } from "src/models/Question";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

interface Props {
  question: QuestionSolo;
  onSubmit: (value: string) => void;
}

export const QcmBlock = ({ question, onSubmit }: Props) => {
  const { language } = useUser();
  return (
    <Grid container spacing={1}>
      {question.responses.map((response, index) => (
        <Grid item xs={question.image ? 6 : 12} key={index}>
          <Paper
            sx={{
              p: "15px 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              textAlign: "center",
              backgroundColor: Colors.grey,
              borderColor: Colors.grey,
              borderWidth: 2,
              height: percent(100),
            }}
            variant="outlined"
            onClick={() => onSubmit(response[language.iso])}
          >
            <JsonLanguageBlock
              variant="h2"
              color="text.secondary"
              value={response}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsResponse {
  question: QuestionSolo;
  response: ResponseSolo;
}

export const QcmResponseBlock = ({ question, response }: PropsResponse) => {
  const { language } = useUser();
  const value = response.response[language.iso]
    ? response.response[language.iso]
    : response.response["fr-FR"];

  return (
    <Grid container spacing={1}>
      {question.responses.map((r, index) => {
        const xs = question.image ? 6 : 12;
        const isCorrectResponse = Array.isArray(value)
          ? value.includes(r[language.iso])
          : value === r[language.iso];
        const isMyAnswer = response.answer === r[language.iso];
        const color = isCorrectResponse
          ? Colors.green2
          : isMyAnswer
          ? Colors.red2
          : Colors.grey;
        return (
          <Grid item xs={xs} key={index}>
            <Paper
              sx={{
                p: "15px 5px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
                height: percent(100),
              }}
              variant="outlined"
            >
              <JsonLanguageBlock
                variant="h2"
                value={r}
                color={"text.secondary"}
              />
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

interface PropsQcmBlockDuel {
  question: QuestionDuel;
  onSubmit: (value: string) => void;
  responseMe: undefined | ResponseDuel;
  responseAdv: undefined | ResponseDuel;
  isPlayer1: boolean;
  response?: Response;
}

export const QcmBlockDuelBlock = ({
  question,
  onSubmit,
  responseMe,
  responseAdv,
  response,
  isPlayer1,
}: PropsQcmBlockDuel) => {
  const { language } = useUser();
  const xs = question.image ? 6 : 12;
  const value = response
    ? response.response[language.iso]
      ? response.response[language.iso]
      : response.response["fr-FR"]
    : undefined;
  const hasAnswer = responseMe !== undefined;

  return (
    <Grid container spacing={1}>
      {question.responses.map((res, index) => {
        const isCorrectResponse = Array.isArray(value)
          ? value.includes(res[language.iso])
          : value === res[language.iso];

        const isMyAnswer =
          responseMe !== undefined && res[language.iso] === responseMe.answer;
        const isAnswerAdv =
          responseAdv !== undefined && res[language.iso] === responseAdv.answer;

        let color = Colors.grey;
        if (isCorrectResponse) {
          color = Colors.green;
        } else if (isMyAnswer) {
          color = responseMe.result ? Colors.green : Colors.red;
        } else if (isAnswerAdv && hasAnswer) {
          color = responseAdv.result ? Colors.green : Colors.red;
        }

        const isArrowRight =
          (isPlayer1 && isMyAnswer) || (!isPlayer1 && isAnswerAdv && hasAnswer);
        const isArrowLeft =
          (!isPlayer1 && isMyAnswer) || (isPlayer1 && isAnswerAdv && hasAnswer);

        return (
          <Grid item xs={xs} key={index}>
            <Paper
              sx={{
                p: "15px 8px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: hasAnswer ? "default" : "pointer",
                borderColor: color,
                borderWidth: 2,
                backgroundColor: color,
                height: percent(100),
              }}
              onClick={() => {
                if (!hasAnswer) {
                  onSubmit(res[language.iso]);
                }
              }}
            >
              {isArrowRight && (
                <ArrowRightIcon
                  viewBox="10 7 5 10"
                  sx={{
                    fontSize: 10,
                    position: "absolute",
                    top: percent(50),
                    translate: "0 -50%",
                    left: 0,
                    color: Colors.white,
                  }}
                />
              )}
              <JsonLanguageBlock
                variant="h2"
                color="text.secondary"
                value={res}
              />
              {isArrowLeft && (
                <ArrowLeftIcon
                  viewBox="10 7 5 10"
                  sx={{
                    fontSize: 10,
                    position: "absolute",
                    top: percent(50),
                    translate: "0 -50%",
                    right: 0,
                    color: Colors.white,
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
