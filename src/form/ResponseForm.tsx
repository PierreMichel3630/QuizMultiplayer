import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { insertResponse, updateResponse } from "src/api/response";
import { ButtonColor } from "src/component/Button";
import { useMessage } from "src/context/MessageProvider";
import { ResponseInsert, ResponseUpdate } from "src/models/Response";
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
        <Grid item xs={12}>
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
