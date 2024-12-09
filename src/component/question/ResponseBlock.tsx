import { Box, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { ImageQCMBlock } from "../ImageBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { JsonLanguage } from "src/models/Language";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { useMemo } from "react";
import { Point } from "react-simple-maps";
import { Theme } from "src/models/Theme";

export interface Question {
  image?: string;
  audio?: string;
  extra?: JsonLanguage;
  question: JsonLanguage;
  typequestion: "DEFAULT" | "ORDER" | "IMAGE" | "MAPPOSITION";
  time: number;
  difficulty: string;
  theme: Theme;
  isqcm: boolean;
  responses: Array<ResponseQCM>;
  allresponse?: boolean;
  typeResponse: string;
  data: null | {
    code: string;
    property: string;
    zoom: number;
    coordinates: Point;
  };
}

export interface ResponseLanguage {
  [iso: string]: Array<string> | string;
}

export interface ResponseLanguageString {
  [iso: string]: string;
}

export interface Answer {
  value: number;
  exact: boolean;
}

export interface Response {
  response: number | ResponseLanguage;
  result: boolean;
  answer: number | string;
}

export interface ResponseQCM {
  label?: ResponseLanguageString;
  image?: string;
}

export interface MyResponse {
  value: string | number;
  exact: boolean;
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
  const columns = useMemo(() => {
    const responsesImage = [...question.responses].filter((el) => el.image);
    return question.image !== null || responsesImage.length > 0 ? 2 : 1;
  }, [question]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  return (
    <Box
      sx={
        question.image
          ? {
              width: percent(100),
              flexGrow: 1,
              flex: "1 1 0",
              minHeight: 0,
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "flex-end",
              gap: px(12),
              display: "grid",
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
              gridAutoRows: "minmax(80px, auto)",
              mb: 1,
            }
          : {
              width: percent(100),
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center",
              gap: px(12),
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
        let color: string = Colors.white;
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
            onSubmit={onSubmit}
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
  onSubmit: (value: Answer) => void;
}

export const ResponseQCMBlock = ({
  index,
  color,
  image,
  label,
  answer1 = false,
  answer2 = false,
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
        onSubmit({
          value: index,
          exact: true,
        });
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
          sx={{ wordBreak: "break-word", color: Colors.black }}
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
