import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import {
  QuestionAdmin,
  QuestionPropose,
  QuestionResult,
  QuestionResultV1,
  QuestionUpdate,
} from "src/models/Question";
import { ImageQuestionBlock } from "../ImageBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { SelectDifficulty } from "../Select";

import BugReportIcon from "@mui/icons-material/BugReport";
import DeleteIcon from "@mui/icons-material/Delete";
import { Trans, useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";

import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useMemo, useState } from "react";
import { getWrongAnswer } from "src/api/answer";
import { deleteQuestionById, updateQuestion } from "src/api/question";
import { useUser } from "src/context/UserProvider";
import { Answer } from "src/models/Answer";
import { Language } from "src/models/Language";
import { Difficulty } from "src/models/enum/DifficultyEnum";
import { MapPositionBlock } from "../MapPositionBlock";
import { QcmBlockDuelResultBlock } from "../QcmBlock";
import { LanguagesIcon } from "../language/LanguageBlock";
import { TextLabelBlock } from "../language/TextLanguageBlock";
import { ConfirmDialog } from "../modal/ConfirmModal";
import { CreateEditAnswersDialog } from "../modal/CreateEditAnswersDialog";
import { CreateEditQuestionDialog } from "../modal/CreateEditQuestionDialog";
import { ValidationProposeQuestion } from "../modal/ValidateQuestionModal";
import {
  CorrectAnswerBlock,
  ResponsesBlockAdmin,
} from "../question/ResponseBlock";
import { CardSignalQuestionV1 } from "./CardQuestionV1";
import { ThemesList } from "../theme/ThemesList";
import { CreateEditThemeQuestionDialog } from "../modal/CreateEditThemeQuestionDialog";
import { ProposeAlert } from "../alert/ProposeAlert";
import { StatusPropose } from "src/models/enum/Propose";

interface Props {
  question: QuestionAdmin;
  refresh: () => void;
}

