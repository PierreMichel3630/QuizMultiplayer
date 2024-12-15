import { Question } from "src/models/Question";
import { InputResponseBlock } from "./InputResponseBlock";
import { QuestionBlock } from "./QuestionBlock";
import {
  Answer,
  Response,
  ResponseInputBlock,
  ResponsesQCMBlock,
} from "./ResponseBlock";

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
