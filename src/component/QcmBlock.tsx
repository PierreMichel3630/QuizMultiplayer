import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import { Colors } from "src/style/Colors";
import { ImageQCMBlock } from "./ImageBlock";

import { percent, px } from "csx";
import { QuestionResult } from "src/models/Question";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useUser } from "src/context/UserProvider";
import { ExtraResponseResultBlock } from "./response/ExtraResponseBlock";
import { ResponseBlock } from "./response/ResponseBlock";

interface PropsQcmBlockDuelResultBlock {
  question: QuestionResult;
}

export const QcmBlockDuelResultBlock = ({
  question,
}: PropsQcmBlockDuelResultBlock) => {
  const { mode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);
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
        let color: string = isDarkMode ? Colors.black2 : Colors.white;
        const arrowColor: string = isDarkMode ? Colors.white : Colors.black2;
        let borderColor: string = isDarkMode ? Colors.white : Colors.black2;

        if (isCorrectResponse) {
          color = Colors.correctanswer;
          borderColor = Colors.correctanswerborder;
        } else if (isArrowRight || isArrowLeft) {
          color = Colors.wronganswer;
          borderColor = Colors.wronganswerborder;
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
                  color: arrowColor,
                }}
              />
            )}
            <Box sx={{ width: percent(100) }}>
              {res.image && <ImageQCMBlock src={res.image} />}
              {res.label && <ResponseBlock label={res.label} />}
              {res.extra && <ExtraResponseResultBlock extra={res.extra} />}
            </Box>
            {isArrowLeft && (
              <ArrowLeftIcon
                viewBox="10 7 5 10"
                sx={{
                  fontSize: 15,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  right: 0,
                  color: arrowColor,
                }}
              />
            )}
          </Paper>
        );
      })}
    </Box>
  );
};
