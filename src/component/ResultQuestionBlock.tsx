import { Avatar, Box, Typography } from "@mui/material";
import { QuestionPosition } from "src/models/Question";
import { NUMBERQUESTION } from "src/pages/PlayPage";
import { Colors } from "src/style/Colors";

interface Props {
  questions: Array<QuestionPosition>;
  numberQuestion?: number;
}

export const ResultQuestionBlock = ({
  questions,
  numberQuestion = NUMBERQUESTION,
}: Props) => {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {[...Array(numberQuestion)].map((_, index) => {
        const numberQuestion = index + 1;
        const question = questions.find((el) => el.question === numberQuestion);

        return (
          <Box
            sx={{ flex: 1, justifyContent: "center", display: "flex" }}
            key={index}
          >
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
                {numberQuestion}
              </Typography>
            </Avatar>
          </Box>
        );
      })}
    </Box>
  );
};
