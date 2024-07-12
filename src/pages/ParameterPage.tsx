import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseInput } from "src/component/Input";
import { useAuth } from "src/context/AuthProviderSupabase";

import DoneIcon from "@mui/icons-material/Done";
import { Helmet } from "react-helmet-async";
import { updateSelectProfil } from "src/api/profile";
import { updateUser } from "src/api/user";
import { useMessage } from "src/context/MessageProvider";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { ButtonColor } from "src/component/Button";
import { HeadTitle } from "src/component/HeadTitle";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";

export default function ParameterPage() {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const { user, profile, setProfile, deleteAccount } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
    }
  }, [profile]);

  const changeUsername = async () => {
    if (user) {
      const newProfil = { id: user.id, username };
      const { data, error } = await updateSelectProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateusernamesuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
    }
  }, [user]);

  const changeEmail = async () => {
    if (user) {
      const newUser = { email };
      const { error } = await updateUser(newUser);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateemailsuccess"));
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("commun.myparameters")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h4">{t("commun.username")}</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <BaseInput
                    value={username}
                    clear={() => setUsername("")}
                    onChange={(value) => setUsername(value)}
                  />
                </Grid>
                {profile && profile.username !== username && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<DoneIcon />}
                      fullWidth
                      onClick={() => changeUsername()}
                      size="small"
                    >
                      {t("commun.validate")}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h4">{t("commun.email")}</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <BaseInput
                    value={email}
                    clear={() => setEmail(user ? user.email ?? "" : "")}
                    onChange={(value) => {
                      setEmail(value);
                    }}
                  />
                </Grid>
                {user && user.email !== email && (
                  <>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        startIcon={<DoneIcon />}
                        fullWidth
                        onClick={() => changeEmail()}
                        size="small"
                      >
                        {t("commun.validate")}
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="info">
                        {t("pages.parameters.infoemail")}
                      </Alert>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ButtonColor
                value={Colors.red}
                label={t("commun.deleteaccount")}
                icon={RemoveCircleIcon}
                variant="contained"
                onClick={() => setOpenModal(true)}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <ConfirmDialog
        title={t("commun.deleteaccount")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={deleteAccount}
        text={t("commun.deleteaccountmessage")}
      />
    </Grid>
  );
}
