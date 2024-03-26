import { Alert, Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseInput } from "src/component/Input";
import { useAuth } from "src/context/AuthProviderSupabase";

import DoneIcon from "@mui/icons-material/Done";
import { Helmet } from "react-helmet-async";
import { updateProfil } from "src/api/profile";
import { updateUser } from "src/api/user";
import { AvatarSelector } from "src/component/avatar/AvatarSelector";
import { useMessage } from "src/context/MessageProvider";
import { Profile } from "src/models/Profile";
import { GoHomeButton } from "src/component/navigation/GoBackButton";

export const ParameterPage = () => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const { user, profile, setProfile } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
    }
  }, [profile]);

  const changeUsername = async () => {
    if (user) {
      const newProfil = { id: user.id, username };
      const { data, error } = await updateProfil(newProfil);
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

  useEffect(() => {
    if (profile) {
      setAvatar(profile.avatar);
    }
  }, [profile]);

  const changeAvatar = async (value: string | null) => {
    if (user) {
      const newProfil = { id: user.id, avatar: value };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateavatarsuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Box>
      <GoHomeButton />
      <Paper sx={{ p: 2 }}>
        <Helmet>
          <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h1" sx={{ fontSize: 30 }}>
              {t("commun.myparameters")}
            </Typography>
          </Grid>
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
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h4">{t("commun.avatar")}</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <AvatarSelector selected={avatar} onSelect={changeAvatar} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
