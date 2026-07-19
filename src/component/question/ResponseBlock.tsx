import { Avatar, AvatarGroup, Box, Paper, Typography } from "@mui/material";
import { important, percent, px, viewHeight } from "csx";
import { Colors } from "src/style/Colors";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { Answer } from "src/models/Answer";
import { ResponseStatus } from "src/models/enum/Response";
import { TypeQuestionEnum } from "src/models/enum/TypeQuestionEnum";
import { TypeResponseEnum } from "src/models/enum/TypeResponseEnum";
import { Language } from "src/models/Language";
import { Question } from "src/models/Question";
import { ExtraResponse } from "src/models/Response";
import { decryptToNumber } from "src/utils/crypt";
import { shuffle } from "src/utils/sort";
import { ImageQCMBlock } from "../ImageBlock";
import { TextLabelBlock } from "../language/TextLanguageBlock";
import { ExtraResponseBlock } from "../response/ExtraResponseBlock";

import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { Profile } from "src/models/Profile";

export const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export interface AnswerUser {
  uuid: string;
  value?: string | number;
}

export interface Response {
  result?: boolean;
  answer?: number | string;
  responsePlayer1?: string | number;
  resultPlayer1?: boolean;
  timePlayer1?: number;
  responsePlayer2?: string | number;
  resultPlayer2?: boolean;
  timePlayer2?: number;
}

interface ResponsesQCMBlockProps {
  question: Question;
  player1?: Profile;
  player2?: Profile;
  onSubmit: (value: AnswerUser) => void;
  response?: Response;
}

export const ResponsesQCMBlock = ({
  question,
  player1,
  player2,
  response,
  onSubmit,
}: ResponsesQCMBlockProps) => {
  const [hasAnswer, setHasAnswer] = useState(false);

  useEffect(() => {
    setHasAnswer(false);
  }, [question]);

  const isQuestionOrder = useMemo(
    () => question.typequestion === TypeQuestionEnum.ORDER,
    [question],
  );

  const hasImage = useMemo(
    () => question.image ?? question.typequestion === "MAPPOSITION",
    [question],
  );

  const columns = useMemo(() => {
    const responsesImage = [...question.answers].filter((el) => el.image);
    return responsesImage.length > 0 ? 2 : 1;
  }, [question]);

  const rows = useMemo(() => {
    return question.answers.length / columns;
  }, [question.answers.length, columns]);

  const answers = useMemo(() => {
    return [...question.answers].sort(shuffle);
  }, [question.answers]);

  return (
    <Box
      sx={{
        width: percent(100),
        maxHeight: isQuestionOrder ? "auto" : viewHeight(50),
        flexGrow: isQuestionOrder ? 1 : "initial",
        flex: isQuestionOrder ? "1 1 0" : "initial",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: hasImage ? "center" : "flex-end",
        gap: px(6 / columns),
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        mb: 1,
      }}
    >
      {answers.map((r, displayIndex) => {
        const index = r.id;
        const isCorrectResponse = response && Number(response.answer) === index;
        const responsePlayer1Display =
          response?.result !== undefined &&
          Number(response?.responsePlayer1) === index;
        const responsePlayer2Display =
          response?.result !== undefined &&
          Number(response?.responsePlayer2) === index;

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
            status={status}
            letter={LETTERS[displayIndex]}
            index={index}
            labels={r.answertranslation}
            extra={response ? r.extra : undefined}
            image={r.image}
            hasAnswer={hasAnswer}
            avatars={avatars}
            type={
              isQuestionOrder
                ? TypeResponseEnum.ORDER
                : TypeResponseEnum.DEFAULT
            }
            onSubmit={(value) => {
              setHasAnswer(true);
              onSubmit(value);
            }}
          />
        );
      })}
    </Box>
  );
};

interface ResponsesQCMEditBlockProps {
  question: Question;
  onSubmit: (value: AnswerUser) => void;
  responseplayer1?: string | number;
  responseplayer2?: string | number;
  response?: Response;
}

