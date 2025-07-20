import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import { QuestionResponseEditBlock } from "src/component/question/QuestionResponseBlock";
import { Answer, Response } from "src/component/question/ResponseBlock";
import { useMessage } from "src/context/MessageProvider";
import { ChallengeGame, ChallengeGameUpdate } from "src/models/Challenge";
import { QuestionResult } from "src/models/Question";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

import SaveIcon from "@mui/icons-material/Save";
import { useUser } from "src/context/UserProvider";
import { verifyResponse } from "src/utils/response";
import { updateChallengeGame } from "src/api/challenge";

interface Props {
  game?: ChallengeGame;
  validate: () => void;
}

export const ChallengeGameForm = ({ game, validate }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    time: number;
    score: number;
    questions: Array<QuestionResult>;
  } = {
    time: game ? game.time : 0,
    score: game ? game.score : 0,
    questions: game
      ? game.questions.length > 0
        ? game.questions
        : game.challenge.questions
      : [],
  };

  const validationSchema = Yup.object().shape({
    time: Yup.string().required(t("form.createchallengegame.requiredtime")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (game) {
          const newGameChallenge: ChallengeGameUpdate = {
            id: game.id,
            questions: values.questions,
            score: values.score,
            time: values.time,
          };
          const { error } = await updateChallengeGame(newGameChallenge);
          if (error) {
            setSeverity("error");
            setMessage(t("commun.error"));
          } else {
            validate();
          }
        } else {
          setSeverity("error");
          setMessage(t("commun.error"));
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  const changeResponse = (question: QuestionResult, value: Answer) => {
    const index = formik.values.questions.findIndex(
      (el) => el.id === question.id
    );
    const newQuestions = [...formik.values.questions];
    const result = verifyResponse(language, question, value);
    newQuestions[index] = {
      ...question,
      responsePlayer1: value.value,
      resultPlayer1: result,
    };
    const score = [...newQuestions].reduce(
      (acc, el) => (el.resultPlayer1 === true ? acc + 1 : acc),
      0
    );
    formik.setFieldValue(`questions`, newQuestions);
    formik.setFieldValue(`score`, score);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {game && (
          <Grid item>
            <ProfileBlock profile={game.profile} variant="h4" avatarSize={50} />
          </Grid>
        )}
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.score && formik.errors.score)}
            disabled={true}
          >
            <InputLabel htmlFor="score-input">
              {t("form.createchallengegame.score")}
            </InputLabel>
            <OutlinedInput
              id="score-input"
              type="number"
              value={formik.values.score}
              name="score"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createchallengegame.score")}
              inputProps={{}}
            />
            {formik.touched.score && formik.errors.score && (
              <FormHelperText error id="error-score">
                {formik.errors.score}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.time && formik.errors.time)}
          >
            <InputLabel htmlFor="time-input">
              {t("form.createchallengegame.time")}
            </InputLabel>
            <OutlinedInput
              id="time-input"
              type="number"
              value={formik.values.time}
              name="time"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createchallengegame.time")}
              inputProps={{}}
            />
            {formik.touched.time && formik.errors.time && (
              <FormHelperText error id="error-time">
                {formik.errors.time}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {formik.values.questions.map((question) => {
          const response: Response = {
            response: question.response,
            result: question.resultPlayer1 ?? false,
            responsePlayer1: question.responsePlayer1,
          };
          return (
            <Grid item xs={12} key={question.id}>
              <QuestionResponseEditBlock
                responseplayer1={question.responsePlayer1}
                response={response}
                question={question}
                onSubmit={(value) => changeResponse(question, value)}
              />
            </Grid>
          );
        })}
        <Grid item xs={12}>
          <ButtonColor
            value={Colors.blue}
            label={t("commun.save")}
            icon={SaveIcon}
            variant="contained"
            type="submit"
          />
        </Grid>
      </Grid>
    </form>
  );
};
