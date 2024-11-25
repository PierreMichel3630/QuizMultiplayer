import { Box, Grid, Paper } from "@mui/material";
import {
  MyResponse,
  Response,
  ResponseDuel,
  ResponseSolo,
  ResponseTraining,
} from "src/models/Response";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

import { percent, px } from "csx";
import {
  Question,
  QuestionDuel,
  QuestionSolo,
  QuestionTraining,
} from "src/models/Question";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useEffect, useMemo, useState } from "react";
import { ImageQCMBlock } from "./ImageBlock";
import { hasBorderImage } from "src/utils/theme";

interface Props {
  question: QuestionSolo;
  onSubmit: (value: string | number) => void;
}

export const QcmBlock = ({ question, onSubmit }: Props) => {
  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );
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
              borderColor: Colors.white,
              borderWidth: 1,
              borderStyle: "solid",
              height: percent(100),
            }}
            variant="outlined"
            onClick={() => onSubmit(index)}
          >
            {response.image && (
              <ImageQCMBlock src={response.image} border={border} />
            )}
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
  myresponse: string | number | undefined;
  question: QuestionSolo;
  response?: ResponseSolo;
  onSubmit: (value: MyResponse) => void;
}

export const QcmResponseBlock = ({
  question,
  response,
  onSubmit,
  myresponse,
}: PropsResponse) => {
  const [isClick, setIsClick] = useState(false);
  useEffect(() => {
    setIsClick(response !== undefined ? true : false);
  }, [response]);

  const columns = useMemo(() => {
    const modulo = question.responses.length % 2;
    return modulo === 0 ? 2 : 1;
  }, [question.responses.length]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );

  const isTypeImage = useMemo(
    () => question.typequestion === "IMAGE",
    [question.typequestion]
  );

  return (
    <Box
      sx={
        isTypeImage
          ? {
              width: percent(100),
              flexGrow: 1,
              flex: "1 1 0",
              minHeight: 0,
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "flex-end",
              gap: px(4),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
              gridAutoRows: "minmax(80px, auto)",
            }
          : {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: px(4),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
            }
      }
    >
      {question.responses.map((r, index) => {
        const isCorrectResponse =
          response && Number(response.response) === index;
        const isMyAnswer =
          (response && Number(response.answer) === index) ||
          Number(myresponse) === index;
        let color = Colors.grey;
        if (isCorrectResponse) {
          color = Colors.green2;
        } else if (isMyAnswer && response !== undefined) {
          color = Colors.red2;
        } else if (isMyAnswer && response === undefined) {
          color = Colors.grey4;
        }

        return (
          <Paper
            key={index}
            sx={{
              p: isTypeImage && !isMyAnswer ? 0 : "4px 12px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: color,
              borderColor: Colors.white,
              borderWidth: 1,
              borderStyle: "solid",
              height: percent(100),
              userSelect: "none",
              "&:hover": {
                cursor: response || myresponse ? "default" : "pointer",
              },
              minHeight: px(50),
            }}
            variant="outlined"
            onClick={(event) => {
              event.preventDefault();
              if (!response && !isClick) {
                setIsClick(true);
                onSubmit({
                  value: index,
                  exact: true,
                });
              }
            }}
          >
            {isMyAnswer && (
              <ArrowRightIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  left: 0,
                  color: Colors.white,
                }}
              />
            )}
            {r.image && <ImageQCMBlock src={r.image} border={border} />}
            {r.label && (
              <JsonLanguageBlock
                variant="h3"
                value={r.label}
                color={"text.secondary"}
                sx={{ wordBreak: "break-word" }}
              />
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

interface PropsResponseTraining {
  myresponse: string | number | undefined;
  question: QuestionTraining;
  response?: ResponseTraining;
  onSubmit: (value: MyResponse) => void;
}

export const QcmResponseTrainingBlock = ({
  question,
  response,
  onSubmit,
  myresponse,
}: PropsResponseTraining) => {
  const [isClick, setIsClick] = useState(false);
  useEffect(() => {
    setIsClick(response !== undefined ? true : false);
  }, [response]);

  const columns = useMemo(() => {
    const modulo = question.responses.length % 2;
    return modulo === 0 ? 2 : 1;
  }, [question.responses.length]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );

  const isTypeImage = useMemo(
    () => question.typequestion === "IMAGE",
    [question.typequestion]
  );

  return (
    <Box
      sx={
        isTypeImage
          ? {
              width: percent(100),
              flexGrow: 1,
              flex: "1 1 0",
              minHeight: 0,
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "flex-end",
              gap: px(4),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
              gridAutoRows: "minmax(80px, auto)",
            }
          : {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: px(4),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
            }
      }
    >
      {question.responses.map((r, index) => {
        const isCorrectResponse =
          response && Number(response.response) === index;
        const isMyAnswer =
          (response && Number(response.answer) === index) ||
          Number(myresponse) === index;
        let color = Colors.grey;
        if (isCorrectResponse) {
          color = Colors.green2;
        } else if (isMyAnswer && response !== undefined) {
          color = Colors.red2;
        } else if (isMyAnswer && response === undefined) {
          color = Colors.grey4;
        }

        return (
          <Paper
            key={index}
            sx={{
              p: isTypeImage && !isMyAnswer ? 0 : "4px 12px",
              minHeight: px(50),
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderColor: Colors.white,
              borderWidth: 1,
              borderStyle: "solid",
              backgroundColor: color,
              height: percent(100),
              userSelect: "none",
              "&:hover": {
                cursor: response || myresponse ? "default" : "pointer",
              },
            }}
            variant="outlined"
            onClick={() => {
              if (!response && !isClick) {
                setIsClick(true);
                onSubmit({
                  value: index,
                  exact: true,
                });
              }
            }}
          >
            {isMyAnswer && (
              <ArrowRightIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  left: 0,
                  color: Colors.white,
                }}
              />
            )}
            {r.image && <ImageQCMBlock src={r.image} border={border} />}
            {r.label && (
              <JsonLanguageBlock
                variant="h3"
                value={r.label}
                color={"text.secondary"}
                sx={{ wordBreak: "break-word" }}
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

  const columns = useMemo(() => {
    const modulo = question.responses.length % 2;
    return modulo === 0 ? 2 : 1;
  }, [question.responses.length]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );

  const isTypeImage = useMemo(
    () => question.typequestion === "IMAGE",
    [question.typequestion]
  );

  return (
    <Box
      sx={
        isTypeImage
          ? {
              width: percent(100),
              flexGrow: 1,
              flex: "1 1 0",
              minHeight: 0,
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "flex-end",
              gap: px(4),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
              gridAutoRows: "minmax(80px, auto)",
            }
          : {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: px(4),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
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

        const isAnswer = hasAnswer && (isMyAnswer || isAnswerAdv);
        const isArrowRight =
          hasAnswer &&
          ((isPlayer1 && isMyAnswer) || (!isPlayer1 && isAnswerAdv));
        const isArrowLeft =
          hasAnswer &&
          ((!isPlayer1 && isMyAnswer) || (isPlayer1 && isAnswerAdv));

        return (
          <Paper
            sx={{
              p: isTypeImage ? (isAnswer ? "4px 12px" : 0) : "4px 12px",
              minHeight: px(50),
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderColor: Colors.white,
              borderWidth: 1,
              borderStyle: "solid",
              backgroundColor: color,
              height: percent(100),
              userSelect: "none",
              "&:hover": {
                cursor: hasAnswer ? "default" : "pointer",
              },
            }}
            key={index}
            onClick={(event) => {
              event.preventDefault();
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
                  fontSize: 15,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  left: 0,
                  color: Colors.white,
                }}
              />
            )}
            {res.image && <ImageQCMBlock src={res.image} border={border} />}
            {res.label && (
              <JsonLanguageBlock
                variant="h3"
                value={res.label}
                color={"text.secondary"}
              />
            )}
            {isArrowLeft && (
              <ArrowLeftIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
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
  const response = question.response;

  const responsePlayer1 = question.responsePlayer1;
  const responsePlayer2 = question.responsePlayer2;

  const columns = useMemo(() => {
    const modulo = question.responses.length % 2;
    return modulo === 0 ? 2 : 1;
  }, [question.responses.length]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        gap: px(4),
      }}
    >
      {question.responses.map((res, index) => {
        const isCorrectResponse = Number(response) === index;

        const isArrowRight =
          responsePlayer1 !== undefined && Number(responsePlayer1) === index;
        const isArrowLeft =
          responsePlayer2 !== undefined && Number(responsePlayer2) === index;

        let color = Colors.grey;
        let borderColor = Colors.white;
        if (isCorrectResponse) {
          color = Colors.green;
          borderColor = Colors.white;
        } else if (isArrowRight || isArrowLeft) {
          color = Colors.red;
          borderColor = Colors.white;
        }

        return (
          <Paper
            key={index}
            sx={{
              p: "4px 10px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "default",
              borderColor: borderColor,
              borderStyle: "solid",
              borderWidth: 1,
              backgroundColor: color,
              height: percent(100),
              userSelect: "none",
              minHeight: px(50),
            }}
          >
            {isArrowRight && (
              <ArrowRightIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  left: 0,
                  color: Colors.white,
                }}
              />
            )}
            {res.image && (
              <ImageQCMBlock src={res.image} border={border} width={150} />
            )}
            {res.label && (
              <JsonLanguageBlock
                variant="h3"
                color="text.secondary"
                value={res.label}
              />
            )}
            {isArrowLeft && (
              <ArrowLeftIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
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
