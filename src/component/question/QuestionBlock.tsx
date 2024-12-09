import { Box } from "@mui/material";
import { important, percent, px } from "csx";
import { useMemo } from "react";
import { ImageQuestionBlock } from "../ImageBlock";
import { InputResponseBlock } from "../InputResponseBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { CircularLoading } from "../Loading";
import { MapPositionBlock } from "../MapPositionBlock";
import { SoundBar } from "../SoundBar";
import {
  MyResponse,
  Question,
  Response,
  ResponseInputBlock,
  ResponsesQCMBlock,
} from "./ResponseBlock";

interface Props {
  question?: Question;
  myresponse: string | number | undefined;
  response?: Response;
  onSubmit: (value: MyResponse) => void;
}

export const QuestionBlock = ({
  question,
  myresponse,
  response,
  onSubmit,
}: Props) => {
  const image = useMemo(
    () => (question ? question.image : undefined),
    [question]
  );

  console.log(image);

  return (
    <>
      {question && (
        <>
          <Box
            sx={{
              width: percent(100),
              flexGrow: image ? "initial" : 1,
              flex: image ? "initial" : "1 1 0",
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
                <JsonLanguageBlock
                  variant="h2"
                  color="text.secondary"
                  sx={{ fontSize: important(px(35)) }}
                  value={question.question}
                />
                {image && (
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
                    <ImageQuestionBlock src={image} />
                  </Box>
                )}
                {question.typequestion === "MAPPOSITION" &&
                  question.data !== null && (
                    <MapPositionBlock data={question.data} />
                  )}
                {question.audio && <SoundBar />}
                {question.extra && (
                  <JsonLanguageBlock
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: 18,
                      fontStyle: "italic",
                    }}
                    value={question.extra}
                  />
                )}
              </>
            ) : (
              <CircularLoading />
            )}
          </Box>
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
                  myresponse={myresponse}
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
