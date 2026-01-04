import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useEffect, useMemo, useState } from "react";
import {
  selectAccomplishmentById,
  unlockAccomplishment,
} from "src/api/accomplishment";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useNotification } from "src/context/NotificationProvider";
import { Accomplishment } from "src/models/Accomplishment";
import { Notification } from "src/models/Notification";
import { ButtonColor } from "../Button";
import { AddMoneyBlock } from "../MoneyBlock";
import { AddXpBlock } from "../XpBlock";
import { TextNameBlock } from "../language/TextLanguageBlock";

interface Props {
  notification: Notification;
  onDelete?: (notification: Notification) => void;
}

interface NotificationData {
  id: number;
  accomplishment: number;
  extra?: string;
}

export const AccomplishmentNotificationBlock = ({
  notification,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  const { refreshProfil } = useAuth();
  const { getNotifications } = useNotification();
  const { getMyAccomplishments } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [accomplishment, setAccomplishment] = useState<
    undefined | Accomplishment
  >(undefined);

  const data = useMemo(
    () => notification.data as NotificationData,
    [notification]
  );

  useEffect(() => {
    if (data.accomplishment) {
      selectAccomplishmentById(data.accomplishment).then(({ data }) => {
        setAccomplishment(data as Accomplishment);
      });
    }
  }, [data]);

  const unlock = async () => {
    unlockAccomplishment(data.id).then((res) => {
      if (res.data === true) {
        if (onDelete) {
          onDelete(notification);
        }
        getMyAccomplishments();
        refreshProfil();
        getNotifications();
      } else {
        setSeverity("error");
        setMessage(t("commun.error"));
      }
    });
  };

  return (
    accomplishment && (
      <Paper
        elevation={12}
        sx={{
          p: 1,
          backgroundColor: "initial",
          color: "text.primary",
          border: `3px solid ${Colors.purple}`,
          height: percent(100),
        }}
      >
        <Grid
          container
          spacing={1}
          alignItems="center"
          sx={{ height: percent(100) }}
        >
          <Grid item xs={12}>
            <TextNameBlock
              variant="h4"
              values={accomplishment.accomplishmenttranslation}
            />
          </Grid>
          {data.extra && (
            <Grid item xs={12}>
              <Typography variant="caption">{data.extra}</Typography>
            </Grid>
          )}
          {accomplishment.badge && (
            <Grid item>
              <Link to={`/personalized#badges`}>
                <img
                  alt="badge"
                  src={accomplishment.badge.icon}
                  width={40}
                  loading="lazy"
                />
              </Link>
            </Grid>
          )}
          <Grid item xs={accomplishment.value ? 7 : 12}>
            <Grid container spacing={1} alignItems="center">
              {accomplishment.title && (
                <Grid item xs={12}>
                  <Typography variant="body1" component="span">
                    {`${t("commun.title")} "`}
                  </Typography>
                  <Link
                    to={`/personalized#titles`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <TextNameBlock
                      component="span"
                      variant="caption"
                      values={accomplishment.title.titletranslation}
                    />
                  </Link>
                  <Typography variant="body1" component="span">
                    {`"`}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: px(10),
                  }}
                >
                  {accomplishment.xp > 0 && (
                    <AddXpBlock
                      xp={accomplishment.xp}
                      variant="h4"
                      color={"text.primary"}
                    />
                  )}
                  {accomplishment.gold > 0 && (
                    <AddMoneyBlock
                      money={accomplishment.gold}
                      variant="h4"
                      color={"text.primary"}
                      width={18}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ButtonColor
              typography="h6"
              iconSize={20}
              value={Colors.purple}
              label={t("commun.unlock")}
              icon={LockOpenIcon}
              variant="contained"
              onClick={unlock}
            />
          </Grid>
        </Grid>
      </Paper>
    )
  );
};
