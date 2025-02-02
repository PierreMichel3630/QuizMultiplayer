import { Alert, Button, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { BaseInput } from "../Input";

import DoneIcon from "@mui/icons-material/Done";
import { updateUser } from "src/api/user";

export const EmailInput = () => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const { user } = useAuth();

  const [email, setEmail] = useState("");

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

  const isModified = useMemo(() => user && user.email !== email, [email, user]);

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={4}>
        <Typography variant="h4">{t("commun.email")}</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <BaseInput
          value={email}
          clear={() => setEmail(user ? user.email ?? "" : "")}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          size="small"
          fullWidth
          sx={{ m: 0 }}
        />
      </Grid>
      {isModified && (
        <>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<DoneIcon />}
              fullWidth
              onClick={() => changeEmail()}
              size="small"
              color="secondary"
            >
              {t("commun.validate")}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">{t("pages.parameters.infoemail")}</Alert>
          </Grid>
        </>
      )}
    </Grid>
  );
};
