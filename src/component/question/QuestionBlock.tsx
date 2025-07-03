import { Box } from "@mui/material";
import { important, percent, px } from "csx";
import { ImageQuestionBlock } from "../ImageBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { CircularLoading } from "../Loading";
import { MapPositionBlock } from "../MapPositionBlock";
import { SoundBar } from "../SoundBar";
import { Timer } from "../time/Timer";
import { Question } from "src/models/Question";
import { useMemo } from "react";
import { TypeQuestionEnum } from "src/models/enum/TypeQuestionEnum";
import { Answer } from "./ResponseBlock";

interface Props {
  question: Question;
  timer?: number;
  onSubmit?: (value: Answer) => void;
}

export const QuestionBlock = ({ question, timer, onSubmit }: Props) => {
  const isQuestionOrder = useMemo(
    () => question.typequestion === TypeQuestionEnum.ORDER,
    [question]
  );
  return (
    <Box
      sx={{
        width: percent(100),
        flexGrow: isQuestionOrder ? "initial" : 1,
        flex: isQuestionOrder ? "initial" : "1 1 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {question ? (
        <>
          <JsonLanguageBlock
            variant="h2"
            sx={{ fontSize: important(px(30)), wordBreak: "break-word" }}
            value={question.question}
          />
          {question.image && (
            <Box
              sx={{
                flexGrow: 1,
                flex: "1 1 0",
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: percent(100),
              }}
            >
              <ImageQuestionBlock src={question.image} />
            </Box>
          )}
          {question.typequestion === "MAPPOSITION" &&
            question.data !== null && <MapPositionBlock data={question.data} />}
          {question.audio && <SoundBar />}
          {question.extra && (
            <JsonLanguageBlock
              variant="caption"
              sx={{
                fontSize: 18,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          )}
          {timer && (
            <Box
              sx={{
                width: percent(100),
                pb: px(3),
              }}
            >
              <Timer
                time={timer}
                end={() => {
                  if (onSubmit) onSubmit({ value: undefined, exact: true });
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <CircularLoading />
      )}
    </Box>
  );
};
