import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { px } from "csx";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
  insertResponse,
  insertResponseImage,
  updateResponse,
  updateResponseImage,
} from "src/api/response";
import { ButtonColor } from "src/component/Button";
import { ImageQuestionBlock } from "src/component/ImageBlock";
import { useMessage } from "src/context/MessageProvider";
import {
  ResponseImageInsert,
  ResponseImageUpdate,
  ResponseInsert,
  ResponseUpdate,
} from "src/models/Response";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

interface Props {
  type: string;
  response: ResponseUpdate | undefined;
  validate: () => void;
}

export const ResponseForm = ({ validate, response, type }: Props) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    value: string;
  } = {
    value: response ? response.value["fr-FR"] : "",
  };

  const validationSchema = Yup.object().shape({
    value: Yup.string().required(t("form.createresponse.requiredvalue")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newValue = {
          id: response ? response.id : undefined,
          type: type,
          usvalue: values.value,
          value: {
            "fr-FR": values.value,
          },
        };

        const { error } = response
          ? await updateResponse(newValue as ResponseUpdate)
          : await insertResponse(newValue as ResponseInsert);
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          validate();
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.value && formik.errors.value)}
          >
            <InputLabel htmlFor="value-input">
              {t("form.createresponse.value")}
            </InputLabel>
            <OutlinedInput
              id="value-input"
              type="text"
              value={formik.values.value}
              name="value"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createresponse.value")}
              inputProps={{}}
            />
            {formik.touched.value && formik.errors.value && (
              <FormHelperText error id="error-value">
                {formik.errors.value}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={12}>
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

interface PropsImage {
  type: string;
  response: ResponseImageUpdate | undefined;
  validate: () => void;
}

export const ResponseImageForm = ({ validate, response, type }: PropsImage) => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const initialValue: {
    response: string;
    image: string;
  } = {
    response: response ? response.response["fr-FR"] : "",
    image: response ? response.image : "",
  };

  const validationSchema = Yup.object().shape({
    response: Yup.string().required(t("form.createresponse.requiredvalue")),
    image: Yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const newValue = {
          id: response ? response.id : undefined,
          type: type,
          usvalue: values.response,
          response: {
            "fr-FR": values.response,
          },
          image: values.image,
        };

        const { error } = response
          ? await updateResponseImage(newValue as ResponseImageUpdate)
          : await insertResponseImage(newValue as ResponseImageInsert);
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          validate();
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid size={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.response && formik.errors.response)}
          >
            <InputLabel htmlFor="response-input">
              {t("form.createresponse.value")}
            </InputLabel>
            <OutlinedInput
              id="response-input"
              type="text"
              value={formik.values.response}
              name="response"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createresponse.value")}
              inputProps={{}}
            />
            {formik.touched.response && formik.errors.response && (
              <FormHelperText error id="error-response">
                {formik.errors.response}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.image && formik.errors.image)}
          >
            <InputLabel htmlFor="value-input">
              {t("form.createresponse.image")}
            </InputLabel>
            <OutlinedInput
              id="image-input"
              type="text"
              value={formik.values.image}
              name="image"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createresponse.image")}
              inputProps={{}}
            />
            {formik.touched.image && formik.errors.image && (
              <FormHelperText error id="error-image">
                {formik.errors.image}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {formik.values.image !== "" && (
          <Grid sx={{ height: px(200) }}>
            <ImageQuestionBlock src={formik.values.image} />
          </Grid>
        )}
        <Grid size={12}>
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