export const ResponsesQCMEditBlock = ({
  question,
  responseplayer1,
  responseplayer2,
  response,
  onSubmit,
}: ResponsesQCMEditBlockProps) => {
  const answer = decryptToNumber(question.answer);

  const isQuestionOrder = useMemo(
    () => question.typequestion === TypeQuestionEnum.ORDER,
    [question],
  );

  const hasImage = useMemo(
    () => question.image ?? question.typequestion === "MAPPOSITION",
    [question],
  );

  const columns = useMemo(() => {
    const responsesImage = [...question.answers].filter((el) => el.image);
    const isPairResponses = question.answers.length % 2 === 0;
    return question.typequestion !== TypeQuestionEnum.ORDER &&
      (hasImage || responsesImage.length > 0) &&
      isPairResponses
      ? 2
      : 1;
  }, [question, hasImage]);

  const rows = useMemo(() => {
    return question.answers.length / columns;
  }, [question.answers.length, columns]);

  return (
    <Box
      sx={{
        width: percent(100),
        maxHeight: isQuestionOrder ? "auto" : viewHeight(50),
        flexGrow: isQuestionOrder ? 1 : "initial",
        flex: isQuestionOrder ? "1 1 0" : "initial",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: hasImage ? "center" : "flex-end",
        gap: px(6 / columns),
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        mb: 1,
      }}
    >
      {question.answers.map((res, displayIndex) => {
        const index = res.id;
        const isCorrectResponse = Number(answer) === index;

        const isArrowRight =
          responseplayer1 !== undefined && Number(responseplayer1) === index;
        const isArrowLeft =
          responseplayer2 !== undefined && Number(responseplayer2) === index;
        let status: ResponseStatus = ResponseStatus.DEFAULT;

        if (isCorrectResponse) {
          status = ResponseStatus.CORRECT;
        } else if (isArrowRight || isArrowLeft) {
          status = ResponseStatus.WRONG;
        }

        return (
          <ResponseQCMBlock
            key={index}
            index={index}
            letter={LETTERS[displayIndex]}
            status={status}
            labels={res.answertranslation}
            extra={response ? res.extra : undefined}
            image={res.image}
            hasAnswer={false}
            type={
              isQuestionOrder
                ? TypeResponseEnum.ORDER
                : TypeResponseEnum.DEFAULT
            }
            onSubmit={(value) => {
              onSubmit(value);
            }}
          />
        );
      })}
    </Box>
  );
};

interface ResponseQCMBlockProps {
  status: ResponseStatus;
  letter: string;
  image?: string;
  labels: Array<{
    id: number;
    label: string;
    language: Language;
  }>;
  avatars?: Array<{ icon: string; color: string }>;
  extra?: ExtraResponse;
  index: number;
  hasAnswer: boolean;
  type: TypeResponseEnum;
  onSubmit?: (value: AnswerUser) => void;
}

