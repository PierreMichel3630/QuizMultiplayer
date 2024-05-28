import { Box } from "@mui/material";
import { percent } from "csx";
import { QuestionDuel, QuestionSolo } from "src/models/Question";
import { ImageQuestionBlock } from "./ImageBlock";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CircularLoading } from "./Loading";
import { SoundBar } from "./SoundBar";
import { Timer } from "./Timer";

interface PropsSolo {
  question?: QuestionSolo;
  timer?: number;
}

export const QuestionSoloBlock = ({ question, timer }: PropsSolo) => {
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
            sx={{
              fontSize: question.extra ? 30 : 40,
              mb: question.extra ? 2 : 0,
            }}
            value={question.question}
          />
          {question.image && (
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
              <ImageQuestionBlock src={question.image} />
            </Box>
          )}
          {question.audio && <SoundBar />}
          {question.extra && (
            <JsonLanguageBlock
              variant="h2"
              color="text.secondary"
              sx={{
                fontSize: 20,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          )}
          <Box
            sx={{
              width: percent(100),
              pb: 3,
            }}
          >
            {timer && <Timer time={timer} />}
          </Box>
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
        p: 1,
      }}
    >
      {question ? (
        <>
          <JsonLanguageBlock
            variant="h2"
            color="text.secondary"
            sx={{ fontSize: 40 }}
            value={question.question}
          />
          {question.extra && (
            <JsonLanguageBlock
              variant="h2"
              color="text.secondary"
              sx={{
                fontSize: 20,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          )}
          {question.image && (
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
              <ImageQuestionBlock src={question.image} />
            </Box>
          )}
          {question.audio && <SoundBar />}
        </>
      ) : (
        <CircularLoading />
      )}
    </Box>
  );
};
