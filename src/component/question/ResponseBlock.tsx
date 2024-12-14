import { Box, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { JsonLanguage } from "src/models/Language";
import { Question } from "src/models/Question";
import { ResponseDuel } from "src/models/Response";
import { ImageQCMBlock } from "../ImageBlock";
import {
  JsonLanguageArrayOrStringBlock,
  JsonLanguageBlock,
} from "../JsonLanguageBlock";
import { InputResponseBlock } from "./InputResponseBlock";

export interface ResponseLanguage {
  [iso: string]: Array<string> | string;
}

export interface ResponseLanguageString {
  [iso: string]: string;
}

export interface Answer {
  value: string | number;
  exact: boolean;
}

export interface Response {
  response: number | ResponseLanguage;
  result: boolean;
  answer: number | string;
}

interface ResponsesQCMBlockProps {
  question: Question;
  onSubmit: (value: Answer) => void;
  myresponse: string | number | undefined;
  response?: Response;
}

export const ResponsesQCMBlock = ({
  question,
  myresponse,
  response,
  onSubmit,
}: ResponsesQCMBlockProps) => {
  const [hasAnswer, setHasAnswer] = useState(false);

  useEffect(() => {
    setHasAnswer(false);
  }, [question]);

  const hasImage = useMemo(
    () => question.image || question.typequestion === "MAPPOSITION",
    [question]
  );

  const columns = useMemo(() => {
    const responsesImage = [...question.responses].filter((el) => el.image);
    return hasImage || responsesImage.length > 0 ? 2 : 1;
  }, [question, hasImage]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  return (
    <Box
      sx={
        hasImage
          ? {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: px(6 / columns),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
              mb: 1,
            }
          : {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "flex-end",
              gap: px(6 / columns),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
              mb: 1,
            }
      }
    >
      {question.responses.map((r, index) => {
        const isCorrectResponse =
          response && Number(response.response) === index;
        const isMyAnswer =
          (response && Number(response.answer) === index) ||
          Number(myresponse) === index;
        let color: string = Colors.black2;
        if (isCorrectResponse) {
          color = Colors.correctanswer;
        } else if (isMyAnswer && response !== undefined) {
          color = Colors.wronganswer;
        } else if (isMyAnswer && response === undefined) {
          color = Colors.waitanswer;
        }

        return (
          <ResponseQCMBlock
            color={color}
            index={index}
            label={r.label}
            image={r.image}
            answer1={false}
            answer2={false}
            hasAnswer={hasAnswer}
            onSubmit={(value) => {
              setHasAnswer(true);
              onSubmit(value);
            }}
          />
        );
      })}
    </Box>
  );
};

interface ResponseQCMBlockProps {
  color: string;
  image?: string;
  label?: JsonLanguage;
  index: number;
  answer1: boolean;
  answer2: boolean;
  hasAnswer: boolean;
  onSubmit: (value: Answer) => void;
}

export const ResponseQCMBlock = ({
  index,
  color,
  image,
  label,
  answer1 = false,
  answer2 = false,
  hasAnswer = false,
  onSubmit,
}: ResponseQCMBlockProps) => {
  return (
    <Paper
      key={index}
      sx={{
        p: image ? 0 : "4px 12px",
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
          cursor: "pointer",
        },
        minHeight: px(50),
      }}
      variant="outlined"
      onClick={(event) => {
        event.preventDefault();
        if (!hasAnswer) {
          onSubmit({
            value: index,
            exact: true,
          });
        }
      }}
    >
      {answer1 && (
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
      {image && <ImageQCMBlock src={image} />}
      {label && (
        <JsonLanguageBlock
          variant="h3"
          value={label}
          sx={{ wordBreak: "break-word", color: Colors.white }}
        />
      )}
      {answer2 && (
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
};

interface ResponseInputBlockProps {
  response: Response;
}

export const ResponseInputBlock = ({ response }: ResponseInputBlockProps) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const value =
    typeof response.response === "number"
      ? response.response
      : response.response[language.iso]
      ? response.response[language.iso]
      : response.response["fr-FR"];

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
  onSubmit: (value: Answer) => void;
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
        <InputResponseBlock onSubmit={onSubmit} />
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
