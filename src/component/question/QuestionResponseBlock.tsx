import { Question } from "src/models/Question";
import { InputResponseBlock } from "./InputResponseBlock";
import { QuestionBlock } from "./QuestionBlock";
import {
  AnswerUser,
  Response,
  ResponseInputBlock,
  ResponsesQCMBlock,
  ResponsesQCMEditBlock,
} from "./ResponseBlock";
import { Profile } from "src/models/Profile";

interface Props {
  question?: Question;
  player1?: Profile;
  player2?: Profile;
  response?: Response;
  timer?: number;
  onSubmit: (value: AnswerUser) => void;
}

export const QuestionResponseBlock = ({
  question,
  player1,
  player2,
  response,
  timer,
  onSubmit,
}: Props) => {
  return (
    <>
      {question && (
        <>
          <QuestionBlock
            question={question}
            timer={timer}
            onSubmit={onSubmit}
          />
          {question.isqcm ? (
            <ResponsesQCMBlock
              response={response}
              question={question}
              player1={player1}
              player2={player2}
              onSubmit={onSubmit}
            />
          ) : (
            <>
              {response ? (
                <ResponseInputBlock question={question} response={response} />
              ) : (
                <InputResponseBlock
                  onSubmit={onSubmit}
                  answerset={question.answerset}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

interface PropsQuestionResponseEditBlock {
  question?: Question;
  responseplayer1?: string | number;
  responseplayer2?: string | number;
  response?: Response;
  onSubmit: (value: AnswerUser) => void;
}

export const QuestionResponseEditBlock = ({
  question,
  responseplayer1,
  responseplayer2,
  response,
  onSubmit,
}: PropsQuestionResponseEditBlock) => {
  return (
    <>
      {question && (
        <>
          <QuestionBlock question={question} />
          {question?.isqcm ? (
            <ResponsesQCMEditBlock
              responseplayer1={responseplayer1}
              responseplayer2={responseplayer2}
              response={response}
              question={question}
              onSubmit={onSubmit}
            />
          ) : (
            <>
              {response ? (
                <ResponseInputBlock response={response} question={question} />
              ) : (
                <InputResponseBlock
                  onSubmit={onSubmit}
                  answerset={question.answerset}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
