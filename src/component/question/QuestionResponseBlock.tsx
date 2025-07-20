import { Question } from "src/models/Question";
import { InputResponseBlock } from "./InputResponseBlock";
import { QuestionBlock } from "./QuestionBlock";
import {
  Answer,
  Response,
  ResponseInputBlock,
  ResponsesQCMBlock,
  ResponsesQCMEditBlock,
} from "./ResponseBlock";

interface Props {
  question?: Question;
  responseplayer1?: string | number;
  responseplayer2?: string | number;
  response?: Response;
  timer?: number;
  onSubmit: (value: Answer) => void;
}

export const QuestionResponseBlock = ({
  question,
  responseplayer1,
  responseplayer2,
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
          {question?.isqcm ? (
            <ResponsesQCMBlock
              responseplayer1={responseplayer1}
              responseplayer2={responseplayer2}
              response={response}
              question={question}
              onSubmit={onSubmit}
            />
          ) : (
            <>
              {response ? (
                <ResponseInputBlock
                  response={response}
                  responseplayer1={responseplayer1}
                  responseplayer2={responseplayer2}
                />
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

interface PropsQuestionResponseEditBlock {
  question?: Question;
  responseplayer1?: string | number;
  responseplayer2?: string | number;
  response?: Response;
  onSubmit: (value: Answer) => void;
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
                <ResponseInputBlock
                  response={response}
                  responseplayer1={responseplayer1}
                  responseplayer2={responseplayer2}
                />
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
