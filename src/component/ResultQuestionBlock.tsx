import { Avatar, Box, Typography } from "@mui/material";
import { QuestionPosition } from "src/models/Question";
import { NUMBERQUESTION } from "src/pages/PlayPage";
import { Colors } from "src/style/Colors";

import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { style } from "typestyle";
import { px } from "csx";

const imageCss = style({
  width: px(25),
  height: px(25),
});

interface Props {
  questions: Array<QuestionPosition>;
  numberQuestion?: number;
}

export const ResultQuestionBlock = ({
  questions,
  numberQuestion = NUMBERQUESTION,
}: Props) => {
  const getIcon = (position?: number) => {
    let icon = rank1;
    if (position === 2) {
      icon = rank2;
    } else if (position === 3) {
      icon = rank3;
    }
    return icon;
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {[...Array(numberQuestion)].map((_, index) => {
        const questionIndex = index + 1;
        const question = questions.find((el) => el.question === questionIndex);

        return (
          <Box
            sx={{ flex: 1, justifyContent: "center", display: "flex" }}
            key={index}
          >
            {question && question.position ? (
              <Avatar
                sx={{
                  backgroundColor: question
                    ? question.isRight
                      ? Colors.green
                      : Colors.red
                    : Colors.grey,
                  width: 30,
                  height: 30,
                }}
              >
                <img src={getIcon(question.position)} className={imageCss} />
              </Avatar>
            ) : (
              <Avatar
                sx={{
                  backgroundColor: question
                    ? question.isRight
                      ? Colors.green
                      : Colors.red
                    : Colors.grey,
                  width: 30,
                  height: 30,
                }}
              >
                <Typography variant="h6" color="secondary">
                  {questionIndex}
                </Typography>
              </Avatar>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
