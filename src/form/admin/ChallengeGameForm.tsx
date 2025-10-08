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
import { AnswerUser, Response } from "src/component/question/ResponseBlock";
import { useMessage } from "src/context/MessageProvider";
import { ChallengeGame, ChallengeGameUpdate } from "src/models/Challenge";
import { QuestionResult } from "src/models/Question";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

import SaveIcon from "@mui/icons-material/Save";
import { updateChallengeGame } from "src/api/challenge";
import { verifyResponse } from "src/utils/response";

interface Props {
  game?: ChallengeGame;
  validate: () => void;
}

export const ChallengeGameForm = ({ game, validate }: Props) => {
  const { t } = useTranslation();
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
        : game.challenge.questionsv2
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
        if (game === undefined) throw new Error("No game Found");
        const newGameChallenge: ChallengeGameUpdate = {
          id: game.id,
          questions: values.questions,
          score: values.score,
          time: values.time,
        };
        const { error } = await updateChallengeGame(newGameChallenge);

        if (error) throw error;
        validate();
      } catch (err) {
        console.error(err);
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  const changeResponse = (question: QuestionResult, value: AnswerUser) => {
    const index = formik.values.questions.findIndex(
      (el) => el.id === question.id
    );
    const newQuestions = [...formik.values.questions];
    const result = verifyResponse(question, value);
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
            answer: question.response,
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
