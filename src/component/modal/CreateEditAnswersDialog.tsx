import AddIcon from "@mui/icons-material/Add";
import { Dialog, DialogContent, Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteAnswerById,
  selectAnswerByAnswerset,
  selectAnswerById,
} from "src/api/answer";
import { AnswerForm } from "src/form/AnswerForm";
import { Answer } from "src/models/Answer";
import { Language } from "src/models/Language";
import { QuestionAdmin } from "src/models/Question";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { CardAdminAnswer } from "../card/CardAnswer";
import { LanguagesIcon } from "../language/LanguageBlock";
import { TitleModal } from "./commun/TitleModal";

enum Mode {
  EDIT,
  SEARCH,
}
interface Props {
  open: boolean;
  question: QuestionAdmin;
  language: Language;
  languages: Array<Language>;
  close: () => void;
}

export const CreateEditAnswersDialog = ({
  question,
  language,
  languages,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();

  const [languageResponse, setLanguageResponse] = useState<Language>(language);

  const [mode, setMode] = useState(Mode.SEARCH);

  const [correctAnswers, setCorrectAnswers] = useState<Answer | undefined>(
    undefined,
  );
  const [answers, setAnswers] = useState<Array<Answer>>([]);
  const [answer, setAnswer] = useState<undefined | Answer>(undefined);

  const answerset = useMemo(
    () => question.answerset ?? question.questionanswer[0].answer.answerset,
    [question],
  );

  const refreshAnswer = useCallback(() => {
    const idsAnswer = [...question.questionanswer].map((el) => el.answer.id);
    selectAnswerByAnswerset(answerset).then(({ data }) => {
      const res: Array<Answer> = data ?? [];
      const wrongAnswers = [...res].filter((el) => !idsAnswer.includes(el.id));
      const correctAnswers = [...res].filter((el) => idsAnswer.includes(el.id));
      setAnswers(wrongAnswers);
      setCorrectAnswers(correctAnswers[0]);
    });
  }, [answerset, question]);

  useEffect(() => {
    if (mode === Mode.SEARCH) {
      refreshAnswer();
    }
  }, [mode, refreshAnswer]);

  const onDelete = (answer: Answer) => {
    deleteAnswerById(answer.id).then(() => {
      refreshAnswer();
    });
  };

  return (
    <Dialog onClose={close} open={open} maxWidth="md" fullWidth>
      <TitleModal title={t("commun.editresponses")} close={close} />
      <DialogContent>
        <Grid container spacing={2}>
          {mode === Mode.SEARCH ? (
            <>
              {languageResponse && (
                <Grid size={12}>
                  <LanguagesIcon
                    languages={languages}
                    language={languageResponse}
                    size={40}
                    onSelect={setLanguageResponse}
                  />
                </Grid>
              )}
              <Grid size={12}>
                <ButtonColor
                  value={Colors.green}
                  label={t("commun.addresponse")}
                  icon={AddIcon}
                  variant="contained"
                  onClick={() => setMode(Mode.EDIT)}
                />
              </Grid>
              {correctAnswers && (
                <Grid size={12}>
                  <CardAdminAnswer
                    answer={correctAnswers}
                    language={languageResponse}
                    isCorrect={true}
                    onEdit={() => {
                      selectAnswerById(correctAnswers.id).then(({ data }) => {
                        setAnswer(data ?? undefined);
                        setMode(Mode.EDIT);
                      });
                    }}
                  />
                </Grid>
              )}
              {answers.map((answer) => (
                <Grid size={12} key={answer.id}>
                  <CardAdminAnswer
                    answer={answer}
                    language={languageResponse}
                    onDelete={() => onDelete(answer)}
                    onEdit={() => {
                      selectAnswerById(answer.id).then(({ data }) => {
                        setAnswer(data ?? undefined);
                        setMode(Mode.EDIT);
                      });
                    }}
                  />
                </Grid>
              ))}
            </>
          ) : (
            <Grid size={12}>
              <AnswerForm
                answerset={answerset}
                answer={answer}
                validate={() => {
                  setAnswer(undefined);
                  setMode(Mode.SEARCH);
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
