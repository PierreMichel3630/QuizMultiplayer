import SendIcon from "@mui/icons-material/Send";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { insertNotification } from "src/api/notification";
import { ButtonColor } from "src/component/Button";
import { SelectProfileModal } from "src/component/modal/SelectProfileModal";
import { NotificationBlock } from "src/component/notification/NotificationBlock";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { useMessage } from "src/context/MessageProvider";
import { NotificationType } from "src/models/enum/NotificationType";
import { NotificationInsert } from "src/models/Notification";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import * as Yup from "yup";

export const NotificationForm = () => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const [openModalPlayer, setOpenModalPlayer] = useState(false);

  const initialValue: {
    type: NotificationType;
    profile?: Profile;
    version: string;
    title: string;
    text: string;
  } = {
    type: NotificationType.other,
    version: "",
    title: "",
    text: "",
  };

  const validationSchema = Yup.object().shape({
    type: Yup.mixed<NotificationType>().required(),
    profile: Yup.object().when("type", {
      is: NotificationType.other,
      then: (schema) =>
        schema.required(t("form.createnotification.profilerequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    title: Yup.string().when("type", {
      is: NotificationType.other,
      then: (schema) =>
        schema.required(t("form.createnotification.titlerequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    text: Yup.string().when("type", {
      is: NotificationType.other,
      then: (schema) =>
        schema.required(t("form.createnotification.textrequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.type === NotificationType.other) {
          const notification: NotificationInsert = {
            type: values.type,
            profile: values.profile!.id,
            data: {
              title: values.title,
              text: values.text,
            },
          };
          const { error } = await insertNotification(notification);
          if (error) throw error;
        }
      } catch (err) {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid size={12}>
            <FormControl
              fullWidth
              error={Boolean(formik.touched.type && formik.errors.type)}
            >
              <InputLabel id="type-label">
                {t("form.createnotification.type")}
              </InputLabel>
              <Select
                labelId="type-label"
                id="type-input"
                value={formik.values.type}
                label={t("form.createnotification.type")}
                onChange={(event) =>
                  formik.setFieldValue("type", event.target.value)
                }
              >
                <MenuItem value={NotificationType.other}>Autre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formik.values.type === NotificationType.other && (
            <>
              <Grid size={12}>
                <SelectorProfileBlock
                  label={t("commun.selectplayer")}
                  profile={formik.values.profile}
                  onDelete={() => formik.setFieldValue("profile", undefined)}
                  onChange={() => setOpenModalPlayer(true)}
                />
                {formik.touched.profile && formik.errors.profile && (
                  <FormHelperText error id="error-profile">
                    {formik.errors.profile}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <FormControl
                  fullWidth
                  error={Boolean(formik.touched.title && formik.errors.title)}
                >
                  <InputLabel htmlFor="title-input">
                    {t("form.createnotification.title")}
                  </InputLabel>
                  <OutlinedInput
                    id="title-input"
                    value={formik.values.title}
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    label={t("form.createnotification.title")}
                    inputProps={{}}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <FormHelperText error id="error-title">
                      {formik.errors.title}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={12}>
                <FormControl
                  fullWidth
                  error={Boolean(formik.touched.text && formik.errors.text)}
                >
                  <InputLabel htmlFor="text-input">
                    {t("form.createnotification.text")}
                  </InputLabel>
                  <OutlinedInput
                    id="text-input"
                    value={formik.values.text}
                    name="text"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    label={t("form.createnotification.text")}
                    inputProps={{}}
                  />
                  {formik.touched.text && formik.errors.text && (
                    <FormHelperText error id="error-text">
                      {formik.errors.text}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <NotificationBlock
              notification={{
                id: 0,
                profile: "",
                type: formik.values.type,
                data: {
                  version: formik.values.version,
                  title: formik.values.title,
                  text: formik.values.text,
                },
                created_at: new Date(),
                isread: false,
              }}
            />
          </Grid>
          <Grid size={12}>
            <ButtonColor
              value={Colors.green}
              label={t("commun.send")}
              icon={SendIcon}
              variant="contained"
              type="submit"
            />
          </Grid>
        </Grid>
        <SelectProfileModal
          open={openModalPlayer}
          close={() => setOpenModalPlayer(false)}
          onValid={(profile) => {
            formik.setFieldValue("profile", profile);
            setOpenModalPlayer(false);
          }}
        />
      </form>
    </FormikProvider>
  );
};
