import { Box, Grid, Paper } from "@mui/material";
import { Response, ResponseDuel, ResponseSolo } from "src/models/Response";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

import { percent } from "csx";
import { Question, QuestionDuel, QuestionSolo } from "src/models/Question";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useEffect, useState } from "react";
import { ImageQCMBlock } from "./ImageBlock";

interface Props {
  question: QuestionSolo;
  onSubmit: (value: string | number) => void;
}

export const QcmBlock = ({ question, onSubmit }: Props) => {
  return (
    <Grid container spacing={1}>
      {question.responses.map((response, index) => (
        <Grid item xs={6} key={index}>
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
            onClick={() => onSubmit(index)}
          >
            {response.image && <ImageQCMBlock src={response.image} />}
            {response.label && (
              <JsonLanguageBlock
                variant="h2"
                color="text.secondary"
                value={response.label}
              />
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsResponse {
  question: QuestionSolo;
  response?: ResponseSolo;
  onSubmit: (value: string | number) => void;
}

export const QcmResponseBlock = ({
  question,
  response,
  onSubmit,
}: PropsResponse) => {
  const [isClick, setIsClick] = useState(false);
  useEffect(() => {
    setIsClick(response !== undefined ? true : false);
  }, [response]);

  return (
    <Box
      sx={
        question.type === "IMAGE"
          ? {
              width: percent(100),
              flexGrow: 1,
              flex: "1 1 0",
              minHeight: 0,
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "flex-end",
              gap: 1,
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gridAutoRows: "minmax(80px, auto)",
            }
          : {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: 1,
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gridAutoRows: "minmax(80px, auto)",
            }
      }
    >
      {question.responses.map((r, index) => {
        const isCorrectResponse =
          response && Number(response.response) === index;
        const isMyAnswer = response && Number(response.answer) === index;
        const color = isCorrectResponse
          ? Colors.green2
          : isMyAnswer
          ? Colors.red2
          : Colors.grey;

        return (
          <Paper
            key={index}
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
              cursor: response ? "default" : "pointer",
            }}
            variant="outlined"
            onClick={() => {
              if (!response && !isClick) {
                setIsClick(true);
                onSubmit(index);
              }
            }}
          >
            {r.image && <ImageQCMBlock src={r.image} />}
            {r.label && (
              <JsonLanguageBlock
                variant="h2"
                value={r.label}
                color={"text.secondary"}
              />
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

interface PropsQcmBlockDuel {
  question: QuestionDuel;
  onSubmit: (value: number) => void;
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
  const hasAnswer = responseMe !== undefined;
  const [isClick, setIsClick] = useState(false);
  useEffect(() => {
    setIsClick(
      response !== undefined || responseMe !== undefined ? true : false
    );
  }, [response, responseMe]);

  return (
    <Box
      sx={
        question.type === "IMAGE"
          ? {
              width: percent(100),
              flexGrow: 1,
              flex: "1 1 0",
              minHeight: 0,
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "flex-end",
              gap: 1,
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gridAutoRows: "minmax(80px, auto)",
            }
          : {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: 1,
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gridAutoRows: "minmax(80px, auto)",
            }
      }
    >
      {question.responses.map((res, index) => {
        const isCorrectResponse =
          response && Number(response.response) === index;

        const isMyAnswer =
          responseMe !== undefined && index === responseMe.answer;
        const isAnswerAdv =
          responseAdv !== undefined && index === responseAdv.answer;

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
            key={index}
            onClick={() => {
              if (!hasAnswer && !isClick) {
                setIsClick(true);
                onSubmit(index);
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
            {res.image && <ImageQCMBlock src={res.image} />}
            {res.label && (
              <JsonLanguageBlock
                variant="h2"
                value={res.label}
                color={"text.secondary"}
              />
            )}
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
        );
      })}
    </Box>
  );
};

interface PropsQcmBlockDuelResultBlock {
  question: Question;
}

export const QcmBlockDuelResultBlock = ({
  question,
}: PropsQcmBlockDuelResultBlock) => {
  const xs = 6;
  const response = question.response;

  const responsePlayer1 = question.responsePlayer1;
  const responsePlayer2 = question.responsePlayer2;

  return (
    <Grid container spacing={1}>
      {question.responses.map((res, index) => {
        const isCorrectResponse = Number(response) === index;

        const isArrowRight =
          responsePlayer1 !== undefined && Number(responsePlayer1) === index;
        const isArrowLeft =
          responsePlayer2 !== undefined && Number(responsePlayer2) === index;

        let color = Colors.grey;
        if (isCorrectResponse) {
          color = Colors.green;
        } else if (isArrowRight || isArrowLeft) {
          color = Colors.red;
        }

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
                cursor: "default",
                borderColor: color,
                borderWidth: 2,
                backgroundColor: color,
                height: percent(100),
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
              {res.image && <ImageQCMBlock src={res.image} />}
              {res.label && (
                <JsonLanguageBlock
                  variant="h2"
                  color="text.secondary"
                  value={res.label}
                />
              )}
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