export const CardAdminQuestion = ({ question, refresh }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [languageQuestion, setLanguageQuestion] = useState<
    Language | undefined
  >(undefined);
  const [wrongAnswers, setWrongAnswers] = useState<Array<Answer>>([]);
  const [openModalTheme, setOpenModalTheme] = useState(false);
  const [openModalQuestion, setOpenModalQuestion] = useState(false);
  const [openModalResponses, setOpenModalResponses] = useState(false);
  const [openModalValidate, setOpenModalValidate] = useState(false);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);

  const onChangeDifficulty = async (value: Difficulty) => {
    const newQuestion: QuestionUpdate = {
      id: question.id,
      difficulty: value,
    };
    await updateQuestion(newQuestion);
    refresh();
  };

  const onChangeValidate = async () => {
    const newQuestion: QuestionUpdate = {
      id: question.id,
      validate: !question.validate,
    };
    await updateQuestion(newQuestion);
    refresh();
  };

  const languages = useMemo(
    () => [...question.questiontranslation].map((el) => el.language),
    [question]
  );

  useEffect(() => {
    if (language && languages.length > 0) {
      const res = languages.find((el) => el.id === language.id);
      setLanguageQuestion(res);
    }
  }, [question, language, languages]);

  const questionTranslation = useMemo(
    () =>
      [...question.questiontranslation].find(
        (el) => el.language.id === languageQuestion?.id
      ),
    [question.questiontranslation, languageQuestion]
  );

  const answer = useMemo(
    () => question.questionanswer[0].answer,
    [question.questionanswer]
  );

  useEffect(() => {
    getWrongAnswer(question).then(({ data }) => {
      const res = data ?? [];
      setWrongAnswers(res);
    });
  }, [question]);

  const deleteQuestion = () => {
    deleteQuestionById(question.id).then(() => {
      refresh();
      setOpenModalConfirmDelete(false);
    });
  };

  const themes = useMemo(
    () => [...question.questiontheme].map((el) => el.theme),
    [question]
  );

  return (
    <>
      <Paper
        sx={{
          p: 1,
          position: "relative",
          backgroundColor: Colors.black,
          color: Colors.white,
        }}
        variant="outlined"
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h4">
              <Trans
                i18nKey={t("commun.questionid")}
                values={{
                  id: question.id,
                }}
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ThemesList themes={themes} />
          </Grid>
          <Grid item xs={12}>
            <SelectDifficulty
              value={question.difficulty as Difficulty}
              onSelect={onChangeDifficulty}
            />
          </Grid>
          {languageQuestion && (
            <Grid item xs={12}>
              <LanguagesIcon
                languages={languages}
                language={languageQuestion}
                size={40}
                onSelect={setLanguageQuestion}
              />
            </Grid>
          )}
          {question.image && (
            <Grid item xs={12} sx={{ height: px(200) }}>
              <ImageQuestionBlock src={question.image} />
            </Grid>
          )}
          {questionTranslation && (
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h2" component="span">
                {questionTranslation.label}
              </Typography>
            </Grid>
          )}
          {languageQuestion && (
            <Grid item xs={12}>
              <ResponsesBlockAdmin
                answer={answer}
                language={languageQuestion}
                wrongAnswers={wrongAnswers}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.purple}
              label={t("commun.editresponses")}
              icon={EditIcon}
              variant="contained"
              onClick={() => setOpenModalResponses(true)}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.pink}
              label={t("commun.editthethemes")}
              icon={EditIcon}
              variant="contained"
              onClick={() => setOpenModalTheme(true)}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.blue}
              label={t("commun.editthequestion")}
              icon={EditIcon}
              variant="contained"
              onClick={() => setOpenModalQuestion(true)}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.red}
              label={t("commun.delete")}
              icon={DeleteIcon}
              variant="contained"
              onClick={() => setOpenModalConfirmDelete(true)}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.green}
              label={t("commun.validate")}
              icon={DoneIcon}
              variant="contained"
              onClick={onChangeValidate}
            />
          </Grid>
        </Grid>
      </Paper>
      <CreateEditQuestionDialog
        open={openModalQuestion}
        question={question}
        close={() => {
          setOpenModalQuestion(false);
          refresh();
        }}
      />
      {languageQuestion && openModalResponses && (
        <CreateEditAnswersDialog
          open={openModalResponses}
          question={question}
          close={() => {
            setOpenModalResponses(false);
            refresh();
          }}
          language={languageQuestion}
          languages={languages}
        />
      )}
      {openModalTheme && (
        <CreateEditThemeQuestionDialog
          open={openModalTheme}
          question={question}
          close={() => {
            setOpenModalTheme(false);
            refresh();
          }}
        />
      )}
      {openModalValidate && (
        <ValidationProposeQuestion
          open={openModalValidate}
          question={question}
          close={() => {
            setOpenModalValidate(false);
            refresh();
          }}
        />
      )}
      <ConfirmDialog
        title={t("modal.deletequestion")}
        open={openModalConfirmDelete}
        onClose={() => {
          setOpenModalConfirmDelete(false);
        }}
        onConfirm={deleteQuestion}
      />
    </>
  );
};

interface PropsCardSignalQuestion {
  question: QuestionResult | QuestionResultV1;
  version?: number;
  report?: () => void;
  color?: string;
}
export const CardSignalQuestion = ({
  version = 2,
  question,
  report,
  color = "text.primary",
}: PropsCardSignalQuestion) => {
  return (
    <>
      {version === 1 ? (
        <CardSignalQuestionV1
          question={question as QuestionResultV1}
          report={report}
          color={color}
        />
      ) : (
        <CardSignalQuestionV2
          question={question as QuestionResult}
          report={report}
          color={color}
        />
      )}
    </>
  );
};

