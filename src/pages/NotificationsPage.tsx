import { Alert, Box, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  selectNotificationsByProfilePaginate,
  updateReadNotifications,
} from "src/api/notification";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { NotificationBlock } from "src/component/notification/NotificationBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Notification } from "src/models/Notification";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  const [notifications, setNotifications] = useState<Array<Notification>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const getNotifications = useCallback(
    (page: number) => {
      if (isLoading) return;
      const itemperpage = 10;
      if (profile && (page === 0 || !isEnd)) {
        setIsLoading(true);
        selectNotificationsByProfilePaginate(
          profile.id,
          page,
          itemperpage
        ).then(({ data }) => {
          const result = data !== null ? (data as Array<Notification>) : [];
          setNotifications((prev) =>
            page === 0 ? [...result] : [...prev, ...result]
          );
          setIsEnd(result.length < itemperpage);
          setIsLoading(false);
        });
      }
    },
    [isEnd, profile, isLoading]
  );

  useEffect(() => {
    setPage(0);
    setNotifications([]);
    setIsEnd(false);
    getNotifications(0);
  }, [profile]);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getNotifications(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [isLoading, isEnd, getNotifications]);

  const onDelete = (notification: Notification) => {
    setNotifications((prev) =>
      [...prev].filter((el) => el.id !== notification.id)
    );
  };

  useEffect(() => {
    const onReadNotification = () => {
      setTimeout(async () => {
        await updateReadNotifications();
      }, 2000);
    };
    onReadNotification();
  }, []);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <BarNavigation
          title={t("commun.notifications")}
          quit={() => navigate(-1)}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            {notifications.map((notification, index) => (
              <Grid
                item
                xs={12}
                key={notification.id}
                ref={index === notifications.length - 1 ? lastItemRef : null}
              >
                <NotificationBlock
                  notification={notification}
                  onDelete={onDelete}
                />
              </Grid>
            ))}
            {!isLoading && notifications.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  <Typography>{t("alert.noresultnotification")}</Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
