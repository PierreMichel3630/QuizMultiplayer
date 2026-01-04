import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";

import NewspaperIcon from "@mui/icons-material/Newspaper";
import { useMemo } from "react";
import { Notification } from "src/models/Notification";
import { ButtonColor } from "../Button";
import { UpdateAppButton } from "../button/UpdateAppButton";
import { IsReadNotificationBlock } from "./IsReadNotificationBlock";
import { NotificationDuration } from "./NotificationDuration";

interface Props {
  notification: Notification;
}

interface NotificationData {
  version: string;
}

export const UpdateAppNotificationBlock = ({ notification }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const data = useMemo(
    () => notification.data as NotificationData,
    [notification]
  );

  const seeNews = () => {
    navigate("/news");
  };

  return (
    <Paper
      sx={{
        zIndex: 1500,
        p: px(5),
        width: percent(100),
      }}
      elevation={8}
    >
      <Grid container spacing={1}>
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <IsReadNotificationBlock isRead={notification.isread} />
                <Typography variant="h6" textAlign="center">
                  {t("commun.newversionavailable", {
                    version: data.version,
                  })}
                </Typography>
              </Box>
              <Box>
                <NotificationDuration date={notification.created_at} />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid size={12}>
          <ButtonColor
            typography="h6"
            iconSize={20}
            value={Colors.grey}
            label={t("commun.seenews")}
            icon={NewspaperIcon}
            variant="contained"
            onClick={seeNews}
          />
        </Grid>
        <Grid size={12}>
          <UpdateAppButton />
        </Grid>
      </Grid>
    </Paper>
  );
};
