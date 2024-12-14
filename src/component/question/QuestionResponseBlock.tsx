import { Box } from "@mui/material";
import { InputResponseBlock } from "./InputResponseBlock";
import { QuestionBlock } from "./QuestionBlock";
import {
  Question,
  Response,
  ResponseInputBlock,
  ResponsesQCMBlock,
} from "./ResponseBlock";
import { px } from "csx";
import { VerticalTimer } from "../Timer";
import { COLORDUEL1, COLORDUEL2 } from "src/pages/play/DuelPage";
import { ResponseDuel } from "src/models/Response";
import { ResponseDuelBlock } from "./ResponseBlock";
import { useMemo } from "react";

interface Props {
  question?: Question;
  myresponse: string | number | undefined;
  response?: Response;
  timer?: number;
  onSubmit: (value: Answer) => void;
}

export const QuestionResponseBlock = ({
  question,
  myresponse,
  response,
  timer,
  onSubmit,
}: Props) => {
  return (
    <>
      {question && (
        <>
          <QuestionBlock question={question} timer={timer} />
          {question && question.isqcm ? (
            <ResponsesQCMBlock
              myresponse={myresponse}
              response={response}
              question={question}
              onSubmit={onSubmit}
            />
          ) : (
            <>
              {response ? (
                <ResponseInputBlock response={response} />
              ) : (
                <InputResponseBlock
                  onSubmit={onSubmit}
                  typeResponse={question.typeResponse}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

interface PropsDuel {
  question?: Question;
  response?: Response;
  responsePlayer1?: ResponseDuel;
  responsePlayer2?: ResponseDuel;
  isPlayer1: boolean;
  timer?: number;
  onSubmit: (value: MyResponse) => void;
}

export const QuestionResponseDuelBlock = ({
  question,
  responsePlayer1,
  responsePlayer2,
  response,
  isPlayer1,
  timer,
  onSubmit,
}: PropsDuel) => {
  const myresponse = useMemo(
    () =>
      isPlayer1
        ? responsePlayer1
          ? responsePlayer1.answer
          : undefined
        : responsePlayer2
        ? responsePlayer2.answer
        : undefined,
    [isPlayer1, responsePlayer1, responsePlayer2]
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        flex: "1 1 0",
        display: "flex",
        flexDirection: "row",
        gap: px(5),
      }}
    >
      <VerticalTimer
        time={timer}
        color={COLORDUEL1}
        answer={responsePlayer1 ? responsePlayer1.time : undefined}
      />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flex: "1 1 0",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            flex: "1 1 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {question && (
            <>
              <QuestionBlock question={question} />
              {question.isqcm ? (
                <ResponsesQCMBlock
                  myresponse={myresponse}
                  response={response}
                  question={question}
                  onSubmit={onSubmit}
                />
              ) : (
                <ResponseDuelBlock
                  response={response}
                  responsePlayer1={responsePlayer1}
                  responsePlayer2={responsePlayer2}
                  onSubmit={onSubmit}
                />
              )}
            </>
          )}
        </Box>
      </Box>
      <VerticalTimer
        time={timer}
        color={COLORDUEL2}
        answer={responsePlayer2 ? responsePlayer2.time : undefined}
      />
    </Box>
  );
};
