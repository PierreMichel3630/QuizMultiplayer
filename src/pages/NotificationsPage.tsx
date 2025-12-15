import { Alert, Box, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectNotificationsByProfilePaginate } from "src/api/notification";
import { NotificationBlock } from "src/component/notification/NotificationBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Notification } from "src/models/Notification";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();

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

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h2">{t("commun.notifications")}</Typography>
            </Grid>
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
