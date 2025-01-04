import { Box, Paper, Typography } from "@mui/material";
import { percent, px, viewHeight } from "csx";
import { Colors } from "src/style/Colors";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { JsonLanguage } from "src/models/Language";
import { Question } from "src/models/Question";
import { ImageQCMBlock } from "../ImageBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { ArrowLeft, ArrowRight } from "../icon/Arrow";

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
  responseplayer1?: string | number;
  responseplayer2?: string | number;
}

interface ResponsesQCMBlockProps {
  question: Question;
  onSubmit: (value: Answer) => void;
  responseplayer1?: string | number;
  responseplayer2?: string | number;
  response?: Response;
}

export const ResponsesQCMBlock = ({
  question,
  responseplayer1,
  responseplayer2,
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
      sx={{
        width: percent(100),
        maxHeight: viewHeight(50),
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: hasImage ? "center" : "flex-end",
        gap: px(6 / columns),
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        mb: 1,
      }}
    >
      {question.responses.map((r, index) => {
        const isCorrectResponse =
          response && Number(response.response) === index;
        const isAnswerP1 = Number(responseplayer1) === index;
        const isAnswerP2 = Number(responseplayer2) === index;
        let color: string = Colors.black2;
        if (isCorrectResponse) {
          color = Colors.correctanswer;
        } else if ((isAnswerP1 || isAnswerP2) && response !== undefined) {
          color = Colors.wronganswer;
        } else if ((isAnswerP1 || isAnswerP2) && response === undefined) {
          color = Colors.waitanswer;
        }

        return (
          <ResponseQCMBlock
            key={index}
            color={color}
            index={index}
            label={r.label}
            image={r.image}
            answer1={isAnswerP1}
            answer2={isAnswerP2}
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
        <Box
          sx={{
            position: "absolute",
            top: percent(50),
            translate: "0 -50%",
            left: 0,
            display: "flex",
          }}
        >
          <ArrowRight size={18} />
        </Box>
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
        <Box
          sx={{
            position: "absolute",
            top: percent(50),
            translate: "0 -50%",
            right: 0,
            display: "flex",
          }}
        >
          <ArrowLeft size={18} />
        </Box>
      )}
    </Paper>
  );
};

interface ResponseInputBlockProps {
  response: Response;
  responseplayer1?: string | number;
  responseplayer2?: string | number;
}

export const ResponseInputBlock = ({
  response,
  responseplayer1,
  responseplayer2,
}: ResponseInputBlockProps) => {
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
      {responseplayer1 && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: percent(50),
              translate: "0 -50%",
              left: 0,
              display: "flex",
            }}
          >
            <ArrowRight size={18} />
          </Box>
          <Typography variant="h2" color="text.secondary">
            {responseplayer1}
          </Typography>
        </Box>
      )}
      {responseplayer2 && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: percent(50),
              translate: "0 -50%",
              right: 0,
              display: "flex",
            }}
          >
            <ArrowLeft size={18} />
          </Box>
          <Typography variant="h2" color="text.secondary">
            {responseplayer2}
          </Typography>
        </Box>
      )}

      <Typography variant="h4" color="text.secondary" component="span">
        {t("commun.goodresponse")} :{" "}
      </Typography>
      <Typography variant="h2" color="text.secondary" component="span">
        {label}
      </Typography>
    </Paper>
  );
};
