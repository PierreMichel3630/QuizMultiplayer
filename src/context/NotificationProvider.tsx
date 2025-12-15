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

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const NotificationContext = createContext<{
  notifications: Array<Notification>;
  getNotifications: () => void;
}>({
  notifications: [],
  getNotifications: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: Props) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  const getNotifications = useCallback(() => {
    if (user) {
      selectNotificationsNotRead(user.id).then(({ data }) => {
        const res = data !== null ? (data as Array<Notification>) : [];
        setNotifications(res);
      });
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
            setNotifications((prev) => [...prev, payload.new as Notification]);
          }
        )
        .subscribe();
    }
    return () => {
      channel?.unsubscribe();
    };
  }, [getNotifications, user]);

  const value = useMemo(
    () => ({
      notifications,
      getNotifications,
    }),
    [notifications, getNotifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
