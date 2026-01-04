import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";

import { useMemo } from "react";
import { Notification } from "src/models/Notification";
import { NotificationDuration } from "./NotificationDuration";
import { IsReadNotificationBlock } from "./IsReadNotificationBlock";

interface Props {
  notification: Notification;
  onDelete: (notification: Notification) => void;
}

interface NotificationData {
  title: string;
  text: string;
}

export const OtherNotificationBlock = ({ notification }: Props) => {
  const data = useMemo(
    () => notification.data as NotificationData,
    [notification]
  );

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
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IsReadNotificationBlock isRead={notification.isread} />
            <Typography variant="h6">{data.title}</Typography>
          </Box>
          <NotificationDuration date={notification.created_at} />
        </Grid>
        <Grid size={12}>
          <Typography>{data.text}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
