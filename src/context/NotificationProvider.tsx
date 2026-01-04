import { RealtimeChannel } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { selectNotificationsNotRead } from "src/api/notification";
import { supabase } from "src/api/supabase";
import { Notification } from "src/models/Notification";
import { useAuth } from "./AuthProviderSupabase";
import { NotificationType } from "src/models/enum/NotificationType";
import { useRegisterSW } from "virtual:pwa-register/react";
import { VERSION_APP } from "src/utils/config";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const NotificationContext = createContext<{
  notifications: Array<Notification>;
  notificationUpdate?: Notification;
  getNotifications: () => void;
}>({
  notifications: [],
  notificationUpdate: undefined,
  getNotifications: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: Props) => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
  } = useRegisterSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    },
  });

  const notificationUpdate = useMemo(() => {
    let result: Notification | undefined = undefined;
    if (!isLoading) {
      const notif = [...notifications].find(
        (el) => el.type === NotificationType.update_app
      );
      result = notif
        ? notif
        : needRefresh
        ? {
            id: 0,
            profile: "",
            type: NotificationType.update_app,
            data: { version: VERSION_APP },
            isread: false,
            created_at: new Date(),
          }
        : undefined;
    }
    return result;
  }, [isLoading, notifications, needRefresh]);

  const getNotifications = useCallback(() => {
    setIsLoading(true);
    if (user) {
      selectNotificationsNotRead(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<Notification>) : [];
        setNotifications(res);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let channel: RealtimeChannel | undefined = undefined;
    if (user?.id) {
      const id = user.id;
      getNotifications();
      channel = supabase
        .channel("notification")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notification",
            filter: `profile=eq.${id}`,
          },
          (payload) => {
            const notification = payload.new as Notification;
            setNotifications((prev) => [...prev, notification]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "notification",
          },
          (payload) => {
            const notification = payload.old as Notification;
            setNotifications((prev) => {
              return [...prev].filter((el) => el.id !== notification.id);
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notification",
            filter: `profile=eq.${id}`,
          },
          (payload) => {
            const notification = payload.new as Notification;
            setNotifications((prev) =>
              [...prev].map((el) =>
                el.id === notification.id ? notification : el
              )
            );
          }
        )
        .subscribe();
    }
    return () => {
      channel?.unsubscribe();
    };
  }, [getNotifications, user]);

  const notificationDisplay = useMemo(() => {
    const enumValues = Object.values(NotificationType);

    return [...notifications].filter((notification) =>
      enumValues.includes(notification.type)
    );
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications: notificationDisplay,
      getNotifications,
      notificationUpdate,
    }),
    [notificationDisplay, getNotifications, notificationUpdate]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