interface PropsCardSignalQuestionV2 {
  question: QuestionResult;
  report?: () => void;
  color?: string;
}
export const CardSignalQuestionV2 = ({
  question,
  report,
  color = "text.primary",
}: PropsCardSignalQuestionV2) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: 1,
        height: percent(100),
        position: "relative",
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <TextLabelBlock
            variant="h2"
            color={color}
            values={question.questiontranslation}
          />
        </Grid>
        {question.extra && (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <JsonLanguageBlock
              variant="caption"
              color={color}
              sx={{
                fontSize: 18,
                fontStyle: "italic",
              }}
              value={question.extra}
            />
          </Grid>
        )}
        {question.typequestion === "MAPPOSITION" && question.data !== null && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <MapPositionBlock data={question.data} height={300} />
          </Grid>
        )}
        {question.image && (
          <Grid item xs={12} sx={{ maxWidth: percent(80), maxHeight: px(300) }}>
            <ImageQuestionBlock src={question.image} />
          </Grid>
        )}
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          {question.isqcm ? (
            <QcmBlockDuelResultBlock question={question} />
          ) : (
            <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
              <Paper
                sx={{
                  p: "4px 10px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  cursor: "default",
                  borderColor: Colors.white,
                  borderStyle: "solid",
                  borderWidth: 1,
                  backgroundColor: question.resultPlayer1
                    ? Colors.correctanswer
                    : Colors.wronganswer,
                  userSelect: "none",
                }}
              >
                {!question.responsePlayer1 && !question.responsePlayer2 && (
                  <Box>
                    <CorrectAnswerBlock question={question} />
                  </Box>
                )}
                {question.responsePlayer1 && (
                  <>
                    <Typography
                      variant="h2"
                      color={color}
                      sx={{ wordWrap: "break-word" }}
                    >
                      {question.responsePlayer1}
                    </Typography>
                    <Box>
                      <CorrectAnswerBlock question={question} />
                    </Box>
                  </>
                )}
                {question.responsePlayer2 && (
                  <>
                    <Typography
                      variant="h2"
                      color={color}
                      sx={{ wordWrap: "break-word" }}
                    >
                      {question.responsePlayer2}
                    </Typography>
                    <Box>
                      <CorrectAnswerBlock question={question} />
                    </Box>
                  </>
                )}
              </Paper>
            </Box>
          )}
        </Grid>
        {report && (
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.yellow}
              label={t("commun.report")}
              icon={BugReportIcon}
              onClick={report}
              variant="contained"
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

interface CardProposeQuestionProps {
  question: QuestionPropose;
}

export const CardProposeQuestion = ({ question }: CardProposeQuestionProps) => {
  const { language } = useUser();
  const [wrongAnswers, setWrongAnswers] = useState<Array<Answer>>([]);

  useEffect(() => {
    getWrongAnswer(question).then(({ data }) => {
      const res = data ?? [];
      setWrongAnswers(res);
    });
  }, [question]);

  const status = useMemo(() => {
    let value = StatusPropose.INPROGRESS;
    if (question.enabled && question.validate) {
      value = StatusPropose.VALIDATE;
    } else if (!question.enabled) {
      value = StatusPropose.MAINTENANCE;
    }
    return value;
  }, [question]);

  return (
    <Paper
      sx={{
        p: 1,
        position: "relative",
        backgroundColor: Colors.black,
        color: Colors.white,
      }}
      elevation={24}
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <ProposeAlert value={status} />
        </Grid>
        {question.image && (
          <Grid item xs={12} sx={{ height: px(200) }}>
            <ImageQuestionBlock src={question.image} />
          </Grid>
        )}
        {question.questiontranslation[0] && (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2" component="span">
              {question.questiontranslation[0].label}
            </Typography>
          </Grid>
        )}
        {language && (
          <Grid item xs={12}>
            <ResponsesBlockAdmin
              answer={question.questionanswer[0].answer}
              language={language}
              wrongAnswers={wrongAnswers}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
