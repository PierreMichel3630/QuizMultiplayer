import { Box, Typography } from "@mui/material";
import { important, padding, percent, px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { colorDifficulty, Difficulty } from "src/models/enum/DifficultyEnum";
import { TypeQuestionEnum } from "src/models/enum/TypeQuestionEnum";
import { Question } from "src/models/Question";
import { ImageQuestionBlock } from "../ImageBlock";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { TextLabelBlock, TextNameBlock } from "../language/TextLanguageBlock";
import { CircularLoading } from "../Loading";
import { MapPositionBlock } from "../MapPositionBlock";
import { SoundBar } from "../SoundBar";
import { Timer } from "../time/Timer";
import { ExtraQuestionBlock } from "./ExtraQuestionBlock";
import { AnswerUser } from "./ResponseBlock";
import { Colors } from "src/style/Colors";

interface Props {
  question: Question;
  timer?: number;
  onSubmit?: (value: AnswerUser) => void;
}

export const QuestionBlock = ({ question, timer, onSubmit }: Props) => {
  const { uuid } = useUser();
  const isQuestionOrder = useMemo(
    () => question.typequestion === TypeQuestionEnum.ORDER,
    [question],
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
      {question && <HeaderBlock question={question} />}
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
            <TextLabelBlock
              variant="h2"
              sx={{ fontSize: important(px(25)), wordBreak: "break-word" }}
              values={question.questiontranslation}
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
              question.data !== null && (
                <MapPositionBlock data={question.data} />
              )}
            {question.audio && <SoundBar />}
            <ExtraQuestionBlock
              questiontranslation={question.questiontranslation}
            />
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
                    if (onSubmit) onSubmit({ uuid: uuid, value: undefined });
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <CircularLoading />
        )}
      </Box>
    </Box>
  );
};

interface DifficultyBlockProps {
  difficulty: Difficulty;
}
const DifficultyBlock = ({ difficulty }: DifficultyBlockProps) => {
  const { t } = useTranslation();

  const color = useMemo(() => {
    return colorDifficulty[difficulty];
  }, [difficulty]);

  return (
    <Box
      sx={{
        backgroundColor: color,
        borderRadius: px(40),
        p: padding(2, 8),
      }}
    >
      <Typography variant="h6">{t(`enum.difficulty.${difficulty}`)}</Typography>
    </Box>
  );
};

interface ThemeBlockProps {
  question: Question;
}
const HeaderBlock = ({ question }: ThemeBlockProps) => {
  const isDisplay = useMemo(
    () => question.theme !== null && question.category,
    [question],
  );

  const color = useMemo(
    () => (question.theme ? question.theme.color : Colors.black),
    [question],
  );

  return (
    isDisplay && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: "2px solid white",
          width: percent(100),
          borderRadius: px(10),
          backgroundColor: `color-mix(in srgb, ${color} 30%, white)`,
          p: padding(5, 10),
        }}
      >
        <ImageThemeBlock theme={question.theme} size={40} border={false} />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <TextNameBlock
            variant="h4"
            sx={{
              overflow: "hidden",
              display: "block",
              lineClamp: 1,
              boxOrient: "vertical",
              color: `color-mix(in srgb, ${color} 80%, black)`,
            }}
            noWrap
            values={question.category.categorytranslation}
          />
          <TextNameBlock
            variant="body1"
            sx={{
              overflow: "hidden",
              display: "block",
              lineClamp: 1,
              boxOrient: "vertical",
              color: `color-mix(in srgb, ${color} 80%, black)`,
            }}
            noWrap
            values={question.theme.themetranslation}
          />
        </Box>
        <DifficultyBlock difficulty={question.difficulty} />
      </Box>
    )
  );
};
