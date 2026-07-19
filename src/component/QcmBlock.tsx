import { Box } from "@mui/material";
import { useMemo } from "react";

import { px } from "csx";
import { QuestionResult } from "src/models/Question";

import { ResponseStatus } from "src/models/enum/Response";
import { TypeQuestionEnum } from "src/models/enum/TypeQuestionEnum";
import { TypeResponseEnum } from "src/models/enum/TypeResponseEnum";
import { decryptToNumber } from "src/utils/crypt";
import { LETTERS, ResponseQCMBlock } from "./question/ResponseBlock";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

interface PropsQcmBlockDuelResultBlock {
  question: QuestionResult;
  player1?: Profile;
  player2?: Profile;
}

export const QcmBlockDuelResultBlock = ({
  question,
  player1,
  player2,
}: PropsQcmBlockDuelResultBlock) => {
  const answer = decryptToNumber(question.answer);

  const responsePlayer1 = question.responsePlayer1;
  const responsePlayer2 = question.responsePlayer2;

  const columns = useMemo(() => {
    const responsesImage = [...question.answers].filter((el) => el.image);
    return responsesImage.length > 0 ? 2 : 1;
  }, [question]);

  const rows = useMemo(() => {
    return question.answers.length / columns;
  }, [question.answers.length, columns]);

  const isQuestionOrder = useMemo(
    () => question.typequestion === TypeQuestionEnum.ORDER,
    [question],
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        gap: px(4),
      }}
    >
      {[...question.answers].map((res, displayIndex) => {
        const index = res.id;
        const isCorrectResponse = Number(answer) === index;

        const responsePlayer1Display =
          responsePlayer1 !== undefined && Number(responsePlayer1) === index;
        const responsePlayer2Display =
          responsePlayer2 !== undefined && Number(responsePlayer2) === index;

        let status: ResponseStatus = ResponseStatus.DEFAULT;
        if (isCorrectResponse) {
          status = ResponseStatus.CORRECT;
        } else if (responsePlayer1Display || responsePlayer2Display) {
          status = ResponseStatus.WRONG;
        }

        const avatars = [
          ...(responsePlayer1Display && player1?.avatar?.icon
            ? [{ icon: player1.avatar.icon, color: Colors.colorDuel1 }]
            : []),
          ...(responsePlayer2Display && player2?.avatar?.icon
            ? [{ icon: player2.avatar.icon, color: Colors.colorDuel2 }]
            : []),
        ];

        return (
          <ResponseQCMBlock
            key={index}
            index={index}
            letter={LETTERS[displayIndex]}
            status={status}
            labels={res.answertranslation}
            extra={res.extra}
            image={res.image}
            hasAnswer={false}
            avatars={avatars}
            type={
              isQuestionOrder
                ? TypeResponseEnum.ORDER
                : TypeResponseEnum.DEFAULT
            }
          />
        );
      })}
    </Box>
  );
};