export const ResponseQCMBlock = ({
  index,
  status,
  letter,
  image,
  labels,
  extra,
  avatars = [],
  hasAnswer = false,
  type = TypeResponseEnum.DEFAULT,
  onSubmit,
}: ResponseQCMBlockProps) => {
  const { mode } = useUser();
  const { uuid } = useUser();

  const padding = type === TypeResponseEnum.DEFAULT && !image ? "8px 12px" : 0;
  const isOrder = type === TypeResponseEnum.ORDER;
  const backgroundImage = isOrder ? image : undefined;
  const textShadow = isOrder ? "1px 1px 10px black" : "none";
  const imageDisplay = isOrder ? undefined : image;

  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const color = useMemo(
    () =>
      ({
        [ResponseStatus.CORRECT]: Colors.correctanswer,
        [ResponseStatus.WRONG]: Colors.wronganswer,
        [ResponseStatus.DEFAULT]: isDarkMode ? Colors.grey8 : Colors.grey3,
      })[status],
    [status, isDarkMode],
  );

  const icon = useMemo(
    () =>
      ({
        [ResponseStatus.CORRECT]: (
          <CheckIcon sx={{ color: Colors.correctanswer }} />
        ),
        [ResponseStatus.WRONG]: (
          <ClearIcon sx={{ color: Colors.wronganswer }} />
        ),
        [ResponseStatus.DEFAULT]: undefined,
      })[status],
    [status],
  );

  return (
    <Paper
      key={index}
      sx={{
        p: padding,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: isDarkMode
          ? `color-mix(in srgb, ${color} 40%, black)`
          : `color-mix(in srgb, ${color} 30%, white)`,
        borderColor: color,
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderWidth: isOrder ? 10 : 2,
        borderStyle: "solid",
        height: percent(100),
        userSelect: "none",
        "&:hover": {
          cursor: "pointer",
        },
        minHeight: px(45),
      }}
      variant="outlined"
      onClick={(event) => {
        event.preventDefault();
        if (!hasAnswer && onSubmit) {
          onSubmit({
            uuid: uuid,
            value: index,
          });
        }
      }}
    >
      <Box
        sx={{
          position: imageDisplay ? "absolute" : "initial",
          top: 8,
          left: 8,
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 16,
          mr: 1,
        }}
      >
        <Typography variant="h6">{letter}</Typography>
      </Box>
      {imageDisplay && <ImageQCMBlock src={imageDisplay} />}
      <Box sx={{ flex: 1, textAlign: imageDisplay ? "center" : "left" }}>
        {labels.length > 0 && (
          <TextLabelBlock
            variant="h3"
            component="p"
            sx={{
              color: isOrder ? Colors.white : "auto",
              wordBreak: "break-word",
              textShadow: textShadow,
              fontSize: isOrder ? important(px(40)) : "initial",
            }}
            values={labels}
          />
        )}
        {extra && <ExtraResponseBlock extra={extra} />}
      </Box>
      {avatars.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            top: imageDisplay ? 8 : undefined,
            right: imageDisplay ? 8 : undefined,
            position: imageDisplay ? "absolute" : "relative",
          }}
        >
          <AvatarGroup spacing="medium">
            {avatars.map((avatar, index) => (
              <Avatar
                key={index}
                src={avatar.icon}
                sx={{
                  width: 30,
                  height: 30,
                  border: important(`2px solid ${avatar.color}`),
                  backgroundColor: "white",
                }}
              />
            ))}
          </AvatarGroup>
        </Box>
      ) : (
        <>
          {icon && (
            <Box
              sx={{
                display: "flex",
                top: imageDisplay ? 8 : undefined,
                right: imageDisplay ? 8 : undefined,
                position: imageDisplay ? "absolute" : "relative",
              }}
            >
              {icon}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

interface ResponseInputBlockProps {
  question: Question;
  response: Response;
}

export const ResponseInputBlock = ({
  question,
  response,
}: ResponseInputBlockProps) => {
  const { mode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const arrowColor: string = useMemo(
    () => (isDarkMode ? Colors.white : Colors.black2),
    [isDarkMode],
  );

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: response.result
          ? Colors.correctanswer
          : Colors.wronganswer,
        borderRadius: px(5),
        textAlign: "center",
        width: percent(100),
        userSelect: "none",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: response.result
          ? Colors.correctanswerborder
          : Colors.wronganswerborder,
      }}
    >
      {response.responsePlayer1 && (
        <Box sx={{ position: "relative" }}>
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
          <Typography variant="h2" color="text.secondary">
            {response.responsePlayer1}
          </Typography>
        </Box>
      )}
      {response.responsePlayer2 && (
        <Box sx={{ position: "relative" }}>
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
          <Typography variant="h2" color="text.secondary">
            {response.responsePlayer2}
          </Typography>
        </Box>
      )}
      <CorrectAnswerBlock question={question} />
    </Paper>
  );
};

interface CorrectAnswerBlockProps {
  question: Question;
}

export const CorrectAnswerBlock = ({ question }: CorrectAnswerBlockProps) => {
  const { t } = useTranslation();

  const answer = useMemo(() => {
    const response = decryptToNumber(question.answer);
    const correctAnswer = [...question.answers].find(
      (el) => Number(el.id) === Number(response),
    );
    return correctAnswer;
  }, [question]);
  return (
    answer && (
      <>
        <Typography variant="h4" color="text.secondary" component="span">
          {t("commun.goodresponse")} :{" "}
        </Typography>
        <TextLabelBlock
          variant="h2"
          color="text.secondary"
          component="span"
          values={answer.answertranslation}
        />
      </>
    )
  );
};

interface PropsResponsesBlockAdmin {
  answer?: Answer;
  wrongAnswers: Array<Answer>;
  language: Language;
}

export const ResponsesBlockAdmin = ({
  answer,
  wrongAnswers,
  language,
}: PropsResponsesBlockAdmin) => {
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const color = isDarkMode ? Colors.black2 : Colors.white;
  const borderColor = isDarkMode ? Colors.white : Colors.black2;

  const answers = useMemo(
    () => (answer ? [answer, ...wrongAnswers] : wrongAnswers),
    [answer, wrongAnswers],
  );

  const numberAnswer = useMemo(() => answers.length, [answers]);

  const columns = useMemo(() => {
    const isPairResponses = numberAnswer % 2 === 0;
    return isPairResponses ? 2 : 1;
  }, [numberAnswer]);

  const rows = useMemo(() => {
    return numberAnswer / columns;
  }, [numberAnswer, columns]);
  return (
    <Box
      sx={{
        width: percent(100),
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "flex-end",
        gap: px(6 / columns),
        display: "grid",
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
        mb: 1,
      }}
    >
      {answer && (
        <ResponseQCMAdminBlock
          color={Colors.correctanswer}
          borderColor={Colors.correctanswerborder}
          labels={answer.answertranslation}
          image={answer.image}
          extra={answer.extra}
          type={TypeResponseEnum.DEFAULT}
          language={language}
        />
      )}
      {wrongAnswers.map((wrongAnswer, index) => (
        <Fragment key={index}>
          <ResponseQCMAdminBlock
            color={color}
            borderColor={borderColor}
            image={wrongAnswer.image}
            labels={wrongAnswer.answertranslation}
            extra={wrongAnswer.extra}
            type={TypeResponseEnum.DEFAULT}
            language={language}
          />
        </Fragment>
      ))}
    </Box>
  );
};

interface ResponseQCMAdminBlockProps {
  color: string;
  image?: string;
  labels: Array<{
    id: number;
    label: string;
    language: Language;
  }>;
  extra?: ExtraResponse;
  borderColor?: string;
  type: TypeResponseEnum;
  language: Language;
}

const ResponseQCMAdminBlock = ({
  color = "text.primary",
  borderColor = Colors.white,
  image,
  labels,
  extra,
  type = TypeResponseEnum.DEFAULT,
  language,
}: ResponseQCMAdminBlockProps) => {
  const padding = type === TypeResponseEnum.DEFAULT && !image ? "4px 12px" : 0;
  const isOrder = type === TypeResponseEnum.ORDER;
  const textShadow = isOrder ? "1px 1px 10px black" : "none";

  return (
    <Paper
      sx={{
        p: padding,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: color,
        borderColor: borderColor,
        borderWidth: isOrder ? 10 : 1,
        borderStyle: "solid",
        height: percent(100),
        userSelect: "none",
        "&:hover": {
          cursor: "pointer",
        },
        minHeight: px(50),
      }}
      variant="outlined"
    >
      {image && <ImageQCMBlock src={image} />}
      <Box>
        {labels && !image && (
          <TextLabelBlock
            variant="h3"
            component="p"
            sx={{
              color: isOrder ? Colors.white : "auto",
              wordBreak: "break-word",
              textShadow: textShadow,
              fontSize: isOrder ? important(px(40)) : "initial",
            }}
            values={labels}
            languageParameter={language}
            noTranslation={true}
          />
        )}
        {extra && <ExtraResponseBlock extra={extra} />}
      </Box>
    </Paper>
  );
};
