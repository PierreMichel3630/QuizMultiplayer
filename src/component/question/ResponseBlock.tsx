import { Box, Paper, Typography } from "@mui/material";
import { important, percent, px, viewHeight } from "csx";
import { Colors } from "src/style/Colors";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { TypeQuestionEnum } from "src/models/enum/TypeQuestionEnum";
import { TypeResponseEnum } from "src/models/enum/TypeResponseEnum";
import { JsonLanguage } from "src/models/Language";
import { Question } from "src/models/Question";
import { ExtraResponse } from "src/models/Response";
import { ArrowLeft, ArrowRight } from "../icon/Arrow";
import { ImageQCMBlock } from "../ImageBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { ExtraResponseBlock } from "../response/ExtraResponseBlock";

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
  responsePlayer1?: string | number;
  responsePlayer2?: string | number;
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
  const { mode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const [hasAnswer, setHasAnswer] = useState(false);

  useEffect(() => {
    setHasAnswer(false);
  }, [question]);

  const isQuestionOrder = useMemo(
    () => question.typequestion === TypeQuestionEnum.ORDER,
    [question]
  );

  const hasImage = useMemo(
    () => question.image ?? question.typequestion === "MAPPOSITION",
    [question]
  );

  const columns = useMemo(() => {
    const responsesImage = [...question.responses].filter((el) => el.image);
    const isPairResponses = question.responses.length % 2 === 0;
    return question.typequestion !== TypeQuestionEnum.ORDER &&
      (hasImage || responsesImage.length > 0) &&
      isPairResponses
      ? 2
      : 1;
  }, [question, hasImage]);

  const rows = useMemo(() => {
    return question.responses.length / columns;
  }, [question.responses.length, columns]);

  return (
    <Box
      sx={{
        width: percent(100),
        maxHeight: isQuestionOrder ? "auto" : viewHeight(50),
        flexGrow: isQuestionOrder ? 1 : "initial",
        flex: isQuestionOrder ? "1 1 0" : "initial",
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
        const colorOrder = index === 0 ? Colors.blue4 : Colors.pink2;
        const colorBase = isDarkMode ? Colors.black2 : Colors.white;

        let color: string = isQuestionOrder ? colorOrder : colorBase;
        const arrowColor: string = isDarkMode ? Colors.white : Colors.black2;
        let borderColor: string = isDarkMode ? Colors.white : Colors.black2;
        if (isCorrectResponse) {
          color = Colors.correctanswer;
          borderColor = Colors.correctanswerborder;
        } else if ((isAnswerP1 || isAnswerP2) && response !== undefined) {
          color = Colors.wronganswer;
          borderColor = Colors.wronganswerborder;
        } else if ((isAnswerP1 || isAnswerP2) && response === undefined) {
          color = Colors.waitanswer;
          borderColor = Colors.waitanswerborder;
        }

        return (
          <ResponseQCMBlock
            key={index}
            color={color}
            borderColor={borderColor}
            index={index}
            label={r.label}
            extra={response ? r.extra : undefined}
            image={r.image}
            answer1={isAnswerP1}
            answer2={isAnswerP2}
            hasAnswer={hasAnswer}
            arrowColor={arrowColor}
            type={
              isQuestionOrder
                ? TypeResponseEnum.ORDER
                : TypeResponseEnum.DEFAULT
            }
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
  extra?: ExtraResponse;
  borderColor?: string;
  arrowColor?: string;
  index: number;
  answer1: boolean;
  answer2: boolean;
  hasAnswer: boolean;
  type: TypeResponseEnum;
  onSubmit: (value: Answer) => void;
}

export const ResponseQCMBlock = ({
  index,
  color,
  borderColor = Colors.white,
  image,
  label,
  extra,
  answer1 = false,
  answer2 = false,
  hasAnswer = false,
  type = TypeResponseEnum.DEFAULT,
  arrowColor = Colors.white,
  onSubmit,
}: ResponseQCMBlockProps) => {
  const padding = type === TypeResponseEnum.DEFAULT && !image ? "4px 12px" : 0;
  const isOrder = type === TypeResponseEnum.ORDER;
  const backgroundImage = isOrder ? image : undefined;
  const textShadow = isOrder ? "1px 1px 10px black" : "none";
  const imageDisplay = isOrder ? undefined : image;
  return (
    <Paper
      key={index}
      sx={{
        p: padding,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: color,
        borderColor: borderColor,
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderWidth: isOrder ? 10 : 1,
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
          <ArrowRight size={18} color={arrowColor} />
        </Box>
      )}
      {imageDisplay && <ImageQCMBlock src={imageDisplay} />}
      <Box>
        {label && (
          <JsonLanguageBlock
            variant="h3"
            component="p"
            value={label}
            sx={{
              color: isOrder ? Colors.white : "auto",
              wordBreak: "break-word",
              textShadow: textShadow,
              fontSize: isOrder ? important(px(40)) : "initial",
            }}
          />
        )}
        {extra && <ExtraResponseBlock extra={extra} />}
      </Box>
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
          <ArrowLeft size={18} color={arrowColor} />
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
      : response.response[language.iso] ?? response.response["fr-FR"];

  const label = Array.isArray(value) ? value[0] ?? "" : value;

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: response.result
          ? Colors.correctanswer
          : Colors.wronganswer,
        borderRadius: px(5),
        textAlign: "center",
        width: percent(100),
        userSelect: "none",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: response.result
          ? Colors.correctanswerborder
          : Colors.wronganswerborder,
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
