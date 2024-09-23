import { Box } from "@mui/material";
import { important, percent, px } from "csx";
import { useMemo } from "react";
import { QuestionDuel, QuestionSolo } from "src/models/Question";
import { ImageQuestionBlock } from "./ImageBlock";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CircularLoading } from "./Loading";
import { SoundBar } from "./SoundBar";
import { Timer } from "./Timer";
import { hasBorderImage } from "src/utils/theme";
import { MapPositionBlock } from "./MapPositionBlock";

interface PropsSolo {
  question?: QuestionSolo;
  timer?: number;
}

export const QuestionSoloBlock = ({ question, timer }: PropsSolo) => {
  const image = useMemo(
    () => (question ? question.image : undefined),
    [question]
  );
  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );

  return (
    <Box
      sx={{
        width: percent(100),
        flexGrow: 1,
        flex: "1 1 0",
        display: "flex",
        minHeight: 0,
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
            color="text.secondary"
            sx={{ fontSize: important(px(30)) }}
            value={question.question}
          />
          {image && (
            <Box
              sx={{
                flexGrow: 1,
                flex: "1 1 0",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                width: percent(100),
              }}
            >
              <ImageQuestionBlock src={image} border={border} />
            </Box>
          )}
          {question.typequestion === "MAPPOSITION" &&
            question.data !== null && (
              <MapPositionBlock
                code={question.data.code}
                url={question.data.map}
              />
            )}
          {question.audio && <SoundBar />}
          {question.extra && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 18,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          )}
          <Box
            sx={{
              width: percent(100),
              pb: px(3),
            }}
          >
            <Timer time={timer} />
          </Box>
        </>
      ) : (
        <CircularLoading />
      )}
    </Box>
  );
};

interface PropsTraining {
  question?: QuestionSolo;
}

export const QuestionTrainingBlock = ({ question }: PropsTraining) => {
  const image = useMemo(
    () => (question ? question.image : undefined),
    [question]
  );
  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );

  return (
    <Box
      sx={{
        width: percent(100),
        flexGrow: 1,
        flex: "1 1 0",
        display: "flex",
        minHeight: 0,
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
            color="text.secondary"
            sx={{ fontSize: important(px(30)) }}
            value={question.question}
          />
          {image && (
            <Box
              sx={{
                flexGrow: 1,
                flex: "1 1 0",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                width: percent(100),
              }}
            >
              <ImageQuestionBlock src={image} border={border} />
            </Box>
          )}
          {question.typequestion === "MAPPOSITION" &&
            question.data !== null && (
              <MapPositionBlock
                code={question.data.code}
                url={question.data.map}
              />
            )}
          {question.audio && <SoundBar />}
          {question.extra && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 18,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          )}
        </>
      ) : (
        <CircularLoading />
      )}
    </Box>
  );
};

interface PropsDuel {
  question?: QuestionDuel;
}

export const QuestionDuelBlock = ({ question }: PropsDuel) => {
  const image = useMemo(
    () => (question ? question.image : undefined),
    [question]
  );
  const border = useMemo(
    () => (question ? hasBorderImage(question.theme.id) : false),
    [question]
  );
  return (
    <Box
      sx={{
        width: percent(100),
        flexGrow: 1,
        flex: "1 1 0",
        display: "flex",
        minHeight: 0,
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
            color="text.secondary"
            sx={{ fontSize: important(px(30)) }}
            value={question.question}
          />
          {question.extra && (
            <JsonLanguageBlock
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: 18,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          )}
          {image && (
            <Box
              sx={{
                flexGrow: 1,
                flex: "1 1 0",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                width: percent(100),
              }}
            >
              <ImageQuestionBlock src={image} border={border} />
            </Box>
          )}
          {question.typequestion === "MAPPOSITION" &&
            question.data !== null && (
              <MapPositionBlock
                code={question.data.code}
                url={question.data.map}
              />
            )}
          {question.audio && <SoundBar />}
        </>
      ) : (
        <CircularLoading />
      )}
    </Box>
  );
};
