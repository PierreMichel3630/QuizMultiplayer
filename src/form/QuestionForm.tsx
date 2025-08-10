import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { px } from "csx";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { ImageQuestionBlock } from "src/component/ImageBlock";
import { SelectDifficulty } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { Difficulty } from "src/models/enum/DifficultyEnum";
import { QuestionAdmin } from "src/models/Question";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  question?: QuestionAdmin;
  validate: () => void;
}

export const QuestionForm = ({ question, validate }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    typequestion: string;
    difficulty: string;
    image: undefined | string;
    isqcm: boolean | null;
  } = {
    typequestion: question ? question.typequestion : "DEFAULT",
    difficulty: question ? question.difficulty : "FACILE",
    image: question?.image ? question.image : undefined,
    isqcm: question ? question.isqcm : true,
  };

  const validationSchema = Yup.object().shape({
    typeResponse: Yup.string().nullable(),
    question: Yup.string().required(
      t("form.createquestion.requiredquestionfr")
    ),
    response: Yup.array()
      .of(Yup.string())
      .min(1, t("form.createquestion.requiredresponsefr")),
    difficulty: Yup.string(),
    image: Yup.mixed().nullable(),
    theme: Yup.mixed().nullable(),
    extra: Yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
        validate();
      } catch (err) {
        console.error(err);
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="select-typequestion-label">
              {t("form.createquestion.typequestion")}
            </InputLabel>
            <Select
              labelId="select-typequestion-label"
              id="select-typequestion"
              value={formik.values.typequestion}
              name="typequestion"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            >
              <MenuItem value="DEFAULT">DEFAULT</MenuItem>
              <MenuItem value="QCM">QCM</MenuItem>
              <MenuItem value="ORDER">ORDER</MenuItem>
              <MenuItem value="IMAGE">IMAGE</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel id="radio-isqcm-label" color="error">
              {t("form.createquestion.isqcm")}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="radio-isqcm-label"
              name="isqcm"
              value={formik.values.isqcm}
              onChange={formik.handleChange}
            >
              <FormControlLabel value={null} control={<Radio />} label="NULL" />
              <FormControlLabel value={true} control={<Radio />} label="TRUE" />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="FALSE"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.difficulty && formik.errors.difficulty
            )}
          >
            <SelectDifficulty
              value={formik.values.difficulty as Difficulty}
              onSelect={(value) => formik.setFieldValue("difficulty", value)}
            />
            <FormHelperText error id={`error-difficulty`}>
              {formik.errors.difficulty}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.image && formik.errors.image)}
          >
            <InputLabel htmlFor="image-input">
              {t("form.createquestion.image")}
            </InputLabel>
            <OutlinedInput
              id="image-input"
              type="text"
              value={formik.values.image}
              name="image"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createquestion.image")}
              inputProps={{}}
            />
            {formik.touched.image && formik.errors.image && (
              <FormHelperText error id="error-image">
                {formik.errors.image}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {formik.values.image && formik.values.image !== "" && (
          <Grid item xs={12} sx={{ height: px(200) }}>
            <ImageQuestionBlock src={formik.values.image} />
          </Grid>
        )}

        <Grid item xs={12}>
          <ButtonColor
            value={Colors.green}
            label={t("commun.validate")}
            variant="contained"
            type="submit"
          />
        </Grid>
      </Grid>
    </form>
  );
};
